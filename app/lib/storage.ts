// Storage utilities - Now only uses Zustand store
import { useAuthStore } from '~/store/authStore';

export const storage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    // Get token from Zustand store
    const token = useAuthStore.getState().token;
    
    return token;
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;

    // Save to Zustand store (persist middleware handles localStorage)
    // useAuthStore.getState().setToken(token);
    
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    
    // Clear from Zustand store
    useAuthStore.getState().logout();
    
  },

  getUser: (): any | null => {
    if (typeof window === 'undefined') return null;
    
    // Get user from Zustand store
    const user = useAuthStore.getState().user;
    
    return user;
  },

  setUser: (user: any): void => {
    if (typeof window === 'undefined') return;
    
    // Save to Zustand store
    // useAuthStore.getState().setUser(user);
    // useAuthStore.getState().set
  },

  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    
    // Clear from Zustand store
    useAuthStore.getState().logout();
    
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    
    // Clear from Zustand store
    useAuthStore.getState().logout();
    
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
