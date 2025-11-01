import { useState, useEffect } from 'react';
import { usePostActions } from '~/hooks/usePostActions';
import { useAuthStore } from '~/store/authStore';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  postId: string;
  initialLiked?: boolean;
  initialLikeCount?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LikeButton = ({ 
  postId, 
  initialLiked = false, 
  initialLikeCount = 0,
  className = "",
  variant = 'default',
  showCount = true,
  size = 'md'
}: LikeButtonProps) => {
  const { isAuthenticated } = useAuthStore();
  const { handleLike, isLiking, likeData, likeError } = usePostActions(postId);
  
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // You can add a toast notification here
      return;
    }
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    
    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    handleLike();
  };

  // Size configurations
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs gap-1',
      icon: 'w-3.5 h-3.5',
    },
    md: {
      container: 'px-3 py-1.5 text-sm gap-1.5',
      icon: 'w-4 h-4',
    },
    lg: {
      container: 'px-4 py-2 text-base gap-2',
      icon: 'w-5 h-5',
    },
  };

  // Variant styles
  const variantStyles = {
    default: isLiked
      ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 shadow-sm'
      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm',
    
    compact: isLiked
      ? 'bg-red-500 text-white'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
    
    minimal: isLiked
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantStyles[variant];

  return (
    <button
      onClick={handleClick}
      disabled={isLiking}
      className={`
        group relative inline-flex items-center justify-center
        ${currentSize.container}
        ${currentVariant}
        ${variant !== 'minimal' ? 'rounded-full' : 'rounded-lg'}
        font-medium
        transition-all duration-200
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isLiking ? 'pointer-events-none' : ''}
        ${className}
      `}
      aria-label={isLiked ? 'Unlike' : 'Like'}
      aria-pressed={isLiked}
    >
      {/* Heart Icon with Animation */}
      <div className="relative">
        <Heart 
          className={`
            ${currentSize.icon}
            transition-all duration-200
            ${isLiked ? 'fill-current' : 'group-hover:scale-110'}
            ${isAnimating ? 'animate-bounce' : ''}
          `}
        />
        
        {/* Pulse effect on like */}
        {isAnimating && isLiked && (
          <span className="absolute inset-0 -z-10">
            <Heart 
              className={`
                ${currentSize.icon}
                fill-current text-red-400 dark:text-red-500
                animate-ping
              `}
            />
          </span>
        )}
      </div>

      {/* Like Count */}
      {showCount && (
        <span 
          className={`
            tabular-nums
            transition-all duration-200
            ${isAnimating ? 'scale-110' : ''}
          `}
        >
          {likeCount.toLocaleString()}
        </span>
      )}

      {/* Tooltip for unauthenticated users */}
      {!isAuthenticated && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Đăng nhập để thích
        </span>
      )}

      {/* Loading spinner */}
      {isLiking && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-full">
          <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
};

// Variants for different use cases
export const LikeButtonCompact = (props: Omit<LikeButtonProps, 'variant' | 'size'>) => (
  <LikeButton {...props} variant="compact" size="sm" />
);

export const LikeButtonMinimal = (props: Omit<LikeButtonProps, 'variant'>) => (
  <LikeButton {...props} variant="minimal" showCount={false} />
);

export const LikeButtonLarge = (props: Omit<LikeButtonProps, 'size'>) => (
  <LikeButton {...props} size="lg" />
);