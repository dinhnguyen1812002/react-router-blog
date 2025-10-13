import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/Input";
import { SeriesList, SeriesModal, AddPostToSeriesModal } from "~/components/series";
import { seriesApi } from "~/api/series";
import { useAuthStore } from "~/store/authStore";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";

export default function DashboardSeriesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);

  // Get user's series
  const { data: seriesData, isLoading } = useQuery({
    queryKey: ["user-series", user?.id, page, searchTerm],
    queryFn: () => {
      if (searchTerm) {
        return seriesApi.searchSeries({
          keyword: searchTerm,
          authorId: user?.id,
          page,
          size: 12,
        });
      } else {
        return seriesApi.getSeriesByUser(user?.id!, page, 12);
      }
    },
    enabled: !!user?.id,
  });

  // Create series mutation
  const createSeriesMutation = useMutation({
    mutationFn: seriesApi.createSeries,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-series"] });
      toast.success("Tạo series thành công!");
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi tạo series");
      console.error("Create series error:", error);
    },
  });

  // Update series mutation
  const updateSeriesMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      seriesApi.updateSeries(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-series"] });
      toast.success("Cập nhật series thành công!");
      setIsEditModalOpen(false);
      setSelectedSeries(null);
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi cập nhật series");
      console.error("Update series error:", error);
    },
  });

  // Delete series mutation
  const deleteSeriesMutation = useMutation({
    mutationFn: seriesApi.deleteSeries,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-series"] });
      toast.success("Xóa series thành công!");
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi xóa series");
      console.error("Delete series error:", error);
    },
  });

  // Add post to series mutation
  const addPostToSeriesMutation = useMutation({
    mutationFn: ({ seriesId, postId }: { seriesId: string; postId: string }) =>
      seriesApi.addPostToSeries(seriesId, { postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-series"] });
      queryClient.invalidateQueries({ queryKey: ["series", selectedSeries?.slug] });
      toast.success("Thêm bài viết vào series thành công!");
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi thêm bài viết");
      console.error("Add post to series error:", error);
    },
  });

  const handleCreateSeries = async (data: any) => {
    await createSeriesMutation.mutateAsync(data);
  };

  const handleEditSeries = async (data: any) => {
    if (selectedSeries) {
      await updateSeriesMutation.mutateAsync({ id: selectedSeries.id, data });
    }
  };

  const handleDeleteSeries = async (series: any) => {
    if (confirm("Bạn có chắc chắn muốn xóa series này?")) {
      await deleteSeriesMutation.mutateAsync(series.id);
    }
  };

  const handleAddPost = async (postId: string) => {
    if (selectedSeries) {
      await addPostToSeriesMutation.mutateAsync({ 
        seriesId: selectedSeries.id, 
        postId 
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý Series
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tạo và quản lý các series bài viết của bạn
          </p>
        </div>
        
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo Series Mới
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm series..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Tìm kiếm</Button>
      </form>

      {/* Series List */}
      <SeriesList 
        series={seriesData?.data?.content || []} 
        loading={isLoading}
        showActions={true}
        onEdit={(series) => {
          setSelectedSeries(series);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteSeries}
        onAddPost={(series) => {
          setSelectedSeries(series);
          setIsAddPostModalOpen(true);
        }}
      />

      {/* Pagination */}
      {seriesData?.data && seriesData.data.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              Trước
            </Button>
            
            <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
              Trang {page + 1} / {seriesData.data.totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page >= seriesData.data.totalPages - 1}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <SeriesModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSeries}
        loading={createSeriesMutation.isPending}
      />

      <SeriesModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSeries(null);
        }}
        onSubmit={handleEditSeries}
        series={selectedSeries}
        loading={updateSeriesMutation.isPending}
      />

      <AddPostToSeriesModal
        isOpen={isAddPostModalOpen}
        onClose={() => {
          setIsAddPostModalOpen(false);
          setSelectedSeries(null);
        }}
        series={selectedSeries}
        onAddPost={handleAddPost}
        loading={addPostToSeriesMutation.isPending}
      />
    </div>
  );
}