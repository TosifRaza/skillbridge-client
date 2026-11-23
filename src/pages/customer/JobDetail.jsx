import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  HiOutlineArrowLeft,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineChatAlt,
  HiOutlineCheckCircle,
  HiOutlineCheck,
  HiOutlinePrinter,
  HiOutlineQrcode,
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
  const navigate = useNavigate();
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
      // Non-critical fallback
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
      setSuccessMsg('Work approved! QR code payment is ready below.');
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
      <div className="flex justify-center py-24">
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
    <div className="max-w-3xl mx-auto px-4 py-4 animate-fade-in space-y-4">
      {/* Back Button */}
      <div>
        <Link
          to="/customer/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
        >
          <HiOutlineArrowLeft className="w-4 h-4" /> Back to My Jobs
        </Link>
      </div>

      {/* Main Single Clean Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-surface-900">
        {/* Header Section */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold ${
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
                <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {job.category}
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Contract Amount</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {formatINR(contractAmount)}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {job.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            {job.location?.address && (
              <span className="flex items-center gap-1">
                <HiOutlineLocationMarker className="w-3.5 h-3.5 text-slate-400" />
                {job.location.address}
              </span>
            )}
            {job.deadline && (
              <span className="flex items-center gap-1">
                <HiOutlineClock className="w-3.5 h-3.5 text-slate-400" />
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </span>
            )}
            <span>
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Alerts / Error Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
            {successMsg}
          </div>
        )}

        {/* Description Section */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Description
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {job.description}
          </p>

          {job.images && job.images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2.5">
              {job.images.map((img, idx) => (
                <a
                  key={idx}
                  href={img.url}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 h-20 w-28 bg-slate-100 dark:bg-slate-800 block"
                >
                  <img src={img.url} alt={`Job Image ${idx + 1}`} className="h-full w-full object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Worker OR Open Proposals */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            {hiredWorker ? 'Assigned Professional' : `Proposals (${applications.length})`}
          </h3>

          {hiredWorker ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-surface-800/60">
              <div className="flex items-center gap-3">
                <Avatar
                  src={hiredWorker.avatar?.url}
                  name={hiredWorker.fullName || hiredWorker.email}
                  size="md"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {hiredWorker.fullName || 'Service Provider'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {hiredWorker.email}
                  </p>
                </div>
              </div>

              <Link to="/customer/chat">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300"
                >
                  <HiOutlineChatAlt className="w-4 h-4" /> Message Worker
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              {appLoading ? (
                <div className="py-6 flex justify-center"><Spinner /></div>
              ) : applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={app.worker?.fullName || app.worker?.email} />
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">
                            {app.worker?.fullName || app.worker?.email}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1">{app.proposalMessage}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-end">
                        <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                          ₹{app.bidAmount}
                        </span>
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
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="📭"
                  title="No proposals yet"
                  description="Professionals haven't applied to this job yet."
                />
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* WORK COMPLETION & QR PAYMENT FLOW (THE PRIMARY INTERACTIVE HERO) */}
        {/* ============================================================== */}
        <div className="p-6 sm:p-7 bg-slate-50/50 dark:bg-surface-800/30">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Work Status & Payment
          </h3>

          {/* STATE 1: ALREADY COMPLETED & PAID */}
          {isCompleted && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300 shadow-sm">
                <HiOutlineCheckCircle className="h-7 w-7" />
              </div>
              <h4 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
                Work Completed & Payment Settled!
              </h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Payment of <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatINR(contractAmount)}</strong> was confirmed via UPI QR and credited to worker wallet.
              </p>
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-800 dark:text-slate-200"
                >
                  <HiOutlinePrinter className="h-4 w-4" /> Print Payment Slip
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: WORKER SUBMITTED COMPLETION -> CUSTOMER SEES "YES" BUTTON */}
          {!isCompleted && workSubmitted && !customerApproved && (
            <div className="rounded-2xl border-2 border-indigo-200 bg-white p-5 shadow-sm dark:border-indigo-900/60 dark:bg-surface-900">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                  <HiOutlineCheck className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {hiredWorker?.fullName || 'Worker'} marked this work as COMPLETED!
                  </p>
                  <div className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-surface-800 dark:text-slate-200">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Worker Note: </span>
                    "{job.workCompletionMessage || 'I have completed the work. Please inspect and approve.'}"
                  </div>

                  <p className="mt-4 text-xs font-bold text-slate-800 dark:text-slate-200">
                    Did the worker complete the work satisfactorily?
                  </p>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleApproveWork}
                      disabled={actionLoading}
                      className="gradient-primary flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
                    >
                      <HiOutlineThumbUp className="h-4 w-4" />
                      {actionLoading ? 'Approving...' : 'Yes, Work Completed'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: CUSTOMER CLICKED YES -> DYNAMIC UPI QR CODE PAYMENT IS SHOWN */}
          {!isCompleted && customerApproved && (
            <div className="rounded-2xl border-2 border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-900/60 dark:bg-surface-900">
              <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 mb-2">
                  <HiOutlineCheck className="h-3.5 w-3.5" /> Work Verified by You
                </span>
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Scan QR Code to Pay Worker
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scan with Google Pay, PhonePe, Paytm, or BHIM
                </p>
              </div>

              {/* QR Code Container */}
              <div className="my-5 flex flex-col items-center justify-center">
                <div className="overflow-hidden rounded-2xl border-4 border-slate-100 bg-white p-3 shadow-md dark:border-slate-800">
                  <QRCodeSVG
                    value={
                      qrDetails?.upiIntent ||
                      `upi://pay?pa=${qrDetails?.worker?.upiId || 'skillbridge@upi'}&pn=${encodeURIComponent(
                        qrDetails?.worker?.name || 'Worker'
                      )}&am=${contractAmount}&cu=INR`
                    }
                    size={190}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="mt-4 text-center">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {formatINR(contractAmount)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Payable to: <strong className="text-slate-800 dark:text-slate-200">{qrDetails?.worker?.name || hiredWorker?.fullName}</strong>
                  </p>
                  <p className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                    UPI ID: {qrDetails?.worker?.upiId || 'skillbridge@upi'}
                  </p>
                </div>

                {/* Supported Apps */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                    <span
                      key={app}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-surface-800 dark:text-slate-300"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* UTR Input & Confirmation */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    UPI Reference / UTR Number (Optional)
                  </label>
                  <input
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="12-digit UTR from payment screen"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={actionLoading}
                  className="gradient-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
                >
                  <HiOutlineCheck className="h-4 w-4" />
                  {actionLoading ? 'Confirming Payment...' : 'I Have Paid via QR (Confirm)'}
                </button>
              </div>
            </div>
          )}

          {/* STATE 4: WORK IN PROGRESS */}
          {!isCompleted && !workSubmitted && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-surface-900 dark:text-slate-400 flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span>
                {hiredWorker?.fullName || 'Worker'} is currently working on this task. Once they submit work completion, you will be able to verify and generate the payment QR code here.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerJobDetail;
