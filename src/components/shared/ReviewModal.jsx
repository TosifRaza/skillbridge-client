import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { createReview } from '@/store/slices/customerSlice';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import StarRating from '@/components/ui/StarRating';
import { HiStar } from 'react-icons/hi';

const ReviewModal = ({ isOpen, onClose, jobId, workerId }) => {
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
//    console.log('jobId:', jobId);
//   console.log('workerId:', workerId);
//   console.log('workerId type:', typeof workerId);
    if (rating === 0) return alert('Please select a rating.');
    setLoading(true);
    const result = await dispatch(createReview({ job: jobId, worker: workerId, rating, comment }));
   //  console.log('Review Result:', result);
    if (createReview.fulfilled.match(result)) {
      alert('Review submitted successfully!');
      onClose();
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review">
      <div className="space-y-6">
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110"
            >
              <HiStar className={`w-10 h-10 transition-colors ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-surface-300 dark:text-surface-600'}`} />
            </button>
          ))}
        </div>
        <Textarea 
          label="Your Feedback" 
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          placeholder="Tell others about your experience with this professional..." 
          required 
        />
        <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={loading}>Submit Review</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;