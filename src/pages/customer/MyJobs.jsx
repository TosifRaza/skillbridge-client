import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyJobs, deleteJob, closeJob } from '@/store/slices/jobSlice';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import EmptyState from '@/components/ui/EmptyState';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineX,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineQrcode,
  HiOutlineTag,
  HiOutlineBriefcase,
  HiOutlineShieldCheck,
} from 'react-icons/hi';

const MyJobs = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { jobs, loading } = useAppSelector((state) => state.job);
  const [activeTab, setActiveTab] = useState('Active');

  useEffect(() => {
    dispatch(fetchMyJobs({}));
  }, [dispatch]);

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'Active') return ['Open', 'Assigned', 'In-Progress'].includes(job.status);
    if (activeTab === 'Completed') return job.status === 'Completed';
    if (activeTab === 'Cancelled') return ['Cancelled', 'Closed'].includes(job.status);
    return true;
  });

  const activeCount = jobs.filter((j) => ['Open', 'Assigned', 'In-Progress'].includes(j.status)).length;
  const completedCount = jobs.filter((j) => j.status === 'Completed').length;
  const cancelledCount = jobs.filter((j) => ['Cancelled', 'Closed'].includes(j.status)).length;

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      await dispatch(deleteJob(id));
    }
  };

  const handleClose = async (id) => {
    if (window.confirm('Are you sure you want to close this job? Workers will no longer be able to submit proposals.')) {
      await dispatch(closeJob(id));
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Posted Jobs
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your job postings, review received proposals from professionals, and approve completed work.
          </p>
        </div>
        <Link to="/customer/jobs/post" className="shrink-0">
          <Button className="gradient-primary flex items-center gap-2 text-white shadow-lg shadow-indigo-500/25 px-5 py-2.5 rounded-xl font-bold">
            <HiOutlinePlus className="w-5 h-5" /> Post a New Job
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { value: 'Active', label: `Active (${activeCount})` },
          { value: 'Completed', label: `Completed (${completedCount})` },
          { value: 'Cancelled', label: `Cancelled / Closed (${cancelledCount})` },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Job Cards List */}
      <div className="mt-6 space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isOpen = job.status === 'Open';
            const isAssigned = job.status === 'Assigned';
            const isInProgress = job.status === 'In-Progress';
            const isCompleted = job.status === 'Completed';
            const hasWorkSubmitted = Boolean(job.workSubmittedAt && !isCompleted);

            return (
              <div
                key={job._id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 bg-white dark:bg-surface-800 hover:shadow-lg ${
                  hasWorkSubmitted
                    ? 'border-indigo-300 dark:border-indigo-800 shadow-md ring-2 ring-indigo-500/20'
                    : isCompleted
                    ? 'border-emerald-200/80 dark:border-emerald-900/40'
                    : isAssigned || isInProgress
                    ? 'border-indigo-200/80 dark:border-indigo-900/40'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Left accent color indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    hasWorkSubmitted
                      ? 'bg-indigo-600 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-500'
                      : isAssigned || isInProgress
                      ? 'bg-indigo-500'
                      : isOpen
                      ? 'bg-emerald-500'
                      : 'bg-slate-400'
                  }`}
                />

                <div className="p-5 sm:p-6 pl-6 sm:pl-7">
                  {/* Card Header Row: Badges, Category, Date & Budget */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status Pill */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isOpen
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50'
                            : isAssigned
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50'
                            : isInProgress
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50'
                            : isCompleted
                            ? 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-surface-700 dark:text-slate-300 dark:border-slate-600'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isOpen
                              ? 'bg-emerald-500 animate-pulse'
                              : isAssigned
                              ? 'bg-indigo-500'
                              : isInProgress
                              ? 'bg-amber-500 animate-pulse'
                              : isCompleted
                              ? 'bg-emerald-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {isOpen
                          ? 'Open for Proposals'
                          : isAssigned
                          ? 'Worker Assigned'
                          : isInProgress
                          ? 'Work in Progress'
                          : isCompleted
                          ? 'Completed & Settled'
                          : job.status}
                      </span>

                      {/* Category Chip */}
                      {job.category && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <HiOutlineTag className="h-3 w-3 text-slate-400" />
                          {job.category}
                        </span>
                      )}

                      {/* Service Type Chip */}
                      <span className="rounded-lg bg-slate-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                        {job.serviceType === 'digital' ? '🌐 Digital' : '📍 Local'}
                      </span>

                      <span className="text-xs text-slate-400">
                        Posted on {new Date(job.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Budget Badge */}
                    <div className="flex items-baseline gap-1.5 rounded-xl bg-slate-50 px-3.5 py-1 text-right dark:bg-surface-900 border border-slate-200/70 dark:border-slate-700">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Budget:</span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                        ₹{Number(job.budget || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-3.5">
                    <Link
                      to={`/customer/jobs/${job._id}`}
                      className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors inline-flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white"
                    >
                      <span>{job.title}</span>
                      <HiOutlineArrowRight className="h-4 w-4 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" />
                    </Link>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Metadata Chips: Location, Deadline, Proposals / Worker */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <HiOutlineLocationMarker className="h-4 w-4 text-slate-400" />
                      {job.location?.address || 'Remote / Local'}
                    </span>

                    {job.deadline && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <HiOutlineClock className="h-4 w-4 text-slate-400" />
                        Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    )}

                    {job.hiredProvider ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-900/50">
                        <Avatar name={job.hiredProvider.fullName || job.hiredProvider.email} size="xs" />
                        Hired Worker: {job.hiredProvider.fullName || job.hiredProvider.email}
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          (job.proposalCount || 0) > 0
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <HiOutlineUsers className="h-3.5 w-3.5" />
                        {job.proposalCount || 0} {job.proposalCount === 1 ? 'Proposal' : 'Proposals'} Received
                      </span>
                    )}
                  </div>

                  {/* Work Completion Notice Banner (Customer Approval & QR Trigger) */}
                  {hasWorkSubmitted && (
                    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 p-4 text-xs dark:border-indigo-900/80 dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-slate-900 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md">
                          ✓
                        </span>
                        <div>
                          <p className="font-extrabold text-indigo-950 dark:text-indigo-200">
                            Worker marked this job as COMPLETED!
                          </p>
                          <p className="text-[11px] text-indigo-700 dark:text-indigo-300/80 mt-0.5">
                            "{job.workCompletionMessage || 'Work has been completed. Please inspect and approve.'}"
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/customer/jobs/${job._id}`}
                        className="shrink-0 rounded-xl gradient-primary px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:-translate-y-0.5"
                      >
                        Review & Pay QR →
                      </Link>
                    </div>
                  )}

                  {/* Card Footer: Status Reference & Actions */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-400">
                      {isCompleted ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <HiOutlineShieldCheck className="h-4 w-4" /> Paid ₹{job.paidAmount || job.budget} via UPI QR
                        </span>
                      ) : (
                        <span>Job ID: #{job._id.slice(-6).toUpperCase()}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Secondary Actions for Open jobs */}
                      {isOpen && (
                        <>
                          <Link to={`/customer/jobs/${job._id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1.5 text-xs text-slate-700 border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                            >
                              <HiOutlinePencil className="h-3.5 w-3.5" /> Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClose(job._id)}
                            className="flex items-center gap-1.5 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/30"
                          >
                            <HiOutlineX className="h-3.5 w-3.5" /> Close Job
                          </Button>
                        </>
                      )}

                      {/* Delete button (quiet icon) */}
                      {['Open', 'Cancelled', 'Closed'].includes(job.status) && (
                        <button
                          onClick={() => handleDelete(job._id)}
                          title="Delete this listing"
                          className="flex items-center justify-center h-8 w-8 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      )}

                      {/* Primary Action Button */}
                      <Link to={`/customer/jobs/${job._id}`}>
                        {hasWorkSubmitted ? (
                          <Button size="sm" className="gradient-primary flex items-center gap-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20">
                            <HiOutlineQrcode className="h-4 w-4" /> Verify & Pay QR →
                          </Button>
                        ) : isOpen ? (
                          <Button size="sm" className="gradient-primary flex items-center gap-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20">
                            <HiOutlineUsers className="h-4 w-4" /> View Proposals ({job.proposalCount || 0}) →
                          </Button>
                        ) : isCompleted ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300"
                          >
                            <HiOutlineCheckCircle className="h-4 w-4" /> View Receipt & Details →
                          </Button>
                        ) : (
                          <Button size="sm" className="gradient-primary flex items-center gap-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20">
                            <HiOutlineBriefcase className="h-4 w-4" /> Manage Job & Worker →
                          </Button>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            icon={activeTab === 'Active' ? '💼' : activeTab === 'Completed' ? '🎉' : '📁'}
            title={`No ${activeTab} Jobs`}
            description={
              activeTab === 'Active'
                ? "You don't have any active job listings at the moment."
                : activeTab === 'Completed'
                ? "You haven't completed any jobs yet."
                : 'No closed or cancelled jobs.'
            }
            actionLabel={activeTab === 'Active' ? 'Post a New Job' : undefined}
            onAction={activeTab === 'Active' ? () => navigate('/customer/jobs/post') : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default MyJobs;
