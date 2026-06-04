// import { Link } from 'react-router-dom';
// import { useAppSelector } from '@/store/hooks';
// import Card from '@/components/ui/Card';
// import Button from '@/components/ui/Button';
// import { PHASE_1_SERVICES } from '@/constants/services';
// import { HiOutlineBriefcase, HiOutlineSearch, HiOutlineChatAlt, HiOutlineUserCircle } from 'react-icons/hi';

// const CustomerHome = () => {
//   const { user } = useAppSelector((state) => state.auth);

//   // FIX: Use fullName if available, otherwise fall back to the email prefix
//   const displayName = user?.fullName || user?.email?.split('@')[0] || 'User';

//   const quickActions = [
//     { icon: HiOutlineBriefcase, label: 'Post a Job', path: '/customer/jobs/post', color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' },
//     { icon: HiOutlineSearch, label: 'Find Services', path: '/customer/services', color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
//     { icon: HiOutlineChatAlt, label: 'Messages', path: '/customer/chat', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
//     { icon: HiOutlineUserCircle, label: 'My Profile', path: '/customer/profile', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
//   ];

//   return (
//     <div className="animate-fade-in">
//       <div className="mb-8">
//         {/* FIX APPLIED HERE */}
//         <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Welcome back, {displayName}!</h1>
//         <p className="text-surface-500 dark:text-surface-400 mt-1">Ready to get things done? Hire verified professionals today.</p>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
//         {quickActions.map((action) => (
//           <Link to={action.path} key={action.label}>
//             <Card hover className="p-5 flex flex-col items-center justify-center text-center h-full dark:bg-surface-800">
//               <div className={`p-3 rounded-xl ${action.color} mb-3`}>
//                 <action.icon className="w-6 h-6" />
//               </div>
//               <p className="font-semibold text-surface-800 dark:text-surface-200 text-sm">{action.label}</p>
//             </Card>
//           </Link>
//         ))}
//       </div>

//       {/* Recommended Services */}
//       <div className="mb-10">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-surface-900 dark:text-white">Popular Services</h2>
//           <Link to="/customer/services" className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline">View All</Link>
//         </div>
//         <div className="grid sm:grid-cols-3 gap-4">
//           {PHASE_1_SERVICES.slice(0, 3).map(service => (
//             // Link directly to posting a job for this specific category
//             <Link to="/customer/jobs/post" key={service.id}>
//               <Card hover className="flex items-center gap-4 p-4 dark:bg-surface-800">
//                 <span className="text-3xl">{service.emoji}</span>
//                 <div>
//                   <p className="font-bold text-surface-900 dark:text-white">{service.name}</p>
//                   <p className="text-xs text-primary-600 dark:text-primary-400">From {service.startingPrice}</p>
//                 </div>
//               </Card>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerHome;



// New

import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import StarRating from '@/components/ui/StarRating';
import { PHASE_1_SERVICES } from '@/constants/services';
import { 
  HiOutlineBriefcase, HiOutlineClock, HiOutlineCheckCircle, HiOutlineCurrencyDollar, 
  HiOutlineSearch, HiOutlineLightningBolt, HiOutlineChatAlt, HiOutlineBookmark, 
  HiOutlineCog, HiOutlineUserCircle, HiOutlineStar, HiOutlineArrowRight
} from 'react-icons/hi';

// --- Helper Functions ---
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const calculateProfileCompletion = (user) => {
  if (!user) return 0;
  let score = 0;
  if (user.fullName) score += 25;
  if (user.phone) score += 25;
  if (user.avatar?.url) score += 25;
  if (user.addresses?.length > 0) score += 25;
  return score;
};

