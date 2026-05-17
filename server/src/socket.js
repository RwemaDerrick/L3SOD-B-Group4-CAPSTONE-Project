import { Server } from 'socket.io';
import { verifyToken, COOKIE_NAME } from './lib/auth.js';
import { prisma } from './lib/prisma.js';
import { getQueue, leaveAllQueues } from './services/matching.js';

const MOODS = ['chill', 'creative', 'stressed', 'happy', 'confused', 'intense'];

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, cb) => {
        if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          cb(null, true);
        } else {
          cb(null, process.env.CLIENT_URL === origin);
        }
      },
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie || '';
    const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    const token = match?.[1] || socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));

    const payload = verifyToken(token);
    if (!payload?.sub) return next(new Error('Unauthorized'));

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, currentMood: true },
    });
    if (!user) return next(new Error('Unauthorized'));

    socket.user = user;
    next();
  });

  io.on('connection', (socket) => {
    socket.on('match:join', async ({ mood }) => {
      if (!MOODS.includes(mood)) return socket.emit('match:error', { message: 'Invalid mood' });

      leaveAllQueues(socket.user.id);
      const queue = getQueue(mood);

      let partnerEntry = null;
      for (const [, entry] of queue.entries()) {
        if (entry.userId !== socket.user.id) {
          partnerEntry = entry;
          break;
        }
      }

      if (partnerEntry) {
        queue.delete(partnerEntry.socketId);

        const room = await prisma.room.create({
          data: {
            mood,
            members: {
              create: [
                { userId: socket.user.id },
                { userId: partnerEntry.userId },
              ],
            },
          },
        });

        const payload = { roomId: room.id, mood };
        socket.join(room.id);
        io.sockets.sockets.get(partnerEntry.socketId)?.join(room.id);
        socket.emit('match:found', payload);
        io.to(partnerEntry.socketId).emit('match:found', payload);
      } else {
        queue.set(socket.id, { userId: socket.user.id, socketId: socket.id, mood });
        socket.emit('match:waiting', { mood });
      }
    });

    socket.on('match:leave', () => {
      leaveAllQueues(socket.user.id);
      socket.emit('match:left');
    });

    socket.on('room:join', ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on('chat:message', async ({ roomId, body }) => {
      if (!roomId || !body?.trim()) return;

      const member = await prisma.roomMember.findFirst({
        where: { roomId, userId: socket.user.id },
      });
      if (!member) return;

      const message = await prisma.message.create({
        data: { roomId, userId: socket.user.id, body: body.trim().slice(0, 2000) },
        include: { user: { select: { id: true, name: true } } },
      });

      io.to(roomId).emit('chat:message', { message });
    });

    socket.on('disconnect', () => {
      leaveAllQueues(socket.user.id);
    });
  });

  return io;
}
