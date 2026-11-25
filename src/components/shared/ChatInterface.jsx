// import { useEffect, useState, useRef } from 'react';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchChatHistory, addSocketMessage, uploadChatImage, clearChat } from '@/store/slices/chatSlice';
// import { useSocket } from '@/context/SocketContext';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';
// import Spinner from '@/components/ui/Spinner';
// import Avatar from '@/components/ui/Avatar';
// import { HiOutlinePaperAirplane, HiOutlinePhotograph } from 'react-icons/hi';

// const ChatInterface = ({ conversationId, otherUserEmail }) => {
//   const dispatch = useAppDispatch();
//   const socket = useSocket();
//   const { messages, loading } = useAppSelector((state) => state.chat);
//   const { user } = useAppSelector((state) => state.auth);
  
//   const [messageInput, setMessageInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // Fetch History & Join Room
//   useEffect(() => {
//     if (conversationId) {
//       dispatch(fetchChatHistory(conversationId));
//       if (socket) {
//         socket.emit('join-room', conversationId);
//       }
//     }
//     return () => {
//       dispatch(clearChat());
//     };
//   }, [dispatch, conversationId, socket]);

//   // Socket Listeners
// //   useEffect(() => {
// //     if (!socket) return;

// //     socket.on('receive-message', (message) => {
// //       console.log("📬 Received message via socket:", message); // DEBUG LOG
// //       // Only add messages for the currently active conversation
// //       if (message.conversationId === conversationId) {
// //         dispatch(addSocketMessage(message));
// //       }
// //     });

// //     socket.on('display-typing', (data) => {
// //       if (data.conversationId === conversationId) setIsTyping(true);
// //     });
    
// //     socket.on('display-stop-typing', (data) => {
// //       if (data.conversationId === conversationId) setIsTyping(false);
// //     });

// //     return () => {
// //       socket.off('receive-message');
// //       socket.off('display-typing');
// //       socket.off('display-stop-typing');
// //     };
// //   }, [socket, dispatch, conversationId]);


//   // Socket Listeners
//   useEffect(() => {
//     if (!socket) return;

//     socket.on('receive-message', (message) => {
//       console.log("📬 Received message via socket:", message); // DEBUG LOG
//       dispatch(addSocketMessage(message));
//     });

//     socket.on('display-typing', () => setIsTyping(true));
//     socket.on('display-stop-typing', () => setIsTyping(false));

//     // Cleanup listeners on unmount
//     return () => {
//       socket.off('receive-message');
//       socket.off('display-typing');
//       socket.off('display-stop-typing');
//     };
//   }, [socket, dispatch]);


//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isTyping]);

// //   const handleSendMessage = (e) => {
// //     e.preventDefault();
// //     if (!messageInput.trim() || !socket) return;

// //     const messageData = {
// //       conversationId,
// //       text: messageInput,
// //       imageUrl: null
// //     };

// //     // Emit to server
// //     socket.emit('send-message', messageData);
// //     socket.emit('stop-typing', conversationId);
// //     setMessageInput('');
// //   };
//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!messageInput.trim() || !socket) return;

//     const messageData = {
//       conversationId,
//       text: messageInput,
//       imageUrl: null
//     };

//     // FIX: Add callback to catch server acknowledgement or errors
//     socket.emit('send-message', messageData, (response) => {
//       if (response && response.status === 'error') {
//         console.error('Server rejected message:', response.message);
//         alert(`Failed to send message: ${response.message}`);
//       }
//     });
    
//     socket.emit('stop-typing', conversationId);
//     setMessageInput('');
//   };

//   const handleTyping = (e) => {
//     setMessageInput(e.target.value);
//     if (socket) {
//       socket.emit('typing', conversationId);
//     }
//   };
// // Comment this handleImageUpload becaus it's dos't takes images 
//   // ... existing imports and state ...

//   // FIX: Add try/catch to prevent silent failures
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       // Upload to Cloudinary via API
//       const url = await dispatch(uploadChatImage(file)).unwrap();

//       // If successful, send the image URL via Socket
//       if (url && socket) {
//         const messageData = {
//           conversationId,
//           text: '',
//           imageUrl: url
//         };
//         socket.emit('send-message', messageData, (response) => {
//           if (response && response.status === 'error') {
//             alert(`Failed to send image: ${response.message}`);
//           }
//         });
//       }
//     } catch (err) {
//       console.error('Image upload failed:', err);
//       alert('Failed to upload image. It might be too large (Max 5MB).');
//     }
    
//     // Reset file input so the same file can be selected again
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

// // ... rest of the file remains the same ...

//   if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

//   return (
//     <div className="flex flex-col h-full bg-surface-50 dark:bg-surface-900">
      
