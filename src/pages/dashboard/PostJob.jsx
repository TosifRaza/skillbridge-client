// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useAppSelector } from '@/store/hooks'; // Import Redux hook
// // import axiosInstance from '@/api/axiosInstance';
// // import Input from '@/components/ui/Input';
// // import Select from '@/components/ui/Select';
// // import Button from '@/components/ui/Button';
// // import Card from '@/components/ui/Card';
// // import { PHASE_1_SERVICES } from '@/constants/services'; // STRICT MVP V1 CATEGORIES ONLY

// // // Generate categories from our strict constants file
// // const categories = PHASE_1_SERVICES.map(service => ({
// //   value: service.name,
// //   label: `${service.emoji} ${service.name}`
// // }));

// // const PostJob = () => {
// //   const navigate = useNavigate();
// //   const { city } = useAppSelector((state) => state.location); // 1. Get Global City
  
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
  
// //   const [formData, setFormData] = useState({
// //     title: '', 
// //     description: '', 
// //     category: 'House Cleaning', 
// //     budget: '', 
// //     deadline: '', 
// //     address: city || 'Mumbai', // 2. Pre-fill with selected city
// //     latitude: '22.5726',       // Default India coords (Kolkata)
// //     longitude: '88.3639'
// //   });
// //   const [images, setImages] = useState([]);

// //   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const data = new FormData();
      
// //       // Append text fields
// //       Object.keys(formData).forEach(key => {
// //         data.append(key, formData[key]);
// //       });

// //       // 3. Ensure the address contains the selected city for backend filtering
// //       // This is the Phase A integration without the broken 'serviceType' variable
// //       if (!formData.address.toLowerCase().includes(city.toLowerCase())) {
// //         data.set('address', `${formData.address}, ${city}`);
// //       }

// //       // Append images
// //       if (images) {
// //         for (let i = 0; i < images.length; i++) {
// //           data.append('images', images[i]);
// //         }
// //       }

// //       await axiosInstance.post('/jobs', data, {
// //         headers: { 'Content-Type': 'multipart/form-data' }
// //       });
      
// //       navigate('/dashboard');
// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Failed to post job');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-3xl mx-auto animate-fade-in">
// //       <h1 className="text-3xl font-bold text-surface-900 mb-2">Post a New Job</h1>
// //       <p className="text-surface-500 mb-8">Describe your problem to get the best bids from local professionals in {city}.</p>

// //       <Card>
// //         {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">⚠️ {error}</div>}
        
// //         <form onSubmit={handleSubmit} className="space-y-5">
// //           <Input label="Job Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Need help moving a sofa" required />
          
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// //             {/* 4. Using STRICT Phase 1 Categories */}
// //             <Select label="Category" name="category" value={formData.category} onChange={handleChange} options={categories} />
// //             <Input label="Budget (₹)" name="budget" type="number" value={formData.budget} onChange={handleChange} placeholder="500" required />
// //           </div>

// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
// //             <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-3 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition" placeholder="Provide all the details..." required />
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// //             <Input label="Deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
// //             <Input label="Location Address" name="address" value={formData.address} onChange={handleChange} placeholder="Sector V, Salt Lake" required />
// //           </div>

// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-surface-700 mb-1">Upload Images (Optional)</label>
// //             <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer" />
// //           </div>

// //           <div className="flex justify-end pt-4 border-t border-surface-100">
// //             <Button type="submit" isLoading={loading}>Publish Job</Button>
// //           </div>
// //         </form>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default PostJob;  


//                                       // UPDATED
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppSelector } from '@/store/hooks';
// import axiosInstance from '@/api/axiosInstance';
// import Input from '@/components/ui/Input';
// import Select from '@/components/ui/Select';
// import Button from '@/components/ui/Button';
// import Card from '@/components/ui/Card';
// import { PHASE_1_SERVICES } from '@/constants/services';

// // Generate categories from Phase 1 services
// const categories = PHASE_1_SERVICES.map((service) => ({
//   value: service.name,
//   label: `${service.emoji} ${service.name}`,
// }));

