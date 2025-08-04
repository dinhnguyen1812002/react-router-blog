import { useState, useEffect } from 'react';
import { usePostActions } from '~/hooks/usePostActions';
import { useAuthStore } from '~/store/authStore';
import { Button } from '~/components/ui/button';

interface RatingComponentProps {
  postId: string;
  initialUserRating?: number | null;
  initialAverageRating?: number;
  className?: string;
  showAverage?: boolean;
  compact?: boolean; // For card display
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
  const [showRatingButtons, setShowRatingButtons] = useState(false);

  // Update local state when API response comes back
  useEffect(() => {
    if (ratingData) {
      setUserRating(ratingData.userRating);
      setAverageRating(ratingData.averageRating);
      setShowRatingButtons(false); // Hide buttons after rating
    }
  }, [ratingData]);

  // Reset to initial values when props change
  useEffect(() => {
    setUserRating(initialUserRating);
    setAverageRating(initialAverageRating);
  }, [initialUserRating, initialAverageRating]);

  const handleRatingClick = (rating: number) => {
    if (!isAuthenticated) {
      return; // usePostActions will handle redirect
    }

    // Optimistic update
    setUserRating(rating);
    handleRate(rating);
  };

  const toggleRatingButtons = () => {
    if (!isAuthenticated) {
      handleRate(1); // This will trigger redirect
      return;
    }
    setShowRatingButtons(!showRatingButtons);
  };

  // Compact version for cards
  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleRatingButtons}
          disabled={isRating}
          className="flex items-center space-x-1 px-2 py-1 h-auto text-xs"
        >
          <span className="text-blue-600 dark:text-blue-400">📊</span>
          <span>
            {averageRating > 0 ? averageRating.toFixed(1) : 'Đánh giá'}
          </span>
        </Button>

        {/* Quick rating buttons */}
        {showRatingButtons && (
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={userRating === rating ? "default" : "outline"}
                size="sm"
                onClick={() => handleRatingClick(rating)}
                disabled={isRating}
                className="w-6 h-6 p-0 text-xs"
              >
                {rating}
              </Button>
            ))}
          </div>
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
      {/* Current Rating Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Điểm trung bình</div>
          </div>

          {userRating && (
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {userRating}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Điểm của bạn</div>
            </div>
          )}
        </div>

        {!userRating && isAuthenticated && (
          <Button
            onClick={() => setShowRatingButtons(true)}
            variant="outline"
            size="sm"
          >
            Đánh giá bài viết
          </Button>
        )}
      </div>

      {/* Rating Buttons */}
      {showRatingButtons && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Chọn điểm từ 1-5:
          </p>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={userRating === rating ? "default" : "outline"}
                onClick={() => handleRatingClick(rating)}
                disabled={isRating}
                className="flex-1 sm:flex-none sm:w-12"
              >
                {rating}
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Kém</span>
            <span>Xuất sắc</span>
          </div>

          {isRating && (
            <p className="text-sm text-blue-600 dark:text-blue-400">Đang lưu đánh giá...</p>
          )}
        </div>
      )}

      {/* Authentication prompt */}
      {!isAuthenticated && (
        <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
          Đăng nhập để đánh giá bài viết này
        </p>
      )}

      {/* Error display */}
      {ratingError && (
        <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded">
          Lỗi: {ratingError.message}
        </p>
      )}
    </div>
  );
};
