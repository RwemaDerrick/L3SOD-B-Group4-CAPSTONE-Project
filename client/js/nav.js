import { api } from './api.js';
import { navigateWithTransition } from './transitions.js';

function initials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';
}

export async function initAppNav(activePage = '') {
  const btn = document.getElementById('profile-nav-btn');
  if (!btn) return null;

  try {
    const { user } = await api.me();
    const img = btn.querySelector('img');
    const span = btn.querySelector('span');

    if (user.profilePicture) {
      img.src = user.profilePicture;
      img.hidden = false;
      span.hidden = true;
    } else {
      img.hidden = true;
      span.hidden = false;
      span.textContent = initials(user.name);
    }

    btn.title = `${user.name} — Profile`;
    btn.onclick = () => navigateWithTransition('profile.html');

    document.querySelectorAll('.nav-links a').forEach((link) => {
      const file = link.getAttribute('href')?.split('/').pop()?.replace('.html', '');
      link.classList.toggle('active', file === activePage);
    });

    return user;
  } catch {
    window.location.href = 'index.html';
    return null;
  }
}
