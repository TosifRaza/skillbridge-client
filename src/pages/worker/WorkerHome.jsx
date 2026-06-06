import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAvailableJobs } from '@/store/slices/jobSlice';
import { fetchMyApplications } from '@/store/slices/applicationSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { HiOutlineBriefcase, HiOutlineCurrencyDollar, HiOutlineClipboardList, HiOutlineSearch } from 'react-icons/hi';

const WorkerHome = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { jobs, loading: jobsLoading } = useAppSelector((state) => state.job);
  const { myApplications, loading: appsLoading } = useAppSelector((state) => state.application);

  const displayName = user?.fullName || user?.email?.split('@')[0] || 'Worker';

  useEffect(() => {
    dispatch(fetchAvailableJobs({ limit: 4 })); // Get 4 recent jobs
    dispatch(fetchMyApplications({ limit: 5 })); // Get recent applications for stats
  }, [dispatch]);

  const pendingProposals = myApplications.filter(app => app.status === 'Pending').length;
  const activeJobs = myApplications.filter(app => app.status === 'Accepted').length;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Good Morning, {displayName}!</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Find local and digital opportunities that match your skills.</p>
        </div>
        <Link to="/worker/jobs">
          <Button className="shadow-glow flex items-center gap-2">
            <HiOutlineSearch className="w-5 h-5" /> Find Work
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="flex items-center gap-4 border-l-4 border-yellow-500 dark:bg-surface-800">
          <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-yellow-600">
            <HiOutlineClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 dark:text-surface-400">Pending Proposals</p>
            {/* FIX: Changed <p> to <div> to allow Spinner inside */}
            <div className="text-2xl font-bold text-surface-900 dark:text-white">
              {appsLoading ? <Spinner size="sm" /> : pendingProposals}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-l-4 border-primary-500 dark:bg-surface-800">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600">
            <HiOutlineBriefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 dark:text-surface-400">Active Jobs</p>
            {/* FIX: Changed <p> to <div> to allow Spinner inside */}
            <div className="text-2xl font-bold text-surface-900 dark:text-white">
              {appsLoading ? <Spinner size="sm" /> : activeJobs}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-l-4 border-green-500 dark:bg-surface-800">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
            <HiOutlineCurrencyDollar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 dark:text-surface-400">Total Earned</p>
            {/* FIX: Changed <p> to <div> to keep consistency */}
            <div className="text-2xl font-bold text-surface-900 dark:text-white">₹0</div>
          </div>
        </Card>
      </div>

      {/* Recommended Jobs */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">Latest Opportunities</h2>
          <Link to="/worker/jobs" className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline">View All</Link>
        </div>

        {jobsLoading ? <div className="flex justify-center py-8"><Spinner /></div> : 
         jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map(job => (
              <Link to={`/worker/jobs/${job._id}`} key={job._id}>
                <Card hover className="dark:bg-surface-800 p-5 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="success">{job.status}</Badge>
                    <span className="text-xs text-surface-400">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-surface-900 dark:text-white mb-2">{job.title}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 flex-grow">{job.description}</p>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-surface-100 dark:border-surface-700">
                    <span className="text-sm text-surface-500 dark:text-surface-400">{job.location?.address || 'Remote'}</span>
                    <span className="font-bold text-primary-600 dark:text-primary-400">₹{job.budget}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon="🔍" title="No jobs available right now" description="Check back later or update your profile to get matched." />
        )}
      </div>
    </div>
  );
};

export default WorkerHome;