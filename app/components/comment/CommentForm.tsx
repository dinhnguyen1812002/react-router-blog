import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string; parentCommentId?: string | null }) =>
      commentsApi.createComment(postId, data),
    onSuccess: (response) => {
      console.log('✅ Comment created successfully:', response);

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
      console.error('❌ Create comment error:', error);

      // Show user-friendly error message
      // if (error.response?.status === 403) {
      //   console.error('🚫 Access denied - please check authentication');
      // } else if (error.response?.status === 401) {
      //   console.error('🔐 Unauthorized - please login again');
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
    const token = localStorage.getItem('auth-token');
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

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Tham gia thảo luận
        </h3>
        <p className="text-gray-600 mb-4">
          Đăng nhập để chia sẻ ý kiến và tham gia thảo luận với cộng đồng
        </p>
        <div className="flex justify-center space-x-3">
          <Link to="/login">
            <Button>Đăng nhập</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Đăng ký</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Error display */}
      {createCommentMutation.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-700">
            ❌ Lỗi khi gửi bình luận: {createCommentMutation.error.message}
          </p>
        </div>
      )}

      {/* Auth status indicator */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-700">
            💡 Bạn chưa đăng nhập. Sau khi viết bình luận và bấm gửi, bạn sẽ được chuyển đến trang đăng nhập.
          </p>
        </div>
      )}

      {/* Pending comment indicator */}
      {pendingComment && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm text-yellow-700">
            📝 Bình luận đã được lưu tạm. Hãy hoàn thành đăng nhập để gửi bình luận.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isAuthenticated ? placeholder : `${placeholder} (Cần đăng nhập để gửi)`}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={createCommentMutation.isPending}
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {!isAuthenticated && (
              <span className="text-sm text-gray-500">
                Chưa đăng nhập
              </span>
            )}
            {isAuthenticated && user && (
              <span className="text-sm text-gray-600">
                Đăng nhập với tư cách <strong>{user.username}</strong>
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Hủy
              </Button>
            )}
            <Button
              type="submit"
              disabled={!content.trim() || createCommentMutation.isPending}
            >
              {createCommentMutation.isPending
                ? "Đang gửi..."
                : isAuthenticated
                  ? "Bình luận"
                  : "Đăng nhập & Bình luận"
              }
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
