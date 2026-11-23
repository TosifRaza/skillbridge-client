import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchJobById } from '@/store/slices/jobSlice';
import {
  fetchJobApplications,
  acceptApplication,
  rejectApplication,
  clearApplications,
} from '@/store/slices/applicationSlice';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import WorkCompletionPaymentCard from '@/components/shared/WorkCompletionPaymentCard';
import {
  HiOutlineArrowLeft,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineChatAlt,
  HiOutlineTag,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineExternalLink,
} from 'react-icons/hi';

const CustomerJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentJob: job, loading: jobLoading } = useAppSelector((state) => state.job);
  const { applications, loading: appLoading } = useAppSelector((state) => state.application);
  const { user } = useAppSelector((state) => state.auth);
  const [actionError, setActionError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const isOwner = job?.customer?._id === user?._id || job?.customer === user?._id;

  useEffect(() => {
    dispatch(fetchJobById(id));
    dispatch(clearApplications());

    return () => dispatch(clearApplications());
  }, [dispatch, id]);

  useEffect(() => {
    if (isOwner && String(job?._id) === id) {
      dispatch(fetchJobApplications(id));
    }
  }, [dispatch, id, isOwner, job?._id]);

  const handleApplicationAction = async (action, applicationId) => {
    setActionError(null);
    setActionLoadingId(applicationId);

    const result = await dispatch(action(applicationId));
    if (action.fulfilled.match(result)) {
      if (action === acceptApplication) await dispatch(fetchJobById(id));
    } else {
      setActionError(result.payload || 'Could not update this application. Please try again.');
    }

    setActionLoadingId(null);
  };

  if (jobLoading || !job) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  // Find accepted application if any
  const acceptedApp = applications.find((a) => a.status === 'Accepted');
  const hiredWorker = job.hiredProvider || acceptedApp?.worker;
  const agreedAmount = acceptedApp?.bidAmount || job.paidAmount || job.budget;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 animate-fade-in space-y-6">
      {/* Top Back Navigation */}
      <div>
        <Link
          to="/customer/jobs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
        >
          <HiOutlineArrowLeft className="w-4 h-4" /> Back to My Jobs
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-900">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  job.status === 'Open'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : job.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                {job.status === 'Open'
                  ? 'Open for Proposals'
                  : job.status === 'Completed'
                  ? 'Completed & Settled'
                  : job.status === 'Assigned'
                  ? 'Worker Hired'
                  : 'In Progress'}
              </span>

              {job.category && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <HiOutlineTag className="h-3.5 w-3.5 text-slate-400" />
                  {job.category}
                </span>
              )}

              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {job.serviceType === 'digital' ? '🌐 Digital Service' : '📍 Local Service'}
              </span>

              <span className="text-xs text-slate-400">
                Posted on{' '}
                {new Date(job.createdAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {job.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {hiredWorker && (
              <Link to="/customer/chat">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300"
                >
                  <HiOutlineChatAlt className="w-4 h-4" /> Message Worker
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* 4-Column Quick Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-surface-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Agreed Amount</span>
            <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
              ₹{Number(agreedAmount || 0).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-surface-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Service Location</span>
            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
              {job.location?.address || 'Remote / Local'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-surface-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deadline</span>
            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
              {job.deadline
                ? new Date(job.deadline).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Flexible'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-surface-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hired Specialist</span>
            <p className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 truncate">
              {hiredWorker ? hiredWorker.fullName || hiredWorker.email?.split('@')[0] : 'None (Accepting Proposals)'}
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Balanced Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Job Details + Hired Worker Profile / Proposals) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Job Description */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <HiOutlineBriefcase className="h-5 w-5 text-indigo-600" />
              Project Overview & Scope
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {job.description}
            </p>

            {job.images && job.images.length > 0 && (
              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Attached Photos ({job.images.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {job.images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800 block"
                    >
                      <img
                        src={img.url}
                        alt={`Attachment ${idx + 1}`}
                        className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Hired Worker Profile OR Proposals List */}
          {hiredWorker ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-900">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <HiOutlineCheckCircle className="h-4 w-4" />
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Assigned Service Professional
                  </h3>
                </div>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Hired Provider
                </span>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <Avatar
                    src={hiredWorker.avatar?.url}
                    name={hiredWorker.fullName || hiredWorker.email}
                    size="lg"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {hiredWorker.fullName || 'Service Professional'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <HiOutlineMail className="h-3.5 w-3.5 text-slate-400" /> {hiredWorker.email}
                    </p>
                    {hiredWorker.phone && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <HiOutlinePhone className="h-3.5 w-3.5 text-slate-400" /> {hiredWorker.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 px-4 py-2 text-right dark:bg-surface-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Agreed Bid</span>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    ₹{agreedAmount}
                  </p>
                  {acceptedApp?.estimatedCompletionTime && (
                    <p className="text-[11px] text-slate-400 mt-0.5">Time: {acceptedApp.estimatedCompletionTime}</p>
                  )}
                </div>
              </div>

              {acceptedApp?.proposalMessage && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Original Proposal Note: </span>
                  "{acceptedApp.proposalMessage}"
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Link to="/customer/chat">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300">
                    <HiOutlineChatAlt className="w-4 h-4" /> Message {hiredWorker.fullName || 'Worker'}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-900">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
                Received Proposals ({applications.length})
              </h3>
              {actionError && (
                <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {actionError}
                </div>
              )}
              {appLoading ? (
                <div className="py-8 flex justify-center">
                  <Spinner />
                </div>
              ) : applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="rounded-xl border border-slate-200 p-4 hover:shadow-sm transition dark:border-slate-700"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={app.worker?.fullName || app.worker?.email} />
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">
                              {app.worker?.fullName || app.worker?.email}
                            </p>
                            <p className="text-xs text-slate-500 line-clamp-1">{app.proposalMessage}</p>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">
                              Timeline: {app.estimatedCompletionTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center sm:flex-col items-end gap-2">
                          <span className="text-base font-bold text-primary-600">₹{app.bidAmount}</span>
                          {app.status === 'Pending' && (
                            <div className="flex gap-1.5">
                              <Button
                                size="xs"
                                isLoading={actionLoadingId === app._id}
                                disabled={Boolean(actionLoadingId) || job.status !== 'Open'}
                                onClick={() => handleApplicationAction(acceptApplication, app._id)}
                              >
                                Accept
                              </Button>
                              <Button
                                size="xs"
                                variant="outline"
                                disabled={Boolean(actionLoadingId)}
                                onClick={() => handleApplicationAction(rejectApplication, app._id)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="📭"
                  title="No proposals yet"
                  description="Workers haven't applied to this job yet. Check back soon!"
                />
              )}
            </div>
          )}
        </div>

        {/* Right Column (Settlement, QR Code & Safe Payment Guarantee) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Work Completion & QR Payment Control Card */}
          {['Assigned', 'In-Progress', 'Completed'].includes(job.status) && (
            <WorkCompletionPaymentCard
              jobId={id}
              viewerRole="customer"
              onUpdated={() => dispatch(fetchJobById(id))}
            />
          )}

          {/* Fallback budget info card if job is Open */}
          {job.status === 'Open' && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-900">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Listing Information
              </h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Proposed Budget</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">₹{job.budget}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Service Category</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{job.category}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Target Date</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Flexible'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Location</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {job.location?.address || 'Remote'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Trust & Guarantee Information Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-surface-900">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <HiOutlineShieldCheck className="h-5 w-5 text-emerald-500" />
              SkillBridge Escrow Protection
            </h4>
            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong>Safe Verification:</strong> You only pay when the work is done and verified by you.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong>Dynamic QR Code:</strong> Scans instantly with Google Pay, PhonePe, Paytm, or BHIM.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong>Direct Payout:</strong> Worker receives funds in their verified wallet with full receipts.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerJobDetail;
