import { api } from './api.js';

document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = document.getElementById('contact-response');
  const body = {
    name: document.getElementById('contact-name').value.trim(),
    email: document.getElementById('contact-email').value.trim(),
    message: document.getElementById('contact-message').value.trim(),
  };
  try {
    const data = await api.contact(body);
    res.className = 'form-message success';
    res.textContent = data.message;
    e.target.reset();
  } catch (err) {
    res.className = 'form-message error';
    res.textContent = err.message;
  }
});
