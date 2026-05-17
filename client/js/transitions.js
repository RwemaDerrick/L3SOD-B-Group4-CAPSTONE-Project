const INTERNAL = /\.html$/i;

export function navigateWithTransition(href) {
  document.body.classList.add('page-exit');
  setTimeout(() => {
    window.location.href = href;
  }, 320);
}

function isInternalLink(a) {
  if (!a.href) return false;
  try {
    const url = new URL(a.href);
    return url.origin === window.location.origin && INTERNAL.test(url.pathname);
  } catch {
    return false;
  }
}

document.body.classList.add('page-enter');
requestAnimationFrame(() => document.body.classList.remove('page-enter'));

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
  if (!isInternalLink(a)) return;
  e.preventDefault();
  navigateWithTransition(a.getAttribute('href'));
});
