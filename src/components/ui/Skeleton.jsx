import { cn } from '@/utils/helpers';

const Skeleton = ({ className, variant = 'rect' }) => {
  const variants = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded h-4 w-3/4',
  };

  return (
    <div className={cn(
      "bg-surface-200 animate-pulse",
      variants[variant],
      className
    )} />
  );
};

export default Skeleton;

// Pre-built complex skeleton for Job Cards
export const JobCardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-surface-200 space-y-4">
    <div className="flex justify-between">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton variant="text" className="h-6 w-3/4" />
    <Skeleton variant="text" className="h-16 w-full" />
    <div className="flex justify-between pt-4 border-t border-surface-100">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
);