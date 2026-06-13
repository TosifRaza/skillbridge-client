import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { HiOutlineUsers, HiOutlineBriefcase, HiOutlineCurrencyDollar, HiOutlineShieldCheck } from 'react-icons/hi';

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/dashboard');
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-8">Platform Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="flex items-center gap-4 border-l-4 border-primary-500 dark:bg-surface-800 p-6">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600">
            <HiOutlineUsers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 dark:text-surface-400">Total Customers</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats?.totalUsers || 0}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-l-4 border-green-500 dark:bg-surface-800 p-6">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
            <HiOutlineShieldCheck className="w-6 h-6" /> 
          </div>
          <div>
            <p className="text-sm text-surface-500 dark:text-surface-400">Total Workers</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats?.totalWorkers || 0}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-l-4 border-yellow-500 dark:bg-surface-800 p-6">
          <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-yellow-600">
            <HiOutlineBriefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 dark:text-surface-400">Total Jobs</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats?.totalJobs || 0}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-l-4 border-blue-500 dark:bg-surface-800 p-6">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
            <HiOutlineCurrencyDollar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 dark:text-surface-400">Platform Revenue</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">₹{stats?.totalRevenue || 0}</p>
          </div>
        </Card>
      </div>

      {/* Job Status Breakdown */}
      <Card className="dark:bg-surface-800 p-6">
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Job Status Breakdown</h2>
        {stats?.jobStatusBreakdown ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Object.entries(stats.jobStatusBreakdown).map(([status, count]) => (
              <div key={status} className="text-center p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{count}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-surface-500 dark:text-surface-400">No job data available.</p>
        )}
      </Card>
    </div>
  );
};

export default AdminHome;