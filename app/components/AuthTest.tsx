import { useState } from 'react';
import { useAuth } from '~/hooks/useAuth';
import { useAuthStore } from '~/store/authStore';
import { storage } from '~/lib/storage';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/Input';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';

export function AuthTest() {
  const { login, register, logout, isLoading, error } = useAuth();
  const { user, isAuthenticated, token } = useAuthStore();
  
  const [loginData, setLoginData] = useState({
    email: 'toilanguyen@gmail.com',
    password: '123#Hklmn'
  });
  
  const [registerData, setRegisterData] = useState({
    username: 'testuser2',
    email: 'testuser2@example.com',
    password: 'password123'
  });

  const handleLogin = async () => {
    const result = await login(loginData);
    console.log('Login result:', result);
  };

  const handleRegister = async () => {
    const result = await register(registerData);
    console.log('Register result:', result);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleTestCreateComment = async () => {
    const token = storage.getToken();
    if (!token) {
      console.log('❌ No token available for comment test');
      return;
    }

    try {
      console.log('🧪 Testing create comment API...');
      console.log('🔑 Using token:', token ? token.substring(0, 50) + '...' : 'None');

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      console.log('📤 Request headers:', headers);

      const body = {
        content: 'Test comment from frontend',
        parentCommentId: null
      };

      console.log('📤 Request body:', body);

      const response = await fetch('http://localhost:8888/api/v1/posts/test-post-123', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      console.log('🧪 Create comment test response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Comment created successfully:', data);
      } else {
        const errorData = await response.text();
        console.log('❌ Comment creation failed:', errorData);
      }
    } catch (error) {
      console.error('❌ Comment test error:', error);
    }
  };

  const handleClearStorage = () => {
    storage.clear();
    window.location.reload();
  };

  const handleTestToken = async () => {
    // Debug all storage locations
    console.log('🔍 Debugging all storage locations:');
    console.log('- auth-token:', localStorage.getItem('auth-token'));
    console.log('- auth-storage:', localStorage.getItem('auth-storage'));
    console.log('- auth-user:', localStorage.getItem('auth-user'));

    const token = storage.getToken();
    console.log('🔍 Final token from storage.getToken():', token);

    if (token) {
      try {
        // Decode JWT token to see its contents (for debugging only)
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          try {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('🔍 Token payload:', payload);
          } catch (e) {
            console.log('⚠️ Could not decode token payload');
          }
        }

        // Test token with a simple API call
        const response = await fetch('http://localhost:8888/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('🔍 Token test response:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Token is valid, user data:', data);
        } else {
          const errorText = await response.text();
          console.log('❌ Token is invalid or expired:', errorText);
        }
      } catch (error) {
        console.error('❌ Token test error:', error);
      }
    } else {
      console.log('⚠️ No token found');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Authentication Test</h1>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Page
        </Button>
        <Button onClick={handleClearStorage} variant="outline">
          Clear Storage & Reload
        </Button>
        <Button onClick={handleTestToken} variant="outline">
          Test Token
        </Button>
        <Button onClick={handleTestCreateComment} variant="outline">
          Test Create Comment
        </Button>
        <Button
          onClick={() => {
            const token = storage.getToken();
            if (token) {
              console.log('📋 Copy this token to test in Postman:');
              console.log(`Bearer ${token}`);
              navigator.clipboard.writeText(`Bearer ${token}`);
            }
          }}
          variant="outline"
        >
          Copy Token
        </Button>
        <Button
          onClick={() => {
            console.log('🔍 All localStorage keys:');
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key) {
                const value = localStorage.getItem(key);
                console.log(`- ${key}:`, value ? value.substring(0, 100) + (value.length > 100 ? '...' : '') : 'null');
              }
            }
          }}
          variant="outline"
        >
          Debug Storage
        </Button>
      </div>
      
      {/* Current State */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Current State</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
            <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</p>
            <hr className="my-4" />
            <p><strong>Storage Token (via utility):</strong> {storage.getToken() ? `Present (${storage.getToken()?.length} chars)` : 'None'}</p>
            <p><strong>Direct auth-token:</strong> {localStorage.getItem('auth-token') ? `Present (${localStorage.getItem('auth-token')?.length} chars)` : 'None'}</p>
            <p><strong>Zustand auth-storage:</strong> {localStorage.getItem('auth-storage') ? 'Present' : 'None'}</p>
            <p><strong>LocalStorage User:</strong> {storage.getUser() ? storage.getUser().username : 'None'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Login Test */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Login Test</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <Input
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password:</label>
              <Input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="Password"
              />
            </div>
            <Button onClick={handleLogin} disabled={isLoading}>
              Test Login
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Register Test */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Register Test</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username:</label>
              <Input
                value={registerData.username}
                onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                placeholder="Username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <Input
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password:</label>
              <Input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                placeholder="Password"
              />
            </div>
            <Button onClick={handleRegister} disabled={isLoading}>
              Test Register
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout Test */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Logout Test</h2>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} variant="outline">
              Test Logout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
