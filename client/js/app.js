import { initAuthModal } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('auth-modal')) initAuthModal();

  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('fade-out'), 1800);
  }

  document.addEventListener('scroll', () => {
    document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  });

  const learnMore = document.querySelector('[data-scroll-about]');
  learnMore?.addEventListener('click', () => {
    document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  });
});
