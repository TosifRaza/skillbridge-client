import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchConversations, fetchChatHistory, setActiveConversation, messageReceived } from '@/store/slices/chatSlice';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import { HiOutlineSearch, HiOutlinePaperAirplane } from 'react-icons/hi';
import { useSocket } from '@/hooks/useSocket';

const Chat = () => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { conversations, activeConversationId, messages, loading } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (newMessage) => {
        dispatch(messageReceived(newMessage));
      });
    }
    return () => {
      if (socket) socket.off('receive-message');
    };
  }, [socket, dispatch]);

  const handleSelectConversation = (jobId) => {
    const conversationId = `job_${jobId}`;
    dispatch(setActiveConversation({ conversationId }));
    dispatch(fetchChatHistory(conversationId));
    if (socket) socket.emit('join-room', conversationId);
  };

  // const handleSendMessage = (e) => {
  //   e.preventDefault();
  //    console.log("Send Clicked. Socket:", socket, "Input:", messageInput, "Room:", activeConversationId);
  //   if (!messageInput.trim() || !socket || !activeConversationId) return;

  //   const messageData = {
  //     conversationId: activeConversationId,
  //     text: messageInput,
  //     imageUrl: null,
  //   };

  //   socket.emit('send-message', messageData, (callback) => {
  //     if (callback.status === 'ok') {
  //       setMessageInput('');
  //     }
  //   });
  // };
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    console.log("Send Clicked. Socket:", socket, "Input:", messageInput, "Room:", activeConversationId);

    if (!messageInput.trim()) return console.log("Empty message");
    if (!socket) return console.error("Socket is NULL! Connection failed.");
    if (!activeConversationId) return console.error("No active room selected.");

    const messageData = {
      conversationId: activeConversationId,
      text: messageInput,
      imageUrl: null,
    };

    console.log("Emitting send-message:", messageData);

    socket.emit('send-message', messageData, (callback) => {
      if (callback && callback.status === 'ok') {
        console.log("Message sent successfully!");
        setMessageInput('');
      } else {
        console.error("Failed to send message:", callback);
      }
    });
  };
  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)]">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">Messages</h1>
      
      <div className="flex gap-6 h-full rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 shadow-soft">
        {/* Left Sidebar - Conversations */}
        <div className="w-1/3 border-r border-surface-200 dark:border-surface-700 flex flex-col bg-surface-50 dark:bg-surface-900">
          <div className="p-4 border-b border-surface-200 dark:border-surface-700">
            <Input placeholder="Search chats..." icon={HiOutlineSearch} />
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading && conversations.length === 0 ? <div className="p-8"><Spinner /></div> : 
             conversations.length === 0 ? <div className="p-8 text-center text-surface-500 dark:text-surface-400 text-sm">No conversations yet. Post a job or get hired to start chatting!</div> :
             conversations.map((job) => (
              <button 
                key={job._id} 
                onClick={() => handleSelectConversation(job._id)}
                className={`w-full flex items-center gap-3 p-4 text-left transition border-l-4 ${activeConversationId === `job_${job._id}` ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500' : 'border-transparent hover:bg-surface-100 dark:hover:bg-surface-800'}`}
              >
                <Avatar name={job.title} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-surface-900 dark:text-white text-sm truncate">{job.title}</h4>
                  <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{job.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Main Area - Chat Window */}
        <div className="w-2/3 flex flex-col">
          {activeConversationId ? (
            <>
              <div className="h-16 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 flex items-center px-6 shadow-soft">
                <span className="font-bold text-surface-900 dark:text-white">Room: {activeConversationId}</span>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-surface-50 dark:bg-surface-900">
                {messages.map((msg, idx) => {
                  const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                  return (
                    <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${isMine ? 'gradient-primary text-white rounded-tr-none' : 'bg-white dark:bg-surface-800 text-surface-900 dark:text-white rounded-tl-none border border-surface-200 dark:border-surface-700'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${isMine ? 'text-primary-200' : 'text-surface-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 flex gap-3">
                <Input 
                  className="flex-1" 
                  placeholder="Type a message..." 
                  value={messageInput} 
                  onChange={(e) => setMessageInput(e.target.value)} 
                />
                <Button type="submit" className="shadow-glow flex items-center gap-2">
                  <HiOutlinePaperAirplane className="w-5 h-5" /> Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-surface-500 dark:text-surface-400">
              <div className="text-center">
                <span className="text-5xl block mb-4">💬</span>
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Select a conversation</h3>
                <p>Choose a job from the left to start chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;