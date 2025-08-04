import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '~/store/authStore';
import { commentsApi } from '~/api/comments';
import type { Comment as CommentType } from '~/types';

/**
 * Hook to handle pending comments after user logs in
 */
export const usePendingComment = (postId: string, onCommentAdded?: (comment: CommentType) => void) => {
  const { isAuthenticated } = useAuthStore();

  const autoSubmitMutation = useMutation({
    mutationFn: (data: { content: string; parentCommentId?: string | null }) =>
      commentsApi.createComment(postId, data),
    onSuccess: (response) => {
      console.log('✅ Pending comment submitted successfully:', response);
      localStorage.removeItem('pendingComment');

      // Handle response format
      let newComment = response;
      if (response && response.data) {
        newComment = response.data;
      }

      if (newComment && newComment.id) {
        onCommentAdded?.(newComment);
      } else {
        console.warn('⚠️ Invalid pending comment response:', response);
        // Refresh page as fallback
        window.location.reload();
      }
    },
    onError: (error) => {
      console.error('❌ Failed to submit pending comment:', error);
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      const pendingData = localStorage.getItem('pendingComment');
      if (pendingData) {
        try {
          const comment = JSON.parse(pendingData);
          
          // Check if it's for this post and not too old (5 minutes)
          if (comment.postId === postId && 
              Date.now() - comment.timestamp < 5 * 60 * 1000) {
            
            console.log('🔄 Auto-submitting pending comment...');
            
            // Auto-submit the pending comment
            autoSubmitMutation.mutate({
              content: comment.content,
              parentCommentId: comment.parentCommentId
            });
          } else {
            // Remove old or irrelevant pending comment
            localStorage.removeItem('pendingComment');
          }
        } catch (error) {
          console.error('Error parsing pending comment:', error);
          localStorage.removeItem('pendingComment');
        }
      }
    }
  }, [isAuthenticated, postId, autoSubmitMutation]);

  return {
    isSubmittingPending: autoSubmitMutation.isPending,
    pendingError: autoSubmitMutation.error
  };
};
