import apiClient from './apiClient';

export const notificationApi = {
  // Get all notifications for current user
  getAll: async (userId?: string) => {
    const response = await apiClient.get('/api/notifications', {
      params: userId ? { userId } : {},
    });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    const response = await apiClient.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (userId?: string) => {
    const response = await apiClient.put('/api/notifications/read-all', null, {
      params: userId ? { userId } : {},
    });
    return response.data;
  },

  // Delete notification
  delete: async (notificationId: string) => {
    const response = await apiClient.delete(`/api/notifications/${notificationId}`);
    return response.data;
  },
};

