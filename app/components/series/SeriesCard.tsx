import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { formatDateSimple } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import {
  BookOpen,
  User,
  Calendar,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import type { Series } from "~/types";
import UserAvatar from "../ui/boring-avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface SeriesCardProps {
  series: Series;
  showActions?: boolean;
  onEdit?: (series: Series) => void;
  onDelete?: (series: Series) => void;
  onAddPost?: (series: Series) => void;
}

export const SeriesCard = ({
  series,
  showActions = false,
  onEdit,
  onDelete,
  onAddPost
}: SeriesCardProps) => {
  return (
    <Card className="group overflow-hidden border border-border bg-card hover:shadow-[var(--shadow-card-hover)] transition-all duration-300">
      {/* Thumbnail Image */}
      {series.thumbnail && (
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={series.thumbnail}
            alt={series.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        </div>
      )}

      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link to={`/series/${series.slug}`} className="block group/link">
              <h3 className="text-lg font-semibold text-foreground group-hover/link:text-primary transition-colors line-clamp-2 mb-2">
                {series.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {series.description}
            </p>
          </div>

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 shrink-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit?.(series)} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddPost?.(series)} className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm bài viết
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(series)}
                  className="text-destructive cursor-pointer focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span>{series.username || series.author?.username || "Unknown"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>{series.posts?.length || 0}</span>
          </div>

          <div className="ml-auto flex items-center gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDateSimple(series.createdAt)}</span>
          </div>
        </div>

        {/* Posts Preview */}
        {series.posts && series.posts.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Bài viết:</span>
            </div>
            <div className="space-y-1.5">
              {series.posts.slice(0, 3).map((post, index) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.slug}`}
                  className="group/post flex items-start gap-2 text-sm hover:text-primary transition-colors"
                >
                  <span className="text-muted-foreground shrink-0">{index + 1}.</span>
                  <span className="line-clamp-1">{post.title}</span>
                </Link>
              ))}
              {series.posts.length > 3 && (
                <p className="text-xs text-muted-foreground pl-5">
                  +{series.posts.length - 3} bài viết nữa
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
