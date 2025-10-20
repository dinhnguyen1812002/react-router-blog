import { useState, useEffect } from 'react';
import { usePostActions } from '~/hooks/usePostActions';
import { useAuthStore } from '~/store/authStore';
import { Button } from '~/components/ui/button';
import { Star, StarOff } from 'lucide-react';

interface RatingComponentProps {
  postId: string;
  initialUserRating?: number | null;
  initialAverageRating?: number;
  className?: string;
  showAverage?: boolean;
  compact?: boolean;
}

export const RatingComponent = ({
  postId,
  initialUserRating = null,
  initialAverageRating = 0,
  className = "",
  showAverage = true,
  compact = false
}: RatingComponentProps) => {
  const { isAuthenticated } = useAuthStore();
  const { handleRate, isRating, ratingData, ratingError } = usePostActions(postId);

  const [userRating, setUserRating] = useState<number | null>(initialUserRating);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Update local state when API response comes back
  useEffect(() => {
    if (ratingData) {
      setUserRating(ratingData.userRating);
      setAverageRating(ratingData.averageRating);
    }
  }, [ratingData]);

  // Reset to initial values when props change
  useEffect(() => {
    setUserRating(initialUserRating);
    setAverageRating(initialAverageRating);
  }, [initialUserRating, initialAverageRating]);

  const handleRatingClick = (rating: number) => {
    if (!isAuthenticated) {
      handleRate(1); // This will trigger redirect
      return;
    }

    // Optimistic update
    setUserRating(rating);
    handleRate(rating);
  };

  const handleStarHover = (rating: number) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(null);
  };

  // Compact version for cards/lists
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Star Rating Display */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoverRating || userRating || averageRating) >= star;
            return (
              <button
                key={star}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                disabled={isRating}
                className={`w-4 h-4 transition-colors ${
                  isFilled 
                    ? 'text-yellow-400' 
                    : 'text-gray-300 dark:text-gray-600'
                } hover:text-yellow-400 disabled:opacity-50`}
              >
                <Star className="w-full h-full fill-current" />
              </button>
            );
          })}
        </div>

        {/* Rating Text */}
        {showAverage && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {averageRating > 0 ? averageRating.toFixed(1) : '' }
          </span>
        )}

        {/* User Rating Indicator */}
        {userRating && (
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            ({userRating}/5)
          </span>
        )}

        {isRating && (
          <span className="text-xs text-blue-600 dark:text-blue-400">Đang lưu...</span>
        )}
      </div>
    );
  }

  // Full version for detail pages
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Rating Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {averageRating > 0 ? 'Điểm trung bình' : 'Chưa có đánh giá'}
            </div>
          </div>

          {/* User Rating */}
          {userRating && (
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {userRating}/5
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Điểm của bạn</div>
            </div>
          )}
        </div>

        {/* Rate Button */}
        {!userRating && isAuthenticated && (
          <Button
            onClick={() => handleRatingClick(1)}
            variant="outline"
            size="sm"
            className="text-sm"
          >
            Đánh giá
          </Button>
        )}
      </div>

      {/* Interactive Star Rating */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoverRating || userRating || averageRating) >= star;
            return (
              <button
                key={star}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                disabled={isRating}
                className={`w-8 h-8 transition-all duration-200 ${
                  isFilled 
                    ? 'text-yellow-400 scale-110' 
                    : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                } hover:scale-110 disabled:opacity-50`}
              >
                <Star className="w-full h-full fill-current" />
              </button>
            );
          })}
        </div>

        {/* Rating Labels */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-2">
          <span>Kém</span>
          <span>Xuất sắc</span>
        </div>

        {/* Loading State */}
        {isRating && (
          <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
            Đang lưu đánh giá...
          </p>
        )}
      </div>

      {/* Authentication Prompt */}
      {!isAuthenticated && (
        <div className="bg-gray-50 dark:bg-black p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Đăng nhập để đánh giá bài viết này
          </p>
        </div>
      )}

      {/* Error Display */}
      {ratingError && (
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
          <p className="text-sm text-red-600 dark:text-red-400">
            Lỗi: {ratingError?.message || 'Có lỗi xảy ra'}
          </p>
        </div>
      )}
    </div>
  );
};
