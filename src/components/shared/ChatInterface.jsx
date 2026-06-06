import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchChatHistory, addSocketMessage, uploadChatImage, clearChat } from '@/store/slices/chatSlice';
import { useSocket } from '@/context/SocketContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import { HiOutlinePaperAirplane, HiOutlinePhotograph } from 'react-icons/hi';

const ChatInterface = ({ conversationId, otherUserEmail }) => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { messages, loading } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch History & Join Room
  useEffect(() => {
    if (conversationId) {
      dispatch(fetchChatHistory(conversationId));
      if (socket) {
        socket.emit('join-room', conversationId);
      }
    }
    return () => {
      dispatch(clearChat());
    };
  }, [dispatch, conversationId, socket]);

  // Socket Listeners
//   useEffect(() => {
//     if (!socket) return;

//     socket.on('receive-message', (message) => {
//       console.log("📬 Received message via socket:", message); // DEBUG LOG
//       // Only add messages for the currently active conversation
//       if (message.conversationId === conversationId) {
//         dispatch(addSocketMessage(message));
//       }
//     });

//     socket.on('display-typing', (data) => {
//       if (data.conversationId === conversationId) setIsTyping(true);
//     });
    
//     socket.on('display-stop-typing', (data) => {
//       if (data.conversationId === conversationId) setIsTyping(false);
//     });

//     return () => {
//       socket.off('receive-message');
//       socket.off('display-typing');
//       socket.off('display-stop-typing');
//     };
//   }, [socket, dispatch, conversationId]);


  // Socket Listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('receive-message', (message) => {
      console.log("📬 Received message via socket:", message); // DEBUG LOG
      dispatch(addSocketMessage(message));
    });

    socket.on('display-typing', () => setIsTyping(true));
    socket.on('display-stop-typing', () => setIsTyping(false));

    // Cleanup listeners on unmount
    return () => {
      socket.off('receive-message');
      socket.off('display-typing');
      socket.off('display-stop-typing');
    };
  }, [socket, dispatch]);


  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!messageInput.trim() || !socket) return;

//     const messageData = {
//       conversationId,
//       text: messageInput,
//       imageUrl: null
//     };

//     // Emit to server
//     socket.emit('send-message', messageData);
//     socket.emit('stop-typing', conversationId);
//     setMessageInput('');
//   };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket) return;

    const messageData = {
      conversationId,
      text: messageInput,
      imageUrl: null
    };

    // FIX: Add callback to catch server acknowledgement or errors
    socket.emit('send-message', messageData, (response) => {
      if (response && response.status === 'error') {
        console.error('Server rejected message:', response.message);
        alert(`Failed to send message: ${response.message}`);
      }
    });
    
    socket.emit('stop-typing', conversationId);
    setMessageInput('');
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    if (socket) {
      socket.emit('typing', conversationId);
    }
  };
// Comment this handleImageUpload becaus it's dos't takes images 
  // ... existing imports and state ...

  // FIX: Add try/catch to prevent silent failures
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Upload to Cloudinary via API
      const url = await dispatch(uploadChatImage(file)).unwrap();

      // If successful, send the image URL via Socket
      if (url && socket) {
        const messageData = {
          conversationId,
          text: '',
          imageUrl: url
        };
        socket.emit('send-message', messageData, (response) => {
          if (response && response.status === 'error') {
            alert(`Failed to send image: ${response.message}`);
          }
        });
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. It might be too large (Max 5MB).');
    }
    
    // Reset file input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

// ... rest of the file remains the same ...

  if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

  return (
    <div className="flex flex-col h-full bg-surface-50 dark:bg-surface-900">
      
      {/* Chat Header */}
      <div className="h-14 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 flex items-center px-4 flex-shrink-0">
        <Avatar name={otherUserEmail || 'Chat'} size="sm" />
        <div className="ml-3">
          <p className="font-semibold text-surface-900 dark:text-white text-sm">{otherUserEmail || 'Select a conversation'}</p>
          <p className="text-xs text-green-500 flex items-center gap-1">
            {isTyping ? 'Typing...' : <><span className="w-2 h-2 bg-green-500 rounded-full"></span> Online</>}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg, idx) => {
          const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
          return (
            <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-3 py-2 rounded-xl shadow-sm ${isMine ? 'gradient-primary text-white rounded-tr-none' : 'bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 rounded-tl-none border border-surface-200 dark:border-surface-700'}`}>
                {msg.imageUrl && <img src={msg.imageUrl} alt="Shared" className="rounded-lg mb-1 max-h-48 object-cover" />}
                {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-primary-100' : 'text-surface-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button type="button" onClick={() => fileInputRef.current.click()} className="p-2 text-surface-400 hover:text-primary-600 transition">
            <HiOutlinePhotograph className="w-6 h-6" />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          
          <Input 
            className="flex-1" 
            placeholder="Type a message..." 
            value={messageInput} 
            onChange={handleTyping}
          />
          <Button type="submit" className="rounded-xl p-2.5">
            <HiOutlinePaperAirplane className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;