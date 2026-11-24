import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import Avatar from '@/components/ui/Avatar';
import { HiOutlineHome, HiOutlineSearch, HiOutlineClipboardList, HiOutlineChatAlt, HiOutlineLogout, HiOutlineSparkles, HiOutlineCreditCard, HiOutlineChevronDown } from 'react-icons/hi';

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
    <div className="portal-shell min-h-screen bg-[#f6f4ff] text-surface-800 dark:bg-surface-950 dark:text-surface-100">
      <aside className="worker-sidebar portal-sidebar fixed inset-y-0 left-0 z-40 hidden w-[304px] flex-col text-white lg:flex">
        <Link to="/worker/home" className="flex h-[104px] items-center gap-3 px-10">
          <span className="brand-mark h-[50px] w-[50px] rounded-[17px] text-xl">S</span>
          <span className="text-[21px] font-extrabold tracking-tight">SkillBridge</span>
        </Link>
        <div className="mb-7 px-10 pt-2">
          <p className="text-[10px] font-bold uppercase tracking-[.22em] text-violet-200">Worker space</p>
          <p className="mt-3 text-[20px] font-bold tracking-tight">Make your next move</p>
          <p className="mt-2 max-w-[220px] text-[14px] leading-[1.55] text-violet-100/80">Discover great projects and grow your reputation.</p>
        </div>
        <nav aria-label="Worker workspace" className="flex-1 space-y-1 px-6">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink key={path} to={path} end={path === '/worker/home'} className={({ isActive }) => `portal-nav-link worker-nav-link ${isActive ? 'portal-nav-link-active worker-nav-active' : ''}`}>
              <Icon className="h-[22px] w-[22px]" />{label}{label === 'Messages' && <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />}
            </NavLink>
          ))}
        </nav>
        <div className="relative mx-[18px] mb-7 overflow-hidden rounded-[22px] border border-violet-400/30 bg-gradient-to-br from-[#8c43db]/80 via-[#6132c3]/80 to-[#351e77]/90 p-5 shadow-[0_16px_38px_rgba(75,35,154,.35)]">
          <div className="absolute -right-7 -top-8 h-28 w-28 rounded-full bg-white/10 blur-xl" />
          <span aria-hidden="true" className="absolute right-4 top-3 text-[54px] drop-shadow-lg">??</span>
          <HiOutlineSparkles className="relative h-6 w-6 text-amber-200" />
          <p className="relative mt-3 text-[16px] font-bold">Stand out to clients</p>
          <p className="relative mt-1.5 text-[12px] leading-[1.45] text-violet-100/90">A complete profile helps the right customers find you.</p>
          <Link to="/worker/profile" className="relative mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 text-[13px] font-semibold text-white transition hover:bg-white/20">Improve profile <span aria-hidden="true">?</span></Link>
        </div>
        <div className="border-t border-white/10 px-8 py-5">
          <button onClick={handleLogout} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-2 text-[15px] font-medium text-violet-100/85 transition hover:bg-white/10 hover:text-white"><HiOutlineLogout className="h-5 w-5" />Sign out</button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-[304px]">
        <header className="portal-topbar sticky top-0 z-30 flex h-[90px] items-center justify-between border-b border-violet-100/80 bg-white/85 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-surface-900/90 sm:px-7 lg:px-8">
          <Link to="/worker/home" className="flex items-center gap-2.5 lg:hidden"><span className="brand-mark h-9 w-9">S</span><span className="font-bold tracking-tight">SkillBridge</span></Link>
          <div className="hidden items-center gap-4 lg:flex">
            <span className="flex h-[54px] w-[54px] items-center justify-center rounded-[17px] bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300"><HiOutlineSparkles className="h-7 w-7" /></span>
            <div><p className="text-[19px] font-bold leading-tight text-slate-900 dark:text-white">Good to see you, {displayName}</p><p className="mt-1 text-[14px] text-slate-500 dark:text-slate-400">Find, apply, and manage your work on SkillBridge.</p></div>
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
        <main className="portal-main worker-main mx-auto w-full max-w-[1700px] flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-7 lg:px-10 lg:pb-10 lg:pt-7"><Outlet /></main>
      </div>
      <nav className="portal-mobile-nav fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200/80 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-surface-900/95 lg:hidden">
        {navItems.map(({ icon: Icon, label, path }) => <NavLink key={path} to={path} end={path === '/worker/home'} className={({ isActive }) => `mobile-nav-item ${isActive ? 'mobile-nav-active' : ''}`}><Icon className="h-5 w-5"/><span>{label}</span></NavLink>)}
      </nav>
    </div>
  );
};

export default WorkerLayout;
