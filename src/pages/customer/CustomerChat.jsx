// import { useState } from 'react';
// import ChatInterface from '@/components/shared/ChatInterface';
// import ChatPage from '@/components/shared/ChatPage';

// const CustomerChat = () => {
//   // For MVP, we use a static conversation ID based on a Job ID. 
//   // In a real app, you'd have a list of conversations on the left.
//   const [activeConvo, setActiveConvo] = useState('job_DEFAULT_JOB_ID'); 
//   const [otherUser, setOtherUser] = useState('Worker');

//   return (
//     <div className="animate-fade-in h-[calc(100vh-8rem)]">
//       {/* <ChatInterface conversationId={activeConvo} otherUserEmail={otherUser} /> */}
//       <ChatPage userRole="customer" />;

//     </div>
//   );
  
// };

// export default CustomerChat;
// import ChatPage from '@/components/shared/ChatPage';
// const CustomerChat = () => {
//   return <ChatPage userRole="customer" />;
// };

// export default CustomerChat;




// import ChatInterface from '@/components/shared/ChatInterface';
// import ChatPage from '@/components/shared/ChatPage';
// const CustomerChat = () => {
//   // IMPORTANT: This conversationId must match the Worker chat for them to connect!
//   return (
//     <div className="animate-fade-in h-[calc(100vh-8rem)]">
//       <ChatInterface conversationId="job_DEFAULT_ROOM" otherUserEmail="Worker" />
//       <ChatPage userRole="customer" />;
//     </div>
    
//   );
// };

// export default CustomerChat;4




import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchConversations } from '@/store/slices/chatSlice';
import ChatInterface from '@/components/shared/ChatInterface';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

const CustomerChat = () => {
  const dispatch = useAppDispatch();
  const { conversations, loading } = useAppSelector((state) => state.chat);
  const [activeConvo, setActiveConvo] = useState(null);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  if (loading && conversations.length === 0) return <div className="flex justify-center py-20"><Spinner /></div>;

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
          <EmptyState icon="📭" title="No conversations yet" description="Post a job and hire someone to start chatting." />
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        {activeConvo ? (
          <ChatInterface conversationId={activeConvo} otherUserEmail="Worker" />
        ) : (
          <div className="flex items-center justify-center h-full text-surface-400 dark:text-surface-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerChat;