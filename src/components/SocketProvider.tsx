'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
  connected: boolean;
  joinRoom: (roomName: string) => void;
  leaveRoom: (roomName: string) => void;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  connected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = (room: string) => {
    if (room && socket) {
      socket.emit('joinRoom', room);
      setRoom(room);
      console.log('Joined room: ', room);
    }
  };

  const leaveRoom = () => {
    if (room && socket) {
      socket.emit('leaveRoom', room);
      console.log('Left room: ', room);
      setRoom(null);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connected, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  );
};
