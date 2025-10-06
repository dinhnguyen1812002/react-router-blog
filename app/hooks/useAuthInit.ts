import { useEffect, useState } from 'react';
import { useAuthStore } from '~/store/authStore';

/**
 * Initializes authentication state and handles token refresh on app startup.
 * This hook should be used once in the root component to prevent rendering
 * until the auth state is known and properly initialized.
 */
export const useAuthInit = () => {
  const { _hasHydrated, isAuthenticated, initializeAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Đợi store được hydrate từ localStorage
      if (!_hasHydrated) {
        return;
      }

      console.log(" Initializing auth state...");

      try {
        // Sử dụng method initializeAuth từ store
        await initializeAuth();
        console.log("Auth initialization completed");
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        // Đánh dấu đã khởi tạo xong
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [_hasHydrated, initializeAuth]);

  return { 
    isInitialized: isInitialized && _hasHydrated,
    isAuthenticated 
  };
};