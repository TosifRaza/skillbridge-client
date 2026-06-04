import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import Avatar from '@/components/ui/Avatar';
import { HiOutlineHome, HiOutlineSearch, HiOutlineClipboardList, HiOutlineChatAlt, HiOutlineUserCircle, HiOutlineLogout } from 'react-icons/hi';

const WorkerLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/auth/login');
  };

  const navItems = [
    { icon: HiOutlineHome, label: 'Home', path: '/worker/home' },
    { icon: HiOutlineSearch, label: 'Find Work', path: '/worker/jobs' },
    { icon: HiOutlineClipboardList, label: 'My Contracts', path: '/worker/contracts' },
    { icon: HiOutlineChatAlt, label: 'Messages', path: '/worker/chat' },
    { icon: HiOutlineUserCircle, label: 'Profile', path: '/worker/profile' },
  ];

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-900 dark:bg-black text-white flex flex-col fixed h-full z-40">
        <div className="h-16 flex items-center px-6 border-b border-surface-800">
          <Link to="/worker/home" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="text-xl font-bold">SkillBridge</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-surface-300 hover:bg-surface-800 hover:text-white transition">
              <item.icon className="w-5 h-5" /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-surface-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-surface-800 w-full transition">
            <HiOutlineLogout className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 sticky top-0 z-30 flex items-center justify-between px-8 transition-colors">
          <div />
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <div className="flex items-center gap-2">
              <Avatar name={user?.email} size="sm" />
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300 hidden md:block">{user?.email}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WorkerLayout;