import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mocks = vi.hoisted(() => {
  const listeners = new Map();
  return {
    listeners,
    dispatch: vi.fn((action) => action?.type === 'upload' ? { unwrap: () => Promise.resolve('https://images.test/photo.jpg') } : action),
    socket: {
      on: vi.fn((event, handler) => listeners.set(event, handler)),
      off: vi.fn((event) => listeners.delete(event)),
      emit: vi.fn(),
    },
  };
});

vi.mock('@/store/hooks', () => ({
  useAppDispatch: () => mocks.dispatch,
  useAppSelector: (selector) => selector({
    chat: { messages: [], loading: false },
    auth: { user: { _id: 'worker-id', email: 'worker@example.test' } },
  }),
}));
vi.mock('@/context/SocketContext', () => ({ useSocket: () => mocks.socket }));
vi.mock('@/store/slices/chatSlice', () => ({
  fetchChatHistory: (conversationId) => ({ type: 'history', conversationId }),
  addSocketMessage: (message) => ({ type: 'message', message }),
  uploadChatImage: (file) => ({ type: 'upload', file }),
  clearChat: () => ({ type: 'clear' }),
}));

import ChatInterface from './ChatInterface';

class FakePeerConnection {
  static instances = [];

  constructor() {
    this.connectionState = 'new';
    this.addTrack = vi.fn();
    this.addIceCandidate = vi.fn().mockResolvedValue(undefined);
    this.close = vi.fn();
    FakePeerConnection.instances.push(this);
  }

  createOffer = vi.fn().mockResolvedValue({ type: 'offer', sdp: 'fake-offer' });
  createAnswer = vi.fn().mockResolvedValue({ type: 'answer', sdp: 'fake-answer' });
  setLocalDescription = vi.fn(async (description) => { this.localDescription = description; });
  setRemoteDescription = vi.fn(async (description) => { this.remoteDescription = description; });
}

const makeStream = () => {
  const tracks = [
    { kind: 'audio', enabled: true, stop: vi.fn() },
    { kind: 'video', enabled: true, stop: vi.fn() },
  ];
  return {
    tracks,
    getTracks: () => tracks,
    getAudioTracks: () => tracks.filter((track) => track.kind === 'audio'),
    getVideoTracks: () => tracks.filter((track) => track.kind === 'video'),
  };
};

const project = {
  title: 'Call test job',
  participant: { _id: 'customer-id', fullName: 'Customer' },
};

const renderChat = () => render(
  <ChatInterface conversationId="job_test" otherUserEmail="customer@example.test" project={project} userRole="provider" />,
);

