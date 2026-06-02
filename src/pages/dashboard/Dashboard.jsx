// import { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAppSelector, useAppDispatch } from '@/store/hooks';
// import { fetchMyJobs, fetchAvailableJobs } from '@/store/slices/jobSlice';
// import Card from '@/components/ui/Card';
// import Badge from '@/components/ui/Badge';
// import Button from '@/components/ui/Button';
// import JobCard from '@/components/shared/JobCard';
// import Spinner from '@/components/ui/Spinner';
// import { HiOutlineBriefcase, HiOutlineCurrencyDollar, HiOutlineClipboardList, HiOutlineStar } from 'react-icons/hi';

// const Dashboard = () => {
//   const dispatch = useAppDispatch();
//   const { user } = useAppSelector((state) => state.auth);
//   const { profile } = useAppSelector((state) => state.user);
//   const { jobs, loading } = useAppSelector((state) => state.job);

//   // 1. Use activeUser to survive page refreshes
//   const activeUser = user || profile; 
  
//   // 2. Derive role from activeUser (Fixes the 403 bug)
//   const isCustomer = activeUser?.role === 'customer';

//   useEffect(() => {
//     // 3. Do not fetch until we know who is logged in
//     if (!activeUser) return;

//     if (isCustomer) {
//       dispatch(fetchMyJobs({}));
//     } else {
//       dispatch(fetchAvailableJobs({}));
//     }
//   }, [dispatch, isCustomer, activeUser]);

//   // Filter jobs for specific stats
//   const openJobs = jobs.filter(job => job.status === 'Open');
//   const activeJobs = jobs.filter(job => job.status === 'Assigned' || job.status === 'In-Progress');

//   // 4. Show spinner while fetching user profile on refresh
//   if (!activeUser) {
//     return <div className="flex justify-center py-20"><Spinner /></div>;
//   }

//   return (
//     <div className="animate-fade-in">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-surface-900">
//             {isCustomer ? 'Your Workspace' : 'Freelancer Dashboard'}
//           </h1>
//           <p className="text-surface-500 mt-1">
//             Welcome back, {activeUser?.email}. {isCustomer ? 'Manage your projects and hire pros.' : 'Find your next opportunity.'}
//           </p>
//         </div>
//         {isCustomer && (
//           <Link to="/dashboard/post-job">
//             <Button className="shadow-glow flex items-center gap-2">
//               <HiOutlineBriefcase className="w-5 h-5" /> Post a New Job
//             </Button>
//           </Link>
//         )}
//       </div>

//       {/* Stats Grid - Upwork Style */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//         {isCustomer ? (
//           <>
//             <Card className="flex items-center gap-4 border-l-4 border-primary-500">
//               <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
//                 <HiOutlineClipboardList className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm text-surface-500">Open Jobs</p>
//                 <p className="text-2xl font-bold text-surface-900">{openJobs.length}</p>
//               </div>
//             </Card>
//             <Card className="flex items-center gap-4 border-l-4 border-yellow-500">
//               <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
//                 <HiOutlineBriefcase className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm text-surface-500">Active Projects</p>
//                 <p className="text-2xl font-bold text-surface-900">{activeJobs.length}</p>
//               </div>
//             </Card>
//             <Card className="flex items-center gap-4 border-l-4 border-green-500">
//               <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
//                 <HiOutlineCurrencyDollar className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm text-surface-500">Total Spent</p>
//                 <p className="text-2xl font-bold text-surface-900">₹0</p>
//               </div>
//             </Card>
//             <Card className="flex items-center gap-4 border-l-4 border-surface-400">
//               <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center text-surface-600">
//                 <HiOutlineStar className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm text-surface-500">Avg. Rating</p>
//                 <p className="text-2xl font-bold text-surface-900">-</p>
//               </div>
//             </Card>
//           </>
//         ) : (
//           <>
//             <Card className="flex items-center gap-4 border-l-4 border-primary-500">
//               <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
//                 <HiOutlineClipboardList className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm text-surface-500">Active Proposals</p>
//                 <p className="text-2xl font-bold text-surface-900">0</p>
//               </div>
//             </Card>
//             <Card className="flex items-center gap-4 border-l-4 border-yellow-500">
//               <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
//                 <HiOutlineBriefcase className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm text-surface-500">Active Contracts</p>
//                 <p className="text-2xl font-bold text-surface-900">0</p>
//               </div>
//             </Card>
//             <Card className="flex items-center gap-4 border-l-4 border-green-500">
//               <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
//                 <HiOutlineCurrencyDollar className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm text-surface-500">Total Earned</p>
//                 <p className="text-2xl font-bold text-surface-900">₹0</p>
//               </div>
//             </Card>
//             <Card className="flex items-center gap-4 border-l-4 border-surface-400">
//               <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center text-surface-600">
//                 <HiOutlineStar className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-sm text-surface-500">My Rating</p>
//                 <p className="text-2xl font-bold text-surface-900">5.0</p>
//               </div>
//             </Card>
//           </>
//         )}
//       </div>

