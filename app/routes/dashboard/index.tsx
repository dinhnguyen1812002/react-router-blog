import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';
import { userPostsApi } from '~/api/userPosts';
import { useAuthStore } from '~/store/authStore';
import { StatsSkeleton } from '~/components/ui/LoadingSkeleton';
import {
  Edit3,
  BookOpen,
  Bookmark,
  Eye,
  Heart,
  MessageCircle,
  Star,
  TrendingUp,
  Plus,
  Calendar,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Fetch user statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: userPostsApi.getUserStats,
    enabled: !!user
  });

  // Fetch recent posts
  const { data: recentPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', 0, 5],
    queryFn: () => userPostsApi.getUserPosts(0, 5),
    enabled: !!user
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Chào mừng trở lại, {user?.username}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Đây là tổng quan về hoạt động của bạn trên BlogPlatform
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <StatsSkeleton  />
        ) : (
          <>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Tổng bài viết</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {stats?.totalPosts || 0}
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-800/30 rounded-full">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-blue-600 dark:text-blue-400">
                  <Link to="/dashboard/posts" className="flex items-center">
                    <span>Xem tất cả</span>
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Lượt xem</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {stats?.totalViews || 0}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-800/30 rounded-full">
                    <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-green-600 dark:text-green-400">
                  <Link to="/dashboard/analytics" className="flex items-center">
                    <span>Xem thống kê</span>
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Lượt thích</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {stats?.totalLikes || 0}
                    </h3>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-800/30 rounded-full">
                    <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-purple-600 dark:text-purple-400">
                  <Link to="/dashboard/analytics" className="flex items-center">
                    <span>Xem chi tiết</span>
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Bình luận</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {stats?.totalComments || 0}
                    </h3>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-800/30 rounded-full">
                    <MessageCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-amber-600 dark:text-amber-400">
                  <Link to="/dashboard/analytics" className="flex items-center">
                    <span>Xem tất cả</span>
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/dashboard/posts/new">
          <Card className="h-full card-hover cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 group">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
                <Edit3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Viết bài mới
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chia sẻ ý tưởng và kiến thức của bạn
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/bookmarks">
          <Card className="h-full card-hover cursor-pointer group">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
                <Bookmark className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Bài viết đã lưu
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Xem lại các bài viết bạn đã đánh dấu
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Bài viết gần đây</h2>
          <Link to="/dashboard/posts">
            <Button variant="outline" size="sm">
              Xem tất cả
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {postsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentPosts?.posts?.length ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentPosts.posts.map((post: any) => (
                <div key={post.id} className="py-4 first:pt-0 last:pb-0">
                  <Link to={`/posts/${post.slug}`} className="block group">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{post.viewCount || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        <span>{post.likeCount || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{post.commentCount || 0}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Bạn chưa có bài viết nào
              </p>
              <Link to="/dashboard/posts/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Viết bài mới
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}