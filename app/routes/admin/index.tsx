import { useState } from "react";
import {
  Users,
  FileText,
  Tags,
  FolderOpen,
  TrendingUp,
  Activity,
  Mail,
  Eye,
  Heart,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Loader2
} from "lucide-react";
import { useAdminStats } from "~/hooks/useAdminStats";
import adminMockData from "~/data/admin-mock-data.json";
import type { Route } from "./+types";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin" }, 
    { name: "description", content: "ffuck you" }];
}
interface StatCardProps {
  name: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  period: string;
  icon: React.ComponentType<any>;
}

const StatCard = ({ name, value, change, changeType, period, icon: Icon }: StatCardProps) => {
  const getChangeIcon = () => {
    switch (changeType) {
      case "increase":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case "decrease":
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/20 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{name}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
        </div>
        <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {getChangeIcon()}
        <span className={`ml-1 text-sm font-medium ${getChangeColor()}`}>
          {change > 0 ? "+" : ""}{change}%
        </span>
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{period}</span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { data: statsData, isLoading, error, refetch, isRefetching } = useAdminStats();
  const [mockData] = useState(adminMockData.overview);

  // Fallback data when API fails
  const fallbackStats = {
    totalUsers: {
      value: mockData.stats.totalUsers.value,
      change: mockData.stats.totalUsers.change,
      changeType: mockData.stats.totalUsers.changeType as "increase" | "decrease" | "neutral",
      period: mockData.stats.totalUsers.period,
    },
    totalPosts: {
      value: mockData.stats.totalPosts.value,
      change: mockData.stats.totalPosts.change,
      changeType: mockData.stats.totalPosts.changeType as "increase" | "decrease" | "neutral",
      period: mockData.stats.totalPosts.period,
    },
    totalCategories: {
      value: mockData.stats.totalCategories.value,
      change: mockData.stats.totalCategories.change,
      changeType: mockData.stats.totalCategories.changeType as "increase" | "decrease" | "neutral",
      period: mockData.stats.totalCategories.period,
    },
    totalTags: {
      value: mockData.stats.totalTags.value,
      change: mockData.stats.totalTags.change,
      changeType: mockData.stats.totalTags.changeType as "increase" | "decrease" | "neutral",
      period: mockData.stats.totalTags.period,
    },
    newsletterSubscribers: {
      value: mockData.stats.newsletterSubscribers.value,
      change: mockData.stats.newsletterSubscribers.change,
      changeType: mockData.stats.newsletterSubscribers.changeType as "increase" | "decrease" | "neutral",
      period: mockData.stats.newsletterSubscribers.period,
    },
    monthlyTraffic: {
      value: mockData.stats.monthlyTraffic.value,
      change: mockData.stats.monthlyTraffic.change,
      changeType: mockData.stats.monthlyTraffic.changeType as "increase" | "decrease" | "neutral",
      period: mockData.stats.monthlyTraffic.period,
    },
  };

  // Use API data or fallback to mock data
  const currentStats = statsData || fallbackStats;
  const hasError = !!error;
  const loading = isLoading;

  const stats = [
    {
      name: "Tổng người dùng",
      value: currentStats.totalUsers.value,
      change: currentStats.totalUsers.change,
      changeType: currentStats.totalUsers.changeType,
      period: currentStats.totalUsers.period,
      icon: Users,
    },
    {
      name: "Tổng bài viết",
      value: currentStats.totalPosts.value,
      change: currentStats.totalPosts.change,
      changeType: currentStats.totalPosts.changeType,
      period: currentStats.totalPosts.period,
      icon: FileText,
    },
    {
      name: "Tổng danh mục",
      value: currentStats.totalCategories.value,
      change: currentStats.totalCategories.change,
      changeType: currentStats.totalCategories.changeType,
      period: currentStats.totalCategories.period,
      icon: FolderOpen,
    },
    {
      name: "Tổng thẻ",
      value: currentStats.totalTags.value,
      change: currentStats.totalTags.change,
      changeType: currentStats.totalTags.changeType,
      period: currentStats.totalTags.period,
      icon: Tags,
    },
    {
      name: "Newsletter Subscribers",
      value: currentStats.newsletterSubscribers.value,
      change: currentStats.newsletterSubscribers.change,
      changeType: currentStats.newsletterSubscribers.changeType,
      period: currentStats.newsletterSubscribers.period,
      icon: Mail,
    },
    {
      name: "Lượt truy cập tháng",
      value: currentStats.monthlyTraffic.value,
      change: currentStats.monthlyTraffic.change,
      changeType: currentStats.monthlyTraffic.changeType,
      period: currentStats.monthlyTraffic.period,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Tổng quan về hệ thống quản lý blog
            {isRefetching && !loading && (
              <span className="ml-2 text-blue-600 dark:text-blue-400 text-sm">
                <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
                Đang cập nhật...
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={loading || isRefetching}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {(loading || isRefetching) ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          <span>{(loading || isRefetching) ? 'Đang tải...' : 'Làm mới'}</span>
        </button>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/20 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
              <div className="mt-4 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400 dark:text-gray-500" />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Đang tải...</span>
              </div>
            </div>
          ))}
        </div>
      ) : hasError ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 dark:text-red-400">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-300">Không thể tải dữ liệu thống kê</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">Đang sử dụng dữ liệu mẫu</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.name} {...stat} />
          ))}
        </div>
      )}

      {/* Top Posts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bài viết được xem nhiều nhất</h2>
            <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {mockData.topPosts.mostViewed.slice(0, 5).map((post, index) => (
              <div key={post.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{post.views.toLocaleString()} lượt xem</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{post.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Liked Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bài viết được yêu thích nhất</h2>
            <Heart className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {mockData.topPosts.mostLiked.slice(0, 5).map((post, index) => (
              <div key={post.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{post.likes} lượt thích</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{post.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hoạt động gần đây</h2>
          <Activity className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="space-y-4">
          {mockData.recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.user}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
            Xem tất cả hoạt động →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/20 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <Users className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-white">Quản lý người dùng</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <FolderOpen className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-white">Quản lý danh mục</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <Tags className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-white">Quản lý thẻ</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <Mail className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-white">Quản lý Newsletter</p>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/20 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trạng thái hệ thống</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Database</p>
            <p className="text-xs text-green-600 dark:text-green-400">Hoạt động bình thường</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">API Server</p>
            <p className="text-xs text-green-600 dark:text-green-400">Hoạt động bình thường</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Storage</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Sử dụng 78%</p>
          </div>
        </div>
      </div>
    </div>
  );
}