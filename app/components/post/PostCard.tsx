
import { Eye, Heart, MessageCircle, Star, Bookmark, Clock } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import type { Post } from "~/types";
import { LikeButton } from "./LikeButton";
import Avatar from "boring-avatars";
import { resolveAvatarUrl } from "~/utils/image";


interface ArticleCardProps {
  post: Post;
  variant?: "default" | "featured" | "compact";
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

export const PostCard = ({ post, variant = "default" }: ArticleCardProps) => {
  const imageUrl = post.thumbnail || post.thumbnailUrl || "/placeholder.svg";

  if (variant === "compact") {
    return (
      <article className="group flex gap-4 p-3 rounded-xl bg-card hover:bg-secondary/50 transition-all duration-300">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-between py-1 min-w-0">
          <div>
            <Link to={`/articles/${post.slug}`}>
              <h3 className="font-display font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
            </Link>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(post.viewCount)}
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "featured") {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-card card-shadow hover:card-shadow-hover transition-all duration-500">
        <Link to={`/articles/${post.slug}`} className="block">
          <div className="relative aspect-[16/10] overflow-hidden">
            <div className="image-shine w-full h-full">
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 gradient-overlay" />
            
            {/* Content overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                {post.categories?.[0] && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/20">
                    {post.categories[0].category}
                  </span>
                )}
                {post.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>

              {/* Title & Excerpt */}
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2 line-clamp-2">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-white/80 text-sm line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
              )}

              {/* Author & Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm border border-white/20">
                    {post.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{post.user.username}</p>
                    <p className="text-white/60 text-xs">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {formatNumber(post.viewCount)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    {formatNumber(post.likeCount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Bookmark button */}
        <button
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/20"
          aria-label="Bookmark"
        >
          <Bookmark className={cn("w-5 h-5", post.isSavedByCurrentUser && "fill-current")} />
        </button>
      </article>
    );
  }

  // Default variant
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-card card-shadow hover:card-shadow-hover transition-all duration-500 hover:-translate-y-1">
      <Link to={`/articles/${post.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <div className="image-shine w-full h-full">
            <img
              src={  imageUrl}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {post.categories?.[0] && (
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md"
                style={{
                  backgroundColor: `${post.categories[0].backgroundColor || "hsl(var(--primary))"}20`,
                  color: post.categories[0].backgroundColor || "hsl(var(--primary))",
                  border: `1px solid ${post.categories[0].backgroundColor || "hsl(var(--primary))"}40`,
                }}
              >
                {post.categories[0].category}
              </span>
            )}
            {post.featured && (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-accent/90 text-accent-foreground backdrop-blur-md flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-current" />
                Featured
              </span>
            )}
          </div>

          {/* Reading time indicator */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            5 min read
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-display font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Author & Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full from-primary/20 to-accent/20 flex items-center justify-center text-foreground font-semibold text-sm ring-2 ring-background">
                <img src={ resolveAvatarUrl(post.user.avatar || undefined)} alt={post.user.username} className="w-full h-full rounded-full object-cover" />
              </div>
              <div>
                <p className="text-foreground font-medium text-sm">{post.user.username}</p>
                <p className="text-muted-foreground text-xs">{formatDate(post.createdAt)}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1 text-xs">
                <Eye className="w-3.5 h-3.5" />
                {formatNumber(post.viewCount)}
              </span>
              <span className="flex items-center gap-1 text-xs">
                {/* Like button */}
                <LikeButton postId={post.id} variant="minimal" initialLikeCount={post.likeCount}/>
              </span>
              <span className="flex items-center gap-1 text-xs">
                <MessageCircle className="w-3.5 h-3.5" />
                {formatNumber(post.commentCount || 0)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Bookmark button */}
      <button
        className={cn(
          "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
          "bg-white/80 backdrop-blur-sm hover:bg-white text-foreground/70 hover:text-primary",
          "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
          post.isSavedByCurrentUser && "opacity-100 translate-y-0 text-primary"
        )}
        aria-label="Bookmark"
      >
        <Bookmark className={cn("w-4.5 h-4.5", post.isSavedByCurrentUser && "fill-current")} />
      </button>

   
    </article>
  );
};
