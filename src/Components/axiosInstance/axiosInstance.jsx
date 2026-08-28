import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Dynamically read the URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});

// Add Authorization header dynamically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token'); // Fetch latest token
  if (token) {
    config.headers['auth-token'] = token; // or `Authorization: Bearer ${token}` if required
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
