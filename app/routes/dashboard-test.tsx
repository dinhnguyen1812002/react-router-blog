import { DashboardLayout } from '~/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';
import { BookmarkButton } from '~/components/post/BookmarkButton';
import { Link } from 'react-router';
import { 
  Edit3, 
  BookOpen, 
  Bookmark, 
  Eye, 
  Heart, 
  MessageCircle, 
  Star,
  Settings,
  User,
  BarChart3,
  Calendar
} from 'lucide-react';

export default function DashboardTestPage() {
  // Mock data for testing
  const mockPost = {
    id: "test-post-1",
    title: "Test Post for Dashboard",
    slug: "test-post-dashboard",
    content: "This is a test post content",
    summary: "Test summary for dashboard testing",
    thumbnail: "https://via.placeholder.com/400x200",
    viewCount: 150,
    likeCount: 25,
    commentCount: 8,
    averageRating: 4.2,
    userRating: null,
    isLikedByCurrentUser: false,
    isBookmarkedByCurrentUser: false,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: "test-user",
      username: "testuser",
      email: "test@example.com",
      roles: ["USER"]
    },
    categories: [
      {
        id: "cat-1",
        category: "Technology",
        backgroundColor: "#3B82F6"
      }
    ],
    tags: [
      {
        uuid: "tag-1",
        name: "react",
        color: "#61DAFB"
      },
      {
        uuid: "tag-2", 
        name: "typescript",
        color: "#3178C6"
      }
    ]
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Dashboard Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test tất cả components và features của dashboard system
          </p>
        </div>

        {/* Navigation Test */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Sidebar Navigation Test</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/dashboard" className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Dashboard</span>
              </Link>
              <Link to="/dashboard/my-posts" className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <BookOpen className="w-5 h-5 text-green-500" />
                <span className="text-sm">My Posts</span>
              </Link>
              <Link to="/dashboard/bookmarks" className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Bookmark className="w-5 h-5 text-purple-500" />
                <span className="text-sm">Bookmarks</span>
              </Link>
              <Link to="/dashboard/posts/new" className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Edit3 className="w-5 h-5 text-blue-500" />
                <span className="text-sm">New Post</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* BookmarkButton Test */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Bookmark Button Test</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Default Variant:</h3>
                <BookmarkButton
                  postId={mockPost.id}
                  initialBookmarked={false}
                  variant="default"
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Compact Variant:</h3>
                <BookmarkButton
                  postId={mockPost.id}
                  initialBookmarked={true}
                  variant="compact"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Statistics Cards</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Tổng bài viết</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">24</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
              </div>

              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Lượt xem</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">1,234</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-500 dark:text-green-400" />
                </div>
              </div>

              <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">Lượt thích</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">567</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500 dark:text-red-400" />
                </div>
              </div>

              <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Đánh giá TB</p>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">4.2</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <Edit3 className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Viết bài mới
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Chia sẻ ý tưởng và kiến thức
                </p>
                <Button>Bắt đầu viết</Button>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg text-center hover:shadow-lg dark:hover:shadow-gray-900/40 transition-all">
                <BookOpen className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Quản lý bài viết
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Chỉnh sửa và quản lý
                </p>
                <Button variant="outline">Xem bài viết</Button>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg text-center hover:shadow-lg dark:hover:shadow-gray-900/40 transition-all">
                <Bookmark className="w-12 h-12 text-purple-500 dark:text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Bài viết đã lưu
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Xem lại yêu thích
                </p>
                <Button variant="outline">Xem bookmark</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Dashboard Features</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">✅ Implemented Features</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Responsive sidebar navigation</li>
                  <li>• Dashboard overview với statistics</li>
                  <li>• My Posts management page</li>
                  <li>• Bookmarks page với grid/list view</li>
                  <li>• Post editor với rich features</li>
                  <li>• BookmarkButton component</li>
                  <li>• Dark mode support</li>
                  <li>• Mobile-friendly design</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">🚧 Planned Features</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Analytics page với charts</li>
                  <li>• Profile settings page</li>
                  <li>• Post scheduling</li>
                  <li>• Draft management</li>
                  <li>• Comment moderation</li>
                  <li>• SEO optimization tools</li>
                  <li>• Export/import functionality</li>
                  <li>• Advanced search filters</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibant">Test Instructions</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Testing Dashboard:</h4>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Test sidebar navigation trên desktop và mobile</li>
                  <li>Navigate giữa các pages: Dashboard, My Posts, Bookmarks, New Post</li>
                  <li>Test BookmarkButton functionality</li>
                  <li>Verify responsive design trên different screen sizes</li>
                  <li>Test dark mode compatibility</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Key Features to Test:</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Sidebar collapse/expand trên mobile</li>
                  <li>Active state highlighting trong navigation</li>
                  <li>Statistics cards display</li>
                  <li>Quick actions functionality</li>
                  <li>Search và filter features</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
