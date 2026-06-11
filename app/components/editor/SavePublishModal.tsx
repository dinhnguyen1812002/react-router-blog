import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
	AlertCircle,
	Calendar,
	Check,
	ChevronsUpDown,
	FileText,
	FolderOpen,
	Globe,
	Lock,
	Send,
	Tag,
	X,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { categoriesApi } from "~/api/categories";
import { tagsApi } from "~/api/tags";
import { Calendar24 } from "~/components/article/data-time";
import { Button } from "~/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import ThumbnailUpload from "~/components/ui/ThumbnailUpload";
import { cn } from "~/lib/utils";
import {
	type PostFormMetadata,
	type PostFormValues,
	type PostVisibility,
	postFormSchema,
} from "~/schemas/post";
import type { Category, Post, Tag as TagType } from "~/types";

interface SavePublishModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave?: (metadata: PostFormMetadata) => void;
	existingPost?: Post;
	isLoading?: boolean;
	content?: string;
}

function formatDateTimeForInput(isoDate: string): string {
	const dateObj = new Date(isoDate);
	const year = dateObj.getFullYear();
	const month = String(dateObj.getMonth() + 1).padStart(2, "0");
	const day = String(dateObj.getDate()).padStart(2, "0");
	const hours = String(dateObj.getHours()).padStart(2, "0");
	const minutes = String(dateObj.getMinutes()).padStart(2, "0");
	return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

function formatSchedulePreview(datetime: string): string {
	if (!datetime) return "";
	try {
		return new Date(datetime).toLocaleString("vi-VN", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return datetime;
	}
}

const VISIBILITY_OPTIONS: {
	value: PostVisibility;
	label: string;
	description: string;
	icon: React.ReactNode;
	color: string;
}[] = [
	{
		value: "DRAFT",
		label: "Nháp",
		description: "Chỉ bạn có thể xem",
		icon: <FileText className="h-4 w-4" />,
		color: "border-muted-foreground/40",
	},
	{
		value: "PUBLISHED",
		label: "Công khai",
		description: "Hiển thị cho mọi người",
		icon: <Globe className="h-4 w-4" />,
		color: "border-green-500/50",
	},
	{
		value: "PRIVATE",
		label: "Riêng tư",
		description: "Chỉ bạn xem được",
		icon: <Lock className="h-4 w-4" />,
		color: "border-orange-500/50",
	},
];

export function SavePublishModal({
	open,
	onOpenChange,
	onSave,
	existingPost,
	isLoading = false,
	content = "",
}: SavePublishModalProps) {
	const defaultValues: PostFormValues = useMemo(
		() => ({
			title: "",
			content,
			excerpt: "",
			categories: [],
			tags: [],
			thumbnail: "",
			featured: false,
			visibility: "DRAFT",
			scheduledPublishAt: "",
			publishedAt: "",
		}),
		[content],
	);

	const form = useForm<PostFormValues>({
		resolver: zodResolver(
			postFormSchema,
		) as import("react-hook-form").Resolver<PostFormValues>,
		defaultValues,
	});

	const {
		register,
		handleSubmit,
		control,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = form;

	const tags = watch("tags");
	const visibility = watch("visibility");
	const scheduledPublishAt = watch("scheduledPublishAt");
	const isScheduled = visibility === "SCHEDULED";

	const { data: categories = [], isLoading: isLoadingCategories } = useQuery<
		Category[]
	>({
		queryKey: ["categories"],
		queryFn: categoriesApi.getAll,
	});

	const { data: availableTags = [], isLoading: isLoadingTags } = useQuery<
		TagType[]
	>({
		queryKey: ["tags"],
		queryFn: tagsApi.getAll,
	});

	useEffect(() => {
		if (open) {
			if (existingPost) {
				reset({
					title: existingPost.title ?? "",
					content,
					excerpt: existingPost.excerpt ?? "",
					categories: existingPost.categories?.map((c) => c.id) ?? [],
					tags: existingPost.tags?.map((t) => t.uuid) ?? [],
					thumbnail: existingPost.thumbnail ?? existingPost.thumbnailUrl ?? "",
					featured: existingPost.featured ?? false,
					visibility: existingPost.is_publish ? "PUBLISHED" : "DRAFT",
					scheduledPublishAt: existingPost.public_date
						? formatDateTimeForInput(existingPost.public_date)
						: "",
					publishedAt: existingPost.public_date
						? formatDateTimeForInput(existingPost.public_date)
						: "",
				});
			} else {
				reset({ ...defaultValues, content });
			}
		}
	}, [open, existingPost, reset, content, defaultValues]);

	const handleAddTag = (tagUuid: string) => {
		if (!tags.includes(tagUuid)) {
			setValue("tags", [...tags, tagUuid], { shouldValidate: true });
		}
	};

	const handleRemoveTag = (tagUuid: string) => {
		setValue(
			"tags",
			tags.filter((t) => t !== tagUuid),
			{ shouldValidate: true },
		);
	};

	const buildMetadata = (data: PostFormValues): PostFormMetadata => ({
		title: data.title,
		content: data.content,
		excerpt: data.excerpt || "",
		featured: data.featured,
		thumbnail: data.thumbnail || undefined,
		categories: data.categories.length > 0 ? data.categories : undefined,
		tags: data.tags.length > 0 ? data.tags : undefined,
		visibility: data.visibility,
		scheduledPublishAt:
			data.visibility === "SCHEDULED" ? data.scheduledPublishAt : undefined,
		publishedAt: data.publishedAt || undefined,
	});

	const handleDraftSave = () => {
		setValue("visibility", "DRAFT");
		handleSubmit((data) => {
			onSave?.({ ...buildMetadata({ ...data, visibility: "DRAFT" }) });
			onOpenChange(false);
		})();
	};

	const handlePublish = () => {
		handleSubmit((data) => {
			onSave?.(buildMetadata(data));
			onOpenChange(false);
		})();
	};

	const handleScheduleToggle = () => {
		setValue("visibility", "SCHEDULED", { shouldValidate: true });
		if (!scheduledPublishAt?.trim()) {
			const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000).toISOString();
			setValue(
				"scheduledPublishAt",
				formatDateTimeForInput(oneHourFromNow),
				{ shouldValidate: true },
			);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="sm:max-w-2xl rounded-2xl p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col"
				showCloseButton
			>
				<form
					onSubmit={(e) => e.preventDefault()}
					className="flex flex-col max-h-[90vh]"
				>
					<DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
						<DialogTitle className="text-lg font-semibold">
							Lưu bài viết
						</DialogTitle>
						<DialogDescription>
							Thêm thông tin và chọn cách xuất bản bài viết.
						</DialogDescription>
					</DialogHeader>

					<div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
						{/* Metadata */}
						<section className="space-y-4">
							<div className="space-y-2">
								<label htmlFor="title" className="text-sm font-medium">
									Tiêu đề <span className="text-destructive">*</span>
								</label>
								<Input
									id="title"
									placeholder="Nhập tiêu đề bài viết"
									className={cn(errors.title && "border-destructive")}
									{...register("title")}
								/>
								{errors.title && (
									<p className="text-xs text-destructive flex items-center gap-1">
										<AlertCircle className="h-3.5 w-3.5" />
										{errors.title.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<label htmlFor="excerpt" className="text-sm font-medium">
									Tóm tắt
								</label>
								<textarea
									id="excerpt"
									rows={2}
									placeholder="Mô tả ngắn về bài viết (tùy chọn)"
									className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
									{...register("excerpt")}
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium flex items-center gap-1.5">
										<FolderOpen className="h-4 w-4" />
										Danh mục
									</label>
									<Controller
										name="categories"
										control={control}
										render={({ field }) => (
											<Select
												value={field.value?.[0]?.toString() || ""}
												onValueChange={(value) =>
													field.onChange(value ? [parseInt(value, 10)] : [])
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Chọn danh mục" />
												</SelectTrigger>
												<SelectContent>
													{isLoadingCategories ? (
														<div className="p-2 text-sm text-muted-foreground">
															Đang tải...
														</div>
													) : (
														categories.map((cat) => (
															<SelectItem
																key={cat.id}
																value={cat.id.toString()}
															>
																{cat.category}
															</SelectItem>
														))
													)}
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium flex items-center gap-1.5">
										<Tag className="h-4 w-4" />
										Thẻ
									</label>
									<Controller
										name="tags"
										control={control}
										render={({ field }) => (
											<Popover>
												<PopoverTrigger asChild>
													<Button
														type="button"
														variant="outline"
														className="w-full justify-between font-normal"
													>
														{field.value.length > 0
															? `${field.value.length} thẻ`
															: "Chọn thẻ..."}
														<ChevronsUpDown className="h-4 w-4 opacity-50" />
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-full p-0" align="start">
													<Command>
														<CommandInput placeholder="Tìm thẻ..." />
														<CommandList>
															<CommandEmpty>Không tìm thấy thẻ.</CommandEmpty>
															{isLoadingTags ? (
																<div className="p-2 text-sm text-muted-foreground">
																	Đang tải...
																</div>
															) : (
																<CommandGroup>
																	{availableTags.map((tag) => (
																		<CommandItem
																			key={tag.uuid}
																			value={tag.name}
																			onSelect={() => handleAddTag(tag.uuid)}
																		>
																			<Check
																				className={cn(
																					"mr-2 h-4 w-4",
																					tags.includes(tag.uuid)
																						? "opacity-100"
																						: "opacity-0",
																				)}
																			/>
																			{tag.name}
																		</CommandItem>
																	))}
																</CommandGroup>
															)}
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
										)}
									/>
									{tags.length > 0 && (
										<div className="flex flex-wrap gap-1.5">
											{tags.map((tagUuid) => {
												const tag = availableTags.find((t) => t.uuid === tagUuid);
												return (
													<span
														key={tagUuid}
														className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-primary/10 text-primary border border-primary/20"
													>
														{tag?.name ?? tagUuid}
														<button
															type="button"
															onClick={() => handleRemoveTag(tagUuid)}
															aria-label="Xóa thẻ"
														>
															<X className="h-3 w-3" />
														</button>
													</span>
												);
											})}
										</div>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Ảnh đại diện</label>
								<Controller
									name="thumbnail"
									control={control}
									render={({ field }) => (
										<ThumbnailUpload
											value={field.value}
											onChange={(url) => field.onChange(url)}
											onRemove={() => field.onChange("")}
											maxSize={10}
										/>
									)}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Bài viết nổi bật</p>
									<p className="text-xs text-muted-foreground">
										Hiển thị trên trang chủ
									</p>
								</div>
								<Controller
									name="featured"
									control={control}
									render={({ field }) => (
										<button
											type="button"
											role="switch"
											aria-checked={field.value}
											onClick={() => field.onChange(!field.value)}
											className={cn(
												"relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
												field.value ? "bg-primary" : "bg-muted-foreground/30",
											)}
										>
											<span
												className={cn(
													"inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
													field.value ? "translate-x-6" : "translate-x-1",
												)}
											/>
										</button>
									)}
								/>
							</div>
						</section>

						<hr className="border-border/60" />

						{/* Publish options */}
						<section className="rounded-xl border border-border/60 p-4 bg-muted/20">
							<h3 className="text-sm font-medium mb-3">Lưu nháp nhanh</h3>
							<p className="text-xs text-muted-foreground mb-3">
								Lưu bài viết dưới dạng nháp, tiếp tục chỉnh sửa sau.
							</p>
							<Button
								type="button"
								variant="secondary"
								size="sm"
								className="rounded-full"
								disabled={isLoading}
								onClick={handleDraftSave}
							>
								Lưu nháp ngay
							</Button>
						</section>

						<section className="space-y-3">
							<h3 className="text-sm font-medium">Trạng thái bài viết</h3>
							<Controller
								name="visibility"
								control={control}
								render={({ field }) => (
									<div className="space-y-2" role="radiogroup">
										{VISIBILITY_OPTIONS.map((option) => (
											<button
												key={option.value}
												type="button"
												role="radio"
												aria-checked={field.value === option.value}
												onClick={() => {
													field.onChange(option.value);
													if (option.value !== "SCHEDULED") {
														setValue("scheduledPublishAt", "");
													}
												}}
												className={cn(
													"w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
													field.value === option.value
														? cn("bg-primary/5 border-primary/40", option.color)
														: "border-border/60 hover:bg-muted/30",
												)}
											>
												{option.icon}
												<div>
													<p className="text-sm font-medium">{option.label}</p>
													<p className="text-xs text-muted-foreground">
														{option.description}
													</p>
												</div>
											</button>
										))}
									</div>
								)}
							/>
						</section>

						<section className="space-y-3">
							<button
								type="button"
								onClick={handleScheduleToggle}
								className={cn(
									"w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
									isScheduled
										? "bg-amber-500/5 border-amber-500/40"
										: "border-border/60 hover:bg-muted/30",
								)}
							>
								<Calendar className="h-4 w-4" />
								<div>
									<p className="text-sm font-medium">Lên lịch đăng</p>
									<p className="text-xs text-muted-foreground">
										Chọn ngày và giờ xuất bản tự động
									</p>
								</div>
							</button>

							{isScheduled && (
								<div className="space-y-3 pl-1">
									<Controller
										name="scheduledPublishAt"
										control={control}
										render={({ field }) => (
											<Calendar24
												date={field.value}
												setDate={(value) => field.onChange(value)}
											/>
										)}
									/>
									{scheduledPublishAt && (
										<p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 border">
											Bài viết sẽ được đăng vào{" "}
											<span className="font-medium text-foreground">
												{formatSchedulePreview(scheduledPublishAt)}
											</span>
										</p>
									)}
								</div>
							)}
						</section>
					</div>

					<input type="hidden" {...register("content")} />

					<DialogFooter className="px-6 py-4 border-t bg-muted/20 gap-2 shrink-0">
						<Button
							type="button"
							variant="ghost"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}
							className="rounded-full"
						>
							Hủy
						</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={handleDraftSave}
							disabled={isLoading}
							className="rounded-full"
						>
							Lưu nháp
						</Button>
						<Button
							type="button"
							onClick={handlePublish}
							disabled={isLoading}
							className="rounded-full gap-2"
						>
							{isLoading ? (
								<>
									<span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
									Đang lưu...
								</>
							) : (
								<>
									<Send className="h-4 w-4" />
									{isScheduled ? "Lên lịch" : "Xuất bản"}
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