// --- Mock Data (Will be replaced by API calls in future sprints) ---
const mockStats = [
  { label: 'Active Jobs', value: 5, icon: HiOutlineBriefcase, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
  { label: 'Pending Proposals', value: 3, icon: HiOutlineClock, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30' },
  { label: 'Completed', value: 12, icon: HiOutlineCheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
  { label: 'Total Spent', value: '₹12.4k', icon: HiOutlineCurrencyDollar, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
];

const mockProviders = [
  { id: 1, name: 'Arjun Cleaning Services', rating: 4.8, reviews: 128, specialty: 'Home Cleaning', price: '₹449', initial: 'A' },
  { id: 2, name: 'Rahul Movers', rating: 4.9, reviews: 256, specialty: 'Moving Help', price: '₹699', initial: 'R' },
  { id: 3, name: 'Priya Gardens', rating: 4.7, reviews: 85, specialty: 'Gardening', price: '₹399', initial: 'P' },
];

const mockActivity = [
  { id: 1, text: 'New proposal received for "Plumbing Fix"', time: '2 mins ago' },
  { id: 2, text: 'Job "House Cleaning" marked as completed', time: '1 hour ago' },
  { id: 3, text: 'Payment of ₹500 released to worker', time: '3 hours ago' },
];

const CustomerHome = () => {
  const { user } = useAppSelector((state) => state.auth);
  const displayName = user?.fullName || user?.email?.split('@')[0] || 'User';
  const profileCompletion = calculateProfileCompletion(user);

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
          {getGreeting()}, {displayName}! 👋
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Ready to get things done? Here's your dashboard overview.</p>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ========================================== */}
        {/* LEFT & CENTER COLUMNS (Main Content)      */}
        {/* ========================================== */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockStats.map((stat) => (
              <Card key={stat.label} className="dark:bg-surface-800 p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Search Bar */}
          <SearchBar placeholder="What service do you need today?" className="w-full" />

          {/* Recommended Providers */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">Recommended For You</h2>
              <Link to="/customer/services" className="text-primary-600 dark:text-primary-400 text-sm font-semibold flex items-center gap-1 hover:underline">
                View All <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {mockProviders.map((provider) => (
                <Card key={provider.id} hover className="dark:bg-surface-800 p-4 flex gap-4">
                  <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center text-xl font-bold text-primary-600 flex-shrink-0">
                    {provider.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-surface-900 dark:text-white truncate">{provider.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={provider.rating} size="sm" />
                      <span className="text-xs text-surface-500 dark:text-surface-400">{provider.rating} ({provider.reviews})</span>
                    </div>
                    <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">{provider.specialty}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">From {provider.price}</span>
                      <Link to="/customer/jobs/post"><Button size="sm">Hire</Button></Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Popular Categories</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {PHASE_1_SERVICES.map(cat => (
                <Link to="/customer/jobs/post" key={cat.id} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 hover:shadow-medium transition group">
                  <span className="text-3xl mb-2 group-hover:scale-110 transition">{cat.emoji}</span>
                  <span className="text-xs font-medium text-surface-700 dark:text-surface-300 text-center leading-tight">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN (Widgets Sidebar)             */}
        {/* ========================================== */}
        <div className="space-y-6">
          
          {/* Profile Completion Widget */}
          <Card className="dark:bg-surface-800 p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-surface-200 dark:text-surface-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                <path className="text-primary-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${profileCompletion}, 100`}></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-surface-900 dark:text-white">
                {profileCompletion}%
              </div>
            </div>
            <h3 className="font-bold text-surface-900 dark:text-white mb-1">Profile Completion</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">Complete your profile to build trust.</p>
            {profileCompletion < 100 && (
              <Link to="/customer/profile"><Button variant="outline" size="sm" className="w-full">Complete Profile</Button></Link>
            )}
          </Card>

          {/* Quick Actions Widget */}
          <Card className="dark:bg-surface-800 p-6">
            <h3 className="font-bold text-surface-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: HiOutlineBriefcase, label: 'Post Job', path: '/customer/jobs/post', color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' },
                { icon: HiOutlineChatAlt, label: 'Messages', path: '/customer/chat', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
                { icon: HiOutlineBookmark, label: 'Saved', path: '#', color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
                { icon: HiOutlineCog, label: 'Settings', path: '#', color: 'text-surface-600 bg-surface-100 dark:bg-surface-700' },
              ].map((action) => (
                <Link to={action.path} key={action.label} className={`flex flex-col items-center gap-2 p-3 rounded-xl hover:shadow-soft transition ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{action.label}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Activity Widget */}
          <Card className="dark:bg-surface-800 p-6">
            <h3 className="font-bold text-surface-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {mockActivity.map(activity => (
                <div key={activity.id} className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-surface-700 dark:text-surface-300">{activity.text}</p>
                    <p className="text-xs text-surface-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default CustomerHome;