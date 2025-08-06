import { Eye, MessageSquare, Heart, ThumbsUp, Share2 } from 'lucide-react';
import { LikeButton } from './LikeButton';
import { RatingComponent } from './RatingComponent';
import type { Post } from '~/types';

interface PostActionsProps {
  post: Post;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export const PostActions = ({ 
  post, 
  className = "",
  layout = 'horizontal'
}: PostActionsProps) => {
  const containerClass = layout === 'horizontal' 
    ? 'flex items-center justify-between gap-4'
    : 'flex flex-col items-start gap-3';

  return (
    <div className={`${containerClass} ${className}`}>
      {/* Main Actions */}
      <div className="flex items-center gap-3">
        <LikeButton
          postId={post.id}
          initialLiked={post.isLikedByCurrentUser}
          initialLikeCount={post.likeCount}
        />

        <RatingComponent
          postId={post.id}
          initialUserRating={post.userRating}
          initialAverageRating={post.averageRating}
          showAverage={true}
          compact={true}
        />
      </div>
     
      {/* Stats & Share */}
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{post.viewCount || 0}</span>
        </div>
        
        {post.commentCount !== null && (
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentCount}</span>
          </div>
        )}

        <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Chia sẻ</span>
        </button>
      </div>
    </div>
  );
};
