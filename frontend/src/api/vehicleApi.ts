import apiClient from './apiClient';

export const vehicleApi = {
  // Get all vehicles
  getAll: async () => {
    const response = await apiClient.get('/api/vehicles');
    return response.data;
  },

  // Get single vehicle by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/api/vehicles/${id}`);
    return response.data;
  },

  // Add new vehicle
  add: async (data: any) => {
    const response = await apiClient.post('/api/vehicles/add', data);
    return response.data;
  },

  // Update vehicle
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/api/vehicles/${id}`, data);
    return response.data;
  },

  // Delete vehicle
  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/vehicles/${id}`);
    return response.data;
  },
};

