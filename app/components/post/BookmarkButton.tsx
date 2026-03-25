import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { Button } from "~/components/ui/button";
import { bookmarksApi } from "~/api/bookmarks";
import { useAuthStore } from "~/store/authStore";
import { useNavigate } from "react-router";
import BookmarkErrorToast from "~/components/ui/BookmarkErrorToast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface BookmarkButtonProps {
  postId: string;
  initialBookmarked?: boolean;
  className?: string;
  variant?: "default" | "compact";
}

export const BookmarkButton = ({
  postId,
  initialBookmarked = false,
  className = "",
  variant = "default",
}: BookmarkButtonProps) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const bookmarkMutation = useMutation({
    // Luôn gọi toggle để backend quyết định lưu / bỏ lưu
    mutationFn: () => bookmarksApi.toggleBookmark(postId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousBookmarked = isBookmarked;
      setIsBookmarked((prev) => !prev);

      return { previousBookmarked };
    },

    onSuccess: (data) => {
      if (data && typeof data.isBookmarked === "boolean") {
        setIsBookmarked(data.isBookmarked);
      }
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },

    onError: (error: any, _variables, context) => {
      if (context?.previousBookmarked !== undefined) {
        setIsBookmarked(context.previousBookmarked);
      }
      console.error("Bookmark error:", error);
      setErrorMessage(error.message || "Có lỗi xảy ra khi xử lý bookmark");
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }
    bookmarkMutation.mutate();
  };

  const bookmarkIcon = (
    <Bookmark
      className={`w-4 h-4 transition-all duration-200 ${
        isBookmarked
          ? "fill-current text-blue-600 dark:text-blue-400"
          : "text-gray-500 dark:text-gray-400"
      }`}
    />
  );

  const tooltipLabel = bookmarkMutation.isPending
    ? "Đang xử lý..."
    : isBookmarked
    ? "Bỏ lưu"
    : "Lưu bài viết";

  if (variant === "compact") {
    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClick}
              disabled={bookmarkMutation.isPending}
              className={`p-2 h-auto ${className}`}
            >
              {bookmarkIcon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-sm">{tooltipLabel}</span>
          </TooltipContent>
        </Tooltip>
        <BookmarkErrorToast
          error={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      </>
    );
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={bookmarkMutation.isPending}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 text-dark dark:text-white ${className}`}
          >
            {bookmarkIcon}
            <span className="text-sm">{isBookmarked ? "Đã lưu" : "Lưu"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-sm">{tooltipLabel}</span>
        </TooltipContent>
      </Tooltip>
      <BookmarkErrorToast
        error={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </>
  );
};