// const PostJob = () => {
//   const navigate = useNavigate();
//   const { city } = useAppSelector((state) => state.location);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Service Type (required by backend)
//   const [serviceType, setServiceType] = useState('local');

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: 'House Cleaning',
//     budget: '',
//     deadline: '',
//     address: city || 'Mumbai',
//     latitude: '22.5726',
//     longitude: '88.3639',
//   });

//   const [images, setImages] = useState([]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     setError(null);

//     try {
//       const data = new FormData();

//       // Append all text fields
//       Object.keys(formData).forEach((key) => {
//         data.append(key, formData[key]);
//       });

//       // Required backend field
//       data.append('serviceType', serviceType);

//       // Ensure city is included in address
//       if (
//         city &&
//         !formData.address.toLowerCase().includes(city.toLowerCase())
//       ) {
//         data.set('address', `${formData.address}, ${city}`);
//       }

//       // Upload files (backend multer field = files)
//       if (images && images.length > 0) {
//         for (let i = 0; i < images.length; i++) {
//           data.append('files', images[i]);
//         }
//       }

//       await axiosInstance.post('/jobs', data, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       navigate('/dashboard');
//     } catch (err) {
//       setError(
//         err?.response?.data?.message ||
//           'Failed to post job. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto animate-fade-in">
//       <h1 className="text-3xl font-bold text-surface-900 mb-2">
//         Post a New Job
//       </h1>

//       <p className="text-surface-500 mb-8">
//         Describe your problem to get the best bids from local professionals in{' '}
//         {city || 'your city'}.
//       </p>

//       <Card>
//         {error && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
//             ⚠️ {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Service Type */}
//           <div>
//             <label className="block text-sm font-medium text-surface-700 mb-2">
//               Service Type
//             </label>

//             <div className="flex flex-wrap gap-3">
//               <button
//                 type="button"
//                 onClick={() => setServiceType('local')}
//                 className={`px-4 py-2 rounded-xl border transition ${
//                   serviceType === 'local'
//                     ? 'bg-primary-600 text-white border-primary-600'
//                     : 'bg-white border-surface-200 text-surface-700'
//                 }`}
//               >
//                 🏠 Local Service
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setServiceType('digital')}
//                 className={`px-4 py-2 rounded-xl border transition ${
//                   serviceType === 'digital'
//                     ? 'bg-primary-600 text-white border-primary-600'
//                     : 'bg-white border-surface-200 text-surface-700'
//                 }`}
//               >
//                 💻 Digital Service
//               </button>
//             </div>
//           </div>

//           {/* Job Title */}
//           <Input
//             label="Job Title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="e.g. Need help moving a sofa"
//             required
//           />

//           {/* Category + Budget */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <Select
//               label="Category"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               options={categories}
//             />

//             <Input
//               label="Budget (₹)"
//               name="budget"
//               type="number"
//               value={formData.budget}
//               onChange={handleChange}
//               placeholder="500"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-surface-700 mb-1">
//               Description
//             </label>

//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows={5}
//               required
//               placeholder="Provide all the details about the work..."
//               className="w-full px-3 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
//             />
//           </div>

//           {/* Deadline + Address */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <Input
//               label="Deadline"
//               name="deadline"
//               type="date"
//               value={formData.deadline}
//               onChange={handleChange}
//               required
//             />

//             <Input
//               label="Location Address"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Sector V, Salt Lake"
//               required
//             />
//           </div>

//           {/* File Upload */}
//           <div>
//             <label className="block text-sm font-medium text-surface-700 mb-1">
//               Upload Images (Optional)
//             </label>

//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={(e) => setImages(e.target.files)}
//               className="w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
//             />
//           </div>

//           {/* Submit */}
//           <div className="flex justify-end pt-4 border-t border-surface-100">
//             <Button type="submit" isLoading={loading}>
//               Publish Job
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// };

// export default PostJob;





import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { createJob } from '@/store/slices/jobSlice';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { PHASE_1_SERVICES } from '@/constants/services';
import { HiOutlineUpload, HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineClipboardList, HiOutlineCheckCircle } from 'react-icons/hi';

