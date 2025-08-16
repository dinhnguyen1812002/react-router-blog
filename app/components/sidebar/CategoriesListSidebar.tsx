import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { categoriesApi } from "~/api/categories";
import { Folder, Search, BarChart3, Grid, List } from "lucide-react";
import { Input } from "~/components/ui/input";

interface CategoriesListSidebarProps {
  maxCategories?: number;
  variant?: 'list' | 'grid' | 'compact';
  showSearch?: boolean;
  showCount?: boolean;
  showProgress?: boolean;
  onCategoryClick?: (category: any) => void;
  selectedCategories?: number[];
  className?: string;
}

export default function CategoriesListSidebar({
  maxCategories = 20,
  variant = 'list',
  showSearch = true,
  showCount = true,
  showProgress = false,
  onCategoryClick,
  selectedCategories = [],
  className = "",
}: CategoriesListSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'compact'>(variant);

  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  const allCategories = categoriesResponse?.data || [];

  // Filter and sort categories
  const filteredCategories = allCategories
    .filter(category => 
      !searchTerm || 
      category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
    .slice(0, maxCategories);

  // Calculate progress bar width for categories
  const getProgressWidth = (postCount: number) => {
    const maxCount = Math.max(...filteredCategories.map(c => c.postCount || 0));
    return maxCount > 0 ? (postCount / maxCount) * 100 : 0;
  };

  const handleCategoryClick = (category: any) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Folder className="h-5 w-5 text-purple-500" />
            <span>Categories</span>
          </h2>
          <div className="animate-pulse space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!filteredCategories.length) {
    return (
      <div className={className}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Folder className="h-5 w-5 text-purple-500" />
            <span>Categories</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No categories found matching your search.' : 'No categories available.'}
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
            <Folder className="h-5 w-5 text-purple-500" />
            <span>Categories</span>
          </h2>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
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
            <button
              onClick={() => setViewMode('compact')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'compact'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Compact view"
            >
              <BarChart3 className="h-4 w-4" />
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
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Categories Display */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {filteredCategories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div
                      className="w-4 h-4 rounded flex-shrink-0"
                      style={{ backgroundColor: category.backgroundColor || '#6B7280' }}
                    ></div>
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {category.category}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {category.description}
                        </p>
                      )}
                      {showProgress && category.postCount && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                            <div
                              className="h-1 rounded-full"
                              style={{
                                backgroundColor: category.backgroundColor || '#6B7280',
                                width: `${getProgressWidth(category.postCount)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {showCount && category.postCount && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                      {category.postCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 gap-3">
            {filteredCategories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center"
                    style={{ backgroundColor: category.backgroundColor || '#6B7280' }}
                  >
                    <Folder className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white text-center truncate w-full">
                    {category.category}
                  </h3>
                  {showCount && category.postCount && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {category.postCount} posts
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {viewMode === 'compact' && (
          <div className="space-y-1">
            {filteredCategories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded transition-colors ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded flex-shrink-0"
                      style={{ backgroundColor: category.backgroundColor || '#6B7280' }}
                    ></div>
                    <span className="text-sm text-gray-900 dark:text-white truncate">
                      {category.category}
                    </span>
                  </div>
                  {showCount && category.postCount && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                      {category.postCount}
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
            to="/categories"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View all categories →
          </Link>
        </div>
      </div>
    </div>
  );
}
