# Design Document

## Overview

Thiết kế giải pháp để sửa lỗi authentication trong dashboard bằng cách:
1. Thêm authentication check vào dashboard layout
2. Sử dụng ProtectedRoute component để bảo vệ dashboard routes
3. Cải thiện hydration handling trong auth store
4. Dọn dẹp và tổ chức lại route configuration

## Architecture

### Authentication Flow
```
User Access Dashboard Route
    ↓
Check if Auth Store Hydrated
    ↓ (No)
Show Loading State
    ↓
Wait for Hydration
    ↓ (Yes)
Check Authentication Status
    ↓ (Not Authenticated)
Redirect to Login with Return URL
    ↓ (Authenticated)
Check Token Validity
    ↓ (Invalid/Expired)
Logout & Redirect to Login
    ↓ (Valid)
Render Dashboard Content
```

### Component Hierarchy
```
Dashboard Routes
    ↓
ProtectedRoute (Authentication Guard)
    ↓
DashboardLayout (UI Layout)
    ↓
Dashboard Content Components
```

## Components and Interfaces

### 1. Enhanced ProtectedRoute Component

**Current Issues:**
- Không handle hydration state
- Không có loading state
- Redirect logic có thể cải thiện

**Improvements:**
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  showLoading?: boolean;
}
```

**New Features:**
- Hydration state handling
- Loading state display
- Better redirect with return URL
- Token validity check

### 2. Enhanced Auth Store

**Current Issues:**
- Hydration state không được sử dụng đúng cách
- Token validity check không được gọi tự động

**Improvements:**
- Better hydration handling
- Automatic token validation on hydration
- Improved loading states

### 3. Dashboard Layout Updates

**Current Issues:**
- Không có authentication check
- Không handle loading states

**Improvements:**
- Integrate with ProtectedRoute
- Add loading states
- Better error handling

### 4. Route Configuration Cleanup

**Current Issues:**
- Duplicate routes (nested vs flat)
- Inconsistent structure
- Some routes not protected

**Improvements:**
- Consolidate all dashboard routes under nested structure
- Remove duplicate routes
- Ensure all dashboard routes are protected

## Data Models

### AuthState Enhancement
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
  isInitializing: boolean; // New: for initial app load
}
```

### Route Protection Metadata
```typescript
interface RouteProtection {
  requireAuth: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}
```

## Error Handling

### Authentication Errors
1. **Token Expired**: Auto logout và redirect đến login
2. **Invalid Token**: Clear auth state và redirect
3. **Network Error**: Show error message, retry mechanism
4. **Hydration Error**: Fallback to login state

### Loading States
1. **Initial Load**: Full page loading spinner
2. **Hydration**: Skeleton loading
3. **Route Transition**: Route loading indicator
4. **Authentication Check**: Minimal loading state

## Testing Strategy

### Unit Tests
1. **ProtectedRoute Component**
   - Test authentication check
   - Test redirect behavior
   - Test loading states
   - Test hydration handling

2. **Auth Store**
   - Test hydration logic
   - Test token validation
   - Test automatic logout
   - Test loading states

3. **Dashboard Layout**
   - Test rendering with auth
   - Test loading states
   - Test error states

### Integration Tests
1. **Authentication Flow**
   - Test full login → dashboard flow
   - Test refresh page behavior
   - Test token expiration handling
   - Test logout flow

2. **Route Protection**
   - Test protected route access
   - Test redirect behavior
   - Test return URL functionality

### E2E Tests
1. **User Journey**
   - Unauthenticated user tries to access dashboard
   - Authenticated user accesses dashboard
   - User refreshes dashboard page
   - Token expires during dashboard usage

## Implementation Plan

### Phase 1: Core Authentication Fix
1. Enhance ProtectedRoute component
2. Update auth store hydration logic
3. Add loading states

### Phase 2: Dashboard Integration
1. Wrap dashboard routes with ProtectedRoute
2. Update dashboard layout
3. Add error handling

### Phase 3: Route Cleanup
1. Consolidate route configuration
2. Remove duplicate routes
3. Ensure consistent protection

### Phase 4: Testing & Polish
1. Add comprehensive tests
2. Improve error messages
3. Optimize loading states