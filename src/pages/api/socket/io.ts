import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { addInvite, addMessage } from '@/lib/dbQueries';
import { Session } from 'next-auth';
import type { SendInvite, SendMessage } from '@/lib/types';

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
      const user: Session['user'] = socket.handshake.auth.user;
      console.log(`User connected: ${socket.id}`);
      if (user.id) {
        socket.join(user.id);
      }

      socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User ${user.username || user.name} joined room: ${room}`);
      });

      socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`User ${user.username || user.name} left room: ${room}`);
      });

      socket.on('invite', async (invite: SendInvite) => {
        const { fromId, toId, ChatroomId } = invite;
        console.log('invite');
        const inviteUser = await addInvite(fromId, toId, ChatroomId);
        io.to(toId).emit('invite', inviteUser);
      });

      socket.on(
        'message',
        ({ room, msg }: { room: string; msg: SendMessage }) => {
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
