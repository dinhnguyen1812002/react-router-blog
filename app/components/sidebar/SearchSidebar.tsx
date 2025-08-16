import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { postsApi } from "~/api/posts";
import { Search, X, Clock, TrendingUp, Loader2 } from "lucide-react";
import { Input } from "~/components/ui/input";
import { formatDate, calculateReadingTime } from "~/lib/utils";

interface SearchSidebarProps {
  placeholder?: string;
  showRecentSearches?: boolean;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchSidebar({
  placeholder = "Search posts...",
  showRecentSearches = true,
  showSuggestions = true,
  onSearch,
  className = "",
}: SearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const saved = localStorage.getItem('recent-searches');
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
    queryKey: ['search', debouncedQuery],
    queryFn: () => postsApi.searchPosts(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const results = searchResults?.data?.content || [];

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowResults(value.length >= 2);
    setIsSearching(value.length >= 2);
  };

  // Handle search submission
  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      // Save to recent searches
      if (showRecentSearches) {
        const newRecentSearches = [
          query,
          ...recentSearches.filter(s => s !== query)
        ].slice(0, 5);
        setRecentSearches(newRecentSearches);
        localStorage.setItem('recent-searches', JSON.stringify(newRecentSearches));
      }

      // Call parent search handler
      if (onSearch) {
        onSearch(query);
      }

      // Hide results
      setShowResults(false);
      inputRef.current?.blur();
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
    inputRef.current?.focus();
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  return (
    <div className={className}>
      <div className="mb-6" ref={searchRef}>
        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Search className="h-5 w-5 text-blue-500" />
          <span>Search</span>
        </h2>

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
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
              onFocus={() => setShowResults(searchQuery.length >= 2)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {isLoadingResults ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 mb-2">
                    Search Results ({results.length})
                  </div>
                  {results.slice(0, 5).map((post) => (
                    <Link
                      key={post.id}
                      to={`/posts/${post.slug}`}
                      onClick={() => handleSearchSubmit(searchQuery)}
                      className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="flex space-x-3">
                        {post.thumbnail && (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                            {post.title}
                          </h3>
                          {post.summary && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                              {post.summary}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatDate(post.createdAt)}</span>
                            <span>•</span>
                            <span>{calculateReadingTime(post.content)} min read</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {results.length > 5 && (
                    <button
                      onClick={() => handleSearchSubmit(searchQuery)}
                      className="w-full p-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      View all {results.length} results →
                    </button>
                  )}
                </div>
              ) : debouncedQuery.length >= 2 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No results found for "{debouncedQuery}"
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Recent Searches */}
        {showRecentSearches && recentSearches.length > 0 && !showResults && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Recent Searches</span>
              </h3>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear
              </button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(search);
                    handleSearchSubmit(search);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        {showSuggestions && !showResults && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span>Popular Searches</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS',
                'Python', 'Web Development', 'Tutorial'
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    handleSearchSubmit(term);
                  }}
                  className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
