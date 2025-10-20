import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { MainLayout } from "~/components/layout/MainLayout";
import { postsApi } from "~/api/posts";
import { PostList } from "~/components/post/PostList";
import PostSkeleton from "~/components/skeleton/PostSkeleton";
import GlobalSearch from "~/components/search/GlobalSearch";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  TrendingUp, 
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'oldest' | 'popular'>('relevance');
  const pageSize = 12;

  const query = searchParams.get('q') || '';

  // Update page when query changes
  useEffect(() => {
    setPage(0);
  }, [query]);

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['search-results', query, page, sortBy],
    queryFn: () => postsApi.searchPosts(query, page, pageSize, sortBy),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort);
    setPage(0);
  };

  const clearSearch = () => {
    setSearchParams({});
  };

  const handleNextPage = () => {
    if (searchResults && page < searchResults.totalPages - 1) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const results = searchResults?.data?.content || [];
  const totalResults = searchResults?.data?.totalElements || 0;
  const totalPages = searchResults?.data?.totalPages || 0;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Search Results
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <GlobalSearch
              variant="standalone"
              placeholder="Search posts, authors, tags..."
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
        </div>

        {/* Search Query Display */}
        {query && (
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Search results for:
                </span>
                <Badge variant="outline" className="text-base px-3 py-1">
                  "{query}"
                  <button
                    onClick={clearSearch}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </div>
              
              {totalResults > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {totalResults} results found
                </span>
              )}
            </div>

            {/* Sort Options */}
            {totalResults > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by:
                </span>
                <div className="flex items-center space-x-2">
                  {[
                    { value: 'relevance', label: 'Relevance', icon: TrendingUp },
                    { value: 'newest', label: 'Newest', icon: Calendar },
                    { value: 'oldest', label: 'Oldest', icon: Calendar },
                    { value: 'popular', label: 'Popular', icon: TrendingUp },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleSortChange(value as typeof sortBy)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        sortBy === value
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-3">
            {/* No Query State */}
            {!query && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Start Your Search
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Enter a search term to find posts, authors, and topics
                </p>
                <div className="max-w-md mx-auto">
                  <GlobalSearch
                    variant="standalone"
                    placeholder="What are you looking for?"
                    onSearch={handleSearch}
                  />
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && query && (
              <div className="space-y-6">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {[...Array(pageSize)].map((_, i) => (
                    <PostSkeleton key={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Error State */}
            {error && query && (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  Error searching for "{query}"
                </div>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && query && results.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Results Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We couldn't find any posts matching "{query}". Try different keywords or check your spelling.
                </p>
                <div className="space-y-4">
                  <div className="max-w-md mx-auto">
                    <GlobalSearch
                      variant="standalone"
                      placeholder="Try a different search..."
                      onSearch={handleSearch}
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Popular searches:
                    </span>
                    {['React', 'JavaScript', 'CSS', 'Tutorial'].map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && !error && query && results.length > 0 && (
              <>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  <PostList posts={results} loading={false} />
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Page {page + 1} of {totalPages} • 
                      Showing {results.length} of {totalResults} results
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 0}
                        onClick={handlePrevPage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      <div className="flex items-center space-x-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            const pageNum = Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                  pageNum === page
                                    ? "bg-blue-600 text-white"
                                    : "bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                                }`}
                              >
                                {pageNum + 1}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages - 1}
                        onClick={handleNextPage}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Search Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Search Tips
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Use quotes for exact phrases</li>
                  <li>• Try different keywords</li>
                  <li>• Check spelling and try synonyms</li>
                  <li>• Use broader terms for more results</li>
                </ul>
              </div>

              {/* Popular Searches */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Popular Searches
                </h3>
                <div className="space-y-2">
                  {[
                    'React Hooks',
                    'JavaScript ES6',
                    'CSS Grid',
                    'Node.js Tutorial',
                    'TypeScript Guide',
                    'Web Performance',
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
