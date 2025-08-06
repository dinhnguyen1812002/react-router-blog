import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { MainLayout } from '~/components/layout/MainLayout';

import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Spinner } from '~/components/ui/Spinner';
import { authorApi } from '~/api/author';
import { formatDateSimple } from '~/lib/utils';
import { Button } from '~/components/ui/button';

export default function AuthorPostsPage() {
  // TODO: Add authentication check here
  const user = null; // Placeholder
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const {
    data: postsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['author', 'posts', page],
    queryFn: () => authorApi.getMyPosts(page, pageSize),
    enabled: false, // TODO: Enable when authentication is implemented
  });

  const deleteMutation = useMutation({
    mutationFn: authorApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['author', 'posts'] });
    },
  });

  const handleDelete = async (postId: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      deleteMutation.mutate(postId);
    }
  };



  // TODO: Add authentication check when implemented
  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cần đăng nhập</h1>
          <p className="text-gray-600">Bạn cần đăng nhập để truy cập trang này.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý bài viết</h1>
            <p className="text-gray-600 mt-2">Quản lý tất cả bài viết của bạn</p>
          </div>
          <Link to="/author/posts/new">
            <Button size="lg">
              ✏️ Viết bài mới
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {postsData?.totalElements || 0}
              </div>
              <div className="text-gray-600">Tổng bài viết</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {postsData?.content?.filter(p => p.status === 'PUBLISHED').length || 0}
              </div>
              <div className="text-gray-600">Đã xuất bản</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {postsData?.content?.filter(p => p.status === 'DRAFT').length || 0}
              </div>
              <div className="text-gray-600">Bản nháp</div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Có lỗi xảy ra khi tải bài viết.</p>
          </div>
        ) : postsData?.content?.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có bài viết nào
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy bắt đầu viết bài viết đầu tiên của bạn!
              </p>
              <Link to="/author/posts/new">
                <Button>Viết bài mới</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {postsData?.content?.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                        {post.featured && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            Nổi bật
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      
                      {post.summary && (
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {post.summary}
                        </p>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>📅 {formatDateSimple(post.createdAt)}</span>
                        <span>📂 {post.categories && post.categories.length > 0 ? post.categories[0].category : 'Uncategorized'}</span>
                        <span>🏷️ {post.tags.length} tags</span>
                      </div>
                    </div>
                    
                    {post.thumbnailUrl && (
                      <div className="ml-6">
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Link to={`/posts/${post.slug}`}>
                        <Button variant="secondary" size="sm">
                          👁️ Xem
                        </Button>
                      </Link>
                      <Link to={`/author/posts/edit/${post.id}`}>
                        <Button variant="secondary" size="sm">
                          ✏️ Sửa
                        </Button>
                      </Link>
                    </div>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      🗑️ Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {postsData && postsData.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="secondary"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              Trang trước
            </Button>
            
            <span className="text-gray-600">
              Trang {page + 1} / {postsData.totalPages}
            </span>
            
            <Button
              variant="secondary"
              onClick={() => setPage(page + 1)}
              disabled={page >= postsData.totalPages - 1}
            >
              Trang sau
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}