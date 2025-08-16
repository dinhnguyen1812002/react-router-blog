/**
 * Utility functions for authentication management
 */

/**
 * Clear all authentication data from browser storage
 * This includes localStorage, sessionStorage, and cookies
 */
export function clearAllAuthData(): void {
  if (typeof window === 'undefined') return;

  console.log('🧹 Starting complete auth data cleanup...');

  // 1. Clear localStorage
  const localStorageAuthKeys = [
    'auth-storage',
    'token',
    'user',
    'refreshToken',
    'refresh-token',
    'access-token',
    'session',
    'userProfile',
    'authToken',
    'userSession',
    'loginData',
    'userData'
  ];

  localStorageAuthKeys.forEach(key => {
    localStorage.removeItem(key);
  });

  // Clear any keys that contain auth-related terms
  Object.keys(localStorage).forEach(key => {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('auth') || 
      lowerKey.includes('token') || 
      lowerKey.includes('user') || 
      lowerKey.includes('session') ||
      lowerKey.includes('login') ||
      lowerKey.includes('credential')
    ) {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed localStorage key: ${key}`);
    }
  });

  // 2. Clear sessionStorage
  const sessionStorageAuthKeys = [
    'auth-storage',
    'token',
    'user',
    'refreshToken',
    'refresh-token',
    'access-token',
    'session',
    'userProfile',
    'authToken',
    'userSession',
    'loginData',
    'userData'
  ];

  sessionStorageAuthKeys.forEach(key => {
    sessionStorage.removeItem(key);
  });

  Object.keys(sessionStorage).forEach(key => {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('auth') || 
      lowerKey.includes('token') || 
      lowerKey.includes('user') || 
      lowerKey.includes('session') ||
      lowerKey.includes('login') ||
      lowerKey.includes('credential')
    ) {
      sessionStorage.removeItem(key);
      console.log(`🗑️ Removed sessionStorage key: ${key}`);
    }
  });

  // 3. Clear cookies
  const authCookieNames = [
    'token',
    'refreshToken',
    'refresh-token',
    'access-token',
    'user',
    'auth',
    'session',
    'authToken',
    'userSession',
    'loginData',
    'userData',
    'jwt',
    'bearer',
    'authorization',
    'credential',
    'login'
  ];

  // Clear specific auth cookies with different domain/path combinations
  authCookieNames.forEach(cookieName => {
    // Clear for current path
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    // Clear for current domain
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    
    // Clear for parent domain (with dot prefix)
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    
    // Clear for root domain
    const rootDomain = window.location.hostname.split('.').slice(-2).join('.');
    if (rootDomain !== window.location.hostname) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${rootDomain};`;
    }
    
    console.log(`🍪 Cleared cookie: ${cookieName}`);
  });

  // Clear all cookies (nuclear option)
  document.cookie.split(";").forEach(function(c) { 
    const cookieName = c.replace(/^ +/, "").replace(/=.*/, "");
    if (cookieName) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    }
  });

  console.log('✅ Auth data cleanup completed');
}

/**
 * Check if user is authenticated by validating token
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem('token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('access-token');

  if (!token) return false;

  try {
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      console.log('🔒 Token expired, clearing auth data...');
      clearAllAuthData();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error validating token:', error);
    clearAllAuthData();
    return false;
  }
}

/**
 * Get current auth token from storage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem('token') || 
         localStorage.getItem('authToken') || 
         localStorage.getItem('access-token') ||
         null;
}

/**
 * Get current user from storage
 */
export function getCurrentUser(): any | null {
  if (typeof window === 'undefined') return null;

  try {
    const userStr = localStorage.getItem('user') || 
                   localStorage.getItem('userData') || 
                   localStorage.getItem('userProfile');
    
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('❌ Error parsing user data:', error);
    return null;
  }
}

/**
 * Handle authentication error (401/403)
 * Clear all auth data and redirect to login
 */
export function handleAuthError(error?: any): void {
  console.log('🔒 Authentication error detected, clearing session...');
  
  // Clear all auth data
  clearAllAuthData();
  
  // Log the error for debugging
  if (error) {
    console.error('Auth error details:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
  }
  
  // Redirect to login after cleanup
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      // Check if we're not already on login page to avoid infinite redirect
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
  }, 100);
}

/**
 * Safe logout function that can be called from anywhere
 */
export function performLogout(): void {
  console.log('👋 Performing logout...');
  
  // Clear all auth data
  clearAllAuthData();
  
  // Redirect to login
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, 100);
}
