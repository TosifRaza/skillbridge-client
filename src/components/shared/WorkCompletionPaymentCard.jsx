import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axiosInstance from '@/api/axiosInstance';
import { useAppSelector } from '@/store/hooks';
import {
  HiOutlineCheckCircle,
  HiOutlineQrcode,
  HiOutlineCurrencyRupee,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineDeviceMobile,
  HiOutlinePrinter,
  HiOutlineX,
  HiOutlineSparkles,
  HiOutlineThumbUp,
  HiOutlineCheck,
} from 'react-icons/hi';

const formatINR = (val) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(val || 0));

const WorkCompletionPaymentCard = ({ jobId, viewerRole = 'customer', onUpdated }) => {
  const { user } = useAppSelector((state) => state.auth);

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Worker completion message input
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [workerMessage, setWorkerMessage] = useState('I have completed the work satisfactorily. Please inspect and approve.');

  // Customer QR View State
  const [showQrModal, setShowQrModal] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  const fetchDetails = async () => {
    try {
      const res = await axiosInstance.get(`/jobs/${jobId}/qr-details`);
      setDetails(res.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load work details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [jobId]);

  // 1. Worker marks work complete
  const handleWorkerSubmitComplete = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    try {
      await axiosInstance.post(`/jobs/${jobId}/complete-work`, { message: workerMessage });
      setShowSubmitModal(false);
      setSuccessMsg('Work marked complete! Notification sent to customer.');
      await fetchDetails();
      onUpdated?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit work completion');
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Customer clicks "YES" to approve work
  const handleCustomerApproveWork = async () => {
    setActionLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post(`/jobs/${jobId}/approve-work`);
      setSuccessMsg('Work approved! QR Code payment is now generated.');
      await fetchDetails();
      setShowQrModal(true); // Automatically open the QR payment view!
      onUpdated?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve work');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Customer confirms QR payment
  const handleConfirmQRPayment = async (paymentMethod = 'upi_qr') => {
    setActionLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post(`/jobs/${jobId}/confirm-qr-payment`, {
        paymentMethod,
        utrNumber: utrNumber.trim(),
      });
      setShowQrModal(false);
      setReceiptData(res.data.data.receipt);
      setSuccessMsg('Payment confirmed! Job completed and earnings credited to worker.');
      await fetchDetails();
      onUpdated?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment confirmation failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-surface-900">
        Loading work status...
      </div>
    );
  }

  if (!details) return null;

  const isCustomer = viewerRole === 'customer';
  const isWorker = viewerRole === 'provider';
  const isCompleted = details.isCompleted || details.status === 'Completed';
  const workSubmitted = details.workSubmitted;
  const customerApproved = details.customerApproved;

  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-soft dark:border-slate-800 dark:bg-surface-900">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-300 shadow-inner">
              <HiOutlineShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-indigo-200">
                Work Settlement & QR Payment
              </p>
              <h4 className="text-lg font-extrabold text-white">
                {formatINR(details.amount)}
              </h4>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
              isCompleted
                ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                : customerApproved
                ? 'bg-indigo-400/20 text-indigo-200 border border-indigo-400/30'
                : workSubmitted
                ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30 animate-pulse'
                : 'bg-white/10 text-slate-300'
            }`}
          >
            {isCompleted
              ? 'Paid & Settled'
              : customerApproved
              ? 'QR Code Active'
              : workSubmitted
              ? 'Needs Verification'
              : 'In Progress'}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Messages */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
            {successMsg}
          </div>
        )}

        {/* ---------------- STATE 1: JOB IS COMPLETED ---------------- */}
        {isCompleted ? (
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-5 text-center dark:border-emerald-900/60 dark:bg-emerald-950/30">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300 shadow-sm">
              <HiOutlineCheckCircle className="h-7 w-7" />
            </div>
            <h5 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
              Work Completed & Payment Settled!
            </h5>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Contract payment of <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatINR(details.amount)}</strong> was confirmed via UPI QR and credited to worker wallet.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-800 dark:text-slate-200"
              >
                <HiOutlinePrinter className="h-4 w-4" />
                Print Payment Slip
              </button>
            </div>
          </div>
        ) : (
          /* ---------------- STATE 2: IN PROGRESS / PENDING APPROVAL / QR READY ---------------- */
          <div className="space-y-4">
            {/* WORKER VIEW */}
            {isWorker && (
              <div>
                {!workSubmitted ? (
                  <div>
                    <div className="mb-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                      When you finish this task, click below to notify the customer so they can verify your work and generate the payment QR code.
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(true)}
                      className="gradient-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
                    >
                      <HiOutlineCheckCircle className="h-4 w-4" />
                      Mark Work Complete & Request Payment
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
                    <div className="flex items-start gap-3">
                      <HiOutlineClock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 animate-pulse" />
                      <div>
                        <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          Work Completion Sent to Customer
                        </p>
                        <p className="mt-1 text-[11px] leading-4 text-amber-700 dark:text-amber-300/80">
                          Waiting for client to inspect your work, click "Yes", and scan the generated QR code to release {formatINR(details.amount)}.
                        </p>
                        <p className="mt-2 font-mono text-[10px] text-amber-600 dark:text-amber-400">
                          Submitted: {new Date(details.workSubmittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CUSTOMER VIEW */}
            {isCustomer && (
              <div>
                {!workSubmitted ? (
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                    <HiOutlineClock className="h-4 w-4 text-indigo-500" />
                    <span>Worker <strong>{details.worker?.name}</strong> is currently working on this project.</span>
                  </div>
                ) : !customerApproved ? (
                  /* WORKER SENT COMPLETION MSG -> CUSTOMER SEES CARD WITH "YES" BUTTON */
                  <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/70 dark:bg-indigo-950/40">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                        <HiOutlineCheck className="h-5 w-5" />
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-extrabold text-indigo-950 dark:text-white">
                          {details.worker?.name} marked this work as COMPLETED!
                        </p>
                        <div className="mt-1.5 rounded-lg border border-indigo-100 bg-white/80 p-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-surface-900 dark:text-slate-200">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">Worker Note: </span>
                          "{details.workCompletionMessage || 'I have completed the work. Please inspect and approve.'}"
                        </div>
                        <p className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                          Did the worker complete the work satisfactorily?
                        </p>

                        <div className="mt-3 flex gap-2.5">
                          <button
                            type="button"
                            onClick={handleCustomerApproveWork}
                            disabled={actionLoading}
                            className="gradient-primary flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:-translate-y-0.5"
                          >
                            <HiOutlineThumbUp className="h-4 w-4" />
                            {actionLoading ? 'Approving...' : 'Yes, Work Completed'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CUSTOMER CLICKED YES -> "GENERATE QR" IS ACTIVE */
                  <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                          <HiOutlineCheck className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                            Work Verified by You
                          </p>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80">
                            Payable amount: <strong>{formatINR(details.amount)}</strong>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowQrModal(true)}
                        className="gradient-primary flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
                      >
                        <HiOutlineQrcode className="h-4 w-4" />
                        Generate Payment QR →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---------------- WORKER: SUBMIT COMPLETION MODAL ---------------- */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-surface-900">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Submit Completed Work
              </h3>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleWorkerSubmitComplete} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Message for Customer
                </label>
                <textarea
                  rows={3}
                  value={workerMessage}
                  onChange={(e) => setWorkerMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="Explain what was done..."
                />
              </div>

              <div className="flex justify-between rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800">
                <span className="text-slate-500">Contract Amount:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(details.amount)}</span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="w-1/3 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="gradient-primary flex w-2/3 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
                >
                  {actionLoading ? 'Sending...' : 'Send to Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- CUSTOMER: DYNAMIC UPI QR CODE PAYMENT MODAL ---------------- */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-surface-900 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Scan to Pay for Work
                </h3>
                <p className="text-xs text-slate-400">
                  Pay directly to worker via any UPI app
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* QR Display Card */}
            <div className="my-5 flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="overflow-hidden rounded-2xl border-4 border-white bg-white p-3 shadow-lg">
                <QRCodeSVG
                  value={details.upiIntent || `upi://pay?pa=${details.worker?.upiId || 'skillbridge@upi'}&pn=${encodeURIComponent(details.worker?.name)}&am=${details.amount}&cu=INR`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="mt-4 text-center">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {formatINR(details.amount)}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Pay to: <strong className="text-slate-800 dark:text-slate-200">{details.worker?.name}</strong>
                </p>
                <p className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                  UPI ID: {details.worker?.upiId || 'skillbridge@upi'}
                </p>
              </div>

              {/* Supported UPI Apps Pills */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Cred'].map((app) => (
                  <span
                    key={app}
                    className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-surface-800 dark:text-slate-300"
                  >
                    {app}
                  </span>
                ))}
              </div>

              {/* Direct UPI intent link on mobile */}
              <a
                href={details.upiIntent}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline sm:hidden"
              >
                <HiOutlineDeviceMobile className="h-4 w-4" /> Open Installed UPI App
              </a>
            </div>

            {/* UTR Input (Optional) */}
            <div className="mb-4">
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

            {/* Confirm Actions */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleConfirmQRPayment('upi_qr')}
                disabled={actionLoading}
                className="gradient-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
              >
                <HiOutlineCheck className="h-4 w-4" />
                {actionLoading ? 'Verifying Payment...' : 'I Have Paid via QR (Confirm)'}
              </button>

              <button
                type="button"
                onClick={() => handleConfirmQRPayment('razorpay')}
                disabled={actionLoading}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-800 dark:text-slate-200"
              >
                Pay via Card / Netbanking Instead
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WorkCompletionPaymentCard;
