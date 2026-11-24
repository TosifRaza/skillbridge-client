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
import {
  HiOutlineArrowLeft,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineCheckCircle,
  HiOutlineCreditCard,
  HiOutlineDocumentText,
  HiOutlineHome,
  HiOutlinePhotograph,
  HiOutlineChevronDown,
} from 'react-icons/hi';

const statusVariant = {
  Open: 'success', Assigned: 'primary', 'In-Progress': 'warning', Completed: 'gray', Cancelled: 'danger', Closed: 'gray',
};

const formatDate = (value) => {
  if (!value) return 'Not specified';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not specified' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });
};

const formatBudget = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(Number(value) || 0);

const ApplicationProgress = ({ status }) => {
  const result = status === 'Accepted' || status === 'Rejected';
  const labels = ['Applied', 'In Review', 'Result'];
  const currentStep = result ? 2 : 0;
  return (
    <ol aria-label={`Application progress: ${status || 'Pending'}`} className="mt-6 grid grid-cols-3">
      {labels.map((label, index) => {
        const complete = index < currentStep || (index === 0 && currentStep === 0);
        const active = index === currentStep;
        return (
          <li key={label} className="relative flex flex-col items-center text-center">
            {index < labels.length - 1 && <span className={`absolute left-1/2 top-[15px] h-[3px] w-full ${index < currentStep ? 'bg-violet-500' : 'bg-violet-100 dark:bg-slate-700'}`} aria-hidden="true" />}
            <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${complete ? 'border-violet-600 bg-violet-600 text-white' : active ? 'border-violet-500 bg-white text-violet-600 dark:bg-slate-900' : 'border-slate-300 bg-white text-transparent dark:border-slate-600 dark:bg-slate-900'}`}>
              {complete && <HiOutlineCheckCircle className="h-5 w-5" />}
            </span>
            <span className={`mt-2 text-[11px] font-semibold sm:text-xs ${active ? 'text-violet-700 dark:text-violet-300' : 'text-slate-500 dark:text-slate-400'}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
};

const WorkerJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentJob: job, loading, error } = useAppSelector((state) => state.job);
  const { user } = useAppSelector((state) => state.auth);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState({ loading: true, applied: false, status: null });

  useEffect(() => {
    dispatch(clearCurrentJob());
    dispatch(clearJobError());
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [id]);

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

  if (loading && !job) return <div className="flex min-h-[52vh] items-center justify-center"><Spinner /></div>;
  if (!job || job._id !== id) {
    return (
      <div className="mx-auto max-w-xl py-12">
        <Card className="rounded-3xl border-violet-100 p-8 text-center shadow-[0_16px_45px_rgba(63,45,119,.08)] dark:bg-surface-800">
          <h1 className="text-xl font-bold text-surface-900 dark:text-white">{error ? 'Could not load this job' : 'Job not found'}</h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">{error || 'This job may have been removed or the link may be incorrect.'}</p>
          <Button className="mt-5" variant="outline" onClick={() => navigate('/worker/jobs')}>Back to jobs</Button>
          {error && <Button className="ml-2 mt-5" onClick={() => { dispatch(clearJobError()); dispatch(fetchJobById(id)); }}>Try again</Button>}
        </Card>
      </div>
    );
  }

  const images = Array.isArray(job.images) ? job.images.filter((image) => image?.url) : [];
  const selectedImage = images[selectedImageIndex] || images[0];
  const location = job.location?.address || (job.serviceType === 'digital' ? 'Remote' : 'Location not specified');
  const summary = job.description?.trim().split(/\r?\n/)[0].slice(0, 110) || '';
  const applied = Boolean(applicationStatus.applied);
  const assignedWorkerId = job.hiredProvider?._id || job.hiredProvider;
  const accepted = applicationStatus.status === 'Accepted' || String(assignedWorkerId || '') === String(user?._id || '');
  const directBooking = job.bookingType === 'direct'
    || (/^Service booking with\s/i.test(job.title || '') && /^Direct hire request for\s/i.test(job.description || ''));
  const agreedContractAmount = directBooking
    ? job.budget
    : job.contractAmount ?? applicationStatus.contractAmount ?? applicationStatus.bidAmount;
  const applicationTitle = accepted ? 'Application Accepted' : applicationStatus.status === 'Rejected' ? 'Application Update' : 'Already Applied';
  const applicationMessage = accepted
    ? 'The client selected you. Your contract and next steps are ready below.'
    : applicationStatus.status === 'Rejected'
      ? 'The client has chosen another proposal. You can continue exploring other jobs.'
      : 'You have successfully applied for this job.';

  return (
    <div className="mx-auto w-full max-w-[1320px] animate-fade-in pb-8">
      <button
        onClick={() => navigate('/worker/jobs')}
        className="mb-7 inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-[15px] font-semibold text-violet-700 transition hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-violet-300 dark:hover:text-violet-100"
      >
        <HiOutlineArrowLeft className="h-5 w-5" aria-hidden="true" /> Back to Jobs
      </button>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.84fr)_minmax(350px,1fr)] lg:gap-[30px]">
        <Card className="relative overflow-hidden rounded-[22px] border-violet-100/90 bg-white/90 p-4 shadow-[0_12px_36px_rgba(63,45,119,.08)] backdrop-blur sm:p-6 lg:p-[26px] dark:border-slate-700 dark:bg-surface-800">
          <div className="pointer-events-none absolute -right-10 -top-16 hidden h-64 w-64 rounded-full bg-gradient-to-br from-violet-100/80 via-purple-100/70 to-transparent lg:block" />
          <div className="pointer-events-none absolute right-12 top-10 hidden text-violet-300/80 lg:block"><HiOutlineHome className="h-20 w-20" /></div>

          <div className="relative z-10 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Badge variant={statusVariant[job.status] || 'gray'} className="rounded-full px-4 py-1 text-[13px]">{job.status}</Badge>
            <span className="text-[14px] text-slate-500 dark:text-slate-400">Posted {formatDate(job.createdAt)}</span>
          </div>
          <div className="relative z-10 mt-5 max-w-[80%] sm:max-w-[78%]">
            <h1 className="break-words text-[26px] font-extrabold leading-[1.1] tracking-tight text-[#11123d] sm:text-[30px] lg:text-[32px] dark:text-white">{job.title}</h1>
            <p className="mt-2 line-clamp-1 text-[15px] font-medium text-slate-500 dark:text-slate-300">{summary}</p>
          </div>

          <section className="relative z-10 mt-6" aria-label="Job photos">
            {images.length === 0 ? (
              <div className="flex min-h-[250px] flex-col items-center justify-center rounded-[18px] border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 px-5 text-center dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm dark:bg-slate-800 dark:text-violet-300"><HiOutlinePhotograph className="h-7 w-7" /></span>
                <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">No job photos attached</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Review the job description for the client's requirements.</p>
              </div>
            ) : images.length === 1 ? (
              <a href={selectedImage.url} target="_blank" rel="noreferrer" aria-label="Open job photo in a new tab" className="group relative block overflow-hidden rounded-[16px] border border-violet-100 bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-700 dark:bg-slate-900">
                <img src={selectedImage.url} alt="Client provided job photo" className="h-[240px] w-full object-cover sm:h-[304px]" />
                <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/70 px-3 py-1.5 text-[11px] font-semibold text-white">View full photo</span>
              </a>
            ) : (
              <div className="grid gap-3 sm:h-[304px] sm:grid-cols-[minmax(0,2fr)_minmax(120px,.68fr)]">
                <a href={selectedImage.url} target="_blank" rel="noreferrer" aria-label="Open selected job photo in a new tab" className="group relative block h-[240px] overflow-hidden rounded-[16px] border border-violet-100 bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:h-full dark:border-slate-700 dark:bg-slate-900">
                  <img src={selectedImage.url} alt={`Client provided job photo ${selectedImageIndex + 1}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                  <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/70 px-3 py-1.5 text-[11px] font-semibold text-white">View full photo</span>
                </a>
                <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:pb-0" aria-label="Choose a job photo">
                  {images.map((image, index) => (
                    <button
                      key={image._id || image.public_id || image.url || index}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`Show job photo ${index + 1}`}
                      aria-pressed={index === selectedImageIndex}
                      className={`h-[82px] min-w-[112px] flex-1 overflow-hidden rounded-[14px] border-2 bg-slate-100 transition hover:border-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:h-auto sm:min-h-0 sm:min-w-0 ${index === selectedImageIndex ? 'border-violet-600 shadow-[0_0_0_2px_rgba(124,58,237,.12)]' : 'border-transparent'}`}
                    >
                      <img src={image.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="mt-6 border-t border-violet-100 pt-5 dark:border-slate-700">
            <button type="button" aria-expanded={descriptionOpen} onClick={() => setDescriptionOpen((open) => !open)} className="flex min-h-11 w-full items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"><HiOutlineDocumentText className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[16px] font-extrabold text-[#11123d] dark:text-white">Job Description</span><span className="mt-0.5 block truncate text-[12px] text-slate-500 dark:text-slate-400">{summary}</span></span>
              <HiOutlineChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${descriptionOpen ? 'rotate-180' : ''}`} />
            </button>
            {descriptionOpen && <p className="whitespace-pre-wrap pb-1 pl-[52px] pr-2 pt-2 text-[13px] leading-[1.55] text-slate-600 dark:text-slate-300">{job.description}</p>}
          </section>

        </Card>

        <aside className="space-y-5 lg:sticky lg:top-[110px]">
          <Card className="rounded-[20px] border-violet-100/90 bg-white/90 p-4 shadow-[0_12px_34px_rgba(63,45,119,.07)] backdrop-blur sm:p-5 dark:border-slate-700 dark:bg-surface-800">
              <div className="flex items-center justify-between gap-3 border-b border-violet-100 pb-3 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"><HiOutlineCreditCard className="h-5 w-5" /></span>
                <span className="text-[16px] font-semibold text-slate-800 dark:text-slate-200">Customer budget</span>
              </div>
              <span className="text-[28px] font-extrabold tracking-tight text-violet-700 dark:text-violet-300">{formatBudget(job.budget)}</span>
            </div>
            <dl className="divide-y divide-violet-100 dark:divide-slate-700">
              <div className="flex min-h-[40px] items-center gap-3 py-1">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-violet-50 text-violet-700 dark:bg-slate-700 dark:text-violet-300"><HiOutlineCalendar className="h-5 w-5" /></span>
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5"><dt className="text-[14px] font-medium text-slate-500 dark:text-slate-400">Deadline:</dt><dd className="text-[14px] font-semibold text-slate-800 dark:text-slate-100">{formatDate(job.deadline)}</dd></div>
              </div>
              <div className="flex min-h-[40px] items-center gap-3 py-1">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-violet-50 text-violet-700 dark:bg-slate-700 dark:text-violet-300"><HiOutlineLocationMarker className="h-6 w-6" /></span>
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5"><dd className="break-words text-[14px] font-semibold text-slate-800 dark:text-slate-100">{location}</dd></div>
              </div>
              <div className="flex min-h-[40px] items-center gap-3 pt-1">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-violet-50 text-violet-700 dark:bg-slate-700 dark:text-violet-300"><HiOutlineTag className="h-5 w-5" /></span>
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5"><dt className="text-[14px] font-medium text-slate-500 dark:text-slate-400">Type:</dt><dd className="text-[15px] font-semibold capitalize text-slate-800 dark:text-slate-100">{job.serviceType || 'local'}</dd></div>
              </div>
            </dl>
            {accepted && agreedContractAmount != null && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-violet-50 px-3 py-2.5 text-sm dark:bg-violet-950/30">
                <span className="font-semibold text-violet-800 dark:text-violet-200">Agreed contract price</span>
                <span className="font-extrabold text-violet-800 dark:text-violet-200">{formatBudget(agreedContractAmount)}</span>
              </div>
            )}
          </Card>

          {job.status === 'Open' && applied ? (
            <Card className="flex min-h-[322px] flex-col justify-center rounded-[20px] border-violet-100/90 bg-gradient-to-br from-white via-white to-violet-50/80 p-5 text-center shadow-[0_12px_34px_rgba(63,45,119,.07)] sm:p-6 dark:border-slate-700 dark:from-surface-800 dark:to-slate-900">
              <span className="mx-auto flex h-[56px] w-[56px] items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"><HiOutlineCheckCircle className="h-9 w-9" /></span>
              <h2 className="mt-2.5 text-[21px] font-extrabold tracking-tight text-[#11123d] dark:text-white">{applicationTitle}</h2>
              <p className="mx-auto mt-1 max-w-[290px] text-[13px] leading-5 text-slate-500 dark:text-slate-400">{applicationMessage}</p>
              <ApplicationProgress status={applicationStatus.status || 'Pending'} />
              <Button variant="secondary" disabled className="mt-5 min-h-[44px] w-full rounded-[13px] text-[14px]">Already Applied</Button>
            </Card>
          ) : job.status === 'Open' ? (
            <Card className="rounded-[23px] border-violet-100/90 bg-white/90 p-5 shadow-[0_14px_44px_rgba(63,45,119,.08)] sm:p-6 dark:border-slate-700 dark:bg-surface-800">
              <p className="text-[20px] font-extrabold text-[#11123d] dark:text-white">Interested in this job?</p>
              <p className="mt-1.5 text-[14px] leading-5 text-slate-500 dark:text-slate-400">Share your proposal and availability with the client.</p>
              <Button className="mt-5 min-h-[50px] w-full rounded-[15px] bg-gradient-to-r from-violet-600 to-purple-600 text-[15px] font-bold text-white shadow-lg shadow-violet-200 hover:from-violet-700 hover:to-purple-700 dark:shadow-none" disabled={applicationStatus.loading} onClick={() => setShowApplyModal(true)}>{applicationStatus.loading ? 'Checking application...' : 'Apply for this job'}</Button>
            </Card>
          ) : (
            <Card className="rounded-[23px] border-violet-100/90 p-5 text-center shadow-[0_14px_44px_rgba(63,45,119,.08)] dark:border-slate-700 dark:bg-surface-800">
              <p className="text-[17px] font-bold text-slate-800 dark:text-slate-100">Applications are closed</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This job is {job.status.toLowerCase()} and no longer accepting proposals.</p>
            </Card>
          )}

          {accepted && <ContractPaymentPanel jobId={id} viewerRole="provider" expectedBudget={job.budget} expectedContractAmount={agreedContractAmount} />}
        </aside>
      </div>

      {showApplyModal && (
        <ApplyModal
          jobId={id}
          budget={job.budget}
          onClose={() => setShowApplyModal(false)}
          onApplied={() => setApplicationStatus({ loading: false, applied: true, status: 'Pending' })}
          onAlreadyApplied={() => { setApplicationStatus({ loading: false, applied: true, status: 'Pending' }); setShowApplyModal(false); }}
        />
      )}
    </div>
  );
};

export default WorkerJobDetail;
