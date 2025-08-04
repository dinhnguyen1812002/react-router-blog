import { useEffect, useState } from 'react';
import { useAuthStore } from '~/store/authStore';
import { storage } from '~/lib/storage';
import { authApi } from '~/api/auth';

/**
 * Hook to initialize authentication state from localStorage
 * and validate token with server
 */
export const useAuthInit = () => {
  const { setUser, setToken, logout, isAuthenticated, user, token } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');

        // Kiểm tra xem Zustand đã hydrate chưa
        const storedToken = storage.getToken();
        const storedUser = storage.getUser();

        console.log('📦 Stored data:', {
          hasToken: !!storedToken,
          hasUser: !!storedUser,
          currentToken: !!token,
          currentUser: !!user,
          isAuthenticated
        });

        // Nếu có data trong localStorage nhưng store chưa có
        if (storedToken && storedUser && (!token || !user)) {
          console.log('🔄 Restoring auth state from localStorage...');
          setToken(storedToken);
          setUser(storedUser);
        }

        // Validate token với server nếu có token
        const currentToken = token || storedToken;
        if (currentToken) {
          try {
            console.log('🔍 Validating token with server...');
            const response = await authApi.getCurrentUser();
            if (response.success && response.data) {
              console.log('✅ Token valid, updating user info');
              setUser(response.data);
              storage.setUser(response.data);
            }
          } catch (error: any) {
            console.error('❌ Token validation failed:', error);
            if (error.response?.status === 401) {
              console.log('🚪 Token expired, logging out...');
              logout();
              storage.clear();
            }
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
      } finally {
        setIsInitialized(true);
        console.log('✅ Auth initialization complete');
      }
    };

    // Chỉ chạy một lần khi component mount
    if (!isInitialized) {
      initAuth();
    }
  }, [setUser, setToken, logout, isAuthenticated, user, token, isInitialized]);

  return { isInitialized };
};
