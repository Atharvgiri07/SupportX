import axios from 'axios';

// Get base API URL from environment variable or fallback to production Render URL
const getBaseURL = () => {
  let envUrl = import.meta.env.VITE_API_URL || 'https://supportx-backend.onrender.com/api';
  // Trim whitespace and trailing slashes
  envUrl = envUrl.trim().replace(/\/+$/, '');
  // If the URL does not end with /api, append /api
  if (!envUrl.endsWith('/api')) {
    envUrl = `${envUrl}/api`;
  }
  return envUrl;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT to every request, if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('supportx_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Redirect to login if token expired on protected routes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage =
      window.location.pathname === '/login' || window.location.pathname === '/register';
    if (error.response?.status === 401 && !isAuthPage) {
      localStorage.removeItem('supportx_token');
      localStorage.removeItem('supportx_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
