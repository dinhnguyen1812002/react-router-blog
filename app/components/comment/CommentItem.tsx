import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/Avatar';
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
  ChevronUp,
  Heart,
  Flag,
  Share,
  Clock,
  User,
  Pin,
  Award,
  Zap
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
  const [isLiked, setIsLiked] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const actionsRef = useRef<HTMLDivElement>(null);

  // Click outside to close actions menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showActions]);

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
  const isRecent = new Date().getTime() - new Date(comment.createdAt).getTime() < 24 * 60 * 60 * 1000;

  return (
    <div className={`group relative ${currentDepth > 0 ? 'ml-4 md:ml-6' : ''}`}>
      {/* Thread connector for replies */}
      {currentDepth > 0 && (
        <div className="absolute -left-4 md:-left-6 top-0 bottom-0 w-px  via-blue-100 to-transparent dark:from-blue-700 dark:via-blue-800"></div>
      )}
      
      {/* Recent comment indicator */}
      {/* {isRecent && currentDepth === 0 && (
        <div className="absolute -left-1 top-6 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      )} */}

      <div className={`flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl transition-all duration-200 ${
        isCollapsed 
          ? 'bg-gray-50/50 dark:bg-gray-800/30' 
          : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/50'
      } ${currentDepth > 0 ? '' : ''}`}>
        
        {/* Avatar with status */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-8 h-8 md:w-10 md:h-10 ring-2 ring-white dark:ring-gray-800 shadow-sm">
            <AvatarImage 
              src={comment.user.avatar || ''} 
              alt={comment.user.username}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
              {comment.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
        </div>
        
        <div className="flex-1 min-w-0">
          {isCollapsed ? (
            /* Collapsed view */
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600 dark:text-gray-400 text-sm">
                  {comment.user.username}
                </span>
                <span className="text-xs text-gray-400">
                  {comment.content.length > 50 ? `${comment.content.substring(0, 50)}...` : comment.content}
                </span>
              </div>
              <button
                onClick={() => setIsCollapsed(false)}
                className="text-blue-600 hover:text-blue-700 text-xs"
              >
                Mở rộng
              </button>
            </div>
          ) : (
            /* Expanded view */
            <>
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm md:text-base flex items-center gap-1">
                    {comment.user.username}
                    {/* User badges */}
                    {/* {comment.user.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )} */}
                    {/* {comment.user.roles === 'admin' && (
                      <Award className="w-4 h-4 text-yellow-500" />
                    )} */}
                  </span>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(comment.createdAt)}</span>
                    
                    {comment.isEdited && (
                      <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        đã sửa
                      </span>
                    )}
                    
                    {isRecent && (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Mới
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Menu */}
                <div className="relative" ref={actionsRef}>
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {showActions && (
                    <div className="absolute right-0 top-8 z-20 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[160px] animate-in slide-in-from-top-2 duration-200">
                      {isOwner && !isEditing && (
                        <>
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setShowActions(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => {
                              setIsCollapsed(true);
                              setShowActions(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                          >
                            <ChevronUp className="w-4 h-4" />
                            Thu gọn
                          </button>
                          <hr className="my-1 border-gray-200 dark:border-gray-700" />
                          <button
                            onClick={() => {
                              handleDelete();
                              setShowActions(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa bình luận
                          </button>
                        </>
                      )}
                      
                      {!isOwner && (
                        <>
                          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors">
                            <Flag className="w-4 h-4" />
                            Báo cáo
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors">
                            <User className="w-4 h-4" />
                            Xem hồ sơ
                          </button>
                        </>
                      )}
                      
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors">
                        <Share className="w-4 h-4" />
                        Chia sẻ
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comment Content */}
              <div className="mb-3">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-all"
                        rows={4}
                        placeholder="Chỉnh sửa bình luận..."
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        {editContent.length}/1000
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={handleEdit}
                        disabled={updateMutation.isPending || !editContent.trim()}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        {updateMutation.isPending ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Lưu thay đổi
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setEditContent(comment.content);
                        }}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {/* Like Button */}
                  {/* <button
                    onClick={handleLike}
                    disabled={!isAuthenticated}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isLiked 
                        ? 'text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    {likeCount > 0 && <span>{likeCount}</span>}
                  </button> */}

                  {/* Reply Button */}
                  {currentDepth < maxLevel && (
                    <button
                      onClick={() => setShowReplyForm(!showReplyForm)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    >
                      <Reply className="w-4 h-4" />
                      Trả lời
                    </button>
                  )}
                  
                  {/* Share Button */}
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200">
                    <Share className="w-4 h-4" />
                  </button>
                </div>

                {/* Replies Toggle */}
                {hasReplies && (
                  <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{comment.replies!.length} phản hồi</span>
                    {showReplies ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {/* Reply Form */}
              {showReplyForm && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
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
            </>
          )}

          {/* Replies */}
          {hasReplies && showReplies && !isCollapsed && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
                <span>{comment.replies!.length} phản hồi</span>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              </div>
              
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