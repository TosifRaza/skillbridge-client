import { useEffect, useState } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import {
  HiOutlineBriefcase, HiOutlineCalendar, HiOutlineCheckCircle, HiOutlineChevronDown,
  HiOutlineChevronRight, HiOutlineClock, HiOutlineDocumentText, HiOutlineFilter,
  HiOutlineLocationMarker, HiOutlinePlay, HiOutlinePlus, HiOutlineUsers, HiOutlineXCircle,
} from 'react-icons/hi';
import api from '@/api/axiosInstance';
import ServiceIcon from '@/components/ui/ServiceIcon';
import Spinner from '@/components/ui/Spinner';

const statusFilters = [
  { value: 'applied', label: 'Applied', caption: 'In review', icon: HiOutlineDocumentText, tone: 'bg-violet-100/70 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300' },
  { value: 'active', label: 'Active', icon: HiOutlinePlay, tone: 'bg-sky-100/70 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300' },
  { value: 'completed', label: 'Completed', icon: HiOutlineCheckCircle, tone: 'bg-green-100/65 text-green-700 dark:bg-green-950/50 dark:text-green-300' },
  { value: 'cancelled', label: 'Cancelled', icon: HiOutlineXCircle, tone: 'bg-rose-100/70 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' },
];

const categoryIcons = {
  'House Cleaning': ['house-cleaning', 'bg-amber-50 dark:bg-amber-950/45'],
  'Moving Help': ['moving-help', 'bg-violet-100/80 dark:bg-violet-950/50'],
  'Moving Helper': ['moving-help', 'bg-violet-100/80 dark:bg-violet-950/50'],
  Gardening: ['gardening', 'bg-green-50 dark:bg-green-950/45'],
  'Gardening & Landscaping': ['gardening', 'bg-green-50 dark:bg-green-950/45'],
  'Event Helper': ['event-staffing', 'bg-rose-50 dark:bg-rose-950/45'],
  'Event Staffing': ['event-staffing', 'bg-rose-50 dark:bg-rose-950/45'],
  'Loading/Unloading': ['general-labor', 'bg-orange-50 dark:bg-orange-950/45'],
  'General Labor': ['general-labor', 'bg-orange-50 dark:bg-orange-950/45'],
};

const tones = {
  green: 'bg-green-50 text-green-800 dark:bg-green-950/50 dark:text-green-300',
  amber: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  blue: 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
  rose: 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
};

const getBadge = (job) => {
  if (job.status === 'Completed') return ['Completed', HiOutlineCheckCircle, tones.green];
  if (job.status === 'Cancelled' || job.status === 'Closed') return [job.status, HiOutlineXCircle, tones.rose];
  if (job.group === 'applied') return ['New Offers', HiOutlineUsers, tones.blue];
  if (job.status === 'Open') return ['Open', HiOutlineClock, tones.slate];
  if (job.paymentReported) return ['Payment sent', HiOutlineClock, tones.amber];
  if (job.customerApproved) return ['Payment due', HiOutlineClock, tones.amber];
  if (job.workSubmittedAt) return ['Review', HiOutlineClock, tones.amber];
  if (job.status === 'Assigned') return ['Assigned', HiOutlineBriefcase, tones.blue];
  return ['In Progress', HiOutlinePlay, tones.green];
};

const priceFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2, minimumFractionDigits: 0,
});
const dateFormat = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });

const JobRow = ({ job, jobsSearch }) => {
  const [status, StatusIcon, badgeTone] = getBadge(job);
  const [serviceId, iconTone] = categoryIcons[job.category] || [null, 'bg-violet-50 dark:bg-violet-950/45'];
  const location = job.serviceType === 'digital' ? 'Remote' : job.location?.address || 'Local';
  const deadline = job.deadline ? new Date(job.deadline) : null;
  const dateLabel = deadline && !Number.isNaN(deadline.getTime()) ? dateFormat.format(deadline) : null;

  return (
    <li>
      <Link to={`/customer/jobs/${job._id}`} state={{ jobsSearch }} className="grid min-h-[83px] grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-2 rounded-2xl border border-[#eae6f7] bg-white px-2.5 py-2.5 shadow-[0_2px_5px_rgba(40,19,95,0.06)] transition hover:border-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 min-[380px]:gap-x-3 min-[380px]:px-3 dark:border-slate-800 dark:bg-slate-900">
        <span aria-hidden="true" className={`col-start-1 row-span-3 row-start-1 flex h-11 w-11 items-center justify-center rounded-xl min-[380px]:h-[54px] min-[380px]:w-[54px] ${iconTone}`}>
          {serviceId ? <ServiceIcon serviceId={serviceId} className="h-9 w-9 min-[380px]:h-11 min-[380px]:w-11" /> : <HiOutlineBriefcase className="h-6 w-6 text-violet-700 dark:text-violet-300" />}
        </span>
        <span className="col-span-2 col-start-2 row-start-1 truncate text-[15px] font-bold leading-tight tracking-tight text-[#11112d] min-[380px]:text-[17px] dark:text-white">{job.title}</span>
        <span className="col-start-2 row-start-2 mt-1 flex min-w-0 items-center gap-x-1 whitespace-nowrap text-[11px] font-medium leading-tight text-slate-600 max-[359px]:col-span-2 dark:text-slate-300">
          <span className="flex min-w-0 items-center gap-1"><HiOutlineLocationMarker aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{location}</span></span>
          {dateLabel && <span className="flex shrink-0 items-center gap-1"><span aria-hidden="true">·</span><HiOutlineCalendar aria-hidden="true" className="h-3.5 w-3.5" /><time dateTime={deadline.toISOString()}>{dateLabel}</time></span>}
        </span>
        <span className="col-start-2 row-start-3 mt-1 break-words text-[17px] font-extrabold leading-tight text-[#5419ce] min-[380px]:text-[19px] dark:text-violet-300">{priceFormat.format(job.budget)}</span>
        <span className={`col-start-3 row-span-2 row-start-2 inline-flex items-center justify-self-end gap-1 whitespace-nowrap rounded-full px-1.5 py-1.5 text-[10px] font-bold leading-none max-[359px]:row-span-1 max-[359px]:row-start-3 min-[380px]:gap-1.5 min-[380px]:px-2 min-[380px]:py-2 min-[380px]:text-xs ${badgeTone}`}>
          <StatusIcon aria-hidden="true" className="h-3.5 w-3.5 min-[380px]:h-4 min-[380px]:w-4" />{status}
        </span>
        <HiOutlineChevronRight aria-hidden="true" className="col-start-4 row-span-3 row-start-1 h-4 w-4 text-slate-600 dark:text-slate-400" />
      </Link>
    </li>
  );
};

const MobileMyJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const updateOfferCount = useOutletContext();
  const view = statusFilters.find(({ value }) => value === searchParams.get('view'))?.value || 'all';
  const requestedSort = searchParams.get('sort');
  const sort = ['oldest', 'deadline'].includes(requestedSort) ? requestedSort : 'newest';
  const queryKey = `${view}:${sort}`;
  const [pageRequest, setPageRequest] = useState({ key: '', page: 1, attempt: 0 });
  const page = pageRequest.key === queryKey ? pageRequest.page : 1;
  const attempt = pageRequest.attempt;
  const [result, setResult] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let pending = false;

    const loadJobs = async (inBackground = false) => {
      if (pending || (inBackground && document.visibilityState !== 'visible')) return;
      pending = true;
      try {
        const { data: { data } } = await api.get('/jobs/my-jobs', {
          params: { view, sort, page }, signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setResult((previous) => {
          const jobs = page > 1 && previous?.key === queryKey ? [...previous.jobs] : [];
          const seen = new Set(jobs.map(({ _id }) => _id));
          jobs.push(...data.jobs.filter(({ _id }) => !seen.has(_id)));
          return { ...data, jobs, key: queryKey, requestedPage: page, attempt };
        });
      } catch (error) {
        if (controller.signal.aborted || inBackground) return;
        setResult((previous) => ({
          ...(previous?.key === queryKey ? previous : { jobs: [], counts: previous?.counts }),
          key: queryKey, requestedPage: page, attempt,
          error: error.response?.data?.message || 'Please try loading your jobs again.',
        }));
      } finally {
        pending = false;
      }
    };

    loadJobs();
    const refreshTimer = page === 1 ? window.setInterval(() => loadJobs(true), 30000) : null;
    return () => {
      controller.abort();
      if (refreshTimer !== null) window.clearInterval(refreshTimer);
    };
  }, [queryKey, view, sort, page, attempt]);

  const current = result?.key === queryKey ? result : null;
  const loading = !current || current.requestedPage !== page || current.attempt !== attempt;
  const jobs = current?.jobs || [];
  const counts = result?.counts;
  const rangeLabel = jobs.length === 1 ? '1' : `1–${jobs.length}`;
  const countLabel = current?.total === 1 ? 'job' : 'jobs';

  useEffect(() => {
    updateOfferCount?.(counts?.applied ?? null);
    return () => updateOfferCount?.(null);
  }, [counts?.applied, updateOfferCount]);

  const changeQuery = (nextView, nextSort = sort) => {
    setPageRequest({ key: `${nextView}:${nextSort}`, page: 1, attempt: attempt + 1 });
    const query = new URLSearchParams();
    if (nextView !== 'all') query.set('view', nextView);
    if (nextSort !== 'newest') query.set('sort', nextSort);
    setSearchParams(query);
  };

  return (
    <div className="animate-fade-in px-0.5 pb-3 pt-3 text-[#11112d] dark:text-slate-100">
      <div className="flex items-center justify-between gap-2 px-1.5">
        <div>
          <h1 className="text-[30px] font-extrabold leading-none tracking-tight min-[380px]:text-[34px]">My Jobs</h1>
          <p className="mt-1.5 text-[13px] font-medium text-slate-600 min-[380px]:text-[15px] dark:text-slate-300">Your work, all in one place.</p>
        </div>
        <Link to="/customer/jobs/post" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#6331d8] to-[#5124d7] px-3 text-sm font-bold text-white shadow-sm min-[380px]:min-h-12 min-[380px]:gap-2 min-[380px]:px-[18px] min-[380px]:text-[16px]">
          <HiOutlinePlus aria-hidden="true" className="h-5 w-5" />Post a Job
        </Link>
      </div>

      <div role="group" aria-label="Job status" className="mt-6 grid grid-cols-4 gap-1.5 px-0.5 min-[380px]:gap-2">
        {statusFilters.map(({ value, label, caption, icon: Icon, tone }) => (
          <button key={value} type="button" aria-pressed={view === value} onClick={() => changeQuery(view === value ? 'all' : value)} className={`flex min-h-[94px] min-w-0 flex-col items-center rounded-[15px] border px-0.5 py-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 ${tone} ${view === value ? 'border-violet-500 ring-1 ring-violet-500/25' : 'border-transparent'}`}>
            <Icon aria-hidden="true" className="h-5 w-5" />
            <span className="mt-1 text-[18px] font-extrabold leading-none text-[#11112d] dark:text-white">{counts?.[value] ?? '–'}</span>
            <span className="mt-1 text-[10px] font-semibold leading-tight text-slate-800 min-[380px]:text-xs dark:text-slate-100">{label}</span>
            {caption && <span className="text-[9px] leading-tight text-slate-600 min-[380px]:text-[10px] dark:text-slate-300">({caption})</span>}
          </button>
        ))}
      </div>

      <div className="mt-4 flex min-h-14 items-center justify-between gap-2 border-t border-[#ede9f8] px-1.5 pt-2 text-[13px] font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300">
        <div aria-live="polite">
          {current?.total != null && (jobs.length ? `Showing ${rangeLabel} of ${current.total} ${countLabel}` : 'Showing 0 jobs')}
          {view !== 'all' && <button type="button" onClick={() => changeQuery('all')} className="block py-1.5 font-bold text-violet-700 underline underline-offset-2 dark:text-violet-300">All Jobs</button>}
        </div>
        <button type="button" aria-expanded={filterOpen} aria-controls="mobile-job-filters" onClick={() => setFilterOpen(!filterOpen)} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-[#ded7f0] bg-white/40 px-3 text-sm font-bold text-[#11112d] shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
          <HiOutlineFilter aria-hidden="true" className="h-5 w-5" />Filter
        </button>
      </div>

      {filterOpen && (
        <div id="mobile-job-filters" className="mt-2 grid grid-cols-2 gap-3 rounded-2xl border border-violet-100 bg-white p-3 text-xs font-semibold dark:border-slate-800 dark:bg-slate-900">
          <label className="min-w-0">Status
            <select value={view} onChange={(event) => changeQuery(event.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-slate-200 bg-transparent px-2 dark:border-slate-700 dark:bg-slate-900">
              <option value="all">All Jobs</option>
              {statusFilters.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="min-w-0">Sort by
            <select value={sort} onChange={(event) => changeQuery(view, event.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-slate-200 bg-transparent px-2 dark:border-slate-700 dark:bg-slate-900">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="deadline">Earliest deadline</option>
            </select>
          </label>
          <button type="button" disabled={loading} onClick={() => changeQuery(view)} className="col-span-2 min-h-10 text-violet-700 disabled:opacity-50 dark:text-violet-300">Refresh jobs</button>
        </div>
      )}

      <div className="mt-3" aria-busy={loading}>
        {jobs.length > 0 && <ul aria-label="Jobs" className="space-y-2.5">{jobs.map((job) => <JobRow key={job._id} job={job} jobsSearch={searchParams.toString()} />)}</ul>}
        {loading && jobs.length === 0 && <div role="status" aria-label="Loading jobs" className="flex justify-center py-12"><Spinner /></div>}
        {!loading && current?.error && (
          <div role="alert" className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            <p className="font-bold">Could not load {page > 1 ? 'more jobs' : 'jobs'}</p>
            <p className="mt-1">{current.error}</p>
            <button type="button" className="mt-2 min-h-10 font-bold underline" onClick={() => setPageRequest({ key: queryKey, page, attempt: attempt + 1 })}>Try again</button>
          </div>
        )}
        {!loading && !current?.error && jobs.length === 0 && (
          <div className="rounded-2xl border border-[#eae6f7] bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
            <HiOutlineBriefcase aria-hidden="true" className="mx-auto mb-2 h-7 w-7 text-violet-600 dark:text-violet-300" />
            <p className="font-bold">{view === 'applied' ? 'No proposals to review' : `No ${view === 'all' ? '' : `${view} `}jobs yet`}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{view === 'all' ? 'Post a job to get started.' : 'Select All Jobs to see your other listings.'}</p>
          </div>
        )}
        {jobs.length > 0 && !current?.error && (loading && page > 1 || current.page < current.pages) && (
          <button type="button" disabled={loading} onClick={() => setPageRequest({ key: queryKey, page: page + 1, attempt })} className="mx-auto mt-4 flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-[#e7e0f4] bg-white/70 px-8 text-sm font-bold shadow-[0_2px_5px_rgba(40,19,95,0.07)] disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900">
            {loading ? 'Loading jobs…' : 'View More Jobs'}<HiOutlineChevronDown aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileMyJobs;
