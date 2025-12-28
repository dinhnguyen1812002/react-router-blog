# Backend Authentication Setup Guide

## Overview

This guide explains how to set up the backend to work with the new memory-based token storage system.

## Key Principles

1. **Access Token**: Short-lived JWT (15-30 minutes)
2. **Refresh Token**: Long-lived token in HttpOnly cookie (7-30 days)
3. **Token Rotation**: Optional but recommended - rotate refresh token on each refresh
4. **CORS**: Must allow credentials

## Implementation Examples

### 1. Login Endpoint

```typescript
// Express.js example
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate credentials
  const user = await User.findOne({ email });
  if (!user || !await user.comparePassword(password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Generate tokens
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }  // Short-lived
  );
  
  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }  // Long-lived
  );
  
  // Set refresh token as HttpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
  });
  
  // Return access token in response body
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
```

### 2. Refresh Token Endpoint

```typescript
app.post('/auth/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    // Optional: Rotate refresh token
    const newRefreshToken = jwt.sign(
      { id: decoded.id, type: 'refresh' },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({ accessToken: newAccessToken });
    
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});
```

### 3. Profile Endpoint

```typescript
// Middleware to verify access token
const verifyAccessToken = (req, res, next) => {
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
};

app.get('/user/profile', verifyAccessToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles,
    avatar: user.avatar,
    bio: user.bio
  });
});
```

### 4. Logout Endpoint

```typescript
app.post('/auth/logout', verifyAccessToken, (req, res) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  
  // Optional: Invalidate token on server (blacklist)
  // await TokenBlacklist.create({ token: req.headers.authorization });
  
  res.json({ message: 'Logged out' });
});
```

### 5. CORS Configuration

```typescript
// Express.js with cors package
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL,  // e.g., http://localhost:5173
  credentials: true,  // IMPORTANT: Allow credentials (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 6. Cookie Parser Middleware

```typescript
const cookieParser = require('cookie-parser');

app.use(cookieParser());
// Now req.cookies.refreshToken is available
```

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-secret-key-for-access-tokens
REFRESH_TOKEN_SECRET=your-secret-key-for-refresh-tokens

# CORS
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

## Security Checklist

- [ ] Access token has short expiration (15-30 minutes)
- [ ] Refresh token has long expiration (7-30 days)
- [ ] Refresh token stored in HttpOnly cookie
- [ ] Refresh token has Secure flag (HTTPS only in production)
- [ ] Refresh token has SameSite=Strict
- [ ] CORS allows credentials
- [ ] Access token verified on protected endpoints
- [ ] Refresh token verified on refresh endpoint
- [ ] Logout clears refresh token cookie
- [ ] Token rotation implemented (optional but recommended)

## Token Rotation (Recommended)

Token rotation means issuing a new refresh token on each refresh:

**Benefits:**
- Limits damage if refresh token is compromised
- Invalidates old refresh tokens
- Requires tracking issued tokens

**Implementation:**
1. On refresh, generate new refresh token
2. Store old refresh token in blacklist/database
3. Reject requests with blacklisted tokens
4. Client automatically gets new token in cookie

## Troubleshooting

### Cookies not being set
- Check CORS `credentials: true`
- Verify cookie flags (HttpOnly, Secure, SameSite)
- Check domain/path settings
- Verify frontend sends `withCredentials: true`

### 401 on refresh endpoint
- Verify refresh token cookie is being sent
- Check cookie parser middleware is loaded
- Verify refresh token secret matches
- Check token hasn't expired

### CORS errors
- Verify origin matches FRONTEND_URL
- Check credentials: true in CORS config
- Verify allowedHeaders includes Authorization

### Token not being verified
- Check JWT_SECRET matches between login and verify
- Verify token format: `Bearer {token}`
- Check token hasn't expired
- Verify middleware order (cookie parser before routes)

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt

# Refresh token (cookies automatically sent)
curl -X POST http://localhost:3000/auth/refresh-token \
  -b cookies.txt

# Get profile
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer {accessToken}" \
  -b cookies.txt

# Logout
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer {accessToken}" \
  -b cookies.txt
```

## Testing with Postman

1. **Login Request**
   - Method: POST
   - URL: `http://localhost:3000/auth/login`
   - Body: `{"email":"user@example.com","password":"password"}`
   - Check "Cookies" tab to see refreshToken

2. **Refresh Request**
   - Method: POST
   - URL: `http://localhost:3000/auth/refresh-token`
   - Postman automatically sends cookies

3. **Profile Request**
   - Method: GET
   - URL: `http://localhost:3000/user/profile`
   - Headers: `Authorization: Bearer {accessToken}`
   - Postman automatically sends cookies
