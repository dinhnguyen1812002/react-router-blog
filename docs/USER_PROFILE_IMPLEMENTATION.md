# User Profile Management Implementation

This document provides implementation details for the user profile management system, including the profile display and update pages.

## Overview

The user profile management system consists of:
- **Profile Display Page**: Read-only view of user profile information
- **Profile Update Page**: Editable form for updating profile information
- **Reusable Components**: Shared components for consistent UI/UX
- **Security Features**: Input validation and XSS prevention

## Installation

### Required Dependencies

Install the required packages for markdown processing and security:

```bash
npm install marked dompurify @types/dompurify
```

### Optional Dependencies

For enhanced markdown editing experience:

```bash
npm install @uiw/react-md-editor
```

## Components

### Reusable Profile Components

#### ProfileHeader
- **Location**: `app/components/profile/ProfileHeader.tsx`
- **Purpose**: Displays user avatar, name, role badges, and action buttons
- **Features**: Clean, borderless design following user preferences

#### ProfileStats
- **Location**: `app/components/profile/ProfileStats.tsx`
- **Purpose**: Shows user statistics (posts, saved posts, comments)
- **Features**: Icon-based display with consistent styling

#### SocialLinks
- **Location**: `app/components/profile/SocialLinks.tsx`
- **Purpose**: Renders social media links with appropriate icons
- **Features**: Support for LinkedIn, Twitter, Instagram, GitHub, Facebook

#### MarkdownRenderer
- **Location**: `app/components/profile/MarkdownRenderer.tsx`
- **Purpose**: Safely renders markdown content with XSS prevention
- **Features**: 
  - DOMPurify sanitization
  - Placeholder processing ({{latest_posts}}, {{post_count}})
  - Fallback rendering when dependencies are missing
  - Loading states

### Pages

#### Profile Display Page
- **Route**: `/dashboard/profile`
- **File**: `app/routes/dashboard/profile/index.tsx`
- **Features**:
  - Read-only profile information
  - Tabbed interface (About, Posts, Activity)
  - Secure markdown rendering
  - Clean, borderless design

#### Profile Update Page
- **Route**: `/dashboard/profile/edit`
- **File**: `app/routes/dashboard/profile/edit.tsx`
- **Features**:
  - Form validation with Zod schema
  - Markdown editor with live preview
  - Social media links management
  - Input sanitization and validation

## Security Features

### Markdown Processing
- **File**: `app/utils/markdown.ts`
- **Features**:
  - XSS prevention using DOMPurify
  - Content length validation (max 10,000 characters)
  - Dangerous pattern detection
  - Safe placeholder processing

### Input Validation
- Bio: Maximum 500 characters
- Custom Profile Markdown: Maximum 10,000 characters
- Social Media URLs: Valid URL format validation
- XSS prevention for all user inputs

## API Integration

### Profile API Service
- **File**: `app/api/user.ts`
- **New Endpoint**: `updateCustomProfile(markdownContent: string)`
- **Backend Endpoint**: `PUT /api/v1/users/profile/custom`

### Request Format
```json
{
  "markdownContent": "# Welcome to my profile!\n\nI'm a developer..."
}
```

### Response Format
```json
{
  "id": "user-id",
  "username": "john.doe",
  "email": "john.doe@example.com",
  "customProfileMarkdown": "# Welcome to my profile!...",
  "postsCount": 15,
  "savedPostsCount": 5,
  "commentsCount": 42
}
```

## Placeholder System

### Supported Placeholders
- `{{latest_posts}}`: Displays list of 5 most recent posts
- `{{post_count}}`: Shows total number of posts
- `{{user_bio}}`: Displays user bio
- `{{social_links}}`: Shows social media links

### Example Usage
```markdown
# Welcome to my profile!

I'm a passionate developer who loves open source projects.

## My Latest Posts
{{latest_posts}}

**Total Posts:** {{post_count}}

## Connect with me
{{social_links}}
```

## Routing Configuration

Updated `app/routes.ts` to include:
```typescript
route("profile", "routes/dashboard/profile/index.tsx"),
route("profile/edit", "routes/dashboard/profile/edit.tsx"),
```

## Design Principles

### Clean, Borderless Design
- No card styling for sidebar components
- Consistent spacing and typography
- Dark mode support
- Responsive design

### Reusable Components
- TypeScript best practices
- Consistent prop interfaces
- Error handling and loading states
- Accessibility considerations

## Usage Examples

### Basic Profile Display
```tsx
import { ProfileHeader, ProfileStats, SocialLinks } from '~/components/profile';

<ProfileHeader user={user} isOwnProfile={true} />
<ProfileStats user={user} />
<SocialLinks socialMediaLinks={user.socialMediaLinks} />
```

### Secure Markdown Rendering
```tsx
import { MarkdownRenderer } from '~/components/profile/MarkdownRenderer';

<MarkdownRenderer 
  content={user.customProfileMarkdown} 
  userData={user}
/>
```

### Form Validation
```tsx
import { validateMarkdownContent } from '~/utils/markdown';

const validation = validateMarkdownContent(content);
if (!validation.isValid) {
  // Handle validation errors
  console.error(validation.errors);
}
```

## Testing

### Unit Tests
- Component rendering tests
- Form validation tests
- Markdown processing tests
- Security validation tests

### Integration Tests
- API integration tests
- Route navigation tests
- User interaction tests

## Troubleshooting

### Missing Dependencies
If markdown dependencies are not installed, the system will:
- Fall back to basic markdown rendering
- Display warning messages in console
- Continue to function with reduced features

### XSS Prevention
All user-generated content is automatically sanitized:
- Script tags are removed
- Dangerous attributes are stripped
- External links are made safe

## Future Enhancements

- Rich text editor integration
- Image upload for profile content
- Advanced placeholder system
- Profile themes and customization
- Social media integration
- Profile analytics
