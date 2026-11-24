import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import Avatar from '@/components/ui/Avatar';
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineChatAlt, HiOutlineLogout, HiOutlinePlus, HiOutlineCreditCard, HiOutlineSearch, HiOutlineBell, HiLightningBolt, HiOutlineUser } from 'react-icons/hi';

const navItems = [
  { icon: HiOutlineHome, label: 'Overview', path: '/customer/home' },
  { icon: HiOutlineSearch, label: 'Discover', path: '/customer/services' },
  { icon: HiOutlineBriefcase, label: 'Jobs', path: '/customer/jobs' },
  { icon: HiOutlineCreditCard, label: 'Wallet', path: '/customer/wallet' },
  { icon: HiOutlineChatAlt, label: 'Messages', path: '/customer/chat' },
];

const CustomerLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { proposals = [] } = useAppSelector((state) => state.customer);
  const handleLogout = async () => { await dispatch(logoutUser()); navigate('/auth/login'); };
  const displayName = user?.fullName || user?.email?.split('@')[0] || 'there';
  const mobileNavItems = [
    { icon: HiOutlineHome, label: 'Home', path: '/customer/home' },
    { icon: HiOutlineSearch, label: 'Discover', path: '/customer/services' },
    { icon: HiOutlineBriefcase, label: 'Jobs', path: '/customer/jobs' },
    { icon: HiOutlineCreditCard, label: 'Wallet', path: '/customer/wallet' },
    { icon: HiOutlineUser, label: 'Profile', path: '/customer/profile' },
  ];
  const pendingProposalCount = proposals.filter((proposal) => proposal.status === 'Pending').length;

  return (
      <div className="portal-shell min-h-screen bg-[#f5f7fc] text-surface-800 dark:bg-surface-950 dark:text-surface-100">
        <aside className="portal-sidebar fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col text-white lg:flex">
          <Link to="/customer/home" className="flex h-[68px] items-center gap-3 px-6">
            <span className="brand-mark h-9 w-9 text-sm">S</span><span className="text-[18px] font-bold tracking-tight">SkillBridge</span>
          </Link>
          <div className="mx-4 mb-3 rounded-xl border border-white/10 bg-white/[0.06] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-indigo-200">Customer space</p>
            <p className="mt-1 text-xs font-semibold">Your projects, in progress</p>
            <p className="mt-0.5 text-[11px] leading-4 text-slate-400">Find trusted talent and keep every detail together.</p>
          </div>
          <p className="px-6 pb-2 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Workspace</p>
          <nav className="flex-1 space-y-0.5 px-3">
            {navItems.map(({ icon: Icon, label, path }) => <NavLink key={path} to={path} end={path === '/customer/home'} className={({ isActive }) => `portal-nav-link ${isActive ? 'portal-nav-link-active' : ''}`}><Icon className="h-[18px] w-[18px]" />{label}{label === 'Messages' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />}</NavLink>)}
          </nav>
          <div className="mx-4 mb-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-100"><span className="h-2 w-2 rounded-full bg-emerald-400" />Your account is ready</div>
            <p className="mt-1 text-[11px] leading-4 text-slate-400">Post a job to connect with skilled professionals.</p>
            <div className="mt-2.5 flex items-center justify-between">
              <Link to="/customer/jobs/post" className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-indigo-200"><HiOutlinePlus /> Post a job</Link>
              <Link to="/customer/profile" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-200 hover:text-white">Profile <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="border-t border-white/10 p-3">
            <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"><HiOutlineLogout className="h-4 w-4" />Sign out</button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col lg:pl-[264px]">
          <header className="portal-topbar sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-surface-900/90 sm:h-[62px] sm:px-6 lg:px-8">
            <Link to="/customer/home" className="flex items-center gap-2.5 lg:hidden"><span className="brand-mark flex h-10 w-10 items-center justify-center rounded-[14px] text-xl"><HiLightningBolt /></span><span className="font-bold tracking-tight text-[17px]">SkillBridge</span></Link>
            <div className="hidden lg:block"><p className="text-[11px] font-medium text-slate-400">CUSTOMER WORKSPACE</p><p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Good to see you, {displayName}</p></div>
            <div className="ml-auto flex items-center gap-2.5 sm:gap-4">
              <DarkModeToggle />
              <button type="button" onClick={() => navigate('/customer/jobs')} aria-label={pendingProposalCount ? `${pendingProposalCount} new proposals` : 'View your jobs'} title="View job updates" className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-indigo-50 dark:border-slate-700 dark:bg-surface-800 dark:text-white lg:hidden"><HiOutlineBell className="h-5 w-5" />{pendingProposalCount > 0 && <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500 dark:border-surface-800" />}</button>
              <button type="button" onClick={handleLogout} aria-label="Sign out" title="Sign out" className="hidden rounded-lg p-2 text-surface-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-surface-300 dark:hover:bg-rose-950/30 lg:hidden"><HiOutlineLogout className="h-5 w-5" /></button>
              <div className="hidden h-7 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
              <Link to="/customer/profile" title="Open profile" className="group flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-indigo-50 dark:hover:bg-indigo-950/40">
                <Avatar src={user?.avatar?.url} name={user?.fullName || user?.email} size="sm" />
                <div className="hidden sm:block">
                  <p className="max-w-44 truncate text-xs font-semibold text-slate-800 transition group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-300">{user?.fullName || 'Customer'}</p>
                  <p className="max-w-44 truncate text-[10px] text-slate-400">{user?.email}</p>
                </div>
              </Link>
            </div>
          </header>
          <main className="portal-main mx-auto w-full max-w-[1600px] flex-1 px-3 py-3 pb-24 sm:px-5 sm:py-4 lg:px-6 lg:pb-8"> <Outlet /> </main>
        </div>
        <nav aria-label="Customer navigation" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200/80 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.25rem)] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-surface-900/95 lg:hidden">
          {mobileNavItems.map(({ icon: Icon, label, path }) => <NavLink key={path} to={path} end={path === '/customer/home'} className={({ isActive }) => `mx-0.5 flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[18px] px-1 text-[10px] font-semibold transition ${isActive ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300' : 'text-slate-500 dark:text-slate-400'}`}><Icon className="h-[22px] w-[22px]"/><span>{label}</span></NavLink>)}
        </nav>
      </div>
  );
};

export default CustomerLayout;
