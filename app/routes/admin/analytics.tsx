import { BarChart3, TrendingUp, Users, FileText, Eye, Heart } from "lucide-react";

const chartData = [
  { month: "Jan", users: 400, posts: 240, views: 2400 },
  { month: "Feb", users: 300, posts: 139, views: 2210 },
  { month: "Mar", users: 200, posts: 980, views: 2290 },
  { month: "Apr", users: 278, posts: 390, views: 2000 },
  { month: "May", users: 189, posts: 480, views: 2181 },
  { month: "Jun", users: 239, posts: 380, views: 2500 },
];

const topPosts = [
  {
    id: 1,
    title: "Hướng dẫn React Router v7",
    author: "Nguyễn Văn A",
    views: 1234,
    likes: 89,
    comments: 23,
  },
  {
    id: 2,
    title: "Tối ưu hiệu suất React App",
    author: "Trần Thị B",
    views: 987,
    likes: 67,
    comments: 15,
  },
  {
    id: 3,
    title: "TypeScript Best Practices",
    author: "Lê Văn C",
    views: 756,
    likes: 45,
    comments: 12,
  },
];

const topUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    posts: 15,
    totalViews: 12340,
    followers: 234,
  },
  {
    id: 2,
    name: "Trần Thị B",
    posts: 12,
    totalViews: 9876,
    followers: 189,
  },
  {
    id: 3,
    name: "Lê Văn C",
    posts: 8,
    totalViews: 7654,
    followers: 156,
  },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Thống kê & Báo cáo</h1>
        <p className="text-gray-600 dark:text-gray-400">Phân tích dữ liệu và hiệu suất hệ thống</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Tổng lượt xem</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">24,567</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">+15.3%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Người dùng hoạt động</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,234</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">+8.2%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Bài viết mới</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">156</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">+12.1%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Tổng lượt thích</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">3,456</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-full">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">+23.5%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simple Bar Chart Representation */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Thống kê theo tháng</h2>
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={data.month} className="flex items-center space-x-4">
                <div className="w-8 text-sm text-gray-600 dark:text-gray-300">{data.month}</div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(data.users / 500) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-12">{data.users}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Người dùng mới</span>
            <span>0 - 500</span>
          </div>
        </div>

        {/* Posts Growth */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Tăng trưởng bài viết</h2>
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={data.month} className="flex items-center space-x-4">
                <div className="w-8 text-sm text-gray-600 dark:text-gray-300">{data.month}</div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(data.posts / 1000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-12">{data.posts}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Bài viết mới</span>
            <span>0 - 1000</span>
          </div>
        </div>
      </div>

      {/* Top Content and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Posts */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Bài viết phổ biến nhất</h2>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{post.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">bởi {post.author}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.views}
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {post.likes}
                    </span>
                    <span>{post.comments} bình luận</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Tác giả hàng đầu</h2>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={user.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{user.posts} bài viết</span>
                    <span>{user.totalViews.toLocaleString()} lượt xem</span>
                    <span>{user.followers} người theo dõi</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Xuất báo cáo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Báo cáo tháng</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Xuất dữ liệu tháng hiện tại</p>
          </button>
          <button className="p-4 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Báo cáo quý</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Xuất dữ liệu 3 tháng gần nhất</p>
          </button>
          <button className="p-4 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <FileText className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Báo cáo năm</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Xuất dữ liệu cả năm</p>
          </button>
        </div>
      </div>
    </div>
  );
}