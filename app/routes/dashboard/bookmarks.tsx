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
  Star,
  FileText
} from 'lucide-react';
import { formatDateSimple } from "~/lib/utils";
import { toast } from 'sonner';



export default function BookmarksPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch bookmarked posts
  const { data: bookmarksData, isLoading, error } = useQuery({
    queryKey: ['bookmarks', page, searchTerm],
    queryFn: () => bookmarksApi.getBookmarks(page, viewMode === 'grid' ? 12 : 10),
    enabled: !!user
  });

  const posts = bookmarksData?.posts || [];
  const totalPosts = bookmarksData?.total || 0;
  const totalPages = Math.ceil(totalPosts / (viewMode === 'grid' ? 12 : 10));

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );
 const [pendingRemovals, setPendingRemovals] = useState<Record<string, NodeJS.Timeout>>({});

 function handleBookmark(postId: string) {
    // 1. Tạm thời loại bỏ bài viết khỏi giao diện
    setPendingRemovals((prev) => {
      // nếu đã pending rồi thì bỏ qua
      if (prev[postId]) return prev;
      const timeout = setTimeout(async () => {
        try {
          await bookmarksApi.removeBookmark(postId);
        } catch (err) {
          console.error("Failed to remove bookmark:", err);
          toast.error("Xóa bookmark thất bại");
        } finally {
          setPendingRemovals((prev) => {
            const { [postId]: _, ...rest } = prev;
            return rest;
          });
        }
      }, 30000);

      return { ...prev, [postId]: timeout };
    });

    // 2. Hiện toast với nút Hoàn tác
    toast("Đã gỡ bookmark", {
      description: "Sẽ xóa sau 30 giây nếu bạn không hoàn tác.",
      duration: 30000,
      style: {
        background: "rgba(255, 255, 255, 0.95)",
        color: "black",
        border: "1px solid #eee",
      },
      action: {
        label: "Hoàn tác",
        onClick: () => {
          // Huỷ timeout và khôi phục post
          if (pendingRemovals[postId]) {
            clearTimeout(pendingRemovals[postId]);
            setPendingRemovals((prev) => {
              const { [postId]: _, ...rest } = prev;
              return rest;
            });
          }
        },
      },
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Bài viết đã lưu
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quản lý các bài viết bạn đã đánh dấu để đọc sau
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết đã lưu..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
          </div>
        </CardContent>
      </Card>

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
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : filteredPosts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                // showBookmarkButton 
                // showAuthor 
              />
            ))}
          </div>
        ) : (
          <div>
            <CardContent >
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-4 flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-black">
                      {post.thumbnail ? (
                        <img 
                          src={post.thumbnail} 
                          alt={post.title} 
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/posts/${post.slug}`}>
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate">
                          {post.title}
                        </h3>
                      </Link>
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
                    <div className="flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
                        onClick={() => handleBookmark(post.id)}
                      >
                        <Bookmark className="w-5 h-5 fill-current" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        )
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Không có bài viết đã lưu
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm ? 
                `Không tìm thấy bài viết nào phù hợp với "${searchTerm}"` : 
                'Bạn chưa lưu bài viết nào. Hãy khám phá các bài viết và đánh dấu những bài bạn thích!'}
            </p>
            <Link to="/posts">
              <Button>
                Khám phá bài viết
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
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
              Trang {page + 1} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
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