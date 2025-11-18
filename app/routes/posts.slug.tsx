import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router";
import { MainLayout } from "~/components/layout/MainLayout";

import { Button } from "~/components/ui/button";
import { postsApi } from "~/api/posts";
import {  formatDateSimple, formatNumber } from "~/lib/utils";
import { CommentSection } from "~/components/comment/CommentSection";
import { PostActions } from "~/components/post/PostActions";
import ReadingProgressBar, { calculateReadingTime } from "~/components/post/ReadingProgressBar";
import TableOfContents from "~/components/post/TableOfContents";
import EnhancedPostCard from "~/components/post/EnhancedPostCard";
import { LikeButton } from "~/components/post/LikeButton";
import { BookmarkButton } from "~/components/post/BookmarkButton";
import { RatingComponent } from "~/components/post/RatingComponent";
import { useAuthStore } from "~/store/authStore";
import { PostSEO } from "~/components/post/PostSEO";
import { PostDetailSkeleton } from "~/components/skeleton/PostDetailSkeleton";
import { ProgressiveContentLoader } from "~/components/post/ProgressiveContentLoader";
import { useLoadingPerformance } from "~/components/post/LoadingPerformanceIndicator";
import {
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  ChevronRight,
  Share2,
  Facebook,
  Twitter,
  Copy,
  Check,
  Star,
  UserPlus,
  Edit,
  Trash2,
  Flag,
  MoreHorizontal,
  ArrowLeft,
  Tag as TagIcon,
} from "lucide-react";
import UserAvatar from "~/components/ui/boring-avatar";


