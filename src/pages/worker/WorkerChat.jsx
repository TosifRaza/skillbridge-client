import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchConversations } from '@/store/slices/chatSlice';
import ChatInterface from '@/components/shared/ChatInterface';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

const WorkerChat = () => {
  const dispatch = useAppDispatch();
  const { conversations, loading } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth); // Get current worker
  const [activeConvo, setActiveConvo] = useState(null);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  if (loading && conversations.length === 0) return <div className="flex justify-center py-20"><Spinner /></div>;

  // Find active conversation data
  const activeConvoData = conversations.find(c => c.conversationId === activeConvo);

  return (
    <div className="animate-fade-in flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar - Conversation List */}
      <div className="w-1/3 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 overflow-y-auto">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <h2 className="font-bold text-surface-900 dark:text-white">Messages</h2>
        </div>
        {conversations.length > 0 ? conversations.map(convo => (
          <button 
            key={convo._id} 
            onClick={() => setActiveConvo(convo.conversationId)}
            className={`w-full text-left p-4 border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700 transition ${activeConvo === convo.conversationId ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' : ''}`}
          >
            <p className="font-semibold text-surface-900 dark:text-white text-sm">{convo.title}</p>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{convo.category} • {convo.status}</p>
          </button>
        )) : (
          <EmptyState icon="📭" title="No conversations yet" description="Apply for jobs and get hired to start chatting." />
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        {activeConvo && activeConvoData ? (
          <ChatInterface 
            conversationId={activeConvo} 
            otherUserEmail={activeConvoData.customerEmail} // Use actual customer email
            currentUserEmail={user?.email} // Pass current worker email
          />
        ) : (
          <div className="flex items-center justify-center h-full text-surface-400 dark:text-surface-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerChat;