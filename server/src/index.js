import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import ariaRoutes from './routes/aria.js';
import contactRoutes from './routes/contact.js';
import profileRoutes from './routes/profile.js';
import { initSocket } from './socket.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientPath = path.join(__dirname, '../../client');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV === 'production' && process.env.CLIENT_URL) {
        return callback(null, origin === process.env.CLIENT_URL);
      }
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.use(
  '/api',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false })
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'moodlink-api' });
});

app.use('/api', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/aria', ariaRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/profile', profileRoutes);

app.use(express.static(clientPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const file = req.path === '/' ? 'index.html' : req.path.replace(/^\//, '');
  res.sendFile(path.join(clientPath, file), (err) => {
    if (err) res.sendFile(path.join(clientPath, 'index.html'));
  });
});

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  const message =
    err.code === 'P2021' || err.message?.includes('Prisma')
      ? 'Database not ready. Run: npx prisma db push (in the server folder)'
      : err.message || 'Server error';
  res.status(err.status || 500).json({ message });
});

server.listen(PORT, () => {
  console.log(`Moodlink running at http://localhost:${PORT}`);
});
