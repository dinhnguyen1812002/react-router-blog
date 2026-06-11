import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Calendar,
  GripVertical,
  ImageIcon,
  Plus,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import { Link } from "react-router";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import type { SeriesPost } from "~/types";
import { getSeriesPostId } from "~/utils/series";

interface SeriesPostsManagerProps {
  posts: SeriesPost[];
  onReorder: (posts: SeriesPost[]) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (postId: string) => void;
  isReordering?: boolean;
  removingPostId?: string | null;
}

export function SeriesPostsManager({
  posts,
  onReorder,
  onMoveUp,
  onMoveDown,
  onRemove,
  isReordering = false,
  removingPostId = null,
}: SeriesPostsManagerProps) {
  const [dragSrcIdx, setDragSrcIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  function handleDragStart(index: number) {
    setDragSrcIdx(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIdx(index);
  }

  function handleDragLeave() {
    setDragOverIdx(null);
  }

  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragSrcIdx === null || dragSrcIdx === index) {
      setDragSrcIdx(null);
      setDragOverIdx(null);
      return;
    }
    const next = [...posts];
    const [moved] = next.splice(dragSrcIdx, 1);
    next.splice(index, 0, moved);
    onReorder(next);
    setDragSrcIdx(null);
    setDragOverIdx(null);
  }

  function handleDragEnd() {
    setDragSrcIdx(null);
    setDragOverIdx(null);
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Chưa có bài viết nào</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Thêm bài viết để bắt đầu xây dựng series.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <span className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
          Bài viết trong series
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ArrowUpDown className="h-3 w-3" />
          {posts.length} bài viết
        </span>
      </div>

      {/* List */}
      <div ref={listRef} className="flex flex-col gap-[2px]">
        {posts.map((post, index) => {
          const postId = getSeriesPostId(post);
          const isRemoving = removingPostId === postId;
          const isFirst = index === 0;
          const isLast = index === posts.length - 1;
          const isDragging = dragSrcIdx === index;
          const isDragOver = dragOverIdx === index && dragSrcIdx !== index;

          return (
            <div
              key={postId}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={[
                "group relative flex items-stretch gap-0 rounded-lg border bg-card",
                "transition-all duration-150 select-none",
                isDragging
                  ? "opacity-40 border-border"
                  : "opacity-100",
                isDragOver
                  ? "border-primary/60 bg-primary/5 shadow-sm"
                  : "border-border/50 hover:border-border",
              ].join(" ")}
            >
              {/* Drop indicator */}
              {isDragOver && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-primary rounded-t-lg" />
              )}

              {/* Drag Handle */}
              <div className="flex items-center justify-center w-8 shrink-0 cursor-grab active:cursor-grabbing border-r border-border/40 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors rounded-l-lg hover:bg-muted/40">
                <GripVertical className="h-3.5 w-3.5" />
              </div>

              {/* Order index */}
              <div className="flex items-center justify-center w-8 shrink-0 border-r border-border/40">
                <span className="text-[10px] font-medium tracking-wider text-muted-foreground/40">
                  {String(post.orderIndex ?? index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Thumbnail */}
              <div className="shrink-0 w-16 h-[64px] border-r border-border/40 overflow-hidden bg-muted/40 flex items-center justify-center">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-4 w-4 text-muted-foreground/20" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-center px-3 py-2.5 gap-1">
                <Link
                  to={`/articles/${post.slug}`}
                  className="text-[13px] font-medium text-foreground hover:text-primary transition-colors line-clamp-1 leading-snug"
                >
                  {post.title}
                </Link>

                {post.excerpt && (
                  <p className="text-[11.5px] text-muted-foreground/60 font-light line-clamp-1 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-0.5">
                  {post.publicDate && (
                    <span className="flex items-center gap-1 text-[10.5px] text-muted-foreground/50">
                      <Calendar className="h-2.5 w-2.5" />
                      {new Date(post.publicDate).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {post.addedAt && (
                    <span className="flex items-center gap-1 text-[10.5px] text-muted-foreground/50">
                      <Plus className="h-2.5 w-2.5" />
                      Thêm{" "}
                      {new Date(post.addedAt).toLocaleDateString("vi-VN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex flex-col justify-center gap-0.5 px-2 py-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-muted rounded-md"
                  onClick={() => onMoveUp(index)}
                  disabled={isFirst || isReordering}
                  title="Di chuyển lên"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-muted rounded-md"
                  onClick={() => onMoveDown(index)}
                  disabled={isLast || isReordering}
                  title="Di chuyển xuống"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-md"
                  onClick={() => onRemove(postId)}
                  disabled={isRemoving}
                  title="Xóa khỏi series"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hint */}
      <p className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground/40 pt-2 px-1">
        <GripVertical className="h-3 w-3" />
        Kéo thả để sắp xếp thứ tự
      </p>
    </div>
  );
}