import { apiClient } from './client';
import type { Post } from '~/types';

export interface BookmarkResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export const bookmarksApi = {
  // Get user's bookmarked posts
  getBookmarks: async (page = 0, limit = 10): Promise<BookmarkResponse> => {
    try {
      const response = await apiClient.get(`/user/bookmarks?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  },

  // Add bookmark
  addBookmark: async (postId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(`/post/${postId}/bookmark`);
      return response.data;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  },

  // Remove bookmark
  removeBookmark: async (postId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete(`/post/${postId}/bookmark`);
      return response.data;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  },

  // Check if post is bookmarked
  isBookmarked: async (postId: string): Promise<{ isBookmarked: boolean }> => {
    try {
      const response = await apiClient.get(`/post/${postId}/bookmark/status`);
      return response.data;
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      throw error;
    }
  }
};
