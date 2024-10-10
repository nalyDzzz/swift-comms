'use client';
import { useSession } from 'next-auth/react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
  connected: boolean;
  joinRoom: (roomName: string) => void;
  leaveRoom: (roomName: string) => void;
}

const SocketContext = createContext<SocketContextProps>(
  {} as SocketContextProps
);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session && !socket) {
      const newSocket = io(process.env.NEXT_PUBLIC_SITE_URL!, {
        path: '/api/socket/io',
        addTrailingSlash: false,
        auth: {
          user: session.user,
        },
      });
      setSocket(newSocket);
    }
  }, [status, session, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        setConnected(socket.connected);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
        setConnected(socket.connected);
        setSocket(null);
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      return () => {
        socket.disconnect();
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) setConnected(false);
  }, [socket]);

  const joinRoom = useCallback(
    (roomId: string) => {
      if (socket) {
        socket.emit('joinRoom', roomId);
        console.log(`Joined room: ${roomId}`);
      }
    },
    [socket]
  );

  const leaveRoom = useCallback(
    (roomId: string) => {
      if (socket) {
        socket.emit('leaveRoom', roomId);
        console.log(`Left room: ${roomId}`);
      }
    },
    [socket]
  );

  return (
    <SocketContext.Provider value={{ socket, connected, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  );
};
