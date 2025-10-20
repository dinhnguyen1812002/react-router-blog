import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { postsApi } from "~/api/posts";
import type { FilterOptions } from "~/types/filters";
// Removed PostList usage; rendering inline
import PostSkeleton from "~/components/skeleton/PostSkeleton";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/components/layout/MainLayout";
import FeaturedPostsSidebar from "~/components/sidebar/FeaturedPostsSidebar";

import {
  ChevronLeft,
  ChevronRight,
  Grid,
  List as ListIcon,
  Filter,
} from "lucide-react";
import { PostCard } from "~/components/post";
import { Input } from "~/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Route } from "../+types/root";
import { PostCardSkeleton } from "~/components/skeleton/PostDetailSkeleton";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog - Khám phá bài viết mới nhất từ cộng đồng" },
    { name: "description", content: "Tổng hợp các bài viết hay nhất về công nghệ, lập trình, chia sẻ kinh nghiệm và xu hướng mới từ cộng đồng. Tìm kiếm, lọc và khám phá nội dung phù hợp với bạn." },
    { name: "keywords", content: "blog, bài viết, lập trình, công nghệ, chia sẻ, kinh nghiệm, xu hướng" },
    { property: "og:title", content: "Blog cộng đồng - Bài viết mới nhất" },
    { property: "og:description", content: "Khám phá các bài viết nổi bật và xu hướng. Tìm kiếm theo chủ đề bạn yêu thích." },
    { property: "og:type", content: "website" },
  ];
}


export default function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSidebar, setShowSidebar] = useState(true);
  const pageSize = viewMode === 'grid' ? 6 : 10;

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

  // Debounced search value for input UX
  const [searchInput, setSearchInput] = useState(filters.search);
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPage(0);
    }, 350);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

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
    isFetching,
  } = useQuery({
    queryKey: ["posts", page, pageSize, filters],
    queryFn: () => postsApi.getPosts(page, pageSize, filters),
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Bài viết
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Khám phá các bài viết mới nhất từ cộng đồng
              </p>
            </div>
            {/* Sidebar Toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-black text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full md:max-w-md"
              />
              {filters.search && (
                <Button variant="outline" size="sm" onClick={() => setFilters((p) => ({...p, search: ""}))}>Xóa</Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={filters.sortBy}
                onValueChange={(v) => { setFilters((p) => ({...p, sortBy: v as FilterOptions["sortBy"]})); setPage(0); }}
              >
                <SelectTrigger size="sm" className="min-w-36"><SelectValue placeholder="Sắp xếp" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="popular">Phổ biến</SelectItem>
                  <SelectItem value="trending">Xu hướng</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.timeRange}
                onValueChange={(v) => { setFilters((p) => ({...p, timeRange: v as FilterOptions["timeRange"]})); setPage(0); }}
              >
                <SelectTrigger size="sm" className="min-w-32"><SelectValue placeholder="Khoảng thời gian" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="year">Năm nay</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.featured}
                onValueChange={(v) => { setFilters((p) => ({...p, featured: v as FilterOptions["featured"]})); setPage(0); }}
              >
                <SelectTrigger size="sm" className="min-w-32"><SelectValue placeholder="Loại" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="featured">Nổi bật</SelectItem>
                  <SelectItem value="regular">Thông thường</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-black rounded-lg p-1">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Unified states */}
            {isLoading && (
              <div className="space-y-6">
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {[...Array(pageSize)].map((_, i) => (<PostCardSkeleton key={i} />))}
                </div>
              </div>
            )}
            {!isLoading && error && (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">Không tải được danh sách bài viết</div>
                <Button onClick={() => window.location.reload()}>Thử lại</Button>
              </div>
            )}
            {!isLoading && !error && (postsData?.content.length ?? 0) === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">Không có bài viết phù hợp</div>
                <Button onClick={clearAllFilters}>Xóa bộ lọc</Button>
              </div>
            )}

            {/* Posts Grid/List */}
            {!isLoading && !error && postsData?.content?.length ? (
              <>
                {/* Inline rendering for both grid and list modes */}
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {postsData.content.map((p) => (
                      <PostCard key={p.id} post={p} />
                    ))}
                </div>
                {postsData.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Trang {page + 1} / {postsData.totalPages} • Hiển thị {postsData.content.length} / {postsData.totalElements}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 0}
                        onClick={handlePrevPage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Trước
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
                        disabled={page >= postsData.totalPages - 1}
                        onClick={handleNextPage}
                      >
                        Sau
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* Sidebar */}
          <div
            className={`lg:col-span-1 space-y-8 ${showSidebar ? "block" : "hidden lg:block"}`}
          >
            {/* Search */}
            {/* <SearchSidebar onSearch={handleSearch} className="lg:block" /> */}

            {/* Advanced Filters */}
            {/* <AdvancedFiltersSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearAllFilters}
              totalResults={postsData?.totalElements || 0}
              className="lg:block"
            /> */}

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
