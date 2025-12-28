# Testing Refresh Token Flow

## Browser Console Testing

### 1. Check Cookies After Login

```javascript
// After login, run in console:
console.log('Cookies:', document.cookie);
console.log('All cookies:', document.cookie.split(';'));

// Should output something like:
// Cookies: refreshToken=eyJhbGc...; other=value
// All cookies: ["refreshToken=eyJhbGc...", " other=value"]
```

### 2. Check Zustand Store

```javascript
// Check if token is in memory
import { useAuthStore } from '~/store/authStore';
const state = useAuthStore.getState();
console.log('Auth state:', {
  user: state.user,
  token: state.token ? state.token.substring(0, 20) + '...' : null,
  isAuthenticated: state.isAuthenticated
});

// Should show:
// Auth state: {
//   user: { id: '...', username: '...', ... },
//   token: "eyJhbGc...",
//   isAuthenticated: true
// }
```

### 3. Check localStorage is Empty

```javascript
// Verify token is NOT in localStorage
console.log('localStorage keys:', Object.keys(localStorage));
console.log('localStorage token:', localStorage.getItem('token'));
console.log('localStorage user:', localStorage.getItem('user'));

// Should output:
// localStorage keys: [... but NOT 'token' or 'user' ...]
// localStorage token: null
// localStorage user: null
```

### 4. Manually Test Refresh

```javascript
// Import auth API
import { authApi } from '~/api/auth';

// Call refresh endpoint
authApi.refreshToken()
  .then(result => {
    console.log('✅ Refresh successful:', result);
    console.log('New token:', result.accessToken.substring(0, 20) + '...');
  })
  .catch(error => {
    console.error('❌ Refresh failed:', error);
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
  });
```

## Network Tab Testing

### 1. Check Login Request

1. Open DevTools → Network tab
2. Login
3. Find `/auth/login` request
4. Check Response Headers:
   ```
   Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict
   ```

### 2. Check Refresh Request

1. Open DevTools → Network tab
2. Run: `authApi.refreshToken()` in console
3. Find `/auth/refresh-token` request
4. Check Request Headers:
   ```
   Cookie: refreshToken=...
   Authorization: Bearer {accessToken}
   ```
5. Check Response:
   ```json
   {
     "accessToken": "eyJhbGc..."
   }
   ```

### 3. Check API Requests Include Token

1. Open DevTools → Network tab
2. Make any API request (e.g., fetch posts)
3. Check Request Headers:
   ```
   Authorization: Bearer {accessToken}
   Cookie: refreshToken=...
   ```

## cURL Testing (Backend Verification)

### 1. Login and Save Cookies

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt \
  -v

# -c cookies.txt saves cookies to file
# -v shows verbose output including headers
```

### 2. Check Saved Cookies

```bash
cat cookies.txt

# Should show:
# # Netscape HTTP Cookie File
# localhost	TRUE	/	TRUE	1735689600	refreshToken	eyJhbGc...
```

### 3. Refresh Token Using Saved Cookies

```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh-token \
  -b cookies.txt \
  -v

# -b cookies.txt sends cookies from file
# Should return: {"accessToken":"eyJhbGc..."}
```

### 4. Get Profile with Token

```bash
# First, get the accessToken from login response
TOKEN="eyJhbGc..."

curl -X GET http://localhost:8080/api/v1/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -b cookies.txt \
  -v
```

## Postman Testing

### 1. Create Login Request

- **Method:** POST
- **URL:** `http://localhost:8080/api/v1/auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```
- **Send**
- **Check:** Cookies tab should show `refreshToken`

### 2. Create Refresh Request

- **Method:** POST
- **URL:** `http://localhost:8080/api/v1/auth/refresh-token`
- **Body:** Empty
- **Send**
- **Check:** Response should have `accessToken`

### 3. Create Profile Request

- **Method:** GET
- **URL:** `http://localhost:8080/api/v1/user/profile`
- **Headers:** `Authorization: Bearer {accessToken}`
- **Send**
- **Check:** Should return user profile

## Automated Test Script

Create `test-auth.js`:

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:8080/api/v1';
const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  validateStatus: () => true  // Don't throw on any status
});

