import { useState, useEffect } from "react";
import { Search, Mail, Users, UserCheck, UserX, Download, Send, Calendar, Filter } from "lucide-react";
import NewsletterComposeModal from "~/components/admin/NewsletterComposeModal";
import type { Subscriber, PaginatedSubscribers } from "~/api/newsletter";
import { useGetAllSubscribers } from "~/api/newsletter";
import { useAuthStore } from "~/store/authStore";

// Mock data - replace with actual API calls


const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  unsubscribed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const statusLabels = {
  active: "Đã kích hoạt",
  pending: "Chờ xác nhận",
  unsubscribed: "Đã hủy",
};

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
    const [showComposeModal, setShowComposeModal] = useState(false);
  const { token, isAuthenticated, _hasHydrated } = useAuthStore();
  const subscribersQuery = useGetAllSubscribers({ page: currentPage - 1, size: pageSize }, { enabled: _hasHydrated && isAuthenticated && !!token });
  const pageData = subscribersQuery.data as PaginatedSubscribers | undefined;
  const subscribersLoading = subscribersQuery.isLoading;
  const subscribersFetching = subscribersQuery.isFetching;
  const subscribersError = subscribersQuery.error as any;

  useEffect(() => {
    if (pageData?.content) {
      setSubscribers(pageData.content);
    } else {
      setSubscribers([]);
    }
  }, [pageData]);

  // Statistics
  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.status === 'active').length;
  const pendingSubscribers = subscribers.filter(s => s.status === 'pending').length;
  const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;

  // Filter subscribers
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || subscriber.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = pageData?.totalPages ?? 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedSubscribers = filteredSubscribers;
  const displayStart = paginatedSubscribers.length > 0 ? startIndex + 1 : 0;
  const displayEnd = startIndex + paginatedSubscribers.length;
  const totalCount = pageData?.totalElements ?? paginatedSubscribers.length;

  const handleExportSubscribers = () => {
    // Export functionality - create CSV
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Email,Name,Status,Subscribed At,Confirmed At\n" +
      filteredSubscribers.map(sub => 
        `${sub.email},${sub.name || ''},${sub.status},${sub.subscribedAt},${sub.confirmedAt || ''}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendNewsletter = () => {
    setShowComposeModal(true);
  };

  const handleSendNewsletterSubmit = (newsletterData: { subject: string; content: string; recipientType: 'all' | 'active' }) => {
    console.log("Sending newsletter:", newsletterData);
    // Here you would call the API to send the newsletter
    alert(`Newsletter "${newsletterData.subject}" đã được gửi đến ${newsletterData.recipientType === 'all' ? 'tất cả' : 'người đã kích hoạt'}!`);
    setShowComposeModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Quản lý Newsletter</h1>
          <p className="text-gray-600 dark:text-gray-400">Quản lý người đăng ký nhận tin và gửi newsletter</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportSubscribers}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Xuất danh sách</span>
          </button>
          <button 
            onClick={handleSendNewsletter}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Gửi Newsletter</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Tổng đăng ký</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalSubscribers}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Tất cả người đăng ký</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Đã kích hoạt</p>
              <p className="text-2xl font-bold text-green-600">{activeSubscribers}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {totalSubscribers > 0 ? Math.round((activeSubscribers / totalSubscribers) * 100) : 0}% tổng số
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingSubscribers}</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-full">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Chưa xác nhận email</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Đã hủy</p>
              <p className="text-2xl font-bold text-red-600">{unsubscribedCount}</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-full">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Đã hủy đăng ký</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm email hoặc tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đã kích hoạt</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="unsubscribed">Đã hủy</option>
            </select>
          </div>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>10 / trang</option>
            <option value={25}>25 / trang</option>
            <option value={50}>50 / trang</option>
            <option value={100}>100 / trang</option>
          </select>

          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            Hiển thị {displayStart}-{displayEnd} của {totalCount}
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Người đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ngày xác nhận
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {!_hasHydrated ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Đang khởi tạo...</td>
                </tr>
              ) : !isAuthenticated || !token ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Yêu cầu đăng nhập admin để xem danh sách.</td>
                </tr>
              ) : subscribersError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-red-600">Lỗi tải danh sách: {(subscribersError as any)?.message || 'Không xác định'}</td>
                </tr>
              ) : subscribersLoading || subscribersFetching ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Đang tải...</td>
                </tr>
              ) : paginatedSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Không có người đăng ký</td>
                </tr>
              ) : (
                paginatedSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {subscriber.name || 'Không có tên'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{subscriber.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[subscriber.status]}`}>
                      {statusLabels[subscriber.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(subscriber.subscribedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {subscriber.confirmedAt ? (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(subscriber.confirmedAt)}
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">Chưa xác nhận</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {subscriber.status === 'pending' && (
                        <button className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400">
                          Gửi lại xác nhận
                        </button>
                      )}
                      {subscriber.status === 'active' && (
                        <button className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                          Hủy đăng ký
                        </button>
                      )}
                      {subscriber.status === 'unsubscribed' && (
                        <button className="text-green-600 hover:text-green-900 dark:hover:text-green-400">
                          Kích hoạt lại
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Trang {currentPage} của {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 dark:border-slate-700 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Trước
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-slate-700 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <Send className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Soạn Newsletter</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tạo và gửi newsletter mới</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            <Download className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Xuất dữ liệu</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tải danh sách người đăng ký</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
            <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Gửi lại xác nhận</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Gửi email xác nhận hàng loạt</p>
          </button>
        </div>
      </div>

      {/* Newsletter Compose Modal */}
      <NewsletterComposeModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSend={handleSendNewsletterSubmit}
      />
    </div>
  );
}