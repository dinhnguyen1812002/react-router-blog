import { MainLayout } from '~/components/layout/MainLayout';
import { ThemeToggle, ThemeStatus } from '~/components/ui/ThemeToggle';
import { ThemeDemo } from '~/components/ui/ThemeDemo';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';
import { useThemeStore } from '~/store/themeStore';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeTestPage() {
  const { theme, actualTheme, setTheme } = useThemeStore();

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Theme System Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test dark mode và light mode với soft colors
          </p>
        </div>

        {/* Theme Controls */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">Theme Controls</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Current Status */}
              <div>
                <h3 className="font-medium mb-3">Current Theme Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-gray-100">Selected Theme</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {theme}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-gray-100">Actual Theme</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {actualTheme}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-gray-100">System Preference</div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Toggles */}
              <div>
                <h3 className="font-medium mb-3">Theme Controls</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <ThemeToggle />
                  <ThemeStatus />
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                      className="flex items-center space-x-2"
                    >
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </Button>
                    
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                      className="flex items-center space-x-2"
                    >
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </Button>
                    
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('system')}
                      className="flex items-center space-x-2"
                    >
                      <Monitor className="w-4 h-4" />
                      <span>System</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Background Colors */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Background Colors</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
                  <div className="font-medium">Primary Background</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">bg-white / dark:bg-gray-700</div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded">
                  <div className="font-medium">Secondary Background</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">bg-gray-50 / dark:bg-gray-800</div>
                </div>
                
                <div className="p-4 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded">
                  <div className="font-medium">Tertiary Background</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">bg-gray-100 / dark:bg-gray-600</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Text Colors */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Text Colors</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">Primary Text</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">text-gray-900 / dark:text-gray-100</div>
                </div>
                
                <div>
                  <div className="text-gray-700 dark:text-gray-300 font-medium">Secondary Text</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">text-gray-700 / dark:text-gray-300</div>
                </div>
                
                <div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">Tertiary Text</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">text-gray-600 / dark:text-gray-400</div>
                </div>
                
                <div>
                  <div className="text-gray-500 dark:text-gray-500 font-medium">Muted Text</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">text-gray-500 / dark:text-gray-500</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Theme Demo Components */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Component Examples
          </h2>
          <ThemeDemo />
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Test Instructions</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Theme Testing:</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Click theme toggle buttons để switch themes</li>
                  <li>Test system theme bằng cách change OS theme preference</li>
                  <li>Verify smooth transitions giữa themes</li>
                  <li>Check tất cả colors có readable không</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Dark Mode Features:</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Soft dark colors (không quá tối)</li>
                  <li>Good contrast cho readability</li>
                  <li>Consistent color scheme</li>
                  <li>Smooth transitions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
