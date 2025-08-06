import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "~/store/authStore";
import { DashboardWrapper } from "~/components/layout/DashboardWrapper";
import {
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Star,
  Calendar,
  Users,
  BarChart3,
  BookOpen,
  Clock,
  Activity,
  RefreshCw,
} from "lucide-react";

// Mock data
const mockAnalytics = {
  totalViews: 12847,
  totalLikes: 1523,
  totalComments: 342,
  averageRating: 4.6,
  topPosts: [
    {
      id: "1",
      title: "Hướng dẫn React Hooks cho người mới bắt đầu",
      viewCount: 2847,
      likeCount: 234,
      commentCount: 45,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Tối ưu hiệu suất ứng dụng web với Next.js",
      viewCount: 1923,
      likeCount: 187,
      commentCount: 32,
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      title: "CSS Grid vs Flexbox: Khi nào nên dùng cái nào?",
      viewCount: 1654,
      likeCount: 156,
      commentCount: 28,
      createdAt: "2024-01-08",
    },
    {
      id: "4",
      title: "TypeScript Tips và Tricks cho Developer",
      viewCount: 1432,
      likeCount: 143,
      commentCount: 19,
      createdAt: "2024-01-05",
    },
    {
      id: "5",
      title: "Xây dựng API RESTful với Node.js và Express",
      viewCount: 1287,
      likeCount: 98,
      commentCount: 15,
      createdAt: "2024-01-02",
    },
  ],
  recentActivity: [
    {
      id: "1",
      type: "like",
      description:
        'Bài viết "React Hooks cho người mới" nhận được 5 lượt thích mới',
      timestamp: "2 giờ trước",
      icon: Heart,
    },
    {
      id: "2",
      type: "comment",
      description: 'Có 3 bình luận mới trên bài "Tối ưu hiệu suất web"',
      timestamp: "4 giờ trước",
      icon: MessageCircle,
    },
    {
      id: "3",
      type: "view",
      description: 'Bài viết "CSS Grid vs Flexbox" đạt 100 lượt xem mới',
      timestamp: "6 giờ trước",
      icon: Eye,
    },
    {
      id: "4",
      type: "publish",
      description: 'Bài viết "TypeScript Tips" đã được xuất bản',
      timestamp: "1 ngày trước",
      icon: BookOpen,
    },
    {
      id: "5",
      type: "milestone",
      description: "Tổng lượt xem đã vượt mốc 10,000!",
      timestamp: "2 ngày trước",
      icon: TrendingUp,
    },
  ],
  weeklyViews: [
    { day: "T2", views: 1200 },
    { day: "T3", views: 1800 },
    { day: "T4", views: 1600 },
    { day: "T5", views: 2200 },
    { day: "T6", views: 1900 },
    { day: "T7", views: 1400 },
    { day: "CN", views: 1100 },
  ],
};

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState(mockAnalytics);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate data refresh with slight variations
      setAnalytics({
        ...mockAnalytics,
        totalViews: mockAnalytics.totalViews + Math.floor(Math.random() * 100),
        totalLikes: mockAnalytics.totalLikes + Math.floor(Math.random() * 20),
        totalComments:
          mockAnalytics.totalComments + Math.floor(Math.random() * 10),
      });
      setIsLoading(false);
    }, 800);
  };

  const stats = [
    {
      name: "Tổng lượt xem",
      value: analytics.totalViews.toLocaleString(),
      change: "+12%",
      changeType: "increase",
      icon: Eye,
      color: "blue",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Lượt thích",
      value: analytics.totalLikes.toLocaleString(),
      change: "+8%",
      changeType: "increase",
      icon: Heart,
      color: "red",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
    },
    {
      name: "Bình luận",
      value: analytics.totalComments.toLocaleString(),
      change: "+15%",
      changeType: "increase",
      icon: MessageCircle,
      color: "green",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      name: "Đánh giá TB",
      value: analytics.averageRating.toFixed(1),
      change: "+0.2",
      changeType: "increase",
      icon: Star,
      color: "yellow",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
  ];

  return (
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Thống kê
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Theo dõi hiệu suất và tương tác của bài viết
          </p>
        </div>
        <Button
          onClick={refreshData}
          disabled={isLoading}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.name}
              className={`hover-lift stagger-item group cursor-pointer`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:scale-105 transition-transform duration-200">
                      {isLoading ? (
                        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p
                      className={`text-sm flex items-center mt-1 ${
                        stat.changeType === "increase"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change} so với tháng trước
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <Card className="hover-lift">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              Lượt xem theo tuần
            </h3>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-pulse flex space-x-4 w-full">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center space-y-2"
                      >
                        <div
                          className={`w-8 bg-gray-200 dark:bg-gray-700 rounded`}
                          style={{ height: `${Math.random() * 120 + 40}px` }}
                        ></div>
                        <div className="h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-end justify-between space-x-2">
                  {analytics.weeklyViews.map((day, index) => (
                    <div
                      key={day.day}
                      className="flex-1 flex flex-col items-center space-y-2 group"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-colors duration-200 cursor-pointer relative"
                        style={{ height: `${(day.views / 2500) * 200}px` }}
                        title={`${day.views.toLocaleString()} lượt xem`}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {day.views.toLocaleString()}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {day.day}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card className="hover-lift">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-green-500" />
              Bài viết phổ biến nhất
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center space-x-3"
                    >
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
                : analytics.topPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : index === 2
                                ? "bg-orange-500"
                                : "bg-blue-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {post.title}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.viewCount.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {post.likeCount}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {post.commentCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover-lift">
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-500" />
            Hoạt động gần đây
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center space-x-3"
                  >
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              : analytics.recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  const getActivityColor = (type: string) => {
                    switch (type) {
                      case "like":
                        return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
                      case "comment":
                        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
                      case "view":
                        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
                      case "publish":
                        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
                      case "milestone":
                        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400";
                      default:
                        return "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400";
                    }
                  };

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </CardContent>
      </Card>
      </div>
  );
}
