import { Users, FileText, Tags, FolderOpen, TrendingUp, Activity } from "lucide-react";

const stats = [
  {
    name: "Tổng người dùng",
    value: "1,234",
    change: "+12%",
    changeType: "increase",
    icon: Users,
  },
  {
    name: "Tổng bài viết",
    value: "856",
    change: "+8%",
    changeType: "increase",
    icon: FileText,
  },
  {
    name: "Tổng thẻ",
    value: "45",
    change: "+3%",
    changeType: "increase",
    icon: Tags,
  },
  {
    name: "Tổng danh mục",
    value: "12",
    change: "0%",
    changeType: "neutral",
    icon: FolderOpen,
  },
];

const recentActivities = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    action: "đã tạo bài viết mới",
    target: "Hướng dẫn React Router",
    time: "2 phút trước",
  },
  {
    id: 2,
    user: "Trần Thị B",
    action: "đã cập nhật danh mục",
    target: "Technology",
    time: "15 phút trước",
  },
  {
    id: 3,
    user: "Lê Văn C",
    action: "đã thêm thẻ mới",
    target: "JavaScript",
    time: "1 giờ trước",
  },
  {
    id: 4,
    user: "Phạm Thị D",
    action: "đã đăng ký tài khoản",
    target: "",
    time: "2 giờ trước",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Thêm người dùng</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <FolderOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Tạo danh mục</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Tags className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Thêm thẻ</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Xem báo cáo</p>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}
                    {activity.target && (
                      <span className="font-medium text-blue-600"> {activity.target}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
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