async function testAuthFlow() {
  console.log('🧪 Testing Auth Flow...\n');

  // 1. Login
  console.log('1️⃣ Testing Login...');
  const loginRes = await client.post('/auth/login', {
    email: 'user@example.com',
    password: 'password'
  });
  
  if (loginRes.status !== 200) {
    console.error('❌ Login failed:', loginRes.status, loginRes.data);
    return;
  }
  
  const { accessToken, user } = loginRes.data;
  console.log('✅ Login successful');
  console.log('   User:', user.username);
  console.log('   Token:', accessToken.substring(0, 20) + '...');

  // 2. Refresh Token
  console.log('\n2️⃣ Testing Refresh Token...');
  const refreshRes = await client.post('/auth/refresh-token');
  
  if (refreshRes.status !== 200) {
    console.error('❌ Refresh failed:', refreshRes.status, refreshRes.data);
    return;
  }
  
  const newAccessToken = refreshRes.data.accessToken;
  console.log('✅ Refresh successful');
  console.log('   New Token:', newAccessToken.substring(0, 20) + '...');

  // 3. Get Profile
  console.log('\n3️⃣ Testing Get Profile...');
  const profileRes = await client.get('/user/profile', {
    headers: { Authorization: `Bearer ${newAccessToken}` }
  });
  
  if (profileRes.status !== 200) {
    console.error('❌ Get profile failed:', profileRes.status, profileRes.data);
    return;
  }
  
  console.log('✅ Get profile successful');
  console.log('   Profile:', profileRes.data);

  // 4. Logout
  console.log('\n4️⃣ Testing Logout...');
  const logoutRes = await client.post('/auth/logout', {}, {
    headers: { Authorization: `Bearer ${newAccessToken}` }
  });
  
  if (logoutRes.status !== 200) {
    console.error('❌ Logout failed:', logoutRes.status, logoutRes.data);
    return;
  }
  
  console.log('✅ Logout successful');

  // 5. Try to use old token (should fail)
  console.log('\n5️⃣ Testing Old Token (should fail)...');
  const oldTokenRes = await client.get('/user/profile', {
    headers: { Authorization: `Bearer ${newAccessToken}` }
  });
  
  if (oldTokenRes.status === 401) {
    console.log('✅ Old token correctly rejected');
  } else {
    console.warn('⚠️ Old token still works (might be expected)');
  }

  console.log('\n✅ All tests passed!');
}

testAuthFlow().catch(console.error);
```

Run with:
```bash
node test-auth.js
```

## Expected Results

### ✅ Success Scenario

```
🧪 Testing Auth Flow...

1️⃣ Testing Login...
✅ Login successful
   User: john_doe
   Token: eyJhbGciOiJIUzI1NiIs...

2️⃣ Testing Refresh Token...
✅ Refresh successful
   New Token: eyJhbGciOiJIUzI1NiIs...

3️⃣ Testing Get Profile...
✅ Get profile successful
   Profile: { id: '123', username: 'john_doe', email: 'john@example.com' }

4️⃣ Testing Logout...
✅ Logout successful

5️⃣ Testing Old Token (should fail)...
✅ Old token correctly rejected

✅ All tests passed!
```

### ❌ Common Failures

**Refresh fails with 401:**
```
2️⃣ Testing Refresh Token...
❌ Refresh failed: 401 { message: 'No refresh token' }
```
→ Check: Cookie not being sent, CORS not allowing credentials

**Get profile fails with 401:**
```
3️⃣ Testing Get Profile...
❌ Get profile failed: 401 { message: 'Invalid token' }
```
→ Check: Token expired, token secret mismatch

**Logout fails:**
```
4️⃣ Testing Logout...
❌ Logout failed: 401 { message: 'No token' }
```
→ Check: Authorization header not being sent

## Debugging Tips

### Enable Debug Logging

In `app/config/env.ts`:
```typescript
export const env = {
  ENABLE_DEBUG: true,  // Set to true
  // ...
};
```

Then in axios interceptor, debug logs will show:
```
📤 Refresh token request: {
  url: "/auth/refresh-token",
  withCredentials: true,
  hasToken: false,
  cookies: "refreshToken=..."
}
```

### Check Backend Logs

Add logging to backend refresh endpoint:
```typescript
app.post('/auth/refresh-token', (req, res) => {
  console.log('📨 Refresh request received');
  console.log('   Cookies:', req.cookies);
  console.log('   Headers:', req.headers);
  // ...
});
```

### Monitor Network Activity

1. Open DevTools → Network tab
2. Filter by XHR/Fetch
3. Look for `/auth/refresh-token` requests
4. Check Request/Response headers and body
