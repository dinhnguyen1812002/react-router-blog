import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { formatDateSimple } from '~/lib/utils';
import { Avatar } from '~/components/ui/Avatar';
import { Heart, Eye, MessageCircle, Star, Bookmark, Clock, User } from 'lucide-react';
import { LikeButton } from './LikeButton';
import { RatingComponent } from './RatingComponent';
import { BookmarkButton } from './BookmarkButton';
import type { Post } from '~/types';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="group hover:shadow-xl dark:hover:shadow-gray-900/50 
    transition-all duration-300 overflow-hidden border-0 shadow-sm bg-white dark:bg-gray-800 w-full max-w-md">
      {/* Header with thumbnail */}
      <div className="relative overflow-hidden">
        {(post.thumbnail || post.thumbnailUrl) ? (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={post.thumbnail || post.thumbnailUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
            <div className="text-6xl text-blue-300 dark:text-blue-400">📝</div>
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {/* Category badge */}
          {post.categories && post.categories.length > 0 && (
            <span
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-white dark:text-gray-950 shadow-lg backdrop-blur-sm border border-white/20"
              style={{ backgroundColor: post.categories[0].backgroundColor || '#3B82F6' }}
            >
              {post.categories[0].category}
            </span>
          )}

          {/* Featured badge */}
          {post.featured && (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-100 shadow-lg">
              ⭐ Nổi bật
            </span>
          )}
        </div>

        {/* Quick actions overlay */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2">
            <BookmarkButton
              postId={post.id}
              initialBookmarked={post.isSavedByCurrentUser}
              variant="compact"
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Rating Component */}
        <div className="mb-3">
          <RatingComponent
            postId={post.id}
            initialUserRating={post.userRating}
            initialAverageRating={post.averageRating}
            compact={true}
            className="text-sm"
          />
        </div>

        {/* Title and Summary */}
        <div className="mb-4">
          <Link to={`/posts/${post.slug}`} className="block group mt-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3 leading-tight">
              {post.title}
            </h3>
          </Link>
          
          {/* Summary */}
          {post.content && (
            <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-sm leading-relaxed">
              {post.content}
            </p>
          )}
        </div>

        {/* Tags - Redesigned */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (       
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag.uuid}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 shadow-sm"
                >
                  <span className="mr-1">#</span>
                  {tag.name}
                </span>
              ))}
              {post.tags.length > 4 && (
                <span className="inline-flex items-center px-2 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                  +{post.tags.length - 4} tags
                </span>
              )}
            </div>
          </div>
        )}

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar
              src={post.user.avatar}
              fallback={post.user.username.charAt(0)}
              alt={post.user.username}
              size="sm"
              className="flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {post.user.username}
              </p>
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{formatDateSimple(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          {/* Stats */}
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{post.viewCount}</span>
            </div>

            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">{post.commentCount || 0}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span className="font-medium">{post.likeCount}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <LikeButton
              postId={post.id}
              initialLiked={post.isLikedByCurrentUser}
              initialLikeCount={post.likeCount}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};