import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { seriesApi } from "~/api/series";
import {
	toUpdateSeriesPayload,
	updateSeriesSchema,
	type UpdateSeriesFormValues,
} from "~/components/series/series-schemas";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

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
		setValue,
		watch,
	} = useForm<UpdateSeriesFormValues>({
		resolver: zodResolver(updateSeriesSchema),
	});

	const { data: seriesData, isLoading } = useQuery({
		queryKey: ["series-detail", id],
		queryFn: () => seriesApi.getSeriesById(id!),
		enabled: !!id,
	});

	const updateSeriesMutation = useMutation({
		mutationFn: (data: UpdateSeriesFormValues) =>
			seriesApi.updateSeries(id!, toUpdateSeriesPayload(data)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-series"] });
			queryClient.invalidateQueries({ queryKey: ["series-detail", id] });
			toast.success("Cập nhật series thành công!");
			navigate(`/dashboard/series/${id}/manage`);
		},
		onError: () => toast.error("Có lỗi xảy ra khi cập nhật series"),
	});

	const deleteSeriesMutation = useMutation({
		mutationFn: () => seriesApi.deleteSeries(id!),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-series"] });
			toast.success("Xóa series thành công!");
			navigate("/dashboard/series");
		},
		onError: () => toast.error("Có lỗi xảy ra khi xóa series"),
	});

	useEffect(() => {
		if (seriesData?.data) {
			const s = seriesData.data;
			reset({
				title: s.title,
				description: s.description,
				thumbnail: s.thumbnail ?? "",
				isActive: s.isActive ?? true,
				isCompleted: s.isCompleted ?? false,
			});
		}
	}, [seriesData, reset]);

	const onSubmit = async (data: UpdateSeriesFormValues) => {
		try {
			setIsSubmitting(true);
			await updateSeriesMutation.mutateAsync(data);
		} finally {
			setIsSubmitting(false);
		}
	};

	const isActive = watch("isActive");
	const isCompleted = watch("isCompleted");

	if (isLoading) {
		return (
			<div className="max-w-2xl mx-auto animate-pulse space-y-4">
				<div className="h-8 bg-muted rounded w-1/3" />
				<div className="h-64 bg-muted rounded" />
			</div>
		);
	}

	if (!seriesData?.data) {
		return (
			<div className="max-w-2xl mx-auto text-center py-12">
				<h1 className="text-2xl font-bold text-destructive mb-4">
					Không tìm thấy series
				</h1>
				<Button onClick={() => navigate("/dashboard/series")}>
					Quay lại danh sách
				</Button>
			</div>
		);
	}

	const series = seriesData.data;

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate(`/dashboard/series/${id}/manage`)}
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Quay lại
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold text-foreground">Chỉnh sửa Series</h1>
					<p className="text-muted-foreground mt-1 text-sm">
						Slug: <code>{series.slug}</code>
					</p>
				</div>
				<Button
					variant="destructive"
					size="sm"
					onClick={() => {
						if (confirm("Xóa series này?")) deleteSeriesMutation.mutate();
					}}
					disabled={deleteSeriesMutation.isPending}
				>
					<Trash2 className="h-4 w-4 mr-2" />
					Xóa
				</Button>
			</div>

			<Card>
				<CardHeader>
					<h2 className="text-lg font-semibold">Thông tin Series</h2>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-medium">Tiêu đề *</label>
							<Input
								{...register("title")}
								className={errors.title ? "border-destructive" : ""}
							/>
							{errors.title && (
								<p className="text-sm text-destructive">{errors.title.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Mô tả *</label>
							<Textarea rows={4} {...register("description")} />
							{errors.description && (
								<p className="text-sm text-destructive">
									{errors.description.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Thumbnail (URL)</label>
							<Input {...register("thumbnail")} placeholder="https://..." />
						</div>

						<div className="flex flex-wrap gap-4">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={isActive}
									onChange={(e) => setValue("isActive", e.target.checked)}
								/>
								<span className="text-sm">Đang hoạt động</span>
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={isCompleted}
									onChange={(e) => setValue("isCompleted", e.target.checked)}
								/>
								<span className="text-sm">Đã hoàn thành</span>
							</label>
						</div>

						<div className="flex gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate(`/dashboard/series/${id}/manage`)}
							>
								Hủy
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
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
