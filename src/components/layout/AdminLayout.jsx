import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import {
  HiOutlineLogout,
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineTrendingUp,
  HiMenuAlt3,
  HiX,
} from 'react-icons/hi';

const navItems = [
  { icon: HiOutlineHome, label: 'Dashboard', path: '/admin' },
  { icon: HiOutlineUsers, label: 'Users', path: '/admin/users' },
  { icon: HiOutlineShieldCheck, label: 'Verifications', path: '/admin/verifications' },
  { icon: HiOutlineBriefcase, label: 'Jobs', path: '/admin/jobs' },
  { icon: HiOutlineExclamationCircle, label: 'Reports', path: '/admin/reports' },
  { icon: HiOutlineTrendingUp, label: 'Analytics', path: '/admin/analytics' },
];

const AdminNavigation = ({ onNavigate }) => (
  <nav aria-label="Admin navigation" className="space-y-1 px-3 py-5">
    {navItems.map(({ icon: Icon, label, path }) => (
      <NavLink
        key={path}
        to={path}
        end={path === '/admin'}
        onClick={onNavigate}
        className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/[.07] hover:text-white'}`}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {label}
      </NavLink>
    ))}
  </nav>
);

const AdminLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const currentPage = navItems.find(({ path }) => path === location.pathname)?.label || 'Admin';

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/auth/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 transition-colors dark:bg-surface-950 dark:text-white">
      <aside className="portal-sidebar fixed inset-y-0 left-0 z-40 hidden w-64 flex-col text-white lg:flex">
        <div className="flex h-[68px] items-center gap-3 border-b border-white/10 px-6">
          <span className="brand-mark h-9 w-9 rounded-xl bg-rose-500 text-sm">A</span>
          <div><p className="font-bold">SkillBridge</p><p className="text-[10px] uppercase tracking-widest text-slate-400">Admin workspace</p></div>
        </div>
        <AdminNavigation />
        <div className="mt-auto border-t border-white/10 p-3">
          <p className="truncate px-3 pb-2 text-xs text-slate-400">{user?.email}</p>
          <button onClick={handleLogout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-300">
            <HiOutlineLogout className="h-5 w-5" /> Sign out
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileNavOpen(false)} aria-label="Close menu" />
          <div className="portal-sidebar absolute inset-y-0 left-0 flex w-[min(84vw,320px)] flex-col text-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
              <div className="flex items-center gap-3"><span className="brand-mark h-9 w-9 rounded-xl bg-rose-500 text-sm">A</span><span className="font-bold">Admin workspace</span></div>
              <button onClick={() => setMobileNavOpen(false)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10" aria-label="Close menu"><HiX className="h-5 w-5" /></button>
            </div>
            <AdminNavigation onNavigate={() => setMobileNavOpen(false)} />
            <div className="mt-auto border-t border-white/10 p-3">
              <p className="truncate px-3 pb-2 text-xs text-slate-400">{user?.email}</p>
              <button onClick={handleLogout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm text-slate-300 hover:bg-rose-500/10 hover:text-rose-300">
                <HiOutlineLogout className="h-5 w-5" /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-200 bg-white/95 px-4 backdrop-blur-xl dark:border-surface-800 dark:bg-surface-900/95 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNavOpen(true)} className="rounded-xl p-2 text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800 lg:hidden" aria-label="Open admin menu" aria-expanded={mobileNavOpen}>
              <HiMenuAlt3 className="h-5 w-5" />
            </button>
            <div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-surface-400">Admin workspace</p><p className="text-sm font-semibold">{currentPage}</p></div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4"><DarkModeToggle /><span className="hidden max-w-56 truncate text-xs text-surface-500 sm:block">{user?.email}</span></div>
        </header>
        <main className="mx-auto w-full max-w-[1680px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
