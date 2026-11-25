import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HiOutlineMicrophone, HiOutlinePhone, HiOutlinePhoneMissedCall, HiOutlineVideoCamera, HiOutlineX, HiSwitchHorizontal, HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
import { useSocket } from '@/context/SocketContext';
import axiosInstance from '@/api/axiosInstance';
import Avatar from '@/components/ui/Avatar';
import { CallContext, useCallManager } from '@/context/CallManagerContext';
import { Capacitor, registerPlugin } from '@capacitor/core';

const initialState = { status: 'idle', call: null, callType: null, localStream: null, remoteStream: null, muted: false, cameraOff: false, speakerOff: false, minimized: false, duration: 0, error: '', permissionDenied: false };
const NativeCallService = registerPlugin('CallForegroundService');

const requestMediaAccess = async (callType) => {
  if (Capacitor.isNativePlatform()) {
    const permission = await NativeCallService.requestMediaPermissions({ callType });
    if (!permission?.granted) {
      const error = new Error('media-permission-denied');
      error.name = 'NotAllowedError';
      throw error;
    }
  }
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('Media capture is unavailable in this browser.');
  return navigator.mediaDevices.getUserMedia({ audio: true, video: callType === 'video' ? { facingMode: 'user' } : false });
};

const setNativeCallActive = (call, active) => {
  if (!Capacitor.isNativePlatform()) return;
  const operation = active ? NativeCallService.start({
    callType: call?.callType || 'audio',
    participantName: call?.participant?.fullName || call?.caller?.name || 'SkillBridge contact',
  }) : NativeCallService.stop();
  void operation.catch(() => {});
};

const getIceServers = async () => {
  try {
    const { data } = await axiosInstance.get('/chat/calls/ice-servers');
    return data?.data?.iceServers?.length ? data.data.iceServers : [{ urls: 'stun:stun.l.google.com:19302' }];
  } catch {
    return [{ urls: 'stun:stun.l.google.com:19302' }];
  }
};