//       {/* Chat Header */}
//       <div className="h-14 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 flex items-center px-4 flex-shrink-0">
//         <Avatar name={otherUserEmail || 'Chat'} size="sm" />
//         <div className="ml-3">
//           <p className="font-semibold text-surface-900 dark:text-white text-sm">{otherUserEmail || 'Select a conversation'}</p>
//           <p className="text-xs text-green-500 flex items-center gap-1">
//             {isTyping ? 'Typing...' : <><span className="w-2 h-2 bg-green-500 rounded-full"></span> Online</>}
//           </p>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 p-4 overflow-y-auto space-y-3">
//         {messages.map((msg, idx) => {
//           const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
//           return (
//             <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
//               <div className={`max-w-[70%] px-3 py-2 rounded-xl shadow-sm ${isMine ? 'gradient-primary text-white rounded-tr-none' : 'bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 rounded-tl-none border border-surface-200 dark:border-surface-700'}`}>
//                 {msg.imageUrl && <img src={msg.imageUrl} alt="Shared" className="rounded-lg mb-1 max-h-48 object-cover" />}
//                 {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
//                 <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-primary-100' : 'text-surface-400'}`}>
//                   {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input */}
//       <div className="p-3 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 flex-shrink-0">
//         <form onSubmit={handleSendMessage} className="flex items-center gap-2">
//           <button type="button" onClick={() => fileInputRef.current.click()} className="p-2 text-surface-400 hover:text-primary-600 transition">
//             <HiOutlinePhotograph className="w-6 h-6" />
//           </button>
//           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          
//           <Input 
//             className="flex-1" 
//             placeholder="Type a message..." 
//             value={messageInput} 
//             onChange={handleTyping}
//           />
//           <Button type="submit" className="rounded-xl p-2.5">
//             <HiOutlinePaperAirplane className="w-5 h-5" />
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;
import { Fragment, Suspense, lazy, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchChatHistory, addSocketMessage, updateSocketMessage, uploadChatImage, clearChat, markMessagesRead } from '@/store/slices/chatSlice';
import { useSocket } from '@/context/SocketContext';
import { useCallManager } from '@/context/CallManagerContext';
import axiosInstance from '@/api/axiosInstance';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import { HiOutlinePaperAirplane, HiOutlinePhotograph, HiOutlineArrowLeft, HiOutlineDotsVertical, HiOutlineBriefcase, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineCurrencyDollar, HiOutlineShieldCheck, HiOutlinePhone, HiOutlineVideoCamera, HiOutlineX, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { LuCheck, LuCheckCheck, LuClipboardCheck, LuDownload, LuFileText, LuPlus, LuSmile, LuMapPin, LuCamera, LuMic, LuSticker, LuX, LuCircleStop } from 'react-icons/lu';
import { FaBroom } from 'react-icons/fa';
import './ChatInterface.mobile.css';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

const formatCallTime = (value) => value
  ? new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  : '—';
const formatCallDateTime = (value) => value
  ? new Date(value).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  : '—';
const formatCallDuration = (value) => {
  const totalSeconds = Math.max(0, Number(value) || 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes) return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  return `${seconds}s`;
};

const messageDay = (value) => value ? new Date(value).toDateString() : '';
const stickers = ['😀', '🥰', '😂', '🥳', '😊', '🙏', '👍', '❤️', '🎉', '🔥', '💯', '🤝', '✨', '😎', '🤗', '👏'];
const dayLabel = (value) => messageDay(value) === new Date().toDateString()
  ? 'Today'
  : new Date(value).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
const SelectedPhoto = ({ file, index }) => {
  const imageRef = useRef(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    if (imageRef.current) imageRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return <img ref={imageRef} alt={`Selected image ${index + 1}`} className="h-16 w-16 rounded-xl border border-white object-cover shadow-sm dark:border-surface-700" />;
};

const ChatInterface = ({ conversationId, otherUserEmail, currentUserEmail, project, projectHref, userRole, onBack }) => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { messages, loading, error: historyError } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const participantId = project?.participant?._id;
  
  const [messageInput, setMessageInput] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [locationPending, setLocationPending] = useState(false);
  const [audioSources, setAudioSources] = useState({});
  const [lightbox, setLightbox] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [composerMenu, setComposerMenu] = useState(null);
  const [messageError, setMessageError] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionSent, setCompletionSent] = useState(false);
  const [completionPending, setCompletionPending] = useState(false);
  const [completionError, setCompletionError] = useState('');
  const { status: callStatus, startCall } = useCallManager();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const composerInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const recorderRef = useRef(null);
  const recordingStreamRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingCancelledRef = useRef(false);
  const recordingTimerRef = useRef(null);
  const audioUrlsRef = useRef([]);
  const participantName = project?.participant?.fullName || otherUserEmail?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || (userRole === 'customer' ? 'Your worker' : 'Customer');
  const ProjectIcon = project?.category === 'House Cleaning' ? FaBroom : HiOutlineBriefcase;
  const canComplete = userRole === 'provider' && project?._id && ['Assigned', 'In-Progress'].includes(project.status) && !project.workSubmittedAt && !completionSent;
  const hasDraft = messageInput.trim() || selectedImages.length > 0 || recordingBlob;
  const formattedBudget = project?.budget != null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(project.budget) : null;
  const formattedDeadline = project?.deadline ? new Date(project.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : null;
  useEffect(() => {
    if (!lightbox) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key === 'ArrowRight') setLightbox((current) => current && ({ ...current, index: (current.index + 1) % current.images.length }));
      if (event.key === 'ArrowLeft') setLightbox((current) => current && ({ ...current, index: (current.index - 1 + current.images.length) % current.images.length }));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightbox]);

  useEffect(() => () => {
    window.clearInterval(recordingTimerRef.current);
    recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  // Fetch History & Join Room
  useEffect(() => {
    if (conversationId) dispatch(fetchChatHistory(conversationId));
    return () => {
      dispatch(clearChat());
    };
  }, [dispatch, conversationId]);
// useEffect(() => {
//   if (!conversationId || !socket) return;

//   console.log("🚪 Joining room:", conversationId);

//   dispatch(fetchChatHistory(conversationId));

//   socket.emit("join-room", conversationId);

//   return () => {
//     dispatch(clearChat());
//   };
// }, [conversationId, socket, dispatch]);


// useEffect(() => {
//   if (conversationId) {
//     console.log('🚪 Joining room:', conversationId);

//     dispatch(fetchChatHistory(conversationId));

//     if (socket) {
//       socket.emit('join-room', conversationId);
//     }
//   }

//   return () => {
//     dispatch(clearChat());
//   };
// }, [dispatch, conversationId, socket]);

  // Socket Listeners
  // useEffect(() => {
  //   console.log("Socket Instance:", socket);
  //   if (!socket)
  //     {
  //       console.log("❌ Socket is NULL");
  //        return;
  //       }

  //   socket.on('receive-message', (message) => {
  //     // console.log("📬 Received message via socket:", message);
  //     console.log(
  //   '📬 Received:',
  //   message.conversationId,
  //   message.text
  // );

  //     // Filter messages for current conversation
  //     if (message.conversationId === conversationId) {
  //       dispatch(addSocketMessage(message));
  //     }
  //   });

  //   socket.on('display-typing', (data) => {
  //     if (data.conversationId === conversationId) setIsTyping(true);
  //   });
    
  //   socket.on('display-stop-typing', (data) => {
  //     if (data.conversationId === conversationId) setIsTyping(false);
  //   });

  //   return () => {
  //     socket.off('receive-message');
  //     socket.off('display-typing');
  //     socket.off('display-stop-typing');
  //   };
  // }, [socket, dispatch, conversationId]);




  useEffect(() => {
    if (!socket || !conversationId) return;
    let mounted = true;
    const join = () => {
      socket.emit('join-room', conversationId);
      socket.emit('get-conversation-presence', conversationId, (presence) => {
        if (mounted) setIsOnline(Boolean(presence?.online));
      });
    };
    const disconnect = () => { setIsOnline(false); setIsTyping(false); };
    const presenceChanged = ({ userId, status }) => {
      if (String(userId) !== String(participantId)) return;
      setIsOnline(status === 'online');
      if (status !== 'online') setIsTyping(false);
    };
    const receive = (message) => {
      if (message.conversationId !== conversationId) return;
      dispatch(addSocketMessage(message));
      if (String(message.sender?._id || message.sender) !== String(user?._id)) {
        socket.emit('mark-as-read', conversationId);
      }
    };
    const updateCall = (message) => {
      if (message.conversationId === conversationId) dispatch(updateSocketMessage(message));
    };
    const read = (receipt) => {
      if (receipt.conversationId === conversationId) dispatch(markMessagesRead(receipt));
    };
    const typing = (data) => { if (data.conversationId === conversationId) setIsTyping(true); };
    const stopTyping = (data) => { if (data.conversationId === conversationId) setIsTyping(false); };
    const workSubmitted = (data) => { if (data.conversationId === conversationId) setCompletionSent(true); };
    const listeners = {
      connect: join, disconnect, 'user-status': presenceChanged, 'receive-message': receive,
      'call-log-updated': updateCall, 'messages-read': read, 'display-typing': typing, 'display-stop-typing': stopTyping,
      'job-work-submitted': workSubmitted,
    };
    Object.entries(listeners).forEach(([event, handler]) => socket.on(event, handler));
    if (socket.connected !== false) join();

    return () => {
      mounted = false;
      window.clearTimeout(typingTimeoutRef.current);
      if (socket.connected !== false) {
        socket.emit('stop-typing', conversationId);
        socket.emit('leave-room', conversationId);
      }
      Object.entries(listeners).forEach(([event, handler]) => socket.off(event, handler));
    };
  }, [socket, conversationId, dispatch, participantId, user?._id]);

  // Auto-scroll to bottom
  useEffect(() => {
    const list = messagesEndRef.current?.parentElement;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, isTyping, showCompletion, completionSent]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!hasDraft || isSending) return;
    if (!recordingBlob && (!socket || socket.connected === false)) {
      setMessageError('Connecting to chat. Please try again in a moment.');
      return;
    }

    setIsSending(true);
    setMessageError('');
    setComposerMenu(null);
    try {
      if (recordingBlob) {
        if (recordingBlob.size > 5 * 1024 * 1024) throw new Error('This recording is too large. Please record a shorter message.');
        const extension = recordingBlob.type.includes('mp4') ? 'm4a' : recordingBlob.type.includes('ogg') ? 'ogg' : 'webm';
        const form = new FormData();
        form.append('file', recordingBlob, `voice-message.${extension}`);
        const response = await axiosInstance.post(`/chat/${conversationId}/audio`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch(addSocketMessage(response.data.data));
      } else {
        const imageUrls = [];
        for (const file of selectedImages) {
          const uploadedUrl = await dispatch(uploadChatImage(file)).unwrap();
          if (!uploadedUrl) throw new Error('An image could not be uploaded. Please try again.');
          imageUrls.push(uploadedUrl);
        }
        const messageData = {
          conversationId, text: messageInput.trim(), imageUrl: imageUrls[0] || null, imageUrls,
          senderEmail: currentUserEmail || user?.email, recipientEmail: otherUserEmail,
        };
        const response = await new Promise((resolve, reject) => {
          if (typeof socket.timeout === 'function') {
            socket.timeout(12000).emit('send-message', messageData, (error, result) => error ? reject(error) : resolve(result));
          } else {
            socket.emit('send-message', messageData, resolve);
          }
        });
        if (response?.status !== 'ok') throw new Error(response?.message || 'Message could not be sent. Please try again.');
        if (response.message) dispatch(addSocketMessage(response.message));
      }
      socket?.emit('stop-typing', conversationId);
      setMessageInput('');
      setSelectedImages([]);
      setRecordingBlob(null);
    } catch (error) {
      setMessageError(error.response?.data?.message || error.message || String(error));
    } finally {
      setIsSending(false);
    }
  };

  const handleDraftChange = (value) => {
    setMessageInput(value);
    window.clearTimeout(typingTimeoutRef.current);
    if (socket && socket.connected !== false) {
      socket.emit(value.trim() ? 'typing' : 'stop-typing', conversationId);
      if (value.trim()) typingTimeoutRef.current = window.setTimeout(() => socket.emit('stop-typing', conversationId), 2200);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const invalidType = files.find((file) => !file.type.startsWith('image/'));
    const oversizedFile = files.find((file) => file.size > 5 * 1024 * 1024);
    const remainingSlots = Math.max(0, 5 - selectedImages.length);
    setMessageError('');
    if (recordingBlob || isRecording) setMessageError('Send or remove the voice recording before adding photos.');
    else if (invalidType) setMessageError('Please choose image files only.');
    else if (oversizedFile) setMessageError('Each image must be smaller than 5 MB.');
    else {
      if (files.length > remainingSlots) setMessageError('You can attach up to 5 images per message.');
      setSelectedImages((current) => [...current, ...files.slice(0, remainingSlots)]);
    }
    e.target.value = '';
  };

  const downloadDocument = async (message) => {
    setMessageError('');
    try {
      const { data } = await axiosInstance.get(`/chat/${conversationId}/files/${message._id}`, { responseType: 'blob' });
      const fileUrl = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = message.attachment.name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    } catch {
      setMessageError('Could not download this PDF. Please try again.');
    }
  };

  const submitCompletion = async () => {
    if (!canComplete || completionPending) return;
    setCompletionPending(true);
    setCompletionError('');
    try {
      await axiosInstance.post(`/jobs/${project._id}/complete-work`, {});
      setShowCompletion(false);
      setCompletionSent(true);
    } catch (error) {
      setCompletionError(error.response?.data?.message || 'Could not submit work completion.');
    } finally {
      setCompletionPending(false);
    }
  };

  const openPicker = (ref) => {
    setComposerMenu(null);
    ref.current?.click();
  };

  const emitChatMessage = async (messageData) => {
    if (!socket || socket.connected === false) throw new Error('Connecting to chat. Please try again in a moment.');
    const response = await new Promise((resolve, reject) => {
      if (typeof socket.timeout === 'function') {
        socket.timeout(12000).emit('send-message', messageData, (error, result) => error ? reject(error) : resolve(result));
      } else {
        socket.emit('send-message', messageData, resolve);
      }
    });
    if (response?.status !== 'ok') throw new Error(response?.message || 'Message could not be sent. Please try again.');
    if (response.message) dispatch(addSocketMessage(response.message));
  };

  const shareCurrentLocation = () => {
    setComposerMenu(null);
    setMessageError('');
    if (!Capacitor.isNativePlatform() && !navigator.geolocation) {
      setMessageError('Location sharing is not supported by this browser.');
      return;
    }
    if (!socket || socket.connected === false) {
      setMessageError('Connecting to chat. Please try again in a moment.');
      return;
    }
    setLocationPending(true);
    (async () => {
      try {
        const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
        const { latitude, longitude, accuracy } = position.coords;
        await emitChatMessage({
          conversationId,
          text: 'Shared their current location',
          type: 'location',
          location: { latitude, longitude, accuracy },
        });
      } catch (error) {
        const message = error.code === 1 || /denied|permission/i.test(error.message || '')
          ? 'Allow location access in your browser or app settings to share your location.'
          : error.code === 3 || /timeout/i.test(error.message || '') ? 'Getting your location took too long. Please try again.' : 'Could not get your current location. Please try again.';
        setMessageError(message);
      } finally {
        setLocationPending(false);
      }
    })();
  };

  const startAudioRecording = async () => {
    setComposerMenu(null);
    setMessageError('');
    if (selectedImages.length) {
      setMessageError('Send or remove the selected photos before recording audio.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setMessageError('Audio recording is not supported by this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find((type) => MediaRecorder.isTypeSupported?.(type));
      const recorder = preferredType ? new MediaRecorder(stream, { mimeType: preferredType }) : new MediaRecorder(stream);
      recordingStreamRef.current = stream;
      recorderRef.current = recorder;
      recordingChunksRef.current = [];
      recordingCancelledRef.current = false;
      recorder.ondataavailable = (event) => { if (event.data.size) recordingChunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
        recordingStreamRef.current = null;
        recorderRef.current = null;
        if (!recordingCancelledRef.current && blob.size) {
          if (blob.size > 5 * 1024 * 1024) setMessageError('Recording is over 5 MB. Please record a shorter message.');
          else setRecordingBlob(blob);
        }
        setIsRecording(false);
      };
      recorder.onerror = () => {
        window.clearInterval(recordingTimerRef.current);
        setMessageError('Recording failed. Please check your microphone and try again.');
        recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
        recordingStreamRef.current = null;
        setIsRecording(false);
      };
      recorder.start();
      setRecordingSeconds(0);
      setIsRecording(true);
      recordingTimerRef.current = window.setInterval(() => setRecordingSeconds((seconds) => seconds + 1), 1000);
    } catch (error) {
      setMessageError(error.name === 'NotAllowedError' ? 'Allow microphone access in your browser settings to record audio.' : 'Could not start audio recording. Check that your microphone is available.');
    }
  };

  const stopAudioRecording = (cancel = false) => {
    recordingCancelledRef.current = cancel;
    window.clearInterval(recordingTimerRef.current);
    if (cancel) setRecordingBlob(null);
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    else {
      recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
      recordingStreamRef.current = null;
      setIsRecording(false);
    }
  };

  const sendSticker = async (sticker) => {
    setComposerMenu(null);
    setMessageError('');
    try {
      await emitChatMessage({ conversationId, text: sticker, type: 'sticker' });
    } catch (error) {
      setMessageError(error.message || 'Could not send sticker.');
    }
  };

  const loadAudio = async (message) => {
    try {
      setMessageError('');
      const { data } = await axiosInstance.get(`/chat/${conversationId}/files/${message._id}`, { responseType: 'blob' });
      const url = URL.createObjectURL(data);
      audioUrlsRef.current.push(url);
      setAudioSources((current) => ({ ...current, [message._id]: url }));
    } catch {
      setMessageError('Could not load this voice message. Please try again.');
    }
  };

  return (
    <div className="project-chat flex h-full min-h-0 bg-[#f8f9fd] dark:bg-surface-900">
      <section className="project-chat-thread flex min-w-0 flex-1 flex-col bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,.045),transparent_35%),#f8f9fd] dark:bg-surface-900">
      
      {/* Chat Header */}
      <header className="project-chat-header shrink-0">
      <div className="project-chat-person flex h-[76px] items-center border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur dark:border-surface-700 dark:bg-surface-800/90 sm:px-6">
        <button type="button" onClick={onBack} aria-label="Back to conversations" className="project-chat-back mr-3 rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-surface-700 md:hidden"><HiOutlineArrowLeft className="h-5 w-5"/></button>
        <div className="project-chat-peer relative"><Avatar src={project?.participant?.avatar?.url} name={participantName} size="md"/>{isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-surface-800"/>}</div>
        <div className="ml-3 min-w-0">
          <p className="project-chat-name truncate text-sm font-bold text-surface-900 dark:text-white">{participantName}</p>
          <p className={`mt-0.5 text-[11px] font-medium ${isOnline || isTyping ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>{isTyping ? 'Typing…' : isOnline ? 'Online now' : 'Offline'}</p>
          {project?.title && <p className="mt-0.5 hidden max-w-56 truncate text-[10px] text-slate-400 md:block">{project.title}</p>}
        </div>
        <div className="project-chat-calls ml-auto flex shrink-0 items-center gap-1.5">
          <button type="button" aria-label="Start audio call" title={socket?.connected ? 'Audio call' : 'Reconnecting to calls…'} disabled={!socket?.connected || !project?.participant?._id || callStatus !== 'idle'} onClick={() => startCall({ type: 'audio', conversationId, participant: project?.participant })} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-surface-700 dark:bg-surface-800 dark:text-slate-300 dark:hover:bg-surface-700"><HiOutlinePhone className="h-[18px] w-[18px]"/></button>
          <button type="button" aria-label="Start video call" title={socket?.connected ? 'Video call' : 'Reconnecting to calls…'} disabled={!socket?.connected || !project?.participant?._id || callStatus !== 'idle'} onClick={() => startCall({ type: 'video', conversationId, participant: project?.participant })} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-surface-700 dark:bg-surface-800 dark:text-slate-300 dark:hover:bg-surface-700"><HiOutlineVideoCamera className="h-[18px] w-[18px]"/></button>
          {projectHref && <details className="project-chat-options relative">
            <summary aria-label="Conversation options" className="cursor-pointer list-none rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-700"><HiOutlineDotsVertical className="h-5 w-5"/></summary>
            <Link to={projectHref} className="absolute right-0 top-full z-10 whitespace-nowrap rounded-xl border border-violet-100 bg-white px-3 py-2 text-xs font-semibold text-violet-800 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-violet-200">View job details</Link>
          </details>}
        </div>
      </div>
      {project?.title && projectHref && <div className="project-chat-job md:hidden">
        <span className="project-chat-job-icon"><ProjectIcon aria-hidden="true" /></span>
        <span className="project-chat-job-title" title={project.title}>{project.title}</span>
        {formattedBudget && <span className="project-chat-job-price">{formattedBudget}</span>}
        <Link to={projectHref} className="project-chat-view">View Details <HiOutlineChevronRight aria-hidden="true" /></Link>
      </div>}
      </header>

      {/* Messages Area */}
      <div className="project-chat-messages min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-7" aria-label="Chat messages" aria-busy={loading}>
        {loading && messages.length === 0 && <div className="flex justify-center py-10"><Spinner /></div>}
        {!loading && historyError && <div role="alert" className="project-chat-error">{historyError} <button type="button" className="font-bold underline" onClick={() => dispatch(fetchChatHistory(conversationId))}>Retry</button></div>}
        {!loading && !historyError && messages.length === 0 && <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">Say hello to start the conversation.</p>}
        {messages.map((msg, idx) => {
          const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
          const showDay = msg.createdAt && messageDay(msg.createdAt) !== messageDay(messages[idx - 1]?.createdAt);
          const dateDivider = showDay && <div className="project-chat-day">{dayLabel(msg.createdAt)}</div>;
          if (msg.type === 'call') {
            const call = msg.call || {};
            const isVideo = call.callType === 'video';
            const CallIcon = isVideo ? HiOutlineVideoCamera : HiOutlinePhone;
            const statusLabel = {
              ringing: 'Calling…',
              ongoing: 'In progress',
              completed: 'Call ended',
              missed: 'Missed call',
              declined: 'Declined',
              cancelled: 'Cancelled',
            }[call.status] || 'Call';
            return (
              <Fragment key={msg._id || idx}>{dateDivider}<div className="flex justify-center py-1">
                <div className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-surface-700 dark:bg-surface-800">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${call.status === 'missed' || call.status === 'declined' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300' : 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300'}`}><CallIcon className="h-5 w-5"/></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{isMine ? 'Outgoing' : 'Incoming'} {isVideo ? 'video' : 'audio'} call · {statusLabel}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Started {formatCallDateTime(call.startedAt)}{call.endedAt ? ` · Ended ${formatCallDateTime(call.endedAt)}` : ''}</p>
                    {call.status === 'completed' && <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Duration {formatCallDuration(call.durationSeconds)}</p>}
                    {call.status === 'missed' && <p className="text-xs text-slate-500 dark:text-slate-400">No answer</p>}
                  </div>
                  <time className="shrink-0 self-start text-[10px] text-slate-400">{formatCallTime(msg.createdAt)}</time>
                </div>
              </div></Fragment>
            );
          }
          const imageUrls = msg.imageUrls?.length ? msg.imageUrls : msg.imageUrl ? [msg.imageUrl] : [];
          const visibleImages = imageUrls.length > 4 ? imageUrls.slice(0, 4) : imageUrls;
          const galleryClass = imageUrls.length === 1
            ? 'max-w-[520px]'
            : imageUrls.length === 2
              ? 'grid h-48 w-[min(100%,560px)] grid-cols-2 gap-1.5'
              : imageUrls.length === 3
                ? 'grid h-64 w-[min(100%,560px)] grid-cols-[1.35fr_1fr] grid-rows-2 gap-1.5'
                : 'grid h-64 w-[min(100%,560px)] grid-cols-2 grid-rows-2 gap-1.5';
          const readByPeer = participantId && msg.readBy?.some((reader) => String(reader) === String(participantId));
          const Receipt = readByPeer ? LuCheckCheck : LuCheck;
          return (
            <Fragment key={msg._id || idx}>{dateDivider}<div className={`project-chat-row flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              {!isMine && <span aria-hidden="true" className="project-chat-sender md:hidden">{project?.participant?.avatar?.url ? <img src={project.participant.avatar.url} alt="" /> : participantName.charAt(0).toUpperCase()}</span>}
              <div className={`project-chat-bubble ${isMine ? 'is-mine' : 'is-theirs'} ${imageUrls.length ? 'has-photos max-w-[82%] overflow-hidden rounded-[20px] border border-slate-200 bg-white p-1.5 shadow-[0_8px_26px_rgba(15,23,42,.1)] dark:border-surface-700 dark:bg-surface-800 sm:max-w-[70%]' : `max-w-[82%] rounded-[18px] px-4 py-2.5 shadow-[0_5px_18px_rgba(15,23,42,.06)] sm:max-w-[70%] ${isMine ? 'rounded-br-[5px] bg-gradient-to-br from-primary-600 to-violet-600 text-white' : 'rounded-bl-[5px] border border-slate-200/80 bg-white text-surface-800 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100'}`}`}>
                {msg.type === 'sticker' && <span className="project-chat-sticker" role="img" aria-label="Sticker">{msg.text}</span>}
                {msg.type === 'location' && msg.location && <div className="project-chat-location"><span><LuMapPin aria-hidden="true" /></span><div><strong>Shared location</strong><small>Location at the time it was sent</small><a href={`https://maps.google.com/?q=${msg.location.latitude},${msg.location.longitude}`} target="_blank" rel="noreferrer">Open in Maps</a></div></div>}
                {msg.type === 'audio' && msg.attachment?.name && (audioSources[msg._id]
                  ? <audio className="project-chat-audio" controls preload="none" src={audioSources[msg._id]}>Your browser cannot play this audio.</audio>
                  : <button type="button" className="project-chat-audio-load" onClick={() => loadAudio(msg)}><LuMic aria-hidden="true" /><span>Play voice message</span></button>)}
                {imageUrls.length > 0 && <div className={galleryClass}>{visibleImages.map((imageUrl, imageIndex) => <button key={`${imageUrl}-${imageIndex}`} type="button" onClick={() => setLightbox({ images: imageUrls, index: imageIndex })} aria-label={`Open image ${imageIndex + 1} of ${imageUrls.length}`} className={`group relative min-w-0 overflow-hidden rounded-xl bg-slate-100 text-left outline-none focus-visible:ring-4 focus-visible:ring-primary-400 dark:bg-surface-900 ${imageUrls.length === 3 && imageIndex === 0 ? 'row-span-2' : ''}`}><img src={imageUrl} alt={`Shared attachment ${imageIndex + 1}`} className={`h-full w-full object-contain transition duration-200 group-hover:scale-[1.02] ${imageUrls.length === 1 ? 'max-h-[320px] rounded-xl' : ''}`}/><span className="pointer-events-none absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/10"/>{imageIndex === 3 && imageUrls.length > 4 && <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/55 text-2xl font-bold text-white">+{imageUrls.length - 3}</span>}</button>)}</div>}
                {msg.attachment?.name && msg.type !== 'audio' && <button type="button" onClick={() => downloadDocument(msg)} className="project-chat-file" aria-label={`Download ${msg.attachment.name}`}><LuFileText aria-hidden="true"/><span>{msg.attachment.name}</span><LuDownload aria-hidden="true"/></button>}
                {msg.text && msg.type !== 'location' && <p className={`project-chat-text whitespace-pre-wrap text-[13px] leading-5 ${imageUrls.length ? 'px-3 pb-1 pt-2 text-slate-800 dark:text-slate-100' : ''}`}>{msg.text}</p>}
                <p className={`project-chat-time mt-1.5 text-right text-[10px] ${imageUrls.length ? 'px-2 pb-1 text-slate-400' : isMine ? 'text-indigo-100/80' : 'text-surface-400'}`}>
                  <time dateTime={msg.createdAt}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</time>
                  {isMine && <span role="img" aria-label={readByPeer ? 'Read' : 'Sent'}><Receipt aria-hidden="true" /></span>}
                </p>
              </div>
            </div></Fragment>
          );
        })}
        {showCompletion && canComplete && <div className="project-chat-completion md:hidden">
          <div className="project-chat-completion-copy"><span><LuClipboardCheck aria-hidden="true" /></span><div><p>Mark Work as Completed?</p><p>Let the client know you have finished the work.</p></div></div>
          {completionError && <p role="alert" className="project-chat-error">{completionError}</p>}
          <div className="project-chat-completion-actions"><button type="button" disabled={completionPending} onClick={() => { setShowCompletion(false); setCompletionError(''); }}>Not Yet</button><button type="button" disabled={completionPending} onClick={submitCompletion}><LuCheck aria-hidden="true" />{completionPending ? 'Submitting…' : 'Completed'}</button></div>
        </div>}
        {(completionSent || project?.workSubmittedAt) && <div className="project-chat-day md:hidden" role={completionSent ? 'status' : undefined}>Work submitted for review</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="project-chat-composer relative shrink-0 border-t border-slate-200/80 bg-white/90 px-3 py-3 backdrop-blur dark:border-surface-700 dark:bg-surface-800/90 sm:px-6 sm:py-4">
        <div className="mx-auto w-full max-w-4xl">
        {messageError && <p role="alert" className="project-chat-error">{messageError}</p>}
        {selectedImages.length > 0 && <div className="mb-2 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-2.5 dark:border-surface-700 dark:bg-surface-800"><div className="flex gap-2 overflow-x-auto pb-1">{selectedImages.map((image, index) => <div key={`${image.name}-${image.lastModified}-${index}`} className="relative shrink-0"><SelectedPhoto file={image} index={index} /><button type="button" onClick={() => setSelectedImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} aria-label={`Remove image ${index + 1}`} className="absolute -right-1.5 -top-1.5 rounded-full bg-slate-900 p-1 text-white shadow hover:bg-rose-600"><HiOutlineX className="h-3 w-3"/></button></div>)}</div></div>}
        {isRecording && <div className="project-chat-recording" role="status"><span className="project-chat-recording-dot" />Recording {Math.floor(recordingSeconds / 60)}:{String(recordingSeconds % 60).padStart(2, '0')}<button type="button" onClick={() => stopAudioRecording(true)} aria-label="Cancel recording"><LuX aria-hidden="true"/>Cancel</button><button type="button" onClick={() => stopAudioRecording()} aria-label="Stop recording"><LuCircleStop aria-hidden="true"/>Stop</button></div>}
        {recordingBlob && !isRecording && <div className="project-chat-recording" role="status"><LuMic aria-hidden="true"/><span>Voice message ready</span><button type="button" onClick={() => setRecordingBlob(null)} aria-label="Remove voice message"><LuX aria-hidden="true"/>Remove</button></div>}
        <form onSubmit={handleSendMessage} className="project-chat-form flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-inner shadow-slate-200/40 focus-within:border-primary-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-500/10 dark:border-surface-700 dark:bg-surface-900 dark:shadow-none dark:focus-within:bg-surface-900">
          <button type="button" aria-label="Attach image" onClick={() => openPicker(fileInputRef)} className="hidden shrink-0 rounded-xl p-2.5 text-slate-400 transition hover:bg-white hover:text-primary-600 dark:hover:bg-surface-700 md:block">
            <HiOutlinePhotograph className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Attachment options" aria-expanded={composerMenu === 'attachments'} onClick={() => setComposerMenu(composerMenu === 'attachments' ? null : 'attachments')} className="project-chat-plus"><LuPlus aria-hidden="true" /></button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
          <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleImageUpload} />
          <div className="project-chat-input flex min-w-0 flex-1 items-center">
            <input
              ref={composerInputRef}
              className="min-w-0 flex-1 border-0 bg-transparent px-2 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-slate-100"
              type="text"
              aria-label="Message"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(event) => handleDraftChange(event.target.value)}
            />
            <button type="button" aria-label="Choose emoji" aria-expanded={composerMenu === 'emoji'} onClick={() => setComposerMenu(composerMenu === 'emoji' ? null : 'emoji')} className="project-chat-emoji md:hidden"><LuSmile aria-hidden="true" /></button>
          </div>
          <Button type="submit" aria-label={recordingBlob ? 'Send voice message' : 'Send message'} disabled={isSending || isRecording || !hasDraft || (!socket && !recordingBlob)} className="project-chat-send shrink-0 rounded-xl p-2.5 shadow-md shadow-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50">
            {isSending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"/> : <HiOutlinePaperAirplane className="h-5 w-5" />}
          </Button>
        </form>
        {composerMenu === 'attachments' && <div className="project-chat-popover" aria-label="Attachment options">
          <button type="button" onClick={() => openPicker(cameraInputRef)}><LuCamera aria-hidden="true" />Camera</button>
          <button type="button" onClick={() => openPicker(fileInputRef)}><HiOutlinePhotograph aria-hidden="true" />Gallery</button>
          <button type="button" disabled={locationPending} onClick={shareCurrentLocation}><LuMapPin aria-hidden="true" />{locationPending ? 'Getting location…' : 'Share location'}</button>
          <button type="button" disabled={isRecording || Boolean(recordingBlob)} onClick={startAudioRecording}><LuMic aria-hidden="true" />Record audio</button>
          <button type="button" onClick={() => setComposerMenu('stickers')}><LuSticker aria-hidden="true" />Stickers</button>
          {canComplete && <button type="button" onClick={() => { setComposerMenu(null); setShowCompletion(true); }}><LuClipboardCheck aria-hidden="true" />Mark complete</button>}
        </div>}
        {composerMenu === 'stickers' && <div className="project-chat-popover project-chat-stickers" aria-label="Choose a sticker">{stickers.map((sticker) => <button type="button" key={sticker} aria-label={`Send ${sticker} sticker`} onClick={() => sendSticker(sticker)}>{sticker}</button>)}</div>}
        {composerMenu === 'emoji' && <div className="project-chat-popover project-chat-emoji-picker-popover" aria-label="Choose an emoji">
          <Suspense fallback={<div className="project-chat-emoji-loading">Loading emojis…</div>}>
            <EmojiPicker
              onEmojiClick={(emojiData) => handleDraftChange(`${messageInput}${emojiData.emoji}`)}
              colorScheme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
              height="min(350px, 54dvh)"
              width="100%"
              lazyLoadEmojis
              autoFocusSearch={false}
              previewConfig={{ showPreview: false }}
              searchPlaceholder="Search emojis"
              className="skillbridge-emoji-picker"
            />
          </Suspense>
        </div>}
        </div>
      </div>
      </section>
      <aside className="hidden w-[250px] shrink-0 border-l border-slate-200/80 bg-white px-5 py-6 dark:border-surface-700 dark:bg-surface-800 2xl:block">
        <div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Project room</p><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{project?.status || 'Active'}</span></div>
        <h3 className="mt-3 text-lg font-bold leading-snug text-slate-800 dark:text-white">{project?.title || 'Project details'}</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{project?.category || 'Service project'}{project?.serviceType ? ` · ${project.serviceType}` : ''}</p>
        <div className="my-5 h-px bg-slate-100 dark:bg-surface-700"/>
        <p className="mb-3 text-xs font-bold text-slate-700 dark:text-slate-200">Project overview</p>
        <div className="space-y-4">
          {formattedBudget && <div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300"><HiOutlineCurrencyDollar className="h-4 w-4"/></span><div><p className="text-[10px] text-slate-400">Agreed budget</p><p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">{formattedBudget}</p></div></div>}
          {project?.location?.address && <div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300"><HiOutlineLocationMarker className="h-4 w-4"/></span><div className="min-w-0"><p className="text-[10px] text-slate-400">Location</p><p className="mt-0.5 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{project.location.address}</p></div></div>}
          {formattedDeadline && <div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"><HiOutlineCalendar className="h-4 w-4"/></span><div><p className="text-[10px] text-slate-400">Deadline</p><p className="mt-0.5 text-xs font-semibold text-slate-700 dark:text-slate-200">{formattedDeadline}</p></div></div>}
          {!formattedBudget && !project?.location?.address && !formattedDeadline && <div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300"><HiOutlineBriefcase className="h-4 w-4"/></span><div><p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Stay in sync</p><p className="mt-1 text-[11px] leading-4 text-slate-400">Share updates and files right here.</p></div></div>}
        </div>
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5 dark:border-emerald-900/50 dark:bg-emerald-900/10"><div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300"><HiOutlineShieldCheck className="h-4 w-4"/>Keep it on SkillBridge</div><p className="mt-1.5 text-[10px] leading-4 text-emerald-700/80 dark:text-emerald-300/70">Keep project details and updates in this conversation.</p></div>
      </aside>
      {lightbox && <div role="dialog" aria-modal="true" aria-label="Image viewer" onClick={() => setLightbox(null)} className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm sm:p-8">
        <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80">{lightbox.index + 1} / {lightbox.images.length}</div>
        <button type="button" onClick={() => setLightbox(null)} aria-label="Close image viewer" className="absolute right-5 top-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"><HiOutlineX className="h-5 w-5"/></button>
        {lightbox.images.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); setLightbox((current) => ({ ...current, index: (current.index - 1 + current.images.length) % current.images.length })); }} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:left-6"><HiOutlineChevronLeft className="h-6 w-6"/></button>}
        <img src={lightbox.images[lightbox.index]} alt={`Shared image ${lightbox.index + 1}`} onClick={(event) => event.stopPropagation()} className="max-h-[88dvh] max-w-[92vw] select-none object-contain shadow-2xl"/>
        {lightbox.images.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); setLightbox((current) => ({ ...current, index: (current.index + 1) % current.images.length })); }} aria-label="Next image" className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:right-6"><HiOutlineChevronRight className="h-6 w-6"/></button>}
      </div>}

    </div>
  );
};

export default ChatInterface;
