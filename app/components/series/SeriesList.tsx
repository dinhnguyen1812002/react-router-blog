import { SeriesCard } from "./SeriesCard";
import type { Series } from "~/types";

interface SeriesListProps {
  series: Series[];
  showActions?: boolean;
  onEdit?: (series: Series) => void;
  onDelete?: (series: Series) => void;
  onAddPost?: (series: Series) => void;
  loading?: boolean;
}

export const SeriesList = ({ 
  series, 
  showActions = false, 
  onEdit, 
  onDelete, 
  onAddPost,
  loading = false 
}: SeriesListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!series || series.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Chưa có series nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Hãy tạo series đầu tiên của bạn để tổ chức các bài viết.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {series.map((seriesItem) => (
        <SeriesCard
          key={seriesItem.id}
          series={seriesItem}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddPost={onAddPost}
        />
      ))}
    </div>
  );
};
