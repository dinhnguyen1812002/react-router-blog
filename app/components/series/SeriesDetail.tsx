import {
	ArrowLeft,
	ArrowRight,
	BookOpen,
	Calendar,
	Edit,
	Eye,
	FileText,
	Image,
	Plus,
	Trash2,
	User,
} from "lucide-react";
import { Link } from "react-router";
import { SeriesPostsManager } from "~/components/series/SeriesPostsManager";
import { Button } from "~/components/ui/button";
import { formatDateSimple } from "~/lib/utils";
import type { Series, SeriesPost } from "~/types";
import { getSeriesPostCount, getSeriesPostId } from "~/utils/series";

interface SeriesDetailProps {
	series: Series;
	showActions?: boolean;
	backLink?: string;
	backLabel?: string;
	onEdit?: () => void;
	onDelete?: () => void;
	onAddPost?: () => void;
	posts?: SeriesPost[];
	onMovePostUp?: (index: number) => void;
	onMovePostDown?: (index: number) => void;
	onRemovePost?: (postId: string) => void;
	onReorderPosts?: (posts: SeriesPost[]) => void;
	isReordering?: boolean;
	removingPostId?: string | null;
}

export const SeriesDetail = ({
	series,
	showActions = false,
	backLink = "/series",
	backLabel = "Tất cả series",
	onEdit,
	onDelete,
	onAddPost,
	posts,
	onMovePostUp,
	onMovePostDown,
	onRemovePost,
	onReorderPosts,
	isReordering = false,
	removingPostId = null,
}: SeriesDetailProps) => {
	const displayPosts = posts ?? series.posts ?? [];
	const postCount = getSeriesPostCount({ ...series, posts: displayPosts });
	const authorName = series.username || series.author?.username || "Unknown";

	return (
		<div className="min-h-screen font-sans">
			{/* Back Navigation */}
			<div className="container mx-auto max-w-6xl px-4 sm:px-6">
				<Button
					variant="ghost"
					size="sm"
					asChild
					className="mt-6 -ml-2 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-transparent px-2 text-[13px] font-normal"
				>
					<Link to={backLink}>
						<ArrowLeft className="h-3.5 w-3.5" />
						{backLabel}
					</Link>
				</Button>

				{/* Hero Section */}
				<div className="pt-8 pb-8 border-b border-border/40">
					{/* Status indicator */}
					<div className="flex items-center gap-2 mb-5">
						<span
							className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${
								series.isCompleted ? "bg-muted-foreground" : "bg-emerald-600"
							}`}
						/>
						<span className="text-[11px] tracking-[0.08em] uppercase text-muted-foreground font-normal">
							{series.isCompleted ? "Đã hoàn thành" : "Đang tiến hành"}
						</span>
					</div>

					{/* Title */}
					<h1 className="text-[clamp(28px,5vw,42px)] font-serif font-normal leading-[1.15] tracking-[-0.01em] text-foreground mb-4">
						{series.title}
					</h1>

					{/* Description */}
					{series.description && (
						<p className="text-[15px] leading-[1.65] text-muted-foreground font-light max-w-xl mb-6">
							{series.description}
						</p>
					)}

					{/* Meta */}
					<div className="flex flex-wrap items-center text-[13px] text-muted-foreground">
						<div className="flex items-center gap-1.5 pr-4 mr-4 border-r border-border/40">
							<User className="h-3.5 w-3.5" />
							<span>{authorName}</span>
						</div>
						<div className="flex items-center gap-1.5 pr-4 mr-4 border-r border-border/40">
							<FileText className="h-3.5 w-3.5" />
							<span>{postCount} bài viết</span>
						</div>
						<div className="flex items-center gap-1.5 pr-4 mr-4 border-r border-border/40">
							<Calendar className="h-3.5 w-3.5" />
							<span>{formatDateSimple(series.createdAt)}</span>
						</div>
						{series.viewCount != null && (
							<div className="flex items-center gap-1.5">
								<Eye className="h-3.5 w-3.5" />
								<span>{series.viewCount.toLocaleString()} lượt xem</span>
							</div>
						)}
					</div>

					{/* Thumbnail */}
					{series.thumbnail ? (
						<img
							src={series.thumbnail}
							alt={series.title}
							className="mt-6 w-full max-w-lg aspect-video object-cover rounded-[4px]"
						/>
					) : (
						<div className="mt-6 w-full max-w-lg aspect-video bg-muted/50 rounded-[4px] flex items-center justify-center">
							<Image className="h-7 w-7 text-muted-foreground/30" />
						</div>
					)}

					{/* Action Buttons */}
					{showActions && (
						<div className="flex gap-2 mt-6">
							{onEdit && (
								<button
									onClick={onEdit}
									className="inline-flex items-center gap-1.5 text-[13px] px-3.5 py-1.5 border border-border/60 rounded-[4px] bg-transparent text-foreground hover:bg-muted/50 transition-colors font-normal"
								>
									<Edit className="h-3.5 w-3.5" />
									Chỉnh sửa
								</button>
							)}
							{onDelete && (
								<button
									onClick={onDelete}
									className="inline-flex items-center gap-1.5 text-[13px] px-3.5 py-1.5 border border-destructive/40 rounded-[4px] bg-transparent text-destructive hover:bg-destructive/5 transition-colors font-normal"
								>
									<Trash2 className="h-3.5 w-3.5" />
									Xóa series
								</button>
							)}
						</div>
					)}
				</div>

				{/* Posts Section */}
				<div className="py-8 pb-16">
					{/* Section header */}
					<div className="flex items-baseline justify-between mb-3">
						<span className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground/60 font-normal">
							Bài viết
						</span>
						{showActions && onAddPost && (
							<button
								onClick={onAddPost}
								className="inline-flex items-center gap-1.5 text-[13px] px-3 py-1.5 border border-border/60 rounded-[4px] bg-transparent text-foreground hover:bg-muted/50 transition-colors font-normal"
							>
								<Plus className="h-3.5 w-3.5" />
								Thêm bài
							</button>
						)}
					</div>

					<div className="w-full h-px bg-border/40" />

					{/* Posts List */}
					{showActions &&
					onMovePostUp &&
					onMovePostDown &&
					onRemovePost ? (
						<div className="mt-4">
							<SeriesPostsManager
								posts={displayPosts}
								onReorder={onReorderPosts ?? (() => {})}
								onMoveUp={onMovePostUp}
								onMoveDown={onMovePostDown}
								onRemove={onRemovePost}
								isReordering={isReordering}
								removingPostId={removingPostId}
							/>
						</div>
					) : displayPosts.length === 0 ? (
						<div className="py-12">
							<p className="text-[14px] text-muted-foreground/50 font-light">
								Series này chưa có bài viết nào.
							</p>
						</div>
					) : (
						<div className="mt-6 space-y-6">
							{displayPosts.map((post, index) => (
								<Link
									key={getSeriesPostId(post)}
									to={`/articles/${post.slug}`}
									className="group block hover:no-underline"
								>
									<article className="flex gap-5 pb-6 border-b border-border/30 last:border-none">
										{/* Order Number */}
										<div className="shrink-0 pt-1">
											<span className="text-[11px] tracking-[0.06em] text-muted-foreground/40 font-normal">
												{String(post.orderIndex ?? index + 1).padStart(2, "0")}
											</span>
										</div>

										{/* Thumbnail */}
										{post.thumbnail ? (
											<div className="shrink-0 w-32 h-24 sm:w-40 sm:h-28 rounded overflow-hidden bg-muted">
												<img
													src={post.thumbnail}
													alt={post.title}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											</div>
										) : (
											<div className="shrink-0 w-32 h-24 sm:w-40 sm:h-28 rounded bg-muted/50 flex items-center justify-center">
												<Image className="h-6 w-6 text-muted-foreground/20" />
											</div>
										)}

										{/* Content */}
										<div className="flex-1 min-w-0 flex flex-col justify-between">
											<div>
												<h3 className="text-[16px] font-normal text-foreground leading-snug group-hover:text-emerald-600 transition-colors duration-150 mb-2">
													{post.title}
												</h3>
												{post.excerpt && (
													<p className="text-[13px] text-muted-foreground/70 font-light leading-relaxed line-clamp-2">
														{post.excerpt}
													</p>
												)}
											</div>

											{/* Meta Info */}
											<div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-muted-foreground/50">
												{post.publicDate && (
													<div className="flex items-center gap-1">
														<Calendar className="h-3 w-3" />
														<span>
															{new Date(post.publicDate).toLocaleDateString(
																"vi-VN",
																{
																	year: "numeric",
																	month: "short",
																	day: "numeric",
																},
															)}
														</span>
													</div>
												)}
												{post.addedAt && (
													<div className="flex items-center gap-1">
														<Plus className="h-3 w-3" />
														<span>
															Thêm{" "}
															{new Date(post.addedAt).toLocaleDateString(
																"vi-VN",
																{
																	month: "short",
																	day: "numeric",
																},
															)}
														</span>
													</div>
												)}
											</div>
										</div>

										{/* Arrow */}
										<div className="shrink-0 self-start pt-1">
											<ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" />
										</div>
									</article>
								</Link>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};