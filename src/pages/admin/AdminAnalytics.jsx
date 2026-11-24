import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchDashboardStats } from '@/store/slices/adminSlice';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { HiOutlineTrendingUp } from 'react-icons/hi';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';

// Colors for Pie Chart
const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

const AdminAnalytics = () => {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.admin);
  const jobStatusData = Object.entries(stats?.jobStatusBreakdown || {}).map(([name, value]) => ({ name, value }));

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-8 flex items-center gap-3">
        <HiOutlineTrendingUp className="w-8 h-8 text-primary-500" /> Platform Analytics
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Chart 1: Job Status Distribution (REAL DATA) */}
        <Card className="dark:bg-surface-800 p-6">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Job Status Distribution</h2>
          {jobStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={jobStatusData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                  {jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-surface-500 text-center py-10">No job data available yet.</p>
          )}
        </Card>

        {/* Jobs by category (live data) */}
        <Card className="relative p-4 dark:bg-surface-800 sm:p-6">
          <h2 className="mb-4 pr-14 text-lg font-bold text-surface-900 dark:text-white sm:text-xl">Jobs by Category</h2>
          {stats?.categoryBreakdown?.length ? <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categoryBreakdown} margin={{ left: -12, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-20} textAnchor="end" height={62} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="jobs" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer> : <p className="py-16 text-center text-sm text-surface-500">No category data available yet.</p>}
        </Card>

      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        
        {/* User growth (live data) */}
        <Card className="relative p-4 dark:bg-surface-800 sm:p-6">
          <h2 className="mb-4 pr-14 text-lg font-bold text-surface-900 dark:text-white sm:text-xl">New Users, Last 6 Months</h2>
          {stats?.userGrowth?.length ? <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.userGrowth} margin={{ left: -12, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="users" stroke="#10b981" fill="#10b98140" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer> : <p className="py-16 text-center text-sm text-surface-500">No user growth data available yet.</p>}
        </Card>

        {/* Platform commission (live data) */}
        <Card className="relative p-4 dark:bg-surface-800 sm:p-6">
          <h2 className="mb-4 pr-14 text-lg font-bold text-surface-900 dark:text-white sm:text-xl">Platform Commission, Last 6 Months</h2>
          {stats?.revenueTrend?.length ? <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.revenueTrend} margin={{ left: -12, right: 8 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer> : <p className="py-16 text-center text-sm text-surface-500">No released payment data available yet.</p>}
        </Card>

      </div>

    </div>
  );
};

export default AdminAnalytics;
