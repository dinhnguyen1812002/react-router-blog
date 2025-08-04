import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bookmark } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { bookmarksApi } from '~/api/bookmarks';
import { useAuthStore } from '~/store/authStore';
import { useNavigate } from 'react-router';

interface BookmarkButtonProps {
  postId: string;
  initialBookmarked?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
}

export const BookmarkButton = ({ 
  postId, 
  initialBookmarked = false, 
  className = "",
  variant = 'default'
}: BookmarkButtonProps) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  // Update local state when props change
  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        return bookmarksApi.removeBookmark(postId);
      } else {
        return bookmarksApi.addBookmark(postId);
      }
    },
    onMutate: async () => {
      // Optimistic update
      setIsBookmarked(!isBookmarked);
    },
    onSuccess: () => {
      // Invalidate bookmarks queries
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      // Revert optimistic update
      setIsBookmarked(isBookmarked);
      console.error('Bookmark error:', error);
    }
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      // Redirect to login
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    bookmarkMutation.mutate();
  };

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={bookmarkMutation.isPending}
        className={`p-2 h-auto ${className}`}
        title={isBookmarked ? 'Bỏ lưu' : 'Lưu bài viết'}
      >
        <Bookmark 
          className={`w-4 h-4 transition-all duration-200 ${
            isBookmarked 
              ? 'fill-current text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={bookmarkMutation.isPending}
      className={`flex items-center space-x-2 ${className}`}
    >
      <Bookmark 
        className={`w-4 h-4 transition-all duration-200 ${
          isBookmarked 
            ? 'fill-current text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400'
        }`}
      />
      <span className="text-sm">
        {bookmarkMutation.isPending 
          ? 'Đang xử lý...' 
          : isBookmarked 
            ? 'Đã lưu' 
            : 'Lưu'
        }
      </span>
    </Button>
  );
};
