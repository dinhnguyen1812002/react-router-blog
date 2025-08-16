import { useState, useCallback, useMemo } from 'react';

export interface AdvancedFilters {
  search: string;
  categories: string[];
  tags: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';
  customDateStart?: string;
  customDateEnd?: string;
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending' | 'az' | 'za' | 'most_viewed' | 'most_liked';
  popularity: 'all' | 'most_viewed' | 'most_liked' | 'trending';
  author: string;
  featured: boolean | null;
  status: 'all' | 'published' | 'draft';
  minReadTime?: number;
  maxReadTime?: number;
}

export interface FilterStats {
  totalResults: number;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
}

const defaultFilters: AdvancedFilters = {
  search: '',
  categories: [],
  tags: [],
  dateRange: 'all',
  sortBy: 'newest',
  popularity: 'all',
  author: '',
  featured: null,
  status: 'all',
};

export function useAdvancedFilters(initialFilters?: Partial<AdvancedFilters>) {
  const [filters, setFilters] = useState<AdvancedFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  // Calculate filter statistics
  const filterStats = useMemo<FilterStats>(() => {
    const activeFiltersCount = [
      filters.search && filters.search.length > 0,
      filters.categories.length > 0,
      filters.tags.length > 0,
      filters.dateRange !== 'all',
      filters.sortBy !== 'newest',
      filters.popularity !== 'all',
      filters.author && filters.author.length > 0,
      filters.featured !== null,
      filters.status !== 'all',
      filters.minReadTime !== undefined,
      filters.maxReadTime !== undefined,
    ].filter(Boolean).length;

    return {
      totalResults: 0, // This will be updated by the component using this hook
      activeFiltersCount,
      hasActiveFilters: activeFiltersCount > 0,
    };
  }, [filters]);

  // Update individual filter
  const updateFilter = useCallback(<K extends keyof AdvancedFilters>(
    key: K,
    value: AdvancedFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters: Partial<AdvancedFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Clear specific filter
  const clearFilter = useCallback(<K extends keyof AdvancedFilters>(key: K) => {
    const defaultValue = defaultFilters[key];
    setFilters(prev => ({ ...prev, [key]: defaultValue }));
  }, []);

  // Toggle category
  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  }, []);

  // Toggle tag
  const toggleTag = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  }, []);

  // Set search with debouncing support
  const setSearch = useCallback((search: string) => {
    updateFilter('search', search);
  }, [updateFilter]);

  // Set date range
  const setDateRange = useCallback((
    range: AdvancedFilters['dateRange'],
    customStart?: string,
    customEnd?: string
  ) => {
    setFilters(prev => ({
      ...prev,
      dateRange: range,
      customDateStart: range === 'custom' ? customStart : undefined,
      customDateEnd: range === 'custom' ? customEnd : undefined,
    }));
  }, []);

  // Set reading time range
  const setReadingTimeRange = useCallback((min?: number, max?: number) => {
    setFilters(prev => ({
      ...prev,
      minReadTime: min,
      maxReadTime: max,
    }));
  }, []);

  // Get filter query for API
  const getFilterQuery = useCallback(() => {
    const query: Record<string, any> = {};

    if (filters.search) query.search = filters.search;
    if (filters.categories.length > 0) query.categories = filters.categories;
    if (filters.tags.length > 0) query.tags = filters.tags;
    if (filters.author) query.author = filters.author;
    if (filters.featured !== null) query.featured = filters.featured;
    if (filters.status !== 'all') query.status = filters.status;
    if (filters.sortBy !== 'newest') query.sortBy = filters.sortBy;
    if (filters.popularity !== 'all') query.popularity = filters.popularity;
    
    // Date range handling
    if (filters.dateRange !== 'all') {
      if (filters.dateRange === 'custom') {
        if (filters.customDateStart) query.dateStart = filters.customDateStart;
        if (filters.customDateEnd) query.dateEnd = filters.customDateEnd;
      } else {
        query.dateRange = filters.dateRange;
      }
    }

    // Reading time range
    if (filters.minReadTime !== undefined) query.minReadTime = filters.minReadTime;
    if (filters.maxReadTime !== undefined) query.maxReadTime = filters.maxReadTime;

    return query;
  }, [filters]);

  // Get human-readable filter summary
  const getFilterSummary = useCallback(() => {
    const summary: string[] = [];

    if (filters.search) summary.push(`Tìm kiếm: "${filters.search}"`);
    if (filters.categories.length > 0) summary.push(`Danh mục: ${filters.categories.join(', ')}`);
    if (filters.tags.length > 0) summary.push(`Tags: ${filters.tags.join(', ')}`);
    if (filters.author) summary.push(`Tác giả: ${filters.author}`);
    if (filters.featured === true) summary.push('Chỉ bài viết nổi bật');
    if (filters.status !== 'all') summary.push(`Trạng thái: ${filters.status}`);
    
    const dateLabels = {
      today: 'Hôm nay',
      week: 'Tuần này',
      month: 'Tháng này',
      year: 'Năm này',
      custom: 'Tùy chỉnh'
    };
    if (filters.dateRange !== 'all') {
      summary.push(`Thời gian: ${dateLabels[filters.dateRange]}`);
    }

    const sortLabels = {
      newest: 'Mới nhất',
      oldest: 'Cũ nhất',
      popular: 'Phổ biến',
      trending: 'Xu hướng',
      az: 'A-Z',
      za: 'Z-A',
      most_viewed: 'Nhiều lượt xem',
      most_liked: 'Nhiều lượt thích'
    };
    if (filters.sortBy !== 'newest') {
      summary.push(`Sắp xếp: ${sortLabels[filters.sortBy]}`);
    }

    return summary;
  }, [filters]);

  return {
    filters,
    filterStats,
    updateFilter,
    updateFilters,
    clearAllFilters,
    clearFilter,
    toggleCategory,
    toggleTag,
    setSearch,
    setDateRange,
    setReadingTimeRange,
    getFilterQuery,
    getFilterSummary,
  };
}
