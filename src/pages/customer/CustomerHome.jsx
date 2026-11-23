import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyJobs } from '@/store/slices/jobSlice';
import { fetchWorkers, fetchCustomerProposals } from '@/store/slices/customerSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import StarRating from '@/components/ui/StarRating';
import DirectHireModal from '@/components/shared/DirectHireModal';
import { PHASE_1_SERVICES } from '@/constants/services';
import {
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineChatAlt,
  HiOutlineBookmark,
  HiOutlineCog,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineUser,
} from 'react-icons/hi';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const calculateProfileCompletion = (user) => {
  if (!user) return 0;
  let score = 0;
  if (user.fullName && user.fullName.trim()) score += 25;
  if (user.phone && user.phone.trim()) score += 25;
  if (user.avatar?.url) score += 25;
  if (user.addresses && user.addresses.length > 0) score += 25;
  return score;
};

// Fallback featured providers if database has few workers initially
const fallbackProviders = [
  {
    _id: 'sample-1',
    name: 'Arjun Cleaning Services',
    rating: 4.8,
    reviews: 128,
    specialty: 'Home Cleaning',
    price: '₹449',
    initial: 'A',
  },
  {
    _id: 'sample-2',
    name: 'Rahul Movers',
    rating: 4.9,
    reviews: 256,
    specialty: 'Moving Help',
    price: '₹699',
    initial: 'R',
  },
  {
    _id: 'sample-3',
    name: 'Priya Gardens',
    rating: 4.7,
    reviews: 85,
    specialty: 'Gardening',
    price: '₹399',
    initial: 'P',
  },
];

const CustomerHome = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { jobs = [] } = useAppSelector((state) => state.job);
  const { workers = [], proposals = [] } = useAppSelector((state) => state.customer);
  const [selectedProviderForHire, setSelectedProviderForHire] = useState(null);

  useEffect(() => {
    dispatch(fetchMyJobs({ limit: 100 }));
    dispatch(fetchWorkers());
    dispatch(fetchCustomerProposals());
  }, [dispatch]);

  const displayName = user?.fullName || user?.email?.split('@')[0] || 'Customer';
  const profileCompletion = calculateProfileCompletion(user);

  // Dynamic Metrics calculated from real customer jobs and proposals
  const activeJobsCount = jobs.filter((j) =>
    ['Open', 'In-Progress', 'Assigned'].includes(j.status)
  ).length;

  const completedJobsCount = jobs.filter((j) => j.status === 'Completed').length;

  const pendingProposalsCount = proposals.filter(
    (p) => p.status === 'Pending'
  ).length;

  const totalSpent = jobs
    .filter((j) => ['Completed', 'Assigned', 'In-Progress'].includes(j.status))
    .reduce((sum, j) => sum + (Number(j.budget) || 0), 0);

  const formattedSpent =
    totalSpent >= 1000
      ? `₹${(totalSpent / 1000).toFixed(1)}k`
      : `₹${totalSpent.toLocaleString('en-IN')}`;

  const stats = [
    {
      label: 'Active Jobs',
      value: activeJobsCount,
      icon: HiOutlineBriefcase,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30',
      link: '/customer/jobs',
    },
    {
      label: 'Pending Proposals',
      value: pendingProposalsCount,
      icon: HiOutlineClock,
      color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30',
      link: '/customer/jobs',
    },
    {
      label: 'Completed',
      value: completedJobsCount,
      icon: HiOutlineCheckCircle,
      color: 'text-green-600 bg-green-50 dark:bg-green-900/30',
      link: '/customer/jobs',
    },
    {
      label: 'Total Spent',
      value: formattedSpent,
      icon: HiOutlineCurrencyDollar,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30',
      link: '/customer/jobs',
    },
  ];

  // Dynamic Recent Activity derived from real user jobs & proposals
  const activities = useMemo(() => {
    const list = [];

    // Recent proposals
    proposals.slice(0, 3).forEach((p) => {
      const workerName = p.worker?.fullName || p.worker?.email?.split('@')[0] || 'Worker';
      const jobTitle = p.job?.title || 'your job';
      list.push({
        id: `prop-${p._id}`,
        text: `New proposal from ${workerName} on "${jobTitle}" (₹${p.bidAmount || 0})`,
        time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recently',
        color: 'bg-indigo-500',
      });
    });

    // Recent jobs
    jobs.slice(0, 3).forEach((j) => {
      list.push({
        id: `job-${j._id}`,
        text: `Job "${j.title}" is ${j.status}`,
        time: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : 'Recently',
        color: j.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500',
      });
    });

    return list.slice(0, 4);
  }, [proposals, jobs]);

  // Providers to display: real DB workers combined with fallback to ensure rich display
  const displayedProviders = useMemo(() => {
    if (workers && workers.length > 0) {
      return workers.slice(0, 4).map((w) => ({
        _id: w._id,
        name: w.fullName || w.email.split('@')[0],
        rating: Number(w.averageRating || 5.0).toFixed(1),
        reviews: Number(w.totalReviews || 0),
        specialty: w.skills?.length > 0 ? w.skills.slice(0, 2).join(', ') : 'Home & Local Services',
        price: 'From ₹499',
        initial: (w.fullName || w.email || 'W').charAt(0).toUpperCase(),
        avatar: w.avatar?.url,
        isVerified: w.verificationStatus === 'Verified',
      }));
    }
    return fallbackProviders;
  }, [workers]);

  const handleSearch = (query) => {
    if (query && query.trim()) {
      navigate(`/customer/services?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      {/* Top Hero Banner */}
      <section className="relative mb-8 overflow-hidden rounded-[28px] bg-[#171d3c] px-6 py-7 text-white shadow-[0_22px_55px_rgba(43,48,112,.18)] sm:px-9 sm:py-9">
        <div className="absolute -right-14 -top-28 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-32 right-[24%] h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.08] px-3 py-1.5 text-[11px] font-semibold text-indigo-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              YOUR NEXT PROJECT STARTS HERE
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {getGreeting()}, {displayName}.
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-indigo-100/75">
              Bring your to-do list to life. Find a trusted professional and manage every project in one place.
            </p>
          </div>
          <Link
            to="/customer/jobs/post"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            <HiOutlineBriefcase className="h-4 w-4" />
            Post a new job <HiOutlineArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative mt-7 flex flex-wrap gap-x-7 gap-y-2 border-t border-white/10 pt-5 text-xs text-indigo-100/80">
          <span className="inline-flex items-center gap-2">
            <HiOutlineCheckCircle className="h-4 w-4 text-emerald-300" />
            One place for every project
          </span>
          <span className="inline-flex items-center gap-2">
            <HiOutlineChatAlt className="h-4 w-4 text-indigo-200" />
            Stay connected with your worker
          </span>
        </div>
      </section>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT & CENTER COLUMNS (Main Content) */}
        <div className="space-y-8 lg:col-span-2">
          {/* Real Dynamic Stats Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <Link to={stat.link} key={stat.label} className="group block">
                <Card className="flex items-center gap-4 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft dark:bg-surface-800">
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-surface-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                      {stat.value}
                    </p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{stat.label}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Functional Search Bar */}
          <SearchBar
            placeholder="What service do you need today? (e.g., Cleaning, Plumbing, Electrician)"
            className="w-full"
            onSearch={handleSearch}
          />

          {/* Recommended Providers */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-surface-900 dark:text-white">Recommended For You</h2>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  Top-rated service providers ready to assist you.
                </p>
              </div>
              <Link
                to="/customer/services"
                className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                View All <HiOutlineArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {displayedProviders.map((provider) => (
                <Card
                  key={provider._id}
                  hover
                  className="flex gap-4 p-4 dark:bg-surface-800"
                >
                  <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-xl font-bold text-primary-600 dark:bg-primary-900/40">
                    {provider.avatar ? (
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      provider.initial
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-bold text-surface-900 dark:text-white">
                        {provider.name}
                      </h3>
                      {provider.isVerified && (
                        <HiOutlineShieldCheck
                          className="h-4 w-4 text-emerald-500"
                          title="Verified Provider"
                        />
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating rating={Number(provider.rating)} size="sm" />
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {provider.rating} ({provider.reviews})
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-surface-600 dark:text-surface-300">
                      {provider.specialty}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                        {provider.price}
                      </span>
                      <div className="flex items-center gap-2">
                        {provider._id && !provider._id.startsWith('sample') && (
                          <Link to={`/customer/worker/${provider._id}`}>
                            <Button size="sm" variant="outline">
                              Profile
                            </Button>
                          </Link>
                        )}
                        <Button
                          size="sm"
                          onClick={() => setSelectedProviderForHire(provider)}
                          className="gradient-primary text-white font-medium"
                        >
                          Hire
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-surface-900 dark:text-white">Popular Categories</h2>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  Select a category to post a job directly.
                </p>
              </div>
              <Link
                to="/customer/services"
                className="text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                Browse all services
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {PHASE_1_SERVICES.map((cat) => (
                <Link
                  to={`/customer/jobs/post?category=${encodeURIComponent(cat.name)}`}
                  key={cat.id}
                  className="group flex flex-col items-center justify-center rounded-xl border border-surface-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-medium dark:border-surface-700 dark:bg-surface-800"
                >
                  <span className="mb-2 text-3xl transition group-hover:scale-110">
                    {cat.emoji}
                  </span>
                  <span className="text-center text-xs font-medium leading-tight text-surface-700 transition group-hover:text-primary-600 dark:text-surface-300 dark:group-hover:text-primary-400">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Widgets Sidebar) */}
        <div className="space-y-6">
          {/* Profile Completion Widget */}
          <Card className="p-6 text-center dark:bg-surface-800">
            <div className="relative mx-auto mb-4 h-24 w-24">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-surface-200 dark:text-surface-700"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className={profileCompletion === 100 ? 'text-emerald-500' : 'text-primary-500'}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${profileCompletion}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-surface-900 dark:text-white">
                {profileCompletion}%
              </div>
            </div>
            <h3 className="mb-1 font-bold text-surface-900 dark:text-white">Profile Completion</h3>
            <p className="mb-4 text-xs text-surface-500 dark:text-surface-400">
              {profileCompletion === 100
                ? 'Your profile is fully complete!'
                : 'Complete your profile to build trust with workers.'}
            </p>
            <Link to="/customer/profile">
              <Button
                variant={profileCompletion === 100 ? 'ghost' : 'outline'}
                size="sm"
                className="w-full"
              >
                {profileCompletion === 100 ? 'Edit Profile' : 'Complete Profile'}
              </Button>
            </Link>
          </Card>

          {/* Quick Actions Widget */}
          <Card className="p-6 dark:bg-surface-800">
            <h3 className="mb-4 font-bold text-surface-900 dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: HiOutlineBriefcase,
                  label: 'Post Job',
                  path: '/customer/jobs/post',
                  color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/30',
                },
                {
                  icon: HiOutlineChatAlt,
                  label: 'Messages',
                  path: '/customer/chat',
                  color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30',
                },
                {
                  icon: HiOutlineBookmark,
                  label: 'My Jobs',
                  path: '/customer/jobs',
                  color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30',
                },
                {
                  icon: HiOutlineCog,
                  label: 'Settings',
                  path: '/customer/profile',
                  color: 'text-surface-600 bg-surface-100 dark:bg-surface-700',
                },
              ].map((action) => (
                <Link
                  to={action.path}
                  key={action.label}
                  className={`flex flex-col items-center gap-2 rounded-xl p-3 transition hover:shadow-soft ${action.color}`}
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs font-semibold">{action.label}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Real Recent Activity Widget */}
          <Card className="p-6 dark:bg-surface-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-surface-900 dark:text-white">Recent Activity</h3>
              <Link to="/customer/jobs" className="text-xs text-primary-600 hover:underline">
                View all
              </Link>
            </div>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${activity.color}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-surface-700 dark:text-surface-300">
                        {activity.text}
                      </p>
                      <p className="mt-0.5 text-[10px] text-surface-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs text-surface-400">No recent activity yet.</p>
                <Link
                  to="/customer/jobs/post"
                  className="mt-2 inline-block text-xs font-semibold text-primary-600 hover:underline"
                >
                  Post your first job →
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Direct Hire Modal */}
      <DirectHireModal
        isOpen={Boolean(selectedProviderForHire)}
        onClose={() => setSelectedProviderForHire(null)}
        provider={selectedProviderForHire}
      />
    </div>
  );
};

export default CustomerHome;
