import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "~/components/layout/MainLayout";
import { PostList } from "~/components/post/PostList";

import { Input } from "~/components/ui/Input";
import { postsApi } from "~/api/posts";
import PostSkeleton from "~/components/skeleton/PostSkeleton";
import { Button } from "~/components/ui/button";
import { categoriesApi } from "~/api/categories";
import { tagsApi } from "~/api/tags";
import type { Category, Tag } from "~/types";

import { Search, Filter, Tag as TagIcon } from "lucide-react";

export default function PostsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const pageSize = 12;

  const {
    data: postsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", page, search, category, selectedTags],
    queryFn: () => postsApi.getPosts(page, pageSize),
  });

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: categoriesApi.getAll,
  });

  // Fetch tags from API
  const {
    data: tags,
    isLoading: isLoadingTags,
    error: tagsError,
  } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Reset to first page when searching
  };

  const handleNextPage = () => {
    if (postsData && page < postsData.totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(0);
  };

  const handleCategoryChange = (catSlug: string) => {
    setCategory(catSlug);
    setPage(0);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Tất cả bài viết
          </h1>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Posts List */}
            {error ? (
              <PostSkeleton />
            ) : (
              <PostList posts={postsData?.content || []} loading={isLoading} />
            )}

            {/* Pagination */}
            {postsData && postsData.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <Button variant="secondary" disabled={page === 0}>
                  Trang trước
                </Button>

                <div className="flex items-center space-x-2">
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
                          className={`px-3 py-2 rounded-md ${
                            pageNum === page
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="secondary"
                  onClick={handleNextPage}
                  disabled={page >= postsData.totalPages - 1}
                >
                  Trang sau
                </Button>
              </div>
            )}

            {/* Stats */}
            {postsData && (
              <div className="text-center mt-8 text-gray-500">
                Hiển thị {postsData.content.length} trong tổng số{" "}
                {postsData.totalElements} bài viết
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              {/* Search Bar */}
              <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200
               dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Tìm kiếm
                  </h3>
                </div>

                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm bài viết..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 dark:text-amber-50"
                    />
                  </div>
                </form>
              </div>

              {/* Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Danh mục
                  </h3>
                </div>

                {isLoadingCategories ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                      />
                    ))}
                  </div>
                ) : categoriesError ? (
                  <div className="text-red-500 text-sm">Lỗi tải danh mục</div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange("")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        category === ""
                          ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Tất cả danh mục
                    </button>
                    {categories?.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          category === cat.slug
                            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {cat.category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TagIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Tags phổ biến
                  </h3>
                </div>

                {isLoadingTags ? (
                  <div className="space-y-2">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse inline-block mr-2 mb-2"
                      />
                    ))}
                  </div>
                ) : tagsError ? (
                  <div className="text-red-500 text-sm">Lỗi tải tags</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tags?.map((tag) => (
                      <button
                        key={tag.uuid}
                        onClick={() => handleTagToggle(tag.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedTags.includes(tag.name)
                            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}

                {selectedTags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Tags đã chọn:
                      </span>
                      <button
                        onClick={() => setSelectedTags([])}
                        className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Active Filters Summary */}
              {(category || selectedTags.length > 0) && (
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Bộ lọc hiện tại:
                  </h4>
                  <div className="space-y-1">
                    {category && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700 dark:text-blue-300">
                          Danh mục:{" "}
                          {
                            categories?.find((c) => c.slug === category)
                              ?.category
                          }
                        </span>
                        <button
                          onClick={() => setCategory("")}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {selectedTags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-blue-700 dark:text-blue-300">
                          Tag: {tag}
                        </span>
                        <button
                          onClick={() => handleTagToggle(tag)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
