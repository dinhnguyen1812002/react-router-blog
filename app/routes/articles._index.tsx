/**
 * Trang danh sách bài viết - Article List Page
 * Ultra Minimalist: Black & White only, container layout, hr separators
 * No border-radius, no shadows - pure flat design
 */

import { FileText } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { type GetPostsParams, postsApi } from "~/api/posts";
import { ArticleListItem } from "~/components/article/ArticleListItem";
import { ArticlesFeaturedPosts } from "~/components/article/ArticlesFeaturedPosts";
import { ArticlesSidebar } from "~/components/article/ArticlesSidebar";
import { MainLayout } from "~/components/layout/MainLayout";
import { ArticleListSkeleton } from "~/components/skeleton/ArticleListSkeleton";
import { EmptyState } from "~/components/ui/EmptyState";
import { Pagination } from "~/components/ui/Pagination";
import type { Route } from "./+types/articles._index";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Bài viết - Khám phá nội dung | Inkwell" },
		{
			name: "description",
			content:
				"Khám phá danh sách các bài viết mới nhất, sâu sắc và thú vị về đa dạng chủ đề trên Inkwell.",
		},
		{ property: "og:title", content: "Bài viết - Khám phá nội dung | Inkwell" },
		{
			property: "og:description",
			content:
				"Khám phá danh sách các bài viết mới nhất, sâu sắc và thú vị về đa dạng chủ đề trên Inkwell.",
		},
	];
}

// Loader để fetch dữ liệu từ server
export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url);
	const page = parseInt(url.searchParams.get("page") || "0");
	const sortBy = (url.searchParams.get("sortBy") || "newest") as
		| "newest"
		| "views";
	const categorySlug = url.searchParams.get("category") || undefined;
	const tagSlug = url.searchParams.get("tag") || undefined;
	const searchQuery = url.searchParams.get("q") || undefined;

	const params: GetPostsParams = {
		page,
		size: 10,
		sortBy,
		categorySlug,
		tagSlug,
		search: searchQuery,
	};

	const posts = await postsApi.getPosts(params);
	return {
		posts,
		currentPage: page,
		sortBy,
		categorySlug,
		tagSlug,
		searchQuery,
	};
}

export default function ArticlesIndex({ loaderData }: Route.ComponentProps) {
	const { posts, currentPage, sortBy, categorySlug, tagSlug, searchQuery } =
		loaderData;
	const [searchParams, setSearchParams] = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);

	// Hàm thay đổi trang
	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", newPage.toString());
		setSearchParams(params);
	};

	return (
		<MainLayout>
			<div className="min-h-screen bg-white dark:bg-black">
				{/* Header Section - Black & White */}
				<div className="container mx-auto px-4 py-10">
					{/* Breadcrumb */}
					<nav className="text-xs text-gray-400 dark:text-gray-600 mb-3">
						<span>Trang chủ</span>
						<span className="mx-2">/</span>
						<span className="text-black dark:text-white">Bài viết</span>
					</nav>
				</div>

				{/* Main Content - Container layout */}
				<div className="container mx-auto px-4 py-8">
					<div className="flex flex-col lg:flex-row gap-8">
						{/* Left Sidebar - Filters */}
						<ArticlesSidebar
							currentCategory={categorySlug}
							currentTag={tagSlug}
							currentSort={sortBy}
						/>

						{/* Main Content Area - Takes remaining space */}
						<div className="flex-1 min-w-0">
							{/* Search Results Info */}
							{searchQuery && (
								<div className="mb-6 pb-4 border-b border-black dark:border-white">
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Kết quả tìm kiếm cho "
										<span className="font-medium text-black dark:text-white">
											{searchQuery}
										</span>
										"
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										{posts.totalElements} bài viết
									</p>
								</div>
							)}

							{/* Active Filters Display */}
							{(categorySlug || tagSlug) && (
								<div className="flex flex-wrap gap-2 mb-6">
									{categorySlug && (
										<span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400">
											{categorySlug}
											<button
												onClick={() => {
													const params = new URLSearchParams(searchParams);
													params.delete("category");
													params.set("page", "0");
													setSearchParams(params);
												}}
												className="ml-1 text-gray-400"
											>
												×
											</button>
										</span>
									)}
									{tagSlug && (
										<span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400">
											{tagSlug}
											<button
												onClick={() => {
													const params = new URLSearchParams(searchParams);
													params.delete("tag");
													params.set("page", "0");
													setSearchParams(params);
												}}
												className="ml-1 text-gray-400"
											>
												×
											</button>
										</span>
									)}
								</div>
							)}

							{/* Articles List - Flat design with hr separators */}
							{isLoading ? (
								<ArticleListSkeleton />
							) : posts.content.length > 0 ? (
								<div className="space-y-0">
									{posts.content.map((post) => (
										<ArticleListItem key={post.id} post={post} />
									))}
								</div>
							) : (
								<EmptyState
									icon={FileText}
									title="Không tìm thấy bài viết nào"
									description="Chưa có bài viết nào được đăng hoặc không có bài viết phù hợp với bộ lọc của bạn."
								/>
							)}

							{/* Pagination */}
							{posts.totalPages > 1 && (
								<div className="mt-8 pt-8 border-t border-black dark:border-white">
									<Pagination
										currentPage={currentPage}
										totalPages={posts.totalPages}
										onPageChange={handlePageChange}
									/>
								</div>
							)}
						</div>

						{/* Featured Posts - Right side */}
						<div className="hidden lg:block">
							<ArticlesFeaturedPosts maxPosts={5} />
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
