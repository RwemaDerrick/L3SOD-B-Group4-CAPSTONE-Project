import { api } from './api.js';
import { navigateWithTransition } from './transitions.js';

const formResponse = document.getElementById('form-response');
const tabs = document.querySelectorAll('[data-auth-tab]');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

function showMessage(text, type) {
  if (!formResponse) return;
  formResponse.className = `form-message ${type}`;
  formResponse.textContent = text;
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.authTab;
    document.querySelectorAll('[data-auth-panel]').forEach((p) => {
      const panel = p.getAttribute('data-auth-panel');
      p.hidden = panel !== target;
    });
    tabs.forEach((t) => t.classList.toggle('active', t === tab));
    showMessage('', '');
  });
});

async function redirectIfLoggedIn() {
  try {
    await api.me();
    navigateWithTransition('home.html');
  } catch {
    /* not logged in */
  }
}

registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const data = await api.register({
      name: document.getElementById('reg-name').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password').value,
    });
    showMessage(data.message, 'success');
    setTimeout(() => navigateWithTransition('home.html'), 600);
  } catch (err) {
    showMessage(err.message, 'error');
  }
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const data = await api.login({
      email: document.getElementById('login-email').value.trim(),
      password: document.getElementById('login-password').value,
    });
    showMessage(data.message, 'success');
    setTimeout(() => navigateWithTransition('home.html'), 600);
  } catch (err) {
    showMessage(err.message, 'error');
  }
});

redirectIfLoggedIn();
