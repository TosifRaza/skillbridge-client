// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import { useSelector } from 'react-redux';

// const SOCKET_SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// export const useSocket = () => {
//   const [socket, setSocket] = useState(null);
//   const { user, token } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (token && user) {
//       const newSocket = io(SOCKET_SERVER_URL, {
//         auth: { token },
//         transports: ['websocket', 'polling'], // Fallback to polling if WS fails
//       });

//       newSocket.on('connect', () => {
//         console.log('⚡ Socket Connected:', newSocket.id);
//       });

//       newSocket.on('disconnect', () => {
//         console.log('🔌 Socket Disconnected');
//       });

//       setSocket(newSocket);

//       return () => {
//         newSocket.close();
//         setSocket(null);
//       };
//     }
//   }, [token, user]);

//   return socket;
// };
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

// FIX: Strip the /api/v1 part if it exists, Socket.io connects to the root
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const SOCKET_SERVER_URL = API_BASE.replace('/api/v1', '');

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && user) {
      const newSocket = io(SOCKET_SERVER_URL, {
        auth: { token },
        transports: ['websocket', 'polling'], 
      });

      newSocket.on('connect', () => {
        console.log('⚡ Socket Connected:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        console.log('🔌 Socket Disconnected');
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket Connection Error:', err.message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
      };
    }
  }, [token, user]);

  return socket;
};