import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuthStore } from '~/store/authStore';
import { postsApi, type RatePostRequest } from '~/api/posts';

/**
 * Hook for post actions like like and rating
 */
export const usePostActions = (postId: string) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => postsApi.likePost(postId),
    onSuccess: (response) => {
      console.log('✅ Post liked successfully:', response);

      // Invalidate post queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      return response;
    },
    onError: (error: any) => {
      console.error('Like post error:', error);

      if (error.response?.status === 500) {
        // Redirect to login if not authenticated
        navigate('/login', {
          state: {
            message: 'Vui lòng đăng nhập để thích bài viết',
            returnUrl: window.location.pathname
          }
        });
      }
    }
  });

  const rateMutation = useMutation({
    mutationFn: (data: RatePostRequest) => postsApi.ratePost(postId, data),
    onSuccess: (response) => {
      console.log('✅ Post rated successfully:', response);

      // Invalidate post queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      return response;
    },
    onError: (error: any) => {
      console.error(' Rate post error:', error);

      if (error.response?.status === 401) {
        // Redirect to login if not authenticated
        navigate('/login', {
          state: {
            message: 'Vui lòng đăng nhập để đánh giá bài viết',
            returnUrl: window.location.pathname
          }
        });
      }
    }
  });

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          message: 'Vui lòng đăng nhập để thích bài viết',
          returnUrl: window.location.pathname
        }
      });
      return;
    }

    likeMutation.mutate();
  };

  const handleRate = (score: number) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          message: 'Vui lòng đăng nhập để đánh giá bài viết',
          returnUrl: window.location.pathname
        }
      });
      return;
    }

    if (score < 1 || score > 5) {
      console.error('Invalid rating score:', score);
      return;
    }

    rateMutation.mutate({ score });
  };

  return {
    // Actions
    handleLike,
    handleRate,

    // States
    isLiking: likeMutation.isPending,
    isRating: rateMutation.isPending,

    // Errors
    likeError: likeMutation.error,
    ratingError: rateMutation.error,

    // Data
    likeData: likeMutation.data,
    ratingData: rateMutation.data,
  };
};
