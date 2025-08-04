import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';
import { Link } from 'react-router';
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
  Plus
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
            Chào mừng trở lại, {user?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Đây là tổng quan về hoạt động của bạn trên BlogPlatform
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/dashboard/posts/new" className="stagger-item">
            <Card className="hover-lift cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 group">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Edit3 className="w-8 h-8 text-blue-500 dark:text-blue-400" />
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

          <Link to="/dashboard/my-posts" className="stagger-item">
            <Card className="hover-lift cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
                  <BookOpen className="w-8 h-8 text-green-500 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Bài viết của tôi
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quản lý và chỉnh sửa bài viết
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/bookmarks" className="stagger-item">
            <Card className="hover-lift cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Bookmark className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Bài viết đã lưu
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Xem lại những bài viết yêu thích
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Statistics */}
        {statsLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-lift stagger-item group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng bài viết</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {stats?.totalPosts || 0}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1 animate-bounce-soft" />
                      +2 tuần này
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift stagger-item group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lượt xem</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
                      {stats?.totalViews || 0}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1 animate-bounce-soft" />
                      +12% tuần này
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift stagger-item group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lượt thích</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
                      {stats?.totalLikes || 0}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1 animate-bounce-soft" />
                      +8% tuần này
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift stagger-item group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đánh giá TB</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-200">
                      {stats?.averageRating?.toFixed(1) || '0.0'}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1 animate-bounce-soft" />
                      +0.2 tuần này
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Hoạt động gần đây
              </h3>
              <Link to="/dashboard/analytics">
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentPosts?.posts?.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.posts.slice(0, 3).map((post: any) => (
                  <div key={post.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        Bài viết "{post.title}" đã được xuất bản
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.viewCount}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {post.likeCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có hoạt động nào</p>
                <p className="text-sm">Bắt đầu viết bài để xem hoạt động</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}


