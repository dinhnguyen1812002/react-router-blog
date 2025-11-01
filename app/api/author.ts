import type {ApiResponse, PaginatedResponse, Post} from '~/types';
import { apiClient } from './client';
import axiosInstance from '~/config/axios';

export interface CreateAuthorPostRequest {
  title: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  categories: string[];
  tags: string[];
  featured?: boolean;
  public_date?: string;
}

export interface GetMyPostsParams {
  page?: number;
  size?: number;
  keyword?: string;
  categoryName?: string;
  tagName?: string;
  sortDirection?: 'asc' | 'desc';
}

export const authorApi = {
  getMyPosts: async (
    page: number = 0,
    size: number = 10,
    keyword?: string,
    categoryName?: string,
    tagName?: string,
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<Post[]> => {
    // Build query params
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (keyword) params.append('keyword', keyword);
    if (categoryName) params.append('categoryName', categoryName);
    if (tagName) params.append('tagName', tagName);
    if (sortDirection) params.append('sortDirection', sortDirection);

    const response = await apiClient.get(`/author/posts?${params.toString()}`);

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

  getPostById: async (postId: string): Promise<Post> => {
    const response = await apiClient.get(`/author/${postId}`);
    return response.data;
  },
};