import { Link } from 'react-router';
import { Card, CardContent } from '~/components/ui/Card';
import { formatDateSimple } from '~/lib/utils';
import { Avatar } from '~/components/ui/Avatar';
import { Heart, Eye, MessageCircle, Star } from 'lucide-react';
import { LikeButton } from './LikeButton';
import { BookmarkButton } from './BookmarkButton';
import type { Post } from '~/types';

interface PostCardCompactProps {
  post: Post;
  variant?: 'horizontal' | 'minimal';
}

export const PostCardCompact = ({ post, variant = 'horizontal' }: PostCardCompactProps) => {
  if (variant === 'minimal') {
    return (
      <Card className="group hover:shadow-md transition-all duration-200 overflow-hidden bg-white dark:bg-gray-800">
        <CardContent className="p-3">
          <div className="flex items-start space-x-3">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              {(post.thumbnail || post.thumbnailUrl) ? (
                <img
                  src={post.thumbnail || post.thumbnailUrl}
                  alt={post.title}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📝</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <Link to={`/posts/${post.slug}`} className="block group">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                  {post.title}
                </h3>
              </Link>

              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <Avatar
                  src={post.user.avatar}
                  fallback={post.user.username.charAt(0)}
                  alt={post.user.username}
                  size="sm"
                  className="w-5 h-5"
                />
                <span className="truncate">{post.user.username}</span>
                <span>•</span>
                <span>{formatDateSimple(post.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.viewCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{post.likeCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{post.commentCount || 0}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <BookmarkButton
                    postId={post.id}
                    initialBookmarked={post.isSavedByCurrentUser}
                    variant="compact"
                    className="text-xs"
                  />
                  <LikeButton
                    postId={post.id}
                    initialLiked={post.isLikedByCurrentUser}
                    initialLikeCount={post.likeCount}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Horizontal variant (default)
  return (
    <Card className="group hover:shadow-md transition-all duration-200 overflow-hidden bg-white dark:bg-gray-800">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            {(post.thumbnail || post.thumbnailUrl) ? (
              <img
                src={post.thumbnail || post.thumbnailUrl}
                alt={post.title}
                className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <Link to={`/posts/${post.slug}`} className="block group flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                  {post.title}
                </h3>
              </Link>
              
              {post.categories && post.categories.length > 0 && (
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white ml-2 flex-shrink-0"
                  style={{ backgroundColor: post.categories[0].backgroundColor || '#3B82F6' }}
                >
                  {post.categories[0].category}
                </span>
              )}
            </div>

            {post.content && (
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm mb-3">
                {post.content}
              </p>
            )}

            {/* Tags */}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.uuid}
                    className="px-2 py-1 rounded text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  >
                    #{tag.name}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Avatar
                  src={post.user.avatar}
                  fallback={post.user.username.charAt(0)}
                  alt={post.user.username}
                  size="sm"
                />
                <span className="font-medium">{post.user.username}</span>
                <span>•</span>
                <span>{formatDateSimple(post.createdAt)}</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.viewCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{post.likeCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{post.commentCount || 0}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <BookmarkButton
                    postId={post.id}
                    initialBookmarked={post.isSavedByCurrentUser}
                    variant="compact"
                  />
                  <LikeButton
                    postId={post.id}
                    initialLiked={post.isLikedByCurrentUser}
                    initialLikeCount={post.likeCount}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
