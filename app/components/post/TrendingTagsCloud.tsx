import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { TrendingUp, Hash, Sparkles, RefreshCw } from 'lucide-react';
import { tagsApi } from '~/api/tags';
import type { Tag } from '~/types';

interface TrendingTagsCloudProps {
  maxTags?: number;
  className?: string;
  onTagClick?: (tag: Tag) => void;
  showTitle?: boolean;
  variant?: 'cloud' | 'list' | 'grid';
}

interface TagWithStats extends Tag {
  postCount?: number;
  trendingScore?: number;
  isHot?: boolean;
}

export default function TrendingTagsCloud({
  maxTags = 20,
  className = '',
  onTagClick,
  showTitle = true,
  variant = 'cloud',
}: TrendingTagsCloudProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch tags with trending data
  const { data: tags = [], isLoading, refetch } = useQuery<TagWithStats[]>({
    queryKey: ['tags', 'trending', refreshKey],
    queryFn: async () => {
      const allTags = await tagsApi.getAll();
      // Mock trending data - in real app, this would come from API
      return allTags.map((tag) => ({
        ...tag,
        postCount: Math.floor(Math.random() * 100) + 1,
        trendingScore: Math.random() * 100,
        isHot: Math.random() > 0.7,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate tag sizes and sort by trending score
  const processedTags = useMemo(() => {
    if (!tags.length) return [];

    const sortedTags = [...tags]
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      .slice(0, maxTags);

    const maxScore = Math.max(...sortedTags.map(tag => tag.trendingScore || 0));
    const minScore = Math.min(...sortedTags.map(tag => tag.trendingScore || 0));

    return sortedTags.map((tag) => {
      const normalizedScore = maxScore > minScore 
        ? (tag.trendingScore || 0 - minScore) / (maxScore - minScore)
        : 0.5;
      
      const size = Math.max(0.8, Math.min(2, 0.8 + normalizedScore * 1.2));
      
      return {
        ...tag,
        size,
        opacity: Math.max(0.6, 0.6 + normalizedScore * 0.4),
      };
    });
  }, [tags, maxTags]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const handleTagClick = (tag: TagWithStats) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <span>Trending Tags</span>
            </h3>
          </div>
        )}
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!processedTags.length) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <span>Trending Tags</span>
          </h3>
        )}
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Chưa có tags trending nào
        </p>
      </div>
    );
  }

  const renderCloudVariant = () => (
    <div className="flex flex-wrap gap-2 justify-center">
      {processedTags.map((tag) => (
        <button
          key={tag.uuid}
          onClick={() => handleTagClick(tag)}
          className="relative group transition-all duration-200 hover:scale-110"
          style={{
            fontSize: `${tag.size}rem`,
            opacity: tag.opacity,
          }}
        >
          <span
            className="px-3 py-1 rounded-full font-medium text-white hover:shadow-lg transition-all duration-200 relative overflow-hidden"
            style={{ backgroundColor: tag.color }}
          >
            {tag.isHot && (
              <Sparkles className="absolute top-0 right-0 h-3 w-3 text-yellow-300 animate-pulse" />
            )}
            #{tag.name}
          </span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            {tag.postCount} bài viết
            {tag.isHot && (
              <span className="ml-1 text-yellow-300">🔥</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );

  const renderListVariant = () => (
    <div className="space-y-2">
      {processedTags.map((tag, index) => (
        <button
          key={tag.uuid}
          onClick={() => handleTagClick(tag)}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-400 dark:text-gray-500 w-6">
              {index + 1}
            </span>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              #{tag.name}
            </span>
            {tag.isHot && (
              <Sparkles className="h-4 w-4 text-orange-500" />
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{tag.postCount} bài viết</span>
            <TrendingUp className="h-3 w-3" />
          </div>
        </button>
      ))}
    </div>
  );

  const renderGridVariant = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {processedTags.map((tag) => (
        <button
          key={tag.uuid}
          onClick={() => handleTagClick(tag)}
          className="relative p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group text-left"
        >
          <div className="flex items-center space-x-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
              #{tag.name}
            </span>
            {tag.isHot && (
              <Sparkles className="h-3 w-3 text-orange-500 flex-shrink-0" />
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {tag.postCount} bài viết
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className={`${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <span>Trending Tags</span>
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
      )}

      {variant === 'cloud' && renderCloudVariant()}
      {variant === 'list' && renderListVariant()}
      {variant === 'grid' && renderGridVariant()}

      {/* View All Link */}
      <div className="mt-4 text-center">
        <Link
          to="/tags"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          Xem tất cả tags →
        </Link>
      </div>
    </div>
  );
}
