import { Plus, RefreshCw, Download, Send, Loader2 } from "lucide-react";

interface NewsletterHeaderProps {
  onAddSubscriber: () => void;
  onRefreshData: () => void;
  onExportSubscribers: () => void;
  onSendNewsletter: () => void;
  subscribersFetching: boolean;
  filteredSubscribersCount: number;
  sendNewsletterPending: boolean;
  activeSubscribers: number;
}

export default function NewsletterHeader({
  onAddSubscriber,
  onRefreshData,
  onExportSubscribers,
  onSendNewsletter,
  subscribersFetching,
  filteredSubscribersCount,
  sendNewsletterPending,
  activeSubscribers
}: NewsletterHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Newsletter</h1>
        <p className="text-gray-600">Quản lý người đăng ký nhận tin và gửi newsletter</p>
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={onAddSubscriber}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm người đăng ký</span>
        </button>
        <button 
          onClick={onRefreshData}
          disabled={subscribersFetching}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${subscribersFetching ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </button>
        <button 
          onClick={onExportSubscribers}
          disabled={filteredSubscribersCount === 0}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Xuất danh sách</span>
        </button>
        <button 
          onClick={onSendNewsletter}
          disabled={sendNewsletterPending || activeSubscribers === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {sendNewsletterPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>Gửi Newsletter</span>
        </button>
      </div>
    </div>
  );
}