import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar } from '~/components/ui/Avatar';

import { CommentForm } from './CommentForm';
import { commentsApi } from '~/api/comments';
import { useAuthStore } from '~/store/authStore';
import { formatDate } from '~/lib/utils';
import type { Comment as CommentType } from '~/types';
import {Button} from "~/components/ui/button";

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
  const maxLevel = 3; // Maximum nesting level

  return (
    <div className={`${currentDepth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex space-x-3">
        <Avatar
          src={comment.user.avatar }
          fallback={comment.user.username.charAt(0)}
          alt={comment.user.username}
          size="sm"
        />
        
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-900">
                {comment.user.username}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-gray-400">(đã chỉnh sửa)</span>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={handleEdit}
                    disabled={updateMutation.isPending}
                  >
                    Lưu
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
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
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mt-2 text-sm">
            {currentDepth < maxLevel && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Trả lời
              </button>
            )}
            
            {isOwner && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-600 hover:text-gray-700"
                >
                  Sửa
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                  disabled={deleteMutation.isPending}
                >
                  Xóa
                </button>
              </>
            )}
          </div>
          
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
          
          {/* Render replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
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