import { useState, useEffect } from 'react';
import './editor-styles.css';

interface EditorWrapperProps {
  contentType: 'RICHTEXT' | 'MARKDOWN';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function EditorWrapper({ contentType, value, onChange, placeholder }: EditorWrapperProps) {
  const [RichTextEditor, setRichTextEditor] = useState<any>(null);
  const [MarkdownEditor, setMarkdownEditor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEditors = async () => {
      try {
        if (contentType === 'RICHTEXT') {
          const { default: RichTextEditorComponent } = await import('./RichTextEditor');
          setRichTextEditor(() => RichTextEditorComponent);
        } else {
          const { default: MarkdownEditorComponent } = await import('./MarkdownEditor');
          setMarkdownEditor(() => MarkdownEditorComponent);
        }
      } catch (error) {
        console.error('Failed to load editor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEditors();
  }, [contentType]);

  if (isLoading) {
    return (
      <div className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (contentType === 'RICHTEXT' && RichTextEditor) {
    return (
      <RichTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    );
  }

  if (contentType === 'MARKDOWN' && MarkdownEditor) {
    return (
      <MarkdownEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    );
  }

  // Fallback to basic textarea if editors fail to load
  return (
    <div className=" dark:border-gray-600 rounded-md bg-white ">
      <div className="p-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Viết nội dung bài viết...'}
          className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 font-mono text-base resize-none min-h-[400px]"
        />
      </div>
    </div>
  );
} 