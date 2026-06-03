import Button from '@/components/ui/Button';

const EmptyState = ({ 
  icon = '🤷‍♂️', 
  title = 'Nothing here yet', 
  description = 'Check back later or create something new.', 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-xl font-bold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-500 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};

export default EmptyState;