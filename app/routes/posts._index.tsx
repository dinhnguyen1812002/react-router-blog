import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { postsApi } from "~/api/posts";
import type { FilterOptions } from "~/types/filters";
import { PostList } from "~/components/post/PostList";
import PostSkeleton from "~/components/skeleton/PostSkeleton";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/components/layout/MainLayout";
import FeaturedPostsSidebar from "~/components/sidebar/FeaturedPostsSidebar";
import AdvancedFiltersSidebar from "~/components/sidebar/AdvancedFiltersSidebar";
import SearchSidebar from "~/components/sidebar/SearchSidebar";
import TagsCloudSidebar from "~/components/sidebar/TagsCloudSidebar";
import CategoriesListSidebar from "~/components/sidebar/CategoriesListSidebar";
import {
  ChevronLeft,
  ChevronRight,
  Grid,
  List as ListIcon,
  Filter,
} from "lucide-react";

export default function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSidebar, setShowSidebar] = useState(true);
  const pageSize = 12;

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterOptions>({
    search: searchParams.get("search") || "",
    sortBy: (searchParams.get("sort") as any) || "newest",
    timeRange: (searchParams.get("time") as any) || "all",
    featured: (searchParams.get("featured") as any) || "all",
    minReadTime: parseInt(searchParams.get("minRead") || "0"),
    maxReadTime: parseInt(searchParams.get("maxRead") || "60"),
    categories:
      searchParams.get("categories")?.split(",").map(Number).filter(Boolean) ||
      [],
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy !== "newest") params.set("sort", filters.sortBy);
    if (filters.timeRange !== "all") params.set("time", filters.timeRange);
    if (filters.featured !== "all") params.set("featured", filters.featured);
    if (filters.minReadTime > 0)
      params.set("minRead", filters.minReadTime.toString());
    if (filters.maxReadTime < 60)
      params.set("maxRead", filters.maxReadTime.toString());
    if (filters.categories.length > 0)
      params.set("categories", filters.categories.join(","));
    if (filters.tags.length > 0) params.set("tags", filters.tags.join(","));

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const {
    data: postsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", page, filters],
    queryFn: () => postsApi.getPosts(page, pageSize),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleNextPage = () => {
    if (postsData && page < postsData.totalPages - 1) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page when filters change
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      sortBy: "newest",
      timeRange: "all",
      featured: "all",
      minReadTime: 0,
      maxReadTime: 60,
      categories: [],
      tags: [],
    });
    setPage(0);
  };

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    setPage(0);
  };

  const handleTagClick = (tag: any) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag.uuid)
        ? prev.tags.filter((t) => t !== tag.uuid)
        : [...prev.tags, tag.uuid],
    }));
    setPage(0);
  };

  const handleCategoryClick = (category: any) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category.id)
        ? prev.categories.filter((c) => c !== category.id)
        : [...prev.categories, category.id],
    }));
    setPage(0);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Đang tải...</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Có lỗi xảy ra
          </h1>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Discover Posts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Explore the latest articles from our community
            </p>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {isLoading && (
              <div className="space-y-6">
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {[...Array(pageSize)].map((_, i) => (
                    <PostSkeleton key={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">Error loading posts</div>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && postsData?.content.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  No posts found matching your criteria
                </div>
                <Button onClick={clearAllFilters}>Clear Filters</Button>
              </div>
            )}

            {/* Posts Grid/List */}
            {!isLoading && !error && postsData?.content?.length && (
              <>
                {/* <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1 '
                }`}>
                  <PostList posts={postsData.content} loading={false} />
                </div> */}
                <div className={`grid gap-6 grid-cols-1 `}>
                  <PostList posts={postsData.content} loading={false} />
                </div>

                {postsData.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Page {page + 1} of {postsData.totalPages} • Showing{" "}
                      {postsData.content.length} of {postsData.totalElements}{" "}
                      posts
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
                          { length: Math.min(5, postsData.totalPages) },
                          (_, i) => {
                            const pageNum =
                              Math.max(
                                0,
                                Math.min(postsData.totalPages - 5, page - 2)
                              ) + i;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                  pageNum === page
                                    ? "bg-blue-600 text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
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
                        disabled={page >= postsData.totalPages - 1}
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
          <div
            className={`lg:col-span-1 space-y-8 ${showSidebar ? "block" : "hidden lg:block"}`}
          >
            {/* Search */}
            <SearchSidebar onSearch={handleSearch} className="lg:block" />

            {/* Advanced Filters */}
            <AdvancedFiltersSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearAllFilters}
              totalResults={postsData?.totalElements || 0}
              className="lg:block"
            />

            {/* Featured Posts */}
            <FeaturedPostsSidebar
              maxPosts={3}
              showThumbnails={true}
              showStats={true}
              className="lg:block"
            />

            {/* Tags Cloud */}
            {/* <TagsCloudSidebar
              maxTags={20}
              variant="cloud"
              showSearch={false}
              onTagClick={handleTagClick}
              selectedTags={filters.tags}
              className="lg:block"
            /> */}

            {/* Categories */}
            {/* <CategoriesListSidebar
              maxCategories={15}
              variant="list"
              showSearch={false}
              onCategoryClick={handleCategoryClick}
              selectedCategories={filters.categories}
              className="lg:block"
            /> */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
