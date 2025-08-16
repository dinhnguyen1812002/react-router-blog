import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { useAuthErrorHandler } from '~/components/auth/AuthErrorHandler';
import { clearAllAuthData, handleAuthError, performLogout } from '~/lib/auth-utils';
import { useAuthStore } from '~/store/authStore';
import axiosInstance from '~/config/axios';

export default function AuthErrorTestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const { handleError, forceLogout, isAuthenticated } = useAuthErrorHandler();
  const { user, token, logout } = useAuthStore();

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test 1: Clear all auth data manually
  const testClearAuthData = () => {
    addResult('Testing clearAllAuthData()...');
    clearAllAuthData();
    addResult('✅ clearAllAuthData() completed');
  };

  // Test 2: Simulate 401 error
  const testSimulate401 = () => {
    addResult('Testing 401 error simulation...');
    const mockError = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' }
      },
      config: {
        url: '/test-endpoint',
        method: 'GET'
      }
    };
    
    const wasHandled = handleError(mockError);
    addResult(`✅ 401 error handled: ${wasHandled}`);
  };

  // Test 3: Simulate 403 error
  const testSimulate403 = () => {
    addResult('Testing 403 error simulation...');
    const mockError = {
      response: {
        status: 403,
        data: { message: 'Forbidden' }
      },
      config: {
        url: '/test-endpoint',
        method: 'GET'
      }
    };
    
    const wasHandled = handleError(mockError);
    addResult(`✅ 403 error handled: ${wasHandled}`);
  };

  // Test 4: Force logout
  const testForceLogout = () => {
    addResult('Testing force logout...');
    forceLogout();
    addResult('✅ Force logout completed');
  };

  // Test 5: Store logout
  const testStoreLogout = () => {
    addResult('Testing store logout...');
    logout();
    addResult('✅ Store logout completed');
  };

  // Test 6: Perform logout utility
  const testPerformLogout = () => {
    addResult('Testing performLogout utility...');
    performLogout();
    addResult('✅ performLogout completed');
  };

  // Test 7: Make actual API call that should fail
  const testRealApiCall = async () => {
    addResult('Testing real API call with invalid token...');
    try {
      // Set a fake token to trigger 401/403
      localStorage.setItem('token', 'fake-invalid-token');
      
      // Make API call that requires auth
      await axiosInstance.get('/user/profile');
      addResult('❌ API call unexpectedly succeeded');
    } catch (error: any) {
      addResult(`✅ API call failed as expected: ${error.response?.status}`);
    }
  };

  // Test 8: Check current auth state
  const testCheckAuthState = () => {
    addResult('Checking current auth state...');
    addResult(`- isAuthenticated (hook): ${isAuthenticated}`);
    addResult(`- user: ${user ? 'exists' : 'null'}`);
    addResult(`- token: ${token ? 'exists' : 'null'}`);
    addResult(`- localStorage token: ${localStorage.getItem('token') ? 'exists' : 'null'}`);
    addResult(`- localStorage auth-storage: ${localStorage.getItem('auth-storage') ? 'exists' : 'null'}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Auth Error Testing
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test authentication error handling and token cleanup functionality
        </p>
      </div>

      {/* Current Auth State */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Auth State</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <strong>User:</strong> {user ? `✅ ${user.username}` : '❌ None'}
          </div>
          <div>
            <strong>Token:</strong> {token ? '✅ Present' : '❌ None'}
          </div>
          <div>
            <strong>LocalStorage:</strong> {localStorage.getItem('token') ? '✅ Present' : '❌ None'}
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Functions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button onClick={testClearAuthData} variant="outline" size="sm">
            Clear Auth Data
          </Button>
          <Button onClick={testSimulate401} variant="outline" size="sm">
            Simulate 401
          </Button>
          <Button onClick={testSimulate403} variant="outline" size="sm">
            Simulate 403
          </Button>
          <Button onClick={testForceLogout} variant="outline" size="sm">
            Force Logout
          </Button>
          <Button onClick={testStoreLogout} variant="outline" size="sm">
            Store Logout
          </Button>
          <Button onClick={testPerformLogout} variant="outline" size="sm">
            Perform Logout
          </Button>
          <Button onClick={testRealApiCall} variant="outline" size="sm">
            Real API Call
          </Button>
          <Button onClick={testCheckAuthState} variant="outline" size="sm">
            Check Auth State
          </Button>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Test Results</h2>
          <Button onClick={clearResults} variant="outline" size="sm">
            Clear Results
          </Button>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No test results yet. Click a test button above.
            </p>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Testing Instructions:
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>1. Check current auth state first</li>
          <li>2. Test individual functions to see their effects</li>
          <li>3. Use "Real API Call" to test actual 401/403 handling</li>
          <li>4. Check browser console for detailed logs</li>
          <li>5. Check Application tab in DevTools to verify storage cleanup</li>
        </ul>
      </div>
    </div>
  );
}
