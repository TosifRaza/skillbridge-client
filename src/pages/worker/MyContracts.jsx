import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyApplications, withdrawApplication } from '@/store/slices/applicationSlice';
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
  HiOutlineShieldCheck,
  HiOutlineExternalLink,
} from 'react-icons/hi';

const statusVariant = {
  Pending: 'warning',
  Accepted: 'success',
  Rejected: 'danger',
  Withdrawn: 'gray',
};

const formatINR = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2,
}).format(Number(value) || 0);

const MyContracts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { myApplications, loading } = useAppSelector((state) => state.application);
  const [activeTab, setActiveTab] = useState('Pending');

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
            Review your proposals and manage accepted work through the protected contract workflow.
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
            const contractPrice = job.contractAmount
              ?? (app.proposalMessage === 'Direct booking by customer.' ? job.budget : app.bidAmount);

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

                      {isCompleted && Number(job.paidAmount) > 0 && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                          Paid {formatINR(job.paidAmount)}
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
                        <HiOutlineCurrencyDollar className="w-4 h-4" /> {app.status === 'Accepted' ? 'Agreed price' : 'Your quote'}: {formatINR(app.status === 'Accepted' ? contractPrice : app.bidAmount)}
                      </span>
                      {job.budget != null && Number(job.budget) !== Number(contractPrice) && <span className="text-xs text-surface-400">Customer budget: {formatINR(job.budget)}</span>}
                      <span className="flex items-center gap-1">
                        <HiOutlineClock className="w-4 h-4" /> {app.estimatedCompletionTime}
                      </span>
                      {job.customer?.email && (
                        <span className="text-xs text-surface-400">
                          Client: {job.customer?.fullName || job.customer?.email}
                        </span>
                      )}
                    </div>

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
                        <Link to={`/worker/jobs/${job._id || app.job}`}>
                          <Button size="sm" className="gradient-primary w-full md:w-auto justify-center text-white">Manage contract &amp; payment</Button>
                        </Link>
                        <Button variant="danger" size="sm" onClick={() => handleWithdraw(app._id, true)} className="flex items-center gap-1 w-full md:w-auto justify-center">
                          <HiOutlineX className="h-4 w-4" /> Cancel contract
                        </Button>
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


    </div>
  );
};

export default MyContracts;
