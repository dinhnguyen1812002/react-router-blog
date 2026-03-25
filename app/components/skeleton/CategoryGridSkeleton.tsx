/**
 * Skeleton Loading cho Category Grid
 * Hiển thị khi đang load categories
 */

export function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Color bar */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700" />

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Icon */}
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />

            {/* Title */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
