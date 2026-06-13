import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminJobs, deleteJob } from '@/store/slices/adminSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';

const statusVariant = {
  Open: 'success', Assigned: 'primary', 'In-Progress': 'warning', Completed: 'gray', Cancelled: 'danger', Closed: 'gray',
};

const AdminJobs = () => {
  const dispatch = useAppDispatch();
  const { jobs, totalJobs, loading } = useAppSelector((state) => state.admin);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAdminJobs({ status: statusFilter }));
  }, [dispatch, statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job permanently? This will also delete all associated applications.')) {
      await dispatch(deleteJob(id));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">Jobs Management ({totalJobs})</h1>

      <Card className="dark:bg-surface-800 p-4 mb-6">
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-700 rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Assigned">Assigned</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </Card>

      <div className="overflow-x-auto shadow-soft border border-surface-200 dark:border-surface-700 sm:rounded-lg">
        <table className="w-full text-sm text-left text-surface-500 dark:text-surface-400">
          <thead className="text-xs text-surface-700 dark:text-surface-300 uppercase bg-surface-50 dark:bg-surface-700">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Budget</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
            {jobs.map(job => (
              <tr key={job._id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                <td className="px-6 py-4 font-medium text-surface-900 dark:text-white">{job.title}</td>
                <td className="px-6 py-4">{job.customer?.email || 'Unknown'}</td>
                <td className="px-6 py-4 font-bold text-primary-600 dark:text-primary-400">₹{job.budget}</td>
                <td className="px-6 py-4"><Badge variant={statusVariant[job.status]}>{job.status}</Badge></td>
                <td className="px-6 py-4">
                  <Button size="sm" variant="danger" onClick={() => handleDelete(job._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJobs;