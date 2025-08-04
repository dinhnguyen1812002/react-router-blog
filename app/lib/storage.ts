// Local storage utilities for authentication
export const storage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;

    // Try to get token from Zustand storage first
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        if (parsed.state && parsed.state.token) {
          console.log('📖 Getting token from Zustand storage:', {
            hasToken: !!parsed.state.token,
            tokenLength: parsed.state.token.length || 0,
            tokenStart: parsed.state.token ? parsed.state.token.substring(0, 20) : 'None'
          });
          return parsed.state.token;
        }
      }
    } catch (error) {
      console.warn('⚠️ Error parsing Zustand storage:', error);
    }

    // Fallback to direct token storage
    const token = localStorage.getItem('auth-token');
    console.log('📖 Getting token from direct storage:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenStart: token ? token.substring(0, 20) : 'None'
    });
    return token;
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;

    // Save to both places for compatibility
    localStorage.setItem('auth-token', token);

    // Also update Zustand storage if it exists
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        if (parsed.state) {
          parsed.state.token = token;
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        }
      }
    } catch (error) {
      console.warn('⚠️ Error updating Zustand storage:', error);
    }

    console.log('💾 Saved token to localStorage:', {
      tokenLength: token ? token.length : 0,
      tokenStart: token ? token.substring(0, 20) : 'None'
    });
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth-token');
    console.log('🗑️ Removed token from localStorage');
  },

  getUser: (): any | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('auth-user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('📖 Getting user from localStorage:', !!user);
    return user;
  },

  setUser: (user: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth-user', JSON.stringify(user));
    console.log('💾 Saved user to localStorage:', user.username);
  },

  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth-user');
    console.log('🗑️ Removed user from localStorage');
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    console.log('🧹 Cleared all auth data from localStorage');
  },
};
