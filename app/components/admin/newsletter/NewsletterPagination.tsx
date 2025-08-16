interface NewsletterPaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function NewsletterPagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange
}: NewsletterPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-700">
            Hiển thị {startItem}-{endItem} của {totalElements} kết quả
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Hiển thị:</label>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
            disabled={currentPage === 0}
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
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 border rounded-md text-sm ${
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
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}