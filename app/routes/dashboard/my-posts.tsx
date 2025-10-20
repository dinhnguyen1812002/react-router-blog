import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';
import { userPostsApi } from '~/api/userPosts';
import { useAuthStore } from '~/store/authStore';
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
  Plus,
  FileText,
  Clock,
  Tag,
  Grid,
  List
} from 'lucide-react';
import { formatDateSimple } from "~/lib/utils";
import { authorApi } from '~/api/author';
import { PostCard } from '~/components/post';

export default function MyPostsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const size = viewMode === 'grid' ? 6 : 6;

  // Fetch user posts
  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ['user-posts', page, searchTerm, filter],
    queryFn: () => userPostsApi.getUserPosts(page, size),
    enabled: !!user
  });

  // Enhanced Delete post mutation following author.ts patterns
  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      console.log(' Starting delete operation for post:', postId);
      return await userPostsApi.deletePost(postId);
    },
    onSuccess: (data, postId) => {
      console.log(' Post deleted successfully:', { postId, data });

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
      console.error(' Delete post failed:', { postId, error });

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
      console.log('User confirmed deletion for post:', { postId, title });
      await deleteMutation.mutateAsync(postId);
    } catch (error) {
      console.error('Delete operation failed:', error);
      // Error is already handled in onError callback
    }
  };

  const posts = postsData || [];
  const hasNextPage = posts.length >= size;

  // Filter posts based on search term and filter
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    if (filter === 'published') return matchesSearch && post.published;
    if (filter === 'draft') return matchesSearch && !post.published;

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Bài viết của tôi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý tất cả bài viết và bản nháp của bạn
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/dashboard/posts/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Viết bài mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-black rounded-md p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <select
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-100"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
              >
                <option value="all">Tất cả</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Content */}
      {isLoading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : filteredPosts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredPosts.map((post) => (
              <PostCard post={post} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-4 flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-black">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <Link to={`/posts/${post.slug}`} className="flex-1">
                          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate">
                            {post.title}
                          </h3>
                        </Link>
                        <span
                          className={`ml-2 px-2 py-0.5 text-xs font-medium rounded 
                            ${post.is_publish
                              ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                              : "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300"
                            }`}
                        >
                          {post.is_publish ? "Public" : "Draft"}
                        </span>

                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{formatDateSimple(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{post.viewCount}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          <span>{post.likeCount}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          <span>{post.commentCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Link to={`/dashboard/posts/edit/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id, post.title)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Không tìm thấy bài viết nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm ?
                `Không tìm thấy bài viết nào phù hợp với "${searchTerm}"` :
                'Bạn chưa có bài viết nào. Hãy bắt đầu viết bài đầu tiên của bạn!'}
            </p>
            <Link to="/dashboard/posts/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Viết bài mới
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {!isLoading && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Trước
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Trang {page + 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              onClick={() => setPage(page + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}