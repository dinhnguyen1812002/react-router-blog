import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { formatDateSimple } from '~/lib/utils';
import { Avatar } from '~/components/ui/Avatar';
import { Heart, Eye, MessageCircle, Star } from 'lucide-react';
import { LikeButton } from './LikeButton';
import { RatingComponent } from './RatingComponent';
import { BookmarkButton } from './BookmarkButton';
import type { Post } from '~/types';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="group hover:shadow-lg dark:hover:shadow-gray-900/40 transition-all duration-300 overflow-hidden border-0 shadow-sm">
      {/* Thumbnail with overlay */}
      <div className="relative overflow-hidden">
        {(post.thumbnail || post.thumbnailUrl) ? (
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={post.thumbnail || post.thumbnailUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="aspect-[16/10] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
            <div className="text-4xl text-blue-300 dark:text-blue-400">📝</div>
          </div>
        )}

        {/* Featured badge */}
        {post.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
              ⭐ Nổi bật
            </span>
          </div>
        )}

        {/* Category badge */}
        {post.categories && post.categories.length > 0 && (
          <div className="absolute top-3 left-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm backdrop-blur-sm"
              style={{ backgroundColor: post.categories[0].backgroundColor || '#3B82F6' }}
            >
              {post.categories[0].category}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Title */}
        <Link to={`/posts/${post.slug}`} className="block group">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3 leading-tight">
            {post.title}
          </h3>
        </Link>

        {/* Summary */}
        {post.summary && (
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm mb-4 leading-relaxed">
            {post.summary}
          </p>
        )}
      
        {/* Tags */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.uuid}
                className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                #{tag.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar
              fallback={post.user.username.charAt(0)}
              alt={post.user.username}
              size="sm"
              className="flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {post.user.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDateSimple(post.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          {/* Left side - Like and Rating */}
          <div className="flex items-center space-x-3">
            <LikeButton
              postId={post.id}
              initialLiked={post.isLikedByCurrentUser}
              initialLikeCount={post.likeCount}
              className="text-sm"
            />

            <RatingComponent
              postId={post.id}
              initialUserRating={post.userRating}
              initialAverageRating={post.averageRating}
              compact={true}
              className="text-sm"
            />

            <BookmarkButton
              postId={post.id}
              initialBookmarked={post.isBookmarkedByCurrentUser}
              variant="compact"
            />
          </div>

          {/* Right side - Stats */}
          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.viewCount}</span>
            </div>

            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/*</CardContent>*/}
    </Card>
  );
};