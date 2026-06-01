import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { applyToJob } from '@/store/slices/applicationSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const ApplyModal = ({ jobId, onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ proposalMessage: '', bidAmount: '', estimatedCompletionTime: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const result = await dispatch(applyToJob({ job: jobId, ...formData }));
    if (applyToJob.fulfilled.match(result)) {
      onClose(); // Close modal on success
    } else {
      setError(result.payload || 'Failed to submit application');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-large w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-surface-400 hover:text-surface-600 text-2xl">&times;</button>
        
        <h2 className="text-2xl font-bold text-surface-900 mb-6">Submit Your Proposal</h2>
        
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Cover Letter</label>
            <textarea name="proposalMessage" value={formData.proposalMessage} onChange={handleChange} rows="4" className="w-full px-3 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition" placeholder="Why are you the best fit?" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Your Bid ($)" name="bidAmount" type="number" value={formData.bidAmount} onChange={handleChange} placeholder="150" required />
            <Input label="Est. Completion" name="estimatedCompletionTime" value={formData.estimatedCompletionTime} onChange={handleChange} placeholder="e.g. 2 days" required />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={loading}>Submit Proposal</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;