# Authentication System Documentation

## Overview

The authentication system has been refactored to use **Zustand** as the single source of truth for all auth state. This eliminates the dual storage system that was causing JWT token inconsistencies.

## Key Changes

### 1. Single Source of Truth
- **Before**: Dual storage (Zustand + direct localStorage)
- **After**: Zustand store only with persist middleware

### 2. 7-Day Persistence
- Auth data is automatically persisted for 7 days
- No manual localStorage management needed
- Automatic cleanup on logout

### 3. Migration System
- Automatic migration from legacy storage
- Backward compatibility during transition
- Cleanup utilities for legacy data

## Architecture

### Zustand Store (`app/store/authStore.ts`)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Storage Utility (`app/lib/storage.ts`)
- Wrapper around Zustand store
- Consistent API for auth operations
- Helper functions for common operations

### Migration Utility (`app/utils/authMigration.ts`)
- Detects legacy storage data
- Migrates data to Zustand
- Cleans up legacy storage

## Usage

### Basic Auth Operations
```typescript
import { useAuthStore } from '~/store/authStore';
import { storage } from '~/lib/storage';

// Get current state
const { user, token, isAuthenticated } = useAuthStore();

// Check if authenticated
const isAuth = storage.isAuthenticated();

// Get auth state
const authState = storage.getAuthState();
```

### Login Flow
```typescript
import { useAuth } from '~/hooks/useAuth';

const { login } = useAuth();

const handleLogin = async (credentials) => {
  const result = await login(credentials);
  if (result.success) {
    // User is now logged in
    // Token is automatically persisted
  }
};
```

### Logout Flow
```typescript
import { useAuth } from '~/hooks/useAuth';

const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // All auth data is cleared automatically
};
```

## Migration

### Automatic Migration
The system automatically detects and migrates legacy data on app initialization.

### Manual Migration
```typescript
import { authMigration } from '~/utils/authMigration';

// Check for legacy data
if (authMigration.hasLegacyData()) {
  // Migrate to Zustand
  authMigration.migrateLegacyData();
}

// Clean up legacy storage
authMigration.cleanupLegacyData();
```

## Debug Tools

### AuthDebug Component
Use the `AuthDebug` component to inspect the current auth state:

```typescript
import { AuthDebug } from '~/components/AuthDebug';

// Add to any page for debugging
<AuthDebug />
```

### Console Logging
The system provides detailed console logging in development mode:
- Token validation
- Storage operations
- Migration events
- Error handling

## Benefits

### 1. Consistency
- Single source of truth eliminates token inconsistencies
- No more "JWT strings must contain exactly 2 period characters" errors

### 2. Reliability
- Automatic persistence with Zustand
- Proper cleanup on logout
- Error handling and recovery

### 3. Developer Experience
- Simple, consistent API
- Debug tools included
- Clear logging and error messages

### 4. Performance
- Reduced localStorage operations
- Efficient state management
- Automatic hydration

## Troubleshooting

### Common Issues

1. **Token not found**
   - Check if user is logged in: `useAuthStore.getState().isAuthenticated`
   - Verify token exists: `useAuthStore.getState().token`

2. **Legacy data conflicts**
   - Use `AuthDebug` component to inspect storage
   - Run `authMigration.cleanupLegacyData()` to clear legacy data

3. **Migration issues**
   - Check console for migration logs
   - Use `authMigration.checkConsistency()` to diagnose issues

### Debug Commands
```javascript
// In browser console
// Check current state
console.log(useAuthStore.getState());

// Check storage
console.log(localStorage.getItem('auth-storage'));

// Clear all data
useAuthStore.getState().logout();
```

## Future Improvements

1. **Token Refresh**: Implement automatic token refresh
2. **Session Management**: Add session timeout handling
3. **Multi-tab Sync**: Synchronize auth state across browser tabs
4. **Offline Support**: Handle authentication in offline mode 