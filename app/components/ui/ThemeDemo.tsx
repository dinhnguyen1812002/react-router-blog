import { Card, CardContent, CardHeader } from './Card';
import { Button } from './button';
import { Heart, Star, Eye, MessageCircle, Settings, User } from 'lucide-react';

export const ThemeDemo = () => {
  return (
    <div className="space-y-6">
      {/* Color Palette Demo */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Color Palette</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Backgrounds */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Backgrounds</h4>
              <div className="space-y-1">
                <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs">
                  Primary
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs">
                  Secondary
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded text-xs">
                  Tertiary
                </div>
              </div>
            </div>

            {/* Text Colors */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Text Colors</h4>
              <div className="space-y-1">
                <div className="text-gray-900 dark:text-gray-100 text-xs">Primary Text</div>
                <div className="text-gray-700 dark:text-gray-300 text-xs">Secondary Text</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">Tertiary Text</div>
                <div className="text-gray-400 dark:text-gray-500 text-xs">Muted Text</div>
              </div>
            </div>

            {/* Accent Colors */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Accent Colors</h4>
              <div className="space-y-1">
                <div className="text-blue-600 dark:text-blue-400 text-xs">Blue</div>
                <div className="text-green-600 dark:text-green-400 text-xs">Green</div>
                <div className="text-red-600 dark:text-red-400 text-xs">Red</div>
                <div className="text-yellow-600 dark:text-yellow-400 text-xs">Yellow</div>
              </div>
            </div>

            {/* Interactive Elements */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Interactive</h4>
              <div className="space-y-1">
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  Link
                </button>
                <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Button
                </button>
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded">
                  <div className="w-1/2 h-full bg-blue-500 dark:bg-blue-400 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Examples */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Component Examples</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Buttons */}
            <div>
              <h4 className="font-medium mb-3">Buttons</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            {/* Icons with Actions */}
            <div>
              <h4 className="font-medium mb-3">Action Icons</h4>
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">24</span>
                </button>
                <button className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300">
                  <Star className="w-5 h-5" />
                  <span className="text-sm">4.5</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <Eye className="w-5 h-5" />
                  <span className="text-sm">142</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">8</span>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div>
              <h4 className="font-medium mb-3">Nested Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      <span className="font-medium">Settings</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Configure your preferences and account settings.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-green-500 dark:text-green-400" />
                      <span className="font-medium">Profile</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage your personal information and avatar.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Status Messages */}
            <div>
              <h4 className="font-medium mb-3">Status Messages</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="text-blue-800 dark:text-blue-200 text-sm font-medium">Information</div>
                  <div className="text-blue-700 dark:text-blue-300 text-sm">This is an informational message.</div>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="text-green-800 dark:text-green-200 text-sm font-medium">Success</div>
                  <div className="text-green-700 dark:text-green-300 text-sm">Operation completed successfully.</div>
                </div>
                
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">Warning</div>
                  <div className="text-yellow-700 dark:text-yellow-300 text-sm">Please review this information.</div>
                </div>
                
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="text-red-800 dark:text-red-200 text-sm font-medium">Error</div>
                  <div className="text-red-700 dark:text-red-300 text-sm">Something went wrong.</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
