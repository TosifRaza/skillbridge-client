import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSocket } from '@/hooks/useSocket';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineChatAlt, HiOutlineUserCircle, HiOutlineLogout } from 'react-icons/hi';
// import { useSocket } from '@/hooks/useSocket';

const CustomerLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/auth/login');
  };

  const navItems = [
    { icon: HiOutlineHome, label: 'Home', path: '/customer/home' },
    { icon: HiOutlineBriefcase, label: 'My Jobs', path: '/customer/jobs' },
    { icon: HiOutlineChatAlt, label: 'Messages', path: '/customer/chat' },
    { icon: HiOutlineUserCircle, label: 'Profile', path: '/customer/profile' },
  ];
   const socket = useSocket(); // Initializes socket connection for the whole portal

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-900 dark:bg-black text-white flex flex-col fixed h-full z-40">
        <div className="h-16 flex items-center px-6 border-b border-surface-800">
          <Link to="/customer/home" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
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
            
            {/* User Profile Display */}
            <div className="flex items-center gap-2">
              {/* Avatar Circle: Shows Cloudinary image or First Letter Initial */}
              <div className="w-8 h-8 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center text-sm font-bold text-primary-600 overflow-hidden">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()
                )}
              </div>
              
              {/* Name Display: Shows Full Name or falls back to Email */}
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300 hidden md:block">
                {user?.fullName || user?.email}
              </span>
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

export default CustomerLayout;