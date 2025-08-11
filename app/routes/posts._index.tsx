import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PostsLayout from "~/components/post/PostsLayout";
import { PostList } from "~/components/post/PostList";
import { usePostsFilters } from "~/hooks/usePostsFilters";
import { postsApi } from "~/api/posts";
import PostSkeleton from "~/components/skeleton/PostSkeleton";
import { Button } from "~/components/ui/button";

export default function PostsPage() {
  const [page, setPage] = useState(0);
  const { filters, setFilters, hasActiveFilters, activeFiltersCount } =
    usePostsFilters();
  const pageSize = 12;

  const {
    data: postsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "posts",
      page,
      filters.search,
      filters.category,
      filters.selectedTags,
    ],
    queryFn: () => postsApi.getPosts(page, pageSize),
  });

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page when filters change
  };

  const handleNextPage = () => {
    if (postsData && page < postsData.totalPages - 1) {
      setPage(page + 1);
    }
  };

  const subtitle = hasActiveFilters
    ? `${activeFiltersCount} bộ lọc đang áp dụng • ${postsData?.totalElements || 0} bài viết`
    : `${postsData?.totalElements || 0} bài viết`;

  return (
    <PostsLayout
      title="Tất cả bài viết"
      subtitle={subtitle}
      filters={filters}
      onFiltersChange={handleFiltersChange}
    >
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
                  Math.max(0, Math.min(postsData.totalPages - 5, page - 2)) + i;
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
    </PostsLayout>
  );
}
