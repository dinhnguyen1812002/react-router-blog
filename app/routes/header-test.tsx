import { MainLayout } from '~/components/layout/MainLayout';
import { UserDropdown } from '~/components/layout/UserDropdown';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { useAuthStore } from '~/store/authStore';
import { Button } from '~/components/ui/button';

export default function HeaderTestPage() {
  const { user, isAuthenticated } = useAuthStore();

  // Mock user for testing
  const mockUser = {
    id: "test-user",
    username: "testuser",
    email: "test@example.com",
    roles: ["USER"]
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Header & User Dropdown Test
          </h1>
          <p className="text-gray-600">
            Test user dropdown menu và header navigation
          </p>
        </div>

        {/* Current Auth Status */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">Current Authentication Status</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              {user && (
                <>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Roles:</strong> {user.roles?.join(', ') || 'None'}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dropdown Demo */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">User Dropdown Demo</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Đây là demo của user dropdown component:
              </p>
              
              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                {isAuthenticated && user ? (
                  <UserDropdown user={user} />
                ) : (
                  <UserDropdown user={mockUser} />
                )}
              </div>
              
              <div className="text-sm text-gray-500">
                {isAuthenticated ? (
                  <p>✅ Sử dụng user thật từ authentication state</p>
                ) : (
                  <p>🧪 Sử dụng mock user để demo (đăng nhập để xem user thật)</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">Dropdown Features</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">✨ UI Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Smooth animations (slide in/out)</li>
                  <li>• Hover effects với scale</li>
                  <li>• Focus ring cho accessibility</li>
                  <li>• Gradient avatar background</li>
                  <li>• Responsive design</li>
                  <li>• Clean typography</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">🔧 Functionality</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Click outside to close</li>
                  <li>• Escape key to close</li>
                  <li>• Auto-close after navigation</li>
                  <li>• ARIA attributes</li>
                  <li>• Keyboard navigation</li>
                  <li>• Test pages grouped</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">Menu Items</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Main Navigation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">Dashboard</div>
                    <div className="text-sm text-gray-600">Settings & management</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">Hồ sơ cá nhân</div>
                    <div className="text-sm text-gray-600">User profile & settings</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">Bài viết của tôi</div>
                    <div className="text-sm text-gray-600">Manage your posts</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Test Pages (Development)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="font-medium text-blue-900">Auth Test</div>
                    <div className="text-sm text-blue-600">Authentication testing</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="font-medium text-blue-900">Comment Test</div>
                    <div className="text-sm text-blue-600">Comment system testing</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="font-medium text-blue-900">Like & Rating Test</div>
                    <div className="text-sm text-blue-600">Post actions testing</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="font-medium text-blue-900">Responsive Test</div>
                    <div className="text-sm text-blue-600">UI responsive testing</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Test Instructions</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900">Testing the Dropdown:</h4>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Click on user avatar/name để mở dropdown</li>
                  <li>Click outside dropdown để đóng</li>
                  <li>Press Escape key để đóng</li>
                  <li>Test keyboard navigation</li>
                  <li>Try các menu items</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Testing Authentication:</h4>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Logout để xem login/register buttons</li>
                  <li>Login để xem user dropdown</li>
                  <li>Test logout từ dropdown</li>
                  <li>Verify redirect behavior</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
