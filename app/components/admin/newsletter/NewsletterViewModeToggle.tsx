interface NewsletterViewModeToggleProps {
  viewMode: 'all' | 'active';
  onViewModeChange: (mode: 'all' | 'active') => void;
}

export default function NewsletterViewModeToggle({
  viewMode,
  onViewModeChange
}: NewsletterViewModeToggleProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Hiển thị:</span>
        <div className="flex space-x-2">
          <button
            onClick={() => onViewModeChange('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tất cả người đăng ký
          </button>
          <button
            onClick={() => onViewModeChange('active')}
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
  );
}