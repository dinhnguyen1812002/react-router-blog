import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { postsApi } from "~/api/posts";
import { formatDate, calculateReadingTime } from "~/lib/utils";
import { Star, Clock, Eye, TrendingUp } from "lucide-react";

interface FeaturedPostsSidebarProps {
  maxPosts?: number;
  showThumbnails?: boolean;
  showStats?: boolean;
  className?: string;
}

export default function FeaturedPostsSidebar({
  maxPosts = 5,
  showThumbnails = true,
  showStats = true,
  className = "",
}: FeaturedPostsSidebarProps) {
  const { data: featuredPostsResponse, isLoading } = useQuery({
    queryKey: ['posts', 'featured', maxPosts],
    queryFn: () => postsApi.getFeaturedPosts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const featuredPosts = featuredPostsResponse?.data?.slice(0, maxPosts) || [];

  if (isLoading) {
    return (
      <div className={className}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Featured Posts</span>
          </h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  {showThumbnails && (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
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
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">

          <span>Featured Posts</span>
        </h2>

        <div className="space-y-4">
          {featuredPosts.map((post, index) => (
            <article key={post.id} className="group">
              <Link
                to={`/articles/${post.slug}`}
                className="block hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-3 -m-3 transition-colors"
              >
                <div className="flex space-x-3">
                  {/* Thumbnail */}
                  {/* {showThumbnails && (post.thumbnail || post.thumbnailUrl) && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.thumbnail || post.thumbnailUrl}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>
                  )} */}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title + số thứ tự */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors">

                        {post.title}
                      </h3>

                    </div>

                    {/* Summary */}
                    {post.summary && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {post.summary}
                      </p>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatDate(post.createdAt)}</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{calculateReadingTime(post.content)} min</span>
                      </div>
                      {showStats && (
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.viewCount || 0}</span>
                        </div>
                      )}
                      {post.featured && (
                        <TrendingUp className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>


                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/posts?featured=true"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View all featured posts →
          </Link>
        </div>
      </div>
    </div>
  );
}
