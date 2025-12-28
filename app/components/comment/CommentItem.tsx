import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CommentForm } from "./CommentForm";
import { commentsApi } from "~/api/comments";
import { useAuthStore } from "~/store/authStore";
import { formatDateSimple } from "~/lib/utils";
import type { Comment as CommentType } from "~/types";
import { Button } from "~/components/ui/button";
import {
  Reply,
  Edit,
  Trash2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
} from "lucide-react";
import UserAvatar from "../ui/boring-avatar";
import { resolveImageUrl } from "~/utils/image";

interface CommentItemProps {
  comment: CommentType;
  postId: string;
  level?: number;
  onCommentUpdated?: (comment: CommentType) => void;
  onCommentDeleted?: (commentId: string) => void;
  onReplyAdded?: (comment: CommentType) => void;
}

export const CommentItem = ({
  comment,
  postId,
  level = 0,
  onCommentUpdated,
  onCommentDeleted,
  onReplyAdded
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(true);

  const { user, isAuthenticated } = useAuthStore();

  const updateMutation = useMutation({
    mutationFn: (content: string) => commentsApi.updateComment(comment.id, content),
    onSuccess: (updatedComment) => {
      setIsEditing(false);
      onCommentUpdated?.(updatedComment);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => commentsApi.deleteComment(comment.id),
    onSuccess: () => {
      onCommentDeleted?.(comment.id);
    },
  });

  const handleEdit = () => {
    if (editContent.trim()) {
      updateMutation.mutate(editContent);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      deleteMutation.mutate();
    }
  };

  // const handleLike = () => {
  //   if (!isAuthenticated) return;
  //   setIsLiked(!isLiked);
  //   setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  //   // TODO: Call like API
  // };

  const isOwner = user?.id === comment.user.id;
  const currentDepth = comment.depth || level;
  const maxLevel = 3;
  const hasReplies = comment.replies && comment.replies.length > 0;

  // Time-based styling for recent comments
  const isRecent =
    new Date().getTime() - new Date(comment.createdAt).getTime() <
    24 * 60 * 60 * 1000;

  return (
    <div
      className={`group relative ${currentDepth > 0 ? "ml-3 md:ml-6 border-l border-gray-200 dark:border-gray-700 pl-3" : ""
        }`}
    >
      <div className="flex gap-3 md:gap-4 py-3">
        {/* Avatar */}
        <div className="mt-0.5 flex-shrink-0">
          <UserAvatar src={resolveImageUrl(comment.user.avatar) || ""} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white text-sm md:text-[15px]">
                {comment.user.username}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{formatDateSimple(comment.createdAt)}</span>
              </span>
              {comment.isEdited && (
                <span className="text-[11px] text-gray-400 italic">
                  (đã chỉnh sửa)
                </span>
              )}
              {isRecent && (
                <span className="inline-flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                  <Zap className="w-3 h-3" />
                  Mới
                </span>
              )}
            </div>

            {/* Inline owner actions */}
            {isOwner && !isEditing && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300"
                >
                  <Edit className="w-3 h-3" />
                  Sửa
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                  Xóa
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="mt-1 mb-2">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white resize-vertical"
                  rows={3}
                  placeholder="Chỉnh sửa bình luận..."
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    disabled={updateMutation.isPending || !editContent.trim()}
                  >
                    Lưu
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {comment.content}
              </p>
            )}
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              {currentDepth < maxLevel && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
                >
                  <Reply className="w-3 h-3" />
                  Trả lời
                </button>
              )}
            </div>

            {hasReplies && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MessageCircle className="w-3 h-3" />
                <span>{comment.replies!.length} phản hồi</span>
                {showReplies ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </div>

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                parentCommentId={comment.id}
                onCancel={() => setShowReplyForm(false)}
                onCommentAdded={(newComment) => {
                  onReplyAdded?.(newComment);
                  setShowReplyForm(false);
                }}
                placeholder={`Trả lời ${comment.user.username}...`}
              />
            </div>
          )}

          {/* Replies */}
          {hasReplies && showReplies && (
            <div className="mt-3 space-y-2">
              {comment.replies!.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  level={currentDepth + 1}
                  onCommentUpdated={onCommentUpdated}
                  onCommentDeleted={onCommentDeleted}
                  onReplyAdded={onReplyAdded}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};