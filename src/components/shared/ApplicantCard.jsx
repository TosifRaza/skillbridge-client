import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { useAppDispatch } from '@/store/hooks';
import { acceptApplication, rejectApplication } from '@/store/slices/applicationSlice';

const ApplicantCard = ({ application }) => {
  const dispatch = useAppDispatch();
  const worker = typeof application.worker === 'object' ? application.worker : { email: 'Worker' };

  const statusVariant = {
    Pending: 'warning',
    Accepted: 'success',
    Rejected: 'danger',
  };

  return (
    <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar name={worker.email} />
        <div>
          <p className="font-semibold text-surface-900">{worker.email}</p>
          <p className="text-sm text-surface-500 mt-1 line-clamp-2">{application.proposalMessage}</p>
        </div>
      </div>

      <div className="flex flex-col md:items-end gap-2">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-primary-600">${application.bidAmount}</span>
          <span className="text-sm text-surface-400">{application.estimatedCompletionTime}</span>
        </div>
        
        <Badge variant={statusVariant[application.status]}>{application.status}</Badge>

        {application.status === 'Pending' && (
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => dispatch(acceptApplication(application._id))}>Hire</Button>
            <Button size="sm" variant="outline" onClick={() => dispatch(rejectApplication(application._id))}>Reject</Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ApplicantCard;