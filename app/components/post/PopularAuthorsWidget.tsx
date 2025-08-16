import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
  Users,
  Star,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Award,
  Crown,
  RefreshCw,
  UserPlus,
} from 'lucide-react';
import { userApi } from '~/api/user';
import type { User } from '~/types';

interface AuthorStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageRating: number;
  followersCount: number;
  isVerified: boolean;
  rank: number;
}

interface PopularAuthor extends User {
  stats: AuthorStats;
  isFollowing?: boolean;
  recentPosts?: Array<{
    id: number;
    title: string;
    slug: string;
    viewCount: number;
  }>;
}

interface PopularAuthorsWidgetProps {
  maxAuthors?: number;
  className?: string;
  showStats?: boolean;
  showFollowButton?: boolean;
  variant?: 'compact' | 'detailed';
}

export default function PopularAuthorsWidget({
  maxAuthors = 5,
  className = '',
  showStats = true,
  showFollowButton = true,
  variant = 'compact',
}: PopularAuthorsWidgetProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch popular authors
  const { data: authorsResponse, isLoading, refetch } = useQuery({
    queryKey: ['authors', 'popular', refreshKey],
    queryFn: async () => {
      const response = await userApi.getPopularUsers(maxAuthors);
      // Transform API response to PopularAuthor format
      const authors: PopularAuthor[] = response.data.map(user => ({
        ...user,
        stats: {
          totalPosts: user.stats?.totalPosts || 0,
          totalViews: Math.floor(Math.random() * 100000) + 10000, // Mock data
          totalLikes: Math.floor(Math.random() * 5000) + 500,
          totalComments: user.stats?.totalComments || 0,
          averageRating: 4.0 + Math.random() * 1.0,
          followersCount: Math.floor(Math.random() * 2000) + 100,
          isVerified: Math.random() > 0.5,
          rank: response.data.indexOf(user) + 1,
        },
        isFollowing: Math.random() > 0.7,
        recentPosts: [], // Would be fetched separately in real app
      }));

      return authors;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const authors = authorsResponse || [];

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const handleFollowToggle = (authorId: number) => {
    // Mock follow/unfollow - in real app, this would call API
    console.log('Toggle follow for author:', authorId);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Award className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-400">#{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span>Tác giả nổi bật</span>
          </h3>
        </div>
        <div className="space-y-3">
          {[...Array(maxAuthors)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-500" />
          <span>Tác giả nổi bật</span>
        </h3>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
          title="Làm mới"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Authors List */}
      <div className="space-y-4">
        {authors.map((author) => (
          <div
            key={author.id}
            className="group p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start space-x-3">
              {/* Rank & Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {author.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5">
                  {getRankIcon(author.stats.rank)}
                </div>
              </div>

              {/* Author Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Link
                    to={`/authors/${author.username}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                  >
                    {author.username}
                  </Link>
                  {author.stats.isVerified && (
                    <Star className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  )}
                </div>

                {variant === 'detailed' && author.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {author.bio}
                  </p>
                )}

                {/* Stats */}
                {showStats && (
                  <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(author.stats.totalViews)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{formatNumber(author.stats.totalLikes)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{author.stats.totalPosts}</span>
                    </div>
                  </div>
                )}

                {/* Recent Posts */}
                {variant === 'detailed' && author.recentPosts && (
                  <div className="space-y-1">
                    {author.recentPosts.slice(0, 2).map((post) => (
                      <Link
                        key={post.id}
                        to={`/posts/${post.slug}`}
                        className="block text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                      >
                        • {post.title}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Follow Button */}
                {showFollowButton && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleFollowToggle(author.id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        author.isFollowing
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                      }`}
                    >
                      <UserPlus className="h-3 w-3" />
                      <span>{author.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-4 text-center">
        <Link
          to="/authors"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          Xem tất cả tác giả →
        </Link>
      </div>
    </div>
  );
}
