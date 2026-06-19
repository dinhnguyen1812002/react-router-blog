import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { postsApi } from "~/api/posts";
import { PostCard } from "~/components/post/PostCard";
import { PostCardSkeleton } from "~/components/skeleton/PostDetailSkeleton";
import { cn } from "~/lib/utils";

interface RelatedPostsSectionProps {
	postId: string;
	className?: string;
}

function RelatedPostsSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{[1, 2, 3].map((i) => (
				<PostCardSkeleton key={i} />
			))}
		</div>
	);
}

function SectionHeader() {
	return (
		<div className="mb-8">
			<p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2">
				Đọc thêm
			</p>
			<h2 className="text-2xl md:text-3xl font-semibold text-black dark:text-white">
				Bài viết liên quan
			</h2>
			<hr className="border-black dark:border-white mt-4" />
		</div>
	);
}

export function RelatedPostsSection({
	postId,
	className,
}: RelatedPostsSectionProps) {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["related-posts", postId],
		queryFn: () => postsApi.getRelatedPosts(postId),
		enabled: Boolean(postId),
		staleTime: 5 * 60 * 1000,
	});

	const posts = data?.data ?? [];

	if (!isLoading && !isError && posts.length === 0) {
		return null;
	}

	return (
		<section
			className={cn("space-y-0", className)}
			aria-label="Bài viết liên quan"
		>
			<SectionHeader />

			{isLoading && <RelatedPostsSkeleton />}

			{isError && (
				<div className="flex items-center gap-3 border border-red-300 dark:border-red-900 px-5 py-6 text-sm text-red-600 dark:text-red-400">
					<AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
					<p>Không thể tải bài viết liên quan. Vui lòng thử lại sau.</p>
				</div>
			)}

			{!isLoading && !isError && posts.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{posts.map((post) => (
						<PostCard key={post.id} post={post} variant="default" />
					))}
				</div>
			)}
		</section>
	);
}
