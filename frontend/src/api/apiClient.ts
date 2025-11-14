import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

axios.post(`${BASE_URL}/api/auth/login`)


const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Don't add token for auth endpoints (login/register)
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('token') || localStorage.getItem('fleettrack_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

