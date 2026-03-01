import type {ApiResponse, PaginatedResponse, Post} from '~/types';
import { apiClient } from './client';
import axiosInstance from '~/config/axios';

/** Visibility status for posts. Defaults to DRAFT. */
export type PostVisibility = "PUBLISHED" | "SCHEDULED" | "PRIVATE" | "DRAFT";

/** API schema for create/update post - PUT /author/{postId} */
export interface CreateAuthorPostRequest {
  authorName?: string;
  title: string;
  excerpt?: string;
  createdAt?: string;
  content: string;
  thumbnail?: string;
  /** Category IDs (e.g. [1, 2]) */
  categories?: number[];
  /** Tag UUIDs (e.g. ["3fa85f64-5717-4562-b3fc-2c963f66afa6"]) */
  tags?: string[];
  featured?: boolean;
  /** ISO-8601 format */
  public_date?: string;
  status?: PostVisibility;
  visibility?: PostVisibility;
  /** ISO-8601 format when visibility is SCHEDULED */
  scheduledPublishAt?: string;
}

/** Same shape as create - PUT accepts full or partial payload */
export type UpdateAuthorPostRequest = Partial<CreateAuthorPostRequest> &
  Pick<CreateAuthorPostRequest, "title" | "content">;

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

  updatePost: async (
    postId: string,
    postData: CreateAuthorPostRequest
  ): Promise<ApiResponse<Post>> => {
    const response = await apiClient.put(`/author/${postId}`, postData);
    return response.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await apiClient.delete(`/author/${postId}`);
  },

  getPostById: async (postId: string): Promise<Post> => {
    const response = await apiClient.get(`/author/${postId}`);
    const data = response.data as Post | { data: Post };
    return "data" in data && data.data ? data.data : (data as Post);
  },
};