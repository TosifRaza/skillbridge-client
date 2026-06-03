// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppSelector } from '@/store/hooks'; // Import Redux hook
// import axiosInstance from '@/api/axiosInstance';
// import Input from '@/components/ui/Input';
// import Select from '@/components/ui/Select';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { PHASE_1_SERVICES } from '@/constants/services'; // STRICT MVP V1 CATEGORIES ONLY

// // Generate categories from our strict constants file
// const categories = PHASE_1_SERVICES.map(service => ({
//   value: service.name,
//   label: `${service.emoji} ${service.name}`
// }));

// const PostJob = () => {
//   const navigate = useNavigate();
//   const { city } = useAppSelector((state) => state.location); // 1. Get Global City
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   const [formData, setFormData] = useState({
//     title: '', 
//     description: '', 
//     category: 'House Cleaning', 
//     budget: '', 
//     deadline: '', 
//     address: city || 'Mumbai', // 2. Pre-fill with selected city
//     latitude: '22.5726',       // Default India coords (Kolkata)
//     longitude: '88.3639'
//   });
//   const [images, setImages] = useState([]);

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const data = new FormData();
      
//       // Append text fields
//       Object.keys(formData).forEach(key => {
//         data.append(key, formData[key]);
//       });

//       // 3. Ensure the address contains the selected city for backend filtering
//       // This is the Phase A integration without the broken 'serviceType' variable
//       if (!formData.address.toLowerCase().includes(city.toLowerCase())) {
//         data.set('address', `${formData.address}, ${city}`);
//       }

//       // Append images
//       if (images) {
//         for (let i = 0; i < images.length; i++) {
//           data.append('images', images[i]);
//         }
//       }

//       await axiosInstance.post('/jobs', data, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
      
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to post job');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto animate-fade-in">
//       <h1 className="text-3xl font-bold text-surface-900 mb-2">Post a New Job</h1>
//       <p className="text-surface-500 mb-8">Describe your problem to get the best bids from local professionals in {city}.</p>

//       <Card>
//         {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">⚠️ {error}</div>}
        
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <Input label="Job Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Need help moving a sofa" required />
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             {/* 4. Using STRICT Phase 1 Categories */}
//             <Select label="Category" name="category" value={formData.category} onChange={handleChange} options={categories} />
//             <Input label="Budget (₹)" name="budget" type="number" value={formData.budget} onChange={handleChange} placeholder="500" required />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
//             <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-3 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition" placeholder="Provide all the details..." required />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <Input label="Deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
//             <Input label="Location Address" name="address" value={formData.address} onChange={handleChange} placeholder="Sector V, Salt Lake" required />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-surface-700 mb-1">Upload Images (Optional)</label>
//             <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer" />
//           </div>

//           <div className="flex justify-end pt-4 border-t border-surface-100">
//             <Button type="submit" isLoading={loading}>Publish Job</Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// };

// export default PostJob;  


                                      // UPDATED
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import axiosInstance from '@/api/axiosInstance';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { PHASE_1_SERVICES } from '@/constants/services';

// Generate categories from Phase 1 services
const categories = PHASE_1_SERVICES.map((service) => ({
  value: service.name,
  label: `${service.emoji} ${service.name}`,
}));

const PostJob = () => {
  const navigate = useNavigate();
  const { city } = useAppSelector((state) => state.location);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Service Type (required by backend)
  const [serviceType, setServiceType] = useState('local');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'House Cleaning',
    budget: '',
    deadline: '',
    address: city || 'Mumbai',
    latitude: '22.5726',
    longitude: '88.3639',
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const data = new FormData();

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Required backend field
      data.append('serviceType', serviceType);

      // Ensure city is included in address
      if (
        city &&
        !formData.address.toLowerCase().includes(city.toLowerCase())
      ) {
        data.set('address', `${formData.address}, ${city}`);
      }

      // Upload files (backend multer field = files)
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          data.append('files', images[i]);
        }
      }

      await axiosInstance.post('/jobs', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/dashboard');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Failed to post job. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 mb-2">
        Post a New Job
      </h1>

      <p className="text-surface-500 mb-8">
        Describe your problem to get the best bids from local professionals in{' '}
        {city || 'your city'}.
      </p>

      <Card>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Service Type
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setServiceType('local')}
                className={`px-4 py-2 rounded-xl border transition ${
                  serviceType === 'local'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white border-surface-200 text-surface-700'
                }`}
              >
                🏠 Local Service
              </button>

              <button
                type="button"
                onClick={() => setServiceType('digital')}
                className={`px-4 py-2 rounded-xl border transition ${
                  serviceType === 'digital'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white border-surface-200 text-surface-700'
                }`}
              >
                💻 Digital Service
              </button>
            </div>
          </div>

          {/* Job Title */}
          <Input
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Need help moving a sofa"
            required
          />

          {/* Category + Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories}
            />

            <Input
              label="Budget (₹)"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              placeholder="Provide all the details about the work..."
              className="w-full px-3 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          {/* Deadline + Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
            />

            <Input
              label="Location Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Sector V, Salt Lake"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Upload Images (Optional)
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
              className="w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-surface-100">
            <Button type="submit" isLoading={loading}>
              Publish Job
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PostJob;