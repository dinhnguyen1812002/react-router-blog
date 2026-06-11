import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowUpRight, Clock } from "lucide-react";
import { Link } from "react-router";
import { postsApi } from "~/api/posts";
import { calculateReadingTime } from "~/components/post/ReadingProgressBar";
import { Skeleton } from "~/components/ui/skeleton";
import { cn, formatDateSimple } from "~/lib/utils";
import type { Post } from "~/types";

interface RelatedPostsSidebarProps {
	postId: string;
	className?: string;
}

function RelatedPostListItem({
	post,
	index,
	featured = false,
}: {
	post: Post;
	index: number;
	featured?: boolean;
}) {
	const thumbnail = post.thumbnail || post.thumbnailUrl;
	const readingTime = calculateReadingTime(post.content || post.excerpt || "");
	const category = post.categories?.[0];
	const number = String(index + 1).padStart(2, "0");

	const formatDate = (dateString: string) => {
		try {
			return formatDateSimple(dateString);
		} catch {
			return dateString;
		}
	};

	if (featured) {
		return (
			<Link
				to={`/articles/${post.slug}`}
				className="group relative block overflow-hidden rounded-lg bg-black dark:bg-white text-white dark:text-black mb-8"
			>
				{thumbnail && (
					<div className="relative aspect-[4/3] overflow-hidden">
						<img
							src={thumbnail}
							alt={post.title}
							className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
							loading="lazy"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent dark:from-white/90 dark:via-white/40" />
					</div>
				)}
				<div className={cn("p-5", !thumbnail && "pt-6")}>
					<div className="flex items-center justify-between mb-3">
						<span className="text-[10px] uppercase tracking-[0.2em] opacity-70">
							{category?.category ?? "Nổi bật"}
						</span>
						<ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>
					<h3
						className="text-xl leading-snug font-normal line-clamp-3"
						style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
					>
						{post.title}
					</h3>
					<p className="mt-3 text-xs opacity-60 flex items-center gap-2">
						<span>{formatDate(post.createdAt)}</span>
						<span>·</span>
						<span className="flex items-center gap-1">
							<Clock className="h-3 w-3" />
							{readingTime} phút
						</span>
					</p>
				</div>
			</Link>
		);
	}

	return (
		<Link
			to={`/articles/${post.slug}`}
			className="group flex gap-4 py-4 border-t border-gray-200/80 dark:border-gray-800 first:border-t-0 hover:bg-gray-50 dark:hover:bg-white/5 -mx-3 px-3 rounded-lg transition-colors"
		>
			<span
				className="shrink-0 w-8 text-2xl font-light text-gray-200 dark:text-gray-700 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors tabular-nums leading-none pt-0.5"
				style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
				aria-hidden
			>
				{number}
			</span>

			<div className="flex gap-3 flex-1 min-w-0">
				{thumbnail && (
					<div className="shrink-0 w-16 h-16 sm:w-[72px] sm:h-[72px] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900">
						<img
							src={thumbnail}
							alt=""
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							loading="lazy"
						/>
					</div>
				)}
				<div className="flex-1 min-w-0">
					{category && (
						<p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
							{category.category}
						</p>
					)}
					<h3
						className="text-[15px] leading-snug line-clamp-2 group-hover:underline underline-offset-2 decoration-gray-400"
						style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
					>
						{post.title}
					</h3>
					<p className="mt-1.5 text-[11px] text-gray-400">
						{formatDate(post.createdAt)} · {readingTime} phút
					</p>
				</div>
				<ArrowUpRight className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
			</div>
		</Link>
	);
}

function SidebarSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="w-full aspect-[4/3] rounded-lg" />
			{[1, 2, 3].map((i) => (
				<div key={i} className="flex gap-4 py-3">
					<Skeleton className="w-8 h-8 shrink-0" />
					<Skeleton className="w-16 h-16 shrink-0 rounded-md" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-3 w-20" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-3 w-24" />
					</div>
				</div>
			))}
		</div>
	);
}

export function RelatedPostsSidebar({
	postId,
	className,
}: RelatedPostsSidebarProps) {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["related-posts", postId],
		queryFn: () => postsApi.getRelatedPosts(postId),
		enabled: Boolean(postId),
		staleTime: 5 * 60 * 1000,
	});

	const posts = data?.data ?? [];

	return (
		<aside
			className={cn("lg:sticky lg:top-24", className)}
			aria-label="Bài viết liên quan"
		>
			{/* Section header — no box border */}
			<div className="mb-6">
				<p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2">
					Đọc tiếp
				</p>
				<h2
					className="text-2xl font-normal text-black dark:text-white"
					style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
				>
					Bài viết liên quan
				</h2>
				<div className="mt-3 h-px w-12 bg-black dark:bg-white" />
			</div>

			{isLoading && <SidebarSkeleton />}

			{isError && (
				<div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-5 text-sm text-red-600 dark:text-red-400 flex gap-2">
					<AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
					<p>Không thể tải bài viết liên quan.</p>
				</div>
			)}

			{!isLoading && !isError && posts.length === 0 && (
				<p className="text-sm text-gray-400 py-8 italic">
					Không có bài viết liên quan
				</p>
			)}

			{!isLoading && !isError && posts.length > 0 && (
				<div>
					<RelatedPostListItem post={posts[0]} index={0} featured />
					{posts.slice(1).map((post, i) => (
						<RelatedPostListItem key={post.id} post={post} index={i + 1} />
					))}
				</div>
			)}
		</aside>
	);
}
