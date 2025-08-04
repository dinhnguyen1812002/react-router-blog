import { Heart, Eye, MessageCircle, Star, Bookmark } from 'lucide-react';
import type { Post } from '~/types';

interface PostStatsProps {
  post: Post;
  size?: 'sm' | 'md' | 'lg';
  showBookmark?: boolean;
  onLike?: () => void;
  onBookmark?: () => void;
}

export const PostStats = ({ 
  post, 
  size = 'sm', 
  showBookmark = false,
  onLike,
  onBookmark 
}: PostStatsProps) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSize = iconSizes[size];
  const textSize = textSizes[size];

  return (
    <div className={`flex items-center justify-between ${textSize} text-gray-500`}>
      <div className="flex items-center space-x-3">
        {/* Like */}
        <button
          onClick={onLike}
          className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
            post.isLikedByCurrentUser ? 'text-red-500' : ''
          }`}
          disabled={!onLike}
        >
          <Heart 
            className={`${iconSize} ${post.isLikedByCurrentUser ? 'fill-current' : ''}`} 
          />
          <span>{post.likeCount}</span>
        </button>
        
        {/* Views */}
        <div className="flex items-center space-x-1">
          <Eye className={iconSize} />
          <span>{post.viewCount}</span>
        </div>
        
        {/* Comments */}
        <div className="flex items-center space-x-1">
          <MessageCircle className={iconSize} />
          <span>{post.commentCount}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Rating */}
        {post.averageRating > 0 && (
          <div className="flex items-center space-x-1">
            <Star className={`${iconSize} text-yellow-500 fill-current`} />
            <span className="font-medium">{post.averageRating.toFixed(1)}</span>
          </div>
        )}

        {/* Bookmark */}
        {showBookmark && (
          <button
            onClick={onBookmark}
            className={`flex items-center space-x-1 hover:text-blue-500 transition-colors ${
              post.isSavedByCurrentUser ? 'text-blue-500' : ''
            }`}
            disabled={!onBookmark}
          >
            <Bookmark 
              className={`${iconSize} ${post.isSavedByCurrentUser ? 'fill-current' : ''}`} 
            />
          </button>
        )}
      </div>
    </div>
  );
};
