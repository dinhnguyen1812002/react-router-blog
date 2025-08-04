interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton = ({ className = '' }: LoadingSkeletonProps) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  );
};

// Card skeleton
export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="flex space-x-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

// Stats skeleton
export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// List skeleton
export const ListSkeleton = ({ items = 5 }: { items?: number }) => {
  return (
    <div className="space-y-4">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="flex space-x-4">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Grid skeleton
export const GridSkeleton = ({ items = 6 }: { items?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-6"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};