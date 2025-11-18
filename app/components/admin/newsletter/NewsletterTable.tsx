import { Mail, Calendar, CheckCircle, UserX, UserCheck, Loader2, Trash2 } from "lucide-react";
import type { Subscriber } from "~/api/newsletter";

interface NewsletterTableProps {
  subscribers: Subscriber[];
  loading?: boolean;
  selectedSubscribers?: string[];
  onSelectionChange?: (selectedSubscribers: string[]) => void;
  onResendConfirmation: (email: string) => void;
  onUpdateStatus: (email: string, status: 'active' | 'unsubscribed' | 'pending') => void;
  onDelete: (id: number) => void;
}

const statusColors: Record<Subscriber['status'], string> = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  unsubscribed: "bg-red-100 text-red-800",
};

const statusLabels: Record<Subscriber['status'], string> = {
  active: "Đã kích hoạt",
  pending: "Chờ xác nhận",
  unsubscribed: "Đã hủy",
};

export default function NewsletterTable({
  subscribers,
  loading = false,
  selectedSubscribers = [],
  onSelectionChange,
  onResendConfirmation,
  onUpdateStatus,
  onDelete
}: NewsletterTableProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      onSelectionChange(checked ? subscribers.map(s => s.email) : []);
    }
  };

  const handleSelectSubscriber = (email: string, checked: boolean) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange([...selectedSubscribers, email]);
      } else {
        onSelectionChange(selectedSubscribers.filter(s => s !== email));
      }
    }
  };

  const isAllSelected = subscribers.length > 0 && selectedSubscribers.length === subscribers.length;
  const isIndeterminate = selectedSubscribers.length > 0 && selectedSubscribers.length < subscribers.length;
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {onSelectionChange && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
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
            {loading ? (
              <tr>
                <td colSpan={onSelectionChange ? 6 : 5} className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={onSelectionChange ? 6 : 5} className="px-6 py-4 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50">
                  {onSelectionChange && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.email)}
                        onChange={(e) => handleSelectSubscriber(subscriber.email, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
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
                            onClick={() => onUpdateStatus(subscriber.email, 'active')}
                            className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded text-xs font-medium border border-green-200 hover:bg-green-100 transition-colors"
                            title="Xác nhận thủ công"
                          >
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            Xác nhận
                          </button>
                          <button
                            onClick={() => onResendConfirmation(subscriber.email)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                            title="Gửi lại email xác nhận"
                          >
                            <Mail className="h-3 w-3 inline mr-1" />
                            Gửi lại
                          </button>
                        </>
                      )}
                      {subscriber.status === 'active' && (
                        <button
                          onClick={() => onUpdateStatus(subscriber.email, 'unsubscribed')}
                          className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded text-xs font-medium border border-red-200 hover:bg-red-100 transition-colors"
                          title="Hủy đăng ký"
                        >
                          <UserX className="h-3 w-3 inline mr-1" />
                          Hủy đăng ký
                        </button>
                      )}
                      {subscriber.status === 'unsubscribed' && (
                        <button
                          onClick={() => onUpdateStatus(subscriber.email, 'active')}
                          className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded text-xs font-medium border border-green-200 hover:bg-green-100 transition-colors"
                          title="Kích hoạt lại"
                        >
                          <UserCheck className="h-3 w-3 inline mr-1" />
                          Kích hoạt lại
                        </button>
                      )}

                      {/* Delete button for all statuses */}
                      {/* <button
                        onClick={() => onDelete(subscriber.id)}
                        className="text-gray-600 hover:text-red-900 bg-gray-50 px-2 py-1 rounded text-xs font-medium border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors"
                        title="Xóa người đăng ký"
                      >
                        <Trash2 className="h-3 w-3 inline mr-1" />
                        Xóa
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}