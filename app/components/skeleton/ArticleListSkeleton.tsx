/**
 * Skeleton Loading cho Article List
 * Hiển thị khi đang load dữ liệu
 */

export function ArticleListSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Thumbnail skeleton */}
            <div className="sm:w-48 sm:h-32 w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />

            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
              {/* Categories */}
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              </div>

              {/* Meta */}
              <div className="flex gap-4">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