const steps = [
  { id: 1, title: 'The Basics', icon: HiOutlineClipboardList },
  { id: 2, title: 'Visuals', icon: HiOutlineUpload },
  { id: 3, title: 'Budget & Time', icon: HiOutlineCurrencyDollar },
  { id: 4, title: 'Location', icon: HiOutlineLocationMarker },
  { id: 5, title: 'Review', icon: HiOutlineCheckCircle },
];

const PostJob = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { city } = useAppSelector((state) => state.location);
  const { loading, error } = useAppSelector((state) => state.job);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: PHASE_1_SERVICES[0].name, // Default to first category
    serviceType: 'local',
    budget: '',
    deadline: '',
    address: city || 'Mumbai',
    latitude: '22.5726', // Default coords
    longitude: '88.3639',
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => {
    // Basic validation per step
    if (currentStep === 1 && (!formData.title || !formData.description)) {
      alert('Please fill in the title and description.');
      return;
    }
    if (currentStep === 3 && (!formData.budget || !formData.deadline)) {
      alert('Please set a budget and deadline.');
      return;
    }
    if (currentStep === 4 && !formData.address) {
      alert('Please provide an address or location.');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // const handleSubmit = async () => {
  //   const data = new FormData();
  //   Object.keys(formData).forEach((key) => data.append(key, formData[key]));

  //   // Append images (Backend expects 'files')
  //  if (images.length > 0) {
  //     for (let i = 0; i < images.length; i++) {
  //       data.append('images', images[i]); // <-- Changed from 'files' to 'images'
  //     }
  //   }

  //   const result = await dispatch(createJob(data));
  //   if (createJob.fulfilled.match(result)) {
  //     navigate('/customer/jobs');
  //   }
  // };
    const handleSubmit = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    // ================= FIX IS HERE =================
    // Change 'files' to match EXACTLY what your backend uploadMiddleware expects
    // Common names: 'images', 'jobImages', 'files'
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]); // <-- Changed from 'files' to 'images'
      }
    }
    // ==============================================

    const result = await dispatch(createJob(data));
    if (createJob.fulfilled.match(result)) {
      navigate('/customer/jobs');
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">Post a New Job</h1>
      <p className="text-surface-500 dark:text-surface-400 mb-8">Follow the steps to get the best bids from professionals.</p>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-10">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex-1 flex flex-col items-center relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
              currentStep >= step.id 
                ? 'bg-primary-500 border-primary-500 text-white' 
                : 'bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-600 text-surface-400'
            }`}>
              <step.icon className="w-5 h-5" />
            </div>
            <p className={`text-xs mt-2 font-medium ${currentStep >= step.id ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'}`}>{step.title}</p>
            {idx < steps.length - 1 && (
              <div className={`absolute top-5 left-1/2 w-full h-0.5 transition-colors duration-300 ${
                currentStep > step.id ? 'bg-primary-500' : 'bg-surface-200 dark:bg-surface-700'
              }`}></div>
            )}
          </div>
        ))}
      </div>

      <Card className="dark:bg-surface-800 p-8 min-h-[400px] flex flex-col">
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">⚠️ {error}</div>}

        {/* Step 1: The Basics */}
        {currentStep === 1 && (
          <div className="space-y-5 flex-grow">
            <Input label="Job Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Need help moving a sofa" required />
            <div className="grid grid-cols-2 gap-5">
              <Select label="Category" name="category" value={formData.category} onChange={handleChange} options={PHASE_1_SERVICES.map(s => ({ value: s.name, label: `${s.emoji} ${s.name}` }))} />
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Service Type</label>
                <div className="flex gap-3 mt-1">
                  <button type="button" onClick={() => setFormData({...formData, serviceType: 'local'})} className={`flex-1 p-2 border-2 rounded-lg text-sm font-medium transition ${formData.serviceType === 'local' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'border-surface-200 dark:border-surface-700 text-surface-500'}`}>📍 Local</button>
                  <button type="button" onClick={() => setFormData({...formData, serviceType: 'digital'})} className={`flex-1 p-2 border-2 rounded-lg text-sm font-medium transition ${formData.serviceType === 'digital' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'border-surface-200 dark:border-surface-700 text-surface-500'}`}>💻 Digital</button>
                </div>
              </div>
            </div>
            <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Provide all the details a worker might need..." required />
          </div>
        )}

        {/* Step 2: Visuals */}
        {currentStep === 2 && (
          <div className="space-y-5 flex-grow">
            <h3 className="text-lg font-bold text-surface-900 dark:text-white">Upload Images (Optional)</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">Adding photos helps workers understand the job better and provide accurate bids.</p>
            <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl">
              <div className="space-y-1 text-center">
                <HiOutlineUpload className="mx-auto h-12 w-12 text-surface-400" />
                <div className="flex text-sm text-surface-600 dark:text-surface-300">
                  <label className="relative cursor-pointer bg-white dark:bg-surface-700 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                    <span>Upload files</span>
                    <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-surface-500">PNG, JPG, GIF up to 5MB (Max 5 files)</p>
              </div>
            </div>
            {images.length > 0 && <Badge variant="success">{images.length} file(s) selected</Badge>}
          </div>
        )}

        {/* Step 3: Budget & Time */}
        {currentStep === 3 && (
          <div className="space-y-5 flex-grow">
            <Input label="Budget (₹)" name="budget" type="number" value={formData.budget} onChange={handleChange} placeholder="e.g., 500" required />
            <Input label="Deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
          </div>
        )}

        {/* Step 4: Location */}
        {currentStep === 4 && (
          <div className="space-y-5 flex-grow">
            <Input label="Location Address" name="address" value={formData.address} onChange={handleChange} placeholder="Sector V, Salt Lake" required />
            <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-xl border border-surface-200 dark:border-surface-600">
              <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-2"><HiOutlineLocationMarker className="w-4 h-4 text-primary-500" /> Your current city is set to <span className="font-bold text-surface-700 dark:text-white">{city}</span>.</p>
            </div>
            {/* Hidden fields for lat/lon for now. Mapbox integration later. */}
          </div>
        )}

        {/* Step 5: Review & Publish */}
        {currentStep === 5 && (
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Review Your Job</h3>
            <div className="space-y-4 bg-surface-50 dark:bg-surface-700 p-6 rounded-xl">
              <div className="flex justify-between border-b border-surface-200 dark:border-surface-600 pb-2">
                <span className="text-surface-500 dark:text-surface-400">Title</span>
                <span className="font-medium text-surface-900 dark:text-white">{formData.title}</span>
              </div>
              <div className="flex justify-between border-b border-surface-200 dark:border-surface-600 pb-2">
                <span className="text-surface-500 dark:text-surface-400">Category</span>
                <span className="font-medium text-surface-900 dark:text-white">{formData.category}</span>
              </div>
              <div className="flex justify-between border-b border-surface-200 dark:border-surface-600 pb-2">
                <span className="text-surface-500 dark:text-surface-400">Service Type</span>
                <Badge variant={formData.serviceType === 'local' ? 'primary' : 'success'}>{formData.serviceType}</Badge>
              </div>
              <div className="flex justify-between border-b border-surface-200 dark:border-surface-600 pb-2">
                <span className="text-surface-500 dark:text-surface-400">Budget</span>
                <span className="font-medium text-primary-600 dark:text-primary-400">₹{formData.budget}</span>
              </div>
              <div className="flex justify-between border-b border-surface-200 dark:border-surface-600 pb-2">
                <span className="text-surface-500 dark:text-surface-400">Deadline</span>
                <span className="font-medium text-surface-900 dark:text-white">{formData.deadline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500 dark:text-surface-400">Location</span>
                <span className="font-medium text-surface-900 dark:text-white">{formData.address}</span>
              </div>
              {images.length > 0 && (
                <div className="pt-4 border-t border-surface-200 dark:border-surface-600">
                  <span className="text-surface-500 dark:text-surface-400 block mb-2">Images</span>
                  <Badge variant="success">{images.length} file(s) attached</Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handleBack}>Back</Button>
          ) : (
            <div /> // Empty div for spacing
          )}
          {currentStep < 5 ? (
            <Button onClick={handleNext}>Next Step</Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={loading} className="shadow-glow">
              Publish Job 🚀
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PostJob;