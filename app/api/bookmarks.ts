import { apiClient } from './client';
import { apiEndpoints } from '~/utils/api';
import type { Post } from '~/types';

export interface BookmarkResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface BookmarkActionResponse {
  success: boolean;
  message: string;
  isBookmarked?: boolean;
}

export interface BookmarkNotesRequest {
  notes: string;
}

// Helper function to handle bookmark API errors
const handleBookmarkError = (error: any, action: string) => {
  console.error(`Error ${action}:`, error);

  if (error.response?.status === 401) {
    throw new Error('Bạn cần đăng nhập để lưu bài viết');
  } else if (error.response?.status === 404) {
    throw new Error('Bài viết không tồn tại');
  } else if (error.response?.status === 405) {
    throw new Error('Chức năng bookmark hiện không khả dụng');
  } else if (error.response?.status === 500) {
    throw new Error('Lỗi server, vui lòng thử lại sau');
  } else {
    throw new Error(error.response?.data?.message || `Không thể ${action}. Vui lòng thử lại.`);
  }
};

export const bookmarksApi = {
  // Get user's bookmarked posts (paginated)
  getBookmarks: async (page = 0, size = 10): Promise<BookmarkResponse> => {
    try {
      const response = await apiClient.get(apiEndpoints.bookmarks.list(page, size));
      return response.data;
    } catch (error) {
      handleBookmarkError(error, 'lấy danh sách');
      throw error;
    }
  },

  // Get all saved posts (non-paginated)
  getAll: async (): Promise<Post[]> => {
    try {
      const response = await apiClient.get(apiEndpoints.bookmarks.listAll());
      return response.data;
    } catch (error) {
      handleBookmarkError(error, 'lấy tất cả bài đã lưu');
      throw error;
    }
  },

  // Toggle bookmark following docs: POST to add, DELETE to remove
  toggleBookmark: async (postId: string, notes?: string): Promise<BookmarkActionResponse> => {
    try {
      const statusRes = await bookmarksApi.isBookmarked(postId);
      if (statusRes.isBookmarked) {
        const response = await apiClient.delete(apiEndpoints.bookmarks.remove(postId));
        return response.data;
      } else {
        const response = await apiClient.post(apiEndpoints.bookmarks.add(postId), notes ? { notes } : undefined);
        return response.data;
      }
    } catch (error) {
      handleBookmarkError(error, 'thay đổi bookmark');
      throw error;
    }
  },

  // Explicit add (POST)
  addBookmark: async (postId: string, notes?: string): Promise<BookmarkActionResponse> => {
    try {
      const response = await apiClient.post(apiEndpoints.bookmarks.add(postId), notes ? { notes } : undefined);
      return response.data;
    } catch (error) {
      handleBookmarkError(error, 'thêm bookmark');
      throw error;
    }
  },

  // Explicit remove (DELETE)
  removeBookmark: async (postId: string): Promise<BookmarkActionResponse> => {
    try {
      const response = await apiClient.delete(apiEndpoints.bookmarks.remove(postId));
      return response.data;
    } catch (error) {
      handleBookmarkError(error, 'xóa bookmark');
      throw error;
    }
  },

  // Check if post is bookmarked (with legacy fallback)
  isBookmarked: async (postId: string): Promise<{ isBookmarked: boolean }> => {
    try {
      const response = await apiClient.get(apiEndpoints.bookmarks.status(postId));
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        // Fallback to legacy endpoint
        const legacy = await apiClient.get(apiEndpoints.bookmarks.legacyStatus(postId));
        return legacy.data;
      }
      handleBookmarkError(error, 'kiểm tra trạng thái');
      throw error;
    }
  },

  // Count bookmarks for current user
  countUser: async (): Promise<number> => {
    try {
      const response = await apiClient.get(apiEndpoints.bookmarks.countUser());
      return response.data;
    } catch (error) {
      handleBookmarkError(error, 'đếm số bookmark của người dùng');
      throw error;
    }
  },

  // Count bookmarks for a post
  countPost: async (postId: string): Promise<number> => {
    try {
      const response = await apiClient.get(apiEndpoints.bookmarks.countPost(postId));
      return response.data;
    } catch (error) {
      handleBookmarkError(error, 'đếm số bookmark của bài viết');
      throw error;
    }
  },

  // Update notes for a saved post
  updateNotes: async (savedPostId: string, notes: string): Promise<BookmarkActionResponse> => {
    try {
      const response = await apiClient.put(apiEndpoints.bookmarks.updateNotes(savedPostId), { notes } as BookmarkNotesRequest);
      return response.data;
    } catch (error) {
      handleBookmarkError(error, 'cập nhật ghi chú');
      throw error;
    }
  },
};
