import { useState } from 'react';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { useAuthStore } from '~/store/authStore';
import { usePendingComment } from '~/hooks/usePendingComment';
import type { Comment as CommentType } from '~/types';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Filter,
  SortDesc,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { Button } from '~/components/ui/button';

interface CommentSectionProps {
  postId: string;
  initialComments: CommentType[];
  onCommentsUpdate?: (comments: CommentType[]) => void;
}

type SortType = 'newest' | 'oldest' | 'popular';

export const CommentSection = ({
  postId,
  initialComments,
  onCommentsUpdate
}: CommentSectionProps) => {
  const { isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [showCommentForm, setShowCommentForm] = useState(false);

  const { isSubmittingPending, pendingError } = usePendingComment(postId, (newComment) => {
    handleCommentAdded(newComment);
  });

  // Handle comment updates
  const handleCommentAdded = (newComment: CommentType) => {
    console.log('📝 Adding new comment:', newComment);

    if (!newComment || !newComment.id) {
      console.error('❌ Invalid comment object:', newComment);
      return;
    }

    const existingComment = comments.find(c => c.id === newComment.id);
    if (existingComment) {
      console.log('⚠️ Comment already exists, skipping add');
      return;
    }

    let updatedComments;
    if (newComment.parentCommentId) {
      updatedComments = addReplyToComments(comments, newComment);
    } else {
      updatedComments = [newComment, ...comments];
    }

    setComments(updatedComments);
    onCommentsUpdate?.(updatedComments);
    setShowCommentForm(false); // Close form after successful comment
    console.log('✅ Comment added successfully');
  };

  const addReplyToComments = (commentList: CommentType[], newReply: CommentType): CommentType[] => {
    return commentList.map(comment => {
      if (comment.id === newReply.parentCommentId) {
        const updatedReplies = comment.replies ? [...comment.replies, newReply] : [newReply];
        return {
          ...comment,
          replies: updatedReplies,
          replyCount: updatedReplies.length
        };
      } else if (comment.replies) {
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

  // Sort comments
  const getSortedComments = (commentList: CommentType[]) => {
    const sorted = [...commentList];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      // case 'popular':
      //   return sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      default:
        return sorted;
    }
  };

  const rootComments = getSortedComments(comments.filter(comment => comment.depth === 0));
  const totalComments = comments.length;
  const totalReplies = comments.filter(comment => comment.depth > 0).length;

  return (
    <div className="max-w-none">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
              Thảo luận
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {totalComments} bình luận
              </span>
              {totalReplies > 0 && (
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {totalReplies} phản hồi
                </span>
              )}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sắp xếp:</span>
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {[
                { value: 'newest', label: 'Mới nhất', icon: Clock },
                { value: 'popular', label: 'Phổ biến', icon: TrendingUp },
                { value: 'oldest', label: 'Cũ nhất', icon: SortDesc }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value as SortType)}
                  className={`px-3 py-2 text-xs font-medium transition-colors flex items-center space-x-1 ${
                    sortBy === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comment Statistics */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Tổng bình luận</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalComments}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Phản hồi</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{totalReplies}</p>
              </div>
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Tương tác</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {comments.reduce((sum, comment) => sum + (comment.likeCount || 0), 0)}
                </p>
              </div>
              <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div> */}

        {/* Status Messages */}
        {isSubmittingPending && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <Loader className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Đang gửi bình luận...
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Bình luận của bạn đang được xử lý
                </p>
              </div>
            </div>
          </div>
        )}

        {pendingError && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Không thể gửi bình luận
                </p>
                <p className="text-xs text-red-600 dark:text-red-300">
                  Vui lòng kiểm tra kết nối và thử lại
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comment Form Toggle */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          {isAuthenticated ? (
            <div>
              {!showCommentForm ? (
                <button
                  onClick={() => setShowCommentForm(true)}
                  className="w-full bg-gray-50 dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors group"
                >
                  <MessageCircle className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-blue-500" />
                  <p className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
                    Chia sẻ suy nghĩ của bạn về bài viết này...
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Nhấp để viết bình luận
                  </p>
                </button>
              ) : (
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Viết bình luận</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCommentForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Hủy
                    </Button>
                  </div>
                  <CommentForm
                    postId={postId}
                    onCommentAdded={handleCommentAdded}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Tham gia thảo luận
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Đăng nhập để chia sẻ ý kiến của bạn và tham gia cuộc thảo luận
              </p>
              <div className="space-x-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Đăng nhập
                </Button>
                <Button variant="outline">
                  Đăng ký
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      {rootComments.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tất cả bình luận ({rootComments.length})
            </h3>
            {rootComments.length > 5 && (
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Lọc bình luận
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {rootComments.map((comment, index) => (
              <div 
                key={comment.id}
                className={`${
                  index !== rootComments.length - 1 
                    ? 'border-b border-gray-100 dark:border-gray-700 pb-6' 
                    : ''
                }`}
              >
                <CommentItem
                  comment={comment}
                  postId={postId}
                  onCommentUpdated={handleCommentUpdated}
                  onCommentDeleted={handleCommentDeleted}
                  onReplyAdded={handleCommentAdded}
                />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {rootComments.length >= 10 && (
            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" className="px-8">
                Tải thêm bình luận
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            Chưa có bình luận nào cho bài viết này
          </p>
        </div>
      )}
    </div>
  );
};