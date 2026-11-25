import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import Avatar from '@/components/ui/Avatar';
import BrandLogo from '@/components/ui/BrandLogo';
import { HiOutlineHome, HiOutlineSearch, HiOutlineClipboardList, HiOutlineChatAlt, HiOutlineLogout, HiOutlineSparkles, HiOutlineCreditCard, HiOutlineChevronDown, HiOutlineBell } from 'react-icons/hi';

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
  const { user } = useAppSelector((state) => state.auth);
  const hasUnreadMessages = useAppSelector((state) => state.chat.conversations.some((chat) => chat.unreadCount > 0));
  const handleLogout = async () => { await dispatch(logoutUser()); navigate('/auth/login'); };
  const displayName = user?.fullName || user?.email?.split('@')[0] || 'there';

  return (
    <div className={`portal-shell ${isChat ? 'chat-workspace-shell' : 'min-h-screen'} bg-[#f6f4ff] text-surface-800 dark:bg-surface-950 dark:text-surface-100`}>
      <aside className={`worker-sidebar portal-sidebar fixed inset-y-0 left-0 z-40 hidden w-[266px] flex-col text-white lg:flex ${isChat ? '!hidden' : ''}`}>
        <Link to="/worker/home" className="flex h-[86px] items-center gap-3 border-b border-white/10 px-[30px]">
          <BrandLogo markClassName="h-10 w-10" wordmarkClassName="text-[20px] font-extrabold tracking-tight text-white" />
        </Link>

        <div className="px-4 pt-4">
          <p className="px-4 text-[11px] font-semibold uppercase tracking-[.12em] text-violet-200/90">Worker space</p>
          <div className="mt-2 flex min-h-[98px] items-center gap-3 rounded-[17px] border border-white/[.04] bg-white/[.08] px-4 py-3">
            <BrandLogo showName={false} markClassName="h-10 w-10" />
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

      <div className={isChat ? 'flex h-full min-h-0 w-full flex-col' : 'flex min-h-screen flex-col lg:pl-[266px]'}>
        <header className={`${isChat ? 'hidden' : 'portal-topbar sticky top-0 z-30 flex h-[86px] items-center justify-between border-b border-violet-100/80 bg-white/85 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-surface-900/90 sm:px-7 lg:px-7'}`}>
          <Link to="/worker/home" className="flex items-center gap-2.5 lg:hidden"><BrandLogo markClassName="h-9 w-9" wordmarkClassName={`font-bold tracking-tight ${isChat ? 'text-[19px] text-[#130e2f] dark:text-white' : 'text-[17px] text-slate-900 dark:text-white'}`} /></Link>
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
        <main className={`portal-main worker-main ${isChat ? 'h-full min-h-0 w-full flex-1 overflow-hidden p-0' : 'mx-auto w-full max-w-[1500px] flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-7 lg:px-16 lg:pb-10 lg:pt-8'}`}><Outlet /></main>
      </div>
      <nav aria-label="Worker navigation" className={`${isChat ? 'hidden' : 'portal-mobile-nav fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200/80 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-surface-900/95 lg:hidden'}`}>
        {navItems.map(({ icon: Icon, path }, index) => <NavLink key={path} to={path} end={path === '/worker/home'} className={({ isActive }) => `mobile-nav-item ${isActive ? 'mobile-nav-active' : ''} ${isChat ? `max-md:mx-0.5 max-md:min-h-[58px] max-md:font-semibold ${isActive ? 'max-md:bg-violet-100 max-md:text-violet-700 max-md:dark:bg-violet-950/40' : ''}` : ''}`}><Icon className="h-[22px] w-[22px]"/><span>{mobileLabels[index]}</span></NavLink>)}
      </nav>

    </div>
  );
};

export default WorkerLayout;
