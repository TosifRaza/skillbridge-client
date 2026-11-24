import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchJobById } from '@/store/slices/jobSlice';
import {
  fetchJobApplications,
  acceptApplication,
  rejectApplication,
  clearApplications,
} from '@/store/slices/applicationSlice';
import JobSettlementFlow from '@/components/shared/JobSettlementFlow';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import { HiOutlineChatAlt, HiOutlineRefresh } from 'react-icons/hi';

const formatINR = (val) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(val || 0));

const CustomerJobDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentJob: job, loading: jobLoading } = useAppSelector((state) => state.job);
  const { applications, loading: appLoading } = useAppSelector((state) => state.application);
  const { user } = useAppSelector((state) => state.auth);

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const isOwner = job?.customer?._id === user?._id || job?.customer === user?._id;

  useEffect(() => {
    dispatch(fetchJobById(id));
    dispatch(clearApplications());

    return () => dispatch(clearApplications());
  }, [dispatch, id]);

  useEffect(() => {
    if (isOwner && String(job?._id) === id) {
      dispatch(fetchJobApplications(id));
      const refreshTimer = window.setInterval(() => dispatch(fetchJobApplications(id)), 30000);
      return () => window.clearInterval(refreshTimer);
    }
  }, [dispatch, id, isOwner, job?._id]);

  const handleApplicationAction = async (action, applicationId) => {
    if (action === acceptApplication) {
      const proposal = applications.find((application) => application._id === applicationId);
      if (!proposal) return;
      const budgetAmount = formatINR(job.budget);
      const priceNote = `The contract amount is fixed at the posted price of ${budgetAmount}.`;
      if (!window.confirm(`Accept ${proposal.worker?.fullName || 'this proposal'}?\n\n${priceNote}`)) return;
    }

    setErrorMsg('');
    setActionLoadingId(applicationId);

    const result = await dispatch(action(applicationId));
    if (action.fulfilled.match(result)) {
      if (action === acceptApplication) {
        await dispatch(fetchJobById(id));
      }
    } else {
      setErrorMsg(result.payload || 'Could not update this application.');
    }

    setActionLoadingId(null);
  };

  if (jobLoading || !job) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const acceptedApp = applications.find((a) => a.status === 'Accepted');
  const hiredWorker = job.hiredProvider || acceptedApp?.worker || null;
  const isOpen = job.status === 'Open';
  const hasAssignedWorker = Boolean(hiredWorker) && !isOpen;
  const contractAmount = Number(job.budget) || 0;
  const displayedAmount = isOpen ? job.budget : contractAmount;
  const isCompleted = job.status === 'Completed';

  return (
    <div className="w-full">
      {/* Compact Single-Page Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-surface-900">
        {/* Compact Header */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : job.status === 'Open'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {isCompleted
                  ? 'Completed & Settled'
                  : job.status === 'Open'
                  ? 'Open for Bids'
                  : job.status === 'Assigned'
                  ? 'Worker Assigned'
                  : 'In Progress'}
              </span>

              {job.category && (
                <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {job.category}
                </span>
              )}

              <span className="text-[11px] text-slate-400">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5">
              {job.location?.address && <span>📍 {job.location.address}</span>}
              {job.deadline && <span>🗓️ Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {isOpen ? 'Job Budget' : 'Contract Amount'}
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {formatINR(displayedAmount)}
            </span>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mx-5 mt-2 rounded-xl border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
            {errorMsg}
          </div>
        )}
        {/* Job details, proposals, and payment status */}
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-12 lg:gap-6 lg:p-7">
          {/* Left Column: Job Description & Assigned Worker */}
          <div className="min-w-0 space-y-5 lg:col-span-7">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Description
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-6 whitespace-pre-wrap max-h-40 overflow-y-auto pr-1">
                {job.description}
              </p>

              {job.images && job.images.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  {job.images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block h-10 w-14 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:opacity-90 transition"
                    >
                      <img src={img.url} alt={`Job Attachment ${idx + 1}`} className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <section className="border-t border-slate-100 pt-5 dark:border-slate-800">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{isOpen ? 'Worker proposals' : hasAssignedWorker ? 'Assigned professional' : 'Applications'}</h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {isOpen ? 'Review each professional’s experience and availability. The posted price is fixed.' : 'Worker selected for this job.'}
                  </p>
                </div>
                {isOpen && <div className="flex items-center gap-2">
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">{applications.length} {applications.length === 1 ? 'proposal' : 'proposals'}</span>
                  <button type="button" onClick={() => dispatch(fetchJobApplications(id))} disabled={appLoading} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                    <HiOutlineRefresh className={`h-4 w-4 ${appLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>}
              </div>

              {isOpen ? (
                appLoading && applications.length === 0 ? (
                  <div className="flex justify-center rounded-2xl border border-slate-200 py-8 dark:border-slate-700"><Spinner /></div>
                ) : applications.length > 0 ? (
                  <div className="space-y-3">
                    {applications.map((app) => {
                      const applicantName = app.worker?.fullName || app.worker?.email?.split('@')[0] || 'Professional';
                      const isPending = app.status === 'Pending';
                      return (
                        <article key={app._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md dark:border-slate-700 dark:bg-surface-800 dark:hover:border-violet-800 sm:p-5">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <Avatar src={app.worker?.avatar?.url} name={applicantName} size="md" />
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">{applicantName}</h3>
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'}`}>{app.status}</span>
                                </div>
                                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{app.worker?.email || 'SkillBridge professional'}</p>
                              </div>
                            </div>
                            <div className="shrink-0 rounded-xl bg-violet-50 px-3 py-2 text-right dark:bg-violet-950/30">
                              <span className="block text-[10px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">Fixed job price</span>
                              <span className="text-lg font-extrabold text-violet-800 dark:text-violet-200">{formatINR(job.budget)}</span>
                            </div>
                          </div>

                          <div className="mt-4 rounded-xl bg-slate-50 px-3.5 py-3 dark:bg-slate-900/70">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Proposal</p>
                            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-slate-700 dark:text-slate-200">{app.proposalMessage || 'No message was included.'}</p>
                          </div>

                          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                              {app.estimatedCompletionTime && <span><span className="font-semibold text-slate-700 dark:text-slate-300">Estimated time:</span> {app.estimatedCompletionTime}</span>}
                              {app.createdAt && <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {app.worker?._id && <Link to={`/customer/worker/${app.worker._id}`} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">View profile</Link>}
                              {isPending && <>
                                <button type="button" disabled={Boolean(actionLoadingId)} onClick={() => handleApplicationAction(rejectApplication, app._id)} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-rose-200 px-4 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40">{actionLoadingId === app._id ? 'Please wait...' : 'Reject'}</button>
                                <button type="button" disabled={Boolean(actionLoadingId)} onClick={() => handleApplicationAction(acceptApplication, app._id)} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-violet-600 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-50">{actionLoadingId === app._id ? 'Please wait...' : 'Accept proposal'}</button>
                              </>}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center dark:border-slate-700 dark:bg-surface-800/60">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No proposals yet</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Applications from professionals will appear here.</p>
                  </div>
                )
              ) : hasAssignedWorker ? (
                <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar src={hiredWorker.avatar?.url} name={hiredWorker.fullName || hiredWorker.email} size="md" />
                    <div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900 dark:text-white">{hiredWorker.fullName || hiredWorker.email || 'Assigned professional'}</p><p className="truncate text-xs text-slate-500 dark:text-slate-400">{hiredWorker.email || 'Selected for this job'}</p></div>
                  </div>
                  <Link to="/customer/chat" className="shrink-0"><Button variant="outline" size="sm" className="flex min-h-10 items-center gap-2 border-emerald-200 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-200"><HiOutlineChatAlt className="h-4 w-4" /> Message worker</Button></Link>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center dark:border-slate-700 dark:bg-surface-800/60"><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No professional assigned</p></div>
              )}
            </section>
          </div>

          {/* One posted price and payment flow for the whole job lifecycle */}
          <div className="min-w-0 space-y-2 lg:col-span-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Contract &amp; Payment
            </span>
            {isOpen ? (
              <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-5 dark:border-violet-900/60 dark:bg-violet-950/20">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{applications.length ? 'Proposal received' : 'Waiting for proposals'}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{applications.length ? `Review worker experience and availability. The fixed job price is ${formatINR(job.budget)}.` : 'Your job is open to professionals. New applications will appear here.'}</p>
              </div>
            ) : hiredWorker ? (
              <JobSettlementFlow jobId={id} viewerRole="customer" onUpdated={() => dispatch(fetchJobById(id))} />
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">A worker must be assigned before a contract payment can be created.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerJobDetail;
