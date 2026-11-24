import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createJob } from '@/store/slices/jobSlice';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import StarRating from '@/components/ui/StarRating';
import { PHASE_1_SERVICES } from '@/constants/services';
import {
  HiOutlineShieldCheck,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

const categoryOptions = PHASE_1_SERVICES.map((s) => ({
  value: s.name,
  label: `${s.emoji} ${s.name}`,
}));

const DirectHireModal = ({ isOpen, onClose, provider }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { city } = useAppSelector((state) => state.location);
  const { loading } = useAppSelector((state) => state.job);

  const [formData, setFormData] = useState({
    title: '',
    category: PHASE_1_SERVICES[0].name,
    budget: '500',
    deadline: '',
    address: '',
    description: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Pre-fill fields whenever the modal opens or provider changes
  useEffect(() => {
    if (provider && isOpen) {
      // Find matching category from provider specialty
      const matchedCat = PHASE_1_SERVICES.find((s) =>
        provider.specialty?.toLowerCase().includes(s.name.toLowerCase())
      )?.name;

      // Default deadline to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDateStr = tomorrow.toISOString().split('T')[0];

      // Pre-fill address from customer profile if available
      const defaultAddress =
        user?.addresses?.[0]?.street && user?.addresses?.[0]?.city
          ? `${user.addresses[0].street}, ${user.addresses[0].city}`
          : city || 'Local Address';

      setFormData({
        title: `Service booking with ${provider.name}`,
        category: matchedCat || PHASE_1_SERVICES[0].name,
        budget: provider.price ? provider.price.replace(/\D/g, '') || '500' : '500',
        deadline: defaultDateStr,
        address: defaultAddress,
        description: `Direct hire request for ${provider.name}. Please confirm availability and arrival time.`,
      });
      setError(null);
      setSuccess(false);
    }
  }, [provider, isOpen, user]);

  if (!provider) return null;

  const handleChange = (e) => {
    setFormData((curr) => ({ ...curr, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a title for this service.');
      return;
    }
    if (!formData.budget || Number(formData.budget) <= 0) {
      setError('Please provide a valid budget.');
      return;
    }
    if (!formData.deadline) {
      setError('Please choose a service date.');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please provide your service location or address.');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim() || formData.title.trim());
      data.append('category', formData.category);
      data.append('budget', formData.budget);
      data.append('deadline', new Date(formData.deadline).toISOString());
      data.append('address', formData.address.trim());
      data.append('longitude', '88.3639');
      data.append('latitude', '22.5726');
      data.append('serviceType', 'local');

      // Send the provider ID if it is a valid database ID
      if (provider._id && !provider._id.startsWith('sample')) {
        data.append('hiredProvider', provider._id);
      }

      const result = await dispatch(createJob(data));

      if (createJob.fulfilled.match(result)) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          const newJobId = result.payload?._id;
          if (newJobId) {
            navigate(`/customer/jobs/${newJobId}`);
          } else {
            navigate('/customer/jobs');
          }
        }, 1200);
      } else {
        setError(result.payload || 'Failed to hire provider. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Direct Hire: ${provider.name}`}
      size="lg"
    >
      {/* Provider Snapshot Banner */}
      <div className="mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-violet-50/80 p-4 dark:border-indigo-950/60 dark:from-indigo-950/40 dark:to-violet-950/30">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-xl font-bold text-primary-600 dark:bg-primary-900/40">
            {provider.avatar ? (
              <img
                src={provider.avatar}
                alt={provider.name}
                className="h-full w-full object-cover"
              />
            ) : (
              provider.initial || provider.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-surface-900 dark:text-white">
                {provider.name}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                <HiOutlineShieldCheck className="h-3 w-3" /> Direct Hire
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={Number(provider.rating || 5.0)} size="sm" />
              <span className="text-xs text-surface-500 dark:text-surface-400">
                {provider.rating || '5.0'} ({provider.reviews || 0} reviews)
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="truncate text-xs font-medium text-indigo-700 dark:text-indigo-300">
                {provider.specialty}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
          ⚡ <strong>No public bidding required:</strong> This project will be directly offered to{' '}
          <strong>{provider.name}</strong> at your specified budget and schedule.
        </p>
      </div>

      {/* Alert Notices */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <HiOutlineCheckCircle className="h-5 w-5 text-emerald-600" />
          Direct booking created! Redirecting to your job contract...
        </div>
      )}

      {/* Direct Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Service / Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Deep cleaning of 2BHK apartment"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Service Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
          />

          <Input
            label="Agreed Budget (₹)"
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleChange}
            placeholder="500"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Service Date"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            required
          />

          <Input
            label="Service Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address, City"
            required
          />
        </div>

        <div>
          <Textarea
            label="Task Instructions / Notes for Worker"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what needs to be done, specific timings, materials available, etc."
          />
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading || success}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={loading || success}
            className="gradient-primary shadow-glow min-w-36 font-bold text-white"
          >
            {success ? 'Hired!' : `Hire ${provider.name}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DirectHireModal;