describe('chat audio/video calling', () => {
  let mediaStream;

  beforeEach(() => {
    mocks.listeners.clear();
    mocks.dispatch.mockClear();
    mocks.socket.on.mockClear();
    mocks.socket.off.mockClear();
    mocks.socket.emit.mockReset();
    mocks.socket.emit.mockImplementation((event, _payload, acknowledgement) => {
      if (event === 'send-message') acknowledgement?.({ status: 'ok' });
    });
    FakePeerConnection.instances = [];
    mediaStream = makeStream();
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue(mediaStream) },
    });
    globalThis.RTCPeerConnection = FakePeerConnection;
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => cleanup());

  it('starts an audio call, accepts signaling, relays ICE, and hangs up', async () => {
    const user = userEvent.setup();
    renderChat();

    await user.click(screen.getByRole('button', { name: 'Start audio call' }));
    await waitFor(() => expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true, video: false }));
    await waitFor(() => expect(mocks.socket.emit).toHaveBeenCalledWith('call-initiate', expect.objectContaining({ conversationId: 'job_test', callType: 'audio', offer: { type: 'offer', sdp: 'fake-offer' } })));

    const peer = FakePeerConnection.instances[0];
    const callId = mocks.socket.emit.mock.calls.find(([event]) => event === 'call-initiate')[1].callId;
    await act(async () => mocks.listeners.get('call-answered')({ conversationId: 'job_test', callId, answer: { type: 'answer', sdp: 'remote-answer' } }));
    await waitFor(() => expect(peer.setRemoteDescription).toHaveBeenCalledWith({ type: 'answer', sdp: 'remote-answer' }));

    await act(async () => peer.onicecandidate({ candidate: { candidate: 'fake-ice' } }));
    expect(mocks.socket.emit).toHaveBeenCalledWith('call-ice-candidate', expect.objectContaining({ conversationId: 'job_test', candidate: { candidate: 'fake-ice' } }));

    await user.click(screen.getByRole('button', { name: 'End call' }));
    expect(mocks.socket.emit).toHaveBeenCalledWith('call-end', expect.objectContaining({ conversationId: 'job_test' }));
    expect(peer.close).toHaveBeenCalled();
    expect(mediaStream.tracks.every((track) => track.stop.mock.calls.length > 0)).toBe(true);
  });

  it('answers an incoming video call and applies queued ICE candidates', async () => {
    const user = userEvent.setup();
    renderChat();

    await act(async () => {
      mocks.listeners.get('call-incoming')({
        conversationId: 'job_test',
        callId: 'incoming-call',
        callType: 'video',
        offer: { type: 'offer', sdp: 'incoming-offer' },
        caller: { name: 'Customer' },
      });
    });
    await act(async () => {
      mocks.listeners.get('call-ice-candidate')({ conversationId: 'job_test', callId: 'incoming-call', candidate: { candidate: 'queued-ice' } });
    });

    await user.click(screen.getByRole('button', { name: 'Answer call' }));
    await waitFor(() => expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true, video: true }));
    await waitFor(() => expect(mocks.socket.emit).toHaveBeenCalledWith('call-answer', expect.objectContaining({ conversationId: 'job_test', callId: 'incoming-call', answer: { type: 'answer', sdp: 'fake-answer' } })));

    const peer = FakePeerConnection.instances[0];
    expect(peer.setRemoteDescription).toHaveBeenCalledWith({ type: 'offer', sdp: 'incoming-offer' });
    expect(peer.addIceCandidate).toHaveBeenCalledWith({ candidate: 'queued-ice' });

    await user.click(screen.getByRole('button', { name: 'End call' }));
    expect(mocks.socket.emit).toHaveBeenCalledWith('call-end', expect.objectContaining({ conversationId: 'job_test', callId: 'incoming-call' }));
  });

  it('declines an incoming audio call', async () => {
    const user = userEvent.setup();
    renderChat();
    await act(async () => mocks.listeners.get('call-incoming')({ conversationId: 'job_test', callId: 'decline-me', callType: 'audio', offer: { type: 'offer', sdp: 'offer' }, caller: { name: 'Customer' } }));
    await user.click(screen.getByRole('button', { name: 'Decline call' }));
    expect(mocks.socket.emit).toHaveBeenCalledWith('call-decline', { conversationId: 'job_test', callId: 'decline-me' });
    expect(navigator.mediaDevices.getUserMedia).not.toHaveBeenCalled();
  });

  it('toggles the microphone and camera tracks during a video call', async () => {
    const user = userEvent.setup();
    renderChat();

    await user.click(screen.getByRole('button', { name: 'Start video call' }));
    await waitFor(() => expect(mocks.socket.emit).toHaveBeenCalledWith('call-initiate', expect.objectContaining({ callType: 'video' })));
    await user.click(screen.getByRole('button', { name: 'Mute microphone' }));
    await user.click(screen.getByRole('button', { name: 'Turn camera off' }));

    expect(mediaStream.getAudioTracks()[0].enabled).toBe(false);
    expect(mediaStream.getVideoTracks()[0].enabled).toBe(false);
    expect(screen.getByRole('button', { name: 'Unmute microphone' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Turn camera on' })).toBeTruthy();
  });

  it('shows a clear error when the browser denies camera or microphone access', async () => {
    const user = userEvent.setup();
    navigator.mediaDevices.getUserMedia.mockRejectedValueOnce(Object.assign(new Error('Permission denied'), { name: 'NotAllowedError' }));
    renderChat();

    await user.click(screen.getByRole('button', { name: 'Start audio call' }));

    expect(await screen.findByText('Allow camera and microphone access to start a call.')).toBeTruthy();
    expect(FakePeerConnection.instances).toHaveLength(0);
    expect(mocks.socket.emit).not.toHaveBeenCalledWith('call-initiate', expect.anything());
  });
});
