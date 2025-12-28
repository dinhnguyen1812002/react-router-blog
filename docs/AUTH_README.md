# Authentication System - Memory-Based Token Storage

## Overview

This authentication system uses industry best practices:
- **Access Token**: Stored in memory (Zustand state) - NOT in localStorage
- **Refresh Token**: Stored in HttpOnly Secure Cookie - JavaScript cannot access
- **User Info**: Fetched from `/user/profile` endpoint, stored in memory

## Why This Approach?

### Security Benefits

| Threat | Old Way | New Way |
|--------|---------|---------|
| XSS Attack | Token stolen from localStorage | Token safe in memory |
| CSRF Attack | Weak protection | Strong (HttpOnly cookie) |
| Token Exposure | Visible in DevTools | Not visible to JavaScript |
| Refresh Token | Vulnerable to XSS | Protected by HttpOnly flag |

### How It Works

```
1. User logs in
   ↓
2. Server returns: { accessToken, refreshToken }
   - accessToken → stored in memory (Zustand)
   - refreshToken → set as HttpOnly cookie
   ↓
3. Client makes API request
   - Axios adds: Authorization: Bearer {accessToken}
   - Browser auto-sends: Cookie: refreshToken=...
   ↓
4. If token expires (401 response)
   - Axios interceptor calls /auth/refresh-token
   - Server validates refresh token cookie
   - Server returns new accessToken
   - Zustand store updated with new token
   - Original request retried
```

## Frontend Implementation

### Already Configured ✅

The frontend is already set up correctly:

- **Zustand Store** (`app/store/authStore.ts`)
  - Memory-only state
  - No localStorage persistence
  - Token refresh logic

- **Axios Interceptor** (`app/config/axios.ts`)
  - Automatically attaches access token
  - Handles 401 responses
  - Manages token refresh queue

- **Auth Hooks** (`app/hooks/useAuth.ts`, `app/hooks/useAuthInit.ts`)
  - Login/register/logout
  - Token refresh on app startup
  - User profile fetching

### Using Auth in Components

```typescript
import { useAuth } from '~/hooks/useAuth';

export function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Checking Auth State

```typescript
import { useAuthStore } from '~/store/authStore';

// In component
const { user, token, isAuthenticated } = useAuthStore();

// In console
import { useAuthStore } from '~/store/authStore';
useAuthStore.getState();
```

## Backend Implementation

### Required Endpoints

#### 1. Login
```
POST /auth/login
Body: { email, password }
Response: { accessToken, user }
Cookie: refreshToken (HttpOnly)
```

#### 2. Refresh Token
```
POST /auth/refresh-token
Body: (empty)
Response: { accessToken }
Cookie: refreshToken (HttpOnly, optional rotation)
```

#### 3. Get Profile
```
GET /user/profile
Headers: Authorization: Bearer {accessToken}
Response: { id, username, email, roles, avatar, ... }
```

#### 4. Logout
```
POST /auth/logout
Headers: Authorization: Bearer {accessToken}
Cookie: refreshToken (cleared)
```

### Backend Setup (Express.js)

```typescript
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const app = express();

// Middleware - ORDER MATTERS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,  // ← CRITICAL
}));
app.use(express.json());
app.use(cookieParser());  // ← Must be before routes

// Login endpoint
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate credentials...
  const user = await User.findOne({ email });
  if (!user || !await user.comparePassword(password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Generate tokens
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  
  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  
  // Return access token in response
  res.json({
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      avatar: user.avatar
    }
  });
});

// Refresh token endpoint
app.post('/api/v1/auth/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Get profile endpoint
app.get('/api/v1/user/profile', verifyAccessToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles,
    avatar: user.avatar
  });
});

// Logout endpoint
app.post('/api/v1/auth/logout', verifyAccessToken, (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  res.json({ message: 'Logged out' });
});

// Middleware to verify access token
function verifyAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

