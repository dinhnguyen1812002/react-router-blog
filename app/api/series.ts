import { apiClient } from './client';
import type {
  Series,
  CreateSeriesRequest,
  UpdateSeriesRequest,
  AddPostToSeriesRequest,
  ReorderSeriesPostsRequest,
  SeriesSearchRequest,
  ApiResponse,
  PaginatedResponse,
} from '~/types';

export const seriesApi = {
  createSeries: async (data: CreateSeriesRequest): Promise<ApiResponse<Series>> => {
    const response = await apiClient.post('/series', data);
    return response.data;
  },

  updateSeries: async (seriesId: string, data: UpdateSeriesRequest): Promise<ApiResponse<Series>> => {
    const response = await apiClient.put(`/series/${seriesId}`, data);
    return response.data;
  },

  getSeriesById: async (seriesId: string): Promise<ApiResponse<Series>> => {
    const response = await apiClient.get(`/series/${seriesId}`);
    return response.data;
  },

  getSeriesBySlug: async (slug: string): Promise<ApiResponse<Series>> => {
    const response = await apiClient.get(`/series/slug/${slug}`);
    return response.data;
  },

  getAllSeries: async (
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDirection: 'ASC' | 'DESC' = 'DESC'
  ): Promise<ApiResponse<PaginatedResponse<Series>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDirection,
    });
    
    const response = await apiClient.get(`/series?${params.toString()}`);
    return response.data;
  },

  getSeriesByUser: async (
    userId: string,
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDirection: 'ASC' | 'DESC' = 'DESC'
  ): Promise<ApiResponse<PaginatedResponse<Series>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDirection,
    });
    
    const response = await apiClient.get(`/series/user/${userId}?${params.toString()}`);
    return response.data;
  },

  searchSeries: async (searchData: SeriesSearchRequest): Promise<ApiResponse<PaginatedResponse<Series>>> => {
    const response = await apiClient.post('/series/search', searchData);
    return response.data;
  },

  getPopularSeries: async (page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<Series>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    const response = await apiClient.get(`/series/popular?${params.toString()}`);
    return response.data;
  },

  addPostToSeries: async (seriesId: string, data: AddPostToSeriesRequest): Promise<ApiResponse<Series>> => {
    const response = await apiClient.post(`/series/${seriesId}/posts`, data);
    return response.data;
  },

  removePostFromSeries: async (seriesId: string, postId: string): Promise<ApiResponse<Series>> => {
    const response = await apiClient.delete(`/series/${seriesId}/posts/${postId}`);
    return response.data;
  },

  reorderSeriesPosts: async (seriesId: string, data: ReorderSeriesPostsRequest): Promise<ApiResponse<Series>> => {
    const response = await apiClient.put(`/series/${seriesId}/posts/reorder`, data);
    return response.data;
  },

  deleteSeries: async (seriesId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/series/${seriesId}`);
    return response.data;
  },
};
