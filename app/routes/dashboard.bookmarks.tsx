import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';
import { PostCard } from '~/components/post/PostCard';
import { bookmarksApi } from '~/api/bookmarks';
import { useAuthStore } from '~/store/authStore';
import { 
  Bookmark, 
  Search, 
  Filter,
  Grid,
  List,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Star
} from 'lucide-react';
import {formatDateSimple} from "~/lib/utils";
// import { formatDateSimple } from '~/utils/dateUtils';

export default function BookmarksPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch bookmarked posts
  const { data: bookmarksData, isLoading, error } = useQuery({
    queryKey: ['bookmarks', page, searchTerm],
    queryFn: () => bookmarksApi.getBookmarks(page, 12),
    enabled: !!user
  });

  const posts = bookmarksData?.posts || [];
  const totalPosts = bookmarksData?.total || 0;

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Bài viết đã lưu
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Những bài viết bạn đã bookmark để đọc lại ({totalPosts} bài viết)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm trong bài viết đã lưu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
                Không thể tải danh sách bài viết đã lưu. Vui lòng thử lại.
              </p>
            </CardContent>
          </Card>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🔖</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm ? 'Không tìm thấy bài viết' : 'Chưa có bài viết nào được lưu'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm 
                  ? `Không có bài viết nào khớp với "${searchTerm}"`
                  : 'Hãy bookmark những bài viết hay để đọc lại sau'
                }
              </p>
              {!searchTerm && (
                <Link to="/posts">
                  <Button>Khám phá bài viết</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg dark:hover:shadow-gray-900/40 transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Thumbnail */}
                        {post.thumbnail && (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/posts/${post.slug}`}
                            className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 block mb-2"
                          >
                            {post.title}
                          </Link>
                          
                          {post.summary && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                              {post.summary}
                            </p>
                          )}

                          {/* Author and Date */}
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <span>Bởi {post.user.username}</span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDateSimple(post.createdAt)}</span>
                            </span>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
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
                          </div>
                        </div>

                        {/* Bookmark indicator */}
                        <div className="flex-shrink-0">
                          <Bookmark className="w-5 h-5 text-blue-500 dark:text-blue-400 fill-current" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPosts > 12 && (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Trước
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
              Trang {page + 1} / {Math.ceil(totalPosts / 12)}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * 12 >= totalPosts}
            >
              Sau
            </Button>
          </div>
        )}
      </div>
  );
}
