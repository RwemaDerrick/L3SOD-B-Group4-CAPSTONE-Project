import { api } from './api.js';

export function initAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('[data-auth-open]');
  const closeBtn = modal.querySelector('.close-modal');
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const formResponse = document.getElementById('form-response');
  const tabs = modal.querySelectorAll('[data-auth-tab]');

  const open = () => modal.classList.add('active');
  const close = () => modal.classList.remove('active');

  openBtns.forEach((btn) => btn.addEventListener('click', open));
  closeBtn?.addEventListener('click', close);
  window.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  tabs?.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.authTab;
      modal.querySelectorAll('[data-auth-panel]').forEach((p) => {
        p.hidden = p.dataset.authPanel !== target;
      });
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
    });
  });

  const showMessage = (text, type) => {
    if (!formResponse) return;
    formResponse.className = `form-message ${type}`;
    formResponse.textContent = text;
  };

  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = {
      name: document.getElementById('reg-name').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password')?.value || undefined,
      mood: document.getElementById('reg-mood').value,
    };
    try {
      const data = await api.register(userData);
      showMessage(data.message, 'success');
      registerForm.reset();
      let msg = data.message;
      if (data.tempPassword) {
        msg += ` Save this temporary password: ${data.tempPassword}`;
      }
      showMessage(msg, 'success');
      setTimeout(() => {
        window.location.href = `GetStarted.html?name=${encodeURIComponent(userData.name)}`;
      }, 1500);
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
      setTimeout(() => {
        window.location.href = `GetStarted.html?name=${encodeURIComponent(data.user.name)}`;
      }, 800);
    } catch (err) {
      showMessage(err.message, 'error');
    }
  });
}

export async function requireAuth(redirectTo = 'index.html') {
  try {
    const { user } = await api.me();
    return user;
  } catch {
    window.location.href = redirectTo;
    return null;
  }
}
