import { api } from './api.js';
import { requireAuth } from './auth.js';

requireAuth();

const messagesEl = document.getElementById('aria-messages');
const form = document.getElementById('aria-form');
const input = document.getElementById('aria-input');
let sessionId = sessionStorage.getItem('aria_session_id') || null;

function appendMessage(text, role, crisis = false) {
  const div = document.createElement('div');
  div.className = `aria-msg ${role}${crisis ? ' crisis' : ''}`;
  div.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

appendMessage(
  "Hi, I'm Aria. I'm here to listen without judgment. How are you feeling right now?",
  'assistant'
);

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  input.value = '';
  input.disabled = true;

  try {
    const data = await api.ariaChat(text, sessionId);
    sessionId = data.sessionId;
    sessionStorage.setItem('aria_session_id', sessionId);
    appendMessage(data.reply, 'assistant', data.crisis);
  } catch (err) {
    appendMessage('Sorry, I had trouble responding. Please try again in a moment.', 'assistant');
  } finally {
    input.disabled = false;
    input.focus();
  }
});
