import { apiClient } from './client';
import type { ApiResponse, Tag } from '~/types';

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const response = await apiClient.get('/tags');
    return response.data.data;
  },

  getById: async (id: string): Promise<ApiResponse<Tag>> => {
    const response = await apiClient.get(`/tags/${id}`);
    return response.data;
  },

  create: async (data: Partial<Tag>): Promise<ApiResponse<Tag>> => {
    const response = await apiClient.post('/tags', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Tag>): Promise<ApiResponse<Tag>> => {
    const response = await apiClient.put(`/tags/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tags/${id}`);
  },
};