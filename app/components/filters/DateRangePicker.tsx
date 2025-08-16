import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onDateRangeChange: (startDate?: string, endDate?: string) => void;
  placeholder?: string;
  className?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  placeholder = "Chọn khoảng thời gian",
  className = "",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate || '');
  const [tempEndDate, setTempEndDate] = useState(endDate || '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date for display
  const formatDateForDisplay = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get display text
  const getDisplayText = () => {
    if (startDate && endDate) {
      return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`;
    } else if (startDate) {
      return `Từ ${formatDateForDisplay(startDate)}`;
    } else if (endDate) {
      return `Đến ${formatDateForDisplay(endDate)}`;
    }
    return placeholder;
  };

  // Handle apply button
  const handleApply = () => {
    onDateRangeChange(tempStartDate || undefined, tempEndDate || undefined);
    setIsOpen(false);
  };

  // Handle clear button
  const handleClear = () => {
    setTempStartDate('');
    setTempEndDate('');
    onDateRangeChange(undefined, undefined);
    setIsOpen(false);
  };

  // Quick date range options
  const quickRanges = [
    {
      label: 'Hôm nay',
      getValue: () => {
        const today = new Date().toISOString().split('T')[0];
        return { start: today, end: today };
      }
    },
    {
      label: '7 ngày qua',
      getValue: () => {
        const end = new Date().toISOString().split('T')[0];
        const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        return { start, end };
      }
    },
    {
      label: '30 ngày qua',
      getValue: () => {
        const end = new Date().toISOString().split('T')[0];
        const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        return { start, end };
      }
    },
    {
      label: 'Tháng này',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        return { start, end };
      }
    },
    {
      label: 'Tháng trước',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
        const end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
        return { start, end };
      }
    }
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
          startDate || endDate ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{getDisplayText()}</span>
        </div>
        <div className="flex items-center space-x-1">
          {(startDate || endDate) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* Quick Ranges */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Khoảng thời gian nhanh
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {quickRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      const { start, end } = range.getValue();
                      setTempStartDate(start);
                      setTempEndDate(end);
                    }}
                    className="px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Inputs */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tùy chỉnh
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={tempStartDate}
                    onChange={(e) => setTempStartDate(e.target.value)}
                    max={tempEndDate || undefined}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                    min={tempStartDate || undefined}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Xóa
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleApply}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
