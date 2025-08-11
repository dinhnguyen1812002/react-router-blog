import { useState, useCallback } from 'react';
import type { PostsFilters } from '~/components/post/PostsSidebar';

export interface UsePostsFiltersReturn {
  filters: PostsFilters;
  setFilters: (filters: PostsFilters) => void;
  updateFilter: <K extends keyof PostsFilters>(key: K, value: PostsFilters[K]) => void;
  clearFilters: () => void;
  clearFilter: (key: keyof PostsFilters) => void;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
}

const initialFilters: PostsFilters = {
  search: '',
  category: '',
  selectedTags: [],
};

export function usePostsFilters(): UsePostsFiltersReturn {
  const [filters, setFilters] = useState<PostsFilters>(initialFilters);

  const updateFilter = useCallback(<K extends keyof PostsFilters>(
    key: K, 
    value: PostsFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const clearFilter = useCallback((key: keyof PostsFilters) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'selectedTags' ? [] : '',
    }));
  }, []);

  const hasActiveFilters = Boolean(
    filters.search || 
    filters.category || 
    filters.selectedTags.length > 0
  );

  const activeFiltersCount = [
    filters.search,
    filters.category,
    ...filters.selectedTags,
  ].filter(Boolean).length;

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    clearFilter,
    hasActiveFilters,
    activeFiltersCount,
  };
}