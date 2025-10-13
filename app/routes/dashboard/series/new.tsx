import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { seriesApi } from "~/api/series";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const seriesSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(200, "Tiêu đề không được quá 200 ký tự"),
  description: z.string().min(1, "Mô tả là bắt buộc").max(500, "Mô tả không được quá 500 ký tự"),
});

type SeriesForm = z.infer<typeof seriesSchema>;

export default function NewSeriesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SeriesForm>({
    resolver: zodResolver(seriesSchema),
  });

  const createSeriesMutation = useMutation({
    mutationFn: seriesApi.createSeries,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-series"] });
      toast.success("Tạo series thành công!");
      navigate(`/dashboard/series`);
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi tạo series");
      console.error("Create series error:", error);
    },
  });

  const onSubmit = async (data: SeriesForm) => {
    try {
      setIsSubmitting(true);
      await createSeriesMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error creating series:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/series")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 ">
            Tạo Series Mới
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tạo một series mới để tổ chức các bài viết của bạn
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Thông tin Series</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tiêu đề Series *
              </label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Nhập tiêu đề series..."
                className={errors.title ? "border-red-500 dark:border-red-400" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mô tả Series *
              </label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Nhập mô tả series..."
                rows={4}
                className={errors.description ? "border-red-500 dark:border-red-400" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.description.message}</p>
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
                Tạo Series
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
