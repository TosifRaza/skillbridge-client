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
import EmptyState from '@/components/ui/EmptyState';
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
  const hiredWorker = job.hiredProvider || acceptedApp?.worker || qrDetails?.worker;
  const contractAmount = acceptedApp?.bidAmount || job.paidAmount || qrDetails?.amount || job.budget;
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

            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {job.title}
            </h1>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
              {job.location?.address && <span>📍 {job.location.address}</span>}
              {job.deadline && <span>🗓️ Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Contract Amount
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {formatINR(contractAmount)}
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

        {/* 2-Column Body to Fit Entire Page Without Scrolling */}
        <div className="grid md:grid-cols-12 gap-5 p-5">
          {/* Left Column: Job Description & Assigned Worker */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Description
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-24 overflow-y-auto pr-1">
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

            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                {hiredWorker ? 'Assigned Professional' : `Proposals (${applications.length})`}
              </span>

              {hiredWorker ? (
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-surface-800/60">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={hiredWorker.avatar?.url}
                      name={hiredWorker.fullName || hiredWorker.email}
                      size="sm"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {hiredWorker.fullName || 'Service Professional'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {hiredWorker.email}
                      </p>
                    </div>
                  </div>

                  <Link to="/customer/chat">
                    <Button
                      variant="outline"
                      size="xs"
                      className="flex items-center gap-1 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300"
                    >
                      <HiOutlineChatAlt className="w-3.5 h-3.5" /> Message
                    </Button>
                  </Link>
                </div>
              ) : (
                <div>
                  {appLoading ? (
                    <div className="py-3 flex justify-center"><Spinner /></div>
                  ) : applications.length > 0 ? (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {applications.map((app) => (
                        <div
                          key={app._id}
                          className="flex items-center justify-between rounded-xl border border-slate-200 p-2 text-xs dark:border-slate-700"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar name={app.worker?.fullName || app.worker?.email} size="xs" />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {app.worker?.fullName || app.worker?.email}
                              </p>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{app.proposalMessage}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-indigo-600">₹{app.bidAmount}</span>
                            {app.status === 'Pending' && (
                              <div className="flex gap-1">
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
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon="📭" title="No proposals yet" description="Professionals haven't applied yet." />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Work Status & Payment Hero Action */}
          <div className="md:col-span-5 flex flex-col justify-center">
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

            {/* STATE 4: IN PROGRESS */}
            {!isCompleted && !workSubmitted && (
              <div className="h-full flex items-center rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-surface-800/40">
                <p>
                  ⏳ {hiredWorker?.fullName || 'Worker'} is currently working on this task. When completed, verification & QR payment options will appear here.
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
