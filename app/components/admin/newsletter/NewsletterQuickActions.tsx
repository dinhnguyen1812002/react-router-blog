import { Plus, Send, Download, Mail, CheckCircle } from "lucide-react";

interface NewsletterQuickActionsProps {
  onAddSubscriber: () => void;
  onSendNewsletter: () => void;
  onExportSubscribers: () => void;
  onBulkResendConfirmation: () => void;
  onBulkConfirm: () => void;
  subscribeNewsletterPending: boolean;
  sendNewsletterPending: boolean;
  resendConfirmationPending: boolean;
  updateStatusPending: boolean;
  activeSubscribers: number;
  filteredSubscribersCount: number;
  pendingSubscribers: number;
}

export default function NewsletterQuickActions({
  onAddSubscriber,
  onSendNewsletter,
  onExportSubscribers,
  onBulkResendConfirmation,
  onBulkConfirm,
  subscribeNewsletterPending,
  sendNewsletterPending,
  resendConfirmationPending,
  updateStatusPending,
  activeSubscribers,
  filteredSubscribersCount,
  pendingSubscribers
}: NewsletterQuickActionsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <button 
          onClick={onAddSubscriber}
          disabled={subscribeNewsletterPending}
          className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Thêm người đăng ký</p>
          <p className="text-xs text-gray-500">Thêm người đăng ký mới</p>
        </button>
        
        <button 
          onClick={onSendNewsletter}
          disabled={sendNewsletterPending || activeSubscribers === 0}
          className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Soạn Newsletter</p>
          <p className="text-xs text-gray-500">Tạo và gửi newsletter mới</p>
        </button>
        
        <button 
          onClick={onExportSubscribers}
          disabled={filteredSubscribersCount === 0}
          className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Xuất dữ liệu</p>
          <p className="text-xs text-gray-500">Tải danh sách người đăng ký</p>
        </button>
        
        <button 
          onClick={onBulkResendConfirmation}
          disabled={resendConfirmationPending || pendingSubscribers === 0}
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
        
        <button 
          onClick={onBulkConfirm}
          disabled={updateStatusPending || pendingSubscribers === 0}
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
  );
}