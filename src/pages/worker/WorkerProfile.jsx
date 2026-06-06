import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateCustomerProfile, uploadProfilePhoto } from '@/store/slices/customerSlice';
import { updateLocalUser } from '@/store/slices/authSlice';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { HiOutlineArrowLeft, HiOutlineUpload, HiOutlineShieldCheck, HiOutlineBriefcase } from 'react-icons/hi';

const WorkerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.customer);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
  });

  const [skills, setSkills] = useState(user?.skills?.length ? user.skills.join(', ') : '');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoUpload = async (e) => {
    if (e.target.files[0]) {
      const result = await dispatch(uploadProfilePhoto(e.target.files[0]));
      if (uploadProfilePhoto.fulfilled.match(result)) {
        dispatch(updateLocalUser(result.payload));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert skills string back to array for backend if you add a skills schema later
    const payload = { ...formData, skills: skills.split(',').map(s => s.trim()).filter(Boolean) };
    const result = await dispatch(updateCustomerProfile(payload));
    if (updateCustomerProfile.fulfilled.match(result)) {
      dispatch(updateLocalUser(result.payload));
      alert('Profile updated successfully!');
    }
  };

  const verificationColor = user?.verificationStatus === 'Verified' ? 'success' : user?.verificationStatus === 'Pending' ? 'warning' : 'gray';

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-500 hover:text-surface-800 dark:hover:text-white mb-6 transition">
        <HiOutlineArrowLeft className="w-5 h-5" /> Back
      </button>

      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">Professional Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo & Verification */}
        <Card className="dark:bg-surface-800 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <div className="relative w-24 h-24 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center text-3xl font-bold text-primary-600 overflow-hidden">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h2 className="font-bold text-surface-900 dark:text-white text-lg">{user?.fullName || 'Set your name'}</h2>
                <Badge variant={verificationColor} className="flex items-center gap-1">
                  <HiOutlineShieldCheck className="w-3 h-3" /> {user?.verificationStatus || 'None'}
                </Badge>
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">Rating: {user?.averageRating?.toFixed(1) || '0.0'} / 5.0</p>
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

        {/* Professional Details */}
        <Card className="dark:bg-surface-800 p-6">
          <h3 className="font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <HiOutlineBriefcase className="w-5 h-5 text-primary-500" /> Professional Details
          </h3>
          <div className="space-y-4">
            <div>
              <Input 
                label="Skills (comma separated)" 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)} 
                placeholder="e.g., Plumbing, Painting, Web Design" 
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.split(',').map((skill, idx) => skill.trim() && <Badge key={idx} variant="primary">{skill.trim()}</Badge>)}
              </div>
            </div>
            
            {/* Verification CTA Placeholder */}
            <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-xl border border-dashed border-surface-300 dark:border-surface-600">
              <h4 className="font-semibold text-surface-900 dark:text-white text-sm">Become a Verified Worker</h4>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">Upload your government ID to get the Verified badge and win more trust from customers.</p>
              <Button variant="outline" size="sm" className="mt-3">Upload ID (Coming Soon)</Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={loading}>Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default WorkerProfile;