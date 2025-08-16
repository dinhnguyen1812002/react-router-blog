import { useState } from "react";
import { Filter, X, Calendar, Star, TrendingUp, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "../ui/Input";
import type { FilterOptions } from "~/types/filters";

interface AdvancedFiltersSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  totalResults?: number;
  className?: string;
}

export default function AdvancedFiltersSidebar({
  filters,
  onFiltersChange,
  onClearFilters,
  totalResults = 0,
  className = "",
}: AdvancedFiltersSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = 
    filters.search ||
    filters.sortBy !== 'newest' ||
    filters.timeRange !== 'all' ||
    filters.featured !== 'all' ||
    filters.minReadTime > 0 ||
    filters.maxReadTime < 60 ||
    filters.categories.length > 0 ||
    filters.tags.length > 0;

  return (
    <div className={className}>
      <div className="mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-500" />
            <span>Filters</span>
          </h2>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Results count */}
        {totalResults > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {totalResults} posts found
          </p>
        )}

        {/* Search */}
        <div className="mb-4">
          <Label htmlFor="filter-search" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Search
          </Label>
          <Input
            id="filter-search"
            type="text"
            placeholder="Search posts..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Sort By */}
        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Sort By
          </Label>
          <div className="space-y-2">
            {[
              { value: 'newest', label: 'Newest First', icon: Calendar },
              { value: 'oldest', label: 'Oldest First', icon: Calendar },
              { value: 'popular', label: 'Most Popular', icon: TrendingUp },
              { value: 'trending', label: 'Trending', icon: Star },
            ].map(({ value, label, icon: Icon }) => (
              <label key={value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value={value}
                  checked={filters.sortBy === value}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <Icon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Time Range */}
        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Time Range
          </Label>
          <select
            value={filters.timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Featured Filter */}
        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Post Type
          </Label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Posts' },
              { value: 'featured', label: 'Featured Only' },
              { value: 'regular', label: 'Regular Posts' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="featured"
                  value={value}
                  checked={filters.featured === value}
                  onChange={(e) => handleFilterChange('featured', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors"
        >
          {isExpanded ? 'Hide' : 'Show'} Advanced Filters
        </button>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Reading Time Range */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block  items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Reading Time (minutes)</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minReadTime || ''}
                  onChange={(e) => handleFilterChange('minReadTime', parseInt(e.target.value) || 0)}
                  className="w-20 text-sm"
                  min="0"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxReadTime === 60 ? '' : filters.maxReadTime || ''}
                  onChange={(e) => handleFilterChange('maxReadTime', parseInt(e.target.value) || 60)}
                  className="w-20 text-sm"
                  min="0"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Filter by estimated reading time
              </p>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Active Filters:
            </h3>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  Search: {filters.search}
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.sortBy !== 'newest' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  Sort: {filters.sortBy}
                </span>
              )}
              {filters.timeRange !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                  Time: {filters.timeRange}
                </span>
              )}
              {filters.featured !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                  {filters.featured === 'featured' ? 'Featured' : 'Regular'}
                </span>
              )}
              {filters.categories.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
                  Categories: {filters.categories.length}
                  <button
                    onClick={() => handleFilterChange('categories', [])}
                    className="ml-1 hover:text-orange-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.tags.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300">
                  Tags: {filters.tags.length}
                  <button
                    onClick={() => handleFilterChange('tags', [])}
                    className="ml-1 hover:text-pink-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
