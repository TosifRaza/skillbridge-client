// // import { useEffect, useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { useAppDispatch, useAppSelector } from '@/store/hooks';
// // import { fetchJobById } from '@/store/slices/jobSlice';
// // import { fetchJobApplications, acceptApplication, rejectApplication } from '@/store/slices/applicationSlice';
// // import Card from '@/components/ui/Card';
// // import Badge from '@/components/ui/Badge';
// // import Button from '@/components/ui/Button';
// // import Spinner from '@/components/ui/Spinner';
// // import Avatar from '@/components/ui/Avatar';
// // import ReviewModal from '@/components/shared/ReviewModal';
// // import { HiOutlineArrowLeft, HiOutlineClock, HiOutlineLocationMarker, HiOutlineCurrencyDollar } from 'react-icons/hi';

// // const statusVariant = {
// //   Open: 'success', Assigned: 'primary', 'In-Progress': 'warning', Completed: 'gray', Cancelled: 'danger', Closed: 'gray',
// // };

// // const JobDetail = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const dispatch = useAppDispatch();
// //   const { currentJob: job, loading: jobLoading } = useAppSelector((state) => state.job);
// //   const { applications, loading: appLoading } = useAppSelector((state) => state.application);
// //   const { user } = useAppSelector((state) => state.auth);

// //   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

// //   const isOwner = job?.customer?._id === user?._id || job?.customer === user?._id;

// //   useEffect(() => {
// //     dispatch(fetchJobById(id));
// //     if (isOwner) dispatch(fetchJobApplications(id));
// //   }, [dispatch, id, isOwner]);

// //   if (jobLoading || !job) return <div className="flex justify-center py-20"><Spinner /></div>;

// //   return (
// //     <>
// //       <div className="max-w-5xl mx-auto animate-fade-in">
// //         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-500 hover:text-surface-800 dark:hover:text-white mb-6 transition">
// //           <HiOutlineArrowLeft className="w-5 h-5" /> Back to Jobs
// //         </button>

// //         <div className="grid lg:grid-cols-3 gap-8">
// //           {/* Main Content */}
// //           <div className="lg:col-span-2 space-y-6">
// //             <Card className="dark:bg-surface-800 p-6">
// //               <div className="flex items-center justify-between mb-4">
// //                 <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
// //                 <span className="text-sm text-surface-400">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
// //               </div>
// //               <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-4">{job.title}</h1>
// //               <p className="text-surface-600 dark:text-surface-300 whitespace-pre-wrap leading-relaxed mb-6">{job.description}</p>
              
// //               {job.images?.length > 0 && (
// //                 <div className="grid grid-cols-2 gap-4 mt-6">
// //                   {job.images.map((img, idx) => (
// //                     <img key={idx} src={img.url} alt={`Job ${idx+1}`} className="w-full h-40 object-cover rounded-xl border border-surface-200 dark:border-surface-700" />
// //                   ))}
// //                 </div>
// //               )}
// //             </Card>

// //             {/* Applications Section */}
// //             {isOwner && job.status === 'Open' && (
// //               <div>
// //                 <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Proposals ({applications.length})</h2>
// //                 {appLoading ? <Spinner /> : applications.length > 0 ? (
// //                   <div className="space-y-4">
// //                     {applications.map(app => (
// //                       <Card key={app._id} className="dark:bg-surface-800 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
// //                         <div className="flex items-center gap-3">
// //                           <Avatar name={app.worker?.email} />
// //                           <div>
// //                             <p className="font-semibold text-surface-900 dark:text-white">{app.worker?.email}</p>
// //                             <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-1">{app.proposalMessage}</p>
// //                           </div>
// //                         </div>
// //                         <div className="flex items-center gap-4 w-full md:w-auto">
// //                           <span className="text-primary-600 dark:text-primary-400 font-bold">₹{app.bidAmount}</span>
// //                           <span className="text-xs text-surface-400">{app.estimatedCompletionTime}</span>
// //                           {app.status === 'Pending' && (
// //                             <div className="flex gap-2 ml-auto">
// //                               <Button size="sm" onClick={() => dispatch(acceptApplication(app._id))}>Accept</Button>
// //                               <Button size="sm" variant="outline" onClick={() => dispatch(rejectApplication(app._id))}>Reject</Button>
// //                             </div>
// //                           )}
// //                           {app.status !== 'Pending' && <Badge variant={app.status === 'Accepted' ? 'success' : 'danger'}>{app.status}</Badge>}
// //                         </div>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                 ) : <p className="text-surface-500 dark:text-surface-400 text-center py-8">No proposals yet.</p>}
// //               </div>
// //             )}
// //           </div>

