const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

// fetch() for logged-in requests: adds the token, and sends the user to /login
// if the server says the token is missing, invalid or expired (401)
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  return res;
}