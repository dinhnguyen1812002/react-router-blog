import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
	AlertCircle,
	Calendar,
	Check,
	ChevronsUpDown,
	FolderOpen,
	Tag,
	X,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { categoriesApi } from "~/api/categories";
import { tagsApi } from "~/api/tags";
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
	postFormSchema,
} from "~/schemas/post";
import { useAuthStore } from "~/store/authStore";
import type { Category, Post, Tag as TagType } from "~/types";
import { Calendar24 } from "./data-time";

interface SavePostDialogProps {
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

export function SavePostDialog({
	open,
	onOpenChange,
	onSave,
	existingPost,
	isLoading = false,
	content = "",
}: SavePostDialogProps) {
	const { user } = useAuthStore();

	const defaultValues: PostFormValues = useMemo(
		() => ({
			title: "",
			content: content,
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
					content: content,
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
				reset(defaultValues);
			}
		}
	}, [open, existingPost, reset, content, defaultValues]);

	const handleAddTag = (tagName: string) => {
		if (!tags.includes(tagName)) {
			setValue("tags", [...tags, tagName], { shouldValidate: true });
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setValue(
			"tags",
			tags.filter((name) => name !== tagToRemove),
			{ shouldValidate: true },
		);
	};

	const onSubmit = (data: PostFormValues) => {
		if (!onSave) return;

		const metadata = {
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
		};

		onSave(metadata);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="w-[min(1400px,calc(100vw-2rem))] max-w-none sm:max-w-none p-0 overflow-hidden"
				showCloseButton
			>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex max-h-[85vh] flex-col"
				>
					<DialogHeader className="px-6 sm:px-8 py-5 border-b">
						<DialogTitle>Lưu bài viết</DialogTitle>
						<DialogDescription>
							Thêm thông tin metadata cho bài viết trước khi lưu.
						</DialogDescription>
					</DialogHeader>

					<div className="flex-1 overflow-y-auto">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6 h-full">
							<div className="lg:col-span-2 px-6 sm:px-8 py-6 space-y-6 lg:border-r lg:pr-6">
								<section className="space-y-4">
									<div>
										<h3 className="text-base font-semibold text-foreground">
											Thông tin cơ bản
										</h3>
										<p className="text-xs text-muted-foreground mt-1">
											Tiêu đề và tóm tắt
										</p>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="title"
											className="text-sm font-medium text-foreground flex items-center gap-1"
										>
											Tiêu đề{" "}
											<span className="text-red-500" aria-hidden>
												*
											</span>
										</label>
										<Input
											id="title"
											type="text"
											placeholder="Nhập tiêu đề bài viết"
											className={cn(
												"text-base h-11 font-medium",
												errors.title &&
													"border-red-500 focus-visible:ring-red-500",
											)}
											aria-invalid={!!errors.title}
											aria-describedby={
												errors.title ? "title-error" : undefined
											}
											{...register("title")}
										/>
										{errors.title && (
											<div
												id="title-error"
												role="alert"
												className="flex items-center gap-2 text-xs text-red-500 mt-2"
											>
												<AlertCircle className="h-3.5 w-3.5 shrink-0" />
												<span>{errors.title.message}</span>
											</div>
										)}
									</div>

									<div className="space-y-2">
										<label
											htmlFor="excerpt"
											className="text-sm font-medium text-foreground flex items-center gap-1"
										>
											Tóm tắt
										</label>
										<textarea
											id="excerpt"
											placeholder="Nhập tóm tắt ngắn về bài viết (tùy chọn)"
											rows={3}
											className={cn(
												"w-full px-3 py-2 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
												errors.excerpt &&
													"border-red-500 focus-visible:ring-red-500",
											)}
											aria-invalid={!!errors.excerpt}
											aria-describedby={
												errors.excerpt ? "excerpt-error" : undefined
											}
											{...register("excerpt")}
										/>
										{errors.excerpt && (
											<div
												id="excerpt-error"
												role="alert"
												className="flex items-center gap-2 text-xs text-red-500 mt-2"
											>
												<AlertCircle className="h-3.5 w-3.5 shrink-0" />
												<span>{errors.excerpt.message}</span>
											</div>
										)}
									</div>
								</section>

								<section className="space-y-4">
									<div>
										<h3 className="text-base font-semibold text-foreground">
											Phân loại & Tổ chức
										</h3>
										<p className="text-xs text-muted-foreground mt-1">
											Danh mục, thẻ, và ngày xuất bản
										</p>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="categories"
											className="flex items-center gap-2 text-sm font-medium text-foreground"
										>
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
													<SelectTrigger
														id="categories"
														className="w-full h-11"
													>
														<SelectValue placeholder="Chọn danh mục" />
													</SelectTrigger>
													<SelectContent>
														{isLoadingCategories ? (
															<div className="p-2 text-sm text-muted-foreground">
																Đang tải danh mục...
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

									<div className="space-y-2 pt-2">
										<label className="flex items-center gap-2 text-sm font-medium text-foreground">
											<Tag className="h-4 w-4" />
											Thẻ (Tags)
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
															role="combobox"
															className="w-full justify-between h-10 bg-transparent text-sm"
														>
															{field.value.length > 0
																? `${field.value.length} thẻ`
																: "Chọn thẻ..."}
															<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-full p-0" align="start">
														<Command>
															<CommandInput placeholder="Tìm kiếm thẻ..." />
															<CommandList>
																<CommandEmpty>
																	Không tìm thấy thẻ nào.
																</CommandEmpty>
																{isLoadingTags ? (
																	<div className="p-2 text-sm text-muted-foreground">
																		Đang tải thẻ...
																	</div>
																) : (
																	<CommandGroup>
																		{availableTags.map((tag) => (
																			<CommandItem
																				key={tag.uuid}
																				value={tag.uuid}
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
											<div className="flex flex-wrap gap-2 mt-3">
												{tags.map((tagUuid) => {
													const tag = availableTags.find(
														(t) => t.uuid === tagUuid,
													);
													return (
														<span
															key={tagUuid}
															className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
														>
															{tag?.name ?? tagUuid}
															<button
																type="button"
																onClick={() => handleRemoveTag(tagUuid)}
																className="hover:text-primary/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
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
								</section>
							</div>

							<div className="lg:col-span-1 px-6 sm:px-8 py-6 space-y-6 lg:pl-6 bg-muted/30 lg:bg-transparent">
								<section className="space-y-3">
									<h3 className="text-base font-semibold text-foreground">
										Ảnh đại diện
									</h3>
									<div className="space-y-2">
										<Controller
											name="thumbnail"
											control={control}
											render={({ field }) => (
												<ThumbnailUpload
													value={field.value}
													onChange={(url) => field.onChange(url)}
													onRemove={() => field.onChange("")}
													maxSize={10}
													allowedTypes={[
														"image/jpeg",
														"image/png",
														"image/jpg",
														"image/gif",
														"image/webp",
													]}
												/>
											)}
										/>
										{errors.thumbnail && (
											<div
												role="alert"
												className="flex items-center gap-2 text-xs text-red-500"
											>
												<AlertCircle className="h-3.5 w-3.5 shrink-0" />
												<span>{errors.thumbnail.message}</span>
											</div>
										)}
									</div>
								</section>

								<section className="space-y-3">
									<div className="flex items-center justify-between">
										<h3 className="text-base font-semibold text-foreground">
											Nổi bật
										</h3>
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
														field.value ? "bg-primary" : "bg-gray-200",
													)}
												>
													<span
														className={cn(
															"inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
															field.value ? "translate-x-6" : "translate-x-1",
														)}
													/>
												</button>
											)}
										/>
									</div>
									<p className="text-xs text-muted-foreground">
										Đánh dấu bài viết này là nổi bật để hiển thị nổi bật trên
										trang chủ.
									</p>
								</section>

								<section className="rounded-lg border p-4 bg-background space-y-4">
									<div>
										<h3 className="text-base font-semibold text-foreground">
											Trạng thái xuất bản
										</h3>
										<p className="text-xs text-muted-foreground mt-1">
											Chọn nháp, riêng tư, xuất bản ngay hoặc lên lịch.
										</p>
									</div>

									<div className="space-y-3">
										<div className="grid grid-cols-2 gap-2">
											<Button
												type="button"
												variant={visibility === "DRAFT" ? "default" : "outline"}
												className="h-10 text-sm"
												disabled={isLoading}
												onClick={() => {
													setValue("visibility", "DRAFT", {
														shouldValidate: true,
													});
													setValue("scheduledPublishAt", "", {
														shouldValidate: true,
													});
												}}
											>
												Nháp
											</Button>
											<Button
												type="button"
												variant={
													visibility === "PRIVATE" ? "default" : "outline"
												}
												className="h-10 text-sm"
												disabled={isLoading}
												onClick={() => {
													setValue("visibility", "PRIVATE", {
														shouldValidate: true,
													});
													setValue("scheduledPublishAt", "", {
														shouldValidate: true,
													});
												}}
											>
												Riêng tư
											</Button>
										</div>
										<div className="grid grid-cols-2 gap-2">
											<Button
												type="button"
												variant={
													visibility === "PUBLISHED" ? "default" : "outline"
												}
												className="h-10 text-sm"
												disabled={isLoading}
												onClick={() => {
													setValue("visibility", "PUBLISHED", {
														shouldValidate: true,
													});
													setValue("scheduledPublishAt", "", {
														shouldValidate: true,
													});
												}}
											>
												Xuất bản
											</Button>
											<Button
												type="button"
												variant={
													visibility === "SCHEDULED" ? "default" : "outline"
												}
												className="h-10 text-sm"
												disabled={isLoading}
												onClick={() => {
													setValue("visibility", "SCHEDULED", {
														shouldValidate: true,
													});
													if (!scheduledPublishAt?.trim()) {
														const oneHourFromNow = new Date(
															Date.now() + 60 * 60 * 1000,
														).toISOString();
														setValue(
															"scheduledPublishAt",
															formatDateTimeForInput(oneHourFromNow),
															{
																shouldValidate: true,
															},
														);
													}
												}}
											>
												Lên lịch
											</Button>
										</div>

										<div className="flex items-start gap-3 p-3 rounded-md bg-muted border">
											<div
												className={cn(
													"mt-1 w-2.5 h-2.5 rounded-full",
													visibility === "DRAFT"
														? "bg-gray-400"
														: visibility === "PRIVATE"
															? "bg-orange-500"
															: visibility === "SCHEDULED"
																? "bg-amber-500"
																: "bg-green-500",
												)}
											/>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground">
													{visibility === "DRAFT"
														? "Bài viết được lưu dưới dạng nháp"
														: visibility === "PRIVATE"
															? "Bài viết chỉ hiển thị cho bạn"
															: visibility === "SCHEDULED"
																? "Bài viết sẽ được xuất bản theo lịch"
																: "Bài viết sẽ được xuất bản ngay"}
												</p>
												<p className="text-xs text-muted-foreground mt-0.5">
													{visibility === "DRAFT"
														? "Không hiển thị công khai."
														: visibility === "PRIVATE"
															? "Chỉ bạn có thể xem bài viết này."
															: visibility === "SCHEDULED"
																? `Thời gian: ${scheduledPublishAt}`
																: "Hiển thị công khai sau khi lưu."}
												</p>
											</div>
										</div>

										{visibility === "SCHEDULED" && (
											<div className="space-y-2">
												<label className="flex items-center gap-2 text-sm font-medium text-foreground">
													<Calendar className="h-4 w-4" />
													Thời gian xuất bản
												</label>
												<Controller
													name="scheduledPublishAt"
													control={control}
													render={({ field }) => (
														<div>
															<Calendar24
																date={field.value}
																setDate={(value: string) =>
																	field.onChange(value)
																}
															/>
														</div>
													)}
												/>
											</div>
										)}
									</div>
								</section>
							</div>
						</div>
					</div>

					{/* Hidden field to ensure content is always included in form data */}
					<input type="hidden" {...register("content")} />

					<DialogFooter className="px-6 sm:px-8 py-4 border-t bg-background">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="h-10 px-4"
							disabled={isLoading}
						>
							Hủy
						</Button>
						<Button
							type="submit"
							disabled={isLoading}
							className="h-10 px-6"
							aria-busy={isLoading}
						>
							{isLoading ? (
								<span className="flex items-center gap-2">
									<span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
									Đang lưu...
								</span>
							) : (
								"Lưu bài viết"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
