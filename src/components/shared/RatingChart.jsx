import StarRating from '@/components/ui/StarRating';

const RatingChart = ({ distribution, totalReviews }) => {
  if (!distribution) return null;

  // Calculate total to get percentages (fallback to 1 to avoid division by zero)
  const total = totalReviews || Object.values(distribution).reduce((sum, count) => sum + count, 0);

  const bars = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: distribution[star] || 0,
    percentage: total > 0 ? ((distribution[star] || 0) / total) * 100 : 0,
  }));

  return (
    <div className="space-y-2">
      {bars.map(({ star, count, percentage }) => (
        <div key={star} className="flex items-center gap-2 text-sm">
          <span className="w-8 text-right font-medium text-surface-700 dark:text-surface-300">{star}★</span>
          <div className="flex-1 h-2.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="w-8 text-xs text-surface-500 dark:text-surface-400">{count}</span>
        </div>
      ))}
    </div>
  );
};

export default RatingChart;