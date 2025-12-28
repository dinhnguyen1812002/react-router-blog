import { useEffect, useState } from 'react';
import { useAuthStore } from '~/store/authStore';
import { authApi } from '~/api/auth';

/**
 * Initializes authentication state on app startup.
 * 1. Waits for Zustand persist to hydrate from localStorage
 * 2. Attempts to refresh token using refresh token cookie
 * 3. Clears user info if token refresh fails or token is expired
 */
export const useAuthInit = () => {
  const { setToken, logout } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
        try {
        // Wait a tick for Zustand persist to hydrate from localStorage
        await new Promise(resolve => setTimeout(resolve, 0));

        // Get current state from store
        const currentUser = useAuthStore.getState().user;
        const currentToken = useAuthStore.getState().token;

        // If we have both user and token, we're good
        if (currentUser && currentToken) {
          if (isMounted) setIsInitialized(true);
          return;
        }

        // If we have user but no token, try to refresh
        if (currentUser && !currentToken) {
          try {
            const { accessToken } = await authApi.refreshToken();
            if (accessToken) {
              setToken(accessToken);
              if (isMounted) setIsInitialized(true);
              return;
            }
          } catch (err) {
            console.error("Token refresh failed:", err);
            logout();
            if (isMounted) setIsInitialized(true);
            return;
          }
        }

        // No user found, check if refresh token exists
        const hasRefreshTokenCookie = document.cookie.includes('refreshToken');
        const hasRefreshTokenStorage = !!sessionStorage.getItem('refreshToken');

        if (!hasRefreshTokenCookie && !hasRefreshTokenStorage) {
          if (isMounted) setIsInitialized(true);
          return;
        }

        // Try to refresh token
        const { accessToken } = await authApi.refreshToken();

        if (accessToken) {
          setToken(accessToken);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        logout();
      } finally {
        if (isMounted) setIsInitialized(true);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []); 

  return { isInitialized };
};