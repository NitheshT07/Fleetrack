import apiClient from './apiClient';

export const dashboardApi = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },
};

