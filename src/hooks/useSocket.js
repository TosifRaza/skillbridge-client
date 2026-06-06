import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

// Ensure we strip /api/v1 if it exists in env vars, socket connects to root
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1').replace('/api/v1', '');

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  
  // FIX: Changed 'token' to 'accessToken' to match your authSlice state
  const { user, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken && user) {
      console.log("⚡ Attempting Socket Connection to:", BASE_URL);
      
      const newSocket = io(BASE_URL, {
        auth: { token: accessToken }, // Pass the correct token here
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket Connected successfully!');
      });

      newSocket.on('connect_error', (err) => {
        console.error('❌ Socket Connection Error:', err.message);
      });

      newSocket.on('disconnect', () => {
        console.log('🔌 Socket Disconnected');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      console.log("Waiting for Auth to connect socket...");
    }
  }, [accessToken, user]);

  return socket;
}