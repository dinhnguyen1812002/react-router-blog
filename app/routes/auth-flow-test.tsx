import { useState } from 'react';
import { MainLayout } from '~/components/layout/MainLayout';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';
import { useAuth } from '~/hooks/useAuth';
import { useAuthStore } from '~/store/authStore';
import { Link } from 'react-router';
import { 
  UserPlus, 
  LogIn, 
  LogOut, 
  User, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function AuthFlowTestPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { login, register, logout, loading, error } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testRegisterFlow = async () => {
    addTestResult('🧪 Testing register flow...');
    
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    };

    try {
      const result = await register(testUser);
      
      if (result.success) {
        if (result.autoLogin) {
          addTestResult('✅ Register + Auto-login successful!');
        } else {
          addTestResult('✅ Register successful, manual login required');
        }
      } else {
        addTestResult(`❌ Register failed: ${result.error}`);
      }
    } catch (error: any) {
      addTestResult(`❌ Register error: ${error.message}`);
    }
  };

  const testLoginFlow = async () => {
    addTestResult('🧪 Testing login flow...');
    
    try {
      const result = await login({
        username: 'testuser',
        password: 'password123'
      });
      
      if (result.success) {
        addTestResult('✅ Login successful!');
      } else {
        addTestResult(`❌ Login failed: ${result.error}`);
      }
    } catch (error: any) {
      addTestResult(`❌ Login error: ${error.message}`);
    }
  };

  const testLogoutFlow = async () => {
    addTestResult('🧪 Testing logout flow...');
    
    try {
      await logout();
      addTestResult('✅ Logout successful!');
    } catch (error: any) {
      addTestResult(`❌ Logout error: ${error.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Authentication Flow Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test register auto-login, login, và logout flows
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Auth Status */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Current Authentication Status</span>
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {isAuthenticated ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </span>
                </div>

                {user && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">User Info:</h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>ID:</strong> {user.id}</p>
                      <p><strong>Username:</strong> {user.username}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Roles:</strong> {user.roles?.join(', ') || 'None'}</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      <strong>Error:</strong> {error}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Controls */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Test Controls</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={testRegisterFlow}
                    disabled={loading}
                    className="flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    <span>Test Register + Auto-Login</span>
                  </Button>

                  <Button
                    onClick={testLoginFlow}
                    disabled={loading || isAuthenticated}
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    <span>Test Login</span>
                  </Button>

                  <Button
                    onClick={testLogoutFlow}
                    disabled={loading || !isAuthenticated}
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    <span>Test Logout</span>
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Manual Testing:</h3>
                  <div className="space-y-2">
                    <Link to="/register">
                      <Button variant="outline" size="sm" className="w-full">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Go to Register Page
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="sm" className="w-full">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Go to Login Page
                      </Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm" className="w-full">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Test Results</h2>
              <Button variant="outline" size="sm" onClick={clearResults}>
                Clear Results
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No test results yet. Run some tests above.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-mono"
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expected Flow */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">Expected Auto-Login Flow</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <UserPlus className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-medium text-blue-900 dark:text-blue-100">1. Register</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    User fills registration form
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium text-green-900 dark:text-green-100">2. Auto-Login</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Server returns user + token
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  <ArrowRight className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-medium text-purple-900 dark:text-purple-100">3. Redirect</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Navigate to dashboard
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Implementation Details:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Register API now returns LoginResponse với accessToken</li>
                  <li>• useAuth hook auto-login sau successful registration</li>
                  <li>• User được redirect đến dashboard thay vì login page</li>
                  <li>• Auth state được update immediately</li>
                  <li>• Token được stored trong localStorage và Zustand</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
