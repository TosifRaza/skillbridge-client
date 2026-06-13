import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchDashboardStats } from '@/store/slices/adminSlice';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { HiOutlineTrendingUp, HiOutlineExclamationCircle } from 'react-icons/hi';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';

// Colors for Pie Chart
const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

// MOCK DATA: Time-series aggregation pipelines need to be built on the backend later.
const mockUserGrowth = [
  { month: 'Jan', users: 40 }, { month: 'Feb', users: 65 }, { month: 'Mar', users: 80 },
  { month: 'Apr', users: 150 }, { month: 'May', users: 200 }, { month: 'Jun', users: 280 },
];

const mockRevenue = [
  { month: 'Jan', revenue: 2400 }, { month: 'Feb', revenue: 1398 }, { month: 'Mar', revenue: 9800 },
  { month: 'Apr', revenue: 3908 }, { month: 'May', revenue: 4800 }, { month: 'Jun', revenue: 7500 },
];

const mockCategories = [
  { name: 'Cleaning', jobs: 45 }, { name: 'Moving', jobs: 30 }, { name: 'Gardening', jobs: 20 },
  { name: 'Web Dev', jobs: 50 }, { name: 'Plumbing', jobs: 15 },
];

const AdminAnalytics = () => {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.admin);
  const [jobStatusData, setJobStatusData] = useState([]);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Transform real API data into Recharts format when stats load
  useEffect(() => {
    if (stats?.jobStatusBreakdown) {
      const formattedData = Object.entries(stats.jobStatusBreakdown).map(([name, value]) => ({ name, value }));
      setJobStatusData(formattedData);
    }
  }, [stats]);

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

        {/* Chart 2: Category Breakdown (MOCK DATA) */}
        <Card className="dark:bg-surface-800 p-6 relative">
           <div className="absolute top-4 right-4 z-10">
             <span className="flex items-center gap-1 text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full font-medium">
               <HiOutlineExclamationCircle className="w-3 h-3"/> Mock Data
             </span>
           </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Jobs by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockCategories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="jobs" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        
        {/* Chart 3: User Growth (MOCK DATA) */}
        <Card className="dark:bg-surface-800 p-6 relative">
           <div className="absolute top-4 right-4 z-10">
             <span className="flex items-center gap-1 text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full font-medium">
               <HiOutlineExclamationCircle className="w-3 h-3"/> Mock Data
             </span>
           </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">User Growth Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockUserGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="users" stroke="#10b981" fill="#10b98140" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Chart 4: Revenue Trends (MOCK DATA) */}
        <Card className="dark:bg-surface-800 p-6 relative">
           <div className="absolute top-4 right-4 z-10">
             <span className="flex items-center gap-1 text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full font-medium">
               <HiOutlineExclamationCircle className="w-3 h-3"/> Mock Data
             </span>
           </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Platform Revenue Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockRevenue}>
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
          </ResponsiveContainer>
        </Card>

      </div>

    </div>
  );
};

export default AdminAnalytics;