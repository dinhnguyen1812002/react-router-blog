import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { formatDateSimple } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import {
  Heart,
  Eye,
  MessageCircle,
  Star,
  Bookmark,
  Clock,
  User,
} from "lucide-react";
import { LikeButton } from "./LikeButton";
import { RatingComponent } from "./RatingComponent";
import { BookmarkButton } from "./BookmarkButton";
import type { Post } from "~/types";
import UserAvatar from "../ui/boring-avatar";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card
      className="group hover:shadow-lg dark:hover:shadow-gray-900/50
  transition-all duration-300 overflow-hidden border-0 shadow-sm bg-white dark:bg-gray-800 w-full max-w-md p-0"
    >
      {/* Hình ảnh */}
      <div className="relative">
        <div className="aspect-[16/9] w-full">
          <img
            src={post.thumbnail || post.thumbnailUrl}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          {post.categories?.length > 0 && (
            <span
              className="px-2 py-1 rounded-full text-xs font-medium shadow-sm "
              style={{
                border: `1px solid ${post.categories[0].backgroundColor || "#3B82F6"}`,
                color: post.categories[0].backgroundColor || "#3B82F6",
              }}
            >
              {post.categories[0].category}
            </span>
          )}
          {post.featured && (
            <span className="px-2 py-1 rounded-full text-xs font-medium shadow-sm bg-white border border-yellow-400 text-yellow-400">
              ⭐
            </span>
          )}
        </div>


        {/* Bookmark */}
        <div className="absolute bottom-2 right-2">
          <BookmarkButton
            postId={post.id}
            initialBookmarked={post.isSavedByCurrentUser}
            variant="compact"
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
          />
        </div>

      </div>

      {/* Nội dung */}
      <div className="p-3 sm:p-4 flex flex-col justify-between h-full">
        <Link to={`/posts/${post.slug}`} className="block group mb-2">
          <h3
            className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 
      group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {post.excerpt}
            </p>
          )}
        </Link>

        {/* Thông tin tác giả + Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-2">
            {/* <Avatar>
              <AvatarImage
                src={post.user.avatar || ''}
              />
              <AvatarFallback >{post.user.username.charAt(0)}</AvatarFallback>
            </Avatar> */}
            <UserAvatar 
            name={post.user.username}   
            src={post.user.avatar || ""}
            size={20}
            variant="marble"
           
            alt={post.user.username}
            />
            <span className="font-medium truncate max-w-[80px]">
              {post.user.username}
            </span>
            <span>•</span>
            <span>{formatDateSimple(post.createdAt)}</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Eye className="w-3 h-3" /> {post.viewCount}
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-3 h-3" /> {post.likeCount}
            </span>
            <span className="flex items-center space-x-1">
              <MessageCircle className="w-3 h-3" /> {post.commentCount || 0}
            </span>
          </div>
        </div>

        {/* Rating & Like */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-2">
          <RatingComponent
            postId={post.id}
            initialUserRating={post.userRating}
            initialAverageRating={post.averageRating}
            compact
          />
          <LikeButton
            postId={post.id}
            initialLiked={post.isLikedByCurrentUser}
            initialLikeCount={post.likeCount}
          />
        </div>
      </div>
    </Card>
  );
};
