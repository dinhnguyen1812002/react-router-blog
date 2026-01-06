import { useEffect, useState } from 'react';
import { useAuthStore } from '~/store/authStore';

/**
 * Initializes authentication state on app startup.
 * 1. Waits for Zustand persist to hydrate from localStorage
 * 2. Attempts to refresh token using refresh token cookie
 * 3. Clears user info if token refresh fails or token is expired
 */
export const useAuthInit = () => {
  const { setToken, logout, refreshAccessToken } = useAuthStore();
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
            const accessToken = await refreshAccessToken();
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

        // No user found, try to refresh token using cookie
        // (không cần kiểm tra sessionStorage nữa vì dùng cookie)
        try {
          const accessToken = await refreshAccessToken();
          if (accessToken) {
            setToken(accessToken);
            if (isMounted) setIsInitialized(true);
            return;
          }
        } catch (err) {
          console.log("No valid refresh token cookie found");
          // Không log error vì đây là trường hợp bình thường khi chưa login
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