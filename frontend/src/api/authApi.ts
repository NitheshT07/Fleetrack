import apiClient from './apiClient';

export const authApi = {
  // Login
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  // Register
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Logout (if needed)
  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fleettrack_token');
    localStorage.removeItem('fleettrack_user');
    return Promise.resolve();
  },
};

