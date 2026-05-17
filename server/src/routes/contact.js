import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});

router.post('/', optionalAuth, async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Please fill in all fields correctly' });
  }

  await prisma.contactMessage.create({
    data: { ...parsed.data, userId: req.user?.id ?? null },
  });

  res.status(201).json({ message: 'Thank you! We received your message and will respond soon.' });
});

export default router;
