import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { MainLayout } from "~/components/layout/MainLayout";
import { Avatar } from "~/components/ui/Avatar";

import { Spinner } from "~/components/ui/Spinner";
import { postsApi } from "~/api/posts";
import { formatDate } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { CommentSection } from "~/components/comment/CommentSection";
import { PostActions } from "~/components/post/PostActions";

export default function PostDetailPage() {
  const { slug } = useParams();

  const {
    data: postData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => postsApi.getPostBySlug(slug!),
    enabled: !!slug,
  });

  const renderContent = (content: string, contentType: string) => {
    if (contentType === "MARKDOWN") {
      // For now, just render as plain text. Later we can add markdown parser
      return (
        <article className="prose prose-lg max-w-none">
          <pre className="whitespace-pre-wrap font-sans">{content}</pre>
        </article>
      );
    } else {
      // Rich text content
      return (
        <article
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !postData || !postData.data) {
    console.error("Post data error:", { error, postData });
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy bài viết
            </h1>
            <p className="text-gray-600 mb-6">
              Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>

            {/* Debug information */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                <h3 className="font-semibold mb-2">Debug Info:</h3>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify({ error, postData }, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-6">
              <Link to="/posts">
                <Button>Quay lại danh sách bài viết</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const post = postData.data;
  console.log("Post data:", post);

  return (
    <MainLayout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/posts" className="hover:text-blue-600">
                Bài viết
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white">{post.title}</li>
          </ol>
        </nav>
        {/* Featured Image */}
        {(post.thumbnail || post.thumbnailUrl) && (
          <div className="mb-8">
            <img
              src={post.thumbnail || post.thumbnailUrl}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
        {/* Post Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            {Array.isArray(post.categories) && post.categories.length > 0 && (
              <span
                className="px-3 py-1 rounded-full text-sm font-medium text-black dark:text-white"
                style={{
                  backgroundColor:
                    post.categories[0].backgroundColor || "#3B82F6",
                }}
              >
                {post.categories
                  .map((category) => category.category)
                  .join(", ")}
              </span>
            )}
            {post.featured && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium dark:text-black">
                Nổi bật
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-white">
            {post.title}
          </h1>

          {post.summary && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.summary}
            </p>
          )}

          {/* Author and Date */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-4">
              <Avatar
                fallback={post.user.username.charAt(0)}
                alt={post.user.username}
                size="md"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {post.user.username}
                </p>
                <p className="text-sm text-gray-500">
                  Đăng ngày {formatDate(post.createdAt)}
                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <span> • Cập nhật {formatDate(post.updatedAt)}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Share buttons placeholder */}
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm">
                Chia sẻ
              </Button>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className="mb-8 dark:text-white">
          {renderContent(post.content, post.contentType || "RICHTEXT")}
        </div>

        {/* Tags */}

        {/* Post Actions (Like & Rating) */}
        <div className=" border-gray-200 pt-6 mb-6 border-t dark:border-amber-50">
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className=" border-gray-200 pt-6 mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3 dark:text-white">
                Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.uuid}
                    className="px-3 py-1 rounded-full text-sm hover:opacity-80 cursor-pointer text-white"
                    style={{ backgroundColor: tag.color || "#6B7280" }}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <PostActions post={post} layout="vertical" />
        </div>

        {/* Navigation */}
        {/* <div className=" border-gray-200 pt-6">
          <div className="flex justify-between">
            <Link to="/posts">
              <Button variant="secondary">
                ← Quay lại danh sách
              </Button>
            </Link>
            <Button variant="secondary">
              Bài viết tiếp theo →
            </Button>
          </div>
        </div> */}
      </article>
      <div className="border-gray-200 pt-8 mb-8 ">
        <CommentSection
          postId={post.id}
          initialComments={post.comments || []}
          onCommentsUpdate={(updatedComments) => {
            // Optionally update post data with new comments
            console.log("Comments updated:", updatedComments.length);
          }}
        />
      </div>
      {/* Related Posts Section*/}
      {/* <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8  border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500">Đang tải bài viết liên quan...</p>
          </div>
        </div>
      </section> */}
    </MainLayout>
  );
}