export const CallManagerProvider = ({ children }) => {
  const socket = useSocket();
  const [state, setState] = useState(initialState);
  const activeRef = useRef(null);
  const stateRef = useRef(state);
  const connectionTimer = useRef(null);
  const mountedRef = useRef(true);
  useEffect(() => { stateRef.current = state; }, [state]);

  const update = useCallback((next) => {
    if (mountedRef.current) setState((current) => ({ ...current, ...next }));
  }, []);

  const cleanup = useCallback(() => {
    window.clearTimeout(connectionTimer.current);
    const active = activeRef.current;
    activeRef.current = null;
    window.clearTimeout(active?.timeout);
    if (active) setNativeCallActive(active.call, false);
    active?.peer?.close();
    active?.stream?.getTracks().forEach((track) => track.stop());
    update(initialState);
  }, [update]);

  const emitForCall = useCallback((event, extra = {}) => {
    const call = activeRef.current?.call;
    if (call && socket?.connected) socket.emit(event, { conversationId: call.conversationId, callId: call.callId, ...extra });
  }, [socket]);

  const restartIce = useCallback(async () => {
    const active = activeRef.current;
    if (!active?.peer || !socket?.connected || active.restarting || active.status === 'incoming') return;
    active.restarting = true;
    try {
      active.peer.restartIce?.();
      const offer = await active.peer.createOffer({ iceRestart: true });
      await active.peer.setLocalDescription(offer);
      emitForCall('call-renegotiate', { description: active.peer.localDescription });
    } catch {
      update({ status: 'reconnecting' });
    } finally {
      active.restarting = false;
    }
  }, [emitForCall, socket, update]);

  const createPeer = useCallback(async (active) => {
    const peer = new RTCPeerConnection({ iceServers: await getIceServers(), iceCandidatePoolSize: 2 });
    active.peer = peer;
    peer.onicecandidate = ({ candidate }) => {
      if (candidate && activeRef.current === active && socket?.connected) socket.emit('call-ice-candidate', { conversationId: active.call.conversationId, callId: active.call.callId, candidate });
    };
    peer.ontrack = ({ streams, track }) => {
      if (activeRef.current !== active) return;
      let remote = streams?.[0];
      if (!remote) {
        remote = active.remote || new MediaStream();
        if (!remote.getTracks().some((item) => item.id === track.id)) remote.addTrack(track);
      }
      active.remote = remote;
      update({ remoteStream: remote });
    };
    peer.onconnectionstatechange = () => {
      if (activeRef.current !== active) return;
      if (peer.connectionState === 'connected') {
        window.clearTimeout(connectionTimer.current);
        active.startedAt ||= Date.now();
        update({ status: 'connected' });
      } else if (['disconnected', 'connecting'].includes(peer.connectionState)) {
        update({ status: 'reconnecting' });
        window.clearTimeout(connectionTimer.current);
        connectionTimer.current = window.setTimeout(() => {
          if (activeRef.current === active && peer.connectionState === 'disconnected') void restartIce();
        }, 3500);
      } else if (peer.connectionState === 'failed') {
        update({ status: 'reconnecting' });
        void restartIce();
        window.clearTimeout(connectionTimer.current);
        connectionTimer.current = window.setTimeout(() => {
          if (activeRef.current === active && peer.connectionState === 'failed') {
            update({ status: 'failed', error: 'Connection could not be restored. End the call and try again.' });
          }
        }, 20000);
      }
    };
    active.stream?.getTracks().forEach((track) => peer.addTrack(track, active.stream));
    return peer;
  }, [restartIce, socket, update]);

  const startCall = useCallback(async ({ type, callType = type, conversationId, participant }) => {
    if (activeRef.current) return;
    if (!socket?.connected || !conversationId || !participant?._id) {
      update({ error: !socket?.connected ? 'Call service is reconnecting. Please wait a moment and try again.' : 'Calls are unavailable because this conversation has no connected participant.' });
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      update({ error: 'This browser does not support camera and microphone calls.' });
      return;
    }
    const call = { conversationId, callId: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`, callType, participant };
    const active = { call, status: 'calling', candidates: [], startedAt: null };
    activeRef.current = active;
    update({ ...initialState, status: 'calling', call, callType, minimized: false });
    try {
      active.stream = await requestMediaAccess(callType);
      if (activeRef.current !== active) { active.stream.getTracks().forEach((track) => track.stop()); return; }
      setNativeCallActive(call, true);
      update({ localStream: active.stream });
      const peer = await createPeer(active);
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.timeout(8000).emit('call-initiate', { ...call, participant: undefined, offer: peer.localDescription }, (timeoutError, result) => {
        if (activeRef.current !== active) return;
        if (timeoutError || !result?.ok) {
          window.clearTimeout(active.timeout);
          cleanup();
          update({ error: result?.message || 'Could not reach the other person. Check their connection and try again.' });
        } else if (!result.delivered) {
          emitForCall('call-end', { reason: 'no-answer' });
          cleanup();
          update({ error: 'They are offline right now. Ask them to open SkillBridge, then try calling again.' });
        }
      });
      active.timeout = window.setTimeout(() => {
        if (activeRef.current === active && !active.startedAt) {
          emitForCall('call-end', { reason: 'no-answer' });
          cleanup();
          update({ error: 'No answer. You can try calling again.' });
        }
      }, 45000);
    } catch (error) {
      cleanup();
      update({ permissionDenied: error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError', error: error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError'
        ? (Capacitor.isNativePlatform() ? 'Camera or microphone permission is needed for this call. Allow it and try again.' : 'Allow camera and microphone access in your browser settings, then try again.')
        : 'Could not start your camera or microphone. Check that the devices are available.' });
    }
  }, [cleanup, createPeer, emitForCall, socket, update]);

  const answerCall = useCallback(async () => {
    const active = activeRef.current;
    if (!active || active.status !== 'incoming' || !navigator.mediaDevices?.getUserMedia) return;
    update({ status: 'connecting', error: '' });
    try {
      active.stream = await requestMediaAccess(active.call.callType);
      if (activeRef.current !== active) { active.stream.getTracks().forEach((track) => track.stop()); return; }
      setNativeCallActive(active.call, true);
      update({ localStream: active.stream });
      const peer = await createPeer(active);
      await peer.setRemoteDescription(active.call.offer);
      for (const candidate of active.candidates.splice(0)) await peer.addIceCandidate(candidate).catch(() => {});
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit('call-answer', { conversationId: active.call.conversationId, callId: active.call.callId, answer: peer.localDescription });
      active.status = 'connecting';
      active.timeout = window.setTimeout(() => {
        if (activeRef.current === active && !active.startedAt) update({ status: 'failed', error: 'The call did not connect. Check your connection or try again.' });
      }, 30000);
    } catch (error) {
      active.stream?.getTracks().forEach((track) => track.stop());
      active.stream = null;
      active.peer?.close();
      active.peer = null;
      update({ localStream: null, status: 'incoming', permissionDenied: error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError', error: error.name === 'NotAllowedError' ? (Capacitor.isNativePlatform() ? 'Allow camera and microphone permission, then tap Answer again.' : 'Allow camera and microphone access, then tap Answer again.') : 'Could not join the call. Check your camera and microphone.' });
    }
  }, [createPeer, socket, update]);

  const declineCall = useCallback(() => { emitForCall('call-decline'); cleanup(); }, [cleanup, emitForCall]);
  const endCall = useCallback(() => { emitForCall('call-end', { reason: 'hangup' }); cleanup(); }, [cleanup, emitForCall]);
  const toggleMute = useCallback(() => {
    const muted = !stateRef.current.muted;
    activeRef.current?.stream?.getAudioTracks().forEach((track) => { track.enabled = !muted; });
    update({ muted });
  }, [update]);
  const toggleCamera = useCallback(async () => {
    const active = activeRef.current;
    if (!active || active.call.callType !== 'video') return;
    let track = active.stream?.getVideoTracks()[0];
    if (!track && !stateRef.current.cameraOff) {
      try {
        const camera = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        track = camera.getVideoTracks()[0];
        if (!track) return;
        active.stream.addTrack(track);
        active.peer?.addTrack(track, active.stream);
      } catch { update({ error: 'Camera is unavailable. Check its permission and try again.' }); return; }
    }
    const cameraOff = !stateRef.current.cameraOff;
    if (track) track.enabled = !cameraOff;
    update({ cameraOff });
  }, [update]);
  const switchCamera = useCallback(async () => {
    const active = activeRef.current;
    if (!active || active.call.callType !== 'video' || !navigator.mediaDevices?.enumerateDevices) return;
    try {
      const cameras = (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === 'videoinput');
      if (cameras.length < 2) { update({ error: 'No other camera is available on this device.' }); return; }
      const current = active.stream?.getVideoTracks()[0]?.getSettings().deviceId;
      const next = cameras[(Math.max(0, cameras.findIndex((device) => device.deviceId === current)) + 1) % cameras.length];
      const replacementStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: next.deviceId } } });
      const replacement = replacementStream.getVideoTracks()[0];
      const old = active.stream.getVideoTracks()[0];
      const sender = active.peer?.getSenders().find((item) => item.track?.kind === 'video');
      if (sender) await sender.replaceTrack(replacement);
      if (old) { active.stream.removeTrack(old); old.stop(); }
      active.stream.addTrack(replacement);
      update({ localStream: active.stream, cameraOff: false, error: '' });
    } catch { update({ error: 'Could not switch cameras. Check camera permission and try again.' }); }
  }, [update]);

  useEffect(() => {
    mountedRef.current = true;
    if (!socket) return () => { mountedRef.current = false; };
    const matching = (data) => data?.callId && data.callId === activeRef.current?.call.callId && data.conversationId === activeRef.current?.call.conversationId;
    const onIncoming = (call) => {
      if (!call?.callId || !call?.conversationId) return;
      if (activeRef.current?.call?.callId === call.callId) return;
      if (activeRef.current) {
        if (call?.callId && call?.conversationId && socket.connected) socket.emit('call-decline', { conversationId: call.conversationId, callId: call.callId });
        return;
      }
      const active = { call, status: 'incoming', candidates: [], startedAt: null };
      activeRef.current = active;
      update({ ...initialState, call, callType: call.callType, status: 'incoming' });
    };
    const onAnswered = async (data) => {
      const active = activeRef.current;
      if (!matching(data) || !active?.peer || !data.answer) return;
      try {
        await active.peer.setRemoteDescription(data.answer);
        for (const candidate of active.candidates.splice(0)) await active.peer.addIceCandidate(candidate).catch(() => {});
        active.status = 'connecting';
        update({ status: 'connecting' });
      } catch { update({ status: 'failed', error: 'Could not establish the call. Please try again.' }); }
    };
    const onCandidate = async (data) => {
      const active = activeRef.current;
      if (!matching(data) || !data.candidate) return;
      if (!active.peer?.remoteDescription) active.candidates.push(data.candidate);
      else await active.peer.addIceCandidate(data.candidate).catch(() => {});
    };
    const onFinished = (data) => { if (matching(data)) cleanup(); };
    const onRenegotiate = async (data) => {
      const active = activeRef.current;
      if (!matching(data) || !active?.peer || !data.description) return;
      try {
        await active.peer.setRemoteDescription(data.description);
        if (data.description.type === 'offer') {
          const answer = await active.peer.createAnswer();
          await active.peer.setLocalDescription(answer);
          emitForCall('call-renegotiate', { description: active.peer.localDescription });
        }
      } catch { update({ status: 'reconnecting' }); }
    };
    const onConnectionChange = () => {
      if (!socket.connected && activeRef.current?.peer) update({ status: 'reconnecting' });
      else if (socket.connected && activeRef.current?.peer?.connectionState !== 'connected') void restartIce();
    };
    socket.on('call-incoming', onIncoming);
    socket.on('call-answered', onAnswered);
    socket.on('call-ice-candidate', onCandidate);
    socket.on('call-declined', onFinished);
    socket.on('call-ended', onFinished);
    socket.on('call-renegotiate', onRenegotiate);
    socket.on('disconnect', onConnectionChange);
    socket.on('connect', onConnectionChange);
    const onVisibility = () => { if (document.visibilityState === 'visible' && activeRef.current?.peer?.connectionState !== 'connected') void restartIce(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      mountedRef.current = false;
      socket.off('call-incoming', onIncoming);
      socket.off('call-answered', onAnswered);
      socket.off('call-ice-candidate', onCandidate);
      socket.off('call-declined', onFinished);
      socket.off('call-ended', onFinished);
      socket.off('call-renegotiate', onRenegotiate);
      socket.off('disconnect', onConnectionChange);
      socket.off('connect', onConnectionChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [cleanup, emitForCall, restartIce, socket, update]);

  useEffect(() => {
    if (state.status === 'idle') return undefined;
    const timer = window.setInterval(() => {
      const started = activeRef.current?.startedAt;
      if (started) update({ duration: Math.floor((Date.now() - started) / 1000) });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state.status, update]);

  useEffect(() => () => {
    mountedRef.current = false;
    window.clearTimeout(connectionTimer.current);
    const active = activeRef.current;
    activeRef.current = null;
    if (active) setNativeCallActive(active.call, false);
    active?.peer?.close();
    active?.stream?.getTracks().forEach((track) => track.stop());
  }, []);

  const openAppSettings = useCallback(() => { if (Capacitor.isNativePlatform()) void NativeCallService.openAppSettings().catch(() => {}); }, []);
  const value = useMemo(() => ({ ...state, startCall, answerCall, declineCall, endCall, toggleMute, toggleCamera, switchCamera, openAppSettings, minimize: () => update({ minimized: true }), reopen: () => update({ minimized: false }), dismissError: () => update({ error: '', permissionDenied: false }), toggleSpeaker: () => update({ speakerOff: !stateRef.current.speakerOff }) }), [answerCall, declineCall, endCall, openAppSettings, startCall, state, switchCamera, toggleCamera, toggleMute, update]);
  return <CallContext.Provider value={value}>{children}<GlobalCallView /></CallContext.Provider>;
};

const formatDuration = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

const GlobalCallView = () => {
  const call = useCallManager();
  const remoteVideo = useRef(null);
  const localVideo = useRef(null);
  const remoteAudio = useRef(null);
  const [previewPosition, setPreviewPosition] = useState({ right: 16, bottom: 16 });
  useEffect(() => { if (remoteVideo.current && remoteVideo.current.srcObject !== call.remoteStream) remoteVideo.current.srcObject = call.remoteStream || null; if (remoteVideo.current) void Promise.resolve(remoteVideo.current.play()).catch(() => {}); }, [call.remoteStream, call.minimized]);
  useEffect(() => { if (remoteVideo.current) remoteVideo.current.muted = call.speakerOff; }, [call.speakerOff, call.minimized]);
  useEffect(() => { if (localVideo.current && localVideo.current.srcObject !== call.localStream) localVideo.current.srcObject = call.localStream || null; if (localVideo.current) void Promise.resolve(localVideo.current.play()).catch(() => {}); }, [call.localStream, call.minimized]);
  useEffect(() => { if (remoteAudio.current && remoteAudio.current.srcObject !== call.remoteStream) remoteAudio.current.srcObject = call.remoteStream || null; if (remoteAudio.current) remoteAudio.current.muted = call.speakerOff; }, [call.remoteStream, call.speakerOff, call.minimized]);
  if (call.status === 'idle') return call.error ? <div role="alert" className="fixed bottom-5 right-5 z-[210] flex max-w-sm items-center gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-xl"><span className="flex-1">{call.error}{call.permissionDenied && Capacitor.isNativePlatform() && <button type="button" onClick={call.openAppSettings} className="mt-1 block font-semibold text-indigo-600 underline">Open app settings</button>}</span><button type="button" onClick={call.dismissError} aria-label="Dismiss call message"><HiOutlineX className="h-4 w-4"/></button></div> : null;
  const name = call.call?.caller?.name || call.call?.participant?.fullName || 'SkillBridge contact';
  const avatar = call.call?.caller?.avatar || call.call?.participant?.avatar?.url;
  const connected = call.status === 'connected';
  const statusText = call.status === 'incoming' ? `Incoming ${call.callType} call` : call.status === 'calling' ? 'Callingâ€¦' : call.status === 'reconnecting' ? 'Reconnectingâ€¦' : call.status === 'failed' ? 'Connection problem' : connected ? `Connected Â· ${formatDuration(call.duration)}` : 'Connectingâ€¦';
  if (call.minimized) return <div className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] right-4 z-[200] flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-2xl border border-white/15 bg-[#111827] p-2.5 text-white shadow-2xl sm:right-6">
    {call.callType === 'video' && call.localStream && !call.cameraOff && <video aria-label="Local video preview" ref={localVideo} autoPlay playsInline muted className="h-12 w-16 rounded-lg bg-slate-900 object-cover"/>}
    <button type="button" onClick={call.reopen} className="flex min-w-0 items-center gap-2 text-left" aria-label="Open call"><Avatar src={avatar} name={name} size="sm"/><span className="min-w-0"><span className="block max-w-28 truncate text-xs font-semibold">{name}</span><span className="mt-0.5 block text-[11px] text-emerald-300">{statusText}</span></span></button>
    {call.status === 'incoming' ? <><button type="button" onClick={call.declineCall} aria-label="Decline call" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-600"><HiOutlinePhoneMissedCall/></button><button type="button" onClick={call.answerCall} aria-label="Answer call" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500"><HiOutlinePhone/></button></> : <><button type="button" onClick={call.toggleMute} aria-label={call.muted ? 'Unmute microphone' : 'Mute microphone'} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10">{call.muted ? <span className="text-xs">Muted</span> : <HiOutlineMicrophone/>}</button>
      {call.callType === 'video' && <button type="button" onClick={call.toggleCamera} aria-label={call.cameraOff ? 'Turn camera on' : 'Turn camera off'} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10"><HiOutlineVideoCamera/></button>}
      <button type="button" onClick={call.endCall} aria-label="End call" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-600"><HiOutlinePhoneMissedCall/></button></>}
    <audio ref={remoteAudio} autoPlay className="hidden"/>
  </div>;
  return <div role="dialog" aria-modal="true" aria-label="Call" className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-md sm:p-6">
    <div className="relative flex max-h-[92dvh] min-h-[min(560px,78dvh)] w-full max-w-4xl flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#101626] text-white shadow-2xl">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><Avatar src={avatar} name={name} size="sm"/><div><p className="text-sm font-semibold">{name}</p><p className="mt-0.5 text-xs text-slate-400">{statusText}</p></div></div><button type="button" onClick={call.minimize} aria-label="Minimize call" title="Minimize call" className="rounded-xl p-2 text-slate-300 hover:bg-white/10"><HiOutlineX className="h-5 w-5"/></button></header>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_45%,rgba(99,102,241,.24),transparent_48%),#0b1020]">
        {call.callType === 'audio' && <audio ref={remoteAudio} autoPlay className="hidden"/>}
        {call.callType === 'video' && <video ref={remoteVideo} autoPlay playsInline className={`absolute inset-0 h-full w-full object-cover ${call.remoteStream ? '' : 'hidden'}`}/>}
        {(!call.remoteStream || call.callType === 'audio') && <div className="flex flex-col items-center px-5 text-center"><div className="mb-4 rounded-full bg-gradient-to-br from-indigo-400 to-violet-700 p-1 shadow-xl"><Avatar src={avatar} name={name} size="lg"/></div><h2 className="text-xl font-bold">{name}</h2><p className="mt-2 text-sm text-slate-400">{call.status === 'incoming' ? 'They are waiting for you to answer' : statusText}</p></div>}
        {call.callType === 'video' && call.localStream && <div onPointerDown={(event) => { if (event.target.closest('button')) return; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) return; const rect = event.currentTarget.parentElement.getBoundingClientRect(); setPreviewPosition({ right: Math.max(8, rect.right - event.clientX - 80), bottom: Math.max(8, rect.bottom - event.clientY - 60) }); }} style={{ right: previewPosition.right, bottom: previewPosition.bottom }} className="absolute z-10 h-28 w-40 touch-none overflow-hidden rounded-2xl border border-white/30 bg-slate-900 shadow-xl sm:h-36 sm:w-52">
          {!call.cameraOff ? <video aria-label="Local video preview" ref={localVideo} autoPlay playsInline muted className="h-full w-full object-cover"/> : <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300"><Avatar name="You" size="sm"/><span className="text-xs">Camera off</span></div>}
          <button type="button" onClick={call.switchCamera} aria-label="Switch camera" title="Switch camera" className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-black/55"><HiSwitchHorizontal/></button>
        </div>}
      </div>
      {call.error && <div role="alert" className="border-t border-rose-400/20 bg-rose-950/40 px-5 py-2 text-center text-xs text-rose-200">{call.error}{call.permissionDenied && Capacitor.isNativePlatform() && <button type="button" onClick={call.openAppSettings} className="ml-2 font-semibold underline">Open app settings</button>}</div>}
      <footer className="flex items-center justify-center gap-3 px-4 py-4 sm:gap-4 sm:py-5">{call.status === 'incoming' ? <><button type="button" onClick={call.declineCall} aria-label="Decline call" className="grid h-14 w-14 place-items-center rounded-full bg-rose-600"><HiOutlinePhoneMissedCall className="h-6 w-6"/></button><button type="button" onClick={call.answerCall} aria-label="Answer call" className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500">{call.callType === 'video' ? <HiOutlineVideoCamera className="h-6 w-6"/> : <HiOutlinePhone className="h-6 w-6"/>}</button></> : <><button type="button" onClick={call.toggleMute} aria-label={call.muted ? 'Unmute microphone' : 'Mute microphone'} className={`grid h-12 w-12 place-items-center rounded-full ${call.muted ? 'bg-white text-slate-900' : 'bg-white/10'}`}><HiOutlineMicrophone/></button>{call.callType === 'video' && <><button type="button" onClick={call.toggleCamera} aria-label={call.cameraOff ? 'Turn camera on' : 'Turn camera off'} className={`grid h-12 w-12 place-items-center rounded-full ${call.cameraOff ? 'bg-white text-slate-900' : 'bg-white/10'}`}><HiOutlineVideoCamera/></button><button type="button" onClick={call.switchCamera} aria-label="Switch camera" className="grid h-12 w-12 place-items-center rounded-full bg-white/10"><HiSwitchHorizontal/></button></>}<button type="button" onClick={call.toggleSpeaker} aria-label={call.speakerOff ? 'Turn speaker on' : 'Turn speaker off'} className="grid h-12 w-12 place-items-center rounded-full bg-white/10">{call.speakerOff ? <HiVolumeOff/> : <HiVolumeUp/>}</button><button type="button" onClick={call.endCall} aria-label="End call" className="grid h-14 w-14 place-items-center rounded-full bg-rose-600"><HiOutlinePhoneMissedCall className="h-6 w-6"/></button></>}</footer>
    </div>
  </div>;
};

