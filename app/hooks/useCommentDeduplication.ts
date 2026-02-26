import { useRef, useCallback } from 'react';
import type { Comment as CommentType } from '~/types';

export const useCommentDeduplication = () => {
  const recentlyAddedComments = useRef<Set<string>>(new Set());
  const processingComments = useRef<Set<string>>(new Set());

  const isCommentDuplicate = useCallback((
    newComment: CommentType, 
    existingComments: CommentType[]
  ): boolean => {
    // Check if comment is currently being processed
    if (processingComments.current.has(newComment.id)) {
      return true;
    }

    // Check if comment was recently added
    if (recentlyAddedComments.current.has(newComment.id)) {
      return true;
    }

    // Check for duplicate in existing comments (including nested replies)
    const checkCommentsRecursively = (comments: CommentType[]): boolean => {
      return comments.some(comment => {
        if (comment.id === newComment.id) return true;
        if (comment.replies) {
          return checkCommentsRecursively(comment.replies);
        }
        return false;
      });
    };

    return checkCommentsRecursively(existingComments);
  }, []);

  const markCommentAsProcessing = useCallback((commentId: string) => {
    processingComments.current.add(commentId);
  }, []);

  const markCommentAsAdded = useCallback((commentId: string) => {
    // Remove from processing
    processingComments.current.delete(commentId);
    
    // Add to recently added
    recentlyAddedComments.current.add(commentId);
    
    // Remove from recently added after 5 seconds
    setTimeout(() => {
      recentlyAddedComments.current.delete(commentId);
    }, 5000);
  }, []);

  const clearProcessing = useCallback((commentId: string) => {
    processingComments.current.delete(commentId);
  }, []);

  return {
    isCommentDuplicate,
    markCommentAsProcessing,
    markCommentAsAdded,
    clearProcessing
  };
};