app.listen(8080);
```

## Testing

### Browser Console

```javascript
// Check token is in memory, not localStorage
import { useAuthStore } from '~/store/authStore';
const state = useAuthStore.getState();
console.log('Token:', state.token);
console.log('User:', state.user);
console.log('localStorage token:', localStorage.getItem('token'));  // Should be null

// Check cookie exists
console.log('Cookies:', document.cookie);  // Should show refreshToken

// Test refresh manually
import { authApi } from '~/api/auth';
authApi.refreshToken()
  .then(r => console.log('✅ Refresh successful:', r))
  .catch(e => console.error('❌ Refresh failed:', e.response?.status));
```

### DevTools Network Tab

1. **Login request** → Response Headers should have:
   ```
   Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict
   ```

2. **Any API request** → Request Headers should have:
   ```
   Authorization: Bearer {accessToken}
   Cookie: refreshToken=...
   ```

3. **Refresh request** → Response should have:
   ```json
   { "accessToken": "eyJhbGc..." }
   ```

### Automated Testing

See `docs/TEST_REFRESH_TOKEN.md` for complete testing guide.

## Troubleshooting

### 401 on Refresh Token Endpoint

**Most Common Causes:**
1. CORS not allowing credentials
2. Cookie parser middleware not loaded
3. Refresh token cookie not being set
4. Refresh token expired

**Quick Fix:**
```typescript
// Backend
app.use(cors({ credentials: true }));  // ← Add this
app.use(cookieParser());  // ← Add this before routes
```

See `docs/QUICK_FIX_401.md` for detailed troubleshooting.

### Token Not Being Sent

1. Check `withCredentials: true` in axios (already set ✅)
2. Verify token exists in Zustand store
3. Check Authorization header in Network tab

### User Not Loading

1. Check `/user/profile` endpoint returns correct format
2. Verify token is valid for profile endpoint
3. Check response matches User type

## Documentation

| Document | Purpose |
|----------|---------|
| `AUTHENTICATION_REFACTOR.md` | Detailed explanation of changes |
| `BACKEND_AUTH_SETUP.md` | Complete backend implementation guide |
| `AUTH_MIGRATION_SUMMARY.md` | Summary of what changed |
| `QUICK_FIX_401.md` | Quick reference for common issues |
| `TEST_REFRESH_TOKEN.md` | Testing and debugging guide |
| `REFRESH_TOKEN_401_FIX.md` | Detailed 401 troubleshooting |
| `IMPLEMENTATION_CHECKLIST.md` | Implementation checklist |

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WS_URL=http://localhost:8080/ws
```

### Backend (.env)
```
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Security Checklist

- [ ] Access token has short expiration (15-30 minutes)
- [ ] Refresh token has long expiration (7-30 days)
- [ ] Refresh token stored in HttpOnly cookie
- [ ] Refresh token has Secure flag (HTTPS only in production)
- [ ] Refresh token has SameSite=Strict
- [ ] CORS allows credentials
- [ ] Access token verified on all protected endpoints
- [ ] Refresh token verified on refresh endpoint
- [ ] Logout clears refresh token cookie
- [ ] No sensitive data in JWT payload
- [ ] JWT secrets are strong and unique

## Next Steps

1. **Implement Backend** - Follow `docs/BACKEND_AUTH_SETUP.md`
2. **Test Auth Flow** - Use `docs/TEST_REFRESH_TOKEN.md`
3. **Deploy** - Follow deployment checklist in `docs/IMPLEMENTATION_CHECKLIST.md`

## Support

For issues or questions:
1. Check relevant documentation file
2. Run test script from `docs/TEST_REFRESH_TOKEN.md`
3. Check browser DevTools Network tab
4. Check backend logs
5. Verify environment variables are set

---

**Frontend Status:** ✅ Complete and ready to use
**Backend Status:** ⏳ Needs implementation
**Documentation:** ✅ Complete
