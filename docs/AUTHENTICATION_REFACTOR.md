# Authentication Flow Refactor - Memory-Based Token Storage

## Overview

Refactored authentication to follow security best practices:
- **Access Token**: Stored in memory (Zustand state) only - NOT in localStorage
- **Refresh Token**: Stored in HttpOnly Secure Cookie (handled by server)
- **User Info**: Fetched from `/user/profile` endpoint, stored in memory

## Key Changes

### 1. Zustand Store (`app/store/authStore.ts`)

**Before:**
- Used `persist` middleware with localStorage
- Stored both user and token in localStorage
- Vulnerable to XSS attacks

**After:**
- Pure in-memory state (no persistence)
- Token only in memory
- User only in memory
- Added `setUser()` and `setToken()` methods for flexibility

```typescript
// Memory-only state
const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  // ... no persist middleware
}));
```

### 2. Axios Interceptor (`app/config/axios.ts`)

**Key Features:**
- Automatically attaches access token to `Authorization: Bearer {token}` header
- Handles 401 responses with automatic token refresh
- Refresh token sent via HttpOnly Cookie (automatic by browser)
- Request queue during token refresh to prevent race conditions

```typescript
// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles 401 + refresh
```

### 3. Auth Initialization (`app/hooks/useAuthInit.ts`)

**Before:**
- Rehydrated from localStorage
- Checked token expiration

**After:**
- Attempts to refresh token using refresh token cookie
- Fetches user profile if refresh succeeds
- Clears auth state if refresh fails

```typescript
export const useAuthInit = () => {
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try refresh using HttpOnly cookie
        const { accessToken } = await authApi.refreshToken();
        
        if (accessToken) {
          setToken(accessToken);
          // Fetch user profile
          const profileResponse = await authApi.profile();
          setUser(profileResponse.data);
        }
      } catch (error) {
        logout();
      }
    };
    initAuth();
  }, []);
};
```

### 4. Auth Utilities (`app/lib/auth-utils.ts`)

**Changes:**
- `clearAllAuthData()`: Now just logs (auth is in memory)
- `isAuthenticated()`: Reads from Zustand store
- `getAuthToken()`: Reads from Zustand store
- `getCurrentUser()`: Reads from Zustand store
- Removed localStorage/sessionStorage operations

### 5. Auth Hook (`app/hooks/useAuth.ts`)

**No major changes:**
- Still handles login/register/logout
- Token refresh logic moved to axios interceptor
- Periodic token check still works

## Security Benefits

### XSS Protection
- Token not accessible via `localStorage` or `sessionStorage`
- JavaScript cannot read HttpOnly cookies
- Even if XSS occurs, attacker cannot steal tokens

### CSRF Protection
- Refresh token in HttpOnly cookie
- Automatically sent with requests
- Server validates refresh token

### Token Refresh Flow
```
1. User logs in
   ↓
2. Server returns: { accessToken, refreshToken }
   - accessToken → stored in memory
   - refreshToken → set as HttpOnly cookie
   ↓
3. Client makes API request
   - Axios adds: Authorization: Bearer {accessToken}
   - Browser auto-sends: Cookie: refreshToken=...
   ↓
4. If 401 response
   - Axios interceptor calls /auth/refresh-token
   - Server validates refresh token cookie
   - Server returns new accessToken
   - Zustand store updated with new token
   - Original request retried
```

## Backend Requirements

### Login Endpoint
```typescript
POST /auth/login
Response: {
  accessToken: string,      // JWT (short-lived, e.g., 15 min)
  refreshToken?: string,    // Not needed in response if using cookie
  user: {
    id: string,
    username: string,
    email: string,
    roles: string[],
    avatar: string
  }
}

// Set refresh token as HttpOnly cookie:
Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800
```

### Refresh Token Endpoint
```typescript
POST /auth/refresh-token
// No body needed - uses HttpOnly cookie

Response: {
  accessToken: string,
  // refreshToken can be rotated here if needed
}

// Optionally rotate refresh token:
Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800
```

### Profile Endpoint
```typescript
GET /user/profile
Headers: Authorization: Bearer {accessToken}

Response: {
  id: string,
  username: string,
  email: string,
  roles: string[],
  avatar: string,
  bio?: string,
  // ... other user fields
}
```

### Logout Endpoint
```typescript
POST /auth/logout
Headers: Authorization: Bearer {accessToken}

// Clear refresh token cookie:
Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0
```

## Migration Checklist

- [x] Remove persist middleware from authStore
- [x] Update useAuthInit to fetch user profile
- [x] Fix axios interceptor 401 handling
- [x] Update auth-utils to use Zustand
- [x] Remove localStorage operations
- [x] Add setUser/setToken methods to store
- [ ] Test login flow
- [ ] Test token refresh
- [ ] Test logout
- [ ] Verify HttpOnly cookies are set correctly
- [ ] Test XSS protection (token not in localStorage)

## Testing

### Manual Testing
1. Login and check DevTools:
   - Application → Cookies: should see `refreshToken`
   - Application → Local Storage: should NOT see token/user
   - Network → Headers: should see `Authorization: Bearer ...`

2. Wait for token expiration (or manually expire):
   - App should automatically refresh
   - No user interaction needed

3. Logout:
   - Cookies cleared
   - Memory cleared
   - Redirected to login

### Automated Testing
```typescript
// Test token in memory, not localStorage
test('token stored in memory only', () => {
  const { token } = useAuthStore.getState();
  expect(token).toBe('...');
  expect(localStorage.getItem('token')).toBeNull();
});

// Test refresh token in cookie
test('refresh token in HttpOnly cookie', async () => {
  await login(credentials);
  const cookies = document.cookie;
  expect(cookies).toContain('refreshToken');
});
```

## Troubleshooting

### Token not being sent
- Check axios interceptor is attached
- Verify token exists in Zustand store
- Check Authorization header in Network tab

### 401 loop
- Verify refresh token endpoint works
- Check refresh token cookie is being sent
- Verify server returns new accessToken

### User not loading after refresh
- Check /user/profile endpoint
- Verify token is valid for profile endpoint
- Check response format matches User type

### Cookies not persisting
- Verify `withCredentials: true` in axios
- Check cookie flags: HttpOnly, Secure, SameSite
- Verify domain/path settings
