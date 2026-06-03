import { cn } from '@/utils/helpers';

const Textarea = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full px-3 py-2.5 rounded-xl border bg-white dark:bg-surface-800",
          "text-surface-900 dark:text-surface-100",
          "placeholder:text-surface-400 dark:placeholder:text-surface-500",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
          "transition-colors duration-200",
          error 
            ? "border-red-500 focus:ring-red-500" 
            : "border-surface-200 dark:border-surface-700",
          className
        )}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Textarea;