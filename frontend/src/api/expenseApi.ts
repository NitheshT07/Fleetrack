import apiClient from './apiClient';

export const expenseApi = {
  // Get all expenses
  getAll: async () => {
    const response = await apiClient.get('/expenses');
    return response.data;
  },

  // Get expenses for a specific vehicle
  getByVehicleId: async (vehicleId: string) => {
    const response = await apiClient.get(`/expenses/${vehicleId}`);
    return response.data;
  },

  // Add new expense
  add: async (data: any) => {
    const response = await apiClient.post('/expenses', data);
    return response.data;
  },

  // Update expense
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/expenses/${id}`, data);
    return response.data;
  },

  // Delete expense
  delete: async (id: string) => {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  },
};

