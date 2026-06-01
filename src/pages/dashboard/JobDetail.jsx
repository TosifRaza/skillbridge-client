import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchJobById } from '@/store/slices/jobSlice';
import { fetchJobApplications, clearApplications } from '@/store/slices/applicationSlice';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import ApplicantCard from '@/components/shared/ApplicantCard';
import ApplyModal from '@/components/shared/ApplyModal';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineArrowLeft } from 'react-icons/hi';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  const { currentJob: job, loading: jobLoading } = useAppSelector((state) => state.job);
  const { applications, loading: appLoading } = useAppSelector((state) => state.application);
  
  const [showApplyModal, setShowApplyModal] = useState(false);

  const isCustomer = user?.role === 'customer';
  const isOwner = job?.customer?._id === user?._id || job?.customer === user?._id;

  useEffect(() => {
    dispatch(fetchJobById(id));
    
    return () => {
      dispatch(clearApplications()); // Clean up when leaving page
    };
  }, [dispatch, id]);

  // If it's the owner viewing, fetch the applications for this job
  useEffect(() => {
    if (isOwner && job) {
      dispatch(fetchJobApplications(id));
    }
  }, [dispatch, id, isOwner, job]);

  if (jobLoading || !job) return <div className="flex justify-center py-20"><Spinner /></div>;

  const statusVariant = {
    Open: 'success', Assigned: 'primary', 'In-Progress': 'warning', Completed: 'gray', Cancelled: 'danger',
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-500 hover:text-surface-800 mb-6 transition">
        <HiOutlineArrowLeft className="w-5 h-5" /> Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
              <span className="text-sm text-surface-400">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-surface-900 mb-4">{job.title}</h1>
            <p className="text-surface-600 whitespace-pre-wrap leading-relaxed mb-6">{job.description}</p>
            
            {job.images && job.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                {job.images.map((img, idx) => (
                  <img key={idx} src={img.url} alt={`Job ${idx+1}`} className="w-full h-40 object-cover rounded-xl border border-surface-200" />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Budget, Location, Actions */}
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-surface-100">
                <span className="text-surface-500">Budget</span>
                <span className="text-2xl font-bold text-primary-600">${job.budget}</span>
              </div>
              <div className="flex items-center gap-3 text-surface-600">
                <HiOutlineClock className="w-5 h-5 text-surface-400" />
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-surface-600">
                <HiOutlineLocationMarker className="w-5 h-5 text-surface-400" />
                <span>{job.location?.address || 'Remote'}</span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          {!isOwner && job.status === 'Open' && (
            <Button className="w-full shadow-glow" onClick={() => setShowApplyModal(true)}>
              Apply Now
            </Button>
          )}
        </div>
      </div>

      {/* Applicants Section (Only visible to Job Owner) */}
      {isOwner && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-surface-900 mb-4">Applicants ({applications.length})</h2>
          {appLoading ? <Spinner /> : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map(app => <ApplicantCard key={app._id} application={app} />)}
            </div>
          ) : (
            <Card className="text-center py-8">
              <p className="text-surface-500">No applicants yet. Check back soon!</p>
            </Card>
          )}
        </div>
      )}

      {/* Apply Modal Trigger */}
      {showApplyModal && <ApplyModal jobId={id} onClose={() => setShowApplyModal(false)} />}
    </div>
  );
};

export default JobDetail;