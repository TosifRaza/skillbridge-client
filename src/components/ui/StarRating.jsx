import { HiStar } from 'react-icons/hi';
import { cn } from '@/utils/helpers';

const StarRating = ({ rating, maxRating = 5, size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => (
        <HiStar
          key={i}
          className={cn(
            sizes[size],
            i < Math.floor(rating) ? 'text-yellow-400' : 'text-surface-300'
          )}
        />
      ))}
    </div>
  );
};

export default StarRating;