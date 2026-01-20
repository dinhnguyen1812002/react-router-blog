import { Calendar, Clock, EyeIcon, Heart, MessageCircle } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type { Post } from "~/types/profile";


export const BlogPostCard = (post: Post) => {
  return (
    <article className={`card-elevated rounded-xl overflow-hidden 
    bg-card group cursor-pointer`}>
      {post.thumbnail && (
        <div className={`overflow-hidden `}>
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-1 md:p-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {/* {post.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-medium bg-secondary/80 text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {tag}
            </Badge>
          ))} */}
        </div>

        <h3 className={`font-display font-semibold text-foreground group-hover:text-primary transition-colors leading-tight `}>
          {post.title}
        </h3>

        <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
          {post.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString(
                "vi-VN",
                { month: "short", day: "numeric" },
              )}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {/* {readTime} */}
              15 phút
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <EyeIcon className="h-4 w-4" />
              {post.views}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
