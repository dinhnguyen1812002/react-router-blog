# Report Feature Integration Guide

This guide shows how to integrate the article reporting functionality into your React Router blog application.

## Quick Start

### 1. Add Report Button to Article Components

```tsx
import { ReportButton } from "~/components/article";

// In your article card or post component
function ArticleCard({ post }) {
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      
      {/* Add report button */}
      <ReportButton
        postId={post.id}
        postTitle={post.title}
        variant="ghost"
        size="sm"
      />
    </div>
  );
}
```

### 2. Create Admin Reports Page

```tsx
import { ReportsDashboard, ReportsList } from "~/components/admin/reports-index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";

export default function AdminReportsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Reports Management</h1>
      
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">All Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <ReportsDashboard />
        </TabsContent>
        
        <TabsContent value="reports">
          <ReportsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 3. Add Report Details Page

```tsx
import { ReportDetails } from "~/components/admin/reports-index";
import { useParams, useNavigate } from "@tanstack/react-router";

export default function ReportDetailsPage() {
  const { reportId } = useParams({ from: "/admin/reports/$reportId" });
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <ReportDetails
        reportId={reportId}
        onBack={() => navigate({ to: "/admin/reports" })}
      />
    </div>
  );
}
```

## Component Usage Examples

### ReportButton Props

```tsx
<ReportButton
  postId="post-123"
  postTitle="Article Title"
  variant="ghost"          // "default" | "outline" | "ghost" | "secondary"
  size="sm"               // "default" | "sm" | "lg" | "icon"
  className="ml-auto"     // Additional CSS classes
/>
```

### ReportStatusBadge Props

```tsx
import { ReportStatusBadge } from "~/components/article";

<ReportStatusBadge
  status="PENDING"         // "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED"
  className="mb-2"        // Additional CSS classes
/>
```

### Standalone ReportDialog

```tsx
import { ReportDialog } from "~/components/article";
import { useState } from "react";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ReportDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      postId="post-123"
      postTitle="Article Title"
    />
  );
}
```

## Route Configuration

Add these routes to your React Router configuration:

```tsx
// Admin routes
{
  path: "/admin/reports",
  component: AdminReportsPage,
},
{
  path: "/admin/reports/:reportId",
  component: ReportDetailsPage,
},
```

## Features Included

### User Features
- **Report Submission**: Users can report articles with categories and descriptions
- **Duplicate Prevention**: Users cannot report the same article twice
- **Rate Limiting**: Maximum 5 reports per hour per user
- **Real-time Validation**: Form validation with helpful error messages

### Admin Features
- **Statistics Dashboard**: Overview of reports with charts and metrics
- **Reports List**: Filterable and paginated list of all reports
- **Report Details**: Detailed view with status update functionality
- **Status Management**: Update report status with admin notes
- **Report Deletion**: Remove reports when necessary

### Security Features
- **Authentication Required**: Users must be logged in to submit reports
- **Admin Authorization**: Only admin users can manage reports
- **Input Validation**: All fields validated with length and format checks
- **Error Handling**: Comprehensive error handling with user-friendly messages

## API Integration

The feature uses TanStack Query for efficient API state management:

```tsx
// Automatic caching and refetching
const { data: reports, isLoading } = useQuery({
  queryKey: ["admin-reports", filters],
  queryFn: () => reportApi.getAdminReports(filters),
  staleTime: 2 * 60 * 1000, // 2 minutes
});

// Optimistic updates
const mutation = useMutation({
  mutationFn: reportApi.updateReportStatus,
  onSuccess: () => {
    toast.success("Report updated successfully");
    queryClient.invalidateQueries(["admin-reports"]);
  },
});
```

## Styling and Theming

The components use the existing design system:
- **Minimalist Design**: Clean, simple interface following shadcn/ui patterns
- **Responsive Layout**: Works on all screen sizes
- **Dark Mode Support**: Automatic theme switching
- **Consistent Styling**: Uses existing UI components and tokens

## Performance Optimizations

- **State Management**: Efficient state updates to prevent unnecessary re-renders
- **Component Memoization**: Components optimized for performance
- **Lazy Loading**: Admin components loaded only when needed
- **Query Caching**: Intelligent caching to reduce API calls

## Error Handling

Comprehensive error handling throughout:
- **Network Errors**: Graceful handling of connection issues
- **Validation Errors**: User-friendly validation messages
- **Permission Errors**: Clear messaging for authorization issues
- **Toast Notifications**: Non-intrusive feedback for all actions

This implementation provides a complete, production-ready article reporting system that integrates seamlessly with your existing React Router blog application.
