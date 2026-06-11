import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { seriesApi } from "~/api/series";
import {
	createSeriesSchema,
	toCreateSeriesPayload,
	type CreateSeriesFormValues,
} from "~/components/series/series-schemas";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { slugifyText } from "~/utils/slugify";

export default function NewSeriesPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const slugManuallyEdited = useRef(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<CreateSeriesFormValues>({
		resolver: zodResolver(createSeriesSchema),
		defaultValues: {
			title: "",
			slug: "",
			description: "",
			thumbnail: "",
			isActive: true,
			isCompleted: false,
		},
	});

	const createSeriesMutation = useMutation({
		mutationFn: seriesApi.createSeries,
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: ["user-series"] });
			toast.success("Tạo series thành công!");
			if (result.data?.id) {
				navigate(`/dashboard/series/${result.data.id}/manage`);
			} else {
				navigate("/dashboard/series");
			}
		},
		onError: () => toast.error("Có lỗi xảy ra khi tạo series"),
	});

	const onSubmit = async (data: CreateSeriesFormValues) => {
		try {
			setIsSubmitting(true);
			await createSeriesMutation.mutateAsync(toCreateSeriesPayload(data));
		} finally {
			setIsSubmitting(false);
		}
	};

	const isActive = watch("isActive");
	const isCompleted = watch("isCompleted");

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate("/dashboard/series")}
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Quay lại
				</Button>
				<div>
					<h1 className="text-2xl font-bold text-foreground">Tạo Series Mới</h1>
					<p className="text-muted-foreground mt-1">
						Tạo series mới để tổ chức các bài viết
					</p>
				</div>
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
								{...register("title", {
									onChange: (e) => {
										if (!slugManuallyEdited.current) {
											setValue("slug", slugifyText(e.target.value), {
												shouldValidate: true,
											});
										}
									},
								})}
								className={errors.title ? "border-destructive" : ""}
							/>
							{errors.title && (
								<p className="text-sm text-destructive">{errors.title.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Slug *</label>
							<Input
								{...register("slug", {
									onChange: () => {
										slugManuallyEdited.current = true;
									},
								})}
								className={errors.slug ? "border-destructive" : ""}
							/>
							<p className="text-xs text-muted-foreground">
								Tự động từ tiêu đề (5–250 ký tự, duy nhất).
							</p>
							{errors.slug && (
								<p className="text-sm text-destructive">{errors.slug.message}</p>
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
								onClick={() => navigate("/dashboard/series")}
								disabled={isSubmitting}
							>
								Hủy
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
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
