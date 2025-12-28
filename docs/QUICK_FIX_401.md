# Quick Fix: 401 on Refresh Token Endpoint

## The Problem
```
Refresh token request failed: Object { 
  message: "Request failed with status code 401",
  status: 401
}
```

## Most Likely Causes (in order)

### 1. ⚠️ Backend CORS Not Allowing Credentials (Most Common)

**Backend Fix (Express.js):**
```typescript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend URL
  credentials: true,  // ← THIS IS CRITICAL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Verify:** DevTools → Network → refresh-token request → Response Headers
```
Access-Control-Allow-Credentials: true
```

---

### 2. ⚠️ Cookie Parser Middleware Not Loaded

**Backend Fix (Express.js):**
```typescript
const cookieParser = require('cookie-parser');

// ORDER MATTERS - must be before routes
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(cookieParser());  // ← Add this
app.use('/api', routes);  // Routes after middleware
```

**Verify:** Backend logs should show:
```
console.log('Cookies:', req.cookies);  // Should have refreshToken
```

---

### 3. ⚠️ Refresh Token Cookie Not Being Set on Login

**Backend Fix (Express.js):**
```typescript
app.post('/auth/login', async (req, res) => {
  // ... validate credentials ...
  
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  
  // Set cookie with correct flags
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  
  res.json({
    accessToken: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' }),
    user: { id: user.id, username: user.username, email: user.email }
  });
});
```

**Verify:** After login, DevTools → Application → Cookies
```
Should see: refreshToken (with HttpOnly flag)
```

---

### 4. ⚠️ Refresh Token Endpoint Not Receiving Cookie

**Backend Fix (Express.js):**
```typescript
app.post('/auth/refresh-token', (req, res) => {
  // Debug: Check if cookie is received
  console.log('Cookies received:', req.cookies);
  
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token cookie' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});
```

---

## Quick Diagnostic

### In Browser Console:

```javascript
// 1. Check if cookie exists
console.log('Cookies:', document.cookie);
// Should show: refreshToken=...

// 2. Check if token is in memory (not localStorage)
import { useAuthStore } from '~/store/authStore';
console.log('Token in memory:', useAuthStore.getState().token);
// Should show: eyJhbGc...

// 3. Check localStorage is empty
console.log('Token in localStorage:', localStorage.getItem('token'));
// Should show: null

// 4. Try refresh manually
import { authApi } from '~/api/auth';
authApi.refreshToken()
  .then(r => console.log('✅ Success:', r))
  .catch(e => console.error('❌ Error:', e.response?.status, e.response?.data));
```

### In DevTools Network Tab:

1. **Login request** → Response Headers should have:
   ```
   Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict
   ```

2. **Refresh request** → Request Headers should have:
   ```
   Cookie: refreshToken=...
   ```

3. **Refresh response** should be:
   ```json
   { "accessToken": "eyJhbGc..." }
   ```

---

## Step-by-Step Fix

### Step 1: Update Backend CORS
```typescript
// app.js or main server file
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,  // ← Add this
}));
```

### Step 2: Add Cookie Parser
```typescript
const cookieParser = require('cookie-parser');
app.use(cookieParser());  // Add this line
```

### Step 3: Verify Login Sets Cookie
```typescript
// In login endpoint
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000
});
```

### Step 4: Verify Refresh Endpoint
```typescript
// In refresh endpoint
const refreshToken = req.cookies.refreshToken;
if (!refreshToken) {
  return res.status(401).json({ message: 'No refresh token' });
}
// ... verify and return new token
```

### Step 5: Test
```bash
# Clear cookies and login again
# Then check DevTools → Cookies for refreshToken
# Then try to refresh in console:
# authApi.refreshToken().then(r => console.log(r))
```

---

## Frontend is Already Correct ✅

The frontend code is already set up correctly:

```typescript
// ✅ app/config/axios.ts
const axiosInstance = axios.create({
  withCredentials: true,  // Sends cookies
});

// ✅ app/api/auth.ts
refreshToken: async () => {
  const response = await axiosInstance.post(
    "/auth/refresh-token",
    {},
    { withCredentials: true }
  );
  return response.data;
}

// ✅ app/store/authStore.ts
// Token stored in memory only, not localStorage
```

**No frontend changes needed** - just fix the backend!

---

## Environment Variables

Make sure these are set:

```env
# Backend
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
NODE_ENV=development

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## Still Not Working?

1. **Check backend logs** - Add `console.log()` to see if cookie is received
2. **Check browser DevTools** - Network tab to see request/response headers
3. **Check CORS headers** - Response should have `Access-Control-Allow-Credentials: true`
4. **Check cookie flags** - Should have `HttpOnly`, `Secure` (in prod), `SameSite=Strict`
5. **Try incognito mode** - Clear cache issues
6. **Restart backend** - Changes to middleware order need restart

---

## Reference Files

- Frontend: `app/config/axios.ts` - Already correct ✅
- Frontend: `app/api/auth.ts` - Already correct ✅
- Backend: See `docs/BACKEND_AUTH_SETUP.md` for complete example
- Testing: See `docs/TEST_REFRESH_TOKEN.md` for debugging
