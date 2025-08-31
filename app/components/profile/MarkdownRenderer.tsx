import { useMemo, useEffect, useState } from 'react';
import { renderMarkdownSafely } from '~/utils/markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  userData?: any; // For processing placeholders
}

export function MarkdownRenderer({ content, className = "", userData }: MarkdownRendererProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processMarkdown = async () => {
      setIsLoading(true);
      try {
        const html = await renderMarkdownSafely(content, userData);
        setSanitizedHtml(html);
      } catch (error) {
        console.error('Error processing markdown:', error);
        setSanitizedHtml('<p class="text-red-500">Error rendering content</p>');
      } finally {
        setIsLoading(false);
      }
    };

    if (content) {
      processMarkdown();
    } else {
      setSanitizedHtml('');
      setIsLoading(false);
    }
  }, [content, userData]);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={`text-gray-500 dark:text-gray-400 italic ${className}`}>
        No content available
      </div>
    );
  }

  return (
    <div 
      className={`prose prose-sm dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{
        // Custom styles for better integration with the design system
        '--tw-prose-body': 'rgb(55 65 81)',
        '--tw-prose-headings': 'rgb(17 24 39)',
        '--tw-prose-lead': 'rgb(75 85 99)',
        '--tw-prose-links': 'rgb(37 99 235)',
        '--tw-prose-bold': 'rgb(17 24 39)',
        '--tw-prose-counters': 'rgb(107 114 128)',
        '--tw-prose-bullets': 'rgb(209 213 219)',
        '--tw-prose-hr': 'rgb(229 231 235)',
        '--tw-prose-quotes': 'rgb(17 24 39)',
        '--tw-prose-quote-borders': 'rgb(229 231 235)',
        '--tw-prose-captions': 'rgb(107 114 128)',
        '--tw-prose-code': 'rgb(17 24 39)',
        '--tw-prose-pre-code': 'rgb(229 231 235)',
        '--tw-prose-pre-bg': 'rgb(17 24 39)',
        '--tw-prose-th-borders': 'rgb(209 213 219)',
        '--tw-prose-td-borders': 'rgb(229 231 235)',
        // Dark mode colors
        '--tw-prose-invert-body': 'rgb(209 213 219)',
        '--tw-prose-invert-headings': 'rgb(255 255 255)',
        '--tw-prose-invert-lead': 'rgb(156 163 175)',
        '--tw-prose-invert-links': 'rgb(96 165 250)',
        '--tw-prose-invert-bold': 'rgb(255 255 255)',
        '--tw-prose-invert-counters': 'rgb(156 163 175)',
        '--tw-prose-invert-bullets': 'rgb(75 85 99)',
        '--tw-prose-invert-hr': 'rgb(55 65 81)',
        '--tw-prose-invert-quotes': 'rgb(243 244 246)',
        '--tw-prose-invert-quote-borders': 'rgb(55 65 81)',
        '--tw-prose-invert-captions': 'rgb(156 163 175)',
        '--tw-prose-invert-code': 'rgb(255 255 255)',
        '--tw-prose-invert-pre-code': 'rgb(209 213 219)',
        '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 0.5)',
        '--tw-prose-invert-th-borders': 'rgb(75 85 99)',
        '--tw-prose-invert-td-borders': 'rgb(55 65 81)'
      } as React.CSSProperties}
    />
  );
}
