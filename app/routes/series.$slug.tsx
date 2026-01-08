import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { SeriesDetail } from "~/components/series";
import { seriesApi } from "~/api/series";
import { useAuthStore } from "~/store/authStore";

export default function SeriesDetailPage() {
  const { slug } = useParams();
  const { user } = useAuthStore();

  const { data: seriesData, isLoading, error } = useQuery({
    queryKey: ["series", slug],
    queryFn: () => seriesApi.getSeriesBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !seriesData?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Không tìm thấy series
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Series bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  const series = seriesData.data;
  const isOwner = user?.id === series.author;

  return (
    <div className="container mx-auto px-4 py-8">
      <SeriesDetail 
        series={series}
        showActions={isOwner}
        onEdit={(series) => {
          // Navigate to edit page
          window.location.href = `/dashboard/series/${series.id}/edit`;
        }}
        onDelete={(series) => {
          // Handle delete
          console.log("Delete series:", series.id);
        }}
        onAddPost={(series) => {
          // Navigate to add post page or open modal
          console.log("Add post to series:", series.id);
        }}
        onReorderPosts={(postIds) => {
          // Handle reorder
          console.log("Reorder posts:", postIds);
        }}
      />
    </div>
  );
}
