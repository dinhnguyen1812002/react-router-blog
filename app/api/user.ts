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

  // Update custom profile markdown content
  updateCustomProfile: async (markdownContent: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.put('/users/profile/custom', {
      markdownContent
    });
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

  getPopularUsers: async (limit: number = 10): Promise<ApiResponse<UserProfile[]>> => {
    try {
      // For now, return mock data. In real app, this would be an API endpoint
      const mockUsers: UserProfile[] = [
        {
          id: '1',
          username: 'nguyenvana',
          email: 'nguyenvana@example.com',
          displayName: 'Nguyễn Văn A',
          bio: 'Full-stack developer với 5+ năm kinh nghiệm',
          avatarUrl: '',
          createdAt: '2023-01-01T00:00:00Z',
          stats: {
            totalPosts: 45,
            totalComments: 890,
            totalBookmarks: 125,
          },
        },
        {
          id: '2',
          username: 'tranthib',
          email: 'tranthib@example.com',
          displayName: 'Trần Thị B',
          bio: 'UI/UX Designer & Frontend Developer',
          avatarUrl: '',
          createdAt: '2023-02-01T00:00:00Z',
          stats: {
            totalPosts: 32,
            totalComments: 650,
            totalBookmarks: 98,
          },
        },
      ];

      return {
        data: mockUsers.slice(0, limit),
        message: 'Success',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching popular users:', error);
      throw error;
    }
  },
};