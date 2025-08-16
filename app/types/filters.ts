export interface FilterOptions {
  search: string;
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending';
  timeRange: 'all' | 'today' | 'week' | 'month' | 'year';
  featured: 'all' | 'featured' | 'regular';
  minReadTime: number;
  maxReadTime: number;
  categories: number[];
  tags: string[];
}

export interface BasicFilterOptions {
  search: string;
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending';
  timeRange: 'all' | 'today' | 'week' | 'month' | 'year';
  featured: 'all' | 'featured' | 'regular';
  minReadTime: number;
  maxReadTime: number;
}