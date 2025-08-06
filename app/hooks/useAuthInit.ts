import { useEffect, useState } from 'react';
import { useAuthStore } from '~/store/authStore';
import { authApi } from '~/api/auth';
import { authMigration } from '~/utils/authMigration';

/**
 * Hook to initialize authentication state from Zustand store
 * and validate token with server
 */
export const useAuthInit = () => {
  const { setUser, setToken, logout, isAuthenticated, user, token } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 Initializing auth from Zustand store...');

        // Check for legacy data and migrate if needed
        if (authMigration.hasLegacyData()) {
          console.log('📦 Legacy data detected, migrating...');
          authMigration.migrateLegacyData();
        }

        // Check storage consistency
        authMigration.checkConsistency();

        // Check if we have valid auth data in Zustand store
        const currentToken = token;
        const currentUser = user;

        console.log('📦 Current auth state:', {
          hasToken: !!currentToken,
          hasUser: !!currentUser,
          isAuthenticated,
          tokenLength: currentToken?.length || 0,
        });

        // If we have both token and user, validate with server
        if (currentToken) {
          try {
            console.log('🔍 Validating token with server...');
            // const response = await authApi.getCurrentUser();
            // if (response.success && response.data) {
            //   console.log('✅ Token valid, updating user info');
            //   setUser(response.data);
            // }
          } catch (error: any) {
            console.error('❌ Token validation failed:', error);
            if (error.response?.status === 401) {
              console.log('🚪 Token expired, logging out...');
              logout();
            }
          }
        } else if (currentToken) {
          // Inconsistent state - clear everything
          console.log('⚠️ Inconsistent auth state, clearing...');
          logout();
        }

        setIsInitialized(true);
        console.log('✅ Auth initialization complete');
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [token, user, isAuthenticated, setUser, logout]);

  return { isInitialized };
};
