import { useState, useEffect } from "react";
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
  Minus
} from "lucide-react";
import adminMockData from "~/data/admin-mock-data.json";

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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{name}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {getChangeIcon()}
        <span className={`ml-1 text-sm font-medium ${getChangeColor()}`}>
          {change > 0 ? "+" : ""}{change}%
        </span>
        <span className="ml-2 text-sm text-gray-500">{period}</span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [mockData, setMockData] = useState(adminMockData.overview);

  const stats = [
    {
      name: "Tổng người dùng",
      value: mockData.stats.totalUsers.value,
      change: mockData.stats.totalUsers.change,
      changeType: mockData.stats.totalUsers.changeType as "increase" | "decrease" | "neutral",
      period: mockData.stats.totalUsers.period,
      icon: Users,
    },
    {
      name: "Tổng bài viết",
      value: mockData.stats.totalPosts.value,
      change: mockData.stats.totalPosts.change,
      changeType: mockData.stats.totalPosts.changeType as "increase" | "decrease" | "neutral",
      period: mockData.stats.totalPosts.period,
      icon: FileText,
    },
    {
      name: "Tổng danh mục",
      value: mockData.stats.totalCategories.value,
      change: mockData.stats.totalCategories.change,
      changeType: mockData.stats.totalCategories.changeType as "increase" | "decrease" | "neutral",
      period: mockData.stats.totalCategories.period,
      icon: FolderOpen,
    },
    {
      name: "Tổng thẻ",
      value: mockData.stats.totalTags.value,
      change: mockData.stats.totalTags.change,
      changeType: mockData.stats.totalTags.changeType as "increase" | "decrease" | "neutral",
      period: mockData.stats.totalTags.period,
      icon: Tags,
    },
    {
      name: "Newsletter Subscribers",
      value: mockData.stats.newsletterSubscribers.value,
      change: mockData.stats.newsletterSubscribers.change,
      changeType: mockData.stats.newsletterSubscribers.changeType as "increase" | "decrease" | "neutral",
      period: mockData.stats.newsletterSubscribers.period,
      icon: Mail,
    },
    {
      name: "Lượt truy cập tháng",
      value: mockData.stats.monthlyTraffic.value,
      change: mockData.stats.monthlyTraffic.change,
      changeType: mockData.stats.monthlyTraffic.changeType as "increase" | "decrease" | "neutral",
      period: mockData.stats.monthlyTraffic.period,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hệ thống quản lý blog</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.name} {...stat} />
        ))}
      </div>

      {/* Top Posts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed Posts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Bài viết được xem nhiều nhất</h2>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {mockData.topPosts.mostViewed.slice(0, 5).map((post, index) => (
              <div key={post.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{post.views.toLocaleString()} lượt xem</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{post.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Liked Posts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Bài viết được yêu thích nhất</h2>
            <Heart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {mockData.topPosts.mostLiked.slice(0, 5).map((post, index) => (
              <div key={post.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-red-600">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{post.likes} lượt thích</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{post.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {mockData.recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">{activity.user}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Xem tất cả hoạt động →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Quản lý người dùng</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <FolderOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Quản lý danh mục</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Tags className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Quản lý thẻ</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Quản lý Newsletter</p>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái hệ thống</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900">Database</p>
            <p className="text-xs text-green-600">Hoạt động bình thường</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900">API Server</p>
            <p className="text-xs text-green-600">Hoạt động bình thường</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900">Storage</p>
            <p className="text-xs text-yellow-600">Sử dụng 78%</p>
          </div>
        </div>
      </div>
    </div>
  );
}