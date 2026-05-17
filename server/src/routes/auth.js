import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { clearAuthCookie, setAuthCookie, signToken } from '../lib/auth.js';
import { requireAuth } from '../middleware/auth.js';
import { userPublicSelect } from '../lib/userSelect.js';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid registration data', errors: parsed.error.flatten() });
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: userPublicSelect,
    });

    const token = signToken(user.id);
    setAuthCookie(res, token);

    res.status(201).json({
      message: 'Welcome to Moodlink! Your journey begins now.',
      user,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid login data' });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user.id);
  setAuthCookie(res, token);

  const publicUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: userPublicSelect,
  });

  res.json({
    message: 'Welcome back!',
    user: publicUser,
  });
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.patch('/mood', requireAuth, async (req, res) => {
  const mood = z.enum(['chill', 'creative', 'stressed', 'happy', 'confused', 'intense']).safeParse(req.body.mood);
  if (!mood.success) {
    return res.status(400).json({ message: 'Invalid mood' });
  }
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { currentMood: mood.data },
    select: userPublicSelect,
  });
  res.json({ user });
});

export default router;
