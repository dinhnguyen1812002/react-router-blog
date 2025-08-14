import { useState, useMemo, useCallback } from "react";
import { Search, Mail, Users, UserCheck, UserX, Download, Send, Calendar, Filter, Loader2, AlertCircle, RefreshCw, Plus, UserPlus, CheckCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import NewsletterComposeModal from "~/components/admin/NewsletterComposeModal";
import {
  // Query hooks
  useGetAllSubscribers,
  useGetActiveSubscribers,
  useGetActiveSubscribersCount,
  // Mutation hooks
  useSendNewsletter,
  useResendConfirmation,
  useUpdateSubscriberStatus,
  useSubscribeNewsletter,
  useConfirmSubscription,
  useUnsubscribeNewsletter,
  // Utility
  newsletterKeys,
  // Types
  type Subscriber,
  type PaginatedSubscribers,
  type NewsletterData,
  type UpdateStatusData
} from "~/api/newsletter";

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  unsubscribed: "bg-red-100 text-red-800",
} as const;

const statusLabels = {
  active: "Đã kích hoạt",
  pending: "Chờ xác nhận",
  unsubscribed: "Đã hủy",
} as const;

// Add Subscriber Modal Component
function AddSubscriberModal({ 
  isOpen, 
  onClose, 
  onAdd 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (data: { email: string; name?: string }) => void;
}) {
  const [formData, setFormData] = useState({ email: "", name: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      email: formData.email,
      name: formData.name || undefined
    });
    setFormData({ email: "", name: "" });
  };

  const handleClose = () => {
    setFormData({ email: "", name: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Thêm người đăng ký mới
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tên (tùy chọn)
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tên người đăng ký"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Thêm
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminNewsletter() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-based pagination
  const [pageSize, setPageSize] = useState(10);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'active'>('all');

  // Define refresh function first
  const handleRefreshData = useCallback(async () => {
    try {
      console.log("Refreshing newsletter data...");
      await queryClient.invalidateQueries({ queryKey: newsletterKeys.subscribers() });
      await queryClient.invalidateQueries({ queryKey: newsletterKeys.subscribersCount() });
      toast.success("Dữ liệu đã được cập nhật!");
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Lỗi khi cập nhật dữ liệu");
    }
  }, [queryClient]);

  // API Queries - Get All Subscribers
  const {
    data: allSubscribersData,
    isLoading: allSubscribersLoading,
    error: allSubscribersError,
    refetch: refetchAllSubscribers,
    isFetching: allSubscribersFetching
  } = useGetAllSubscribers(
    { page: currentPage, size: pageSize },
    {
      enabled: viewMode === 'all',
      keepPreviousData: true,
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  );

  // API Queries - Get Active Subscribers Only
  const {
    data: activeSubscribersData,
    isLoading: activeSubscribersLoading,
    error: activeSubscribersError,
    refetch: refetchActiveSubscribers,
    isFetching: activeSubscribersFetching
  } = useGetActiveSubscribers(
    { page: currentPage, size: pageSize },
    {
      enabled: viewMode === 'active',
      keepPreviousData: true,
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
      retry: 3,
    }
  );

  // API Queries - Get Active Count
  const {
    data: activeCount,
    isLoading: countLoading,
    error: countError,
    refetch: refetchCount
  } = useGetActiveSubscribersCount({
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  // Mutations - Newsletter Management
  const sendNewsletterMutation = useSendNewsletter({
    onSuccess: (data) => {
      toast.success("Newsletter đã được gửi thành công!");
      console.log("Newsletter sent successfully:", data);
      setShowComposeModal(false);
      // Refresh data after sending
      handleRefreshData();
    },
    onError: (error: any) => {
      console.error("Newsletter send error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Lỗi không xác định";
      toast.error(`Lỗi khi gửi newsletter: ${errorMessage}`);
    },
  });

  const resendConfirmationMutation = useResendConfirmation({
    onSuccess: (data, variables) => {
      toast.success(`Email xác nhận đã được gửi lại đến ${variables}!`);
      console.log("Confirmation resent successfully:", data);
    },
    onError: (error: any, variables) => {
      console.error("Resend confirmation error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Lỗi không xác định";
      toast.error(`Lỗi khi gửi email xác nhận đến ${variables}: ${errorMessage}`);
    },
  });

  const updateStatusMutation = useUpdateSubscriberStatus({
    onSuccess: (data, variables) => {
      toast.success(`Cập nhật trạng thái thành công cho ${variables.email}!`);
      console.log("Status updated successfully:", data);
      // Invalidate and refetch subscribers data
      queryClient.invalidateQueries({ queryKey: newsletterKeys.subscribers() });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.subscribersCount() });
    },
    onError: (error: any, variables) => {
      console.error("Update status error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Lỗi không xác định";
      toast.error(`Lỗi khi cập nhật trạng thái cho ${variables.email}: ${errorMessage}`);
    },
  });

  // Mutations - Subscriber Management
  const subscribeNewsletterMutation = useSubscribeNewsletter({
    onSuccess: (data, variables) => {
      toast.success(`Đã thêm người đăng ký mới: ${variables.email}!`);
      console.log("Subscriber added successfully:", data);
      setShowAddSubscriberModal(false);
      // Refresh data after adding
      handleRefreshData();
    },
    onError: (error: any, variables) => {
      console.error("Subscribe error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Lỗi không xác định";
      toast.error(`Lỗi khi thêm người đăng ký ${variables.email}: ${errorMessage}`);
    },
  });

  const confirmSubscriptionMutation = useConfirmSubscription({
    onSuccess: (data, variables) => {
      toast.success("Xác nhận đăng ký thành công!");
      console.log("Subscription confirmed successfully:", data);
      handleRefreshData();
    },
    onError: (error: any, variables) => {
      console.error("Confirm subscription error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Lỗi không xác định";
      toast.error(`Lỗi khi xác nhận đăng ký: ${errorMessage}`);
    },
  });

  const unsubscribeNewsletterMutation = useUnsubscribeNewsletter({
    onSuccess: (data, variables) => {
      toast.success("Hủy đăng ký thành công!");
      console.log("Unsubscribed successfully:", data);
      handleRefreshData();
    },
    onError: (error: any, variables) => {
      console.error("Unsubscribe error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Lỗi không xác định";
      toast.error(`Lỗi khi hủy đăng ký: ${errorMessage}`);
    },
  });

  // Determine which data to use based on view mode
  const subscribersData: PaginatedSubscribers | undefined = viewMode === 'all' ? allSubscribersData : activeSubscribersData;
  const subscribersLoading = viewMode === 'all' ? allSubscribersLoading : activeSubscribersLoading;
  const subscribersError = viewMode === 'all' ? allSubscribersError : activeSubscribersError;
  const subscribersFetching = viewMode === 'all' ? allSubscribersFetching : activeSubscribersFetching;

  // Process data
  const subscribers: Subscriber[] = subscribersData?.content || [];
  const totalElements = subscribersData?.totalElements || 0;
  const totalPages = subscribersData?.totalPages || 0;

  // Filter subscribers locally for search and status
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(subscriber => {
      const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || subscriber.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [subscribers, searchTerm, statusFilter]);

  // Statistics
  const totalSubscribers = totalElements;
  const activeSubscribers = activeCount || 0;
  const pendingSubscribers = subscribers.filter(s => s.status === 'pending').length;
  const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;

  // Handlers
  const handleExportSubscribers = useCallback(() => {
    if (filteredSubscribers.length === 0) {
      toast("Không có dữ liệu để xuất", { 
        description: "Vui lòng thêm người đăng ký hoặc thay đổi bộ lọc" 
      });
      return;
    }

    try {
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Email,Name,Status,Subscribed At,Confirmed At\n" +
        filteredSubscribers.map(sub => 
          `"${sub.email}","${sub.name || ''}","${sub.status}","${sub.subscribedAt}","${sub.confirmedAt || ''}"`
        ).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Đã xuất ${filteredSubscribers.length} người đăng ký`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Lỗi khi xuất dữ liệu");
    }
  }, [filteredSubscribers]);

  const handleSendNewsletter = useCallback(() => {
    if (activeSubscribers === 0) {
      toast("Không có người đăng ký nào để gửi newsletter", {
        description: "Vui lòng đợi có người đăng ký và kích hoạt tài khoản"
      });
      return;
    }
    setShowComposeModal(true);
  }, [activeSubscribers]);

  const handleSendNewsletterSubmit = useCallback((newsletterData: NewsletterData) => {
    console.log("Sending newsletter with data:", newsletterData);
    sendNewsletterMutation.mutate(newsletterData);
  }, [sendNewsletterMutation]);

  const handleAddSubscriber = useCallback((data: { email: string; name?: string }) => {
    console.log("Adding subscriber:", data);
    subscribeNewsletterMutation.mutate(data);
  }, [subscribeNewsletterMutation]);

  const handleResendConfirmation = useCallback((email: string) => {
    console.log("Resending confirmation to:", email);
    resendConfirmationMutation.mutate(email);
  }, [resendConfirmationMutation]);

  const handleUpdateStatus = useCallback((email: string, status: 'active' | 'unsubscribed' | 'pending') => {
    console.log("Updating status for:", email, "to:", status);
    const updateData: UpdateStatusData = { email, status };
    updateStatusMutation.mutate(updateData);
  }, [updateStatusMutation]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleBulkResendConfirmation = useCallback(() => {
    const pendingEmails = subscribers
      .filter(s => s.status === 'pending')
      .map(s => s.email);
    
    if (pendingEmails.length === 0) {
      toast("Không có email nào cần gửi lại xác nhận", {
        description: "Tất cả người đăng ký đã được xác nhận hoặc đã hủy"
      });
      return;
    }

    console.log("Bulk resending confirmation to:", pendingEmails);
    
    // Send confirmation emails in batch with delay to avoid overwhelming the server
    pendingEmails.forEach((email, index) => {
      setTimeout(() => {
        handleResendConfirmation(email);
      }, index * 500); // 500ms delay between each request
    });

    toast(`Đang gửi lại xác nhận cho ${pendingEmails.length} email...`, {
      description: "Vui lòng đợi quá trình hoàn tất"
    });
  }, [subscribers, handleResendConfirmation]);

  // NEW: Manual confirm subscription handler
  const handleManualConfirm = useCallback((email: string) => {
    console.log("Manually confirming subscription for:", email);
    // For manual confirmation, we directly update status to 'active'
    // This simulates the confirmation process without requiring a token
    handleUpdateStatus(email, 'active');
    toast.success(`Đã xác nhận thủ công cho ${email}!`);
  }, [handleUpdateStatus]);

  // NEW: Bulk confirm subscriptions handler
  const handleBulkConfirm = useCallback(() => {
    const pendingEmails = subscribers
      .filter(s => s.status === 'pending')
      .map(s => s.email);
    
    if (pendingEmails.length === 0) {
      toast("Không có email nào cần xác nhận", {
        description: "Tất cả người đăng ký đã được xác nhận hoặc đã hủy"
      });
      return;
    }

    console.log("Bulk confirming subscriptions for:", pendingEmails);
    
    // Confirm subscriptions in batch with delay to avoid overwhelming the server
    pendingEmails.forEach((email, index) => {
      setTimeout(() => {
        handleManualConfirm(email);
      }, index * 300); // 300ms delay between each request
    });

    toast(`Đang xác nhận ${pendingEmails.length} đăng ký...`, {
      description: "Vui lòng đợi quá trình hoàn tất"
    });
  }, [subscribers, handleManualConfirm]);

  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Không xác định";
    }
  }, []);

  // Loading state
  if (subscribersLoading && !subscribersData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (subscribersError) {
    const errorMessage = (subscribersError as any)?.response?.data?.message || 
                        (subscribersError as any)?.message || 
                        "Không thể tải danh sách người đăng ký";
    
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <div className="space-x-2">
            <button
              onClick={handleRefreshData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'all' ? 'active' : 'all')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Chuyển sang {viewMode === 'all' ? 'chỉ người hoạt động' : 'tất cả'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Newsletter</h1>
          <p className="text-gray-600">Quản lý người đăng ký nhận tin và gửi newsletter</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAddSubscriberModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm người đăng ký</span>
          </button>
          <button 
            onClick={handleRefreshData}
            disabled={subscribersFetching}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${subscribersFetching ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button 
            onClick={handleExportSubscribers}
            disabled={filteredSubscribers.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Xuất danh sách</span>
          </button>
          <button 
            onClick={handleSendNewsletter}
            disabled={sendNewsletterMutation.isPending || activeSubscribers === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {sendNewsletterMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>Gửi Newsletter</span>
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Hiển thị:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setViewMode('all');
                setCurrentPage(0);
              }}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tất cả người đăng ký
            </button>
            <button
              onClick={() => {
                setViewMode('active');
                setCurrentPage(0);
              }}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Chỉ người đã kích hoạt
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
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
              {viewMode === 'all' ? 'Tất cả người đăng ký' : 'Người đã kích hoạt'}
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
              {totalSubscribers > 0 ? Math.round((activeSubscribers / totalSubscribers) * 100) : 0}% tổng số
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingSubscribers.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-red-600">{unsubscribedCount.toLocaleString()}</p>
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm email hoặc tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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
              setCurrentPage(0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>10 / trang</option>
            <option value={25}>25 / trang</option>
            <option value={50}>50 / trang</option>
            <option value={100}>100 / trang</option>
          </select>

          <div className="text-sm text-gray-500 flex items-center">
            Hiển thị {filteredSubscribers.length} của {totalSubscribers.toLocaleString()}
            {subscribersFetching && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày xác nhận
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribersLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Không tìm thấy kết quả phù hợp' 
                      : 'Không có dữ liệu'}
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {subscriber.name || 'Không có tên'}
                          </div>
                          <div className="text-sm text-gray-500">{subscriber.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[subscriber.status]}`}>
                        {statusLabels[subscriber.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(subscriber.subscribedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscriber.confirmedAt ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(subscriber.confirmedAt)}
                        </div>
                      ) : (
                        <span className="text-gray-400">Chưa xác nhận</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        {subscriber.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleManualConfirm(subscriber.email)}
                              disabled={updateStatusMutation.isPending}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed bg-green-50 px-2 py-1 rounded text-xs font-medium border border-green-200 hover:bg-green-100 transition-colors"
                              title="Xác nhận thủ công"
                            >
                              {updateStatusMutation.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 inline mr-1" />
                                  Xác nhận
                                </>
                              )}
                            </button>
                            <button 
                              onClick={() => handleResendConfirmation(subscriber.email)}
                              disabled={resendConfirmationMutation.isPending}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 px-2 py-1 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                              title="Gửi lại email xác nhận"
                            >
                              {resendConfirmationMutation.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <Mail className="h-3 w-3 inline mr-1" />
                                  Gửi lại
                                </>
                              )}
                            </button>
                          </>
                        )}
                        {subscriber.status === 'active' && (
                          <button 
                            onClick={() => handleUpdateStatus(subscriber.email, 'unsubscribed')}
                            disabled={updateStatusMutation.isPending}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed bg-red-50 px-2 py-1 rounded text-xs font-medium border border-red-200 hover:bg-red-100 transition-colors"
                            title="Hủy đăng ký"
                          >
                            {updateStatusMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <UserX className="h-3 w-3 inline mr-1" />
                                Hủy đăng ký
                              </>
                            )}
                          </button>
                        )}
                        {subscriber.status === 'unsubscribed' && (
                          <button 
                            onClick={() => handleUpdateStatus(subscriber.email, 'active')}
                            disabled={updateStatusMutation.isPending}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed bg-green-50 px-2 py-1 rounded text-xs font-medium border border-green-200 hover:bg-green-100 transition-colors"
                            title="Kích hoạt lại"
                          >
                            {updateStatusMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <UserCheck className="h-3 w-3 inline mr-1" />
                                Kích hoạt lại
                              </>
                            )}
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
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Trang {currentPage + 1} của {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 0))}
                disabled={currentPage === 0 || subscribersLoading}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const startPage = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
                const pageNum = startPage + i;
                
                if (pageNum >= totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={subscribersLoading}
                    className={`px-3 py-1 border rounded-md text-sm disabled:opacity-50 ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1 || subscribersLoading}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <button 
            onClick={() => setShowAddSubscriberModal(true)}
            disabled={subscribeNewsletterMutation.isPending}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Thêm người đăng ký</p>
            <p className="text-xs text-gray-500">Thêm người đăng ký mới</p>
          </button>
          <button 
            onClick={handleSendNewsletter}
            disabled={sendNewsletterMutation.isPending || activeSubscribers === 0}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Soạn Newsletter</p>
            <p className="text-xs text-gray-500">Tạo và gửi newsletter mới</p>
          </button>
          <button 
            onClick={handleExportSubscribers}
            disabled={filteredSubscribers.length === 0}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Xuất dữ liệu</p>
            <p className="text-xs text-gray-500">Tải danh sách người đăng ký</p>
          </button>
          <button 
            onClick={handleBulkResendConfirmation}
            disabled={resendConfirmationMutation.isPending || pendingSubscribers === 0}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Gửi lại xác nhận</p>
            <p className="text-xs text-gray-500">
              {pendingSubscribers > 0 
                ? `Gửi cho ${pendingSubscribers} email chờ xác nhận`
                : 'Không có email nào cần xác nhận'}
            </p>
          </button>
          {/* NEW: Bulk Confirm Button */}
          <button 
            onClick={handleBulkConfirm}
            disabled={updateStatusMutation.isPending || pendingSubscribers === 0}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Xác nhận hàng loạt</p>
            <p className="text-xs text-gray-500">
              {pendingSubscribers > 0 
                ? `Xác nhận ${pendingSubscribers} đăng ký chờ`
                : 'Không có đăng ký nào cần xác nhận'}
            </p>
          </button>
        </div>
      </div>

      {/* Newsletter Compose Modal */}
      <NewsletterComposeModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSend={handleSendNewsletterSubmit}
      />

      {/* Add Subscriber Modal */}
      <AddSubscriberModal
        isOpen={showAddSubscriberModal}
        onClose={() => setShowAddSubscriberModal(false)}
        onAdd={handleAddSubscriber}
      />
    </div>
  );
}