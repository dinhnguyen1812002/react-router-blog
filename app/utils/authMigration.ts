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
        return false;
      }

      const legacyUser = JSON.parse(legacyUserStr);
      const { login } = useAuthStore.getState();

      // Migrate to Zustand store
      login(legacyUser, legacyToken);

      // Clear legacy storage
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');

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
  },

  /**
   * Check storage consistency and fix if needed
   */
  checkConsistency: (): void => {
    if (typeof window === 'undefined') return;
    
    const { token, user, isAuthenticated } = useAuthStore.getState();
    const legacyToken = localStorage.getItem('auth-token');
    const legacyUser = localStorage.getItem('auth-user');

    // If Zustand has data but legacy doesn't, we're good
    if (token && user && !legacyToken && !legacyUser) {
      return;
    }

    // If legacy has data but Zustand doesn't, migrate
    if (legacyToken && legacyUser && (!token || !user)) {
      authMigration.migrateLegacyData();
      return;
    }

    // If both have data, clear legacy
    if (token && user && (legacyToken || legacyUser)) {
      authMigration.cleanupLegacyData();
      return;
    }

    // If neither has data, we're good
    if (!token && !user && !legacyToken && !legacyUser) {
      return;
    }
  }
}; 