import apiClient from './apiClient';

export const revenueApi = {
  // Get all revenues
  getAll: async () => {
    const response = await apiClient.get('/revenues');
    return response.data;
  },

  // Get revenues for a specific vehicle
  getByVehicleId: async (vehicleId: string) => {
    const response = await apiClient.get(`/revenues/${vehicleId}`);
    return response.data;
  },

  // Add new revenue
  add: async (data: any) => {
    const response = await apiClient.post('/revenues', data);
    return response.data;
  },

  // Update revenue
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/revenues/${id}`, data);
    return response.data;
  },

  // Delete revenue
  delete: async (id: string) => {
    const response = await apiClient.delete(`/revenues/${id}`);
    return response.data;
  },
};

