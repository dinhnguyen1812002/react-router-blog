import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';
import { userPostsApi } from '~/api/userPosts';
import { useAuthStore } from '~/store/authStore';
import { DashboardWrapper } from '~/components/layout/DashboardWrapper';
import { 
  Edit3, 
  Eye, 
  Heart, 
  MessageCircle, 
  Star,
  Trash2,
  MoreHorizontal,
  Calendar,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import {formatDateSimple} from "~/lib/utils";

// import { formatDateSimple } from '~/utils/dateUtils';

export default function MyPostsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Fetch user posts
  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ['user-posts', page, searchTerm, filter],
    
    queryFn: () => userPostsApi.getUserPosts(page, 10),
    // queryFn: () => userPostsApi.getUserPosts(page, 10, searchTerm, filter),
    enabled: !!user
  });

  // Enhanced Delete post mutation following author.ts patterns
  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      console.log('🗑️ Starting delete operation for post:', postId);
      return await userPostsApi.deletePost(postId);
    },
    onSuccess: (data, postId) => {
      console.log('✅ Post deleted successfully:', { postId, data });

      // Invalidate multiple related queries
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['featured-posts'] });

      // Show success notification
      if (typeof window !== 'undefined' && window.alert) {
        window.alert('Bài viết đã được xóa thành công!');
      }
    },
    onError: (error, postId) => {
      console.error('❌ Delete post failed:', { postId, error });

      // Show error notification
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(`Không thể xóa bài viết: ${error.message || 'Lỗi không xác định'}`);
      }
    },
  });

  // Enhanced delete handler with better UX
  const handleDelete = async (postId: string, title: string) => {
    // Enhanced confirmation dialog
    const confirmMessage = `Bạn có chắc muốn xóa bài viết "${title}"?\n\nHành động này không thể hoàn tác và sẽ xóa vĩnh viễn:
    • Nội dung bài viết
    • Tất cả bình luận và tương tác
    • Thống kê lượt xem
    • Bookmark của người dùng khác`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      console.log('🗑️ User confirmed deletion for post:', { postId, title });
      await deleteMutation.mutateAsync(postId);
    } catch (error) {
      console.error('❌ Delete operation failed:', error);
      // Error is already handled in onError callback
    }
  };

  const posts = postsData?.posts || [];
  const totalPosts = postsData?.total || 0;

  return (
    <DashboardWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Bài viết của tôi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Quản lý và chỉnh sửa các bài viết của bạn ({totalPosts} bài viết)
            </p>
          </div>
          <Link to="/dashboard/posts/new">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Viết bài mới</span>
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">Tất cả</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="flex space-x-4">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Lỗi tải dữ liệu
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Không thể tải danh sách bài viết. Vui lòng thử lại.
              </p>
            </CardContent>
          </Card>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Chưa có bài viết nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Bắt đầu chia sẻ kiến thức và trải nghiệm của bạn
              </p>
              <Link to="/dashboard/posts/new">
                <Button>Viết bài đầu tiên</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg dark:hover:shadow-gray-900/40 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Title and Link */}
                      <div className="flex items-start space-x-3 mb-3">
                        {post.thumbnail && (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/posts/${post.slug}`}
                            className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                          >
                            {post.title}
                          </Link>
                          {post.summary && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {post.summary}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likeCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.commentCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{post.averageRating?.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateSimple(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Link to={`/dashboard/posts/${post.slug}/edit`}>
                        <Button variant="outline" size="sm">
                          
                          Sửa
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPosts > 10 && (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Trước
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
              Trang {page + 1} / {Math.ceil(totalPosts / 10)}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * 10 >= totalPosts}
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
}
