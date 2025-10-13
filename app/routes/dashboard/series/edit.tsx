import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { seriesApi } from "~/api/series";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

const seriesSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(200, "Tiêu đề không được quá 200 ký tự"),
  description: z.string().min(1, "Mô tả là bắt buộc").max(500, "Mô tả không được quá 500 ký tự"),
});

type SeriesForm = z.infer<typeof seriesSchema>;

export default function EditSeriesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SeriesForm>({
    resolver: zodResolver(seriesSchema),
  });

  // Get series data
  const { data: seriesData, isLoading } = useQuery({
    queryKey: ["series", id],
    queryFn: () => seriesApi.getSeriesById(id!),
    enabled: !!id,
  });

  // Update series mutation
  const updateSeriesMutation = useMutation({
    mutationFn: (data: SeriesForm) => seriesApi.updateSeries(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-series"] });
      queryClient.invalidateQueries({ queryKey: ["series", id] });
      toast.success("Cập nhật series thành công!");
      navigate("/dashboard/series");
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi cập nhật series");
      console.error("Update series error:", error);
    },
  });

  // Delete series mutation
  const deleteSeriesMutation = useMutation({
    mutationFn: () => seriesApi.deleteSeries(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-series"] });
      toast.success("Xóa series thành công!");
      navigate("/dashboard/series");
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi xóa series");
      console.error("Delete series error:", error);
    },
  });

  // Reset form when series data is loaded
  useEffect(() => {
    if (seriesData?.data) {
      reset({
        title: seriesData.data.title,
        description: seriesData.data.description,
      });
    }
  }, [seriesData, reset]);

  const onSubmit = async (data: SeriesForm) => {
    try {
      setIsSubmitting(true);
      await updateSeriesMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error updating series:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa series này? Hành động này không thể hoàn tác.")) {
      await deleteSeriesMutation.mutateAsync();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!seriesData?.data) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Không tìm thấy series
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Series bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button onClick={() => navigate("/dashboard/series")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/series")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chỉnh sửa Series
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Cập nhật thông tin series của bạn
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleteSeriesMutation.isPending}
        >
          {deleteSeriesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Thông tin Series</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Tiêu đề Series *
              </label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Nhập tiêu đề series..."
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Mô tả Series *
              </label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Nhập mô tả series..."
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/series")}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Cập nhật
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
