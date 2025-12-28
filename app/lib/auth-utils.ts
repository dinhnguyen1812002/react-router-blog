/**
 * Utility functions for authentication management
 * Note: Access tokens are stored in memory (Zustand state) only
 * Refresh tokens are stored in HttpOnly Secure Cookies (handled by server)
 */

/**
 * Clear all authentication data
 * Since tokens are in memory, this is mainly for cleanup
 */
export function clearAllAuthData(): void {
  if (typeof window === 'undefined') return;

  console.log('Clearing auth data from memory');
  // Auth data is stored in Zustand state (memory), so it's automatically cleared on logout
  // No need to clear localStorage or sessionStorage
}

/**
 * Check if user is authenticated
 * Use Zustand store instead of localStorage
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  // Import here to avoid circular dependencies
  const { useAuthStore } = require('~/store/authStore');
  const { isAuthenticated } = useAuthStore.getState();

  return isAuthenticated;
}

/**
 * Get current auth token from Zustand store
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  const { useAuthStore } = require('~/store/authStore');
  const { token } = useAuthStore.getState();

  return token || null;
}

/**
 * Get current user from Zustand store
 */
export function getCurrentUser(): any | null {
  if (typeof window === 'undefined') return null;

  const { useAuthStore } = require('~/store/authStore');
  const { user } = useAuthStore.getState();

  return user || null;
}

/**
 * Handle authentication error (401/403)
 * Logout user and redirect to login
 */
export function handleAuthError(error?: any): void {
  console.log('Authentication error detected, logging out...');

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
  console.log('Performing logout...');

  // Redirect to login
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, 100);
}
