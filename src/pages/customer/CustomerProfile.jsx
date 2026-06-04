// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppSelector, useAppDispatch } from '@/store/hooks';
// import { updateCustomerProfile, uploadProfilePhoto } from '@/store/slices/customerSlice';
// import Card from '@/components/ui/Card';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Spinner from '@/components/ui/Spinner';
// import { HiOutlineArrowLeft, HiOutlineUpload, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

// const CustomerProfile = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { user } = useAppSelector((state) => state.auth);
//   const { profileUpdateLoading } = useAppSelector((state) => state.customer);
  
//   const [formData, setFormData] = useState({
//     fullName: user?.fullName || '',
//     phone: user?.phone || '',
//   });
//   const [addresses, setAddresses] = useState(user?.addresses || [{ street: '', city: '', zip: '' }]);

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleAddressChange = (index, e) => {
//     const newAddresses = [...addresses];
//     newAddresses[index][e.target.name] = e.target.value;
//     setAddresses(newAddresses);
//   };

//   const addAddress = () => setAddresses([...addresses, { street: '', city: '', zip: '' }]);
//   const removeAddress = (index) => setAddresses(addresses.filter((_, i) => i !== index));

//   const handlePhotoUpload = async (e) => {
//     if (e.target.files[0]) {
//       await dispatch(uploadProfilePhoto(e.target.files[0]));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await dispatch(updateCustomerProfile({ ...formData, addresses }));
//   };

//   return (
//     <div className="max-w-3xl mx-auto animate-fade-in">
//       <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-500 hover:text-surface-800 dark:hover:text-white mb-6 transition">
//         <HiOutlineArrowLeft className="w-5 h-5" /> Back
//       </button>

//       <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">My Profile</h1>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Photo & Basic Info */}
//         <Card className="dark:bg-surface-800 p-6">
//           <div className="flex items-center gap-6 mb-6">
//             <div className="w-20 h-20 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600">
//               {user?.email?.[0].toUpperCase()}
//             </div>
//             <div>
//               <h2 className="font-bold text-surface-900 dark:text-white">{user?.email}</h2>
//               <label className="cursor-pointer mt-2 inline-block">
//                 <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
//                 <span className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center gap-1 hover:underline">
//                   <HiOutlineUpload className="w-4 h-4" /> Change Photo
//                 </span>
//               </label>
//             </div>
//           </div>
//           <div className="grid md:grid-cols-2 gap-4">
//             <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
//             <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
//           </div>
//         </Card>

//         {/* Addresses */}
//         <Card className="dark:bg-surface-800 p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-bold text-surface-900 dark:text-white">Saved Addresses</h3>
//             <button type="button" onClick={addAddress} className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center gap-1 hover:underline">
//               <HiOutlinePlus className="w-4 h-4" /> Add New
//             </button>
//           </div>
//           {addresses.map((addr, idx) => (
//             <div key={idx} className="border border-surface-200 dark:border-surface-700 rounded-lg p-4 mb-4 relative">
//               <button type="button" onClick={() => removeAddress(idx)} className="absolute top-2 right-2 text-surface-400 hover:text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
//               <div className="grid md:grid-cols-3 gap-3">
//                 <Input label="Street" name="street" value={addr.street} onChange={(e) => handleAddressChange(idx, e)} />
//                 <Input label="City" name="city" value={addr.city} onChange={(e) => handleAddressChange(idx, e)} />
//                 <Input label="Zip Code" name="zip" value={addr.zip} onChange={(e) => handleAddressChange(idx, e)} />
//               </div>
//             </div>
//           ))}
//         </Card>

//         {/* Payment Placeholder */}
//         <Card className="dark:bg-surface-800 p-6 bg-surface-50 dark:bg-surface-900 border-dashed border-2 border-surface-300 dark:border-surface-700">
//           <h3 className="font-bold text-surface-900 dark:text-white mb-2">Payment Methods</h3>
//           <p className="text-sm text-surface-500 dark:text-surface-400">Payment integration (Stripe/Razorpay) will be available here.</p>
//         </Card>

//         <div className="flex justify-end">
//           <Button type="submit" isLoading={profileUpdateLoading}>Save Changes</Button>
//         </div>
//       </form>
//     </div>
//   );
// };
// export default CustomerProfile;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateCustomerProfile, uploadProfilePhoto } from '@/store/slices/customerSlice';
import { updateLocalUser } from '@/store/slices/authSlice';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { HiOutlineArrowLeft, HiOutlineUpload, HiOutlinePlus, HiOutlineTrash, HiOutlineCreditCard } from 'react-icons/hi';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.customer);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
  });
  
  // Deep clone arrays from Redux to local state
  const [addresses, setAddresses] = useState(user?.addresses?.length ? JSON.parse(JSON.stringify(user.addresses)) : []);
  const [paymentMethods, setPaymentMethods] = useState(user?.paymentMethods?.length ? JSON.parse(JSON.stringify(user.paymentMethods)) : []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- Address CRUD ---
  const handleAddressChange = (index, e) => {
    const newAddresses = [...addresses];
    newAddresses[index][e.target.name] = e.target.value;
    setAddresses(newAddresses);
  };
  const addAddress = () => setAddresses([...addresses, { street: '', city: '', zip: '', isDefault: false }]);
  const removeAddress = (index) => setAddresses(addresses.filter((_, i) => i !== index));

  // --- Payment Method CRUD ---
  const handlePaymentChange = (index, e) => {
    const newPayments = [...paymentMethods];
    newPayments[index][e.target.name] = e.target.value;
    setPaymentMethods(newPayments);
  };
  const addPayment = () => setPaymentMethods([...paymentMethods, { cardBrand: '', last4: '', isDefault: false }]);
  const removePayment = (index) => setPaymentMethods(paymentMethods.filter((_, i) => i !== index));

  // --- Avatar Upload ---
  const handlePhotoUpload = async (e) => {
    if (e.target.files[0]) {
      const result = await dispatch(uploadProfilePhoto(e.target.files[0]));
      if (uploadProfilePhoto.fulfilled.match(result)) {
        // Instantly update the user across the entire app
        dispatch(updateLocalUser(result.payload)); 
      }
    }
  };

  // --- Save Profile ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Construct the exact payload matching the backend schema
    const payload = {
      fullName: formData.fullName,
      phone: formData.phone,
      addresses: addresses,
      paymentMethods: paymentMethods,
    };

    const result = await dispatch(updateCustomerProfile(payload));
    if (updateCustomerProfile.fulfilled.match(result)) {
      // Instantly update the user across the entire app
      dispatch(updateLocalUser(result.payload)); 
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-500 hover:text-surface-800 dark:hover:text-white mb-6 transition">
        <HiOutlineArrowLeft className="w-5 h-5" /> Back
      </button>

      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">My Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo & Basic Info */}
        <Card className="dark:bg-surface-800 p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-20 h-20 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600 overflow-hidden">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()
              )}
            </div>
            <div>
              <h2 className="font-bold text-surface-900 dark:text-white">{user?.fullName || 'Set your name below'}</h2>
              <label className="cursor-pointer mt-2 inline-block">
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                <span className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center gap-1 hover:underline">
                  <HiOutlineUpload className="w-4 h-4" /> Change Photo
                </span>
              </label>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
        </Card>

        {/* Addresses */}
        <Card className="dark:bg-surface-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-surface-900 dark:text-white">Saved Addresses</h3>
            <button type="button" onClick={addAddress} className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center gap-1 hover:underline">
              <HiOutlinePlus className="w-4 h-4" /> Add New
            </button>
          </div>
          {addresses.length === 0 && <p className="text-sm text-surface-500 dark:text-surface-400">No addresses saved.</p>}
          {addresses.map((addr, idx) => (
            <div key={idx} className="border border-surface-200 dark:border-surface-700 rounded-lg p-4 mb-4 relative">
              <button type="button" onClick={() => removeAddress(idx)} className="absolute top-2 right-2 text-surface-400 hover:text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
              <div className="grid md:grid-cols-3 gap-3">
                <Input label="Street" name="street" value={addr.street} onChange={(e) => handleAddressChange(idx, e)} required />
                <Input label="City" name="city" value={addr.city} onChange={(e) => handleAddressChange(idx, e)} required />
                <Input label="Zip Code" name="zip" value={addr.zip} onChange={(e) => handleAddressChange(idx, e)} required />
              </div>
            </div>
          ))}
        </Card>

        {/* Payment Methods */}
        <Card className="dark:bg-surface-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-surface-900 dark:text-white flex items-center gap-2"><HiOutlineCreditCard /> Payment Methods</h3>
            <button type="button" onClick={addPayment} className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center gap-1 hover:underline">
              <HiOutlinePlus className="w-4 h-4" /> Add Card
            </button>
          </div>
          {paymentMethods.length === 0 && <p className="text-sm text-surface-500 dark:text-surface-400">No payment methods saved.</p>}
          {paymentMethods.map((pay, idx) => (
            <div key={idx} className="border border-surface-200 dark:border-surface-700 rounded-lg p-4 mb-4 relative">
              <button type="button" onClick={() => removePayment(idx)} className="absolute top-2 right-2 text-surface-400 hover:text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
              <div className="grid md:grid-cols-2 gap-3">
                <Input label="Card Brand (e.g. Visa)" name="cardBrand" value={pay.cardBrand} onChange={(e) => handlePaymentChange(idx, e)} required />
                <Input label="Last 4 Digits" name="last4" value={pay.last4} maxLength={4} onChange={(e) => handlePaymentChange(idx, e)} required />
              </div>
            </div>
          ))}
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={loading}>Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerProfile;