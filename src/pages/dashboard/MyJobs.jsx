import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchMyJobs, fetchAvailableJobs } from '@/store/slices/jobSlice';
import Card from '@/components/ui/Card';
import JobCard from '@/components/shared/JobCard';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

const MyJobs = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { jobs, loading } = useAppSelector((state) => state.job);

  const isCustomer = user?.role === 'customer';

  useEffect(() => {
    if (isCustomer) {
      dispatch(fetchMyJobs({}));
    } else {
      dispatch(fetchAvailableJobs({}));
    }
  }, [dispatch, isCustomer]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">
            {isCustomer ? 'My Posted Jobs' : 'Available Jobs'}
          </h1>
          <p className="text-surface-500 mt-1">
            {isCustomer ? 'Track and manage your active projects.' : 'Find work that matches your skills.'}
          </p>
        </div>
        {isCustomer && (
          <Link to="/dashboard/post-job">
            <Button>+ Post Job</Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-surface-500">Loading...</div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
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