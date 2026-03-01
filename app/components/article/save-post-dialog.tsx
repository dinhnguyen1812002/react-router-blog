import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Tag, FolderOpen, X, Check, ChevronsUpDown, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { Input } from "../ui/input";
import ThumbnailUpload from "~/components/ui/ThumbnailUpload";
import type { Post, Category, Tag as TagType } from "~/types";
import { categoriesApi } from "~/api/categories";
import { tagsApi } from "~/api/tags";
import { Calendar24 } from "./data-time";
import { useAuthStore } from "~/store/authStore";
import {
  postFormSchema,
  type PostFormValues,
  type PostFormMetadata,
} from "~/schemas/post";

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
  
  const defaultValues: PostFormValues = useMemo(() => ({
    title: "",
    category: 0,
    tags: [],
    thumbnail: "",
    publishDate: "",
    isPublish: false,
    excerpt: "",
  }), []);
  
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema) as import("react-hook-form").Resolver<PostFormValues>,
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

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const { data: availableTags = [], isLoading: isLoadingTags } = useQuery<TagType[]>({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
  });

  useEffect(() => {
    if (open) {
      if (existingPost) {
        reset({
          title: existingPost.title ?? "",
          excerpt: existingPost.excerpt ?? "",
          category: existingPost.categories?.[0]?.id ?? 0,
          tags: existingPost.tags?.map((t) => t.uuid) ?? [],
          thumbnail: existingPost.thumbnail ?? existingPost.thumbnailUrl ?? "",
          publishDate: existingPost.public_date
            ? formatDateTimeForInput(existingPost.public_date)
            : "",
          isPublish: existingPost.is_publish ?? false,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, existingPost, reset]);

  const handleAddTag = (tagUuid: string) => {
    if (!tags.includes(tagUuid)) {
      setValue("tags", [...tags, tagUuid], { shouldValidate: true });
    }
  };

  const handleRemoveTag = (tagUuidToRemove: string) => {
    setValue(
      "tags",
      tags.filter((id) => id !== tagUuidToRemove),
      { shouldValidate: true }
    );
  };

  const onSubmit = (data: PostFormValues) => {
    if (!onSave) return;

    const categoryId = data.category;
    const tagUuids = data.tags;

    const publishDate = data.publishDate?.trim();
    const publishDateObj = publishDate ? new Date(publishDate) : null;
    const now = new Date();
    const isFuture = publishDateObj && publishDateObj > now;

    let status: import("~/schemas/post").PostVisibility = "DRAFT";
    let visibility: import("~/schemas/post").PostVisibility = "DRAFT";
    let scheduledPublishAt: string | undefined;
    let publicDate: string | undefined;

    if (data.isPublish) {
      if (isFuture && publishDate) {
        status = "SCHEDULED";
        visibility = "SCHEDULED";
        scheduledPublishAt = publishDateObj!.toISOString();
        publicDate = publishDateObj!.toISOString();
      } else {
        status = "PUBLISHED";
        visibility = "PUBLISHED";
        publicDate = now.toISOString();
      }
    }

    onSave({
      authorName: user?.username || user?.email || "Anonymous",
      title: data.title,
      excerpt: data.excerpt,
      content,
      createdAt: now.toISOString(),
      featured: false,
      thumbnail: data.thumbnail || undefined,
      categories: categoryId ? [categoryId] : undefined,
      tags: tagUuids.length > 0 ? tagUuids : undefined,
      public_date: publicDate,
      status,
      visibility,
      scheduledPublishAt,
    });
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => onOpenChange(false)}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800"
        >
          {/* Header */}
          <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Lưu bài viết
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                  Thêm thông tin metadata cho bài viết trước khi lưu
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 shrink-0"
                disabled={isLoading}
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content - Two Column Layout */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6 h-full">
              {/* Left Column - Form Fields */}
              <div className="lg:col-span-2 px-6 sm:px-8 py-6 space-y-6 border-r border-gray-200 dark:border-gray-700 lg:border-r lg:pr-6">
                {/* Section 1: Basic Information */}
                <section className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      Thông tin cơ bản
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Tiêu đề bài viết
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="text-sm font-medium text-foreground dark:text-white flex items-center gap-1"
                    >
                      Tiêu đề <span className="text-red-500" aria-hidden>*</span>
                    </label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Nhập tiêu đề bài viết"
                      className={cn(
                        "text-base h-11 font-medium",
                        errors.title && "border-red-500 focus-visible:ring-red-500"
                      )}
                      aria-invalid={!!errors.title}
                      aria-describedby={errors.title ? "title-error" : undefined}
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
                      className="text-sm font-medium text-foreground dark:text-white flex items-center gap-1"
                    >
                      Tóm tắt
                    </label>
                    <textarea
                      id="excerpt"
                      placeholder="Nhập tóm tắt ngắn về bài viết (tùy chọn)"
                      rows={3}
                      className={cn(
                        "w-full px-3 py-2 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
                        errors.excerpt && "border-red-500 focus-visible:ring-red-500"
                      )}
                      aria-invalid={!!errors.excerpt}
                      aria-describedby={errors.excerpt ? "excerpt-error" : undefined}
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

                {/* Section 2: Metadata */}
                <section className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      Phân loại & Tổ chức
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Danh mục, thẻ, và ngày xuất bản
                    </p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label
                      htmlFor="category"
                      className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-white"
                    >
                      <FolderOpen className="h-4 w-4" />
                      Danh mục <span className="text-red-500" aria-hidden>*</span>
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value, 10))}
                        >
                          <SelectTrigger
                            id="category" 
                            className={cn(
                              "w-full h-11",
                              errors.category && "border-red-500 focus:ring-red-500"
                            )}
                            aria-invalid={!!errors.category}
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
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  {cat.category}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.category && (
                      <div
                        role="alert"
                        className="flex items-center gap-2 text-xs text-red-500 mt-2"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.category.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Publish Date */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-white">
                      <Calendar className="h-4 w-4" />
                      Ngày xuất bản
                    </label>
                    <Controller
                      name="publishDate"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Calendar24
                            date={field.value}
                            setDate={(value: string) => field.onChange(value)}
                          />
                        </div>
                      )}
                    />
                  </div>

                  {/* Tags Selector */}
                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-white">
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
                              className="w-full justify-between h-10 bg-transparent dark:text-white text-sm"
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
                                <CommandEmpty>Không tìm thấy thẻ nào.</CommandEmpty>
                                {isLoadingTags ? (
                                  <div className="p-2 text-sm text-muted-foreground">
                                    Đang tải thẻ...
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
                                            field.value.includes(tag.uuid)
                                              ? "opacity-100"
                                              : "opacity-0"
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
                          const tag = availableTags.find((t) => t.uuid === tagUuid);
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

              {/* Right Column - Thumbnail & Publishing Status */}
              <div className="lg:col-span-1 px-6 sm:px-8 py-6 lg:py-6 space-y-6 lg:border-l border-gray-200 dark:border-gray-700 lg:pl-6 bg-gray-50/50 dark:bg-gray-800/30 lg:bg-transparent">
                {/* Thumbnail Section */}
                <section className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
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

                {/* Publishing Status Card */}
                <section className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800/50 space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      Trạng thái xuất bản
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Quản lý tình trạng của bài viết
                    </p>
                  </div>

                  <Controller
                    name="isPublish"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-3">
                        {/* Status Indicator */}
                        <div className="flex items-center gap-3 p-3 rounded-md bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800/50">
                          <div className={cn(
                            "w-3 h-3 rounded-full transition-all",
                            field.value 
                              ? "bg-green-500 shadow-lg shadow-green-500/50" 
                              : "bg-gray-400 shadow-lg shadow-gray-400/50"
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {field.value ? "Bài viết sẽ được xuất bản" : "Lưu dưới dạng nháp"}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                              {field.value 
                                ? watch("publishDate") 
                                  ? `Vào ${watch("publishDate")}` 
                                  : "Xuất bản ngay"
                                : "Bài viết sẽ ở chế độ nháp"}
                            </p>
                          </div>
                        </div>

                        {/* Toggle Button */}
                        <Button
                          type="button"
                          variant={field.value ? "secondary" : "outline"}
                          onClick={() => field.onChange(!field.value)}
                          disabled={isLoading}
                          className="w-full h-10 text-sm font-medium transition-all"
                        >
                          {field.value ? "Chuyển sang nháp" : "Xuất bản"}
                        </Button>

                        {/* Status Badge */}
                        <div className="flex gap-2">
                          <span className={cn(
                            "flex-1 px-2.5 py-2 rounded-md text-xs font-medium text-center transition-all",
                            field.value
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                          )}>
                            {field.value ? "✓ Sẵn sàng" : "— Nháp"}
                          </span>
                        </div>
                      </div>
                    )}
                  />
                </section>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 sm:py-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="dark:text-white h-10 px-4"
              disabled={isLoading}
              aria-label="Hủy bỏ"
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
          </div>
        </form>
      </div>
    </div>
  );
}
