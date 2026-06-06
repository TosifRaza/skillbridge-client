import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAppSelector } from '@/store/hooks';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  // FIX: Use 'accessToken' because that's what authSlice calls it
  const { accessToken } = useAppSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (accessToken) {
      const axiosBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const socketServer = axiosBase.replace(/\/api\/v\d+$/, ''); 
      
      const newSocket = io(socketServer, {
        auth: { token: accessToken }, // Pass the correct variable here
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => console.log('🟢 Socket Connected:', newSocket.id));
      newSocket.on('connect_error', (err) => console.error('🔴 Socket Error:', err.message));
      newSocket.on('disconnect', () => console.log('🔴 Socket Disconnected'));

      setSocket(newSocket);

      return () => newSocket.close();
    } else {
      setSocket(null);
    }
  }, [accessToken]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}