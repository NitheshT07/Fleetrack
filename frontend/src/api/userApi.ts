import apiClient from './apiClient';

export const userApi = {
  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get('/api/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/api/auth/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.put('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

