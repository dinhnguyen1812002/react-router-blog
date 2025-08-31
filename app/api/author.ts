import type {ApiResponse, PaginatedResponse, Post} from '~/types';
import { apiClient } from './client';
import axiosInstance from '~/config/axios';

// Request DTO aligned with docs/AUTHOR.md
export interface CreateAuthorPostRequest {
  title: string;
  excerpt:string;
  content: string;
  categories: number[]; // category IDs
  tags: string[]; // tag UUIDs
  thumbnail?: string; // thumbnail URL
  public_date?: string;
}

export const authorApi = {
  getMyPosts: async (page: number = 0, size: number = 10): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get(`/author/posts?page=${page}&size=${size}`);
    return response.data;
  },

  createPost: async (data: CreateAuthorPostRequest): Promise<ApiResponse<Post>> => {
    const response = await axiosInstance.post('/author/write', data);
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