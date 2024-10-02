import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import { addMessage } from '@/lib/dbQueries';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log('user joined room');
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
        msg: { message: string; author: string; date: Date };
      }) => {
        addMessage(room, msg);
        io.to(`${room}`).emit('message', msg);
      }
    );

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
