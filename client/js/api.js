import { API_BASE } from './config.js';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch {
    throw new Error(
      'Cannot reach the Moodlink server. Run: cd server && npm install && npx prisma db push && npm run dev — then open http://localhost:5000'
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  health: () => request('/api/health'),
  register: (body) => request('/api/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/api/logout', { method: 'POST' }),
  me: () => request('/api/me'),
  updateMood: (mood) => request('/api/mood', { method: 'PATCH', body: JSON.stringify({ mood }) }),
  getRoom: (roomId) => request(`/api/rooms/${roomId}`),
  sendRoomMessage: (roomId, body) =>
    request(`/api/rooms/${roomId}/messages`, { method: 'POST', body: JSON.stringify({ body }) }),
  ariaChat: (message, sessionId) =>
    request('/api/aria/chat', { method: 'POST', body: JSON.stringify({ message, sessionId }) }),
  contact: (body) => request('/api/contact', { method: 'POST', body: JSON.stringify(body) }),
  getProfile: () => request('/api/profile'),
  updateProfile: (body) => request('/api/profile', { method: 'PATCH', body: JSON.stringify(body) }),
};
