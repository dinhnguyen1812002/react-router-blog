import { useAuthStore } from '~/store/authStore';

/**
 * Migration utility to transition from dual storage to Zustand-only
 */
export const authMigration = {
  /**
   * Check if there's legacy storage data that needs migration
   */
  hasLegacyData: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const legacyToken = localStorage.getItem('auth-token');
    const legacyUser = localStorage.getItem('auth-user');
    
    return !!(legacyToken || legacyUser);
  },

  /**
   * Migrate legacy storage data to Zustand store
   */
  migrateLegacyData: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const legacyToken = localStorage.getItem('auth-token');
      const legacyUserStr = localStorage.getItem('auth-user');
      
      if (!legacyToken || !legacyUserStr) {
        console.log('📦 No legacy data to migrate');
        return false;
      }

      const legacyUser = JSON.parse(legacyUserStr);
      const { login } = useAuthStore.getState();

      console.log('🔄 Migrating legacy auth data to Zustand...');
      console.log('📦 Legacy data:', {
        hasToken: !!legacyToken,
        hasUser: !!legacyUser,
        user: legacyUser.username
      });

      // Migrate to Zustand store
      login(legacyUser, legacyToken);

      // Clear legacy storage
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');

      console.log('✅ Migration completed successfully');
      return true;
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return false;
    }
  },

  /**
   * Clean up any legacy storage data
   */
  cleanupLegacyData: (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    console.log('🧹 Cleaned up legacy storage data');
  },

  /**
   * Check storage consistency and fix if needed
   */
  checkConsistency: (): void => {
    if (typeof window === 'undefined') return;
    
    const { token, user, isAuthenticated } = useAuthStore.getState();
    const legacyToken = localStorage.getItem('auth-token');
    const legacyUser = localStorage.getItem('auth-user');

    console.log('🔍 Checking storage consistency...');
    console.log('📦 Current state:', {
      zustandToken: !!token,
      zustandUser: !!user,
      isAuthenticated,
      legacyToken: !!legacyToken,
      legacyUser: !!legacyUser
    });

    // If Zustand has data but legacy doesn't, we're good
    if (token && user && !legacyToken && !legacyUser) {
      console.log('✅ Storage is consistent (Zustand only)');
      return;
    }

    // If legacy has data but Zustand doesn't, migrate
    if (legacyToken && legacyUser && (!token || !user)) {
      console.log('🔄 Legacy data found, migrating...');
      authMigration.migrateLegacyData();
      return;
    }

    // If both have data, clear legacy
    if (token && user && (legacyToken || legacyUser)) {
      console.log('🧹 Both systems have data, cleaning up legacy...');
      authMigration.cleanupLegacyData();
      return;
    }

    // If neither has data, we're good
    if (!token && !user && !legacyToken && !legacyUser) {
      console.log('✅ Storage is consistent (no data)');
      return;
    }

    console.log('⚠️ Inconsistent state detected');
  }
}; 