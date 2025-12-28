import {
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  Star,
  MessageSquare,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";

import { Card } from "../ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import type { Post } from "~/types";
import { Link } from "react-router";
import { BookmarkButton } from "./BookmarkButton";
import { RatingComponent } from "./RatingComponent";
import { LikeButton } from "./LikeButton";
import { formatDateSimple } from "~/lib/utils";

interface PostCardProps {
  post: Post;
}

export const ListArticles = ({ post }: PostCardProps) => {
  return (
    <div className="border rounded-lg">
      <div className="flex flex-col md:flex-row">
        <div className="relative overflow-hidden md:w-80 shrink-0 aspect-[16/9] w-full">
          <img
            src={post.thumbnail || post.thumbnailUrl}
            alt={post.title}
            className="h-48 md:h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-l-lg "
          />

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
        </div>

        <div className="p-6 flex flex-col justify-between flex-1">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold leading-tight transition-colors group-hover:text-primary">
              <Link to={`/articles/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h3>

            <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.user.avatar} alt={post.user.username} />
                <AvatarFallback>{post.user.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {post.user.username}
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />

                    {formatDateSimple(post.public_date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.viewCount}
                  </span>
                  <span className="flex items-center gap-1">
                    {post.averageRating}
                    <Star className="h-4 w-4 text-yellow-400" />
                  </span>
                  <span className="flex items-center gap-1">
                    {post.commentCount}
                    <MessageSquare className="h-4 w-4 " />
                  </span>
                </div>
              </div>
            </div>

            {/*Gộp nhóm 3 nút ở đây */}
            <div className="flex items-center gap-2 bg-muted/30 dark:bg-muted/10 px-2 py-1 rounded-md">
              <BookmarkButton
                postId={post.id}
                initialBookmarked={post.isSavedByCurrentUser}
                variant="compact"
                className="bg-transparent"
              />
              <RatingComponent
                postId={post.id}
                initialUserRating={post.userRating}
                initialAverageRating={post.averageRating}
                compact
              />
              {/* <LikeButton

                initialLiked={post.isLikedByCurrentUser}
                initialLikeCount={post.likeCount}
              /> */}
              <LikeButton
                postId={post.id}
                initialLiked={false}
                initialLikeCount={post.likeCount}
                variant="minimal" // hoặc "compact", "minimal"
                size="md" // hoặc "sm", "lg"
                showCount={true}
                className="custom-class"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
