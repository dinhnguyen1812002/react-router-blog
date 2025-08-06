# Editor Components

This directory contains custom editor components for the blog application.

## Components

- `RichTextEditor.tsx` - TipTap-based rich text editor
- `MarkdownEditor.tsx` - React MD Editor for markdown editing
- `EditorWrapper.tsx` - Wrapper component that safely loads editors
- `editor-styles.css` - Custom styles for both editors

## Installation

To use the full-featured editors, install the required dependencies:

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link @tiptap/extension-image @uiw/react-md-editor
```

## Features

### Rich Text Editor (TipTap)
- Bold, italic, headings (H1, H2, H3)
- Bullet and numbered lists
- Blockquotes and code blocks
- Links and images
- Undo/redo functionality
- Custom toolbar with shadcn/ui styling

### Markdown Editor (React MD Editor)
- Live preview mode
- Edit-only mode
- Preview-only mode
- Syntax highlighting
- Custom styling to match the design system

### Editor Wrapper
- Safe loading with fallback to basic textarea
- Dynamic imports to reduce bundle size
- Loading states with skeleton UI
- Error handling for missing dependencies

## Usage

```tsx
import EditorWrapper from '~/components/editors/EditorWrapper';

<EditorWrapper
  contentType="RICHTEXT" // or "MARKDOWN"
  value={content}
  onChange={setContent}
  placeholder="Write your content..."
/>
```

## Fallback Behavior

If the required dependencies are not installed, the EditorWrapper will automatically fall back to a basic textarea with the same styling as the rest of the application.

## Styling

The editors are styled to match the shadcn/ui design system and support both light and dark modes. Custom styles are defined in `editor-styles.css`. 