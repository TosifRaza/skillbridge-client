// import { useParams, useNavigate } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchWorkerProfile, clearViewedWorker } from '@/store/slices/customerSlice';
// import Card from '@/components/ui/Card';
// import Button from '@/components/ui/Button';
// import Badge from '@/components/ui/Badge';
// import StarRating from '@/components/ui/StarRating';
// import Spinner from '@/components/ui/Spinner';
// import { HiOutlineArrowLeft, HiOutlineShieldCheck, HiOutlineLocationMarker } from 'react-icons/hi';
// import { useEffect } from 'react';

// const WorkerProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { viewedWorker, loading } = useAppSelector((state) => state.customer);

//   useEffect(() => {
//     if (id) dispatch(fetchWorkerProfile(id));
//     return () => dispatch(clearViewedWorker());
//   }, [dispatch, id]);

//   if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
//   if (!viewedWorker) return <div className="text-center py-20 text-surface-500 dark:text-surface-400">Worker profile not found or API endpoint missing.</div>;

//   return (
//     <div className="max-w-4xl mx-auto animate-fade-in">
//       <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-500 hover:text-surface-800 dark:hover:text-white mb-6 transition">
//         <HiOutlineArrowLeft className="w-5 h-5" /> Back
//       </button>

//       <Card className="dark:bg-surface-800 p-8 mb-8">
//         <div className="flex flex-col md:flex-row items-center gap-6">
//           <div className="w-24 h-24 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center text-3xl font-bold text-primary-600">
//             {viewedWorker.email?.[0].toUpperCase()}
//           </div>
//           <div className="text-center md:text-left flex-1">
//             <div className="flex items-center justify-center md:justify-start gap-3">
//               <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{viewedWorker.email}</h1>
//               {viewedWorker.verificationStatus === 'Verified' && (
//                 <Badge variant="success" className="flex items-center gap-1"><HiOutlineShieldCheck className="w-3 h-3" /> Verified</Badge>
//               )}
//             </div>
//             <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-surface-500 dark:text-surface-400 text-sm">
//               <span className="flex items-center gap-1"><HiOutlineLocationMarker className="w-4 h-4" /> Mumbai</span>
//               <span className="flex items-center gap-1"><StarRating rating={viewedWorker.averageRating || 0} size="sm" /> ({viewedWorker.totalReviews || 0} reviews)</span>
//             </div>
//           </div>
//           <Link to="/customer/jobs/post"><Button size="lg" className="shadow-glow">Hire Worker</Button></Link>
//         </div>
//       </Card>

//       {/* Placeholder for Reviews/Portfolio when API supports it */}
//       <Card className="dark:bg-surface-800 p-6">
//         <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">About This Professional</h2>
//         <p className="text-surface-600 dark:text-surface-300">Detailed portfolio and reviews will appear here once the backend profile endpoint is fully populated.</p>
//       </Card>
//     </div>
//   );
// };

// export default WorkerProfile;


// NEW

import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchWorkerProfile, fetchRatingDistribution, fetchWorkerReviews, clearViewedWorker } from '@/store/slices/customerSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import RatingChart from '@/components/shared/RatingChart';
import Spinner from '@/components/ui/Spinner';
import { HiOutlineArrowLeft, HiOutlineShieldCheck, HiOutlineLocationMarker } from 'react-icons/hi';
import { useEffect } from 'react';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { viewedWorker, ratingDistribution, workerReviews, loading } = useAppSelector((state) => state.customer);

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkerProfile(id));
      dispatch(fetchRatingDistribution(id));
      dispatch(fetchWorkerReviews(id));
    }
    return () => dispatch(clearViewedWorker());
  }, [dispatch, id]);

  if (loading && !viewedWorker) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!viewedWorker) return <div className="text-center py-20 text-surface-500 dark:text-surface-400">Worker profile not found.</div>;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-500 hover:text-surface-800 dark:hover:text-white mb-6 transition">
        <HiOutlineArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dark:bg-surface-800 p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center text-3xl font-bold text-primary-600 overflow-hidden">
                {viewedWorker.avatar?.url ? <img src={viewedWorker.avatar.url} alt="Avatar" className="w-full h-full object-cover" /> : viewedWorker.email?.[0].toUpperCase()}
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{viewedWorker.fullName || viewedWorker.email}</h1>
                  {viewedWorker.verificationStatus === 'Verified' && <Badge variant="success" className="flex items-center gap-1"><HiOutlineShieldCheck className="w-3 h-3" /> Verified</Badge>}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-surface-500 dark:text-surface-400 text-sm">
                  <span className="flex items-center gap-1"><HiOutlineLocationMarker className="w-4 h-4" /> Mumbai</span>
                  <span className="flex items-center gap-1"><StarRating rating={viewedWorker.averageRating || 0} size="sm" /> ({viewedWorker.totalReviews || 0} reviews)</span>
                </div>
              </div>
              <Link to="/customer/jobs/post"><Button size="lg" className="shadow-glow">Hire Worker</Button></Link>
            </div>
          </Card>

          {/* Portfolio Section */}
          {viewedWorker.portfolio && viewedWorker.portfolio.length > 0 && (
            <Card className="dark:bg-surface-800 p-6">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Portfolio</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {viewedWorker.portfolio.map((img, idx) => (
                  <img key={idx} src={img.url} alt={`Portfolio ${idx+1}`} className="w-full h-40 object-cover rounded-xl border border-surface-200 dark:border-surface-700" />
                ))}
              </div>
            </Card>
          )}

          {/* Reviews Section */}
          <Card className="dark:bg-surface-800 p-6">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Reviews</h2>
            {workerReviews.length > 0 ? (
              <div className="space-y-6">
                {workerReviews.map(review => (
                  <div key={review._id} className="border-b border-surface-200 dark:border-surface-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-xs font-bold text-primary-600">
                        {review.reviewer?.fullName?.[0] || review.reviewer?.email?.[0] || 'C'}
                      </div>
                      <div>
                        <p className="font-semibold text-surface-900 dark:text-white text-sm">{review.reviewer?.fullName || review.reviewer?.email}</p>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-xs text-surface-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-surface-600 dark:text-surface-300 text-sm pl-11">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-surface-500 dark:text-surface-400 py-8">No reviews available yet.</p>
            )}
          </Card>
        </div>

        {/* Right: Stats Sidebar */}
        <div className="space-y-6">
          <Card className="dark:bg-surface-800 p-6">
            <div className="text-center mb-6">
              <p className="text-5xl font-extrabold text-primary-600 dark:text-primary-400">{viewedWorker.averageRating?.toFixed(1) || '0.0'}</p>
              <div className="flex justify-center mt-2">
                <StarRating rating={viewedWorker.averageRating || 0} size="lg" />
              </div>
              <p className="text-sm text-surface-500 mt-2">{viewedWorker.totalReviews || 0} Reviews</p>
            </div>
            {ratingDistribution && <RatingChart distribution={ratingDistribution} totalReviews={viewedWorker.totalReviews} />}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;