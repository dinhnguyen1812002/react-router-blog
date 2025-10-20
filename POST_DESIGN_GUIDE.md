# Post Detail Page Redesign Guide

## Tổng quan

Trang post detail đã được thiết kế lại với giao diện hiện đại, responsive và tối ưu hóa cho trải nghiệm đọc. Thiết kế mới tập trung vào:

- **Typography tốt hơn**: Sử dụng font sizes và spacing tối ưu
- **Visual hierarchy rõ ràng**: Phân cấp thông tin theo tầm quan trọng
- **Interactive elements**: Hover effects, transitions, và animations
- **Accessibility**: Focus states, keyboard navigation, và screen reader support
- **Performance**: Lazy loading, progressive content loading

## Layout Structure

### 1. Header Section
```tsx
<header className="mb-12">
  {/* Categories & Featured Badge */}
  {/* Title */}
  {/* Summary */}
  {/* Meta Information */}
</header>
```

**Key Features:**
- Gradient background cho featured badge
- Responsive typography cho title (4xl → 6xl)
- Enhanced meta information với icons và color coding
- Improved spacing và visual hierarchy

### 2. Main Content Area
```tsx
<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
  <article className="lg:col-span-3">
    {/* Post Content */}
    {/* Author Info */}
    {/* Tags */}
    {/* Comments */}
  </article>
  <aside className="lg:col-span-1">
    {/* Table of Contents */}
    {/* Related Posts */}
  </aside>
</div>
```

**Key Features:**
- Grid layout responsive (1 column mobile, 4 columns desktop)
- Sticky sidebar với table of contents
- Card-based design cho từng section

## CSS Classes và Styling

### Post Content Styling

File `app/styles/post-content.css` chứa tất cả styling tùy chỉnh cho nội dung bài viết:

#### Base Class
```css
.post-content {
  @apply prose prose-lg max-w-none;
}
```

#### Typography Classes
```css
/* Headings */
.post-content h1 {
  @apply text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 mt-12 first:mt-0;
  @apply leading-tight tracking-tight;
  @apply scroll-mt-20;
}

.post-content h2 {
  @apply text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-100 mb-6 mt-10;
  @apply leading-tight;
  @apply scroll-mt-16;
}

/* Paragraphs */
.post-content p {
  @apply text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6;
  @apply font-normal;
}
```

#### Enhanced Elements
```css
/* Blockquotes */
.post-content blockquote {
  @apply border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20;
  @apply pl-6 py-4 pr-4 rounded-r-lg;
  @apply my-8;
  @apply italic text-gray-700 dark:text-gray-300;
  @apply relative;
}

/* Code Blocks */
.post-content pre {
  @apply bg-gray-900 dark:bg-black text-gray-100;
  @apply p-6 rounded-xl overflow-x-auto;
  @apply my-8;
  @apply border border-gray-700 dark:border-gray-600;
  @apply shadow-lg;
}

/* Images */
.post-content img {
  @apply rounded-xl shadow-lg;
  @apply my-8;
  @apply max-w-full h-auto;
  @apply transition-transform duration-300 hover:scale-105;
}
```

### Component-Specific Classes

#### Meta Information Cards
```tsx
<div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 mb-8">
```

#### Action Buttons
```tsx
<button className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
```

#### Author Info Section
```tsx
<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 mb-8">
```

## Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - Single column layout
- **Tablet**: `768px - 1024px` - Adjusted spacing và typography
- **Desktop**: `> 1024px` - Full grid layout với sidebar

### Responsive Typography
```css
@media (max-width: 768px) {
  .post-content h1 {
    @apply text-3xl;
  }
  
  .post-content h2 {
    @apply text-2xl;
  }
  
  .post-content p {
    @apply text-base;
  }
}
```

## Interactive Elements

### Hover Effects
```css
/* Button hover effects */
.hover-lift:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Image hover effects */
.post-content img:hover {
  @apply shadow-xl;
  transform: scale(1.05);
}
```

### Transitions
```css
/* Smooth transitions */
.transition-smooth {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button transitions */
.btn-hover-scale:hover {
  transform: scale(1.02);
}
```

## Dark Mode Support

### Color Variables
```css
:root {
  --background: 255 255 255;
  --foreground: 17 24 39;
  --card: 255 255 255;
  --card-foreground: 17 24 39;
}

.dark {
  --background: 31 41 55;
  --foreground: 249 250 251;
  --card: 55 65 81;
  --card-foreground: 249 250 251;
}
```

### Dark Mode Specific Styles
```css
.dark .post-content {
  --tw-prose-invert-headings: rgb(255 255 255);
  --tw-prose-invert-body: rgb(209 213 219);
  --tw-prose-invert-links: rgb(96 165 250);
}
```

## Performance Optimizations

### Lazy Loading
- Images được lazy load với `loading="lazy"`
- Progressive content loading với `ProgressiveContentLoader`
- Intersection Observer cho table of contents

### CSS Optimizations
- Sử dụng CSS custom properties cho theming
- Minimal reflows với transform thay vì position changes
- Efficient selectors và specificity

## Accessibility Features

### Focus Management
```css
.post-content a:focus,
.post-content button:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}
```

### Screen Reader Support
- Proper heading hierarchy (h1 → h6)
- Alt text cho images
- ARIA labels cho interactive elements
- Semantic HTML structure

### Keyboard Navigation
- Tab order được tối ưu hóa
- Focus indicators rõ ràng
- Keyboard shortcuts cho common actions

## Custom Components

### Enhanced Post Actions
```tsx
<PostActions post={post} />
```

### Reading Progress Bar
```tsx
<ReadingProgressBar
  showBackToTop={true}
  showReadingTime={true}
  showScrollPercentage={true}
  estimatedReadingTime={readingTime}
  position="top"
/>
```

### Table of Contents
```tsx
<TableOfContents />
```

## Usage Examples

### Basic Post Content
```tsx
<ProgressiveContentLoader
  content={post.content}
  className="post-content"
  enableLazyImages={true}
  enableProgressiveText={false}
  onLoadComplete={() => {
    console.log("Post content loaded successfully");
  }}
/>
```

### Custom Styling Override
```tsx
<div className="post-content prose-custom">
  {/* Custom content with additional styling */}
</div>
```

## Best Practices

1. **Typography**: Luôn sử dụng semantic HTML tags (h1-h6, p, strong, em)
2. **Spacing**: Sử dụng consistent spacing với Tailwind utilities
3. **Colors**: Sử dụng CSS custom properties cho theming
4. **Performance**: Minimize reflows và repaints
5. **Accessibility**: Test với screen readers và keyboard navigation
6. **Responsive**: Test trên multiple devices và screen sizes

## Troubleshooting

### Common Issues

1. **Content not rendering properly**: Kiểm tra `ProgressiveContentLoader` props
2. **Styling conflicts**: Đảm bảo CSS specificity đúng
3. **Performance issues**: Kiểm tra lazy loading và image optimization
4. **Accessibility issues**: Validate với accessibility tools

### Debug Tools

- Browser DevTools cho CSS debugging
- Lighthouse cho performance audit
- axe-core cho accessibility testing
- React DevTools cho component debugging

