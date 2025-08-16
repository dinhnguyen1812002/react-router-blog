# Design Document

## Overview

Thiết kế một trang quản lý newsletter admin hiện đại và toàn diện, tích hợp đầy đủ các API có sẵn để cung cấp trải nghiệm quản lý newsletter hoàn chỉnh. Trang sẽ được xây dựng với React, TypeScript, và các thư viện UI hiện đại, đảm bảo performance tốt và UX mượt mà.

## Architecture

### High-Level Architecture

```
Newsletter Admin Management System
├── Dashboard Overview
│   ├── Analytics Cards
│   ├── Recent Activities
│   └── Quick Actions
├── Subscribers Management
│   ├── Subscribers Table
│   ├── Bulk Operations
│   ├── Import/Export
│   └── Filters & Search
├── Templates Management
│   ├── Templates List
│   ├── Template Editor
│   └── Template Preview
├── Campaigns Management
│   ├── Campaigns List
│   ├── Campaign Creator
│   ├── Campaign Scheduler
│   └── Campaign Analytics
└── Analytics & Reports
    ├── Performance Metrics
    ├── Growth Charts
    └── Export Reports
```

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **State Management**: React Query + Zustand
- **UI Framework**: Tailwind CSS + Shadcn/ui
- **Rich Text Editor**: TinyMCE hoặc Quill
- **Charts**: Recharts hoặc Chart.js
- **Date Handling**: date-fns
- **Form Handling**: React Hook Form + Zod validation

## Components and Interfaces

### 1. Main Layout Component

**File**: `app/routes/dashboard/newsletter.tsx`

```typescript
interface NewsletterAdminLayoutProps {
  children: React.ReactNode;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType;
  component: React.ComponentType;
}
```

**Features**:
- Tab-based navigation (Dashboard, Subscribers, Templates, Campaigns, Analytics)
- Responsive sidebar navigation
- Breadcrumb navigation
- Global search functionality

### 2. Dashboard Overview Component

**File**: `app/components/newsletter/admin/Dashboard.tsx`

```typescript
interface DashboardStats {
  totalSubscribers: number;
  activeSubscribers: number;
  pendingSubscribers: number;
  campaignsSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  subscriberGrowth: Array<{
    period: string;
    count: number;
  }>;
}
```

**Features**:
- Statistics cards với real-time data
- Growth charts với Recharts
- Recent activities feed
- Quick action buttons

### 3. Subscribers Management Component

**File**: `app/components/newsletter/admin/SubscribersManagement.tsx`

```typescript
interface SubscribersTableProps {
  subscribers: PaginatedSubscribers;
  onStatusUpdate: (email: string, status: string) => void;
  onResendConfirmation: (email: string) => void;
  onDelete: (id: number) => void;
  onBulkAction: (action: string, ids: number[]) => void;
}

interface FilterState {
  status: 'all' | 'active' | 'pending' | 'unsubscribed';
  search: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}
```

**Features**:
- Advanced data table với sorting, filtering, pagination
- Bulk selection và bulk actions
- Inline editing cho subscriber status
- Export functionality (CSV, Excel)
- Import subscribers từ CSV

### 4. Templates Management Component

**File**: `app/components/newsletter/admin/TemplatesManagement.tsx`

```typescript
interface TemplateEditorProps {
  template?: NewsletterTemplate;
  onSave: (data: CreateNewsletterTemplateRequest) => void;
  onCancel: () => void;
}

interface TemplatePreviewProps {
  template: NewsletterTemplate;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}
```

**Features**:
- Templates grid layout với preview cards
- Rich text editor cho template content
- Template preview modal
- Drag & drop template reordering
- Template duplication functionality

### 5. Campaigns Management Component

**File**: `app/components/newsletter/admin/CampaignsManagement.tsx`

```typescript
interface CampaignCreatorProps {
  templates: NewsletterTemplate[];
  onSave: (data: CreateNewsletterCampaignRequest) => void;
  onCancel: () => void;
}

interface CampaignSchedulerProps {
  campaign: NewsletterCampaign;
  onSchedule: (scheduledAt: Date) => void;
  onSendNow: () => void;
}
```

**Features**:
- Campaign creation wizard
- Template selection hoặc custom content
- Recipient targeting (all/active)
- Campaign scheduling với calendar picker
- Campaign analytics dashboard

### 6. Rich Text Editor Component

**File**: `app/components/newsletter/admin/RichTextEditor.tsx`

```typescript
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  plugins?: string[];
}
```

