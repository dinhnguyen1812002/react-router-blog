import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { postsApi } from "~/api/posts";
import { formatDate, calculateReadingTime } from "~/lib/utils";
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Loader2, 
  ArrowRight,
  FileText,
  User,
  Hash,
  Folder
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

interface GlobalSearchProps {
  variant?: 'header' | 'sidebar' | 'standalone' | 'modal';
  placeholder?: string;
  showSuggestions?: boolean;
  showRecentSearches?: boolean;
  maxResults?: number;
  onResultClick?: (result: any) => void;
  onSearch?: (query: string) => void;
  className?: string;
}

interface SearchResult {
  type: 'post' | 'user' | 'tag' | 'category';
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  thumbnail?: string;
  metadata?: any;
}

export default function GlobalSearch({
  variant = 'standalone',
  placeholder = "Search posts, authors, tags...",
  showSuggestions = true,
  showRecentSearches = true,
  maxResults = 8,
  onResultClick,
  onSearch,
  className = "",
}: GlobalSearchProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (showRecentSearches) {
      const saved = localStorage.getItem('global-recent-searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading recent searches:', error);
        }
      }
    }
  }, [showRecentSearches]);

  // Search API call
  const { data: searchResults, isLoading: isLoadingResults } = useQuery({
    queryKey: ['global-search', debouncedQuery],
    queryFn: () => postsApi.searchPosts(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const results: SearchResult[] = searchResults?.data?.content?.slice(0, maxResults).map((post: any) => ({
    type: 'post' as const,
    id: post.id.toString(),
    title: post.title,
    subtitle: post.summary || `By ${post.user?.username}`,
    url: `/posts/${post.slug}`,
    thumbnail: post.thumbnail || post.thumbnailUrl,
    metadata: {
      date: post.createdAt,
      readTime: calculateReadingTime(post.content),
      author: post.user?.username,
      categories: post.categories,
    }
  })) || [];

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowResults(value.length >= 1);
    setIsSearching(value.length >= 2);
    setSelectedIndex(-1);
  };

  // Handle search submission
  const handleSearchSubmit = (query: string = searchQuery) => {
    if (query.trim()) {
      // Save to recent searches
      if (showRecentSearches) {
        const newRecentSearches = [
          query,
          ...recentSearches.filter(s => s !== query)
        ].slice(0, 8);
        setRecentSearches(newRecentSearches);
        localStorage.setItem('global-recent-searches', JSON.stringify(newRecentSearches));
      }

      // Call parent search handler
      if (onSearch) {
        onSearch(query);
      } else {
        // Default behavior: navigate to search results page
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }

      // Hide results and clear input for header variant
      setShowResults(false);
      if (variant === 'header') {
        setSearchQuery("");
      }
      inputRef.current?.blur();
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else {
      navigate(result.url);
    }
    
    // Save search query to recent searches
    if (searchQuery.trim()) {
      handleSearchSubmit(searchQuery);
    }
    
    setShowResults(false);
    if (variant === 'header') {
      setSearchQuery("");
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    const totalItems = results.length + (showRecentSearches ? recentSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < results.length) {
            handleResultClick(results[selectedIndex]);
          } else {
            const recentIndex = selectedIndex - results.length;
            handleSearchSubmit(recentSearches[recentIndex]);
          }
        } else {
          handleSearchSubmit();
        }
        break;
      case 'Escape':
        setShowResults(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Get container classes based on variant
  const getContainerClasses = () => {
    switch (variant) {
      case 'header':
        return 'relative w-full max-w-md';
      case 'sidebar':
        return 'relative w-full';
      case 'modal':
        return 'relative w-full max-w-2xl mx-auto';
      default:
        return 'relative w-full max-w-lg';
    }
  };

  // Get input size based on variant
  const getInputSize = () => {
    switch (variant) {
      case 'header':
        return 'h-10';
      case 'modal':
        return 'h-12 text-lg';
      default:
        return 'h-10';
    }
  };

  return (
    <div className={`${getContainerClasses()} ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowResults(searchQuery.length >= 1 || showRecentSearches)}
            className={`pl-10 pr-10 ${getInputSize()}`}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div 
            ref={resultsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {/* Loading State */}
            {isLoadingResults && debouncedQuery.length >= 2 && (
              <div className="p-4 text-center">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Searching...</p>
              </div>
            )}

            {/* Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 mb-2">
                  Search Results ({results.length})
                </div>
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`w-full p-3 rounded-lg transition-colors text-left ${
                      selectedIndex === index
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex space-x-3">
                      {/* Thumbnail or Icon */}
                      <div className="flex-shrink-0">
                        {result.thumbnail ? (
                          <img
                            src={result.thumbnail}
                            alt={result.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            <FileText className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                          {result.title}
                        </h3>
                        {result.subtitle && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                            {result.subtitle}
                          </p>
                        )}
                        {result.metadata && (
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatDate(result.metadata.date)}</span>
                            <span>•</span>
                            <span>{result.metadata.readTime} min read</span>
                            {result.metadata.author && (
                              <>
                                <span>•</span>
                                <span>by {result.metadata.author}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 flex items-center">
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* View All Results */}
                <button
                  onClick={() => handleSearchSubmit()}
                  className="w-full p-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  View all results for "{searchQuery}" →
                </button>
              </div>
            )}

            {/* No Results */}
            {debouncedQuery.length >= 2 && !isLoadingResults && results.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No results found for "{debouncedQuery}"
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSearchSubmit()}
                  className="mt-2"
                >
                  Search anyway
                </Button>
              </div>
            )}

            {/* Recent Searches */}
            {showRecentSearches && recentSearches.length > 0 && searchQuery.length < 2 && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 mb-2 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Recent Searches</span>
                  </span>
                  <button
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem('global-recent-searches');
                    }}
                    className="text-xs hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSubmit(search)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedIndex === results.length + index
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{search}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            {showSuggestions && searchQuery.length < 2 && recentSearches.length === 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 mb-2 flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Popular Searches</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'React', 'JavaScript', 'TypeScript', 'Node.js',
                    'CSS', 'Python', 'Web Development', 'Tutorial'
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearchSubmit(term)}
                      className="px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
