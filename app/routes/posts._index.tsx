import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '~/components/layout/MainLayout';
import { PostList } from '~/components/post/PostList';

import { Input } from '~/components/ui/Input';
import { postsApi } from '~/api/posts';
import PostSkeleton from '~/components/skeleton/PostSkeleton';
import { Button } from '~/components/ui/button';

export default function PostsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const pageSize = 12;

  const {
    data: postsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts', page, search, category],
    queryFn: () => postsApi.getPosts(page, pageSize),
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

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Tất cả bài viết</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Tìm kiếm</Button>
              </div>
            </form>
            
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              <option value="technology">Công nghệ</option>
              <option value="lifestyle">Lối sống</option>
              <option value="travel">Du lịch</option>
              <option value="food">Ẩm thực</option>
            </select>
          </div>
        </div>

        {/* Posts List */}
        {error ? (
          <PostSkeleton />
        ) : (
          <PostList
            posts={postsData?.content || []}
            loading={isLoading}
          />
        )}

        {/* Pagination */}
        {postsData && postsData.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-12">
            <Button
              variant="secondary"
              onClick={handlePrevPage}
              disabled={page === 0}
            >
              Trang trước
            </Button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, postsData.totalPages) }, (_, i) => {
                const pageNum = Math.max(0, Math.min(postsData.totalPages - 5, page - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-2 rounded-md ${
                      pageNum === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
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
            Hiển thị {postsData.content.length} trong tổng số {postsData.totalElements} bài viết
          </div>
        )}
      </div>
    </MainLayout>
  );
}