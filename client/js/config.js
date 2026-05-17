/** API base URL — always points at the backend in local dev */
function resolveApiBase() {
  const { protocol, hostname, port } = window.location;

  // Opening HTML as a file — no server on this origin
  if (protocol === 'file:') {
    return 'http://localhost:5000';
  }

  // Already served by Moodlink backend (port 5000 or default http port)
  if (port === '5000' || (port === '' && hostname === 'localhost')) {
    return '';
  }

  // Live Server, Vite, port 3000, etc. — API is on 5000
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // Production: same host, relative /api
  return '';
}

const API_BASE = resolveApiBase();

export { API_BASE };
