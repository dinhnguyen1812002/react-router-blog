import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import './editor-styles.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [preview, setPreview] = useState<'edit' | 'preview' | 'live'>('live');

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setPreview('edit')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              preview === 'edit'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setPreview('preview')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              preview === 'preview'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setPreview('live')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              preview === 'live'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Live
          </button>
        </div>
      </div>

      {/* Editor */}
      <div data-color-mode="auto">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          preview={preview}
          height={400}
          placeholder={placeholder || '# Tiêu đề\n\nViết nội dung bài viết bằng Markdown...'}
          className="border-none"
          textareaProps={{
            placeholder: placeholder || '# Tiêu đề\n\nViết nội dung bài viết bằng Markdown...',
            style: {
              fontSize: '14px',
              fontFamily: 'monospace',
            },
          }}
        />
      </div>
    </div>
  );
} 