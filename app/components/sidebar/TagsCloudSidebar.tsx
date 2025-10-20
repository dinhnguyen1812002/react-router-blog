import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { tagsApi } from "~/api/tags";
import { Hash, TrendingUp, Grid, List, Search } from "lucide-react";
import { Input } from "~/components/ui/input";

interface TagsCloudSidebarProps {
  maxTags?: number;
  variant?: 'cloud' | 'list' | 'grid';
  showSearch?: boolean;
  showCount?: boolean;
  onTagClick?: (tag: any) => void;
  selectedTags?: string[];
  className?: string;
}

export default function TagsCloudSidebar({
  maxTags = 30,
  variant = 'cloud',
  showSearch = true,
  showCount = true,
  onTagClick,
  selectedTags = [],
  className = "",
}: TagsCloudSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'cloud' | 'list' | 'grid'>(variant);

  const { data: tagsResponse, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.getTags(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  const allTags = tagsResponse?.data || [];

  // Filter and sort tags
  const filteredTags = allTags
    .filter(tag => 
      !searchTerm || 
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
    .slice(0, maxTags);

  // Calculate tag sizes for cloud view
  const getTagSize = (postCount: number) => {
    const maxCount = Math.max(...filteredTags.map(t => t.postCount || 0));
    const minCount = Math.min(...filteredTags.map(t => t.postCount || 0));
    const ratio = maxCount > minCount ? (postCount - minCount) / (maxCount - minCount) : 0.5;
    return 0.75 + (ratio * 0.5); // Scale between 0.75rem and 1.25rem
  };

  const handleTagClick = (tag: any) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Hash className="h-5 w-5 text-green-500" />
            <span>Popular Tags</span>
          </h2>
          <div className="animate-pulse">
            <div className="flex flex-wrap gap-2">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full"
                  style={{ width: `${60 + Math.random() * 40}px` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!filteredTags.length) {
    return (
      <div className={className}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Hash className="h-5 w-5 text-green-500" />
            <span>Popular Tags</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No tags found matching your search.' : 'No tags available.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Hash className="h-5 w-5 text-green-500" />
            <span>Popular Tags</span>
          </h2>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-black rounded-lg p-1">
            <button
              onClick={() => setViewMode('cloud')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'cloud'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Cloud view"
            >
              <TrendingUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Tags Display */}
        {viewMode === 'cloud' && (
          <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.uuid);
              return (
                <button
                  key={tag.uuid}
                  onClick={() => handleTagClick(tag)}
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 ring-2 ring-blue-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    fontSize: `${getTagSize(tag.postCount || 0)}rem`,
                    color: isSelected ? undefined : tag.color,
                    borderColor: tag.color,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                >
                  #{tag.name}
                  {showCount && tag.postCount && (
                    <span className="ml-1 text-xs opacity-75">
                      ({tag.postCount})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-2">
            {filteredTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.uuid);
              return (
                <button
                  key={tag.uuid}
                  onClick={() => handleTagClick(tag)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Hash className="h-4 w-4" style={{ color: tag.color }} />
                    <span>{tag.name}</span>
                  </span>
                  {showCount && tag.postCount && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {tag.postCount} posts
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 gap-2">
            {filteredTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.uuid);
              return (
                <button
                  key={tag.uuid}
                  onClick={() => handleTagClick(tag)}
                  className={`flex flex-col items-center p-3 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Hash className="h-5 w-5 mb-1" style={{ color: tag.color }} />
                  <span className="font-medium truncate w-full text-center">
                    {tag.name}
                  </span>
                  {showCount && tag.postCount && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {tag.postCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* View All Link */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link 
            to="/tags"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View all tags →
          </Link>
        </div>
      </div>
    </div>
  );
}
