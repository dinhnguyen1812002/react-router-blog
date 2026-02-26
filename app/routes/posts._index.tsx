import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { postsApi } from "~/api/posts";
import { categoriesApi } from "~/api/categories";
import { tagsApi } from "~/api/tags";
import { MainLayout } from "~/components/layout/MainLayout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
import { Grid, List as ListIcon, ChevronLeft, ChevronRight, X, Search } from "lucide-react";
import type { Route } from "../+types/root";
import type { Category, Tag } from "~/types";

export function meta({}: Route.MetaArgs) {
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
  const [searchValue, setSearchValue] = useState(searchParams.get("query") || "");

  // Parse URL params with defaults
  const page = parseInt(searchParams.get("page") || "0");
  const size = viewMode === "grid" ? 9 : 6;
  const sortBy = (searchParams.get("sortBy") as "newest" | "views") || "newest";
  const categorySlug = searchParams.get("categorySlug") || undefined;
  const tagSlug = searchParams.get("tagSlug") || undefined;
  const query = searchParams.get("query") || "";

  // Fetch posts
  const {
    data: postsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", page, size, sortBy, categorySlug, tagSlug, query],
    queryFn: () => {
      const params: any = {
        page,
        size,
        sortBy,
        categorySlug,
        tagSlug,
      };

      if (query) {
        params.query = query;
      }

      return postsApi.getPosts(params);
    },
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
    if (updates.sortBy || updates.categorySlug || updates.tagSlug || updates.query !== undefined) {
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
    setSearchValue("");
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = categorySlug || tagSlug || query;

  // Sync searchValue with URL params
  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    if (urlQuery !== searchValue) {
      setSearchValue(urlQuery);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ query: searchValue || undefined });
  };

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug],
  );

  const activeTag = useMemo(
    () => tags.find((t) => t.slug === tagSlug),
    [tags, tagSlug],
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                Bài viết
              </h1>
              <p className="text-sm text-muted-foreground">
                Khám phá các bài viết mới nhất từ cộng đồng
              </p>
            </div>

            {/* View Mode Toggle - Desktop Only */}
            <div className="hidden md:flex items-center gap-1 rounded-lg border border-border/70 p-1 bg-muted/30">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="List view"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search & Filters - All on one row */}
          <div className="bg-muted/30 rounded-lg border border-border/70 p-4">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Main Filter Row */}
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm bài viết, chủ đề, tác giả..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="h-10 pl-9 rounded-lg border-border/70 bg-background"
                  />
                </div>

                {/* Category Filter */}
                <Select
                  value={categorySlug || "all"}
                  onValueChange={(v) => handleCategoryChange(v === "all" ? "" : v)}
                >
                  <SelectTrigger className="w-full md:w-48 h-10 rounded-lg border-border/70 bg-background">
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
                  <SelectTrigger className="w-full md:w-48 h-10 rounded-lg border-border/70 bg-background">
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

                {/* Sort Filter */}
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full md:w-40 h-10 rounded-lg border-border/70 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="views">Nhiều lượt xem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters & Stats Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
                <div className="flex items-center gap-2 flex-wrap">
                  {postsData && (
                    <span className="text-xs text-muted-foreground">
                      {postsData.totalElements} bài viết
                    </span>
                  )}
                  
                  {hasActiveFilters && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      {query && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 border border-border/60 rounded-full bg-background text-xs">
                          <span className="font-medium">"{query}"</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchValue("");
                              updateParams({ query: undefined });
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      {categorySlug && activeCategory && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 border border-border/60 rounded-full bg-background text-xs">
                          <span className="font-medium">{activeCategory.category}</span>
                          <button
                            type="button"
                            onClick={() => handleCategoryChange("")}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      {tagSlug && activeTag && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 border border-border/60 rounded-full bg-background text-xs">
                          <span className="font-medium">#{activeTag.name}</span>
                          <button
                            type="button"
                            onClick={() => handleTagChange("")}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                      >
                        Xóa tất cả
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {isLoading && (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
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
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                  <X className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Không tải được danh sách bài viết
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
                </p>
                <Button onClick={() => window.location.reload()} size="sm">
                  Thử lại
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && (postsData?.content.length ?? 0) === 0 && (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Không tìm thấy bài viết
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {hasActiveFilters
                    ? "Không có bài viết phù hợp với bộ lọc của bạn."
                    : "Chưa có bài viết nào được đăng."}
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Xóa bộ lọc
                  </Button>
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
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-border/60">
                    <div className="text-sm text-muted-foreground">
                      Trang {page + 1} / {postsData.totalPages}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 0}
                        onClick={() => handlePageChange(page - 1)}
                        className="gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Trước
                      </Button>

                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, postsData.totalPages) },
                          (_, i) => {
                            const startPage = Math.max(
                              0,
                              Math.min(postsData.totalPages - 5, page - 2)
                            );
                            const pageNum = startPage + i;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`min-w-[2.5rem] h-10 px-3 text-sm font-medium rounded-lg transition-all ${
                                  pageNum === page
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-background text-foreground hover:bg-muted border border-border/70"
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
                        className="gap-1"
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
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <FeaturedPostsSidebar
                maxPosts={5}
                showThumbnails={true}
                showStats={true}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}