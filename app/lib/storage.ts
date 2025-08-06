// Storage utilities - Now only uses Zustand store
import { useAuthStore } from '~/store/authStore';

export const storage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    // Get token from Zustand store
    const token = useAuthStore.getState().token;
    
    console.log('📖 Getting token from Zustand store:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenStart: token ? token.substring(0, 20) : 'None'
    });
    
    return token;
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;

    // Save to Zustand store (persist middleware handles localStorage)
    useAuthStore.getState().setToken(token);
    
    console.log('💾 Saved token to Zustand store:', {
      tokenLength: token ? token.length : 0,
      tokenStart: token ? token.substring(0, 20) : 'None'
    });
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    
    // Clear from Zustand store
    useAuthStore.getState().logout();
    
    console.log('🗑️ Removed token from Zustand store');
  },

  getUser: (): any | null => {
    if (typeof window === 'undefined') return null;
    
    // Get user from Zustand store
    const user = useAuthStore.getState().user;
    
    console.log('📖 Getting user from Zustand store:', !!user);
    return user;
  },

  setUser: (user: any): void => {
    if (typeof window === 'undefined') return;
    
    // Save to Zustand store
    useAuthStore.getState().setUser(user);
    
    console.log('💾 Saved user to Zustand store:', user.username);
  },

  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    
    // Clear from Zustand store
    useAuthStore.getState().logout();
    
    console.log('🗑️ Removed user from Zustand store');
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    
    // Clear from Zustand store
    useAuthStore.getState().logout();
    
    console.log('🧹 Cleared all auth data from Zustand store');
  },

  // Helper to check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return useAuthStore.getState().isAuthenticated;
  },

  // Helper to get current auth state
  getAuthState: () => {
    if (typeof window === 'undefined') return null;
    const state = useAuthStore.getState();
    return {
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
    };
  },
};
