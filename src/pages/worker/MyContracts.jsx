import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyApplications, withdrawApplication } from '@/store/slices/applicationSlice';
import axiosInstance from '@/api/axiosInstance';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import EmptyState from '@/components/ui/EmptyState';
import Spinner from '@/components/ui/Spinner';
import {
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineChatAlt,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineExternalLink,
} from 'react-icons/hi';

const statusVariant = {
  Pending: 'warning',
  Accepted: 'success',
  Rejected: 'danger',
  Withdrawn: 'gray',
};

const MyContracts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { myApplications, loading } = useAppSelector((state) => state.application);
  const [activeTab, setActiveTab] = useState('Pending');

  // Modal State for Worker Submitting Work Completion
  const [selectedAppForCompletion, setSelectedAppForCompletion] = useState(null);
  const [completionMessage, setCompletionMessage] = useState('I have completed the work satisfactorily. Please inspect and approve.');
  const [submittingCompletion, setSubmittingCompletion] = useState(false);
  const [completionError, setCompletionError] = useState('');
  const [completionSuccess, setCompletionSuccess] = useState('');

  useEffect(() => {
    dispatch(fetchMyApplications({}));
  }, [dispatch]);

  const filteredApps = myApplications.filter((app) => {
    const isJobCompleted = app.job?.status === 'Completed';
    if (activeTab === 'Pending') return app.status === 'Pending';
    if (activeTab === 'Active') return app.status === 'Accepted' && !isJobCompleted;
    if (activeTab === 'History') return ['Rejected', 'Withdrawn'].includes(app.status) || isJobCompleted;
    return true;
  });

  const handleWithdraw = async (app_id, isAccepted) => {
    const confirmMessage = isAccepted
      ? 'Are you sure you want to cancel this contract? The job will be reopened for other workers and the customer will be notified.'
      : 'Are you sure you want to withdraw this proposal?';

    if (window.confirm(confirmMessage)) {
      await dispatch(withdrawApplication(app_id));
      dispatch(fetchMyApplications({})); // Refresh list
    }
  };

  const handleOpenCompletionModal = (app) => {
    setSelectedAppForCompletion(app);
    setCompletionMessage('I have completed the work satisfactorily. Please inspect and approve.');
    setCompletionError('');
    setCompletionSuccess('');
  };

  const handleSubmitCompletion = async (e) => {
    e.preventDefault();
    if (!selectedAppForCompletion) return;
    setSubmittingCompletion(true);
    setCompletionError('');
    try {
      const jobId = selectedAppForCompletion.job?._id || selectedAppForCompletion.job;
      await axiosInstance.post(`/jobs/${jobId}/complete-work`, {
        message: completionMessage,
      });
      setCompletionSuccess('Work marked complete! Customer has been notified to inspect and scan QR.');
      dispatch(fetchMyApplications({})); // Refresh list
      setTimeout(() => {
        setSelectedAppForCompletion(null);
        setCompletionSuccess('');
      }, 1200);
    } catch (err) {
      setCompletionError(err.response?.data?.message || 'Failed to submit work completion');
    } finally {
      setSubmittingCompletion(false);
    }
  };

  if (loading && myApplications.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">My Contracts & Proposals</h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Track active client contracts, mark jobs complete to trigger client UPI QR payments, and inspect earnings.
          </p>
        </div>
        <Link to="/worker/wallet" className="shrink-0">
          <Button variant="outline" size="sm" className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300">
            <HiOutlineShieldCheck className="h-4 w-4" /> View My Wallet
          </Button>
        </Link>
      </div>

      <Tabs
        tabs={[
          { value: 'Pending', label: `Pending (${myApplications.filter((a) => a.status === 'Pending').length})` },
          {
            value: 'Active',
            label: `Active (${myApplications.filter((a) => a.status === 'Accepted' && a.job?.status !== 'Completed').length})`,
          },
          {
            value: 'History',
            label: `History (${myApplications.filter((a) => ['Rejected', 'Withdrawn'].includes(a.status) || a.job?.status === 'Completed').length})`,
          },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6 space-y-4">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => {
            const job = app.job || {};
            const isCompleted = job.status === 'Completed';
            const workSubmitted = Boolean(job.workSubmittedAt);
            const customerApproved = Boolean(job.customerApproved);

            return (
              <Card
                key={app._id}
                className={`dark:bg-surface-800 p-6 hover:shadow-medium transition-shadow border-l-4 ${
                  isCompleted
                    ? 'border-l-emerald-500'
                    : app.status === 'Accepted'
                    ? 'border-l-indigo-500'
                    : 'border-l-surface-300 dark:border-l-surface-600'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <Badge variant={isCompleted ? 'success' : statusVariant[app.status]}>
                        {isCompleted ? 'Completed' : app.status}
                      </Badge>

                      {isCompleted && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                          ✓ Paid ₹{job.paidAmount || app.bidAmount} via UPI QR
                        </span>
                      )}

                      {!isCompleted && workSubmitted && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 animate-pulse">
                          ⏳ Completion Sent to Client
                        </span>
                      )}

                      <span className="text-xs text-surface-400">
                        {app.status === 'Accepted' ? 'Hired' : 'Applied'} on{' '}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link
                      to={`/worker/jobs/${job._id || app.job}`}
                      className="text-xl font-bold text-surface-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5"
                    >
                      {job.title || 'Job Title Unavailable'}
                      <HiOutlineExternalLink className="h-4 w-4 opacity-60" />
                    </Link>

                    <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 mt-1 mb-3">
                      {app.proposalMessage}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-surface-600 dark:text-surface-300">
                      <span className="flex items-center gap-1 font-bold text-primary-600 dark:text-primary-400">
                        <HiOutlineCurrencyDollar className="w-4 h-4" /> Bid: ₹{app.bidAmount}
                      </span>
                      <span className="text-xs text-surface-400">
                        (Net Payout: ₹{Math.round(app.bidAmount * 0.95)})
                      </span>
                      <span className="flex items-center gap-1">
                        <HiOutlineClock className="w-4 h-4" /> {app.estimatedCompletionTime}
                      </span>
                      {job.customer?.email && (
                        <span className="text-xs text-surface-400">
                          Client: {job.customer?.fullName || job.customer?.email}
                        </span>
                      )}
                    </div>

                    {/* Progress / Completion Status Notification Banner on Card */}
                    {app.status === 'Accepted' && !isCompleted && (
                      <div className="mt-3">
                        {workSubmitted ? (
                          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-[10px]">
                              ⏳
                            </span>
                            <div>
                              <p className="font-bold">
                                Work Marked Complete! Waiting for Customer Approval & QR Payment.
                              </p>
                              <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-300/80">
                                Message sent to customer: "{job.workCompletionMessage || 'Work has been completed.'}"
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            <span>Contract in progress. When done, click <strong>"Work Complete & Request QR"</strong> below to generate client payment QR.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2 justify-end">
                    {app.status === 'Pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWithdraw(app._id, false)}
                        className="text-red-500 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30"
                      >
                        Withdraw
                      </Button>
                    )}

                    {app.status === 'Accepted' && !isCompleted && (
                      <>
                        {!workSubmitted ? (
                          <Button
                            size="sm"
                            onClick={() => handleOpenCompletionModal(app)}
                            className="gradient-primary flex items-center gap-1.5 w-full md:w-auto justify-center text-white shadow-md shadow-indigo-500/20"
                          >
                            <HiOutlineCheckCircle className="w-4 h-4" /> Work Complete & Request QR
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled
                            className="flex items-center gap-1.5 w-full md:w-auto justify-center opacity-90 cursor-not-allowed"
                          >
                            <HiOutlineClock className="w-4 h-4 animate-spin" /> Awaiting Client QR Payment
                          </Button>
                        )}

                        <Link to="/worker/chat">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 w-full md:w-auto justify-center"
                          >
                            <HiOutlineChatAlt className="w-4 h-4" /> Message
                          </Button>
                        </Link>

                        {!workSubmitted && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleWithdraw(app._id, true)}
                            className="flex items-center gap-1 w-full md:w-auto justify-center"
                          >
                            <HiOutlineX className="w-4 h-4" /> Cancel Contract
                          </Button>
                        )}
                      </>
                    )}

                    {isCompleted && (
                      <Link to="/worker/wallet">
                        <Button size="sm" variant="outline" className="flex items-center gap-1 text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300">
                          <HiOutlineShieldCheck className="w-4 h-4" /> View in Wallet
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <EmptyState
            icon={activeTab === 'Active' ? '🤝' : '📋'}
            title={`No ${activeTab} ${activeTab === 'Active' ? 'Contracts' : 'Proposals'}`}
            description={
              activeTab === 'Pending'
                ? "You haven't submitted any proposals recently."
                : activeTab === 'Active'
                ? 'You have no active contracts at this moment.'
                : 'No finished contracts in history.'
            }
            actionLabel={activeTab === 'Pending' ? 'Find Work' : undefined}
            onAction={activeTab === 'Pending' ? () => navigate('/worker/jobs') : undefined}
          />
        )}
      </div>

      {/* MODAL: SUBMIT WORK COMPLETION DIRECTLY FROM MY CONTRACTS */}
      {selectedAppForCompletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-surface-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <HiOutlineCheckCircle className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Submit Completed Work</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedAppForCompletion.job?.title || 'Contract'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppForCompletion(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {completionError && (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
                {completionError}
              </div>
            )}
            {completionSuccess && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
                {completionSuccess}
              </div>
            )}

            <form onSubmit={handleSubmitCompletion} className="mt-4 space-y-4">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs dark:border-indigo-900/40 dark:bg-indigo-950/30">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-medium">
                  <span>Contract Bid:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{selectedAppForCompletion.bidAmount}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  <span>Net Payout to Your Wallet (95%):</span>
                  <span>₹{Math.round(selectedAppForCompletion.bidAmount * 0.95)}</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Completion Message for Customer
                </label>
                <textarea
                  rows={3}
                  value={completionMessage}
                  onChange={(e) => setCompletionMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="Describe what has been completed so the customer can verify..."
                  required
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  When you submit, customer will receive this message and a "Yes, Work Completed" button to generate your UPI QR Code.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/3 text-xs"
                  onClick={() => setSelectedAppForCompletion(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingCompletion}
                  className="gradient-primary w-2/3 text-xs font-bold text-white shadow-md shadow-indigo-500/20"
                >
                  {submittingCompletion ? 'Sending...' : 'Send Completion Request →'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyContracts;
