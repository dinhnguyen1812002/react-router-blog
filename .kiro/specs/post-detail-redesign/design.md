# Design Document - Post Detail & Comment Section Redesign

## Overview

Redesign trang chi tiết bài viết và comment section để tạo ra trải nghiệm đọc và tương tác tốt hơn. Design tập trung vào việc cải thiện visual hierarchy, readability, và user engagement thông qua layout hiện đại và responsive.

## Architecture

### Component Structure
```
PostDetailPage
├── PostHeader (breadcrumb, meta info)
├── PostContent
│   ├── FeaturedImage
│   ├── PostMeta (title, author, date, categories)
│   ├── PostBody (content)
│   ├── PostTags
│   └── PostActions (bookmark, share, like)
├── RelatedPosts
└── CommentSection
    ├── CommentStats
    ├── CommentForm
    └── CommentList
        └── CommentItem (with nested replies)
```

### Layout Strategy
- **Container**: Max-width 4xl với responsive padding
- **Grid System**: CSS Grid cho main layout, Flexbox cho components
- **Spacing**: Consistent spacing scale (4, 6, 8, 12, 16, 24px)
- **Typography**: Improved hierarchy với proper font sizes và line heights

## Components and Interfaces

### 1. Enhanced PostHeader Component
```typescript
interface PostHeaderProps {
  post: Post;
  showBreadcrumb?: boolean;
  showReadingTime?: boolean;
}
```

**Features:**
- Breadcrumb navigation
- Reading time estimation
- Social sharing buttons
- Print-friendly layout

### 2. Redesigned PostContent Component
```typescript
interface PostContentProps {
  post: Post;
  showTableOfContents?: boolean;
  showProgressBar?: boolean;
}
```

**Features:**
- Improved typography với proper prose styling
- Table of contents cho bài viết dài
- Reading progress indicator
- Better image handling với lazy loading

### 3. Enhanced PostActions Component
```typescript
interface PostActionsProps {
  post: Post;
  layout: 'horizontal' | 'vertical' | 'floating';
  showBookmark?: boolean;
  showShare?: boolean;
  showLike?: boolean;
}
```

**Features:**
- Floating action bar khi scroll
- Bookmark functionality
- Social sharing với native Web Share API
- Like/reaction system

### 4. Redesigned CommentSection Component
```typescript
interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  sortBy?: 'newest' | 'oldest' | 'popular';
  showCommentCount?: boolean;
  enableRealtime?: boolean;
}
```

**Features:**
- Comment sorting options
- Real-time updates
- Better nested comment visualization
- Comment moderation tools

### 5. Enhanced CommentItem Component
```typescript
interface CommentItemProps {
  comment: Comment;
  depth: number;
  maxDepth?: number;
  showVoting?: boolean;
  showReplyButton?: boolean;
  onReply?: (commentId: string) => void;
}
```

**Features:**
- Improved visual hierarchy cho nested comments
- Vote system (upvote/downvote)
- Better reply threading
- Comment actions (edit, delete, report)

## Data Models

### Enhanced Post Model
```typescript
interface Post {
  // Existing fields...
  readingTime?: number;
  viewCount?: number;
  likeCount?: number;
  bookmarkCount?: number;
  shareCount?: number;
  relatedPosts?: Post[];
  tableOfContents?: TableOfContentsItem[];
}

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  anchor: string;
}
```

### Enhanced Comment Model
```typescript
interface Comment {
  // Existing fields...
  voteScore?: number;
  userVote?: 'up' | 'down' | null;
  isEdited?: boolean;
  editedAt?: string;
  isPinned?: boolean;
  isHighlighted?: boolean;
  mentions?: User[];
}
```

## Visual Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  
  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  
  /* Text Colors */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
}
```

### Typography Scale
```css
.text-display {
  font-size: 3.75rem; /* 60px */
  line-height: 1.1;
  font-weight: 800;
}

.text-h1 {
  font-size: 2.25rem; /* 36px */
  line-height: 1.2;
  font-weight: 700;
}