//       {/* Main Content Feed */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold text-surface-900">
//           {isCustomer ? 'Your Recent Jobs' : 'Latest Jobs For You'}
//         </h2>
//         <Link to="/dashboard/jobs" className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
//           View All
//         </Link>
//       </div>

//       {loading ? (
//         <div className="text-center py-10 text-surface-500">Loading...</div>
//       ) : jobs.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {jobs.slice(0, 6).map((job) => (
//             <JobCard key={job._id} job={job} linkTo={`/dashboard/jobs/${job._id}`} />
//           ))}
//         </div>
//       ) : (
//         <Card className="text-center py-16">
//           <h3 className="text-xl font-semibold text-surface-800 mb-2">
//             {isCustomer ? "You haven't posted any jobs yet." : "No jobs available right now."}
//           </h3>
//           <p className="text-surface-500 mb-6">
//             {isCustomer ? "Get started by posting your first project." : "Check back soon or update your profile to get matched."}
//           </p>
//           {isCustomer && <Link to="/dashboard/post-job"><Button>Post Your First Job</Button></Link>}
//         </Card>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchMyJobs, fetchAvailableJobs } from '@/store/slices/jobSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import JobCard from '@/components/shared/JobCard';
import Spinner from '@/components/ui/Spinner';
import { HiOutlineBriefcase, HiOutlineCurrencyDollar, HiOutlineClipboardList, HiOutlineStar } from 'react-icons/hi';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { jobs, loading } = useAppSelector((state) => state.job);
  
  // user is instantly populated from localStorage on refresh!
  const isCustomer = user?.role === 'customer';

  useEffect(() => {
    if (!user) return; 

    if (isCustomer) {
      dispatch(fetchMyJobs({}));
    } else {
      dispatch(fetchAvailableJobs({}));
    }
  }, [dispatch, isCustomer, user]);

  // Filter jobs for specific stats
  const openJobs = jobs.filter(job => job.status === 'Open');
  const activeJobs = jobs.filter(job => job.status === 'Assigned' || job.status === 'In-Progress');

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">
            {isCustomer ? 'Your Workspace' : 'Freelancer Dashboard'}
          </h1>
          <p className="text-surface-500 mt-1">
            Welcome back, {user?.email}. {isCustomer ? 'Manage your projects and hire pros.' : 'Find your next opportunity.'}
          </p>
        </div>
        {isCustomer && (
          <Link to="/dashboard/post-job">
            <Button className="shadow-glow flex items-center gap-2">
              <HiOutlineBriefcase className="w-5 h-5" /> Post a New Job
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Grid - Upwork Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {isCustomer ? (
          <>
            <Card className="flex items-center gap-4 border-l-4 border-primary-500">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                <HiOutlineClipboardList className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-surface-500">Open Jobs</p>
                <p className="text-2xl font-bold text-surface-900">{openJobs.length}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 border-l-4 border-yellow-500">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
                <HiOutlineBriefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-surface-500">Active Projects</p>
                <p className="text-2xl font-bold text-surface-900">{activeJobs.length}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 border-l-4 border-green-500">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <HiOutlineCurrencyDollar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-surface-500">Total Spent</p>
                <p className="text-2xl font-bold text-surface-900">₹0</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 border-l-4 border-surface-400">
              <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center text-surface-600">
                <HiOutlineStar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-surface-500">Avg. Rating</p>
                <p className="text-2xl font-bold text-surface-900">-</p>
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card className="flex items-center gap-4 border-l-4 border-primary-500">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                <HiOutlineClipboardList className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-surface-500">Active Proposals</p>
                <p className="text-2xl font-bold text-surface-900">0</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 border-l-4 border-yellow-500">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
                <HiOutlineBriefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-surface-500">Active Contracts</p>
                <p className="text-2xl font-bold text-surface-900">0</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 border-l-4 border-green-500">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <HiOutlineCurrencyDollar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-surface-500">Total Earned</p>
                <p className="text-2xl font-bold text-surface-900">₹0</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 border-l-4 border-surface-400">
              <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center text-surface-600">
                <HiOutlineStar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-surface-500">My Rating</p>
                <p className="text-2xl font-bold text-surface-900">5.0</p>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Feed */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-surface-900">
          {isCustomer ? 'Your Recent Jobs' : 'Latest Jobs For You'}
        </h2>
        <Link to="/dashboard/jobs" className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
          View All
        </Link>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.slice(0, 6).map((job) => (
            <JobCard key={job._id} job={job} linkTo={`/dashboard/jobs/${job._id}`} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <h3 className="text-xl font-semibold text-surface-800 mb-2">
            {isCustomer ? "You haven't posted any jobs yet." : "No jobs available right now."}
          </h3>
          <p className="text-surface-500 mb-6">
            {isCustomer ? "Get started by posting your first project." : "Check back soon or update your profile to get matched."}
          </p>
          {isCustomer && <Link to="/dashboard/post-job"><Button>Post Your First Job</Button></Link>}
        </Card>
      )}
    </div>
  );
};

export default Dashboard;