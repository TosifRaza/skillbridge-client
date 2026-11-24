import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useSocket } from '@/context/SocketContext';
import { logoutUser } from '@/store/slices/authSlice';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import Avatar from '@/components/ui/Avatar';
import { HiOutlineHome, HiOutlineSearch, HiOutlineClipboardList, HiOutlineChatAlt, HiOutlineLogout, HiOutlineSparkles, HiOutlineCreditCard, HiOutlineChevronDown, HiOutlinePhone, HiOutlinePhoneMissedCall, HiOutlineX, HiLightningBolt, HiOutlineMicrophone, HiOutlineVideoCamera, HiOutlineBell } from 'react-icons/hi';

const PENDING_CALL_KEY = 'skillbridge:pending-incoming-call';

const navItems = [
  { icon: HiOutlineHome, label: 'Overview', path: '/worker/home' },
  { icon: HiOutlineSearch, label: 'Find work', path: '/worker/jobs' },
  { icon: HiOutlineClipboardList, label: 'My contracts', path: '/worker/contracts' },
  { icon: HiOutlineCreditCard, label: 'Wallet', path: '/worker/wallet' },
  { icon: HiOutlineChatAlt, label: 'Messages', path: '/worker/chat' },
];
const mobileLabels = ['Home', 'Discover', 'Jobs', 'Wallet', 'Messages'];

const WorkerLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isChat = location.pathname === '/worker/chat';
  const socket = useSocket();
  const { user } = useAppSelector((state) => state.auth);
  const hasUnreadMessages = useAppSelector((state) => state.chat.conversations.some((chat) => chat.unreadCount > 0));
  const [incomingCall, setIncomingCall] = useState(null);
  const [isAcceptingCall, setIsAcceptingCall] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callError, setCallError] = useState('');
  const peerConnectionRef = useRef(null);
  const incomingCallRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const handleLogout = async () => { await dispatch(logoutUser()); navigate('/auth/login'); };
  const displayName = user?.fullName || user?.email?.split('@')[0] || 'there';

  const stopCallMedia = useCallback(() => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    pendingCandidatesRef.current = [];
    setLocalStream(null);
    setRemoteStream(null);
    setIsMuted(false);
    setIsCameraOff(false);
  }, []);

  const finishIncomingCall = useCallback((callId) => {
    if (callId && incomingCallRef.current?.callId !== callId) return;
    const activeCall = incomingCallRef.current;
    window.sessionStorage.removeItem(PENDING_CALL_KEY);
    stopCallMedia();
    incomingCallRef.current = null;
    setIncomingCall(null);
    setCallStatus('idle');
    if (activeCall) window.dispatchEvent(new CustomEvent('skillbridge:incoming-call-cleared', { detail: { callId: activeCall.callId } }));
  }, [stopCallMedia]);

  useEffect(() => {
    if (!socket) return undefined;

    const onIncomingCall = (call) => {
      if (!call?.conversationId || !call?.callId) return;
      if (incomingCallRef.current) {
        socket.emit('call-decline', { conversationId: call.conversationId, callId: call.callId });
        return;
      }
      incomingCallRef.current = call;
      pendingCandidatesRef.current = [];
      window.sessionStorage.setItem(PENDING_CALL_KEY, JSON.stringify(call));
      setIncomingCall(call);
      setCallStatus('incoming');
      setCallError('');
    };
    const onIceCandidate = ({ conversationId, callId, candidate } = {}) => {
      if (!candidate) return;
      const activeCall = incomingCallRef.current;
      if (activeCall?.conversationId === conversationId && activeCall.callId === callId) {
        const peerConnection = peerConnectionRef.current;
        if (peerConnection?.remoteDescription) {
          peerConnection.addIceCandidate(candidate).catch(() => {});
        } else {
          pendingCandidatesRef.current.push(candidate);
        }
      }
      try {
        const pendingCall = JSON.parse(window.sessionStorage.getItem(PENDING_CALL_KEY) || 'null');
        if (pendingCall?.conversationId !== conversationId || pendingCall?.callId !== callId) return;
        pendingCall.pendingCandidates = [...(pendingCall.pendingCandidates || []), candidate];
        window.sessionStorage.setItem(PENDING_CALL_KEY, JSON.stringify(pendingCall));
      } catch { /* Ignore stale or malformed queued call data. */ }
    };
    const clearCall = ({ callId } = {}) => finishIncomingCall(callId);
    const onLocalCallCleared = (event) => finishIncomingCall(event.detail?.callId);

    socket.on('call-incoming', onIncomingCall);
    socket.on('call-ice-candidate', onIceCandidate);
    socket.on('call-ended', clearCall);
    socket.on('call-declined', clearCall);
    window.addEventListener('skillbridge:incoming-call-cleared', onLocalCallCleared);
    return () => {
      socket.off('call-incoming', onIncomingCall);
      socket.off('call-ice-candidate', onIceCandidate);
      socket.off('call-ended', clearCall);
      socket.off('call-declined', clearCall);
      peerConnectionRef.current?.close();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      window.removeEventListener('skillbridge:incoming-call-cleared', onLocalCallCleared);
    };
  }, [socket, finishIncomingCall]);

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  const callIsOpenInMessages = incomingCall
    && location.pathname === '/worker/chat'
    && new URLSearchParams(location.search).get('conversationId') === incomingCall.conversationId;
  const answerIncomingCall = async () => {
    const call = incomingCallRef.current;
    if (!call || !socket || isAcceptingCall || callStatus !== 'incoming') return;
    setIsAcceptingCall(true);
    setCallError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: call.callType === 'video',
      });
      if (incomingCallRef.current?.callId !== call.callId) {
        stream.getTracks().forEach((track) => track.stop());
        setIsAcceptingCall(false);
        return;
      }
      localStreamRef.current = stream;
      setLocalStream(stream);
      const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      peerConnectionRef.current = peerConnection;
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
      peerConnection.ontrack = ({ streams }) => setRemoteStream(streams[0] || null);
      peerConnection.onicecandidate = ({ candidate }) => {
        if (candidate) socket.emit('call-ice-candidate', { conversationId: call.conversationId, callId: call.callId, candidate });
      };
      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === 'connected') setCallStatus('connected');
        if (peerConnection.connectionState === 'failed') {
          socket.emit('call-end', { conversationId: call.conversationId, callId: call.callId, reason: 'connection-failed' });
          finishIncomingCall(call.callId);
        }
      };
      await peerConnection.setRemoteDescription(call.offer);
      const queuedCandidates = [...(call.pendingCandidates || []), ...pendingCandidatesRef.current];
      pendingCandidatesRef.current = [];
      await Promise.all(queuedCandidates.map((candidate) => peerConnection.addIceCandidate(candidate).catch(() => {})));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('call-answer', { conversationId: call.conversationId, callId: call.callId, answer: peerConnection.localDescription });
      window.sessionStorage.removeItem(PENDING_CALL_KEY);
      setCallStatus('connecting');
    } catch (error) {
      stopCallMedia();
      setCallStatus('incoming');
      setCallError(error.name === 'NotAllowedError'
        ? 'Allow microphone/camera access, then tap Answer to try again.'
        : 'Could not connect this call. Check your microphone/camera and try again.');
    }
    setIsAcceptingCall(false);
  };

  const declineIncomingCall = () => {
    const call = incomingCallRef.current;
    if (!call) return;
    socket?.emit('call-decline', { conversationId: call.conversationId, callId: call.callId });
    finishIncomingCall(call.callId);
  };

  const endIncomingCall = () => {
    const call = incomingCallRef.current;
    if (!call) return;
    socket?.emit('call-end', { conversationId: call.conversationId, callId: call.callId, reason: 'hangup' });
    finishIncomingCall(call.callId);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    localStreamRef.current?.getAudioTracks().forEach((track) => { track.enabled = !nextMuted; });
    setIsMuted(nextMuted);
  };

  const toggleCamera = () => {
    const nextCameraOff = !isCameraOff;
    localStreamRef.current?.getVideoTracks().forEach((track) => { track.enabled = !nextCameraOff; });
    setIsCameraOff(nextCameraOff);
  };

  return (
    <div className="portal-shell min-h-screen bg-[#f6f4ff] text-surface-800 dark:bg-surface-950 dark:text-surface-100">
      <aside className="worker-sidebar portal-sidebar fixed inset-y-0 left-0 z-40 hidden w-[266px] flex-col text-white lg:flex">
        <Link to="/worker/home" className="flex h-[86px] items-center gap-3 border-b border-white/10 px-[30px]">
          <span className="brand-mark h-[40px] w-[40px] rounded-[13px] text-lg">S</span>
          <span className="text-[20px] font-extrabold tracking-tight">SkillBridge</span>
        </Link>

        <div className="px-4 pt-4">
          <p className="px-4 text-[11px] font-semibold uppercase tracking-[.12em] text-violet-200/90">Worker space</p>
          <div className="mt-2 flex min-h-[98px] items-center gap-3 rounded-[17px] border border-white/[.04] bg-white/[.08] px-4 py-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-violet-500/25 text-violet-200"><HiLightningBolt className="h-6 w-6" /></span>
            <div><p className="text-[14px] font-bold leading-5">Make your next move</p><p className="mt-1 text-[12px] leading-[1.45] text-violet-100/75">Discover great projects and grow your reputation.</p></div>
          </div>
        </div>

        <p className="px-8 pb-3 pt-7 text-[11px] font-semibold uppercase tracking-[.12em] text-violet-200/80">Workspace</p>
        <nav aria-label="Worker workspace" className="flex-1 space-y-1 px-4 pt-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink key={path} to={path} end={path === '/worker/home'} className={({ isActive }) => `portal-nav-link worker-nav-link ${isActive ? 'portal-nav-link-active worker-nav-active' : ''}`}>
              <Icon className="h-[22px] w-[22px]" />{label}{label === 'Messages' && <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />}
            </NavLink>
          ))}
        </nav>

        <div className="relative mx-[27px] mb-5 overflow-hidden rounded-[18px] border border-violet-400/25 bg-gradient-to-br from-[#7337c9]/80 to-[#35206d]/90 p-4 shadow-[0_12px_30px_rgba(75,35,154,.24)]">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
          <HiOutlineSparkles className="relative h-5 w-5 text-amber-200" />
          <p className="relative mt-2 text-[14px] font-bold">Stand out to clients</p>
          <p className="relative mt-1 text-[12px] leading-[1.4] text-violet-100/85">A complete profile helps you get more work.</p>
          <Link to="/worker/profile" className="relative mt-3 inline-flex min-h-8 items-center gap-2 text-[13px] font-semibold text-white transition hover:text-violet-200">Improve profile <span aria-hidden="true">&rarr;</span></Link>
        </div>
        <div className="border-t border-white/10 px-7 py-4">
          <button onClick={handleLogout} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-2 text-[14px] font-medium text-violet-100/85 transition hover:bg-white/10 hover:text-white"><HiOutlineLogout className="h-5 w-5" />Sign out</button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-[266px]">
        <header className={`portal-topbar sticky top-0 z-30 flex h-[86px] items-center justify-between border-b border-violet-100/80 bg-white/85 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-surface-900/90 sm:px-7 lg:px-7 ${isChat ? 'max-md:h-16 max-md:border-transparent max-md:bg-[#f7f3ff] max-md:dark:bg-slate-950' : ''}`}>
          <Link to="/worker/home" className="flex items-center gap-2.5 lg:hidden"><span className={isChat ? 'flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7823ef] to-[#4421cd] text-xl text-white' : 'brand-mark h-9 w-9'}>{isChat ? <HiLightningBolt /> : 'S'}</span><span className={`font-bold tracking-tight ${isChat ? 'max-md:text-[19px] max-md:text-[#130e2f] max-md:dark:text-white' : ''}`}>SkillBridge</span></Link>
          <div className="hidden items-center gap-4 lg:flex">
            <span className="flex h-[54px] w-[54px] items-center justify-center rounded-[17px] bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300"><HiOutlineSparkles className="h-7 w-7" /></span>
            <div><p className="text-[18px] font-bold leading-tight text-slate-900 dark:text-white">Good to see you, {displayName}</p><p className="mt-1 text-[14px] text-slate-500 dark:text-slate-400">Find, apply, and manage your work on SkillBridge.</p></div>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <div className={`flex items-center rounded-full border border-violet-100 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${isChat ? 'max-md:hidden' : ''}`}><DarkModeToggle /></div>
            {isChat && <Link to="/worker/chat" aria-label="View conversations" className="relative grid h-9 w-9 place-items-center rounded-xl bg-white text-[#272049] shadow-sm dark:bg-slate-800 dark:text-white md:hidden"><HiOutlineBell className="h-5 w-5" />{hasUnreadMessages && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />}</Link>}
            <button type="button" onClick={handleLogout} aria-label="Sign out" title="Sign out" className={`rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-950/30 lg:hidden ${isChat ? 'max-md:hidden' : ''}`}><HiOutlineLogout className="h-5 w-5" /></button>
            <div className="hidden h-9 w-px bg-violet-200 dark:bg-slate-700 sm:block" />
            <Link to="/worker/profile" title="Open profile" aria-label="Open profile" className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-violet-50 dark:hover:bg-violet-950/40">
              {isChat && !user?.avatar?.url && <span className="grid h-9 w-9 place-items-center rounded-full bg-violet-200 font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-200 md:hidden">{displayName.charAt(0).toUpperCase()}</span>}
              <div className={isChat && !user?.avatar?.url ? 'hidden md:block' : ''}><Avatar src={user?.avatar?.url} name={user?.fullName || user?.email} size="sm" /></div>
              <div className={isChat ? 'hidden md:block' : 'hidden sm:block'}><p className="max-w-48 truncate text-[14px] font-bold text-slate-900 dark:text-slate-100">{user?.fullName || 'Worker'}</p><p className="max-w-48 truncate text-[12px] text-slate-500 dark:text-slate-400">{user?.email}</p></div>
              <HiOutlineChevronDown className={`hidden h-4 w-4 text-slate-500 ${isChat ? 'md:block' : 'sm:block'}`} />
            </Link>
          </div>
        </header>
        <main className={`portal-main worker-main mx-auto w-full max-w-[1500px] flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-7 lg:px-16 lg:pb-10 lg:pt-8 ${isChat ? 'max-md:p-0' : ''}`}><Outlet /></main>
      </div>
      <nav aria-label="Worker navigation" className={`portal-mobile-nav fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200/80 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-surface-900/95 lg:hidden ${isChat ? 'max-md:pb-[max(4px,env(safe-area-inset-bottom))]' : ''}`}>
        {navItems.map(({ icon: Icon, path }, index) => <NavLink key={path} to={path} end={path === '/worker/home'} className={({ isActive }) => `mobile-nav-item ${isActive ? 'mobile-nav-active' : ''} ${isChat ? `max-md:mx-0.5 max-md:min-h-[58px] max-md:font-semibold ${isActive ? 'max-md:bg-violet-100 max-md:text-violet-700 max-md:dark:bg-violet-950/40' : ''}` : ''}`}><Icon className="h-[22px] w-[22px]"/><span>{mobileLabels[index]}</span></NavLink>)}
      </nav>
      {incomingCall && !callIsOpenInMessages && <div role="dialog" aria-modal="true" aria-label="Call" className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-md sm:p-6">
        <div className="relative flex max-h-[92dvh] min-h-[min(680px,85dvh)] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#101626] text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
            <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-violet-200">{callStatus === 'incoming' ? `Incoming ${incomingCall.callType || 'audio'} call` : `${incomingCall.callType || 'audio'} call · ${callStatus === 'connected' ? 'Connected' : 'Connecting…'}`}</p><h2 className="mt-1 text-lg font-bold">{incomingCall.caller?.name || 'SkillBridge contact'}</h2></div>
            <button type="button" onClick={callStatus === 'incoming' ? declineIncomingCall : endIncomingCall} aria-label={callStatus === 'incoming' ? 'Decline call' : 'End call'} className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"><HiOutlineX className="h-5 w-5"/></button>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_45%,rgba(99,102,241,.24),transparent_48%),#0b1020]">
            {incomingCall.callType === 'audio' && <audio ref={remoteAudioRef} autoPlay className="hidden"/>}
            {incomingCall.callType === 'video' && <video ref={remoteVideoRef} autoPlay playsInline className={`absolute inset-0 h-full w-full object-cover ${remoteStream ? '' : 'hidden'}`}/>}
            {(!remoteStream || incomingCall.callType === 'audio') && <div className="flex flex-col items-center px-5 text-center"><div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border-4 border-violet-400 bg-indigo-600 text-3xl font-bold shadow-[0_0_55px_rgba(99,102,241,.4)]">{(incomingCall.caller?.name || 'S').slice(0, 1).toUpperCase()}</div><h3 className="text-2xl font-bold">{incomingCall.caller?.name || 'SkillBridge contact'}</h3><p className="mt-2 text-sm text-slate-300">{callStatus === 'incoming' ? 'Incoming call' : callStatus === 'connected' ? 'Call connected' : 'Waiting for the other person…'}</p></div>}
            {incomingCall.callType === 'video' && localStream && <video ref={localVideoRef} autoPlay playsInline muted className={`absolute bottom-4 right-4 h-24 w-36 rounded-2xl border border-white/20 bg-slate-900 object-cover shadow-xl sm:bottom-5 sm:right-5 sm:h-32 sm:w-48 ${isCameraOff ? 'opacity-0' : ''}`}/>}
          </div>
          {callError && <p role="alert" className="border-t border-rose-400/20 bg-rose-950/40 px-5 py-3 text-center text-sm text-rose-200">{callError}</p>}
          <div className="flex items-center justify-center gap-4 px-5 py-5 sm:py-6">
            {callStatus === 'incoming' ? <>
              <button type="button" onClick={declineIncomingCall} className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white transition hover:bg-rose-500" aria-label="Decline call"><HiOutlinePhoneMissedCall className="h-6 w-6"/></button>
              <button type="button" onClick={answerIncomingCall} disabled={isAcceptingCall} className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-70" aria-label="Answer call"><HiOutlinePhone className="h-6 w-6"/></button>
            </> : <>
              <button type="button" onClick={toggleMute} className={`flex h-12 w-12 items-center justify-center rounded-full transition ${isMuted ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`} aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}><HiOutlineMicrophone className="h-5 w-5"/></button>
              {incomingCall.callType === 'video' && <button type="button" onClick={toggleCamera} className={`flex h-12 w-12 items-center justify-center rounded-full transition ${isCameraOff ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`} aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}><HiOutlineVideoCamera className="h-5 w-5"/></button>}
              <button type="button" onClick={endIncomingCall} className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white transition hover:bg-rose-500" aria-label="End call"><HiOutlinePhoneMissedCall className="h-6 w-6"/></button>
            </>}
          </div>
        </div>
      </div>}
    </div>
  );
};

export default WorkerLayout;
