import { useState } from 'react';
import { useAuthStore } from '~/store/authStore';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';

export function AuthDebug() {
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const analyzeToken = (token: string | null) => {
    if (!token) return { valid: false, reason: 'No token provided' };
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, reason: `Invalid JWT format: expected 3 parts, got ${parts.length}` };
    }

    try {
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      return {
        valid: true,
        header,
        payload,
        expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
        isExpired: payload.exp ? Date.now() > payload.exp * 1000 : false
      };
    } catch (error) {
      return { valid: false, reason: `Failed to decode JWT: ${error}` };
    }
  };

  const checkZustandStorage = () => {
    const info = {
      zustandToken: token,
      zustandStorage: localStorage.getItem('auth-storage'),
      user: user,
      isAuthenticated,
      analysis: {
        zustand: analyzeToken(token)
      },
      // Check for any legacy storage
      legacyAuthToken: localStorage.getItem('auth-token'),
      legacyAuthUser: localStorage.getItem('auth-user'),
    };
    
    setDebugInfo(info);
    console.log('🔍 Zustand Storage Analysis:', info);
  };

  const clearLegacyStorage = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    console.log('🧹 Cleared legacy storage');
  };

  const clearAllStorage = () => {
    // Clear Zustand store (which will clear auth-storage)
    logout();
    // Also clear any legacy storage
    clearLegacyStorage();
    console.log('🧹 Cleared all storage');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Auth Debug Panel (Zustand Only)</h1>
      
      <div className="flex space-x-4">
        <Button onClick={checkZustandStorage} variant="outline">
          Analyze Zustand Storage
        </Button>
        <Button onClick={clearLegacyStorage} variant="outline">
          Clear Legacy Storage
        </Button>
        <Button onClick={clearAllStorage} variant="outline">
          Clear All Storage
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Page
        </Button>
      </div>

      {debugInfo && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Zustand Storage Analysis</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Current State</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                  <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
                  <p><strong>User:</strong> {user ? user.username : 'None'}</p>
                  <p><strong>Token:</strong> {token ? `${token.substring(0, 30)}...` : 'None'}</p>
                  <p><strong>Token Length:</strong> {token?.length || 0}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Token Analysis</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                  <pre className="text-xs">
                    {JSON.stringify(debugInfo.analysis.zustand, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Storage Status</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                  <p><strong>auth-storage (Zustand):</strong> {debugInfo.zustandStorage ? 'Present' : 'None'}</p>
                  <p><strong>auth-token (Legacy):</strong> {debugInfo.legacyAuthToken ? 'Present' : 'None'}</p>
                  <p><strong>auth-user (Legacy):</strong> {debugInfo.legacyAuthUser ? 'Present' : 'None'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Raw Zustand Storage</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                  <pre className="text-xs overflow-auto">
                    {debugInfo.zustandStorage ? debugInfo.zustandStorage.substring(0, 300) + '...' : 'None'}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 