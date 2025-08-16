import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  Star,
  User,
  X,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { categoriesApi } from '~/api/categories';
import { tagsApi } from '~/api/tags';
import type { AdvancedFilters } from '~/hooks/useAdvancedFilters';
import type { Category, Tag } from '~/types';

interface AdvancedFiltersBarProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: Partial<AdvancedFilters>) => void;
  onClearAll: () => void;
  totalResults?: number;
  isLoading?: boolean;
}

export default function AdvancedFiltersBar({
  filters,
  onFiltersChange,
  onClearAll,
  totalResults = 0,
  isLoading = false,
}: AdvancedFiltersBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Fetch categories and tags
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: tagsApi.getAll,
  });

  // Calculate active filters count
  const activeFiltersCount = [
    filters.search,
    filters.categories.length > 0,
    filters.tags.length > 0,
    filters.dateRange !== 'all',
    filters.sortBy !== 'newest',
    filters.popularity !== 'all',
    filters.author,
    filters.featured !== null,
    filters.status !== 'all',
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Mới nhất', icon: Calendar },
    { value: 'oldest', label: 'Cũ nhất', icon: Calendar },
    { value: 'popular', label: 'Phổ biến', icon: TrendingUp },
    { value: 'trending', label: 'Xu hướng', icon: TrendingUp },
    { value: 'most_viewed', label: 'Nhiều lượt xem', icon: TrendingUp },
    { value: 'most_liked', label: 'Nhiều lượt thích', icon: Star },
    { value: 'az', label: 'A-Z', icon: Filter },
    { value: 'za', label: 'Z-A', icon: Filter },
  ];

  // Date range options
  const dateRangeOptions = [
    { value: 'all', label: 'Tất cả thời gian' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'year', label: 'Năm này' },
  ];

  // Popularity options
  const popularityOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'most_viewed', label: 'Nhiều lượt xem' },
    { value: 'most_liked', label: 'Nhiều lượt thích' },
    { value: 'trending', label: 'Đang xu hướng' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Main Filter Bar */}
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Tìm kiếm bài viết, tác giả, nội dung..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg transition-all duration-200 ${
                  searchFocused
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none`}
              />
              {filters.search && (
                <button
                  onClick={() => onFiltersChange({ search: '' })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => onFiltersChange({ sortBy: e.target.value as AdvancedFilters['sortBy'] })}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                showAdvanced || hasActiveFilters
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Bộ lọc</span>
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Clear All Filters */}
            {hasActiveFilters && (
              <button
                onClick={onClearAll}
                className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            {isLoading ? (
              <span>Đang tìm kiếm...</span>
            ) : (
              <span>
                Tìm thấy <strong className="text-gray-900 dark:text-white">{totalResults.toLocaleString()}</strong> bài viết
                {hasActiveFilters && (
                  <span className="ml-1">
                    với <strong>{activeFiltersCount}</strong> bộ lọc
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Danh mục
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.slug)}
                      onChange={() => {
                        const newCategories = filters.categories.includes(category.slug)
                          ? filters.categories.filter(c => c !== category.slug)
                          : [...filters.categories, category.slug];
                        onFiltersChange({ categories: newCategories });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {category.category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thời gian
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => onFiltersChange({ dateRange: e.target.value as AdvancedFilters['dateRange'] })}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Popularity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Độ phổ biến
              </label>
              <select
                value={filters.popularity}
                onChange={(e) => onFiltersChange({ popularity: e.target.value as AdvancedFilters['popularity'] })}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {popularityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bài viết nổi bật
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="featured"
                    checked={filters.featured === null}
                    onChange={() => onFiltersChange({ featured: null })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Tất cả</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="featured"
                    checked={filters.featured === true}
                    onChange={() => onFiltersChange({ featured: true })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Nổi bật</span>
                </label>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {tags.map((tag) => (
                <button
                  key={tag.uuid}
                  onClick={() => {
                    const newTags = filters.tags.includes(tag.name)
                      ? filters.tags.filter(t => t !== tag.name)
                      : [...filters.tags, tag.name];
                    onFiltersChange({ tags: newTags });
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filters.tags.includes(tag.name)
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: filters.tags.includes(tag.name)
                      ? tag.color
                      : `${tag.color}20`,
                    borderColor: tag.color,
                    borderWidth: '1px',
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
