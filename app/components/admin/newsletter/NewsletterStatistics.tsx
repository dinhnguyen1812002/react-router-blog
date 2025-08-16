import { Users, UserCheck, Mail, UserX, Loader2 } from "lucide-react";

interface NewsletterStatisticsProps {
  totalSubscribers: number;
  activeSubscribers: number;
  pendingSubscribers: number;
  unsubscribedCount: number;
  subscribersLoading: boolean;
  countLoading: boolean;
  countError: any;
  viewMode: 'all' | 'active';
}

export default function NewsletterStatistics({
  totalSubscribers,
  activeSubscribers,
  pendingSubscribers,
  unsubscribedCount,
  subscribersLoading,
  countLoading,
  countError,
  viewMode
}: NewsletterStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Tổng đăng ký</p>
            <p className="text-2xl font-bold text-gray-900">
              {subscribersLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                totalSubscribers.toLocaleString()
              )}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-500">
            {viewMode === "all" ? "Tất cả người đăng ký" : "Người đã kích hoạt"}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Đã kích hoạt</p>
            <p className="text-2xl font-bold text-green-600">
              {countLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : countError ? (
                <span className="text-red-500 text-sm">Lỗi</span>
              ) : (
                activeSubscribers.toLocaleString()
              )}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-full">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-500">
            {totalSubscribers > 0
              ? Math.round((activeSubscribers / totalSubscribers) * 100)
              : 0}
            % tổng số
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
            <p className="text-2xl font-bold text-yellow-600">
              {pendingSubscribers.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-full">
            <Mail className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-500">Chưa xác nhận email</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Đã hủy</p>
            <p className="text-2xl font-bold text-red-600">
              {unsubscribedCount.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-full">
            <UserX className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-500">Đã hủy đăng ký</span>
        </div>
      </div>
    </div>
  );
}