import { useEffect, useState } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useSocket } from '@/context/SocketContext';
import { logoutUser } from '@/store/slices/authSlice';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import Avatar from '@/components/ui/Avatar';
import { HiOutlineHome, HiOutlineSearch, HiOutlineClipboardList, HiOutlineChatAlt, HiOutlineLogout, HiOutlineSparkles, HiOutlineCreditCard, HiOutlineChevronDown, HiOutlinePhone, HiOutlinePhoneMissedCall, HiOutlineX, HiLightningBolt } from 'react-icons/hi';

const PENDING_CALL_KEY = 'skillbridge:pending-incoming-call';
const AUTO_ANSWER_CALL_KEY = 'skillbridge:auto-answer-call';

const navItems = [
  { icon: HiOutlineHome, label: 'Overview', path: '/worker/home' },
  { icon: HiOutlineSearch, label: 'Find work', path: '/worker/jobs' },
  { icon: HiOutlineClipboardList, label: 'My contracts', path: '/worker/contracts' },
  { icon: HiOutlineCreditCard, label: 'Wallet', path: '/worker/wallet' },
  { icon: HiOutlineChatAlt, label: 'Messages', path: '/worker/chat' },
];

const WorkerLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();
  const { user } = useAppSelector((state) => state.auth);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isAcceptingCall, setIsAcceptingCall] = useState(false);
  const handleLogout = async () => { await dispatch(logoutUser()); navigate('/auth/login'); };
  const displayName = user?.fullName || user?.email?.split('@')[0] || 'there';

  useEffect(() => {
    if (!socket) return undefined;

    const onIncomingCall = (call) => {
      if (!call?.conversationId || !call?.callId) return;
      window.sessionStorage.setItem(PENDING_CALL_KEY, JSON.stringify(call));
      setIncomingCall(call);
    };
    const onIceCandidate = ({ conversationId, callId, candidate } = {}) => {
      if (!candidate) return;
      try {
        const pendingCall = JSON.parse(window.sessionStorage.getItem(PENDING_CALL_KEY) || 'null');
        if (pendingCall?.conversationId !== conversationId || pendingCall?.callId !== callId) return;
        pendingCall.pendingCandidates = [...(pendingCall.pendingCandidates || []), candidate];
        window.sessionStorage.setItem(PENDING_CALL_KEY, JSON.stringify(pendingCall));
      } catch { /* Ignore stale or malformed queued call data. */ }
    };
    const clearCall = ({ callId } = {}) => {
      setIncomingCall((current) => {
        if (!current || (callId && current.callId !== callId)) return current;
        window.sessionStorage.removeItem(PENDING_CALL_KEY);
        return null;
      });
    };
    const onLocalCallCleared = (event) => clearCall({ callId: event.detail?.callId });

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
      window.removeEventListener('skillbridge:incoming-call-cleared', onLocalCallCleared);
    };
  }, [socket]);

  const callIsOpenInMessages = incomingCall
    && location.pathname === '/worker/chat'
    && new URLSearchParams(location.search).get('conversationId') === incomingCall.conversationId;
  const answerIncomingCall = async () => {
    if (!incomingCall) return;
    const call = incomingCall;
    let callIsStillRinging = true;
    setIsAcceptingCall(true);
    try {
      // Request media directly from the user's click so browser gesture rules
      // allow the microphone/camera before routing into the chat screen.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: call.callType === 'video',
      });
      const stillPending = JSON.parse(window.sessionStorage.getItem(PENDING_CALL_KEY) || 'null');
      if (stillPending?.callId !== call.callId) {
        stream.getTracks().forEach((track) => track.stop());
        callIsStillRinging = false;
      } else {
        window.__skillBridgeIncomingCallStream = { callId: call.callId, stream };
        window.sessionStorage.setItem(AUTO_ANSWER_CALL_KEY, call.callId);
      }
    } catch {
      // Still open the conversation; the in-chat Answer control can retry after
      // the user changes browser permissions or selects another device.
    } finally {
      setIsAcceptingCall(false);
      try {
        const stillPending = JSON.parse(window.sessionStorage.getItem(PENDING_CALL_KEY) || 'null');
        callIsStillRinging = callIsStillRinging && stillPending?.callId === call.callId;
      } catch {
        callIsStillRinging = false;
      }
      if (callIsStillRinging) navigate(`/worker/chat?conversationId=${encodeURIComponent(call.conversationId)}`);
    }
    navigate(`/worker/chat?conversationId=${encodeURIComponent(incomingCall.conversationId)}`);
  };
  const declineIncomingCall = () => {
    if (!incomingCall) return;
    socket?.emit('call-decline', { conversationId: incomingCall.conversationId, callId: incomingCall.callId });
    window.sessionStorage.removeItem(PENDING_CALL_KEY);
    setIncomingCall(null);
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
        <header className="portal-topbar sticky top-0 z-30 flex h-[86px] items-center justify-between border-b border-violet-100/80 bg-white/85 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-surface-900/90 sm:px-7 lg:px-7">
          <Link to="/worker/home" className="flex items-center gap-2.5 lg:hidden"><span className="brand-mark h-9 w-9">S</span><span className="font-bold tracking-tight">SkillBridge</span></Link>
          <div className="hidden items-center gap-4 lg:flex">
            <span className="flex h-[54px] w-[54px] items-center justify-center rounded-[17px] bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300"><HiOutlineSparkles className="h-7 w-7" /></span>
            <div><p className="text-[18px] font-bold leading-tight text-slate-900 dark:text-white">Good to see you, {displayName}</p><p className="mt-1 text-[14px] text-slate-500 dark:text-slate-400">Find, apply, and manage your work on SkillBridge.</p></div>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <div className="flex items-center rounded-full border border-violet-100 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800"><DarkModeToggle /></div>
            <button type="button" onClick={handleLogout} aria-label="Sign out" title="Sign out" className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-950/30 lg:hidden"><HiOutlineLogout className="h-5 w-5" /></button>
            <div className="hidden h-9 w-px bg-violet-200 dark:bg-slate-700 sm:block" />
            <Link to="/worker/profile" title="Open profile" aria-label="Open profile" className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-violet-50 dark:hover:bg-violet-950/40">
              <Avatar src={user?.avatar?.url} name={user?.fullName || user?.email} size="sm" />
              <div className="hidden sm:block"><p className="max-w-48 truncate text-[14px] font-bold text-slate-900 dark:text-slate-100">{user?.fullName || 'Worker'}</p><p className="max-w-48 truncate text-[12px] text-slate-500 dark:text-slate-400">{user?.email}</p></div>
              <HiOutlineChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
            </Link>
          </div>
        </header>
        <main className="portal-main worker-main mx-auto w-full max-w-[1500px] flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-7 lg:px-16 lg:pb-10 lg:pt-8"><Outlet /></main>
      </div>
      <nav className="portal-mobile-nav fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200/80 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-surface-900/95 lg:hidden">
        {navItems.map(({ icon: Icon, label, path }) => <NavLink key={path} to={path} end={path === '/worker/home'} className={({ isActive }) => `mobile-nav-item ${isActive ? 'mobile-nav-active' : ''}`}><Icon className="h-5 w-5"/><span>{label}</span></NavLink>)}
      </nav>
      {incomingCall && !callIsOpenInMessages && <div role="dialog" aria-modal="true" aria-label="Incoming call" className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:items-center sm:p-6">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#171a36] text-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-white/10 px-5 py-4 sm:px-6">
            <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-violet-200">Incoming {incomingCall.callType || 'audio'} call</p><h2 className="mt-1 text-xl font-bold">{incomingCall.caller?.name || 'SkillBridge contact'}</h2><p className="mt-1 text-sm text-slate-300">Answer here to join immediately.</p></div>
            <button type="button" onClick={declineIncomingCall} aria-label="Decline call" className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"><HiOutlineX className="h-5 w-5"/></button>
          </div>
          <div className="flex items-center justify-end gap-3 px-5 py-4 sm:px-6">
            <button type="button" onClick={declineIncomingCall} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white transition hover:bg-rose-500"><HiOutlinePhoneMissedCall className="h-4 w-4"/>Decline</button>
            <button type="button" onClick={answerIncomingCall} disabled={isAcceptingCall} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-bold text-white transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-70"><HiOutlinePhone className="h-4 w-4"/>{isAcceptingCall ? 'Connecting…' : 'Answer'}</button>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default WorkerLayout;
