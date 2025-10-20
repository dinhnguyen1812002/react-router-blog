import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Eye, X } from 'lucide-react';
import type { Post } from '~/types';

interface PostPreviewProps {
  post: {
    title: string;
    content: string;
    summary?: string;
    thumbnailUrl?: string;
    contentType: 'MARKDOWN' | 'RICHTEXT';
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function PostPreview({ post, isOpen, onClose }: PostPreviewProps) {
  if (!isOpen) return null;

  const renderContent = () => {
    if (post.contentType === 'MARKDOWN') {
      // For now, just display as text. In a real app, you'd use a markdown renderer
      return (
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm">
            {post.content}
          </pre>
        </div>
      );
    } else {
      // Rich text content
      return (
        <div 
          className="prose prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Xem trước bài viết
            </h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <article className="p-6">
            {/* Thumbnail */}
            {post.thumbnailUrl && (
              <div className="mb-6">
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {post.title || 'Tiêu đề bài viết'}
            </h1>

            {/* Summary */}
            {post.summary && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 dark:text-gray-300 italic">
                  {post.summary}
                </p>
              </div>
            )}

            {/* Content */}
            <div className="text-gray-900 dark:text-gray-100">
              {post.content ? renderContent() : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Chưa có nội dung...
                </p>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}