import type {ApiResponse, PaginatedResponse, Post} from '~/types';
import { apiClient } from './client';

// import { Post, ApiResponse, PaginatedResponse } from '~/types';

export const authorApi = {
  getMyPosts: async (page: number = 0, size: number = 10): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get(`/author/posts?page=${page}&size=${size}`);
    return response.data;
  },

  createPost: async (postData: any): Promise<ApiResponse<Post>> => {
    const response = await apiClient.post('/author/write', postData);
    return response.data;
  },

  updatePost: async (postId: string, postData: any): Promise<ApiResponse<Post>> => {
    const response = await apiClient.put(`/author/${postId}`, postData);
    return response.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await apiClient.delete(`/author/${postId}`);
  },

  getPostById: async (postId: string): Promise<ApiResponse<Post>> => {
    const response = await apiClient.get(`/author/posts/${postId}`);
    return response.data;
  },
};