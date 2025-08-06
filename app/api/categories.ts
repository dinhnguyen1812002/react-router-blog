import { apiClient } from './client';
import type { ApiResponse, Category } from '~/types';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get('/category');
    return response.data ?? []; // ✅ return raw array directly
  },

  getById: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: Partial<Category>): Promise<ApiResponse<Category>> => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Category>): Promise<ApiResponse<Category>> => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};