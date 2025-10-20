import { useState } from 'react';
import { Link } from 'react-router';
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  Clock, 
  Calendar, 
  Bookmark, 
  Share2, 
  User,
  Star,
  TrendingUp,
  FileText
} from 'lucide-react';
import { formatDate } from '~/lib/utils';
import type { Post } from '~/types';

interface EnhancedPostCardProps {
  post: Post;
  variant?: 'default' | 'compact' | 'featured' | 'list';
  showAuthor?: boolean;
  showStats?: boolean;
  showExcerpt?: boolean;
  showThumbnail?: boolean;
  showBookmark?: boolean;
  showShare?: boolean;
  className?: string;
}

export default function EnhancedPostCard({
  post,
  variant = 'default',
  showAuthor = true,
  showStats = true,
  showExcerpt = true,
  showThumbnail = true,
  showBookmark = true,
  showShare = true,
  className = '',
}: EnhancedPostCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary || post.title,
        url: `/posts/${post.slug}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/posts/${post.slug}`);
    }
  };

  // List variant
  if (variant === 'list') {
    return (
      <article className={`group bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 ${className}`}>
        <div className="p-4">
          <div className="flex space-x-4">
            {/* Thumbnail */}
            {showThumbnail && (
              <Link to={`/posts/${post.slug}`} className="flex-shrink-0">
                <div className="w-24 h-24 rounded-lg overflow-hidden">
                  {post.thumbnail || post.thumbnailUrl ? (
                    <img
                      src={post.thumbnail || post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-white opacity-50" />
                    </div>
                  )}
                </div>
              </Link>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {post.categories.slice(0, 2).map((category) => (
                    <span
                      key={category.id}
                      className="px-2 py-0.5 text-xs font-medium text-white rounded-full"
                      style={{ backgroundColor: category.backgroundColor || '#3B82F6' }}
                    >
                      {category.category}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <Link to={`/posts/${post.slug}`}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
              </Link>

              {/* Excerpt */}
              {showExcerpt && post.summary && (
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                  {post.summary}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{calculateReadingTime(post.content)} phút</span>
                  </div>
                  {showStats && (
                    <>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.viewCount || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{post.likeCount || 0}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1">
                  {showBookmark && (
                    <button
                      onClick={handleBookmark}
                      className={`p-1.5 rounded-full transition-colors ${
                        isBookmarked
                          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                          : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                      }`}
                    >
                      <Bookmark className="h-3 w-3" />
                    </button>
                  )}
                  {showShare && (
                    <button
                      onClick={handleShare}
                      className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Share2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <article className={`group bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 ${className}`}>
        <div className="p-3">
          <Link to={`/posts/${post.slug}`}>
            <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
              {post.title}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{formatDate(post.createdAt)}</span>
            {showStats && (
              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{post.viewCount || 0}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>{post.likeCount || 0}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <article className={`group bg-white dark:bg-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}>
        {/* Thumbnail */}
        {showThumbnail && (
          <Link to={`/posts/${post.slug}`} className="block relative">
            <div className="aspect-video relative overflow-hidden">
              {post.thumbnail || post.thumbnailUrl ? (
                <img
                  src={post.thumbnail || post.thumbnailUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-white opacity-50" />
                </div>
              )}
              
              {/* Featured badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>Nổi bật</span>
                </span>
              </div>

              {/* Quick actions */}
              <div className="absolute top-3 right-3 flex space-x-1">
                {showBookmark && (
                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      isBookmarked
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Bookmark className="h-3 w-3" />
                  </button>
                )}
                {showShare && (
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-colors"
                  >
                    <Share2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </Link>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.slice(0, 2).map((category) => (
                <span
                  key={category.id}
                  className="px-2 py-1 text-xs font-medium text-white rounded-full"
                  style={{ backgroundColor: category.backgroundColor || '#3B82F6' }}
                >
                  {category.category}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <Link to={`/posts/${post.slug}`}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          {showExcerpt && post.summary && (
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
              {post.summary}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{calculateReadingTime(post.content)} phút</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          {showStats && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.viewCount || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likeCount || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.commentCount || 0}</span>
                </div>
              </div>

              {/* Author */}
              {showAuthor && (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {post.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {post.user.username}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    );
  }

  // Default variant (card)
  return (
    <article className={`group bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all duration-200 overflow-hidden ${className}`}>
      {/* Thumbnail */}
      {showThumbnail && (
        <Link to={`/posts/${post.slug}`} className="block relative">
          <div className="aspect-video relative overflow-hidden">
            {post.thumbnail || post.thumbnailUrl ? (
              <img
                src={post.thumbnail || post.thumbnailUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FileText className="h-12 w-12 text-white opacity-50" />
              </div>
            )}

            {/* Quick actions overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
              <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {showBookmark && (
                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      isBookmarked
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Bookmark className="h-3 w-3" />
                  </button>
                )}
                {showShare && (
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-colors"
                  >
                    <Share2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="px-2 py-1 text-xs font-medium text-white rounded-full"
                style={{ backgroundColor: category.backgroundColor || '#3B82F6' }}
              >
                {category.category}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link to={`/posts/${post.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {showExcerpt && post.summary && (
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
            {post.summary}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{calculateReadingTime(post.content)} phút</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Author */}
          {showAuthor && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {post.user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {post.user.username}
              </span>
            </div>
          )}

          {/* Stats */}
          {showStats && (
            <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{post.viewCount || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{post.likeCount || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{post.commentCount || 0}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
