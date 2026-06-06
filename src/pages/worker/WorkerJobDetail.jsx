import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchJobById } from '@/store/slices/jobSlice';
import ApplyModal from '@/components/shared/ApplyModal';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { HiOutlineArrowLeft, HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineBriefcase } from 'react-icons/hi';

const statusVariant = {
  Open: 'success', Assigned: 'primary', 'In-Progress': 'warning', Completed: 'gray', Cancelled: 'danger', Closed: 'gray',
};

const WorkerJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentJob: job, loading } = useAppSelector((state) => state.job);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  if (loading || !job) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-500 hover:text-surface-800 dark:hover:text-white mb-6 transition">
        <HiOutlineArrowLeft className="w-5 h-5" /> Back to Jobs
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dark:bg-surface-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
              <span className="text-sm text-surface-400">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-4">{job.title}</h1>
            <p className="text-surface-600 dark:text-surface-300 whitespace-pre-wrap leading-relaxed mb-6">{job.description}</p>
            
            {job.images && job.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                {job.images.map((img, idx) => (
                  <img key={idx} src={img.url} alt={`Job ${idx+1}`} className="w-full h-40 object-cover rounded-xl border border-surface-200 dark:border-surface-700" />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Budget, Location, Apply CTA */}
        <div className="space-y-6">
          <Card className="dark:bg-surface-800 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-surface-200 dark:border-surface-700">
                <span className="text-surface-500 dark:text-surface-400">Budget</span>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{job.budget}</span>
              </div>
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <HiOutlineClock className="w-5 h-5 text-surface-400" />
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <HiOutlineLocationMarker className="w-5 h-5 text-surface-400" />
                <span>{job.location?.address || 'Remote'}</span>
              </div>
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <HiOutlineBriefcase className="w-5 h-5 text-surface-400" />
                <span>Type: {job.serviceType || 'local'}</span>
              </div>
            </div>
          </Card>

          {/* Action Button */}
          {job.status === 'Open' && (
            <Button className="w-full shadow-glow text-lg py-3" onClick={() => setShowApplyModal(true)}>
              Apply Now
            </Button>
          )}

          {job.status !== 'Open' && (
            <Card className="dark:bg-surface-800 p-4 bg-surface-50 dark:bg-surface-900 border-dashed border-2 border-surface-300 dark:border-surface-700 text-center">
              <p className="text-surface-500 text-sm">This job is no longer accepting applications.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Apply Modal Trigger */}
      {showApplyModal && <ApplyModal jobId={id} onClose={() => setShowApplyModal(false)} />}
    </div>
  );
};

export default WorkerJobDetail;