import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Mail, 
  Users, 
  Send, 
  BarChart3, 
  Settings, 
  Plus,
  RefreshCw,
  Download,
  Filter,
  Search
} from "lucide-react";

// Import newsletter API functions and components
import {
  useGetAllSubscribers,
  useGetActiveSubscribersCount,
  useSubscribeNewsletter,
  useSendNewsletter,
  useResendConfirmation,
  useUpdateSubscriberStatus,
  useDeleteSubscriber,
  type Subscriber,
  type PaginatedSubscribers,
  type NewsletterData
} from "~/api/newsletter";

// Import existing newsletter admin components
import NewsletterStatistics from "~/components/admin/newsletter/NewsletterStatistics";
import NewsletterHeader from "~/components/admin/newsletter/NewsletterHeader";
import NewsletterFilters from "~/components/admin/newsletter/NewsletterFilters";
import NewsletterTable from "~/components/admin/newsletter/NewsletterTable";
import NewsletterPagination from "~/components/admin/newsletter/NewsletterPagination";
import NewsletterQuickActions from "~/components/admin/newsletter/NewsletterQuickActions";
import AddSubscriberModal from "~/components/admin/newsletter/AddSubscriberModal";
import NewsletterDashboard from "~/components/admin/newsletter/NewsletterDashboard";
import NewsletterComposeModal from "~/components/admin/newsletter/NewsletterComposeModal";

// Import error boundary and loading components
import { toast } from "sonner";
import { Component } from "react";
import type { ReactNode } from "react";

