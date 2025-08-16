import { Search, Filter, Loader2 } from "lucide-react";

interface NewsletterFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  filteredCount: number;
  totalCount: number;
  subscribersFetching: boolean;
}

export default function NewsletterFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  pageSize,
  setPageSize,
  setCurrentPage,
  filteredCount,
  totalCount,
  subscribersFetching
}: NewsletterFiltersProps) {
  return (
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
          Hiển thị {filteredCount} của {totalCount.toLocaleString()}
          {subscribersFetching && (
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
          )}
        </div>
      </div>
    </div>
  );
}