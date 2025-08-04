import { Link, useLocation } from 'react-router';
import { ThemedButton, ThemedIconButton } from '~/components/ui/ThemedButton';
import { ThemedBadge, NotificationBadge } from '~/components/ui/ThemedBadge';
import { useAuthStore } from '~/store/authStore';
import {
  Home,
  Edit3,
  BookOpen,
  Bookmark,
  User,
  Settings,
  BarChart3,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  X,
  PlusCircle
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: number;
  shortcut?: string;
}

const navigation: NavItem[] = [
  {
    name: 'Tổng quan',
    href: '/dashboard',
    icon: Home,
    description: 'Dashboard chính',
    shortcut: '⌘1'
  },
  {
    name: 'Viết bài mới',
    href: '/dashboard/posts/new',
    icon: Edit3,
    description: 'Tạo bài viết mới',
    shortcut: '⌘N'
  },
  {
    name: 'Bài viết của tôi',
    href: '/dashboard/my-posts',
    icon: BookOpen,
    description: 'Quản lý bài viết',
    badge: 12,
    shortcut: '⌘2'
  },
  {
    name: 'Bài viết đã lưu',
    href: '/dashboard/bookmarks',
    icon: Bookmark,
    description: 'Bài viết đã bookmark',
    badge: 5,
    shortcut: '⌘3'
  },
  {
    name: 'Thống kê',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Xem thống kê',
    shortcut: '⌘4'
  },
  {
    name: 'Hồ sơ',
    href: '/dashboard/profile',
    icon: User,
    description: 'Chỉnh sửa hồ sơ',
    shortcut: '⌘5'
  },
  {
    name: 'Cài đặt',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Cài đặt tài khoản',
    shortcut: '⌘6'
  }
];

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  onToggleCollapse: () => void;
  onToggleTheme: () => void;
  onCloseSidebar: () => void;
}

export const DashboardSidebar = ({
  sidebarOpen,
  sidebarCollapsed,
  darkMode,
  onToggleCollapse,
  onToggleTheme,
  onCloseSidebar
}: DashboardSidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
      w-64
    `}>
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="theme-gradient-bg w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-md">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BlogPlatform
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            {/* Toggle sidebar collapse (desktop only) */}
            <ThemedIconButton
              icon={sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="hidden lg:flex"
              tooltip={sidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            />
            
            {/* Close sidebar (mobile only) */}
            <ThemedIconButton
              icon={<X className="w-4 h-4" />}
              variant="ghost"
              size="sm"
              onClick={onCloseSidebar}
              className="lg:hidden"
            />
          </div>
        </div>

        {/* User info */}
        {user && (
          <div className={`p-4 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${sidebarCollapsed ? 'px-2' : ''}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="relative">
                <div className="theme-gradient-bg w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer shadow-lg ring-2 ring-white dark:ring-gray-800"
                     title={sidebarCollapsed ? user.username : undefined}>
                  <span className="text-white font-semibold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {user.username}
                    </p>
                    <ThemedBadge variant="success" size="xs">Pro</ThemedBadge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Action */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <Link to="/dashboard/posts/new">
              <ThemedButton 
                gradient 
                fullWidth 
                icon={<PlusCircle className="w-4 h-4" />}
                className="shadow-lg hover:shadow-xl"
              >
                Viết bài mới
              </ThemedButton>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden
                  ${active
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm hover:scale-[1.02]'
                  }
                `}
                title={sidebarCollapsed ? `${item.name} ${item.shortcut || ''}` : undefined}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-500 dark:text-blue-400' : ''} ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && item.badge > 0 && (
                        <ThemedBadge variant="danger" size="xs" pulse>
                          {item.badge > 99 ? '99+' : item.badge}
                        </ThemedBadge>
                      )}
                      {item.shortcut && (
                        <ThemedBadge 
                          variant="default" 
                          size="xs" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          {item.shortcut}
                        </ThemedBadge>
                      )}
                    </div>
                  </>
                )}
                
                {active && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2 bg-gray-50/50 dark:bg-gray-800/50">
          {/* Theme toggle */}
          {sidebarCollapsed ? (
            <ThemedIconButton
              icon={darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              variant="ghost"
              onClick={onToggleTheme}
              tooltip={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
              className="w-full"
            />
          ) : (
            <ThemedButton
              variant="ghost"
              size="sm"
              onClick={onToggleTheme}
              icon={darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              fullWidth
              className="justify-start"
            >
              {darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
            </ThemedButton>
          )}

          {/* Logout */}
          {sidebarCollapsed ? (
            <ThemedIconButton
              icon={<LogOut className="w-4 h-4" />}
              variant="ghost"
              onClick={handleLogout}
              tooltip="Đăng xuất"
              className="w-full text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            />
          ) : (
            <ThemedButton
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              icon={<LogOut className="w-4 h-4" />}
              fullWidth
              className="justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Đăng xuất
            </ThemedButton>
          )}
        </div>
      </div>
    </div>
  );
};