import { apiClient } from './client';
import type { Post } from '~/types';

export interface UserPostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface PostStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageRating: number;
}

export const userPostsApi = {
  // Get user's own posts
  getUserPosts: async (page = 0, limit = 10): Promise<UserPostsResponse> => {
    try {
      const response = await apiClient.get(`/user/posts?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  },

  // Get user's post statistics
  getUserStats: async (): Promise<PostStats> => {
    try {
      const response = await apiClient.get('/user/posts/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Delete user's post
  deletePost: async (postId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete(`/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Update post status (publish/draft)
  updatePostStatus: async (postId: string, status: 'published' | 'draft'): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.patch(`/post/${postId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating post status:', error);
      throw error;
    }
  },

  // Get post analytics
  getPostAnalytics: async (postId: string): Promise<{
    views: number;
    likes: number;
    comments: number;
    rating: number;
    viewsHistory: Array<{ date: string; views: number }>;
  }> => {
    try {
      const response = await apiClient.get(`/post/${postId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post analytics:', error);
      throw error;
    }
  }
};
