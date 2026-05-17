import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { userPublicSelect } from '../lib/userSelect.js';

const router = Router();

const profileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  age: z.union([z.number().int().min(13).max(120), z.null()]).optional(),
  bio: z.string().max(500).optional(),
  profilePicture: z.string().max(600_000).nullable().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).max(128).optional(),
});

router.get('/', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: userPublicSelect,
  });
  res.json({ user });
});

router.patch('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid profile data', errors: parsed.error.flatten() });
    }

    const { name, age, bio, profilePicture, currentPassword, newPassword } = parsed.data;
    const data = {};

    if (name !== undefined) data.name = name;
    if (age !== undefined) data.age = age;
    if (bio !== undefined) data.bio = bio;
    if (profilePicture !== undefined) data.profilePicture = profilePicture;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const existing = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!(await bcrypt.compare(currentPassword, existing.passwordHash))) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      data.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: userPublicSelect,
    });

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    next(err);
  }
});

export default router;
