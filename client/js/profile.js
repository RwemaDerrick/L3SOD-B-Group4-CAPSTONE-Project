import { api } from './api.js';
import { initAppNav } from './nav.js';
import { navigateWithTransition } from './transitions.js';

const form = document.getElementById('profile-form');
const preview = document.getElementById('profile-preview');
const previewImg = document.getElementById('profile-preview-img');
const previewInitials = document.getElementById('profile-preview-initials');
const fileInput = document.getElementById('profile-picture');
const responseEl = document.getElementById('profile-response');

function showInitials(name) {
  const parts = name.trim().split(' ');
  previewInitials.textContent = parts.map((p) => p[0]).join('').slice(0, 2).toUpperCase() || '?';
  previewInitials.hidden = false;
  previewImg.hidden = true;
}

function showImage(src) {
  previewImg.src = src;
  previewImg.hidden = false;
  previewInitials.hidden = true;
}

function fillForm(user) {
  document.getElementById('profile-name').value = user.name || '';
  document.getElementById('profile-email').value = user.email || '';
  document.getElementById('profile-age').value = user.age ?? '';
  document.getElementById('profile-bio').value = user.bio || '';
  if (user.profilePicture) showImage(user.profilePicture);
  else showInitials(user.name);
}

fileInput?.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (file.size > 400_000) {
    responseEl.className = 'form-message error';
    responseEl.textContent = 'Image must be under 400KB';
    fileInput.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => showImage(reader.result);
  reader.readAsDataURL(file);
});

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const ageVal = document.getElementById('profile-age').value;
  const payload = {
    name: document.getElementById('profile-name').value.trim(),
    age: ageVal === '' ? null : Number(ageVal),
    bio: document.getElementById('profile-bio').value.trim(),
  };

  if (fileInput?.files?.[0]) {
    payload.profilePicture = previewImg.src;
  }

  const newPass = document.getElementById('profile-new-password').value;
  if (newPass) {
    payload.newPassword = newPass;
    payload.currentPassword = document.getElementById('profile-current-password').value;
  }

  try {
    const data = await api.updateProfile(payload);
    responseEl.className = 'form-message success';
    responseEl.textContent = data.message;
    fillForm(data.user);
    fileInput.value = '';
    document.getElementById('profile-new-password').value = '';
    document.getElementById('profile-current-password').value = '';
  } catch (err) {
    responseEl.className = 'form-message error';
    responseEl.textContent = err.message;
  }
});

document.getElementById('logout-btn')?.addEventListener('click', async () => {
  await api.logout();
  navigateWithTransition('index.html');
});

(async () => {
  const user = await initAppNav('profile');
  if (user) fillForm(user);
})();
