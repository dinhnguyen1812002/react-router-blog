# OAuth Implementation Guide

## 🔐 OAuth Login Flow Implementation

Đây là implementation hoàn chỉnh cho OAuth login với Google, GitHub và Discord sử dụng popup window pattern.

## 📋 **Flow Overview**

```
Frontend (SPA)
├─ window.open(Google/GitHub/Discord)
├─ nhận access_token / authorization_code
├─ window.postMessage(token/code)
└─ POST /api/v1/auth/oauth/login { provider, code/token }
```

## 🏗️ **Architecture Components**

### 1. **useOAuthLogin Hook** (`app/hooks/useOAuthLogin.ts`)
- Quản lý OAuth flow logic
- Build OAuth URLs cho từng provider
- Xử lý popup window communication
- Gọi API backend để authenticate

### 2. **OAuthButtons Component** (`app/components/auth/OAuthButtons.tsx`)
- UI components cho OAuth login buttons
- Support Google, GitHub, Discord
- Loading states và error handling
- Responsive design với icons

### 3. **OAuth Callback Route** (`app/routes/auth.callback.$provider.tsx`)
- Xử lý OAuth callback từ providers
- Extract authorization code hoặc access token
- Send message về parent window
- Auto-close popup window

### 4. **Auth API Extension** (`app/api/auth.ts`)
- `oauthLogin()` method để gửi code/token lên backend
- Xử lý response và update auth store
- Error handling và retry logic

## 🔧 **Setup Instructions**

### 1. **Environment Variables**
```bash
# Copy và config
cp .env.example .env

# Thêm OAuth credentials
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id  
VITE_DISCORD_CLIENT_ID=your_discord_client_id
```

### 2. **OAuth Provider Setup**

#### **Google OAuth**
1. Tạo project tại [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Tạo OAuth 2.0 credentials
4. Thêm redirect URI: `http://localhost:5173/auth/callback/google`

#### **GitHub OAuth**
1. Vào GitHub Settings > Developer settings > OAuth Apps
2. Tạo New OAuth App
3. Authorization callback URL: `http://localhost:5173/auth/callback/github`

#### **Discord OAuth**
1. Tạo application tại [Discord Developer Portal](https://discord.com/developers/applications)
2. Vào OAuth2 settings
3. Thêm redirect: `http://localhost:5173/auth/callback/discord`

### 3. **Backend API Endpoint**
Backend cần implement endpoint:
```
POST /api/v1/auth/oauth/login
{
  "provider": "google|github|discord",
  "code": "authorization_code_from_oauth",
  "token": "access_token_if_available"  
}

Response:
{
  "success": true,
  "user": { ... },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token" // optional
}
```

## 🎯 **Usage Examples**

### **Basic Usage**
```tsx
import { OAuthButtons } from '~/components/auth/OAuthButtons';

function LoginPage() {
  const handleSuccess = (user) => {
    console.log('Login successful:', user);
    // Redirect or update UI
  };

  const handleError = (error) => {
    console.error('Login failed:', error);
    // Show error message
  };

  return (
    <OAuthButtons 
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

### **Custom Hook Usage**
```tsx
import { useOAuthLogin } from '~/hooks/useOAuthLogin';

function CustomLoginButton() {
  const { loginWithOAuth, isLoading, error } = useOAuthLogin();

  const handleGoogleLogin = async () => {
    const result = await loginWithOAuth('google');
    if (result.success) {
      // Handle success
    }
  };

  return (
    <button onClick={handleGoogleLogin} disabled={isLoading}>
      {isLoading ? 'Logging in...' : 'Login with Google'}
    </button>
  );
}
```

## 🔒 **Security Features**

### **Origin Verification**
```typescript
// Popup message listener chỉ accept messages từ same origin
if (event.origin !== window.location.origin) {
  return;
}
```

### **Timeout Protection**
```typescript
// Auto-timeout sau 5 phút
setTimeout(() => {
  cleanup();
  reject(new Error('Authentication timeout'));
}, 5 * 60 * 1000);
```

### **Popup Blocking Detection**
```typescript
if (!popup) {
  reject(new Error('Popup blocked. Please allow popups for this site.'));
  return;
}
```

## 🧪 **Testing**

### **Test OAuth Flow**
1. Truy cập `/test-oauth` để test
2. Click vào provider buttons
3. Kiểm tra console logs
4. Verify user data trong response

### **Debug Mode**
```typescript
// Enable debug logs
console.log(`🔐 Starting OAuth login with ${provider}`);
console.log(`🌐 OAuth URL: ${oauthUrl}`);
console.log(`✅ Received token/code from ${provider}`);
```

## 🚨 **Common Issues & Solutions**

### **Popup Blocked**
- Ensure user action triggers popup
- Add popup blocker detection
- Provide fallback redirect method

### **CORS Issues**
- Configure backend CORS for OAuth callbacks
- Ensure redirect URIs match exactly

### **Token Validation**
- Verify tokens on backend
- Handle expired tokens gracefully
- Implement token refresh logic

## 📱 **Mobile Considerations**

### **Popup Alternatives**
```typescript
// Detect mobile và use redirect instead of popup
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  window.location.href = oauthUrl;
} else {
  openOAuthPopup(oauthUrl);
}
```

## 🔄 **Integration với Existing Auth**

### **Auth Store Integration**
```typescript
// OAuth success tự động update auth store
if (user && finalToken) {
  useAuthStore.getState().login(user, finalToken);
}
```

### **Route Protection**
```typescript
// Protected routes vẫn hoạt động như bình thường
const { isAuthenticated } = useAuthStore();
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

## 📊 **Performance Optimizations**

- **Lazy loading**: OAuth components chỉ load khi cần
- **Code splitting**: Separate OAuth logic vào chunks riêng
- **Caching**: Cache OAuth URLs và configurations
- **Preconnect**: DNS prefetch cho OAuth providers

## 🎨 **UI/UX Best Practices**

- **Loading states**: Show spinner khi đang authenticate
- **Error handling**: Clear error messages cho users
- **Accessibility**: Proper ARIA labels và keyboard navigation
- **Responsive**: Mobile-friendly OAuth buttons
- **Branding**: Consistent với provider brand guidelines

OAuth implementation này cung cấp một solution robust, secure và user-friendly cho authentication với multiple providers!