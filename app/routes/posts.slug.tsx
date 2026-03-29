import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	CalendarDays,
	Clock3,
	Eye,
	MessageSquareText,
	User,
} from "lucide-react";
import { useRef } from "react";
import { Link, useParams } from "react-router";
import { postsApi } from "~/api/posts";
import { CommentSection } from "~/components/comment/CommentSection";
import { MainLayout } from "~/components/layout/MainLayout";
import { PostActions } from "~/components/post/PostActions";
import { PostSEO } from "~/components/post/PostSEO";
import { ProgressiveContentLoader } from "~/components/post/ProgressiveContentLoader";
import ReadingProgressBar, {
	calculateReadingTime,
} from "~/components/post/ReadingProgressBar";
import { PostDetailSkeleton } from "~/components/skeleton/PostDetailSkeleton";
import { cn, formatDateSimple, formatNumber } from "~/lib/utils";
import { resolveAvatarUrl } from "~/utils/image";

export default function PostDetailPage() {
	const { slug } = useParams();
	const articleRef = useRef<HTMLElement>(null);

	const {
		data: postResponse,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["post", slug],
		queryFn: () => postsApi.getPostBySlug(slug!),
		enabled: !!slug,
	});

	const post = postResponse?.data;
	const readingTime = post ? calculateReadingTime(post.content) : 0;

	const formatDate = (dateString: string): string => {
		try {
			return formatDateSimple(dateString);
		} catch {
			return dateString;
		}
	};

	if (isLoading) {
		return (
			<MainLayout>
				<div className="min-h-screen bg-white dark:bg-black">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
						<PostDetailSkeleton />
					</div>
				</div>
			</MainLayout>
		);
	}

	if (error || !post) {
		return (
			<MainLayout>
				<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
					<div className="text-center">
						<p
							className="font-serif text-5xl text-black dark:text-white mb-6 opacity-10 select-none"
							style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
						>
							404
						</p>
						<p className="text-sm tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-8">
							Bài viết không tồn tại
						</p>
						<Link
							to="/articles"
							className="text-xs tracking-widest uppercase text-black dark:text-white border-b border-black dark:border-white pb-0.5 hover:opacity-50 transition-opacity"
						>
							← Quay lại
						</Link>
					</div>
				</div>
			</MainLayout>
		);
	}

	const author = post.author;
	const authorAvatar = resolveAvatarUrl(author?.avatar);
	const authorName = author?.username || "Anonymous";
	const authorInitial = authorName.charAt(0).toUpperCase();
	const featuredImage = post.thumbnail || post.thumbnailUrl;
	const summary = post.summary || post.excerpt;

	return (
		<MainLayout>
			<PostSEO post={post} />
			{/* <ReadingProgressBar
        targetRef={articleRef}
        estimatedReadingTime={readingTime}
        color={typeof document !== "undefined" && document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#000000'}
        className="h-1"
      /> */}

			<div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
				{/* Top Nav */}
				<nav className="border-b border-black dark:border-white">
					<div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
						<Link
							to="/articles"
							className="flex items-center gap-2 text-xs uppercase tracking-widest hover:opacity-50 transition-opacity"
						>
							<ArrowLeft className="w-4 h-4" />
							Bài viết
						</Link>
					</div>
				</nav>

				{/* Article */}
				<article
					ref={articleRef}
					className="container max-w-5xl mx-auto px-4 pb-24 pt-12 sm:px-6"
				>
					<header className="mb-12">
						{post.categories && post.categories.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-6">
								{post.categories.map((category) => (
									<Link
										key={category.id}
										to={`/articles?category=${category.slug}`}
										className="text-xs uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors"
									>
										{category.category}
									</Link>
								))}
							</div>
						)}
						{featuredImage && (
							<div className="mb-12">
								<img
									src={featuredImage}
									alt={post.title}
									className="w-full h-auto object-cover transition-all duration-700"
									loading="lazy"
								/>
							</div>
						)}
						<h1
							className="text-4xl md:text-5xl xl:text-6xl font-normal leading-tight mb-6"
							style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
						>
							{post.title}
						</h1>

						{summary && (
							<p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
								{summary}
							</p>
						)}

						<div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
							<span className="flex items-center gap-2">
								{authorAvatar ? (
									<img
										src={authorAvatar}
										alt={authorName}
										className="w-8 h-8 object-cover"
									/>
								) : (
									<User className="w-5 h-5" />
								)}
								<span className="text-black dark:text-white">{authorName}</span>
							</span>
							<span>/</span>
							<span>{formatDate(post.createdAt)}</span>
							<span>/</span>
							<span>{readingTime} min read</span>
						</div>
					</header>

					<hr className="border-black dark:border-white my-12" />

					<div
						className="
              prose prose-lg max-w-none 
              dark:prose-invert
              prose-headings:font-serif prose-headings:font-normal
              prose-p:leading-loose prose-p:text-gray-800 dark:prose-p:text-gray-200
              prose-a:text-black dark:prose-a:text-white prose-a:underline prose-a:decoration-1 prose-a:underline-offset-4 hover:prose-a:bg-black hover:prose-a:text-white dark:hover:prose-a:bg-white dark:hover:prose-a:text-black prose-a:transition-all
              prose-img:rounded-none prose-img:grayscale hover:prose-img:grayscale-0 prose-img:transition-all prose-img:duration-700
              prose-blockquote:border-l-4 prose-blockquote:border-black dark:prose-blockquote:border-white prose-blockquote:font-serif prose-blockquote:text-xl
              prose-hr:border-black dark:prose-hr:border-white
            "
					>
						<ProgressiveContentLoader
							content={post.content || ""}
							enableLazyImages={true}
							enableProgressiveText={false}
						/>
					</div>

					<hr className="border-black dark:border-white my-12" />

					<footer className="space-y-12">
						{/* Tags & Actions */}
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
							{post.tags && post.tags.length > 0 && (
								<div className="flex flex-wrap gap-3">
									{post.tags.map((tag) => (
										<Link
											key={tag.uuid}
											to={`/articles?tag=${tag.slug}`}
											// className="text-sm font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors "

											className={cn(
												"text-sm font-mono dark:hover:text-white transition-colors",
												{},
											)}
											style={{ color: tag.color || "inherit" }}
										>
											#{tag.name}
										</Link>
									))}
								</div>
							)}

							<PostActions post={post} layout="horizontal" />
						</div>

						{/* Author Section */}
						<div className="border border-black dark:border-white p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
							{authorAvatar ? (
								<img
									src={authorAvatar}
									alt={authorName}
									className="w-16 h-16 object-cover"
								/>
							) : (
								<div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xl font-serif">
									{authorInitial}
								</div>
							)}
							<div className="flex-1">
								<p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
									Được viết bởi
								</p>
								<p className="text-xl font-serif mb-2">{authorName}</p>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Tác giả tập trung chia sẻ những góc nhìn sâu sắc về công nghệ,
									thiết kế và cuộc sống.
								</p>
							</div>
						</div>

						{/* Comments */}
						<section>
							<div className="flex items-center gap-4 mb-8">
								<h2 className="text-2xl font-serif">Bình luận</h2>
								<div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
									<MessageSquareText className="w-4 h-4" />[
									{formatNumber(post.commentCount || 0)}]
								</div>
							</div>
							<CommentSection
								postId={post.id}
								initialComments={post.comments || []}
							/>
						</section>
					</footer>
				</article>
			</div>
		</MainLayout>
	);
}
