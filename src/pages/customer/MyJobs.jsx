import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyJobs, deleteJob, closeJob } from '@/store/slices/jobSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import EmptyState from '@/components/ui/EmptyState';
import Spinner from '@/components/ui/Spinner';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineX } from 'react-icons/hi';

const statusVariant = {
  Open: 'success', Assigned: 'primary', 'In-Progress': 'warning', Completed: 'gray', Cancelled: 'danger', Closed: 'gray',
};

const MyJobs = () => {
  const dispatch = useAppDispatch();
  const { jobs, loading } = useAppSelector((state) => state.job);
  const [activeTab, setActiveTab] = useState('Active');

  useEffect(() => {
    dispatch(fetchMyJobs({}));
  }, [dispatch]);

  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'Active') return ['Open', 'Assigned', 'In-Progress'].includes(job.status);
    if (activeTab === 'Completed') return job.status === 'Completed';
    if (activeTab === 'Cancelled') return ['Cancelled', 'Closed'].includes(job.status);
    return true;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await dispatch(deleteJob(id));
    }
  };

  const handleClose = async (id) => {
    if (window.confirm('Are you sure you want to close this job?')) {
      await dispatch(closeJob(id));
    }
  };

  if (loading && jobs.length === 0) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">My Jobs</h1>
        <Link to="/customer/jobs/post"><Button className="flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Post Job</Button></Link>
      </div>

      <Tabs 
        tabs={[
          { value: 'Active', label: 'Active' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Cancelled', label: 'Cancelled' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6 space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <Card key={job._id} className="dark:bg-surface-800 p-6 hover:shadow-medium transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
                    <span className="text-xs text-surface-400">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link to={`/customer/jobs/${job._id}`} className="text-xl font-bold text-surface-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition">
                    {job.title}
                  </Link>
                  <p className="text-surface-500 dark:text-surface-400 mt-1 text-sm line-clamp-2">{job.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-surface-600 dark:text-surface-300">
                    <span className="font-bold text-primary-600 dark:text-primary-400">₹{job.budget}</span>
                    <span>{job.location?.address || 'Remote'}</span>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 justify-end">
                  {job.status === 'Open' && (
                    <>
                      <Button variant="outline" size="sm" className="flex items-center gap-1"><HiOutlinePencil className="w-4 h-4" /> Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleClose(job._id)} className="flex items-center gap-1"><HiOutlineX className="w-4 h-4" /> Close</Button>
                    </>
                  )}
                  {['Open', 'Cancelled', 'Closed'].includes(job.status) && (
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(job._id)} className="text-red-500 flex items-center gap-1"><HiOutlineTrash className="w-4 h-4" /> Delete</Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState icon="💼" title={`No ${activeTab} Jobs`} description="You haven't posted any jobs in this category yet." actionLabel="Post a Job" onAction={() => navigate('/customer/jobs/post')} />
        )}
      </div>
    </div>
  );
};

export default MyJobs;