**Features**:
- TinyMCE integration với custom toolbar
- Image upload và management
- HTML source code editing
- Auto-save functionality
- Template variables insertion

### 7. Analytics Component

**File**: `app/components/newsletter/admin/Analytics.tsx`

```typescript
interface AnalyticsChartProps {
  data: NewsletterAnalytics;
  type: 'subscribers' | 'campaigns' | 'engagement';
  timeRange: 'week' | 'month' | 'quarter' | 'year';
}
```

**Features**:
- Interactive charts với Recharts
- Time range selection
- Metrics comparison
- Export analytics reports
- Campaign performance breakdown

## Data Models

### Enhanced State Management

```typescript
// Zustand store cho UI state
interface NewsletterAdminStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  selectedSubscribers: number[];
  setSelectedSubscribers: (ids: number[]) => void;
  
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  
  bulkOperationProgress: BulkOperationProgress | null;
  setBulkOperationProgress: (progress: BulkOperationProgress | null) => void;
}

// Form validation schemas
const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  isDefault: z.boolean().optional(),
});

const campaignSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  recipientType: z.enum(['all', 'active']),
  scheduledAt: z.date().optional(),
  templateId: z.number().optional(),
});
```

## Error Handling

### 1. Error Boundary Strategy

```typescript
interface NewsletterErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
```

**Implementation**:
- Wrap toàn bộ newsletter admin trong error boundary
- Fallback UI với retry functionality
- Error logging và reporting
- Graceful degradation cho từng section

### 2. API Error Handling

```typescript
interface ApiErrorHandler {
  handleError: (error: unknown) => {
    message: string;
    type: 'error' | 'warning' | 'info';
    action?: () => void;
  };
}
```

**Strategy**:
- Centralized error handling với custom hook
- User-friendly error messages
- Retry mechanisms với exponential backoff
- Offline detection và handling

### 3. Form Validation

- Real-time validation với Zod schemas
- Custom validation rules cho email formats
- Async validation cho duplicate checking
- Clear error messages với field highlighting

## Testing Strategy

### 1. Unit Tests

**Components to test**:
- RichTextEditor functionality
- Form validation logic
- Bulk operations handler
- Analytics calculations
- Error boundary behavior

**Test scenarios**:
- Form submission với valid/invalid data
- Bulk operations với mixed results
- Error recovery scenarios
- Loading states transitions

### 2. Integration Tests

**Workflows to test**:
- Complete campaign creation và sending
- Subscriber import process
- Template creation và usage
- Analytics data fetching và display

### 3. E2E Tests

**User journeys**:
- Admin login và navigation
- Create campaign từ template
- Bulk subscriber management
- Export functionality

## Performance Optimizations

### 1. Data Loading Strategy

```typescript
// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

**Optimizations**:
- Pagination cho large datasets
- Virtual scrolling cho subscribers table
- Lazy loading cho heavy components
- Background data refetching

### 2. UI Performance

```typescript
// Memoization strategy
const MemoizedSubscriberRow = React.memo(SubscriberRow, (prev, next) => {
  return prev.subscriber.id === next.subscriber.id &&
         prev.subscriber.status === next.subscriber.status;
});
```

**Techniques**:
- React.memo cho expensive components
- useMemo cho heavy calculations
- useCallback cho event handlers
- Debounced search input

### 3. Bundle Optimization

- Code splitting theo routes
- Lazy loading cho rich text editor
- Tree shaking cho unused utilities
- Image optimization và lazy loading

## Security Considerations

### 1. Input Sanitization

```typescript
// HTML sanitization cho rich text content
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
  });
};
```

### 2. Access Control

- Role-based access control
- API endpoint protection
- Sensitive data masking
- Audit logging cho admin actions

### 3. Data Protection

- Email address encryption in transit
- Secure file upload handling
- XSS prevention trong rich text editor
- CSRF protection cho forms

## Responsive Design

### 1. Breakpoint Strategy

```css
/* Mobile First Approach */
.newsletter-admin {
  @apply w-full;
  
  @screen md {
    @apply max-w-4xl mx-auto;
  }
  
  @screen lg {
    @apply max-w-6xl;
  }
  
  @screen xl {
    @apply max-w-7xl;
  }
}
```

### 2. Mobile Adaptations

- Collapsible sidebar navigation
- Touch-friendly buttons và controls
- Responsive tables với horizontal scroll
- Mobile-optimized modals và forms

### 3. Accessibility

- ARIA labels cho screen readers
- Keyboard navigation support
- High contrast mode support
- Focus management trong modals