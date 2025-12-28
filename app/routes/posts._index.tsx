import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { postsApi } from "~/api/posts";
import { categoriesApi } from "~/api/categories";
import { tagsApi } from "~/api/tags";
import { MainLayout } from "~/components/layout/MainLayout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { PostCard } from "~/components/post";
import { ListArticles } from "~/components/post/ListArticles";
import { PostCardSkeleton } from "~/components/skeleton/PostDetailSkeleton";
import FeaturedPostsSidebar from "~/components/sidebar/FeaturedPostsSidebar";
import { Grid, List as ListIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Route } from "../+types/root";
import type { Category, Tag } from "~/types";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Blog - Khám phá bài viết mới nhất từ cộng đồng" },
    {
      name: "description",
      content:
        "Tổng hợp các bài viết hay nhất về công nghệ, lập trình, chia sẻ kinh nghiệm và xu hướng mới từ cộng đồng.",
    },
  ];
}

export default function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Parse URL params with defaults
  const page = parseInt(searchParams.get("page") || "0");
  const size = viewMode === "grid" ? 9 : 6;
  const sortBy = (searchParams.get("sortBy") as "newest" | "views") || "newest";
  const categorySlug = searchParams.get("categorySlug") || undefined;
  const tagSlug = searchParams.get("tagSlug") || undefined;

  // Fetch posts
  const {
    data: postsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", page, size, sortBy, categorySlug, tagSlug],
    queryFn: () => postsApi.getPosts({ page, size, sortBy, categorySlug, tagSlug }),
    staleTime: 2 * 60 * 1000,
  });

  // Fetch categories and tags for filters
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
  });

  // Update URL params
  const updateParams = (updates: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    // Reset page when filters change
    if (updates.sortBy || updates.categorySlug || updates.tagSlug) {
      newParams.set("page", "0");
    }

    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    updateParams({ sortBy: value as "newest" | "views" });
  };

  const handleCategoryChange = (slug: string) => {
    updateParams({ categorySlug: slug || undefined });
  };

  const handleTagChange = (slug: string) => {
    updateParams({ tagSlug: slug || undefined });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = categorySlug || tagSlug;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bài viết
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Khám phá các bài viết mới nhất từ cộng đồng
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort By */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="views">Nhiều lượt xem</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
              value={categorySlug || "all"}
              onValueChange={(v) => handleCategoryChange(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tag Filter */}
            <Select
              value={tagSlug || "all"}
              onValueChange={(v) => handleTagChange(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Thẻ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thẻ</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.uuid} value={tag.slug}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 ml-auto bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                aria-label="List view"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">Bộ lọc:</span>
              {categorySlug && (
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  <span>
                    {categories.find(c => c.slug === categorySlug)?.category || categorySlug}
                  </span>
                  <button
                    onClick={() => handleCategoryChange("")}
                    className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {tagSlug && (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                  <span>
                    {tags.find(t => t.slug === tagSlug)?.name || tagSlug}
                  </span>
                  <button
                    onClick={() => handleTagChange("")}
                    className="ml-1 hover:text-green-900 dark:hover:text-green-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm"
              >
                Xóa tất cả
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {isLoading && (
              <div
                className={`grid gap-6 ${viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                  }`}
              >
                {[...Array(size)].map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  Không tải được danh sách bài viết
                </div>
                <Button onClick={() => window.location.reload()}>
                  Thử lại
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && (postsData?.content.length ?? 0) === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  Không có bài viết phù hợp
                </div>
                {hasActiveFilters && (
                  <Button onClick={clearFilters}>Xóa bộ lọc</Button>
                )}
              </div>
            )}

            {/* Posts Grid/List */}
            {!isLoading && !error && postsData?.content?.length ? (
              <>
                {viewMode === "grid" ? (
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {postsData.content.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {postsData.content.map((post) => (
                      <ListArticles key={post.id} post={post} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {postsData.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Trang {page + 1} / {postsData.totalPages} •{" "}
                      {postsData.totalElements} bài viết
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 0}
                        onClick={() => handlePageChange(page - 1)}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Trước
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, postsData.totalPages) },
                          (_, i) => {
                            const startPage = Math.max(
                              0,
                              Math.min(
                                postsData.totalPages - 5,
                                page - 2
                              )
                            );
                            const pageNum = startPage + i;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-2 text-sm rounded-md transition-colors ${pageNum === page
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
                        onClick={() => handlePageChange(page + 1)}
                      >
                        Sau
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <FeaturedPostsSidebar
              maxPosts={5}
              showThumbnails={true}
              showStats={true}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
