# Fixing 401 Error on Refresh Token Endpoint

## Problem
Getting `401 Unauthorized` when calling `/auth/refresh-token` endpoint.

## Root Causes & Solutions

### 1. Refresh Token Cookie Not Being Sent

**Check:**
```javascript
// In browser console
console.log(document.cookie);
// Should show: refreshToken=...
```

**If cookie is missing:**

**Solution A: Backend - Set Cookie Correctly**
```typescript
// Express.js example
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',  // true in production
  sameSite: 'strict',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});
```

**Solution B: Frontend - Verify withCredentials**
```typescript
// app/config/axios.ts - Already set, but verify:
const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,  // MUST be true
});
```

**Solution C: Backend - CORS Configuration**
```typescript
// Express.js
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend URL
  credentials: true,  // IMPORTANT: Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. Refresh Token Expired or Invalid

**Check:**
```javascript
// In browser DevTools → Application → Cookies
// Look for refreshToken cookie
// Check if it has an expiration date in the future
```

**Solution:**
- Login again to get a fresh refresh token
- Check backend token generation (should have long expiration, e.g., 7 days)

### 3. Backend Not Receiving Cookie

**Debug on Backend:**
```typescript
app.post('/auth/refresh-token', (req, res) => {
  console.log('Cookies received:', req.cookies);
  console.log('Cookie header:', req.headers.cookie);
  
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token cookie' });
  }
  // ... rest of logic
});
```

**Solution:**
- Ensure cookie-parser middleware is loaded BEFORE routes:
```typescript
const cookieParser = require('cookie-parser');
app.use(cookieParser());  // Must be before routes
app.use('/api', routes);
```

### 4. Domain/Path Mismatch

**Problem:** Cookie set for different domain/path than request

**Solution:**
```typescript
// Backend - Set cookie with correct domain/path
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',  // Root path
  domain: 'example.com',  // Match your domain
  maxAge: 7 * 24 * 60 * 60 * 1000
});
```

### 5. Secure Flag Issue (HTTPS)

**Problem:** Cookie has `Secure` flag but request is HTTP

**Solution:**
```typescript
// Only set Secure flag in production
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',  // true only in prod
  sameSite: 'strict',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000
});
```

## Debugging Steps

### Step 1: Check Cookie is Set
```javascript
// After login, check DevTools
// Application → Cookies → Your domain
// Should see: refreshToken with HttpOnly flag
```

### Step 2: Check Cookie is Sent
```javascript
// DevTools → Network → Click refresh-token request
// Headers → Cookie
// Should show: refreshToken=...
```

### Step 3: Check Backend Receives Cookie
```typescript
// Add logging to backend refresh endpoint
app.post('/auth/refresh-token', (req, res) => {
  console.log('Received cookies:', req.cookies);
  console.log('Refresh token:', req.cookies.refreshToken);
  // ...
});
```

### Step 4: Check Token Validation
```typescript
// Verify refresh token is valid
try {
  const decoded = jwt.verify(
    req.cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  console.log('Token valid, decoded:', decoded);
} catch (error) {
  console.log('Token invalid:', error.message);
}
```

## Complete Working Example

### Backend (Express.js)

```typescript
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

// Middleware - ORDER MATTERS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());  // Must be after cors, before routes

// Login endpoint
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate credentials...
  
  const accessToken = jwt.sign(
    { id: 'user-id', email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: 'user-id', type: 'refresh' },
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
  
  res.json({
    accessToken,
    user: { id: 'user-id', email }
  });
});

// Refresh token endpoint
app.post('/api/v1/auth/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  console.log('Refresh request - cookies:', req.cookies);
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }
  
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

app.listen(8080);
```

### Frontend (Already Configured)

```typescript
// app/config/axios.ts - Already has:
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true,  // ✅ Sends cookies
});

// app/api/auth.ts - Already has:
refreshToken: async () => {
  const response = await axiosInstance.post(
    "/auth/refresh-token",
    {},
    { withCredentials: true }  // ✅ Redundant but safe
  );
  return response.data;
}
```

## Verification Checklist

- [ ] Backend sets `Set-Cookie` header with `HttpOnly` flag
- [ ] Cookie has correct domain/path
- [ ] Cookie has future expiration date
- [ ] Frontend has `withCredentials: true`
- [ ] CORS allows `credentials: true`
- [ ] Cookie parser middleware loaded before routes
- [ ] Refresh token endpoint receives cookie
- [ ] Refresh token is valid (not expired)
- [ ] Backend returns new accessToken
- [ ] Frontend receives and stores new token

## Common Mistakes

❌ **Wrong:** Setting cookie without HttpOnly
```typescript
res.cookie('refreshToken', token);  // Missing flags
```

✅ **Right:**
```typescript
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
```

---

❌ **Wrong:** CORS without credentials
```typescript
app.use(cors());  // credentials: false by default
```

✅ **Right:**
```typescript
app.use(cors({ credentials: true }));
```

---

❌ **Wrong:** Cookie parser after routes
```typescript
app.use('/api', routes);
app.use(cookieParser());  // Too late!
```

✅ **Right:**
```typescript
app.use(cookieParser());
app.use('/api', routes);
```

## Still Having Issues?

1. Check browser console for error messages
2. Check Network tab for request/response details
3. Check backend logs for cookie presence
4. Verify environment variables are set
5. Try in incognito mode (no cache issues)
6. Clear cookies and login again
