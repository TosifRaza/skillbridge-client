// import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { logoutUser } from '@/store/slices/authSlice';
// import Avatar from '@/components/ui/Avatar';
// import Button from '@/components/ui/Button';
// import { HiOutlineHome, HiOutlineBriefcase, HiOutlineChatAlt, HiOutlineUserCircle, HiOutlineLogout, HiOutlinePlusCircle } from 'react-icons/hi';

// const DashboardLayout = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useAppSelector((state) => state.auth);

//   const isCustomer = user?.role === 'customer';

//   const handleLogout = async () => {
//     await dispatch(logoutUser());
//     navigate('/login');
//   };

//   // Common navigation items
//   const navItems = [
//     { name: 'Dashboard', icon: HiOutlineHome, path: '/dashboard' },
//     { name: isCustomer ? 'My Jobs' : 'Browse Jobs', icon: HiOutlineBriefcase, path: '/dashboard/jobs' },
//     { name: 'Messages', icon: HiOutlineChatAlt, path: '/dashboard/chat' },
//     { name: 'Profile', icon: HiOutlineUserCircle, path: '/dashboard/profile' },
//   ];

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="min-h-screen flex bg-surface-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-surface-900 text-white flex flex-col fixed h-full z-40">
//         <div className="h-16 flex items-center px-6 border-b border-surface-700">
//           <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-sm">S</div>
//           <span className="text-xl font-bold ml-2">SkillBridge</span>
//         </div>
        
//         {/* Quick Action for Customers */}
//         {isCustomer && (
//           <div className="p-4 border-b border-surface-700">
//             <Link to="/dashboard/post-job">
//               <Button className="w-full shadow-glow flex items-center justify-center gap-2">
//                 <HiOutlinePlusCircle className="w-5 h-5" /> Post a Job
//               </Button>
//             </Link>
//           </div>
//         )}

//         <nav className="flex-1 p-4 space-y-1">
//           {navItems.map((item) => (
//             <Link 
//               key={item.name} 
//               to={item.path}
//               className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
//                 isActive(item.path) 
//                   ? 'bg-surface-800 text-white shadow-medium' 
//                   : 'text-surface-300 hover:bg-surface-800 hover:text-white'
//               }`}
//             >
//               <item.icon className={`w-5 h-5 transition-colors ${isActive(item.path) ? 'text-primary-400' : 'text-surface-400 group-hover:text-primary-400'}`} />
//               <span className="font-medium">{item.name}</span>
//             </Link>
//           ))}
//         </nav>

//         <div className="p-4 border-t border-surface-700">
//           <button 
//             onClick={handleLogout}
//             className="flex items-center gap-3 p-3 w-full rounded-xl text-surface-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
//           >
//             <HiOutlineLogout className="w-5 h-5" />
//             <span className="font-medium">Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <div className="flex-1 ml-64 flex flex-col">
//         {/* Top Bar */}
//         <header className="h-16 bg-white border-b border-surface-200 sticky top-0 z-30 flex items-center justify-end px-8">
//           <div className="flex items-center gap-4">
//             <div className="text-right">
//               <p className="text-sm font-semibold text-surface-800">{user?.email || 'User'}</p>
//               <p className="text-xs text-surface-500 capitalize">{user?.role || 'Member'}</p>
//             </div>
//             <Avatar name={user?.email} />
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-8 animate-fade-in">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;








import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineChatAlt, HiOutlineUserCircle, HiOutlineLogout, HiOutlineBell, HiOutlineCog } from 'react-icons/hi';

// ... (navItems array remains the same) ...

const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const isCustomer = user?.role === 'customer';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/auth/login');
  };

  // Dummy notifications for UI
  const notifications = [
    { id: 1, text: "New proposal on 'Clean my house'", time: "2m ago", read: false },
    { id: 2, text: "Worker John Doe accepted your job", time: "1h ago", read: false },
    { id: 3, text: "Job 'Fix sink' marked as completed", time: "1d ago", read: true },
  ];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* Sidebar (Keep as built previously) */}
      <aside className="w-64 bg-surface-900 text-white flex flex-col fixed h-full z-40">
         {/* ... sidebar content ... */}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Bar - UPGRADED */}
        <header className="h-16 bg-white border-b border-surface-200 sticky top-0 z-30 flex items-center justify-between px-8">
          <div /> {/* Spacer */}
          
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifs(!showNotifs)} 
                className="relative p-2 text-surface-500 hover:text-primary-600 transition rounded-lg hover:bg-surface-50"
              >
                <HiOutlineBell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-large border border-surface-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-surface-100 flex justify-between items-center">
                    <h3 className="font-bold text-surface-900">Notifications</h3>
                    <button className="text-xs text-primary-600 font-semibold">Mark all as read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-surface-50 hover:bg-surface-50 transition cursor-pointer ${!notif.read ? 'bg-primary-50/50' : ''}`}>
                        <p className="text-sm text-surface-800">{notif.text}</p>
                        <p className="text-xs text-surface-400 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Messages Quick Link */}
            <Link to="/dashboard/chat" className="p-2 text-surface-500 hover:text-primary-600 transition rounded-lg hover:bg-surface-50">
              <HiOutlineChatAlt className="w-6 h-6" />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)} 
                className="flex items-center gap-3 hover:bg-surface-50 p-1.5 rounded-xl transition"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-surface-800">{user?.email}</p>
                  <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
                </div>
                <Avatar name={user?.email} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-large border border-surface-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-surface-100">
                    <p className="font-bold text-surface-900 truncate">{user?.email}</p>
                    <Badge variant="primary" className="mt-1 capitalize">{user?.role}</Badge>
                  </div>
                  <div className="py-2">
                    <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition">
                      <HiOutlineUserCircle className="w-4 h-4" /> My Profile
                    </Link>
                    <Link to="#" className="flex items-center gap-3 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition">
                      <HiOutlineCog className="w-4 h-4" /> Settings
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full text-left"
                    >
                      <HiOutlineLogout className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;