import { apiClient } from './client';
import type { ApiResponse, Comment as CommentType } from '~/types';

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: string | null;
}

export const commentsApi = {
  createComment: async (postId: string, data: CreateCommentRequest): Promise<CommentType> => {
    try {
      console.log('🚀 Creating comment:', { postId, data });
      const response = await apiClient.post(`/comments/posts/${postId}`, data);

      console.log('📥 Raw API response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });

      // Handle different response formats from backend
      let commentData = response.data;

      // If response has a data property, use it
      if (commentData && typeof commentData === 'object' && commentData.data) {
        commentData = commentData.data;
      }

      // Validate that we have a proper comment object
      if (!commentData || !commentData.id) {
        console.warn('⚠️ Invalid comment response format:', response.data);
        throw new Error('Invalid response format from server');
      }

      console.log('✅ Processed comment data:', commentData);
      return commentData;
    } catch (error) {
      console.error('❌ Create comment API error:', {
        // message: error.message,
        // status: error.response?.status,
        // data: error.response?.data
      });
      throw error;
    }
  },

  updateComment: async (commentId: string, content: string): Promise<CommentType> => {
    try {
      const response = await apiClient.put(`/comments/${commentId}`, { content });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Update comment error:', error);
      throw error;
    }
  },

  deleteComment: async (commentId: string): Promise<void> => {
    try {
      await apiClient.delete(`/comments/${commentId}`);
    } catch (error) {
      console.error('Delete comment error:', error);
      throw error;
    }
  },
};