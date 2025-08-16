import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  Users,
  TrendingUp,
  Send,
  Eye,
  MousePointer,
  Calendar,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  RefreshCw
} from "lucide-react";

// Import newsletter API functions
import {
  useGetNewsletterAnalytics,
  useGetActiveSubscribersCount,
  useGetNewsletterCampaigns,
  type NewsletterAnalytics
} from "~/api/newsletter";

interface NewsletterDashboardProps {
  onCreateCampaign?: () => void;
  onViewSubscribers?: () => void;
  onViewCampaigns?: () => void;
  onViewTemplates?: () => void;
}

interface StatCardProps {
  name: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  textColor: string;
  isLoading?: boolean;
}

function StatCard({ 
  name, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  bgColor, 
  textColor, 
  isLoading 
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{name}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              typeof value === 'number' ? value.toLocaleString() : value
            )}
          </p>
          {change && (
            <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${
                changeType === 'increase' ? 'text-green-600' : 
                changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
      </div>
    </div>
  );
}

function NewsletterGrowthChart({ data, isLoading }: { data: any[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4 w-full">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center space-y-2">
              <div
                className="w-8 bg-gray-200 rounded"
                style={{ height: `${Math.random() * 120 + 40}px` }}
              ></div>
              <div className="h-3 w-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.subscribers));

  return (
    <div className="h-64 flex items-end justify-between space-x-2">
      {data.map((day, index) => (
        <div key={day.date} className="flex-1 flex flex-col items-center space-y-2 group">
          <div
            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-colors duration-200 cursor-pointer relative"
            style={{ height: `${(day.subscribers / maxValue) * 200}px` }}
            title={`${day.subscribers.toLocaleString()} người đăng ký`}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {day.subscribers.toLocaleString()}
            </div>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
          </span>
        </div>
      ))}
    </div>
  );
}

function RecentCampaigns({ campaigns, isLoading }: { campaigns: any[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Chưa có chiến dịch nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.slice(0, 5).map((campaign) => (
        <div key={campaign.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            campaign.status === 'sent' ? 'bg-green-100 text-green-600' :
            campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
            campaign.status === 'draft' ? 'bg-gray-100 text-gray-600' :
            'bg-red-100 text-red-600'
          }`}>
            {campaign.status === 'sent' ? <CheckCircle className="w-5 h-5" /> :
             campaign.status === 'scheduled' ? <Clock className="w-5 h-5" /> :
             campaign.status === 'draft' ? <Mail className="w-5 h-5" /> :
             <AlertCircle className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 truncate">{campaign.subject}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{campaign.recipientCount} người nhận</span>
              <span>•</span>
              <span>{new Date(campaign.createdAt).toLocaleDateString('vi-VN')}</span>
              {campaign.openCount > 0 && (
                <>
                  <span>•</span>
                  <span>{Math.round((campaign.openCount / campaign.recipientCount) * 100)}% mở</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NewsletterDashboard({
  onCreateCampaign,
  onViewSubscribers,
  onViewCampaigns,
  onViewTemplates
}: NewsletterDashboardProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  // Fetch data
  const { data: analyticsData, isLoading: analyticsLoading } = useGetNewsletterAnalytics();
  const { data: subscribersCount, isLoading: countLoading } = useGetActiveSubscribersCount();
  const { data: campaignsData, isLoading: campaignsLoading } = useGetNewsletterCampaigns(0, 5);

  // Mock data for demonstration - replace with real data from API
  const mockGrowthData = [
    { date: '2024-01-15', subscribers: 1200 },
    { date: '2024-01-16', subscribers: 1250 },
    { date: '2024-01-17', subscribers: 1180 },
    { date: '2024-01-18', subscribers: 1320 },
    { date: '2024-01-19', subscribers: 1400 },
    { date: '2024-01-20', subscribers: 1380 },
    { date: '2024-01-21', subscribers: 1450 },
  ];

  const stats = [
    {
      name: "Tổng người đăng ký",
      value: subscribersCount || 0,
      change: "+12%",
      changeType: "increase" as const,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      isLoading: countLoading
    },
    {
      name: "Tỷ lệ mở email",
      value: analyticsData?.averageOpenRate ? `${analyticsData.averageOpenRate}%` : "0%",
      change: "+5%",
      changeType: "increase" as const,
      icon: Eye,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      isLoading: analyticsLoading
    },
    {
      name: "Tỷ lệ click",
      value: analyticsData?.averageClickRate ? `${analyticsData.averageClickRate}%` : "0%",
      change: "+3%",
      changeType: "increase" as const,
      icon: MousePointer,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      isLoading: analyticsLoading
    },
    {
      name: "Chiến dịch tháng này",
      value: campaignsData?.totalElements || 0,
      change: "+2",
      changeType: "increase" as const,
      icon: Send,
      color: "orange",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      isLoading: campaignsLoading
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Newsletter Dashboard</h2>
          <p className="text-gray-600">Tổng quan về hoạt động newsletter và chiến dịch email</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onCreateCampaign}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Tạo chiến dịch</span>
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.name} {...stat} />
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              Tăng trưởng người đăng ký
            </h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="quarter">3 tháng qua</option>
            </select>
          </div>
          <NewsletterGrowthChart data={mockGrowthData} isLoading={analyticsLoading} />
        </div>

        {/* Recent Campaigns */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-500" />
              Chiến dịch gần đây
            </h3>
            <button
              onClick={onViewCampaigns}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Xem tất cả
            </button>
          </div>
          <RecentCampaigns 
            campaigns={campaignsData?.content || []} 
            isLoading={campaignsLoading} 
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onViewSubscribers}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
          >
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Quản lý người đăng ký</h4>
            <p className="text-sm text-gray-600">Xem và quản lý danh sách người đăng ký</p>
          </button>
          
          <button
            onClick={onViewTemplates}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
          >
            <Mail className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Quản lý template</h4>
            <p className="text-sm text-gray-600">Tạo và chỉnh sửa template email</p>
          </button>
          
          <button
            onClick={onViewCampaigns}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
          >
            <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Báo cáo & Thống kê</h4>
            <p className="text-sm text-gray-600">Xem hiệu suất chiến dịch và thống kê</p>
          </button>
        </div>
      </div>
    </div>
  );
}
