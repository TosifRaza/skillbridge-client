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
import { useEffect, useState, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchChatHistory, addSocketMessage, updateSocketMessage, uploadChatImage, clearChat } from '@/store/slices/chatSlice';
import { useSocket } from '@/context/SocketContext';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import { HiOutlinePaperAirplane, HiOutlinePhotograph, HiOutlineArrowLeft, HiOutlineDotsVertical, HiOutlineBriefcase, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineCurrencyDollar, HiOutlineShieldCheck, HiOutlinePhone, HiOutlineVideoCamera, HiOutlineMicrophone, HiOutlinePhoneMissedCall, HiOutlineX, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const PENDING_CALL_KEY = 'skillbridge:pending-incoming-call';
const clearQueuedIncomingCall = (callId) => {
  try {
    const queuedCall = JSON.parse(window.sessionStorage.getItem(PENDING_CALL_KEY) || 'null');
    if (!callId || queuedCall?.callId === callId) window.sessionStorage.removeItem(PENDING_CALL_KEY);
  } catch {
    window.sessionStorage.removeItem(PENDING_CALL_KEY);
  }
  window.dispatchEvent(new CustomEvent('skillbridge:incoming-call-cleared', { detail: { callId } }));
};
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

const ChatInterface = ({ conversationId, otherUserEmail, currentUserEmail, project, userRole, onBack }) => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { messages, loading } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  
  const [messageInput, setMessageInput] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [callType, setCallType] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callError, setCallError] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const callIdRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const callStatusRef = useRef(callStatus);
  const pendingCandidatesRef = useRef([]);
  const ringTimeoutRef = useRef(null);
  const participantName = otherUserEmail?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || (userRole === 'customer' ? 'Your worker' : 'Customer');
  const formattedBudget = project?.budget != null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(project.budget) : null;
  const formattedDeadline = project?.deadline ? new Date(project.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : null;
  callStatusRef.current = callStatus;

  const clearCall = useCallback(() => {
    window.clearTimeout(ringTimeoutRef.current);
    const activeCallId = callIdRef.current;
    if (activeCallId) clearQueuedIncomingCall(activeCallId);
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    pendingCandidatesRef.current = [];
    callIdRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
    setIncomingCall(null);
    setCallStatus('idle');
    setCallType(null);
    setIsMuted(false);
    setIsCameraOff(false);
  }, []);

  const createPeerConnection = useCallback(() => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    peerConnectionRef.current = peerConnection;
    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate && socket) socket.emit('call-ice-candidate', { conversationId, callId: callIdRef.current, candidate });
    };
    peerConnection.ontrack = ({ streams }) => setRemoteStream(streams[0]);
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'connected') {
        window.clearTimeout(ringTimeoutRef.current);
        setCallStatus('connected');
      }
      if (peerConnection.connectionState === 'failed') {
        setCallError('Could not connect the call. Check your network and try again.');
        if (callIdRef.current && socket) socket.emit('call-end', { conversationId, callId: callIdRef.current });
        clearCall();
      }
    };
    return peerConnection;
  }, [clearCall, conversationId, socket]);

  const addPendingCandidates = useCallback(async () => {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection?.remoteDescription) return;
    const candidates = pendingCandidatesRef.current.splice(0);
    await Promise.all(candidates.map((candidate) => peerConnection.addIceCandidate(candidate).catch(() => {})));
  }, []);

  const startCall = async (type) => {
    const peerId = project?.participant?._id;
    if (!socket || !peerId) {
      setCallError('Calls are unavailable because the other participant is not connected to this job.');
      return;
    }
    setCallError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: type === 'video' });
      localStreamRef.current = stream;
      setLocalStream(stream);
      setCallType(type);
      callIdRef.current = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
      const peerConnection = createPeerConnection();
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('call-initiate', { conversationId, callId: callIdRef.current, callType: type, offer: peerConnection.localDescription });
      setCallStatus('calling');
      ringTimeoutRef.current = window.setTimeout(() => {
        if (callStatusRef.current !== 'connected') {
          setCallError('No answer. You can try calling again.');
          if (callIdRef.current && socket) socket.emit('call-end', { conversationId, callId: callIdRef.current, reason: 'no-answer' });
          clearCall();
        }
      }, 35000);
    } catch (error) {
      clearCall();
      setCallError(error.name === 'NotAllowedError' ? 'Allow camera and microphone access to start a call.' : 'Could not access your camera or microphone. Check your device settings.');
    }
  };

  const answerCall = async () => {
    if (!incomingCall || !socket) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: incomingCall.callType === 'video' });
      localStreamRef.current = stream;
      setLocalStream(stream);
      setCallType(incomingCall.callType);
      callIdRef.current = incomingCall.callId;
      const peerConnection = createPeerConnection();
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
      await peerConnection.setRemoteDescription(incomingCall.offer);
      await addPendingCandidates();
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('call-answer', { conversationId, callId: incomingCall.callId, answer: peerConnection.localDescription });
      clearQueuedIncomingCall(incomingCall.callId);
      setIncomingCall(null);
      setCallStatus('connecting');
    } catch (error) {
      clearCall();
      setCallError(error.name === 'NotAllowedError' ? 'Allow camera and microphone access to answer.' : 'Could not join the call. Check your camera and microphone.');
    }
  };

  const declineCall = () => {
    if (incomingCall && socket) socket.emit('call-decline', { conversationId, callId: incomingCall.callId });
    clearCall();
  };

  const endCall = () => {
    if (callIdRef.current && socket) socket.emit('call-end', { conversationId, callId: callIdRef.current, reason: callStatusRef.current === 'calling' ? 'cancelled' : 'hangup' });
    clearCall();
  };

  useEffect(() => {
    if (!conversationId || callStatusRef.current !== 'idle') return;
    try {
      const queuedCall = JSON.parse(window.sessionStorage.getItem(PENDING_CALL_KEY) || 'null');
      if (queuedCall?.conversationId !== conversationId) return;
      callIdRef.current = queuedCall.callId;
      pendingCandidatesRef.current = [];
      setIncomingCall(queuedCall);
      setCallType(queuedCall.callType);
      setCallStatus('incoming');
      setCallError('');
    } catch {
      window.sessionStorage.removeItem(PENDING_CALL_KEY);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return undefined;

    const onIncomingCall = (call) => {
      if (call.conversationId !== conversationId) return;
      if (callStatusRef.current !== 'idle') {
        socket.emit('call-decline', { conversationId, callId: call.callId });
        return;
      }
      window.sessionStorage.setItem(PENDING_CALL_KEY, JSON.stringify(call));
      callIdRef.current = call.callId;
      pendingCandidatesRef.current = [];
      setIncomingCall(call);
      setCallType(call.callType);
      setCallStatus('incoming');
      setCallError('');
    };

    const onCallAnswered = async (data) => {
      if (data.conversationId !== conversationId || data.callId !== callIdRef.current || !peerConnectionRef.current) return;
      try {
        await peerConnectionRef.current.setRemoteDescription(data.answer);
        await addPendingCandidates();
        setCallStatus('connecting');
      } catch {
        setCallError('Could not establish the call. Please try again.');
        clearCall();
      }
    };

    const onIceCandidate = async (data) => {
      if (data.conversationId !== conversationId || data.callId !== callIdRef.current || !data.candidate) return;
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection?.remoteDescription) {
        pendingCandidatesRef.current.push(data.candidate);
        return;
      }
      try { await peerConnection.addIceCandidate(data.candidate); } catch { /* Ignore stale ICE candidates after a call ends. */ }
    };

    const onCallFinished = (data) => {
      if (data.conversationId !== conversationId || data.callId !== callIdRef.current) return;
      clearCall();
    };

    socket.on('call-incoming', onIncomingCall);
    socket.on('call-answered', onCallAnswered);
    socket.on('call-ice-candidate', onIceCandidate);
    socket.on('call-declined', onCallFinished);
    socket.on('call-ended', onCallFinished);
    return () => {
      socket.off('call-incoming', onIncomingCall);
      socket.off('call-answered', onCallAnswered);
      socket.off('call-ice-candidate', onIceCandidate);
      socket.off('call-declined', onCallFinished);
      socket.off('call-ended', onCallFinished);
    };
  }, [socket, conversationId, clearCall, addPendingCandidates]);

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = callType === 'audio' ? remoteStream : null;
  }, [callType, remoteStream]);

  useEffect(() => {
    const previewUrls = selectedImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
    return () => previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
  }, [selectedImages]);

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
    if (callIdRef.current && socket) socket.emit('call-end', { conversationId, callId: callIdRef.current });
    clearCall();
  }, [clearCall, conversationId, socket]);

  // Fetch History & Join Room
  useEffect(() => {
    if (conversationId) {
      console.log('🚪 Joining room:', conversationId);
      dispatch(fetchChatHistory(conversationId));
      if (socket) {
        socket.emit('join-room', conversationId);
      }
    }
    return () => {
      dispatch(clearChat());
    };
  }, [dispatch, conversationId, socket]);
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
  console.log("🔍 Socket Instance:", socket);

  if (!socket) {
    console.log("❌ Socket is NULL");
    return;
  }

  console.log("✅ Registering receive-message listener");

  const handleReceiveMessage = (message) => {
    console.log("📬 Received:", message);

    if (message.conversationId === conversationId) {
      dispatch(addSocketMessage(message));
    }
  };
  const handleCallLogUpdate = (message) => {
    if (message.conversationId === conversationId) dispatch(updateSocketMessage(message));
  };

  socket.on("receive-message", handleReceiveMessage);
  socket.on('call-log-updated', handleCallLogUpdate);

  socket.on("display-typing", (data) => {
    if (data.conversationId === conversationId) {
      setIsTyping(true);
    }
  });

  socket.on("display-stop-typing", (data) => {
    if (data.conversationId === conversationId) {
      setIsTyping(false);
    }
  });

  return () => {
    console.log("🧹 Cleaning listeners");

    socket.off("receive-message", handleReceiveMessage);
    socket.off('call-log-updated', handleCallLogUpdate);
    socket.off("display-typing");
    socket.off("display-stop-typing");
  };
}, [socket, conversationId, dispatch]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!messageInput.trim() && selectedImages.length === 0) || !socket || isSending) return;

    setIsSending(true);
    const imageUrls = [];
    try {
      for (const file of selectedImages) {
        const uploadedUrl = await dispatch(uploadChatImage(file)).unwrap();
        if (!uploadedUrl) throw new Error('An image could not be uploaded. Please try again.');
        imageUrls.push(uploadedUrl);
      }
    } catch (error) {
      setIsSending(false);
      alert(error || 'Image upload failed. Please try again.');
      return;
    }

    const messageData = {
      conversationId,
      text: messageInput.trim(),
      imageUrl: imageUrls[0] || null,
      imageUrls,
      senderEmail: currentUserEmail || user?.email, // ADD SENDER EMAIL
      recipientEmail: otherUserEmail // ADD RECIPIENT EMAIL
    };

    const response = await new Promise((resolve) => socket.emit('send-message', messageData, (result) => {
      resolve(result);
    }));
    if (response?.status === 'error') {
      setIsSending(false);
      alert(response.message || 'Message could not be sent. Please try again.');
      return;
    }
    /*
    socket.emit('send-message', messageData, (response) => {
      if (response && response.status === 'error') {
        console.error('Server rejected message:', response.message);
        alert(`Failed to send message: ${response.message}`);
      } else {
        console.log('✅ Message sent successfully');
      }
    });
    */
    
    socket.emit('stop-typing', conversationId);
    setMessageInput('');
    setSelectedImages([]);
    setIsSending(false);
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    if (socket) {
      socket.emit('typing', { conversationId, senderEmail: currentUserEmail || user?.email });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const invalidType = files.find((file) => !file.type.startsWith('image/'));
    const oversizedFile = files.find((file) => file.size > 5 * 1024 * 1024);
    const remainingSlots = Math.max(0, 5 - selectedImages.length);
    if (invalidType) alert('Please choose image files only.');
    else if (oversizedFile) alert('Each image must be smaller than 5 MB.');
    else {
      if (files.length > remainingSlots) alert('You can attach up to 5 images per message.');
      setSelectedImages((current) => [...current, ...files.slice(0, remainingSlots)]);
    }
    e.target.value = '';
  };

  if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

  return (
    <div className="flex h-full min-h-0 bg-[#f8f9fd] dark:bg-surface-900">
      <section className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,.045),transparent_35%),#f8f9fd] dark:bg-surface-900">
      
      {/* Chat Header */}
      <div className="flex h-[76px] shrink-0 items-center border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur dark:border-surface-700 dark:bg-surface-800/90 sm:px-6">
        <button type="button" onClick={onBack} aria-label="Back to conversations" className="mr-3 rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-surface-700 md:hidden"><HiOutlineArrowLeft className="h-5 w-5"/></button>
        <div className="relative"><Avatar src={project?.participant?.avatar?.url} name={participantName} size="md"/><span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-surface-800"/></div>
        <div className="ml-3 min-w-0">
          <p className="truncate text-sm font-bold text-surface-900 dark:text-white">{participantName}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            {isTyping ? <><span className="flex gap-0.5"><i className="h-1 w-1 animate-bounce rounded-full bg-current"/><i className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:100ms]"/><i className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:200ms]"/></span> Typing…</> : <>Online now</>}
          </p>
          {project?.title && <p className="mt-0.5 max-w-56 truncate text-[10px] text-slate-400">{project.title}</p>}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button type="button" aria-label="Start audio call" title="Audio call" disabled={!socket || !project?.participant?._id || callStatus !== 'idle'} onClick={() => startCall('audio')} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-surface-700 dark:bg-surface-800 dark:text-slate-300 dark:hover:bg-surface-700"><HiOutlinePhone className="h-[18px] w-[18px]"/></button>
          <button type="button" aria-label="Start video call" title="Video call" disabled={!socket || !project?.participant?._id || callStatus !== 'idle'} onClick={() => startCall('video')} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-surface-700 dark:bg-surface-800 dark:text-slate-300 dark:hover:bg-surface-700"><HiOutlineVideoCamera className="h-[18px] w-[18px]"/></button>
          <button type="button" aria-label="Conversation options" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-surface-700"><HiOutlineDotsVertical className="h-5 w-5"/></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-7">
        {messages.length > 0 && <div className="mx-auto mb-5 w-fit rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[10px] font-medium text-slate-400 dark:border-surface-700 dark:bg-surface-800">Your project conversation</div>}
        {messages.map((msg, idx) => {
          const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
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
              <div key={msg._id || idx} className="flex justify-center py-1">
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
              </div>
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
          return (
            <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`${imageUrls.length ? 'max-w-[82%] overflow-hidden rounded-[20px] border border-slate-200 bg-white p-1.5 shadow-[0_8px_26px_rgba(15,23,42,.1)] dark:border-surface-700 dark:bg-surface-800 sm:max-w-[70%]' : `max-w-[82%] rounded-[18px] px-4 py-2.5 shadow-[0_5px_18px_rgba(15,23,42,.06)] sm:max-w-[70%] ${isMine ? 'rounded-br-[5px] bg-gradient-to-br from-primary-600 to-violet-600 text-white' : 'rounded-bl-[5px] border border-slate-200/80 bg-white text-surface-800 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100'}`}`}>
                {imageUrls.length > 0 && <div className={galleryClass}>{visibleImages.map((imageUrl, imageIndex) => <button key={`${imageUrl}-${imageIndex}`} type="button" onClick={() => setLightbox({ images: imageUrls, index: imageIndex })} aria-label={`Open image ${imageIndex + 1} of ${imageUrls.length}`} className={`group relative min-w-0 overflow-hidden rounded-xl bg-slate-100 text-left outline-none focus-visible:ring-4 focus-visible:ring-primary-400 dark:bg-surface-900 ${imageUrls.length === 3 && imageIndex === 0 ? 'row-span-2' : ''}`}><img src={imageUrl} alt={`Shared attachment ${imageIndex + 1}`} className={`h-full w-full object-contain transition duration-200 group-hover:scale-[1.02] ${imageUrls.length === 1 ? 'max-h-[320px] rounded-xl' : ''}`}/><span className="pointer-events-none absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/10"/>{imageIndex === 3 && imageUrls.length > 4 && <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/55 text-2xl font-bold text-white">+{imageUrls.length - 3}</span>}</button>)}</div>}
                {msg.text && <p className={`whitespace-pre-wrap text-[13px] leading-5 ${imageUrls.length ? 'px-3 pb-1 pt-2 text-slate-800 dark:text-slate-100' : ''}`}>{msg.text}</p>}
                <p className={`mt-1.5 text-right text-[10px] ${imageUrls.length ? 'px-2 pb-1 text-slate-400' : isMine ? 'text-indigo-100/80' : 'text-surface-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="shrink-0 border-t border-slate-200/80 bg-white/90 px-3 py-3 backdrop-blur dark:border-surface-700 dark:bg-surface-800/90 sm:px-6 sm:py-4">
        <div className="mx-auto w-full max-w-4xl">
        {selectedImages.length > 0 && <div className="mb-2 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-2.5 dark:border-surface-700 dark:bg-surface-800"><div className="flex gap-2 overflow-x-auto pb-1">{selectedImages.map((image, index) => <div key={`${image.name}-${image.lastModified}-${index}`} className="relative shrink-0"><img src={imagePreviews[index]} alt={`Selected image ${index + 1}`} className="h-16 w-16 rounded-xl border border-white object-cover shadow-sm dark:border-surface-700"/><button type="button" onClick={() => setSelectedImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} aria-label={`Remove image ${index + 1}`} className="absolute -right-1.5 -top-1.5 rounded-full bg-slate-900 p-1 text-white shadow hover:bg-rose-600"><HiOutlineX className="h-3 w-3"/></button></div>)}</div></div>}
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-inner shadow-slate-200/40 focus-within:border-primary-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-500/10 dark:border-surface-700 dark:bg-surface-900 dark:shadow-none dark:focus-within:bg-surface-900">
          <button type="button" aria-label="Attach image" onClick={() => fileInputRef.current?.click()} className="shrink-0 rounded-xl p-2.5 text-slate-400 transition hover:bg-white hover:text-primary-600 dark:hover:bg-surface-700">
            <HiOutlinePhotograph className="h-5 w-5" />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
          
          <input
            className="min-w-0 flex-1 border-0 bg-transparent px-2 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-slate-100"
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={handleTyping}
          />
          <Button type="submit" aria-label="Send message" disabled={!socket || isSending || (!messageInput.trim() && selectedImages.length === 0)} className="shrink-0 rounded-xl p-2.5 shadow-md shadow-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50">
            {isSending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"/> : <HiOutlinePaperAirplane className="h-5 w-5" />}
          </Button>
        </form>
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
      {callStatus !== 'idle' && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
        <div className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-[#111827] text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7"><div><p className="text-sm font-semibold">{incomingCall?.caller?.name || participantName}</p><p className="mt-0.5 text-xs text-slate-400">{callStatus === 'incoming' ? `Incoming ${callType} call` : callStatus === 'calling' ? 'Calling…' : callStatus === 'connected' ? 'Connected' : 'Connecting…'}</p></div><button type="button" onClick={endCall} className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label="Close call"><HiOutlineX className="h-5 w-5"/></button></div>
          <div className="relative flex min-h-[320px] items-center justify-center bg-[radial-gradient(ellipse_at_50%_45%,rgba(99,102,241,.28),transparent_48%),#0b1020] sm:min-h-[440px]">
            {callType === 'audio' && <audio ref={remoteAudioRef} autoPlay className="hidden"/>}
            {callType === 'video' && <video ref={remoteVideoRef} autoPlay playsInline className={`absolute inset-0 h-full w-full object-cover ${remoteStream ? '' : 'hidden'}`}/>}
            {(!remoteStream || callType === 'audio') && <div className="flex flex-col items-center px-5 text-center"><div className="mb-5 rounded-full bg-gradient-to-br from-indigo-400 to-violet-700 p-1 shadow-[0_0_60px_rgba(99,102,241,.38)]"><Avatar src={incomingCall?.caller?.avatar || project?.participant?.avatar?.url} name={incomingCall?.caller?.name || participantName} size="lg"/></div><h3 className="text-xl font-bold">{incomingCall?.caller?.name || participantName}</h3><p className="mt-2 text-sm text-slate-400">{callStatus === 'incoming' ? 'They are waiting for you to answer' : callStatus === 'connected' ? `${callType === 'audio' ? 'Audio' : 'Video'} call in progress` : 'Waiting for them to join...'}</p></div>}
            {callType === 'video' && localStream && <video ref={localVideoRef} autoPlay playsInline muted className={`absolute bottom-4 right-4 h-24 w-36 rounded-2xl border border-white/20 bg-slate-900 object-cover shadow-xl sm:bottom-5 sm:right-5 sm:h-32 sm:w-48 ${isCameraOff ? 'opacity-0' : ''}`}/>}
          </div>
          <div className="flex items-center justify-center gap-3 px-5 py-5">
            {callStatus === 'incoming' ? <><button type="button" onClick={declineCall} className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white transition hover:bg-rose-500" aria-label="Decline call"><HiOutlinePhoneMissedCall className="h-5 w-5"/></button><button type="button" onClick={answerCall} className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-400" aria-label="Answer call">{callType === 'video' ? <HiOutlineVideoCamera className="h-5 w-5"/> : <HiOutlinePhone className="h-5 w-5"/>}</button></> : <>
              <button type="button" onClick={() => { const next = !isMuted; localStreamRef.current?.getAudioTracks().forEach((track) => { track.enabled = !next; }); setIsMuted(next); }} className={`relative flex h-12 w-12 items-center justify-center rounded-full transition ${isMuted ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`} aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}><HiOutlineMicrophone className="h-5 w-5"/>{isMuted && <span className="absolute h-0.5 w-6 rotate-45 rounded bg-rose-500"/>}</button>
              {callType === 'video' && <button type="button" onClick={() => { const next = !isCameraOff; localStreamRef.current?.getVideoTracks().forEach((track) => { track.enabled = !next; }); setIsCameraOff(next); }} className={`flex h-12 w-12 items-center justify-center rounded-full transition ${isCameraOff ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`} aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}><HiOutlineVideoCamera className="h-5 w-5"/></button>}
              <button type="button" onClick={endCall} className="flex h-12 w-14 items-center justify-center rounded-full bg-rose-600 text-white transition hover:bg-rose-500" aria-label="End call"><HiOutlinePhoneMissedCall className="h-5 w-5"/></button>
            </>}
          </div>
        </div>
      </div>}
      {callError && callStatus === 'idle' && <div className="fixed bottom-5 right-5 z-[110] flex max-w-sm items-start gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-xl dark:border-rose-900 dark:bg-surface-800 dark:text-slate-100"><span className="flex-1">{callError}</span><button type="button" onClick={() => setCallError('')} aria-label="Dismiss call message" className="text-slate-400 hover:text-slate-700"><HiOutlineX className="h-4 w-4"/></button></div>}
    </div>
  );
};

export default ChatInterface;
