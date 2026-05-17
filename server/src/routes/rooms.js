import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:roomId', requireAuth, async (req, res) => {
  const member = await prisma.roomMember.findFirst({
    where: { roomId: req.params.roomId, userId: req.user.id },
  });
  if (!member) {
    return res.status(403).json({ message: 'Not a member of this room' });
  }

  const room = await prisma.room.findUnique({
    where: { id: req.params.roomId },
    include: {
      members: { include: { user: { select: { id: true, name: true, currentMood: true } } } },
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 100,
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });

  res.json({ room });
});

router.post('/:roomId/messages', requireAuth, async (req, res) => {
  const body = z.string().min(1).max(2000).safeParse(req.body.body);
  if (!body.success) {
    return res.status(400).json({ message: 'Invalid message' });
  }

  const member = await prisma.roomMember.findFirst({
    where: { roomId: req.params.roomId, userId: req.user.id },
  });
  if (!member) {
    return res.status(403).json({ message: 'Not a member of this room' });
  }

  const message = await prisma.message.create({
    data: { roomId: req.params.roomId, userId: req.user.id, body: body.data },
    include: { user: { select: { id: true, name: true } } },
  });

  res.status(201).json({ message });
});

export default router;