// //           {/* Sidebar */}
// //           <div className="space-y-6">
// //             <Card className="dark:bg-surface-800 p-6">
// //               <div className="space-y-4">
// //                 <div className="flex items-center justify-between pb-4 border-b border-surface-200 dark:border-surface-700">
// //                   <span className="text-surface-500 dark:text-surface-400">Budget</span>
// //                   <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{job.budget}</span>
// //                 </div>
// //                 <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
// //                   <HiOutlineClock className="w-5 h-5 text-surface-400" />
// //                   <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
// //                 </div>
// //                 <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
// //                   <HiOutlineLocationMarker className="w-5 h-5 text-surface-400" />
// //                   <span>{job.location?.address || 'Remote'}</span>
// //                 </div>
// //                 <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
// //                   <HiOutlineCurrencyDollar className="w-5 h-5 text-surface-400" />
// //                   <span>Type: {job.serviceType || 'local'}</span>
// //                 </div>
// //               </div>
// //             </Card>
            
// //             {/* Review Section - Triggers the Modal */}
// //             {isOwner && job.status === 'Completed' && (
// //               <Card className="dark:bg-surface-800 p-6 border-l-4 border-yellow-500">
// //                 <h3 className="font-bold text-surface-900 dark:text-white mb-2">Job Completed! 🎉</h3>
// //                 <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">Help the community by rating your worker.</p>
// //                 <Button onClick={() => setIsReviewModalOpen(true)} className="w-full">Leave Review</Button>
// //               </Card>
// //             )}

// //              {/* Review Section - Only shows if Job is Completed AND a worker was actually hired */}
// //             {isOwner && job.status === 'Completed' && (job.hiredProvider?._id || job.hiredProvider) && (
// //               <Card className="dark:bg-surface-800 p-6 border-l-4 border-yellow-500">
// //                   <h3 className="font-bold text-surface-900 dark:text-white mb-2">Job Completed! 🎉</h3>
// //                   <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">Help the community by rating your worker.</p>
// //                   <Button onClick={() => setIsReviewModalOpen(true)} className="w-full">Leave Review</Button>
// //               </Card>
// //               )}
            
// //             {/* Placeholder for Chat/Payment */}
// //             <Card className="dark:bg-surface-800 p-6 bg-surface-50 dark:bg-surface-900 border-dashed border-2 border-surface-300 dark:border-surface-700 text-center">
// //               <p className="text-surface-500 text-sm">Chat & Payment Status will appear here when job is assigned.</p>
// //             </Card>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Modal Component - Rendered outside the main layout grid but inside the fragment */}
// //       <ReviewModal 
// //         isOpen={isReviewModalOpen} 
// //         onClose={() => setIsReviewModalOpen(false)} 
// //         jobId={job._id} 
// //         workerId={job.hiredProvider?._id || job.hiredProvider} 
// //       />
// //     </>
// //   );
// // };

// // export default JobDetail;

// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchJobById } from '@/store/slices/jobSlice';
// import { fetchJobApplications, acceptApplication, rejectApplication } from '@/store/slices/applicationSlice';
// import Card from '@/components/ui/Card';
// import Badge from '@/components/ui/Badge';
// import Button from '@/components/ui/Button';
// import Spinner from '@/components/ui/Spinner';
// import Avatar from '@/components/ui/Avatar';
// import ReviewModal from '@/components/shared/ReviewModal';
// import { HiOutlineArrowLeft, HiOutlineClock, HiOutlineLocationMarker, HiOutlineCurrencyDollar } from 'react-icons/hi';

// const statusVariant = {
//   Open: 'success', Assigned: 'primary', 'In-Progress': 'warning', Completed: 'gray', Cancelled: 'danger', Closed: 'gray',
// };

// const JobDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { currentJob: job, loading: jobLoading } = useAppSelector((state) => state.job);
//   const { applications, loading: appLoading } = useAppSelector((state) => state.application);
//   const { user } = useAppSelector((state) => state.auth);

//   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

//   const isOwner = job?.customer?._id === user?._id || job?.customer === user?._id;