.text-body {
  font-size: 1.125rem; /* 18px */
  line-height: 1.7;
  font-weight: 400;
}
```

### Spacing System
```css
.space-xs { margin: 0.25rem; }
.space-sm { margin: 0.5rem; }
.space-md { margin: 1rem; }
.space-lg { margin: 1.5rem; }
.space-xl { margin: 2rem; }
.space-2xl { margin: 3rem; }
```

## Layout Improvements

### 1. Post Header Layout
```
┌─────────────────────────────────────────┐
│ Breadcrumb Navigation                   │
├─────────────────────────────────────────┤
│ Featured Image (16:9 aspect ratio)     │
├─────────────────────────────────────────┤
│ Categories & Tags                       │
│ Post Title (Large, Bold)               │
│ Post Summary/Excerpt                   │
│                                        │
│ Author Info | Date | Reading Time      │
│ Share Buttons                          │
└─────────────────────────────────────────┘
```

### 2. Post Content Layout
```
┌─────────────────────────────────────────┐
│ Table of Contents (sticky sidebar)     │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │ Post Content                        │ │
│ │ (Improved typography)               │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                        │
│ Tags Section                           │
│ Post Actions (Like, Bookmark, Share)   │
└─────────────────────────────────────────┘
```

### 3. Comment Section Layout
```
┌─────────────────────────────────────────┐
│ Comments (X) | Sort: [Newest ▼]        │
├─────────────────────────────────────────┤
│ Comment Form                           │
├─────────────────────────────────────────┤
│ Comment Item                           │
│ ├─ Reply Item (indented)               │
│ │  ├─ Reply Item (more indented)       │
│ │  └─ Reply Form                       │
│ └─ Reply Form                          │
├─────────────────────────────────────────┤
│ Comment Item                           │
│ └─ Reply Form                          │
└─────────────────────────────────────────┘
```

## Interactive Features

### 1. Reading Progress
- Sticky progress bar ở top của page
- Smooth animation khi scroll
- Percentage indicator

### 2. Floating Action Bar
- Appears khi scroll xuống
- Contains: Like, Bookmark, Share, Back to top
- Responsive positioning

### 3. Comment Interactions
- Real-time comment updates
- Smooth expand/collapse animations
- Vote buttons với haptic feedback
- Reply form slide-in animation

### 4. Social Sharing
- Native Web Share API support
- Fallback cho desktop với modal
- Copy link functionality
- Social media previews

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Collapsible table of contents
- Touch-friendly buttons (min 44px)
- Optimized comment threading

### Tablet (768px - 1024px)
- Two column layout cho content + sidebar
- Sticky table of contents
- Improved spacing

### Desktop (> 1024px)
- Three column layout option
- Floating action sidebar
- Enhanced hover states
- Keyboard navigation support

## Performance Optimizations

### 1. Image Optimization
- Lazy loading cho featured images
- WebP format với fallback
- Responsive images với srcset
- Blur placeholder loading

### 2. Content Loading
- Progressive enhancement
- Skeleton loading states
- Infinite scroll cho comments
- Prefetch related posts

### 3. Caching Strategy
- Browser caching cho static assets
- Service worker cho offline reading
- Comment caching với real-time updates

## Accessibility Features

### 1. Keyboard Navigation
- Tab order optimization
- Focus indicators
- Skip links
- Keyboard shortcuts

### 2. Screen Reader Support
- Proper heading hierarchy
- ARIA labels và descriptions
- Alt text cho images
- Live regions cho dynamic content

### 3. Visual Accessibility
- High contrast mode support
- Font size scaling
- Reduced motion preferences
- Color blind friendly palette

## Error Handling

### 1. Network Errors
- Offline mode support
- Retry mechanisms
- Graceful degradation
- Error state illustrations

### 2. Content Errors
- 404 page với suggestions
- Malformed content handling
- Image loading fallbacks
- Comment submission errors

### 3. User Feedback
- Toast notifications
- Loading states
- Success confirmations
- Error recovery options

## Testing Strategy

### 1. Unit Tests
- Component rendering tests
- User interaction tests
- API integration tests
- Utility function tests

### 2. Integration Tests
- Comment flow testing
- Social sharing testing
- Responsive layout testing
- Performance testing

### 3. E2E Tests
- Complete user journeys
- Cross-browser testing
- Mobile device testing
- Accessibility testing

### 4. Performance Tests
- Core Web Vitals monitoring
- Loading time optimization
- Memory usage testing
- Network throttling tests