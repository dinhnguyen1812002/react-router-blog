import { useState, useCallback } from 'react';
import { useAuthStore } from '~/store/authStore';
import { authApi } from '~/api/auth';
import { useClientOnly, useWindow } from '~/hooks/useClientOnly';

export type OAuthProvider = 'google' | 'github' | 'discord';

interface OAuthConfig {
  google: {
    clientId: string;
    redirectUri: string;
    scope: string;
  };
  github: {
    clientId: string;
    redirectUri: string;
    scope: string;
  };
  discord: {
    clientId: string;
    redirectUri: string;
    scope: string;
  };
}

interface OAuthLoginResult {
  success: boolean;
  error?: string;
  user?: any;
}

// Helper function to get origin safely
const getOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:5173';
};

const getOAuthConfig = (): OAuthConfig => {
  const origin = getOrigin();
  
  return {
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      redirectUri: `${origin}/auth/callback/google`,
      scope: 'openid email profile'
    },
    github: {
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
      redirectUri: `${origin}/auth/callback/github`,
      scope: 'user:email'
    },
    discord: {
      clientId: import.meta.env.VITE_DISCORD_CLIENT_ID || '',
      redirectUri: `${origin}/auth/callback/discord`,
      scope: 'identify email'
    }
  };
};

export const useOAuthLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isClient = useClientOnly();
  const window = useWindow();
  const { login } = useAuthStore();

  const buildOAuthUrl = useCallback((provider: OAuthProvider): string => {
    if (!isClient) {
      throw new Error('OAuth can only be used on the client side');
    }

    const config = getOAuthConfig()[provider];
    
    switch (provider) {
      case 'google':
        return `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${config.clientId}&` +
          `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
          `response_type=code&` +
          `scope=${encodeURIComponent(config.scope)}&` +
          `access_type=offline&` +
          `prompt=consent`;
          
      case 'github':
        return `https://github.com/login/oauth/authorize?` +
          `client_id=${config.clientId}&` +
          `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
          `scope=${encodeURIComponent(config.scope)}&` +
          `state=${Math.random().toString(36).substring(7)}`;
          
      case 'discord':
        return `https://discord.com/api/oauth2/authorize?` +
          `client_id=${config.clientId}&` +
          `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
          `response_type=code&` +
          `scope=${encodeURIComponent(config.scope)}`;
          
      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
  }, [isClient]);

  const openOAuthPopup = useCallback((url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window) {
        reject(new Error('Window object not available (SSR environment)'));
        return;
      }

      const popup = window.open(
        url,
        'oauth-login',
        'width=500,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
      );

      if (!popup) {
        reject(new Error('Popup blocked. Please allow popups for this site.'));
        return;
      }

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'OAUTH_SUCCESS') {
          cleanup();
          resolve(event.data.token || event.data.code);
        } else if (event.data.type === 'OAUTH_ERROR') {
          cleanup();
          reject(new Error(event.data.error || 'OAuth authentication failed'));
        }
      };

      // Check if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          cleanup();
          reject(new Error('Authentication cancelled by user'));
        }
      }, 1000);

      const cleanup = () => {
        window.removeEventListener('message', messageListener);
        clearInterval(checkClosed);
        if (!popup.closed) {
          popup.close();
        }
      };

      window.addEventListener('message', messageListener);

      // Timeout after 5 minutes
      setTimeout(() => {
        cleanup();
        reject(new Error('Authentication timeout'));
      }, 5 * 60 * 1000);
    });
  }, [window]);

  const loginWithOAuth = useCallback(async (provider: OAuthProvider): Promise<OAuthLoginResult> => {
    if (!isClient) {
      return {
        success: false,
        error: 'OAuth login is only available on the client side'
      };
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Starting OAuth login with ${provider}`);
      
      // Build OAuth URL
      const oauthUrl = buildOAuthUrl(provider);
      console.log(`OAuth URL: ${oauthUrl}`);

      // Open popup and wait for token/code
      const tokenOrCode = await openOAuthPopup(oauthUrl);
      console.log(`Received token/code from ${provider}`);

      // Send token/code to backend
      const response = await authApi.oauthLogin(provider, tokenOrCode);
      
      if (response.success && response.user && response.accessToken) {
        // Update auth store
        login(response.user, response.accessToken);
        
        console.log(`OAuth login successful with ${provider}`);
        return {
          success: true,
          user: response.user
        };
      } else {
        throw new Error(response.message || 'OAuth login failed');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OAuth login failed';
      console.error(` OAuth login error with ${provider}:`, errorMessage);
      
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [buildOAuthUrl, openOAuthPopup, login, isClient]);

  return {
    loginWithOAuth,
    isLoading,
    error,
    isClient, // Export this so components can check if OAuth is available
    clearError: () => setError(null)
  };
};