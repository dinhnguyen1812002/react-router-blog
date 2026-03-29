/**
 * Aricaless - Article Detail Page
 * Ultra minimalist layout with Black & White color scheme
 * No border-radius, no shadows - pure flat design
 */

import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, Clock, Eye, User } from "lucide-react";
import { Link, useParams } from "react-router";
import { postsApi } from "~/api/posts";
import { MainLayout } from "~/components/layout/MainLayout";
import type { Category, Post, Tag } from "~/types";

// Loader để fetch bài viết
export async function loader({ params }: { params: { slug?: string } }) {
	const slug = params.slug || "aricaless";

	try {
		const post = await postsApi.getPostBySlug(slug);
		return { post };
	} catch (error) {
		console.error("Error fetching post:", error);
		return { post: null };
	}
}

export default function Aricaless({
	loaderData,
}: {
	loaderData: { post: Post | null };
}) {
	const { post } = loaderData;

	// Calculate reading time
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

	if (!post) {
		return (
			<MainLayout>
				<div className="min-h-screen bg-white dark:bg-black">
					<div className="container mx-auto px-4 py-16">
						<div className="text-center">
							<h1 className="text-2xl font-normal text-black dark:text-white mb-4">
								Bài viết không tồn tại
							</h1>
							<Link
								to="/articles"
								className="text-sm text-gray-500 hover:text-black dark:hover:text-white underline"
							>
								← Quay lại danh sách bài viết
							</Link>
						</div>
					</div>
				</div>
			</MainLayout>
		);
	}

	const readingTime = calculateReadingTime(post.content);

	return (
		<MainLayout>
			<div className="min-h-screen bg-white dark:bg-black">
				{/* Header with back button */}
				<div className="border-b border-black dark:border-white">
					<div className="container mx-auto px-4 py-6">
						<Link
							to="/articles"
							className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:hover:text-white"
						>
							<ArrowLeft className="w-4 h-4" />
							Quay lại
						</Link>
					</div>
				</div>

				{/* Article Content */}
				<article className="container mx-auto px-4 py-8">
					{/* Title */}
					<header className="mb-8">
						<h1 className="text-3xl md:text-4xl font-normal text-black dark:text-white mb-4">
							{post.title}
						</h1>

						{/* Meta info */}
						<div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
							{/* Author */}
							<div className="flex items-center gap-2">
								{post.user?.avatar ? (
									<img
										src={post.user.avatar}
										alt={post.user.username}
										className="w-6 h-6 rounded-full"
									/>
								) : (
									<User className="w-5 h-5" />
								)}
								<span className="text-black dark:text-white">
									{post.user?.username || "Anonymous"}
								</span>
							</div>

							<span className="text-gray-300 dark:text-gray-600">·</span>

							{/* Date */}
							<span>{formatDate(post.createdAt)}</span>

							<span className="text-gray-300 dark:text-gray-600">·</span>

							{/* Views */}
							<span className="flex items-center gap-1">
								<Eye className="w-4 h-4" />
								{post.viewCount || 0}
							</span>

							<span className="text-gray-300 dark:text-gray-600">·</span>

							{/* Reading Time */}
							<span className="flex items-center gap-1">
								<Clock className="w-4 h-4" />
								{readingTime} min đọc
							</span>
						</div>

						{/* Categories */}
						{post.categories && post.categories.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-4">
								{post.categories.map((category: Category) => (
									<span
										key={category.id}
										className="text-xs text-gray-500 dark:text-gray-400"
									>
										{category.category}
									</span>
								))}
							</div>
						)}
					</header>

					{/* Thumbnail */}
					{post.thumbnail && (
						<div className="mb-8">
							<img
								src={post.thumbnail}
								alt={post.title}
								className="w-full max-h-[500px] object-cover"
							/>
						</div>
					)}

					{/* Content */}
					<div className="prose prose-lg dark:prose-invert max-w-none">
						{post.content ? (
							<div
								dangerouslySetInnerHTML={{ __html: post.content }}
								className="text-black dark:text-white"
							/>
						) : (
							<p className="text-gray-500">Nội dung đang được cập nhật...</p>
						)}
					</div>

					{/* Tags */}
					{post.tags && post.tags.length > 0 && (
						<div className="mt-8 pt-8 border-t border-black dark:border-white">
							<div className="flex flex-wrap gap-2">
								{post.tags.map((tag: Tag) => (
									<span
										key={tag.uuid}
										className="text-xs text-gray-500 dark:text-gray-400"
									>
										#{tag.name}
									</span>
								))}
							</div>
						</div>
					)}

					{/* Divider */}
					<hr className="my-8 border-0 border-b border-black dark:border-white" />

					{/* Author section */}
					{post.user && (
						<div className="flex items-center gap-4">
							{post.user.avatar ? (
								<img
									src={post.user.avatar}
									alt={post.user.username}
									className="w-12 h-12 rounded-full"
								/>
							) : (
								<div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
									<User className="w-6 h-6" />
								</div>
							)}
							<div>
								<p className="text-sm font-medium text-black dark:text-white">
									{post.user.username}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Tác giả
								</p>
							</div>
						</div>
					)}
				</article>
			</div>
		</MainLayout>
	);
}
