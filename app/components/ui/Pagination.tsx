/**
 * Pagination Component - Component phân trang tái sử dụng
 * Sử dụng cho Articles và các trang khác cần pagination
 */

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	maxVisible?: number;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	maxVisible = 5,
}: PaginationProps) {
	if (totalPages <= 1) return null;

	// Tính toán range của page numbers để hiển thị
	const getPageNumbers = () => {
		const pages: number[] = [];
		const half = Math.floor(maxVisible / 2);

		let start = Math.max(0, currentPage - half);
		const end = Math.min(totalPages - 1, start + maxVisible - 1);

		// Điều chỉnh start nếu end đã chạm max
		if (end - start < maxVisible - 1) {
			start = Math.max(0, end - maxVisible + 1);
		}

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="flex justify-center items-center gap-2 mt-12 mb-8">
			{/* Previous Button */}
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 0}
				className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
				aria-label="Trang trước"
			>
				Trước
			</button>

			{/* Page Numbers */}
			<div className="flex gap-2">
				{pageNumbers.map((pageNum) => (
					<button
						key={pageNum}
						onClick={() => onPageChange(pageNum)}
						className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
							pageNum === currentPage
								? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
								: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
						}`}
						aria-label={`Trang ${pageNum + 1}`}
						aria-current={pageNum === currentPage ? "page" : undefined}
					>
						{pageNum + 1}
					</button>
				))}
			</div>

			{/* Next Button */}
			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= totalPages - 1}
				className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
				aria-label="Trang sau"
			>
				Sau
			</button>
		</div>
	);
}
