import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const categories = [
  { value: 'House Cleaning', label: '🧹 House Cleaning' },
  { value: 'Moving Helper', label: '📦 Moving Helper' },
  { value: 'Electrician', label: '⚡ Electrician' },
  { value: 'Plumber', label: '🔧 Plumber' },
  { value: 'Web Development', label: '💻 Web Development' },
  { value: 'Graphic Design', label: '🎨 Graphic Design' },
];

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'House Cleaning', budget: '', deadline: '', address: '', latitude: '40.7128', longitude: '-74.0060'
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Must send as multipart/form-data because of images
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (images) {
        for (let i = 0; i < images.length; i++) {
          data.append('images', images[i]);
        }
      }

      await axiosInstance.post('/jobs', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 mb-2">Post a New Job</h1>
      <p className="text-surface-500 mb-8">Describe your problem to get the best bids from professionals.</p>

      <Card>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">⚠️ {error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Job Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Need a plumber to fix kitchen sink" required />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select label="Category" name="category" value={formData.category} onChange={handleChange} options={categories} />
            <Input label="Budget ($)" name="budget" type="number" value={formData.budget} onChange={handleChange} placeholder="100" required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-3 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition" placeholder="Provide all the details..." required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
            <Input label="Location Address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, NY" required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-surface-700 mb-1">Upload Images (Optional)</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer" />
          </div>

          <div className="flex justify-end pt-4 border-t border-surface-100">
            <Button type="submit" isLoading={loading}>Publish Job</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PostJob;