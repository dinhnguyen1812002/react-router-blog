/**
 * ArticleListItem Component - Ultra minimalist flat list item
 * Black & White only - No card, no border-radius, no shadows
 */

import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Clock, Eye, Heart, User } from "lucide-react";
import { Link } from "react-router";
import type { Post } from "~/types";
import { resolveAvatarUrl } from "~/utils/image";
import { getSafeAvatar, getSafeUsername } from "~/utils/post-helpers";

interface ArticleListItemProps {
	post: Post;
}

export function ArticleListItem({ post }: ArticleListItemProps) {
	const username = getSafeUsername(post);
	const avatar = resolveAvatarUrl(getSafeAvatar(post));

	// Calculate reading time (200 words/minute)
	const calculateReadingTime = (content: string | undefined): number => {
		if (!content) return 0;
		const wordsPerMinute = 200;
		const wordCount = content.split(/\s+/).length;
		return Math.ceil(wordCount / wordsPerMinute);
	};

	// Format date
	const formatDate = (dateString: string): string => {
		try {
			return formatDistanceToNow(new Date(dateString), {
				addSuffix: true,
				locale: vi,
			});
		} catch {
			return dateString;
		}
	};

	const readingTime = calculateReadingTime(post.content);

	return (
		<article className="py-6 group">
			<Link to={`/articles/${post.slug}`} className="block">
				<div className="flex gap-4">
					{/* Thumbnail - small size 80x80 */}
					{post.thumbnail && (
						<div className="w-20 h-20 shrink-0 overflow-hidden">
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
						{/* Categories as simple text */}
						{post.categories && post.categories.length > 0 && (
							<div className="flex gap-2 mb-2">
								{post.categories.slice(0, 2).map((category) => (
									<span
										key={category.id}
										className="text-xs text-gray-500 dark:text-gray-400"
									>
										{category.category}
									</span>
								))}
							</div>
						)}

						{/* Title */}
						<h2 className="text-lg font-medium text-black dark:text-white group-hover:underline decoration-1 underline-offset-2">
							{post.title}
						</h2>

						{/* Excerpt - 2-3 lines */}
						<p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
							{post.excerpt || post.summary}
						</p>

						{/* Meta info - inline with dot separators */}
						<div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
							{/* Author */}
							<div className="flex items-center gap-1.5">
								{avatar ? (
									<img
										src={avatar}
										alt={username}
										className="w-4 h-4 rounded-full"
									/>
								) : (
									<User className="w-3.5 h-3.5" />
								)}
								<span className="text-black dark:text-white">{username}</span>
							</div>

							<span className="text-gray-300 dark:text-gray-600">·</span>

							{/* Date */}
							<span>{formatDate(post.createdAt)}</span>

							<span className="text-gray-300 dark:text-gray-600">·</span>

							{/* Views */}
							<span className="flex items-center gap-1">
								<Eye className="w-3 h-3" />
								{post.viewCount || 0}
							</span>

							<span className="text-gray-300 dark:text-gray-600">·</span>

							{/* Reading Time */}
							<span className="flex items-center gap-1">
								<Clock className="w-3 h-3" />
								{readingTime} min
							</span>
						</div>
					</div>
				</div>
			</Link>

			{/* Thin hr separator */}
			<hr className="mt-6 border-0 border-b border-black dark:border-white" />
		</article>
	);
}
