import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchJobById } from '@/store/slices/jobSlice';
import {
  fetchJobApplications,
  acceptApplication,
  rejectApplication,
  clearApplications,
} from '@/store/slices/applicationSlice';
import axiosInstance from '@/api/axiosInstance';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import {
  HiOutlineChatAlt,
  HiOutlineCheckCircle,
  HiOutlineCheck,
  HiOutlinePrinter,
  HiOutlineThumbUp,
} from 'react-icons/hi';

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

  const [qrDetails, setQrDetails] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isOwner = job?.customer?._id === user?._id || job?.customer === user?._id;

  const fetchQrDetails = async () => {
    try {
      const res = await axiosInstance.get(`/jobs/${id}/qr-details`);
      setQrDetails(res.data.data);
    } catch {
      // non-blocking
    }
  };

  useEffect(() => {
    dispatch(fetchJobById(id));
    dispatch(clearApplications());
    fetchQrDetails();

    return () => dispatch(clearApplications());
  }, [dispatch, id]);

  useEffect(() => {
    if (isOwner && String(job?._id) === id) {
      dispatch(fetchJobApplications(id));
      fetchQrDetails();
    }
  }, [dispatch, id, isOwner, job?._id]);

  const handleApplicationAction = async (action, applicationId) => {
    setErrorMsg('');
    setActionLoadingId(applicationId);

    const result = await dispatch(action(applicationId));
    if (action.fulfilled.match(result)) {
      if (action === acceptApplication) {
        await dispatch(fetchJobById(id));
        await fetchQrDetails();
      }
    } else {
      setErrorMsg(result.payload || 'Could not update this application.');
    }

    setActionLoadingId(null);
  };

  // 1. Customer Approves Work
  const handleApproveWork = async () => {
    setActionLoading(true);
    setErrorMsg('');
    try {
      await axiosInstance.post(`/jobs/${id}/approve-work`);
      setSuccessMsg('Work approved! QR payment code is now ready.');
      await dispatch(fetchJobById(id));
      await fetchQrDetails();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to approve work');
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Customer Confirms QR Payment
  const handleConfirmPayment = async () => {
    setActionLoading(true);
    setErrorMsg('');
    try {
      await axiosInstance.post(`/jobs/${id}/confirm-qr-payment`, {
        paymentMethod: 'upi_qr',
        utrNumber: utrNumber.trim(),
      });
      setSuccessMsg('Payment confirmed! Job completed and earnings credited to worker.');
      await dispatch(fetchJobById(id));
      await fetchQrDetails();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment confirmation failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (jobLoading || !job) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const acceptedApp = applications.find((a) => a.status === 'Accepted');
  const qrWorker = qrDetails?.worker?.id ? qrDetails.worker : null;
  const hiredWorker = job.hiredProvider || acceptedApp?.worker || qrWorker;
  const isOpen = job.status === 'Open';
  const hasAssignedWorker = Boolean(hiredWorker) && !isOpen;
  const contractAmount = acceptedApp?.bidAmount || job.paidAmount || qrDetails?.amount || job.budget;
  const displayedAmount = isOpen ? job.budget : contractAmount;
  const isCompleted = job.status === 'Completed';
  const workSubmitted = Boolean(job.workSubmittedAt);
  const customerApproved = Boolean(job.customerApproved);

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
        {successMsg && (
          <div className="mx-5 mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
            {successMsg}
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
                    {isOpen ? "Compare each professional's quote and proposal before choosing." : 'Worker selected for this job.'}
                  </p>
                </div>
                {isOpen && <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">{applications.length} {applications.length === 1 ? 'proposal' : 'proposals'}</span>}
              </div>

              {isOpen ? (
                appLoading ? (
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
                              <span className="block text-[10px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">Proposed bid</span>
                              <span className="text-lg font-extrabold text-violet-800 dark:text-violet-200">{formatINR(app.bidAmount)}</span>
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

          {/* Right Column: Work Status & Payment Hero Action */}
          <div className="min-w-0 space-y-2 lg:col-span-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Work & Payment Status
            </span>

            {/* STATE 1: COMPLETED */}
            {isCompleted && (
              <div className="h-full flex flex-col items-center justify-center rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300">
                  <HiOutlineCheckCircle className="h-5 w-5" />
                </div>
                <h4 className="mt-1.5 text-xs font-extrabold text-slate-900 dark:text-white">
                  Work Completed & Payment Settled!
                </h4>
                <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                  Payment of <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatINR(contractAmount)}</strong> was confirmed via UPI QR.
                </p>
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-800 dark:text-slate-200"
                  >
                    <HiOutlinePrinter className="h-3.5 w-3.5" /> Print Payment Slip
                  </button>
                </div>
              </div>
            )}

            {/* STATE 2: WORKER SENT COMPLETION MSG -> APPROVE BUTTON */}
            {!isCompleted && workSubmitted && !customerApproved && (
              <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 p-3.5 dark:border-indigo-900/60 dark:bg-surface-800/60">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow">
                    ✓
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {hiredWorker?.fullName || 'Worker'} marked work as COMPLETED!
                    </p>
                    <div className="mt-1 rounded-lg border border-indigo-100 bg-white p-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-surface-900 dark:text-slate-200">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">Worker Note: </span>
                      "{job.workCompletionMessage || 'Work has been completed.'}"
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Did the worker complete the work satisfactorily?
                    </p>
                    <button
                      type="button"
                      onClick={handleApproveWork}
                      disabled={actionLoading}
                      className="mt-2 gradient-primary flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:-translate-y-0.5"
                    >
                      <HiOutlineThumbUp className="h-3.5 w-3.5" />
                      {actionLoading ? 'Approving...' : 'Yes, Work Completed'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 3: CUSTOMER CLICKED YES -> DYNAMIC QR ACTIVE */}
            {!isCompleted && customerApproved && (
              <div className="rounded-2xl border-2 border-emerald-200 bg-white p-3 text-center dark:border-emerald-900/60 dark:bg-surface-900">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Scan QR to Pay {formatINR(contractAmount)}
                </p>
                <div className="my-1.5 flex justify-center">
                  <QRCodeSVG
                    value={
                      qrDetails?.upiIntent ||
                      `upi://pay?pa=${qrDetails?.worker?.upiId || 'skillbridge@upi'}&pn=${encodeURIComponent(
                        qrDetails?.worker?.name || 'Worker'
                      )}&am=${contractAmount}&cu=INR`
                    }
                    size={120}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Pay to: <strong>{qrDetails?.worker?.name || hiredWorker?.fullName}</strong> ({qrDetails?.worker?.upiId || 'UPI'})
                </p>

                <div className="mt-2 space-y-1.5">
                  <input
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="12-digit UTR from payment screen (optional)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-mono outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={actionLoading}
                    className="gradient-primary flex w-full items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20"
                  >
                    <HiOutlineCheck className="h-3.5 w-3.5" />
                    {actionLoading ? 'Confirming...' : 'I Have Paid via QR (Confirm)'}
                  </button>
                </div>
              </div>
            )}

            {!isCompleted && !workSubmitted && !customerApproved && isOpen && (
              <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-5 dark:border-violet-900/60 dark:bg-violet-950/20">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{applications.length ? 'Proposal received' : 'Waiting for proposals'}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {applications.length ? "Review the professional's bid and proposal, then accept one to start the contract." : 'Your job is open to professionals. New proposals will appear in the panel on the left.'}
                </p>
              </div>
            )}

            {!isCompleted && !workSubmitted && !customerApproved && !isOpen && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-surface-800/60">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{job.status === 'Assigned' ? 'Worker assigned' : 'Work in progress'}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {job.status === 'Assigned'
                    ? `${hiredWorker?.fullName || 'Your worker'} has been selected. Work updates will appear here.`
                    : `${hiredWorker?.fullName || 'Your worker'} is working on this job. When they submit it, you can review the work and confirm payment here.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerJobDetail;