//   useEffect(() => {
//     dispatch(fetchJobById(id));
//     if (isOwner) dispatch(fetchJobApplications(id));
//   }, [dispatch, id, isOwner]);

//   if (jobLoading || !job) return <div className="flex justify-center py-20"><Spinner /></div>;

//   return (
//     <>
//       <div className="max-w-5xl mx-auto animate-fade-in">
//         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-500 hover:text-surface-800 dark:hover:text-white mb-6 transition">
//           <HiOutlineArrowLeft className="w-5 h-5" /> Back to Jobs
//         </button>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card className="dark:bg-surface-800 p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
//                 <span className="text-sm text-surface-400">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
//               </div>
//               <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-4">{job.title}</h1>
//               <p className="text-surface-600 dark:text-surface-300 whitespace-pre-wrap leading-relaxed mb-6">{job.description}</p>
              
//               {job.images?.length > 0 && (
//                 <div className="grid grid-cols-2 gap-4 mt-6">
//                   {job.images.map((img, idx) => (
//                     <img key={idx} src={img.url} alt={`Job ${idx+1}`} className="w-full h-40 object-cover rounded-xl border border-surface-200 dark:border-surface-700" />
//                   ))}
//                 </div>
//               )}
//             </Card>

//             {/* Applications Section */}
//             {isOwner && job.status === 'Open' && (
//               <div>
//                 <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Proposals ({applications.length})</h2>
//                 {appLoading ? <Spinner /> : applications.length > 0 ? (
//                   <div className="space-y-4">
//                     {applications.map(app => (
//                       <Card key={app._id} className="dark:bg-surface-800 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//                         <div className="flex items-center gap-3">
//                           <Avatar name={app.worker?.email} />
//                           <div>
//                             <p className="font-semibold text-surface-900 dark:text-white">{app.worker?.email}</p>
//                             <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-1">{app.proposalMessage}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4 w-full md:w-auto">
//                           <span className="text-primary-600 dark:text-primary-400 font-bold">₹{app.bidAmount}</span>
//                           <span className="text-xs text-surface-400">{app.estimatedCompletionTime}</span>
//                           {app.status === 'Pending' && (
//                             <div className="flex gap-2 ml-auto">
//                               <Button size="sm" onClick={async () => {
//                                 const result = await dispatch(acceptApplication(app._id));
//                                 if (acceptApplication.fulfilled.match(result)) {
//                                   dispatch(fetchJobById(id)); // Refetch job to update status to 'Assigned'
//                                 }
//                               }}>Accept</Button>
//                               <Button size="sm" variant="outline" onClick={() => dispatch(rejectApplication(app._id))}>Reject</Button>
//                             </div>
//                           )}
//                           {app.status !== 'Pending' && <Badge variant={app.status === 'Accepted' ? 'success' : 'danger'}>{app.status}</Badge>}
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 ) : <p className="text-surface-500 dark:text-surface-400 text-center py-8">No proposals yet.</p>}
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             <Card className="dark:bg-surface-800 p-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between pb-4 border-b border-surface-200 dark:border-surface-700">
//                   <span className="text-surface-500 dark:text-surface-400">Budget</span>
//                   <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{job.budget}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
//                   <HiOutlineClock className="w-5 h-5 text-surface-400" />
//                   <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
//                   <HiOutlineLocationMarker className="w-5 h-5 text-surface-400" />
//                   <span>{job.location?.address || 'Remote'}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
//                   <HiOutlineCurrencyDollar className="w-5 h-5 text-surface-400" />
//                   <span>Type: {job.serviceType || 'local'}</span>
//                 </div>
//               </div>
//             </Card>
            
//             {/* FIXED: Removed duplicate. Only shows if Job is Completed AND a worker was actually hired */}
//             {isOwner && job.status === 'Completed' && (job.hiredProvider?._id || job.hiredProvider) && (
//               <Card className="dark:bg-surface-800 p-6 border-l-4 border-yellow-500">
//                   <h3 className="font-bold text-surface-900 dark:text-white mb-2">Job Completed! 🎉</h3>
//                   <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">Help the community by rating your worker.</p>
//                   <Button onClick={() => setIsReviewModalOpen(true)} className="w-full">Leave Review</Button>
//               </Card>
//             )}
            
