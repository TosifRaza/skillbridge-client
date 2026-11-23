import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAvailableJobs } from '@/store/slices/jobSlice';
import { fetchMyApplications } from '@/store/slices/applicationSlice';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import {
  HiOutlineArrowRight,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlineCurrencyDollar,
  HiOutlineLocationMarker,
  HiOutlineSearch,
} from 'react-icons/hi';

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  : 'Flexible';

const WorkerHome = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { jobs, totalJobs, loading: jobsLoading } = useAppSelector((state) => state.job);
  const { myApplications, loading: appsLoading } = useAppSelector((state) => state.application);
  const displayName = user?.fullName || user?.email?.split('@')[0] || 'Worker';

  useEffect(() => {
    dispatch(fetchAvailableJobs({ limit: 6 }));
    dispatch(fetchMyApplications({ limit: 20 }));
  }, [dispatch]);

  const pendingProposals = myApplications.filter((application) => application.status === 'Pending').length;
  const activeJobs = myApplications.filter((application) => application.status === 'Accepted').length;
  const featuredJob = jobs[0];
  const profileSkills = user?.skills?.slice(0, 3) || [];
  const statCards = [
    { label: 'Pending proposals', value: pendingProposals, description: 'Waiting for client decisions', icon: HiOutlineClipboardList, iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300', glowClass: 'bg-amber-300/20', accentClass: 'from-amber-400 to-orange-400' },
    { label: 'Active contracts', value: activeJobs, description: 'Projects currently in progress', icon: HiOutlineBriefcase, iconClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300', glowClass: 'bg-indigo-300/20', accentClass: 'from-indigo-500 to-violet-500' },
    { label: 'Total earned', value: formatCurrency(0), description: 'Lifetime SkillBridge earnings', icon: HiOutlineCurrencyDollar, iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300', glowClass: 'bg-emerald-300/20', accentClass: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <div className="animate-fade-in">
      <section className="relative mb-8 overflow-hidden rounded-[30px] bg-[#151a38] text-white shadow-[0_24px_65px_rgba(35,39,92,.22)]">
        <div className="absolute -left-20 -top-28 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-[28%] h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative grid gap-8 px-6 py-7 sm:px-9 sm:py-9 lg:grid-cols-5 lg:items-stretch lg:gap-10">
          <div className="flex min-w-0 flex-col justify-center lg:col-span-3">
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-indigo-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />Worker marketplace</span>
              <span className="rounded-full border border-indigo-300/15 bg-indigo-300/10 px-3 py-1.5 text-[10px] font-semibold text-indigo-100/80">{jobsLoading ? 'Finding projects...' : `${totalJobs || jobs.length} open projects`}</span>
            </div>
            <p className="text-xs font-semibold text-indigo-200/75">Welcome back, {displayName}</p>
            <h1 className="mt-2 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Turn your skills into your next great project.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100/70">Discover trusted local opportunities, send strong proposals and manage every client relationship from one professional workspace.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/worker/jobs" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-indigo-50"><HiOutlineSearch className="h-4 w-4" />Find new work <HiOutlineArrowRight className="h-4 w-4" /></Link>
              <Link to="/worker/contracts" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[.07] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[.12]"><HiOutlineBriefcase className="h-4 w-4" />My contracts</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-[11px] text-indigo-100/70">
              <span className="inline-flex items-center gap-2"><HiOutlineCheckCircle className="h-4 w-4 text-emerald-300" />Verified project listings</span>
              <span className="inline-flex items-center gap-2"><HiOutlineCheckCircle className="h-4 w-4 text-emerald-300" />Applications tracked in one place</span>
            </div>
          </div>

          <div className="relative flex min-h-[250px] flex-col rounded-[24px] border border-white/10 bg-white/[.08] p-5 shadow-[0_18px_45px_rgba(0,0,0,.16)] backdrop-blur-md lg:col-span-2">
            <div className="flex items-center justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-indigo-200">Latest opportunity</p><p className="mt-1 text-xs text-indigo-100/60">Fresh from the marketplace</p></div><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-indigo-100"><HiOutlineBriefcase className="h-4 w-4" /></span></div>
            {jobsLoading ? <div className="flex flex-1 items-center justify-center"><Spinner size="sm" /></div> : featuredJob ? <>
              <div className="mt-5 flex-1">
                <div className="flex flex-wrap gap-2"><span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-200">{featuredJob.status}</span><span className="rounded-full bg-white/[.08] px-2.5 py-1 text-[9px] font-semibold capitalize text-indigo-100/80">{featuredJob.category || 'Service project'}</span></div>
                <h2 className="mt-4 line-clamp-2 text-xl font-bold leading-snug">{featuredJob.title}</h2>
                <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-indigo-100/65"><span className="inline-flex min-w-0 items-center gap-1.5"><HiOutlineLocationMarker className="h-4 w-4 shrink-0" /><span className="max-w-36 truncate">{featuredJob.location?.address || 'Remote'}</span></span><span className="inline-flex items-center gap-1.5"><HiOutlineCalendar className="h-4 w-4" />{formatDate(featuredJob.deadline)}</span></div>
                {profileSkills.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">{profileSkills.map((skill) => <span key={skill} className="rounded-lg border border-white/10 bg-white/[.06] px-2 py-1 text-[9px] text-indigo-100/70">{skill}</span>)}</div>}
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4"><div><p className="text-[9px] uppercase tracking-wider text-indigo-200/55">Budget</p><p className="mt-0.5 text-xl font-bold text-white">{formatCurrency(featuredJob.budget)}</p></div><Link to={`/worker/jobs/${featuredJob._id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-400">View project <HiOutlineArrowRight className="h-4 w-4" /></Link></div>
            </> : <div className="flex flex-1 flex-col items-center justify-center px-4 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><HiOutlineSearch className="h-5 w-5 text-indigo-200" /></span><p className="mt-3 text-sm font-semibold">New projects are coming</p><p className="mt-1 text-[11px] leading-5 text-indigo-100/55">Keep your profile updated to be ready.</p></div>}
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-5 md:grid-cols-3">
        {statCards.map(({ label, value, description, icon: Icon, iconClass, glowClass, accentClass }) => (
          <Link key={label} to="/worker/contracts" className="group relative min-w-0 overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,.05)] transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_42px_rgba(79,70,229,.12)] dark:border-slate-800 dark:bg-surface-900 dark:hover:border-indigo-800">
            <span className={`absolute -right-8 -top-10 h-28 w-28 rounded-full blur-2xl transition duration-300 group-hover:scale-125 ${glowClass}`} />
            <span className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${accentClass}`} />
            <div className="relative flex items-start justify-between gap-4"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}><Icon className="h-5 w-5" /></span><span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition group-hover:border-indigo-200 group-hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800"><HiOutlineArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span></div>
            <div className="relative mt-5 flex items-end justify-between gap-3"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-400">{label}</p><p className="mt-1.5 truncate text-[11px] text-slate-500 dark:text-slate-400">{description}</p></div><div className="shrink-0 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{appsLoading && label !== 'Total earned' ? <Spinner size="sm" /> : value}</div></div>
          </Link>
        ))}
      </section>

      <section className="mb-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-indigo-500">Recommended for you</p><h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">Latest opportunities</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Fresh projects you can review and apply to today.</p></div>
          <Link to="/worker/jobs" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-indigo-600 shadow-soft transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-700 dark:bg-surface-900 dark:text-indigo-300 dark:hover:bg-indigo-950/40">Browse all <HiOutlineArrowRight className="h-4 w-4" /></Link>
        </div>

        {jobsLoading ? <div className="flex justify-center py-10"><Spinner /></div> : jobs.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <Link to={`/worker/jobs/${job._id}`} key={job._id} className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,.05)] transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_20px_45px_rgba(79,70,229,.12)] dark:border-slate-800 dark:bg-surface-900 dark:hover:border-indigo-800">
                <span className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-100/50 blur-3xl transition duration-500 group-hover:scale-125 dark:bg-indigo-900/20" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{job.status}</span>{job.serviceType && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold capitalize text-slate-500 dark:bg-slate-800 dark:text-slate-300">{job.serviceType}</span>}</div>
                  <span className="shrink-0 text-[10px] font-medium text-slate-400">Posted {formatDate(job.createdAt)}</span>
                </div>
                <div className="relative mt-5 flex-1"><p className="mb-2 text-[10px] font-bold uppercase tracking-[.16em] text-indigo-500">{job.category || 'Service project'}</p><h3 className="text-lg font-bold leading-snug text-slate-900 transition group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{job.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{job.description}</p></div>
                <div className="relative mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800"><span className="flex min-w-0 items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400"><HiOutlineLocationMarker className="h-4 w-4 shrink-0 text-slate-400" /><span className="truncate">{job.location?.address || 'Remote'}</span></span><span className="flex min-w-0 items-center justify-end gap-2 text-[11px] text-slate-500 dark:text-slate-400"><HiOutlineCalendar className="h-4 w-4 shrink-0 text-slate-400" /><span className="truncate">{formatDate(job.deadline)}</span></span></div>
                <div className="relative mt-4 flex items-end justify-between"><div><p className="text-[10px] uppercase tracking-wide text-slate-400">Project budget</p><p className="mt-0.5 text-xl font-bold text-indigo-600 dark:text-indigo-300">{formatCurrency(job.budget)}</p></div><span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white transition group-hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:group-hover:bg-indigo-300">View job <HiOutlineArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span></div>
              </Link>
            ))}
          </div>
        ) : <EmptyState icon="🔍" title="No jobs available right now" description="Check back later or update your profile to get matched." />}
      </section>
    </div>
  );
};

export default WorkerHome;
