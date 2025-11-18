import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Star,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  FileText,
} from 'lucide-react';
import { postsApi } from '~/api/posts';
import { formatDateSimple } from '~/lib/utils';


interface FeaturedPostsSectionProps {
  className?: string;
  autoSlide?: boolean;
  slideInterval?: number;
}

export default function FeaturedPostsSection({
  className = '',
  autoSlide = true,
  slideInterval = 5000,
}: FeaturedPostsSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured posts
  const { data: featuredPostsResponse, isLoading } = useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => postsApi.getFeaturedPosts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const featuredPosts = featuredPostsResponse?.data || [];

  // Auto slide functionality
  useEffect(() => {
    if (!autoSlide || featuredPosts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, featuredPosts.length]);

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Navigation handlers
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96 animate-pulse" />
      </div>
    );
  }

  if (!featuredPosts.length) {
    return null;
  }

  const currentPost = featuredPosts[currentSlide];

  return (
    <section className={`relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Star className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bài viết nổi bật
          </h2>
        </div>
        
        {featuredPosts.length > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-white dark:bg-black shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white dark:bg-black shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* Main Featured Post */}
      <div className="relative bg-white dark:bg-black rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 lg:h-96">
            {currentPost.thumbnail || currentPost.thumbnailUrl ? (
              <img
                src={currentPost.thumbnail || currentPost.thumbnailUrl}
                alt={currentPost.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium opacity-75">Không có hình ảnh</p>
                </div>
              </div>
            )}
            
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
            
            {/* Featured Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Star className="h-3 w-3" />
                <span>Nổi bật</span>
              </span>
            </div>

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="p-2 bg-white/90 dark:bg-black/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors">
                <Bookmark className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 bg-white/90 dark:bg-black/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors">
                <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8 flex flex-col justify-center">
            {/* Categories */}
            {currentPost.categories && currentPost.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentPost.categories.slice(0, 2).map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: category.backgroundColor || '#3B82F6' }}
                  >
                    {category.category}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <Link to={`/posts/${currentPost.slug}`}>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                {currentPost.title}
              </h3>
            </Link>

            {/* Summary */}
            {currentPost.summary && (
              <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 text-lg leading-relaxed">
                {currentPost.summary}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDateSimple(currentPost.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{calculateReadingTime(currentPost.content)} phút đọc</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{currentPost.viewCount || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{currentPost.likeCount || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{currentPost.commentCount || 0}</span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {currentPost.user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentPost.user.username}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tác giả
                  </p>
                </div>
              </div>

              <Link
                to={`/posts/${currentPost.slug}`}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Đọc tiếp
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        {featuredPosts.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {featuredPosts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Secondary Featured Posts */}
      {featuredPosts.length > 1 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredPosts
            .filter((_, index) => index !== currentSlide)
            .slice(0, 3)
            .map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.slug}`}
                className="group bg-white dark:bg-black rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="aspect-video relative">
                  {post.thumbnail || post.thumbnailUrl ? (
                    <img
                      src={post.thumbnail || post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatDateSimple(post.createdAt)}</span>
                    <span>•</span>
                    <span>{calculateReadingTime(post.content)} phút</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </section>
  );
}
