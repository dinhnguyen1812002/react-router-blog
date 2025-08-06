import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar } from '~/components/ui/Avatar';
import { CommentForm } from './CommentForm';
import { commentsApi } from '~/api/comments';
import { useAuthStore } from '~/store/authStore';
import { formatDate } from '~/lib/utils';
import type { Comment as CommentType } from '~/types';
import { Button } from "~/components/ui/button";
import { 
  Reply, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Check, 
  X,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

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
  const [showActions, setShowActions] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

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
    updateMutation.mutate(editContent);
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      deleteMutation.mutate();
    }
  };

  const isOwner = user?.id === comment.user.id;
  const currentDepth = comment.depth || level;
  const maxLevel = 3;
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`group ${currentDepth > 0 ? 'ml-6 border-l-2 border-blue-200 dark:border-blue-800 pl-4 relative' : ''}`}>
      {/* Reply indicator line */}
      {currentDepth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-transparent dark:from-blue-800"></div>
      )}
      
      <div className="flex gap-3">
        <Avatar
          src={comment.user.avatar}
          fallback={comment.user.username.charAt(0)}
          alt={comment.user.username}
          size="sm"
          className="flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          {/* Comment Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {comment.user.username}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  đã chỉnh sửa
                </span>
              )}
            </div>

            {/* Actions Menu */}
            {(isOwner || isAuthenticated) && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {showActions && (
                  <div className="absolute right-0 top-6 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[120px]">
                    {isOwner && !isEditing && (
                      <>
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowActions(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            handleDelete();
                            setShowActions(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </>
                    )}
                    {currentDepth < maxLevel && (
                      <button
                        onClick={() => {
                          setShowReplyForm(!showReplyForm);
                          setShowActions(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
                      >
                        <Reply className="w-4 h-4" />
                        Trả lời
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comment Content */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-3">
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                  rows={3}
                  placeholder="Chỉnh sửa bình luận..."
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleEdit}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    Lưu
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                    className="flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {comment.content}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4 text-xs">
            {currentDepth < maxLevel && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                <Reply className="w-3 h-3" />
                Trả lời
              </button>
            )}
            
            {hasReplies && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700
                 dark:hover:text-gray-300 transition-colors"
              >
              
                <MessageCircle className="w-3 h-3" />
                {comment.replies!.length} trả lời

                {showReplies ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
                <span className="ml-1">
                  {showReplies ? '(ẩn đi)' : '(hiển thị thêm))'}
                </span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4">
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
            <div className="mt-4 space-y-4">
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