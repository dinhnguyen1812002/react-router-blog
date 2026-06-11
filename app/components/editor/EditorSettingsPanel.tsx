import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, PanelRightClose, X } from "lucide-react";
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
import { Label } from "~/components/ui/label";
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
import { Textarea } from "~/components/ui/textarea";
import ThumbnailUpload from "~/components/ui/ThumbnailUpload";
import { cn } from "~/lib/utils";
import type { Category, Tag as TagType } from "~/types";

export interface EditorSettings {
	excerpt: string;
	thumbnail: string;
	categories: number[];
	tags: string[];
	featured: boolean;
}

interface EditorSettingsPanelProps {
	settings: EditorSettings;
	onChange: (settings: EditorSettings) => void;
	collapsed: boolean;
	onToggleCollapse: () => void;
	className?: string;
}

export function EditorSettingsPanel({
	settings,
	onChange,
	collapsed,
	onToggleCollapse,
	className,
}: EditorSettingsPanelProps) {
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

	const update = (partial: Partial<EditorSettings>) => {
		onChange({ ...settings, ...partial });
	};

	const handleAddTag = (tagUuid: string) => {
		if (!settings.tags.includes(tagUuid)) {
			update({ tags: [...settings.tags, tagUuid] });
		}
	};

	const handleRemoveTag = (tagUuid: string) => {
		update({ tags: settings.tags.filter((t) => t !== tagUuid) });
	};

	if (collapsed) {
		return (
			<div className={cn("flex flex-col items-center py-4 px-2", className)}>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={onToggleCollapse}
					aria-label="Mở bảng cài đặt"
					className="h-9 w-9"
				>
					<PanelRightClose className="h-4 w-4 rotate-180" />
				</Button>
			</div>
		);
	}

	return (
		<aside
			className={cn(
				"flex flex-col h-full border-l border-border/60 bg-muted/20",
				className,
			)}
			aria-label="Cài đặt bài viết"
		>
			<div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
				<h2 className="text-sm font-medium text-foreground">Cài đặt</h2>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={onToggleCollapse}
					aria-label="Thu gọn bảng cài đặt"
					className="h-8 w-8"
				>
					<PanelRightClose className="h-4 w-4" />
				</Button>
			</div>

			<div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
				{/* Featured Image */}
				<section className="space-y-2">
					<Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Ảnh đại diện
					</Label>
					<ThumbnailUpload
						value={settings.thumbnail}
						onChange={(url) => update({ thumbnail: url })}
						onRemove={() => update({ thumbnail: "" })}
						maxSize={10}
						allowedTypes={[
							"image/jpeg",
							"image/png",
							"image/jpg",
							"image/gif",
							"image/webp",
						]}
					/>
				</section>

				{/* Category */}
				<section className="space-y-2">
					<Label
						htmlFor="editor-category"
						className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
					>
						Danh mục
					</Label>
					<Select
						value={settings.categories[0]?.toString() ?? ""}
						onValueChange={(value) =>
							update({
								categories: value ? [parseInt(value, 10)] : [],
							})
						}
					>
						<SelectTrigger id="editor-category" className="h-9 bg-background">
							<SelectValue placeholder="Chọn danh mục" />
						</SelectTrigger>
						<SelectContent>
							{isLoadingCategories ? (
								<div className="p-2 text-sm text-muted-foreground">
									Đang tải...
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
				</section>

				{/* Tags */}
				<section className="space-y-2">
					<Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Thẻ
					</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="outline"
								role="combobox"
								className="w-full justify-between h-9 bg-background text-sm font-normal"
							>
								{settings.tags.length > 0
									? `${settings.tags.length} thẻ đã chọn`
									: "Chọn thẻ..."}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
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
															settings.tags.includes(tag.uuid)
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
					{settings.tags.length > 0 && (
						<div className="flex flex-wrap gap-1.5 mt-2">
							{settings.tags.map((tagUuid) => {
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
											className="hover:opacity-70 transition-opacity"
											aria-label={`Xóa thẻ ${tag?.name ?? tagUuid}`}
										>
											<X className="h-3 w-3" />
										</button>
									</span>
								);
							})}
						</div>
					)}
				</section>

				{/* SEO / Excerpt */}
				<section className="space-y-2">
					<Label
						htmlFor="editor-excerpt"
						className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
					>
						Tóm tắt SEO
					</Label>
					<Textarea
						id="editor-excerpt"
						value={settings.excerpt}
						onChange={(e) => update({ excerpt: e.target.value })}
						placeholder="Mô tả ngắn cho công cụ tìm kiếm..."
						rows={3}
						className="resize-none bg-background text-sm"
					/>
					<p className="text-xs text-muted-foreground">
						{settings.excerpt.length}/160 ký tự khuyến nghị
					</p>
				</section>

				{/* Featured toggle */}
				<section className="flex items-center justify-between">
					<div>
						<Label className="text-sm font-medium">Bài viết nổi bật</Label>
						<p className="text-xs text-muted-foreground mt-0.5">
							Hiển thị trên trang chủ
						</p>
					</div>
					<button
						type="button"
						role="switch"
						aria-checked={settings.featured}
						onClick={() => update({ featured: !settings.featured })}
						className={cn(
							"relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
							settings.featured ? "bg-primary" : "bg-muted-foreground/30",
						)}
					>
						<span
							className={cn(
								"inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
								settings.featured ? "translate-x-6" : "translate-x-1",
							)}
						/>
					</button>
				</section>
			</div>
		</aside>
	);
}
