import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { optionalAuth } from '../middleware/auth.js';
import { getAriaReply } from '../services/aria.js';

const router = Router();

const chatSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().uuid().optional(),
});

router.post('/chat', optionalAuth, async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid message' });
  }

  const { message, sessionId } = parsed.data;
  let session;

  if (sessionId) {
    session = await prisma.ariaSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
    });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
  } else {
    session = await prisma.ariaSession.create({
      data: { userId: req.user?.id ?? null },
      include: { messages: true },
    });
  }

  const history = session.messages.map((m) => ({ role: m.role, content: m.content }));
  const reply = await getAriaReply(message, history);

  await prisma.ariaMessage.createMany({
    data: [
      { sessionId: session.id, role: 'user', content: message },
      { sessionId: session.id, role: 'assistant', content: reply.content },
    ],
  });

  res.json({
    sessionId: session.id,
    reply: reply.content,
    crisis: reply.crisis,
  });
});

router.get('/sessions/:sessionId', optionalAuth, async (req, res) => {
  const session = await prisma.ariaSession.findUnique({
    where: { id: req.params.sessionId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  res.json({ session });
});

export default router;
