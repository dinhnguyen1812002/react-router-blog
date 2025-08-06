import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '~/store/authStore';
import { useTheme } from '~/components/providers/ThemeProvider';
import { PageTransition } from '~/components/ui/PageTransition';
import { RouteLoadingIndicator } from '~/components/ui/RouteLoadingIndicator';
import { DashboardSidebar } from './DashboardSidebar';
import { ThemedButton, ThemedIconButton } from '~/components/ui/ThemedButton';
import { NotificationBadge } from '~/components/ui/ThemedBadge';
import { 
  Menu,
  Bell,
  Search,
  Command,
  HelpCircle,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Load saved sidebar state from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    }
    return false;
  });
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { theme, setTheme, actualTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = actualTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            navigate('/dashboard');
            break;
          case '2':
            e.preventDefault();
            navigate('/dashboard/my-posts');
            break;
          case '3':
            e.preventDefault();
            navigate('/dashboard/bookmarks');
            break;
          case '4':
            e.preventDefault();
            navigate('/dashboard/analytics');
            break;
          case '5':
            e.preventDefault();
            navigate('/dashboard/profile');
            break;
          case '6':
            e.preventDefault();
            navigate('/dashboard/settings');
            break;
          case 'n':
            e.preventDefault();
            navigate('/dashboard/posts/new');
            break;
          case 'b':
            e.preventDefault();
            toggleSidebarCollapse();
            break;
          case 'k':
            e.preventDefault();
            // Focus search input
            const searchInput = document.querySelector('input[placeholder*="Tìm kiếm"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
            break;
          case '?':
            e.preventDefault();
            setShowKeyboardShortcuts(!showKeyboardShortcuts);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, showKeyboardShortcuts]);

  // Toggle sidebar collapse
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getPageTitle = () => {
    const pathMap: Record<string, string> = {
      '/dashboard': 'Tổng quan',
      '/dashboard/posts/new': 'Viết bài mới',
      '/dashboard/my-posts': 'Bài viết của tôi',
      '/dashboard/bookmarks': 'Bài viết đã lưu',
      '/dashboard/analytics': 'Thống kê',
      '/dashboard/profile': 'Hồ sơ',
      '/dashboard/settings': 'Cài đặt'
    };
    return pathMap[location.pathname] || 'Dashboard';
  };

  return (
    <div className="min-h-screen flex theme-bg-page">
      <RouteLoadingIndicator />
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Sidebar */}
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        darkMode={actualTheme === 'dark'}
        onToggleCollapse={toggleSidebarCollapse}
        onToggleTheme={toggleTheme}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <ThemedIconButton
                icon={<Menu className="w-5 h-5" />}
                variant="ghost"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              />

              {/* Page title and breadcrumb */}
              <div className="hidden lg:flex items-center space-x-2">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {getPageTitle()}
                </h1>
                {location.pathname !== '/dashboard' && (
                  <>
                    <span className="text-gray-400">/</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Dashboard
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm... (⌘K)"
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded border border-gray-300 dark:border-gray-500">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Keyboard shortcuts help */}
              <ThemedIconButton
                icon={<HelpCircle className="w-5 h-5" />}
                variant="ghost"
                onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                tooltip="Phím tắt (⌘?)"
              />

              {/* Notifications */}
              <div className="relative">
                <ThemedIconButton
                  icon={<Bell className="w-5 h-5" />}
                  variant="ghost"
                />
                <NotificationBadge count={3} className="absolute -top-1 -right-1" />
              </div>

              {/* Back to main site */}
              <ThemedButton
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="hidden sm:flex"
              >
                Về trang chủ
              </ThemedButton>
            </div>
          </div>
        </div>

        {/* Keyboard shortcuts modal */}
        {showKeyboardShortcuts && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Phím tắt
                </h3>
                <ThemedIconButton
                  icon={<X className="w-5 h-5" />}
                  variant="ghost"
                  onClick={() => setShowKeyboardShortcuts(false)}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tổng quan</span>
                  <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded border">⌘1</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Bài viết của tôi</span>
                  <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded border">⌘2</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Bài viết đã lưu</span>
                  <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded border">⌘3</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Thống kê</span>
                  <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded border">⌘4</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Viết bài mới</span>
                  <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded border">⌘N</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Thu gọn sidebar</span>
                  <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded border">⌘B</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tìm kiếm</span>
                  <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded border">⌘K</kbd>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
};
