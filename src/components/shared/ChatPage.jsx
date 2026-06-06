import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyJobs } from '@/store/slices/jobSlice';
import { fetchMyApplications } from '@/store/slices/applicationSlice';
import ChatInterface from '@/components/shared/ChatInterface';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { HiOutlineChatAlt } from 'react-icons/hi';

const ChatPage = ({ userRole }) => {
  const dispatch = useAppDispatch();
  const { jobs, loading: jobsLoading } = useAppSelector((state) => state.job);
  const { myApplications, loading: appsLoading } = useAppSelector((state) => state.application);

  const [activeConvo, setActiveConvo] = useState(null);
  const [otherUser, setOtherUser] = useState('');

  useEffect(() => {
    if (userRole === 'customer') dispatch(fetchMyJobs({})); 
    else dispatch(fetchMyApplications({})); 
  }, [dispatch, userRole]);

  // Filter for jobs that actually have a person to talk to
  const conversations = userRole === 'customer' 
    ? jobs.filter(j => ['Assigned', 'In-Progress', 'Completed'].includes(j.status))
    : myApplications.filter(a => a.status === 'Accepted');

  const loading = userRole === 'customer' ? jobsLoading : appsLoading;

  const handleSelectConvo = (jobId, email) => {
    setActiveConvo(`job_${jobId}`); // Socket rooms expect format: job_<jobId>
    setOtherUser(email || 'User');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-soft overflow-hidden">
      
      {/* Sidebar - Conversation List */}
      <div className="w-1/3 bg-surface-50 dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 flex flex-col">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
          <h2 className="font-bold text-surface-900 dark:text-white text-lg">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="flex justify-center py-10"><Spinner /></div> : 
           conversations.length > 0 ? (
            conversations.map(item => {
              const jobId = userRole === 'customer' ? item._id : item.job?._id;
              const jobTitle = userRole === 'customer' ? item.title : item.job?.title;
              const participantEmail = userRole === 'customer' ? item.hiredProvider?.email : item.job?.customer?.email;
              const isActive = activeConvo === `job_${jobId}`;

              return (
                <button
                  key={jobId}
                  onClick={() => handleSelectConvo(jobId, participantEmail)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition border-l-4 ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 border-l-primary-500' : 'border-l-transparent hover:bg-surface-100 dark:hover:bg-surface-800'}`}
                >
                  <Avatar name={participantEmail || 'Chat'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-surface-900 dark:text-white text-sm truncate">{jobTitle}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{participantEmail || 'Unknown User'}</p>
                  </div>
                  <Badge variant={isActive ? 'primary' : 'gray'} className="flex-shrink-0">{userRole === 'customer' ? item.status : 'Active'}</Badge>
                </button>
              );
            })
          ) : (
            <EmptyState icon="💬" title="No conversations yet" description="Accept a proposal or get hired to start chatting!" />
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 flex flex-col">
        {activeConvo ? (
          <ChatInterface conversationId={activeConvo} otherUserEmail={otherUser} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-surface-400 dark:text-surface-500 bg-surface-50 dark:bg-surface-900 p-8">
            <HiOutlineChatAlt className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold text-surface-600 dark:text-surface-300">Select a conversation</h3>
            <p className="text-sm mt-1">Choose a job from the left to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;