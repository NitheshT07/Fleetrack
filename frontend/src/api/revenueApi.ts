import apiClient from './apiClient';

export const revenueApi = {
  // Get all revenues
  getAll: async () => {
    const response = await apiClient.get('/api/revenues');
    return response.data;
  },

  // Get revenues for a specific vehicle
  getByVehicleId: async (vehicleId: string) => {
    const response = await apiClient.get(`/api/revenues/${vehicleId}`);
    return response.data;
  },

  // Add new revenue
  add: async (data: any) => {
    const response = await apiClient.post('/api/revenues', data);
    return response.data;
  },

  // Update revenue
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/api/revenues/${id}`, data);
    return response.data;
  },

  // Delete revenue
  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/revenues/${id}`);
    return response.data;
  },
};

