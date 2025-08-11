import { Link, useLocation } from 'react-router';
import { useAuthStore } from '~/store/authStore';
import {
  Home,
  FileText,
  BookOpen,
  Bookmark,
  BarChart3,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  PlusCircle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;

  onToggleCollapse: () => void;
 
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  shortcut?: string;
}

export function Sidebar({
  isOpen,
  isCollapsed,
  onToggleCollapse,
  onClose
}: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  // Navigation items
  const navItems: NavItem[] = [
    { 
      name: 'Tổng quan', 
      path: '/dashboard', 
      icon: <Home className="w-5 h-5" />,
      shortcut: '⌘1'
    },
    { 
      name: 'Bài viết của tôi', 
      path: '/dashboard/my-posts', 
      icon: <FileText className="w-5 h-5" />,
      shortcut: '⌘2'
    },
    { 
      name: 'Viết bài mới', 
      path: '/dashboard/posts/new', 
      icon: <PlusCircle className="w-5 h-5" />,
      shortcut: '⌘N'
    },
    { 
      name: 'Bài viết đã lưu', 
      path: '/dashboard/bookmarks', 
      icon: <Bookmark className="w-5 h-5" />,
      shortcut: '⌘3'
    },
    { 
      name: 'Thống kê', 
      path: '/dashboard/analytics', 
      icon: <BarChart3 className="w-5 h-5" />,
      shortcut: '⌘4'
    },
    { 
      name: 'Hồ sơ', 
      path: '/dashboard/profile', 
      icon: <User className="w-5 h-5" />,
      shortcut: '⌘5'
    },
    { 
      name: 'Cài đặt', 
      path: '/dashboard/settings', 
      icon: <Settings className="w-5 h-5" />,
      shortcut: '⌘6'
    }
  ];

  // Check if a nav item is active
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}
    >
      {/* Mobile close button */}
      <button
        className="absolute top-4 right-4 p-1 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 lg:hidden"
        onClick={onClose}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Sidebar header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <Link 
          to="/dashboard" 
          className="flex items-center space-x-2 overflow-hidden"
          onClick={() => onClose()}
        >
          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              BlogPlatform
            </span>
          )}
        </Link>

        {/* Desktop collapse button */}
        <button
          className="hidden lg:block p-1 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={onToggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* User info */}
      <div className={`px-4 py-4 border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'text-center' : ''}`}>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {user?.username}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium group
              ${isActive(item.path) 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30'}
            `}
            onClick={() => onClose()}
          >
            <div className="flex-shrink-0">
              {item.icon}
            </div>
            {!isCollapsed && (
              <>
                <span className="ml-3 flex-1 truncate">{item.name}</span>
                {item.shortcut && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    {item.shortcut}
                  </span>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {/* Theme toggle */}
          {/* <button
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={onToggleTheme}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button> */}

          {/* Logout */}
          <button
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={() => {
              logout();
              onClose();
            }}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}