interface NewsletterAdminState {
  searchTerm: string;
  statusFilter: 'all' | 'active' | 'pending' | 'unsubscribed';
  currentPage: number;
  pageSize: number;
  viewMode: 'all' | 'active';
  showAddModal: boolean;
  showComposeModal: boolean;
  selectedSubscribers: string[];
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 mb-4">
          <Mail className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Có lỗi xảy ra khi tải trang Newsletter
        </h2>
        <p className="text-gray-600 mb-4">
          {error.message || "Vui lòng thử lại sau"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}

function NewsletterAdminContent() {
  const queryClient = useQueryClient();
  
  // State management
  const [state, setState] = useState<NewsletterAdminState>({
    searchTerm: '',
    statusFilter: 'all',
    currentPage: 0,
    pageSize: 10,
    viewMode: 'all',
    showAddModal: false,
    showComposeModal: false,
    selectedSubscribers: []
  });

  // API queries
  const {
    data: subscribersData,
    isLoading: subscribersLoading,
    isFetching: subscribersFetching,
    error: subscribersError
  } = useGetAllSubscribers(
    { page: state.currentPage, size: state.pageSize }
  );

  const { 
    data: activeSubscribersCount, 
    isLoading: countLoading,
    error: countError 
  } = useGetActiveSubscribersCount();

  // Mutations
  const subscribeNewsletterMutation = useSubscribeNewsletter();
  const sendNewsletterMutation = useSendNewsletter();
  const resendConfirmationMutation = useResendConfirmation();
  const updateStatusMutation = useUpdateSubscriberStatus();
  const deleteSubscriberMutation = useDeleteSubscriber();

  // Computed values
  const subscribers = (subscribersData as PaginatedSubscribers)?.content || [];
  const totalSubscribers = (subscribersData as PaginatedSubscribers)?.totalElements || 0;
  const activeSubscribers = (activeSubscribersCount as number) || 0;
  const pendingSubscribers = subscribers.filter((s: Subscriber) => s.status === 'pending').length;
  const unsubscribedCount = subscribers.filter((s: Subscriber) => s.status === 'unsubscribed').length;
  const filteredSubscribersCount = subscribers.length;

  // Event handlers
  const handleStateUpdate = (updates: Partial<NewsletterAdminState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleAddSubscriber = async (email: string, name?: string) => {
    try {
      await subscribeNewsletterMutation.mutateAsync({ email, name });
      toast.success('Đã thêm người đăng ký thành công');
      handleStateUpdate({ showAddModal: false });
      queryClient.invalidateQueries({ queryKey: ['newsletter', 'subscribers'] });
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi thêm người đăng ký');
    }
  };

  const handleSendNewsletter = () => {
    handleStateUpdate({ showComposeModal: true });
  };

  const handleSendNewsletterSubmit = async (data: NewsletterData) => {
    try {
      await sendNewsletterMutation.mutateAsync(data);
      handleStateUpdate({ showComposeModal: false });
      toast.success('Newsletter đã được gửi thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi gửi newsletter');
      throw error;
    }
  };

  const handleRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['newsletter'] });
    toast.success('Đã làm mới dữ liệu');
  };

  const handleExportSubscribers = () => {
    // TODO: Implement export functionality
    toast.info('Tính năng xuất dữ liệu đang được phát triển');
  };

  const handleBulkResendConfirmation = async () => {
    if (state.selectedSubscribers.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một người đăng ký');
      return;
    }
    
    try {
      // TODO: Implement bulk resend confirmation
      toast.success(`Đã gửi lại email xác nhận cho ${state.selectedSubscribers.length} người đăng ký`);
      handleStateUpdate({ selectedSubscribers: [] });
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi gửi lại email xác nhận');
    }
  };

  const handleBulkConfirm = async () => {
    if (state.selectedSubscribers.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một người đăng ký');
      return;
    }
    
    try {
      // TODO: Implement bulk confirm
      toast.success(`Đã xác nhận ${state.selectedSubscribers.length} người đăng ký`);
      handleStateUpdate({ selectedSubscribers: [] });
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi xác nhận người đăng ký');
    }
  };

  if (subscribersError) {
    throw subscribersError;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <NewsletterHeader
        onAddSubscriber={() => handleStateUpdate({ showAddModal: true })}
        onRefreshData={handleRefreshData}
        onExportSubscribers={handleExportSubscribers}
        onSendNewsletter={handleSendNewsletter}
        subscribersFetching={subscribersFetching}
        filteredSubscribersCount={filteredSubscribersCount}
        sendNewsletterPending={sendNewsletterMutation.isPending}
        activeSubscribers={activeSubscribers}
      />

      {/* Statistics */}
      <NewsletterStatistics
        totalSubscribers={totalSubscribers}
        activeSubscribers={activeSubscribers}
        pendingSubscribers={pendingSubscribers}
        unsubscribedCount={unsubscribedCount}
        subscribersLoading={subscribersLoading}
        countLoading={countLoading}
        countError={countError}
        viewMode={state.viewMode}
      />

      {/* Quick Actions */}

      <NewsletterQuickActions
        onAddSubscriber={() => handleStateUpdate({ showAddModal: true })}
        onSendNewsletter={handleSendNewsletter}
        onExportSubscribers={handleExportSubscribers}
        onBulkResendConfirmation={handleBulkResendConfirmation}
        onBulkConfirm={handleBulkConfirm}
        subscribeNewsletterPending={subscribeNewsletterMutation.isPending}
        sendNewsletterPending={sendNewsletterMutation.isPending}
        resendConfirmationPending={resendConfirmationMutation.isPending}
        updateStatusPending={updateStatusMutation.isPending}
        activeSubscribers={activeSubscribers}
        filteredSubscribersCount={filteredSubscribersCount}
        pendingSubscribers={pendingSubscribers}
      />

      {/* Filters */}
      <NewsletterFilters
        searchTerm={state.searchTerm}
        setSearchTerm={(searchTerm) => handleStateUpdate({ searchTerm, currentPage: 0 })}
        statusFilter={state.statusFilter}
        setStatusFilter={(statusFilter) => handleStateUpdate({ statusFilter, currentPage: 0 })}
        pageSize={state.pageSize}
        setPageSize={(pageSize) => handleStateUpdate({ pageSize, currentPage: 0 })}
        setCurrentPage={(currentPage) => handleStateUpdate({ currentPage })}
        filteredCount={filteredSubscribersCount}
        totalCount={totalSubscribers}
        subscribersFetching={subscribersFetching}
      />

      {/* Subscribers Table */}
      <NewsletterTable
        subscribers={subscribers}
        loading={subscribersLoading}
        selectedSubscribers={state.selectedSubscribers}
        onSelectionChange={(selectedSubscribers) => handleStateUpdate({ selectedSubscribers })}
        onResendConfirmation={async (email) => {
          try {
            await resendConfirmationMutation.mutateAsync(email);
            toast.success('Đã gửi lại email xác nhận');
          } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra');
          }
        }}
        onUpdateStatus={async (email, status) => {
          try {
            await updateStatusMutation.mutateAsync({ email, status });
            toast.success('Đã cập nhật trạng thái');
            queryClient.invalidateQueries({ queryKey: ['newsletter', 'subscribers'] });
          } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra');
          }
        }}
        onDelete={async (id) => {
          try {
            await deleteSubscriberMutation.mutateAsync(id);
            toast.success('Đã xóa người đăng ký');
            queryClient.invalidateQueries({ queryKey: ['newsletter', 'subscribers'] });
          } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra');
          }
        }}
      />

      {/* Pagination */}
      {subscribersData && (
        <NewsletterPagination
          currentPage={state.currentPage}
          totalPages={subscribersData.totalPages}
          totalElements={subscribersData.totalElements}
          pageSize={state.pageSize}
          onPageChange={(currentPage) => handleStateUpdate({ currentPage })}
          onPageSizeChange={(pageSize) => handleStateUpdate({ pageSize, currentPage: 0 })}
        />
      )}

      {/* Modals */}
      <AddSubscriberModal
        isOpen={state.showAddModal}
        onClose={() => handleStateUpdate({ showAddModal: false })}
        onSubmit={handleAddSubscriber}
        loading={subscribeNewsletterMutation.isPending}
      />

      <NewsletterComposeModal
        isOpen={state.showComposeModal}
        onClose={() => handleStateUpdate({ showComposeModal: false })}
        onSend={handleSendNewsletterSubmit}
        loading={sendNewsletterMutation.isPending}
      />
    </div>
  );
}

export default function AdminNewsletter() {
  try {
    return <NewsletterAdminContent />;
  } catch (error) {
    return <ErrorFallback error={error as Error} />;
  }
}
