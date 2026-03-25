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
  excerpt?: string;
  thumbnail?: string;
  createdAt: string;
  publishedAt?: string | null;
  categories: Array<{
    id: number;
    category: string;
    backgroundColor?: string;
  }>;
  likeCount: number;
  viewCount: number;
  featured: boolean;
  visibility: string;
  averageRating?: number;
  author: {
    id: string;
    username: string;
    avatar?: string;
    email?: string;
    roles?: string[] | null;
    slug?: string;
  };
  commentCount?: number;
  tags?: Array<{
    name: string;
    slug: string;
    description?: string;
    color?: string;
    uuid?: string;
  }>;
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

    // Endpoint thường trả về dạng:
    // { content: [...], page: { number, size, totalElements, totalPages } }
    // Trong khi type frontend đang dùng PaginatedResponse<T>.
    const response = await axiosInstance.get<any>('/post', { params: queryParams })
    const data = response.data

    if (data?.page && Array.isArray(data?.content)) {
      return {
        content: data.content,
        totalElements: data.page.totalElements ?? 0,
        totalPages: data.page.totalPages ?? 0,
        size: data.page.size ?? size,
        number: data.page.number ?? page,
      }
    }

    return data as PaginatedResponse<AdminPostListItem>
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