import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { addMessage } from '@/lib/dbQueries';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & { io: SocketIOServer };
  };
};

export default function ioHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
      });

      socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room}`);
      });

      socket.on(
        'message',
        ({
          room,
          msg,
        }: {
          room: number;
          msg: { content: string; author: { name: string }; date: Date };
        }) => {
          addMessage(room, msg);
          io.to(`${room}`).emit('message', msg);
        }
      );

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  res.end();
}
