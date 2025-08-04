import { apiClient } from './client';
import type { ApiResponse } from '~/types';

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalCategories: number;
  totalTags: number;
  totalComments: number;
  totalViews: number;
}

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    // Mock data for now - replace with actual API call
    return {
      totalUsers: 1250,
      totalPosts: 456,
      totalCategories: 12,
      totalTags: 89,
      totalComments: 2340,
      totalViews: 45600,
    };
  },

  getUsers: async (page: number = 0, size: number = 10) => {
    const response = await apiClient.get(`/admin/users?page=${page}&size=${size}`);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${userId}`);
  },

  updateUserRole: async (userId: string, roles: string[]): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/admin/users/${userId}/roles`, { roles });
    return response.data;
  },
};