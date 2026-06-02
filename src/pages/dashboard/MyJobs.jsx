import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchMyJobs, fetchAvailableJobs } from '@/store/slices/jobSlice';
import Card from '@/components/ui/Card';
import JobCard from '@/components/shared/JobCard';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const MyJobs = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { jobs, loading } = useAppSelector((state) => state.job);
  const { city } = useAppSelector((state) => state.location);

  const isCustomer = user?.role === 'customer'; 
  const [viewMode, setViewMode] = useState('all');

  useEffect(() => {
    if (!user) return;

    if (isCustomer) {
      dispatch(fetchMyJobs({}));
    } else {
      dispatch(fetchAvailableJobs({}));
    }
  }, [dispatch, isCustomer, user, city]); 

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  // Frontend filtering for the hybrid model (Worker view)
  const filteredJobs = jobs.filter(job => {
    if (viewMode === 'all') return true;
    // Now serviceType exists on the job object from the backend!
    const isDigital = job.serviceType === 'digital';
    if (viewMode === 'digital') return isDigital;
    if (viewMode === 'local') return !isDigital;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">
            {isCustomer ? 'My Posted Jobs' : 'Find Work'}
          </h1>
          <p className="text-surface-500 mt-1">
            {isCustomer ? 'Track and manage your active projects.' : 'Find local and digital opportunities.'}
          </p>
        </div>
        {isCustomer && (
          <Link to="/dashboard/post-job">
            <Button>+ Post Job</Button>
          </Link>
        )}
      </div>

      {/* HYBRID WORKER TOGGLE */}
      {!isCustomer && (
        <div className="flex gap-3 mb-8 bg-white p-2 rounded-xl shadow-soft border border-surface-200 w-fit">
          <button 
            onClick={() => setViewMode('all')} 
            className={`px-4 py-2 rounded-lg font-medium transition ${viewMode === 'all' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-surface-500 hover:bg-surface-50'}`}
          >
            All Jobs
          </button>
          <button 
            onClick={() => setViewMode('local')} 
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${viewMode === 'local' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-surface-500 hover:bg-surface-50'}`}
          >
            📍 Local Near Me
          </button>
          <button 
            onClick={() => setViewMode('digital')} 
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${viewMode === 'digital' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-surface-500 hover:bg-surface-50'}`}
          >
            💻 Digital / Remote
          </button>
        </div>
      )}

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} linkTo={`/dashboard/jobs/${job._id}`} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <h3 className="text-xl font-semibold text-surface-800 mb-2">No jobs found</h3>
          <p className="text-surface-500 mb-6">
            {isCustomer ? "You haven't posted any jobs yet." : "There are no open jobs right now. Check back later!"}
          </p>
          {isCustomer && <Link to="/dashboard/post-job"><Button>Post Your First Job</Button></Link>}
        </Card>
      )}
    </div>
  );
};

export default MyJobs;