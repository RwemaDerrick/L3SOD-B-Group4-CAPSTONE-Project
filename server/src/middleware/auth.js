import { COOKIE_NAME, verifyToken } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';
import { userPublicSelect } from '../lib/userSelect.js';

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  const payload = verifyToken(token);
  if (!payload?.sub) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: userPublicSelect,
  });
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }
  req.user = user;
  next();
}

export async function optionalAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    const payload = verifyToken(token);
    if (payload?.sub) {
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: userPublicSelect,
      });
      if (user) req.user = user;
    }
  }
  next();
}
