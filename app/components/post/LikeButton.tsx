import { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { usePostActions } from '~/hooks/usePostActions';
import { useAuthStore } from '~/store/authStore';
import { Heart } from 'lucide-react';


interface LikeButtonProps {
  postId: string;
  initialLiked?: boolean;
  initialLikeCount?: number;
  className?: string;
}

export const LikeButton = ({ 
  postId, 
  initialLiked = false, 
  initialLikeCount = 0,
  className = ""
}: LikeButtonProps) => {
  const { isAuthenticated } = useAuthStore();
  const { handleLike, isLiking, likeData, likeError } = usePostActions(postId);
  
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // Update local state when API response comes back
  useEffect(() => {
    if (likeData) {
      setIsLiked(likeData.isLiked);
      setLikeCount(likeData.likeCount);
    }
  }, [likeData]);

  // Reset to initial values when props change
  useEffect(() => {
    setIsLiked(initialLiked);
    setLikeCount(initialLikeCount);
  }, [initialLiked, initialLikeCount]);

  const handleClick = () => {
    // Optimistic update
    if (isAuthenticated) {
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    }
    
    handleLike();
  };

  return (
      <button
          onClick={handleClick}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 ${
              isLiked
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          } ${className}`}
      >
        <Heart className={`w-4 h-4 ${ isLiked ? 'fill-current' : ''}`} />
        <span className="font-medium">{likeCount}</span>
      </button>
  );
};
