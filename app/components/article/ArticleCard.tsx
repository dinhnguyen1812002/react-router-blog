/**
 * ArticleCard Component - Card hiển thị bài viết
 * Sử dụng trong trang Articles list
 */

import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Clock, Eye, Heart, User } from "lucide-react";
import { Link } from "react-router";
import type { Post } from "~/types";
import { resolveAvatarUrl } from "~/utils/image";
import { getSafeAvatar, getSafeUsername } from "~/utils/post-helpers";

interface ArticleCardProps {
	post: Post;
}

export function ArticleCard({ post }: ArticleCardProps) {
	const username = getSafeUsername(post);
	const avatar = resolveAvatarUrl(getSafeAvatar(post));

	// Tính thời gian đọc (200 từ/phút)
	const calculateReadingTime = (content: string): number => {
		const wordsPerMinute = 200;
		const wordCount = content.split(/\s+/).length;
		return Math.ceil(wordCount / wordsPerMinute);
	};

	// Format ngày tháng
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

	return (
		<article className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
			<Link to={`/articles/${post.slug}`} className="block">
				<div className="flex flex-col sm:flex-row gap-4 p-6">
					{/* Thumbnail */}
					{post.thumbnail && (
						<div className="sm:w-48 sm:h-32 w-full h-48 shrink-0 overflow-hidden rounded-lg">
							<img
								src={post.thumbnail}
								alt={post.title}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								loading="lazy"
							/>
						</div>
					)}

					{/* Content */}
					<div className="flex-1 min-w-0">
						{/* Categories */}
						{post.categories && post.categories.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-3">
								{post.categories.slice(0, 2).map((category) => (
									<span
										key={category.id}
										className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
										style={{
											backgroundColor: category.backgroundColor || "#e5e7eb",
											color: "#374151",
										}}
									>
										{category.category}
									</span>
								))}
							</div>
						)}

						{/* Title */}
						<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
							{post.title}
						</h2>

						{/* Excerpt */}
						<p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
							{post.excerpt || post.summary}
						</p>

						{/* Meta Information */}
						<div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
							{/* Author */}
							<div className="flex items-center gap-2">
								{avatar ? (
									<img
										src={avatar}
										alt={username}
										className="w-6 h-6 rounded-full"
									/>
								) : (
									<div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
										<User className="w-3 h-3" />
									</div>
								)}
								<span className="font-medium text-gray-700 dark:text-gray-300">
									{username}
								</span>
							</div>

							{/* Date */}
							<span className="flex items-center gap-1">
								{formatDate(post.createdAt)}
							</span>

							{/* Reading Time */}
							<span className="flex items-center gap-1">
								<Clock className="w-3 h-3" />
								{post.content ? calculateReadingTime(post.content) : 0} phút đọc
							</span>

							{/* Views */}
							<span className="flex items-center gap-1">
								<Eye className="w-3 h-3" />
								{post.viewCount || 0}
							</span>

							{/* Likes */}
							<span className="flex items-center gap-1">
								<Heart className="w-3 h-3" />
								{post.likeCount || 0}
							</span>
						</div>
					</div>
				</div>
			</Link>
		</article>
	);
}
