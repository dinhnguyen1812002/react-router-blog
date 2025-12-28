import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";

import { commentsApi } from "~/api/comments";
import { useAuthStore } from "~/store/authStore";
import { Button } from "../ui/button";
import type { Comment as CommentType } from "~/types";

interface CommentFormProps {
  postId: string;
  parentCommentId?: string | null;
  onCancel?: () => void;
  onCommentAdded?: (comment: CommentType) => void;
  placeholder?: string;
}

export const CommentForm = ({
  postId,
  parentCommentId,
  onCancel,
  onCommentAdded,
  placeholder = "Viết bình luận...",
}: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [pendingComment, setPendingComment] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string; parentCommentId?: string | null }) =>
      commentsApi.createComment(postId, data),
    onSuccess: (response) => {


      // Handle different response formats
      let newComment: CommentType = response;
      if (response && typeof response === 'object') {
        // If response has data property, use it
        if ('data' in response && response.data) {
          newComment = response.data as CommentType;
        }
        // If response is already the comment object, use it directly
        else if ('id' in response && 'content' in response) {
          newComment = response as CommentType;
        }
      }

      setContent("");
      setPendingComment(null);
      onCancel?.();

      // Only call onCommentAdded if we have a valid comment object
      if (newComment && newComment.id) {
        onCommentAdded?.(newComment);
      } else {
        console.warn('⚠️ Invalid comment response format:', response);
        // Optionally refresh the page or show a success message
        window.location.reload();
      }

      // Clear pending comment from localStorage
      localStorage.removeItem('pendingComment');
    },
    onError: (error) => {
      console.error(' Create comment error:', error);

      // Show user-friendly error message
      // if (error.response?.status === 403) {
      //   console.error(' Access denied - please check authentication');
      // } else if (error.response?.status === 401) {
      //   console.error('Unauthorized - please login again');
      // }
    }
  });

  // Check for pending comment when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && !pendingComment) {
      const stored = localStorage.getItem('pendingComment');
      if (stored) {
        try {
          const pendingData = JSON.parse(stored);
          // Check if it's for this post and not too old (5 minutes)
          if (pendingData.postId === postId &&
            pendingData.parentCommentId === parentCommentId &&
            Date.now() - pendingData.timestamp < 5 * 60 * 1000) {
            setContent(pendingData.content);
            setPendingComment(pendingData.content);
          } else {
            // Remove old pending comment
            localStorage.removeItem('pendingComment');
          }
        } catch (error) {
          console.error('Error parsing pending comment:', error);
          localStorage.removeItem('pendingComment');
        }
      }
    }
  }, [isAuthenticated, postId, parentCommentId, pendingComment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Nếu chưa đăng nhập, lưu comment và redirect đến login
    if (!isAuthenticated) {
      setPendingComment(content.trim());
      // Lưu vào localStorage để restore sau khi login
      localStorage.setItem('pendingComment', JSON.stringify({
        content: content.trim(),
        postId,
        parentCommentId,
        timestamp: Date.now()
      }));
      navigate('/login', {
        state: {
          message: 'Vui lòng đăng nhập để bình luận',
          returnUrl: window.location.pathname
        }
      });
      return;
    }

    // Debug: Check token before submitting
    const { token } = useAuthStore.getState();
    console.log('🔍 Submitting comment with:', {
      isAuthenticated,
      hasToken: !!token,
      user: user?.username,
      postId,
      parentCommentId,
      content: content.trim()
    });

    createCommentMutation.mutate({
      content: content.trim(),
      parentCommentId,
    });
  };

  return (
    <div className="space-y-2">
      {/* Thông báo lỗi gọn */}
      {createCommentMutation.error && (
        <p className="text-xs text-red-500">
          Lỗi khi gửi bình luận: {createCommentMutation.error.message}
        </p>
      )}

      {/* Thông tin lưu tạm bình luận */}
      {pendingComment && (
        <p className="text-xs text-amber-600">
          Đã lưu tạm bình luận, hoàn tất đăng nhập để gửi.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            isAuthenticated
              ? placeholder
              : `${placeholder} (bạn sẽ được chuyển sang trang đăng nhập khi gửi)`
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-black dark:text-white text-sm"
          disabled={createCommentMutation.isPending}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {isAuthenticated && user
              ? `Đăng nhập với tư cách ${user.username}`
              : "Chưa đăng nhập"}
          </span>

          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                Hủy
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={!content.trim() || createCommentMutation.isPending}
            >
              {createCommentMutation.isPending
                ? "Đang gửi..."
                : isAuthenticated
                  ? "Bình luận"
                  : "Đăng nhập & gửi"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
