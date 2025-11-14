// Trip API - can be used for trip-related operations
// Currently revenue/trips are handled in revenueApi.ts
// This file is kept for future expansion

import apiClient from './apiClient';

export const tripApi = {
  // Get all trips
  getAll: async () => {
    const response = await apiClient.get('/tracks');
    return response.data;
  },

  // Get trip by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/tracks/${id}`);
    return response.data;
  },
};

