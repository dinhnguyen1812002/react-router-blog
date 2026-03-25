/**
 * Unified Post Card Component - Component thống nhất cho hiển thị bài viết
 * Hỗ trợ nhiều variants: default, compact, list, featured
 * Minimalist design với consistent UI
 */

import { memo, useMemo } from 'react';
import { Link } from 'react-router';
import { Clock, Eye, Heart, MessageCircle, Star, Calendar } from 'lucide-react';
import type { Post } from '~/types';
import { LikeButton } from './LikeButton';
import { BookmarkButton } from './BookmarkButton';
import { RatingComponent } from './RatingComponent';
import { resolveAvatarUrl } from '~/utils/image';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface UnifiedPostCardProps {
  post: Post;
  variant?: 'default' | 'compact' | 'list' | 'featured' | 'minimal';
  showActions?: boolean;
  showStats?: boolean;
  onDelete?: (id: string, title: string) => void;
}

// Utility functions
const formatDate = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: vi,
    });
  } catch {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content?.split(/\s+/).length || 0;
  return Math.ceil(wordCount / wordsPerMinute) || 5;
};

// Minimal variant - Cho sidebar
const MinimalCard = memo(({ post }: { post: Post }) => (
  <Link
    to={`/articles/${post.slug}`}
    className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all"
  >
    {post.thumbnail && (
      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden">
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
        {post.title}
      </h4>
      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {formatNumber(post.viewCount)}
        </span>
      </div>
    </div>
  </Link>
));

// Compact variant - Cho grid nhỏ
const CompactCard = memo(({ post }: { post: Post }) => (
  <article className="group bg-card rounded-xl border border-border hover:shadow-lg hover:border-border/80 transition-all duration-300">
    <Link to={`/articles/${post.slug}`}>
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={post.thumbnail || '/placeholder.svg'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {post.categories?.[0] && (
          <span
            className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: post.categories[0].backgroundColor || '#e5e7eb',
              color: '#374151',
            }}
          >
            {post.categories[0].category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-base text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {formatNumber(post.viewCount)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {formatNumber(post.likeCount)}
          </span>
        </div>
      </div>
    </Link>
  </article>
));

// List variant - Cho danh sách dọc (Medium style)
const ListCard = memo(({ post, showActions }: { post: Post; showActions?: boolean }) => (
  <article className="group bg-card rounded-xl border border-border hover:shadow-xl hover:border-border/80 transition-all duration-300">
    <Link to={`/articles/${post.slug}`}>
      <div className="flex flex-col sm:flex-row gap-4 p-6">
        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="sm:w-48 sm:h-32 w-full h-48 shrink-0 overflow-hidden rounded-lg">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.slice(0, 2).map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: category.backgroundColor || '#e5e7eb',
                    color: '#374151',
                  }}
                >
                  {category.category}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {/* Author */}
            <div className="flex items-center gap-2">
              <img
                src={resolveAvatarUrl(post.user.avatar)}
                alt={post.user.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium text-foreground">{post.user.username}</span>
            </div>

            {/* Date */}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.createdAt)}
            </span>

            {/* Reading Time */}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.content ? calculateReadingTime(post.content) : 0} phút đọc
            </span>

            {/* Views */}
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(post.viewCount)}
            </span>

            {/* Likes */}
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {formatNumber(post.likeCount)}
            </span>

            {/* Comments */}
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {formatNumber(post.commentCount || 0)}
            </span>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <BookmarkButton
                postId={post.id}
                initialBookmarked={post.isSavedByCurrentUser}
                variant="compact"
              />
              <LikeButton
                postId={post.id}
                initialLiked={post.isLikedByCurrentUser}
                initialLikeCount={post.likeCount}
                variant="minimal"
              />
              <RatingComponent
                postId={post.id}
                initialUserRating={post.userRating}
                initialAverageRating={post.averageRating}
                compact
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  </article>
));

// Featured variant - Cho bài viết nổi bật
const FeaturedCard = memo(({ post }: { post: Post }) => (
  <article className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-2xl transition-all duration-500">
    <Link to={`/articles/${post.slug}`}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={post.thumbnail || '/placeholder.svg'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            {post.categories?.[0] && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/20">
                {post.categories[0].category}
              </span>
            )}
            {post.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="font-bold text-2xl md:text-3xl text-white mb-2 line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-white/80 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
          )}

          {/* Author & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={resolveAvatarUrl(post.user.avatar)}
                alt={post.user.username}
                className="w-10 h-10 rounded-full border-2 border-white/20"
              />
              <div>
                <p className="text-white font-medium text-sm">{post.user.username}</p>
                <p className="text-white/60 text-xs">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatNumber(post.viewCount)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {formatNumber(post.likeCount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
    <BookmarkButton
      postId={post.id}
      initialBookmarked={post.isSavedByCurrentUser}
      variant="default"
    />
  </article>
));

// Default variant - Card chuẩn cho grid
const DefaultCard = memo(({ post, showActions }: { post: Post; showActions?: boolean }) => {
  const categoryStyle = useMemo(() => {
    const color = post.categories?.[0]?.backgroundColor || 'hsl(var(--primary))';
    return {
      backgroundColor: `${color}20`,
      color,
      border: `1px solid ${color}40`,
    };
  }, [post.categories]);

  return (
    <article className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-xl hover:border-border/80 transition-all duration-300">
      <Link to={`/articles/${post.slug}`}>
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.thumbnail || '/placeholder.svg'}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {post.categories?.[0] && (
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md"
                style={categoryStyle}
              >
                {post.categories[0].category}
              </span>
            )}
            {post.featured && (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-accent/90 text-accent-foreground backdrop-blur-md flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-current" />
                Featured
              </span>
            )}
          </div>

          {/* Reading Time */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.content ? calculateReadingTime(post.content) : 0} phút
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
              {post.excerpt}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            {/* Author */}
            <div className="flex items-center gap-3">
              <img
                src={resolveAvatarUrl(post.user.avatar)}
                alt={post.user.username}
                className="w-9 h-9 rounded-full"
              />
              <div>
                <p className="text-foreground font-medium text-sm">{post.user.username}</p>
                <p className="text-muted-foreground text-xs">{formatDate(post.createdAt)}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {formatNumber(post.viewCount)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {formatNumber(post.likeCount)}
              </span>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <BookmarkButton
                postId={post.id}
                initialBookmarked={post.isSavedByCurrentUser}
                variant="compact"
              />
              <LikeButton
                postId={post.id}
                initialLiked={post.isLikedByCurrentUser}
                initialLikeCount={post.likeCount}
                variant="minimal"
              />
              <RatingComponent
                postId={post.id}
                initialUserRating={post.userRating}
                initialAverageRating={post.averageRating}
                compact
              />
            </div>
          )}
        </div>
      </Link>
    </article>
  );
});

// Main component với variant switching
export const UnifiedPostCard = memo(function UnifiedPostCard({
  post,
  variant = 'default',
  showActions = false,
  showStats = true,
}: UnifiedPostCardProps) {
  switch (variant) {
    case 'minimal':
      return <MinimalCard post={post} />;
    case 'compact':
      return <CompactCard post={post} />;
    case 'list':
      return <ListCard post={post} showActions={showActions} />;
    case 'featured':
      return <FeaturedCard post={post} />;
    default:
      return <DefaultCard post={post} showActions={showActions} />;
  }
});
