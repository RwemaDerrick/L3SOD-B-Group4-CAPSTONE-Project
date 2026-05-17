import { API_BASE } from './config.js';
import { api } from './api.js';
import { requireAuth } from './auth.js';

const MOODS = ['chill', 'creative', 'stressed', 'happy', 'confused', 'intense'];

let socket = null;
let currentRoomId = null;

async function init() {
  const params = new URLSearchParams(window.location.search);
  const user = await requireAuth();
  if (!user) return;

  const greeting = document.getElementById('dash-greeting');
  if (greeting) greeting.textContent = `Welcome back, ${user.name}`;

  renderMoodPicker(user.currentMood);
  bindMatchControls(user);
  loadSocket();
}

function renderMoodPicker(active) {
  const picker = document.getElementById('mood-picker');
  if (!picker) return;
  picker.innerHTML = MOODS.map(
    (m) => `<button type="button" class="mood-btn${m === active ? ' active' : ''}" data-mood="${m}">${m}</button>`
  ).join('');
  picker.querySelectorAll('.mood-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      picker.querySelectorAll('.mood-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      await api.updateMood(btn.dataset.mood);
    });
  });
}

function bindMatchControls(user) {
  const statusEl = document.getElementById('match-status');
  const findBtn = document.getElementById('find-match');
  const leaveBtn = document.getElementById('leave-match');
  const chatPanel = document.getElementById('chat-panel');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  findBtn?.addEventListener('click', () => {
    const mood = document.querySelector('.mood-btn.active')?.dataset.mood || user.currentMood;
    statusEl.textContent = 'Searching for someone on your wavelength...';
    socket?.emit('match:join', { mood });
  });

  leaveBtn?.addEventListener('click', () => {
    socket?.emit('match:leave');
    currentRoomId = null;
    chatPanel?.classList.remove('active');
    statusEl.textContent = 'Left the queue. Tap Find Match when ready.';
    chatMessages.innerHTML = '';
  });

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const body = chatInput.value.trim();
    if (!body || !currentRoomId) return;
    socket?.emit('chat:message', { roomId: currentRoomId, body });
    chatInput.value = '';
  });

  function addChatMessage(msg) {
    const div = document.createElement('div');
    div.className = 'chat-msg';
    const mine = msg.user?.id && msg.user.name;
    div.innerHTML = `<strong>${msg.user?.name || 'You'}:</strong> ${escapeHtml(msg.body)}`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  window.__addChatMessage = addChatMessage;
}

function loadSocket() {
  if (typeof io === 'undefined') {
    document.getElementById('match-status').textContent = 'Socket.io failed to load. Refresh the page.';
    return;
  }
  const connect = () => {
    socket = io(API_BASE || undefined, { withCredentials: true });
    const statusEl = document.getElementById('match-status');
    const chatPanel = document.getElementById('chat-panel');

    socket.on('match:waiting', () => {
      statusEl.textContent = 'Waiting for a match... hang tight.';
    });
    socket.on('match:found', async ({ roomId }) => {
      currentRoomId = roomId;
      statusEl.textContent = 'Match found! Say hello.';
      chatPanel?.classList.add('active');
      socket.emit('room:join', { roomId });
      try {
        const { room } = await api.getRoom(roomId);
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '';
        room.messages.forEach((m) => window.__addChatMessage(m));
      } catch {
        /* history optional */
      }
    });
    socket.on('chat:message', ({ message }) => window.__addChatMessage(message));
    socket.on('match:error', ({ message }) => {
      statusEl.textContent = message;
    });
  };
  connect();
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

init();
