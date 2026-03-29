/**
 * ArticlesFeaturedPosts Component - Ultra minimalist featured posts
 * Black & White only - flat design with hr separators
 */

import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { Link } from "react-router";
import { postsApi } from "~/api/posts";
import { calculateReadingTime } from "../post/ReadingProgressBar";

interface ArticlesFeaturedPostsProps {
	maxPosts?: number;
}

export function ArticlesFeaturedPosts({
	maxPosts = 5,
}: ArticlesFeaturedPostsProps) {
	const { data: featuredPostsResponse, isLoading } = useQuery({
		queryKey: ["posts", "featured", maxPosts],
		queryFn: () => postsApi.getFeaturedPosts(),
		staleTime: 10 * 60 * 1000,
	});

	const featuredPosts = featuredPostsResponse?.data?.slice(0, maxPosts) || [];

	if (isLoading) {
		return (
			<div className="w-72 shrink-0">
				<div className="sticky top-24">
					<h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
						Bài viết nổi bật
					</h3>
					<div className="space-y-4">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="animate-pulse flex gap-3">
								<div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
								<div className="flex-1 space-y-2">
									<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
									<div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (!featuredPosts.length) {
		return null;
	}

	return (
		<div className="w-72 shrink-0">
			<div className="sticky top-24">
				<h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
					Bài viết nổi bật
				</h3>

				<div className="space-y-0">
					{featuredPosts.map((post) => (
						<article key={post.id} className="group py-3">
							<Link to={`/articles/${post.slug}`} className="block">
								<div className="flex gap-3">
									{/* Small thumbnail */}
									{post.thumbnail && (
										<div className="w-12 h-12 shrink-0 overflow-hidden">
											<img
												src={post.thumbnail}
												alt={post.title}
												className="w-full h-full object-cover"
												loading="lazy"
											/>
										</div>
									)}

									{/* Content */}
									<div className="flex-1 min-w-0">
										<h4 className="text-sm font-medium text-black dark:text-white group-hover:underline decoration-1 underline-offset-2 line-clamp-2">
											{post.title}
										</h4>
										<div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
											<span>{calculateReadingTime(post.content)} min</span>
											<span>·</span>
											<span>{post.viewCount || 0} views</span>
										</div>
									</div>
								</div>
							</Link>

							{/* Thin hr separator */}
							<hr className="mt-3 border-0 border-b border-black dark:border-white" />
						</article>
					))}
				</div>
			</div>
		</div>
	);
}
