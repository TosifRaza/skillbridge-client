import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import Avatar from '@/components/ui/Avatar';
import { HiOutlineHome, HiOutlineSearch, HiOutlineClipboardList, HiOutlineChatAlt, HiOutlineLogout, HiOutlineSparkles, HiOutlineCreditCard } from 'react-icons/hi';

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
  const { user } = useAppSelector((state) => state.auth);
  const handleLogout = async () => { await dispatch(logoutUser()); navigate('/auth/login'); };
  const displayName = user?.fullName || user?.email?.split('@')[0] || 'there';

  return (
    <div className="portal-shell min-h-screen bg-[#f5f7fc] text-surface-800 dark:bg-surface-950 dark:text-surface-100">
      <aside className="portal-sidebar fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col text-white lg:flex">
        <Link to="/worker/home" className="flex h-[84px] items-center gap-3 px-7"><span className="brand-mark">S</span><span className="text-[19px] font-bold tracking-tight">SkillBridge</span></Link>
        <div className="mx-5 mb-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-indigo-200">Worker space</p>
          <p className="mt-2 text-sm font-semibold">Make your next move</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Discover great projects and grow your reputation.</p>
        </div>
        <p className="px-7 pb-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Workspace</p>
        <nav className="flex-1 space-y-1 px-4">
          {navItems.map(({ icon: Icon, label, path }) => <NavLink key={path} to={path} end={path === '/worker/home'} className={({ isActive }) => `portal-nav-link ${isActive ? 'portal-nav-link-active' : ''}`}><Icon className="h-[19px] w-[19px]" />{label}{label === 'Messages' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />}</NavLink>)}
        </nav>
        <div className="mx-5 mb-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-100"><HiOutlineSparkles className="h-4 w-4 text-amber-300"/>Stand out to clients</div>
          <p className="mt-2 text-[11px] leading-4 text-slate-400">A complete profile helps the right customers find you.</p>
          <Link to="/worker/profile" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-indigo-200">Improve profile <span aria-hidden="true">→</span></Link>
        </div>
        <div className="border-t border-white/10 p-4"><button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"><HiOutlineLogout className="h-5 w-5" />Sign out</button></div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-[264px]">
        <header className="portal-topbar sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-surface-900/90 sm:px-7 lg:px-10">
          <Link to="/worker/home" className="flex items-center gap-2.5 lg:hidden"><span className="brand-mark h-9 w-9">S</span><span className="font-bold tracking-tight">SkillBridge</span></Link>
          <div className="hidden lg:block"><p className="text-xs font-medium text-slate-400">WORKER WORKSPACE</p><p className="mt-0.5 text-sm font-semibold text-slate-700 dark:text-slate-200">Good to see you, {displayName}</p></div>
          <div className="ml-auto flex items-center gap-2 sm:gap-5"><DarkModeToggle /><button type="button" onClick={handleLogout} aria-label="Sign out" title="Sign out" className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-950/30 lg:hidden"><HiOutlineLogout className="h-5 w-5" /></button><div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block"/><Link to="/worker/profile" title="Open profile" aria-label="Open profile" className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-indigo-50 dark:hover:bg-indigo-950/40"><Avatar src={user?.avatar?.url} name={user?.fullName || user?.email} size="sm"/><div className="hidden sm:block"><p className="max-w-48 truncate text-xs font-semibold text-slate-800 transition group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-300">{user?.fullName || 'Worker'}</p><p className="max-w-48 truncate text-[11px] text-slate-400">{user?.email}</p></div></Link></div>
        </header>
        <main className="portal-main mx-auto w-full max-w-[1680px] flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-8 lg:px-10 lg:pb-10"><Outlet /></main>
      </div>
      <nav className="portal-mobile-nav fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200/80 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-surface-900/95 lg:hidden">
        {navItems.map(({ icon: Icon, label, path }) => <NavLink key={path} to={path} end={path === '/worker/home'} className={({ isActive }) => `mobile-nav-item ${isActive ? 'mobile-nav-active' : ''}`}><Icon className="h-5 w-5"/><span>{label}</span></NavLink>)}
      </nav>
    </div>
  );
};

export default WorkerLayout;