//             {/* Placeholder for Chat/Payment */}
//             <Card className="dark:bg-surface-800 p-6 bg-surface-50 dark:bg-surface-900 border-dashed border-2 border-surface-300 dark:border-surface-700 text-center">
//               <p className="text-surface-500 text-sm">Chat & Payment Status will appear here when job is assigned.</p>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Modal Component */}
//       <ReviewModal 
//         isOpen={isReviewModalOpen} 
//         onClose={() => setIsReviewModalOpen(false)} 
//         jobId={job._id} 
//         workerId={job.hiredProvider?._id || job.hiredProvider} 
//       />
//     </>
//   );
// };

// export default JobDetail;
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchJobById } from '@/store/slices/jobSlice';
import { fetchJobApplications, acceptApplication, rejectApplication } from '@/store/slices/applicationSlice';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import { HiOutlineArrowLeft, HiOutlineClock, HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineBriefcase } from 'react-icons/hi';

const statusVariant = {
  Open: 'success', Assigned: 'primary', 'In-Progress': 'warning', Completed: 'gray', Cancelled: 'danger', Closed: 'gray',
};

const CustomerJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentJob: job, loading: jobLoading } = useAppSelector((state) => state.job);
  const { applications, loading: appLoading } = useAppSelector((state) => state.application);
  const { user } = useAppSelector((state) => state.auth);

  const isOwner = job?.customer?._id === user?._id || job?.customer === user?._id;

  useEffect(() => {
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  // Fetch applications ONLY if the job is loaded and the user is the owner
  useEffect(() => {
    if (isOwner && job) {
      dispatch(fetchJobApplications(id));
    }
  }, [dispatch, id, isOwner, job]);

  if (jobLoading || !job) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-500 hover:text-surface-800 dark:hover:text-white mb-6 transition">
        <HiOutlineArrowLeft className="w-5 h-5" /> Back to Jobs
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dark:bg-surface-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
              <span className="text-sm text-surface-400">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-4">{job.title}</h1>
            <p className="text-surface-600 dark:text-surface-300 whitespace-pre-wrap leading-relaxed mb-6">{job.description}</p>
            
            {job.images?.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                {job.images.map((img, idx) => (
                  <img key={idx} src={img.url} alt={`Job ${idx+1}`} className="w-full h-40 object-cover rounded-xl border border-surface-200 dark:border-surface-700" />
                ))}
              </div>
            )}
          </Card>

          {/* Applications Section (CUSTOMER ONLY) */}
          {isOwner && (job.status === 'Open' || job.status === 'Assigned') && (
            <div>
              <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">
                Proposals ({applications.length})
              </h2>
              
              {appLoading ? <Spinner /> : applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map(app => (
                    <Card key={app._id} className="dark:bg-surface-800 p-5 border-l-4 border-l-surface-300 dark:border-l-surface-600 hover:shadow-medium transition-shadow">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={app.worker?.email || 'Worker'} />
                          <div>
                            <p className="font-semibold text-surface-900 dark:text-white">{app.worker?.email || 'Worker'}</p>
                            <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-1 mt-1">{app.proposalMessage}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <span className="text-primary-600 dark:text-primary-400 font-bold">₹{app.bidAmount}</span>
                          <span className="text-xs text-surface-400">{app.estimatedCompletionTime}</span>
                          
                          {app.status === 'Pending' && (
                            <div className="flex gap-2 ml-auto">
                              <Button size="sm" onClick={() => dispatch(acceptApplication(app._id))}>Accept</Button>
                              <Button size="sm" variant="outline" onClick={() => dispatch(rejectApplication(app._id))}>Reject</Button>
                            </div>
                          )}
                          
                          {app.status !== 'Pending' && (
                            <Badge variant={app.status === 'Accepted' ? 'success' : 'danger'}>{app.status}</Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState icon="📭" title="No proposals yet" description="Workers haven't applied to this job yet. Check back soon!" />
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="dark:bg-surface-800 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-surface-200 dark:border-surface-700">
                <span className="text-surface-500 dark:text-surface-400">Budget</span>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{job.budget}</span>
              </div>
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <HiOutlineClock className="w-5 h-5 text-surface-400" />
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <HiOutlineLocationMarker className="w-5 h-5 text-surface-400" />
                <span>{job.location?.address || 'Remote'}</span>
              </div>
              <div className="flex items-center gap-3 text-surface-600 dark:text-surface-300">
                <HiOutlineBriefcase className="w-5 h-5 text-surface-400" />
                <span>Type: {job.serviceType || 'local'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerJobDetail;