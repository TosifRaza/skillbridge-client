import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';

const statusVariant = {
  Open: 'success',
  Assigned: 'primary',
  Completed: 'gray',
  Cancelled: 'danger',
};

const JobCard = ({ job }) => {
  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Badge variant={statusVariant[job.status] || 'gray'}>{job.status}</Badge>
        <span className="text-sm text-surface-500">{new Date(job.createdAt).toLocaleDateString()}</span>
      </div>
      
      <h3 className="text-lg font-bold text-surface-800 mb-2 line-clamp-2">{job.title}</h3>
      <p className="text-surface-500 text-sm mb-4 line-clamp-3">{job.description}</p>
      
      <div className="mt-auto pt-4 border-t border-surface-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* If job.customer is populated, show avatar */}
          {typeof job.customer === 'object' && (
            <Avatar name={job.customer.email} size="sm" />
          )}
          <span className="text-sm text-surface-600 font-medium">{job.category}</span>
        </div>
        
        <div className="text-right">
          <p className="text-xl font-bold text-primary-600">${job.budget}</p>
          <p className="text-xs text-surface-400">Budget</p>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;