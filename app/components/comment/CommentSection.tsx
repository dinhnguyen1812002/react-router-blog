import { useState } from 'react';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { useAuthStore } from '~/store/authStore';
import { usePendingComment } from '~/hooks/usePendingComment';
import type { Comment as CommentType } from '~/types';

interface CommentSectionProps {
  postId: string;
  initialComments: CommentType[];
  onCommentsUpdate?: (comments: CommentType[]) => void;
}

export const CommentSection = ({
  postId,
  initialComments,
  onCommentsUpdate
}: CommentSectionProps) => {
  const { isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState<CommentType[]>(initialComments);

  const { isSubmittingPending, pendingError } = usePendingComment(postId, (newComment) => {
    handleCommentAdded(newComment);
  });

  // Handle comment updates
  const handleCommentAdded = (newComment: CommentType) => {
    console.log('📝 Adding new comment:', newComment);

    // Validate comment object
    if (!newComment || !newComment.id) {
      console.error('❌ Invalid comment object:', newComment);
      return;
    }

    // Check if comment already exists (prevent duplicates)
    const existingComment = comments.find(c => c.id === newComment.id);
    if (existingComment) {
      console.log('⚠️ Comment already exists, skipping add');
      return;
    }

    // Add comment to the appropriate place in the tree
    let updatedComments;

    if (newComment.parentCommentId) {
      // This is a reply - add it to the parent's replies
      updatedComments = addReplyToComments(comments, newComment);
    } else {
      // This is a root comment - add it to the top level
      updatedComments = [newComment, ...comments];
    }

    setComments(updatedComments);
    onCommentsUpdate?.(updatedComments);
    console.log('✅ Comment added successfully');
  };

  // Helper function to add reply to nested comments
  const addReplyToComments = (commentList: CommentType[], newReply: CommentType): CommentType[] => {
    return commentList.map(comment => {
      if (comment.id === newReply.parentCommentId) {
        // Found the parent comment
        const updatedReplies = comment.replies ? [...comment.replies, newReply] : [newReply];
        return {
          ...comment,
          replies: updatedReplies,
          replyCount: updatedReplies.length
        };
      } else if (comment.replies) {
        // Recursively search in replies
        return {
          ...comment,
          replies: addReplyToComments(comment.replies, newReply)
        };
      }
      return comment;
    });
  };

  const handleCommentUpdated = (updatedComment: CommentType) => {
    const updateCommentsRecursively = (commentList: CommentType[]): CommentType[] => {
      return commentList.map(comment => {
        if (comment.id === updatedComment.id) {
          return updatedComment;
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentsRecursively(comment.replies)
          };
        }
        return comment;
      });
    };

    const updatedComments = updateCommentsRecursively(comments);
    setComments(updatedComments);
    onCommentsUpdate?.(updatedComments);
  };

  const handleCommentDeleted = (commentId: string) => {
    const removeCommentRecursively = (commentList: CommentType[]): CommentType[] => {
      return commentList
        .filter(comment => comment.id !== commentId)
        .map(comment => ({
          ...comment,
          replies: comment.replies ? removeCommentRecursively(comment.replies) : null
        }));
    };

    const updatedComments = removeCommentRecursively(comments);
    setComments(updatedComments);
    onCommentsUpdate?.(updatedComments);
  };

  // Comments are already organized in tree structure from API
  const rootComments = comments.filter(comment => comment.depth === 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Bình luận ({comments?.length || 0})
          </h3>

          {/* Pending comment status */}
          {isSubmittingPending && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Đang gửi bình luận đã lưu...
                </p>
              </div>
            </div>
          )}

          {pendingError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-4">
              <p className="text-sm text-red-700 dark:text-red-300">
                ❌ Không thể gửi bình luận đã lưu. Vui lòng thử lại.
              </p>
            </div>
          )}

          <CommentForm
            postId={postId}
            onCommentAdded={handleCommentAdded}
          />
        </div>

        {rootComments.length > 0 ? (
          <div className="space-y-6">
            {rootComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                onCommentUpdated={handleCommentUpdated}
                onCommentDeleted={handleCommentDeleted}
                onReplyAdded={handleCommentAdded}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có bình luận nào
            </h3>
            <p className="text-gray-600">
              {isAuthenticated
                ? "Hãy là người đầu tiên bình luận về bài viết này!"
                : "Đăng nhập để trở thành người đầu tiên bình luận!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};