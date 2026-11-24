import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCurrentJob, clearJobError, fetchJobById } from '@/store/slices/jobSlice';
import ApplyModal from '@/components/shared/ApplyModal';
import axiosInstance from '@/api/axiosInstance';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import ContractPaymentPanel from '@/components/shared/ContractPaymentPanel';
import WorkCompletionPaymentCard from '@/components/shared/WorkCompletionPaymentCard';
import {
  HiOutlineArrowLeft,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

const statusVariant = {
  Open: 'success', Assigned: 'primary', 'In-Progress': 'warning', Completed: 'gray', Cancelled: 'danger', Closed: 'gray',
};

const formatDate = (value) => {
  if (!value) return 'Not specified';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not specified' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatBudget = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(Number(value) || 0);

const WorkerJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentJob: job, loading, error } = useAppSelector((state) => state.job);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState({ loading: true, applied: false, status: null });

  useEffect(() => {
    dispatch(clearCurrentJob());
    dispatch(clearJobError());
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  useEffect(() => {
    let active = true;
    setApplicationStatus({ loading: true, applied: false, status: null });
    axiosInstance.get(`/applications/status/${id}`)
      .then(({ data }) => {
        if (active) setApplicationStatus({ loading: false, ...data.data });
      })
      .catch(() => {
        if (active) setApplicationStatus({ loading: false, applied: false, status: null });
      });

    return () => { active = false; };
  }, [id]);

  if (loading && !job) return <div className="flex min-h-[50vh] items-center justify-center"><Spinner /></div>;
  if (!job || job._id !== id) {
    return (
      <div className="mx-auto max-w-xl py-12">
        <Card className="p-8 text-center dark:bg-surface-800">
          <h1 className="text-xl font-bold text-surface-900 dark:text-white">{error ? 'Could not load this job' : 'Job not found'}</h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">{error || 'This job may have been removed or the link may be incorrect.'}</p>
          <Button className="mt-5" variant="outline" onClick={() => navigate('/worker/jobs')}>Back to jobs</Button>
          {error && <Button className="ml-2 mt-5" onClick={() => { dispatch(clearJobError()); dispatch(fetchJobById(id)); }}>Try again</Button>}
        </Card>
      </div>
    );
  }

  const images = Array.isArray(job.images) ? job.images.filter((image) => image?.url) : [];
  const location = job.location?.address || (job.serviceType === 'digital' ? 'Remote' : 'Location not specified');
  const accepted = applicationStatus.status === 'Accepted';

  return (
    <div className="mx-auto w-full max-w-6xl animate-fade-in pb-8">
      <button
        onClick={() => navigate('/worker/jobs')}
        className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-surface-600 transition hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-surface-300 dark:hover:text-primary-300"
      >
        <HiOutlineArrowLeft className="h-5 w-5" aria-hidden="true" /> Back to jobs
      </button>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,.8fr)] lg:gap-6">
        <div className="space-y-5">
          <Card className="overflow-hidden p-5 sm:p-7 dark:bg-surface-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={statusVariant[job.status] || 'gray'}>{job.status}</Badge>
                {job.category && <Badge variant="primary">{job.category}</Badge>}
              </div>
              <span className="text-xs font-medium text-surface-400">Posted {formatDate(job.createdAt)}</span>
            </div>
            <h1 className="mt-5 break-words text-2xl font-extrabold leading-tight text-surface-900 sm:text-3xl dark:text-white">{job.title}</h1>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-surface-600 sm:text-base dark:text-surface-300">{job.description}</p>

            {images.length > 0 && (
              <section className="mt-6" aria-label="Job photos">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-surface-800 dark:text-white">Photos from the client</h2>
                  <span className="text-xs text-surface-400">{images.length} {images.length === 1 ? 'photo' : 'photos'}</span>
                </div>
                <div className={`grid grid-cols-2 gap-3 ${images.length >= 3 ? 'sm:grid-rows-2' : ''}`}>
                  {images.map((image, index) => (
                    <a
                      key={image._id || image.public_id || image.url || index}
                      href={image.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open job photo ${index + 1} in a new tab`}
                      className={`group block overflow-hidden rounded-xl border border-surface-200 bg-surface-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-surface-700 dark:bg-surface-900 ${images.length >= 3 && index === 0 ? 'sm:row-span-2' : ''}`}
                    >
                      <img
                        src={image.url}
                        alt={`Client provided job photo ${index + 1}`}
                        loading={index > 1 ? 'lazy' : 'eager'}
                        className={`w-full object-cover transition duration-200 group-hover:scale-[1.02] ${images.length >= 3 && index === 0 ? 'h-48 sm:h-full sm:min-h-64' : 'h-40 sm:h-48'}`}
                      />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </Card>

          {accepted && ['Assigned', 'In-Progress', 'Completed'].includes(job.status) && (
            <WorkCompletionPaymentCard jobId={id} viewerRole="provider" onUpdated={() => dispatch(fetchJobById(id))} />
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-5">
          <Card className="p-5 sm:p-6 dark:bg-surface-800">
            <div className="flex items-end justify-between gap-3 border-b border-surface-200 pb-4 dark:border-surface-700">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">Client budget</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-primary-600 dark:text-primary-400">{formatBudget(job.budget)}</p>
              </div>
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold capitalize text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">{job.serviceType || 'local'}</span>
            </div>
            <dl className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <HiOutlineCalendar className="mt-0.5 h-5 w-5 shrink-0 text-surface-400" aria-hidden="true" />
                <div><dt className="text-xs text-surface-500 dark:text-surface-400">Deadline</dt><dd className="mt-0.5 text-sm font-semibold text-surface-800 dark:text-surface-100">{formatDate(job.deadline)}</dd></div>
              </div>
              <div className="flex items-start gap-3">
                <HiOutlineLocationMarker className="mt-0.5 h-5 w-5 shrink-0 text-surface-400" aria-hidden="true" />
                <div><dt className="text-xs text-surface-500 dark:text-surface-400">Location</dt><dd className="mt-0.5 break-words text-sm font-semibold text-surface-800 dark:text-surface-100">{location}</dd></div>
              </div>
              <div className="flex items-start gap-3">
                <HiOutlineTag className="mt-0.5 h-5 w-5 shrink-0 text-surface-400" aria-hidden="true" />
                <div><dt className="text-xs text-surface-500 dark:text-surface-400">Work type</dt><dd className="mt-0.5 text-sm font-semibold capitalize text-surface-800 dark:text-surface-100">{job.serviceType || 'Local'}</dd></div>
              </div>
            </dl>
          </Card>

          {job.status === 'Open' ? (
            applicationStatus.loading ? (
              <Button className="w-full py-3" disabled>Checking your application?</Button>
            ) : applicationStatus.applied ? (
              <Card className="border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                <div className="flex items-start gap-3">
                  <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">{accepted ? 'Your application was accepted' : 'You?ve applied for this job'}</p>
                    <p className="mt-1 text-xs leading-5 text-emerald-800 dark:text-emerald-300">{accepted ? 'The client selected you. View your contract and next steps below.' : 'Your proposal is with the client. You can follow updates in My Contracts.'}</p>
                    {applicationStatus.status && <p className="mt-2 text-xs font-semibold capitalize text-emerald-800 dark:text-emerald-300">Status: {applicationStatus.status}</p>}
                  </div>
                </div>
                {!accepted && <Button variant="outline" className="mt-3 w-full" onClick={() => navigate('/worker/contracts')}>View my contracts</Button>}
              </Card>
            ) : (
              <Card className="p-4 dark:bg-surface-800">
                <p className="mb-3 text-xs leading-5 text-surface-500 dark:text-surface-400">Send a proposal to let the client know how you can help.</p>
                <Button className="w-full py-3 shadow-glow" onClick={() => setShowApplyModal(true)}>Apply for this job</Button>
              </Card>
            )
          ) : (
            <Card className="p-4 text-center dark:bg-surface-800">
              <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Applications are closed</p>
              <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">This job is {job.status.toLowerCase()} and no longer accepting proposals.</p>
            </Card>
          )}

          <ContractPaymentPanel jobId={id} viewerRole="provider" />
        </aside>
      </div>

      {showApplyModal && (
        <ApplyModal
          jobId={id}
          onClose={() => setShowApplyModal(false)}
          onApplied={() => setApplicationStatus({ loading: false, applied: true, status: 'Pending' })}
          onAlreadyApplied={() => { setApplicationStatus({ loading: false, applied: true, status: 'Pending' }); setShowApplyModal(false); }}
        />
      )}
    </div>
  );
};

export default WorkerJobDetail;
