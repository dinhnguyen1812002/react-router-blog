import { useEffect } from 'react';
import { useAuthStore } from '~/store/authStore';
import { isAuthenticated, handleAuthError } from '~/lib/auth-utils';

/**
 * Component to handle authentication errors and token validation
 * Should be placed at the root level of the app
 */
export function AuthErrorHandler() {
  const { checkTokenValidity, logout } = useAuthStore();

  useEffect(() => {
    // Check token validity on mount
    const checkAuth = () => {
      try {
        // Check using store method
        const isValidFromStore = checkTokenValidity();
        
        // Double check using utility
        const isValidFromUtils = isAuthenticated();
        
        // If either check fails, handle auth error
        if (!isValidFromStore || !isValidFromUtils) {
          console.log('🔒 Token validation failed, clearing session...');
          handleAuthError();
        }
      } catch (error) {
        console.error('❌ Error during auth check:', error);
        handleAuthError(error);
      }
    };

    // Check immediately
    checkAuth();

    // Set up periodic token validation (every 5 minutes)
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-storage' || e.key === 'token') {
        if (!e.newValue) {
          // Auth data was cleared in another tab
          console.log('🔄 Auth data cleared in another tab, logging out...');
          logout();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for focus events to check auth when user returns to tab
    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkTokenValidity, logout]);

  // This component doesn't render anything
  return null;
}

/**
 * Hook to manually trigger auth error handling
 * Useful for components that need to handle specific auth errors
 */
export function useAuthErrorHandler() {
  const { logout } = useAuthStore();

  const handleError = (error: any) => {
    const status = error?.response?.status;
    
    if (status === 401 ) {
      console.log(`🔒 Auth error ${status} detected, handling...`);
      handleAuthError(error);
      logout();
      return true; // Indicates auth error was handled
    }
    
    return false; // Not an auth error
  };

  const forceLogout = () => {
    console.log('🚪 Force logout triggered');
    handleAuthError();
    logout();
  };

  return {
    handleError,
    forceLogout,
    isAuthenticated: isAuthenticated()
  };
}

export default AuthErrorHandler;
