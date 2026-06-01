import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useAppSelector } from '@/store/hooks';
import { HiOutlineMail, HiOutlineShieldCheck, HiOutlineStar } from 'react-icons/hi';

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);

  const verificationVariant = user?.verificationStatus === 'Verified' ? 'success' : user?.verificationStatus === 'Pending' ? 'warning' : 'gray';

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - User Info Card */}
        <Card className="md:col-span-1 text-center">
          <div className="mb-4">
            <Avatar name={user?.email} size="lg" className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-surface-900">{user?.email}</h2>
          <p className="text-surface-500 capitalize mb-4">{user?.role}</p>
          
          <div className="flex justify-center gap-2 mb-6">
            <Badge variant={verificationVariant}>
              <HiOutlineShieldCheck className="w-3 h-3 mr-1" /> {user?.verificationStatus || 'Unverified'}
            </Badge>
          </div>

          <Button variant="outline" className="w-full">Edit Profile</Button>
        </Card>

        {/* Right Column - Details & Stats */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-surface-900 mb-4">Account Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-surface-600">
                <HiOutlineMail className="w-5 h-5 text-surface-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-surface-600">
                <HiOutlineShieldCheck className="w-5 h-5 text-surface-400" />
                <span>Email Verified: {user?.isEmailVerified ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </Card>

          {user?.role === 'provider' && (
            <Card>
              <h3 className="font-bold text-surface-900 mb-4">Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-50 p-4 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 text-primary-600 mb-1">
                    <HiOutlineStar className="w-5 h-5" />
                    <span className="text-2xl font-bold">{user?.averageRating || 0}</span>
                  </div>
                  <p className="text-sm text-surface-500">Average Rating</p>
                </div>
                <div className="bg-surface-50 p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-surface-900 mb-1">{user?.totalReviews || 0}</p>
                  <p className="text-sm text-surface-500">Total Reviews</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;