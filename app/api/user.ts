import { apiClient } from './client';
import type {ApiResponse, PaginatedResponse, Post} from '~/types';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  location?: string;
  websiteUrl?: string;
  githubUrl?: string;
  createdAt: string;
  stats?: {
    totalPosts: number;
    totalComments: number;
    totalBookmarks: number;
  };
}

export const userApi = {
  getProfile: async (userId: string): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  },

  updateProfile: async (profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.put('/user/profile', profileData);
    return response.data;
  },

  getUserPosts: async (userId: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get(`/user/${userId}/posts?page=${page}&size=${size}`);
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<any>> => {
    const response = await apiClient.put('/user/change-password', passwordData);
    return response.data;
  },
};