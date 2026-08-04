import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT to every request, if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supportx_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token expired on protected routes, redirect to login (do not redirect during login attempt)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
    if (error.response?.status === 401 && !isAuthPage) {
      localStorage.removeItem('supportx_token');
      localStorage.removeItem('supportx_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
