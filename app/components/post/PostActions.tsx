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
    ? 'flex items-center justify-between space-x-6'
    : 'space-y-4';

  return (
    <div className={`${containerClass} ${className}`}>
      {/* Like Button */}
      <LikeButton
        postId={post.id}
        initialLiked={post.isLikedByCurrentUser}
        initialLikeCount={post.likeCount}
      />

      {/* Rating Component */}
      <RatingComponent
        postId={post.id}
        initialUserRating={post.userRating}
        initialAverageRating={post.averageRating}
        showAverage={true}
        compact={false}
      />

      {/* Additional Stats */}
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <span className="flex items-center space-x-1">
          <span>👁️</span>
          <span>{post.viewCount} lượt xem</span>
        </span>
        
        {post.commentCount !== null && (
          <span className="flex items-center space-x-1">
            <span>💬</span>
            <span>{post.commentCount} bình luận</span>
          </span>
        )}
      </div>
    </div>
  );
};