export default function PostDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuthStore();

  // Performance tracking
  const { showIndicator, LoadingPerformanceIndicator } = useLoadingPerformance();

  // State for interactions
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Fetch post data
  const {
    data: postResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => postsApi.getPostBySlug(slug!),
    enabled: !!slug,
  });

  // Fetch related posts
  const { data: relatedPostsData } = useQuery({
    queryKey: ["posts", "related", postResponse?.data?.id],
    queryFn: () => postsApi.getPosts(0, 6),
    enabled: !!postResponse?.data,
  });

  const post = postResponse?.data;
  const relatedPosts =
    relatedPostsData?.content?.filter((p) => p.id !== post?.id)?.slice(0, 3) ||
    [];

  // Calculate reading time
  const readingTime = post ? calculateReadingTime(post.content) : 0;

  // Handle share functionality
  const handleShare = async (platform?: string) => {
    const url = `${window.location.origin}/posts/${slug}`;
    const title = post?.title || "";
    const text = post?.summary || title;

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        "_blank"
      );
    } else if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
    setShowShareMenu(false);

  };

  // Handle post actions
  const handleEdit = () => {
    navigate(`/dashboard/posts/edit/${post?.id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      // TODO: Implement delete functionality
      console.log("Delete post:", post?.id);
    }
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log("Report post:", post?.id);
  };


  // Check if current user can edit/delete this post
  const canEditPost =
    isAuthenticated &&
    (user?.id === post?.user?.id || user?.roles?.includes("ADMIN"));

  if (isLoading) {
    return (
      <MainLayout>
        <PostDetailSkeleton />
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Link to="/posts">
                <Button>Browse All Posts</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Performance Indicator */}
        <LoadingPerformanceIndicator show={showIndicator} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* SEO Metadata */}
      <PostSEO post={post} baseUrl={typeof window !== "undefined" ? window.location.origin : "http://localhost:5173"} />

      {/* Reading Progress Bar */}
      <ReadingProgressBar
        // targetRef={contentRef}
        showBackToTop={true}
        showReadingTime={true}
        showScrollPercentage={true}
        estimatedReadingTime={readingTime}
        position="top"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <ChevronRight className="w-4 h-4" />
                <li>
                  <Link
                    to="/posts"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Posts
                  </Link>
                </li>
                <ChevronRight className="w-4 h-4" />
                <li className="text-gray-900 dark:text-white truncate">
                  {post.title}
                </li>
              </ol>
            </nav>
            {/* Featured Image */}
            {(post.thumbnail || post.thumbnailUrl) && (
              <div className="mb-8">
                <img
                  src={post.thumbnail || post.thumbnailUrl}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* Post Header */}
            <header className="mb-8">
              {/* Categories and Featured Badge */}
              <div className="flex items-center space-x-2 mb-4">
                {post.categories?.length > 0 && (
                  <>
                    {post.categories.slice(0, 3).map((category) => (
                      <Link
                        key={category.id}
                        to={`/posts?category=${category.slug}`}
                        className=""

                      >
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium shadow-sm "
                          style={{
                            border: `1px solid ${post.categories[0].backgroundColor || "#3B82F6"}`,
                            color: post.categories[0].backgroundColor || "#3B82F6",
                          }}
                        >
                          {post.categories[0].category}
                        </span>
                      </Link>
                    ))}
                  </>
                )}
                {post.featured && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

            

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {post.summary && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {post.summary}
                </p>
              )}

              {/* Enhanced Meta Information */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Left side - Meta info */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateSimple(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{readingTime} min read</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{formatNumber(post.viewCount || 0)} views</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>{formatNumber(post.likeCount || 0)} likes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>
                        {formatNumber(post.commentCount || 0)} comments
                      </span>
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex items-center space-x-3">
                    {/* Like Button */}
                    <LikeButton
                      postId={post.id}
                      initialLiked={post.isLikedByCurrentUser}
                      initialLikeCount={post.likeCount}
                    />

                    {/* Bookmark Button */}
                    <BookmarkButton
                      postId={post.id}
                      initialBookmarked={post.isSavedByCurrentUser}
                      className="bg-white/90 dark:bg-black/90 backdrop-blur-sm"
                    />

                    {/* Share Button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Share</span>
                      </button>

                      {/* Share Menu */}
                      {showShareMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                          <div className="p-2">
                            <button
                              onClick={() => handleShare("facebook")}
                              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                              <Facebook className="h-4 w-4 text-blue-600" />
                              <span>Facebook</span>
                            </button>
                            <button
                              onClick={() => handleShare("twitter")}
                              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                              <Twitter className="h-4 w-4 text-blue-400" />
                              <span>Twitter</span>
                            </button>
                            <button
                              onClick={() => handleShare("copy")}
                              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                              {copied ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                              <span>{copied ? "Copied!" : "Copy Link"}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* More Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {showMoreMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                          <div className="p-2">
                            {canEditPost && (
                              <>
                                <button
                                  onClick={handleEdit}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span>Edit Post</span>
                                </button>
                                <button
                                  onClick={handleDelete}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete Post</span>
                                </button>
                              </>
                            )}
                            <button
                              onClick={handleReport}
                              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                              <Flag className="h-4 w-4" />
                              <span>Report</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                {/* <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <RatingComponent
                    postId={post.id}
                    initialUserRating={post.userRating}
                    initialAverageRating={post.averageRating}
                  />
                </div> */}
              </div>

              {/* Author Info */}
            </header>


            {/* Post Content */}
            <article
              ref={contentRef}
              className="mb-12"
            >
              <ProgressiveContentLoader
                content={post.content}
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-20 dark:text-white"
                enableLazyImages={true}
                enableProgressiveText={false}
                onLoadComplete={() => {
                  console.log("Post content loaded successfully");
                }}
              />
            </article>
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-4">
                {/* <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={post.user.avatar || ""}
                    alt={post.user.username}
                  />
                  <AvatarFallback>
                    {post.user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar> */}

                <UserAvatar
                  name={post.user.username}
                  src={post.user.avatar || ""}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link
                        to={`/profile/${post.user.id}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {post.user.username}
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Author • Joined {formatDateSimple(post.createdAt)}
                      </p>
                    </div>
                    {isAuthenticated && user?.id !== post.user.id && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <UserPlus className="h-4 w-4" />
                        <span>Follow</span>
                      </button>
                    )}
                  </div>
                  {/* {post.user.bio && (
                      <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                        {post.user.bio}
                      </p>
                    )} */}
                </div>
              </div>
            </div>
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <TagIcon className="h-5 w-5" />
                  <span>Tags</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.uuid}
                      to={`/posts?tag=${tag.slug}`}
                      className="px-3 py-1 rounded-full text-sm font-medium border transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                      style={{
                        borderColor: tag.color,
                        color: tag.color,
                      }}
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Post Actions */}
            <PostActions post={post} />

            {/* Comments Section */}
            <div className="mt-12">
              <CommentSection postId={post.id} initialComments={post.comments || []} />
            </div>
          </div>

          {/* Sidebar */}
          {/* <div className="lg:col-span-1 sticky top-20 ">
            <div className=" space-y-6">
              {relatedPosts.length > 0 && (
                <div className=" bg-white dark:bg-black rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Related Posts
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <EnhancedPostCard
                        key={relatedPost.id}
                        post={relatedPost}
                        variant="compact"
                        showAuthor={false}
                        showStats={true}
                        showExcerpt={false}
                        showThumbnail={true}
                        showBookmark={false}
                        showShare={false}
                      />
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link to="/posts">
                      <Button variant="outline" size="sm" className="w-full">
                        View All Posts
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            
            </div>
          </div> */}
        </div>
      </div>
    </MainLayout>
  );
}
