import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import type { CreateSeriesRequest, Series, UpdateSeriesRequest } from "~/types";
import { slugifyText } from "~/utils/slugify";
import {
	createSeriesSchema,
	toCreateSeriesPayload,
	toUpdateSeriesPayload,
	updateSeriesSchema,
	type CreateSeriesFormValues,
	type UpdateSeriesFormValues,
} from "./series-schemas";

interface SeriesModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmitCreate: (data: CreateSeriesRequest) => Promise<void>;
	onSubmitUpdate: (data: UpdateSeriesRequest) => Promise<void>;
	series?: Series | null;
	loading?: boolean;
}

function StatusCheckboxes({
	isActive,
	isCompleted,
	onActiveChange,
	onCompletedChange,
}: {
	isActive: boolean;
	isCompleted: boolean;
	onActiveChange: (v: boolean) => void;
	onCompletedChange: (v: boolean) => void;
}) {
	return (
		<div className="flex flex-col sm:flex-row gap-4 pt-2">
			<label className="flex items-center gap-2 cursor-pointer">
				<input
					type="checkbox"
					checked={isActive}
					onChange={(e) => onActiveChange(e.target.checked)}
					className="rounded border-border"
				/>
				<span className="text-sm">Đang hoạt động</span>
			</label>
			<label className="flex items-center gap-2 cursor-pointer">
				<input
					type="checkbox"
					checked={isCompleted}
					onChange={(e) => onCompletedChange(e.target.checked)}
					className="rounded border-border"
				/>
				<span className="text-sm">Đã hoàn thành</span>
			</label>
		</div>
	);
}

export const SeriesModal = ({
	isOpen,
	onClose,
	onSubmitCreate,
	onSubmitUpdate,
	series,
	loading = false,
}: SeriesModalProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const slugManuallyEdited = useRef(false);
	const isEdit = !!series;

	const createForm = useForm<CreateSeriesFormValues>({
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

	const updateForm = useForm<UpdateSeriesFormValues>({
		resolver: zodResolver(updateSeriesSchema),
		defaultValues: {
			title: "",
			description: "",
			thumbnail: "",
			isActive: true,
			isCompleted: false,
		},
	});

	useEffect(() => {
		if (!isOpen) return;
		slugManuallyEdited.current = false;
		if (isEdit && series) {
			updateForm.reset({
				title: series.title,
				description: series.description,
				thumbnail: series.thumbnail ?? "",
				isActive: series.isActive ?? true,
				isCompleted: series.isCompleted ?? false,
			});
		} else {
			createForm.reset({
				title: "",
				slug: "",
				description: "",
				thumbnail: "",
				isActive: true,
				isCompleted: false,
			});
		}
	}, [isOpen, isEdit, series, createForm, updateForm]);

	const handleClose = () => {
		createForm.reset();
		updateForm.reset();
		slugManuallyEdited.current = false;
		onClose();
	};

	const pending = isSubmitting || loading;

	if (isEdit) {
		const {
			register,
			handleSubmit,
			formState: { errors },
			setValue,
			watch,
		} = updateForm;

		return (
			<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
				<DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Chỉnh sửa Series</DialogTitle>
					</DialogHeader>
					<form
						onSubmit={handleSubmit(async (data) => {
							try {
								setIsSubmitting(true);
								await onSubmitUpdate(toUpdateSeriesPayload(data));
								handleClose();
							} catch (e) {
								console.error(e);
							} finally {
								setIsSubmitting(false);
							}
						})}
						className="space-y-4"
					>
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
						<p className="text-xs text-muted-foreground">
							Slug: <code className="text-foreground">{series?.slug}</code> (không
							đổi khi cập nhật)
						</p>
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
						<StatusCheckboxes
							isActive={watch("isActive")}
							isCompleted={watch("isCompleted")}
							onActiveChange={(v) =>
								setValue("isActive", v, { shouldDirty: true })
							}
							onCompletedChange={(v) =>
								setValue("isCompleted", v, { shouldDirty: true })
							}
						/>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={handleClose}>
								Hủy
							</Button>
							<Button type="submit" disabled={pending}>
								{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Cập nhật
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		);
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = createForm;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Tạo Series Mới</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(async (data) => {
						try {
							setIsSubmitting(true);
							await onSubmitCreate(toCreateSeriesPayload(data));
							handleClose();
						} catch (e) {
							console.error(e);
						} finally {
							setIsSubmitting(false);
						}
					})}
					className="space-y-4"
				>
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
							Tự động tạo từ tiêu đề (5–250 ký tự).
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
					<StatusCheckboxes
						isActive={watch("isActive")}
						isCompleted={watch("isCompleted")}
						onActiveChange={(v) => setValue("isActive", v, { shouldDirty: true })}
						onCompletedChange={(v) =>
							setValue("isCompleted", v, { shouldDirty: true })
						}
					/>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleClose}>
							Hủy
						</Button>
						<Button type="submit" disabled={pending}>
							{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Tạo Series
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
