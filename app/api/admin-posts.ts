import axiosInstance from '~/config/axios';
import type { PaginatedResponse } from '~/types';

export interface AdminGetPostsParams {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: string;
  featured?: boolean | null;
  sortBy?: 'newest' | 'oldest' | 'title' | 'views' | 'likes';
  sortDirection?: 'asc' | 'desc';
}

export interface AdminPostListItem {
  id: string;
  title: string;
  slug: string;
  categories: Array<{
    id: number;
    category: string;
    slug: string;
  }>;
  likeCount: number;
  viewCount: number;
  featured: boolean;
  is_publish: boolean;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt?: string;
}


export const adminPostsApi = {
  /**
   * Get all posts for admin with pagination and filtering
   */
  getAdminPosts: async (params: AdminGetPostsParams = {}): Promise<PaginatedResponse<AdminPostListItem>> => {
    const {
      page = 0,
      size = 10,
      search,
      categoryId,
      featured,
      sortBy = 'newest',
      sortDirection = 'desc'
    } = params;

    const queryParams: Record<string, string | number | boolean> = { 
      page, 
      size, 
      sortBy: sortBy === 'newest' ? 'createdAt' : sortBy, 
      sortDirection 
    };

    if (search) queryParams.search = search;
    if (categoryId) queryParams.categoryId = categoryId;
    if (featured !== null && featured !== undefined) queryParams.featured = featured;

    // Sử dụng endpoint posts thông thường với admin token
    const response = await axiosInstance.get<PaginatedResponse<AdminPostListItem>>('/post', {
      params: queryParams
    });

    return response.data;
  },

  /**
   * Update post featured status
   */
  updatePostFeatured: async (postId: string) => {
    const response = await axiosInstance.post(`/post/${postId}/featured`);
    return response.data;
  },

  /**
   * Delete post (admin only)
   */
  deletePost: async (postId: string) => {
    const response = await axiosInstance.delete(`/post/${postId}`);
    return response.data;
  },

  /**
   * Get categories for filter dropdown
   */
  getCategories: async () => {
    const response = await axiosInstance.get('/category');
    return response.data;
  }
};