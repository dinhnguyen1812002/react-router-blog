import React from 'react';
import { Link, useLocation } from 'react-router';
import { useState, useMemo } from 'react';
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
  PlusCircle,
  Search,
  Bell,
  Heart,
  MessageCircle,
  TrendingUp,
  Calendar,
  FileText,
  Tag,
  Users,
  Shield,
  Zap,
  Star,
  Clock,
  Filter
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: number;
  shortcut?: string;
  category?: string;
  isNew?: boolean;
  isPro?: boolean;
}

const navigation: NavItem[] = [
  {
    name: 'Tổng quan',
    href: '/dashboard',
    icon: Home,
    description: 'Dashboard chính',
    shortcut: '⌘1',
    category: 'main'
  },
  {
    name: 'Viết bài mới',
    href: '/dashboard/posts/new',
    icon: Edit3,
    description: 'Tạo bài viết mới',
    shortcut: '⌘N',
    category: 'content',
    isNew: true
  },
  {
    name: 'Bài viết của tôi',
    href: '/dashboard/my-posts',
    icon: BookOpen,
    description: 'Quản lý bài viết',
    badge: 12,
    shortcut: '⌘2',
    category: 'content'
  },
  {
    name: 'Bài viết đã lưu',
    href: '/dashboard/bookmarks',
    icon: Bookmark,
    description: 'Bài viết đã bookmark',
    badge: 5,
    shortcut: '⌘3',
    category: 'content'
  },
  {
    name: 'Thống kê',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Xem thống kê',
    shortcut: '⌘4',
    category: 'analytics',
    isPro: true
  },
  {
    name: 'Hồ sơ',
    href: '/dashboard/profile',
    icon: User,
    description: 'Chỉnh sửa hồ sơ',
    shortcut: '⌘5',
    category: 'account'
  },
  {
    name: 'Cài đặt',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Cài đặt tài khoản',
    shortcut: '⌘6',
    category: 'account'
  }
];

const categories = {
  main: { name: 'Chính', icon: Home },
  content: { name: 'Nội dung', icon: FileText },
  analytics: { name: 'Thống kê', icon: BarChart3 },
  account: { name: 'Tài khoản', icon: User }
};

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  onToggleCollapse: () => void;
 
  onCloseSidebar: () => void;
}

export const DashboardSidebar = ({
  sidebarOpen,
  sidebarCollapsed,
  onToggleCollapse,
  onCloseSidebar
}: DashboardSidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Filter navigation items based on search and category
  const filteredNavigation = useMemo(() => {
    let filtered = navigation;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    return filtered;
  }, [searchTerm, selectedCategory]);

  // Group navigation by category
  const groupedNavigation = useMemo(() => {
    const grouped: Record<string, NavItem[]> = {};
    filteredNavigation.forEach(item => {
      const category = item.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  }, [filteredNavigation]);

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-72'}
      w-72
    `}>
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="theme-gradient-bg w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-md">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
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
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></div>
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
                  <div className="flex items-center mt-1 space-x-2">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                      <span>Premium</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search bar */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category filters */}
        {!sidebarCollapsed && !searchTerm && (
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-2 py-1 text-xs rounded-md transition-all duration-200 ${
                  selectedCategory === null
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Tất cả
              </button>
              {Object.entries(categories).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                    className={`px-2 py-1 text-xs rounded-md transition-all duration-200 flex items-center gap-1 ${
                      selectedCategory === key
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {category.name}
                  </button>
                );
              })}
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
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Viết bài mới
              </ThemedButton>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {Object.entries(groupedNavigation).map(([categoryKey, items]) => (
            <div key={categoryKey} className="space-y-1">
              {!sidebarCollapsed && items.length > 0 && (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2">
                    {categories[categoryKey as keyof typeof categories] && (
                      <>
                        {React.createElement(categories[categoryKey as keyof typeof categories].icon, {
                          className: "w-4 h-4 text-gray-500 dark:text-gray-400"
                        })}
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {categories[categoryKey as keyof typeof categories].name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {items.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden
                      ${active
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm hover:scale-[1.02]'
                      }
                    `}
                    title={sidebarCollapsed ? `${item.name} ${item.shortcut || ''}` : undefined}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative">
                      <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-500 dark:text-blue-400' : ''} ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                      {item.isNew && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    {!sidebarCollapsed && (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{item.name}</span>
                            {item.isNew && (
                              <ThemedBadge variant="danger" size="xs">Mới</ThemedBadge>
                            )}
                            {item.isPro && (
                              <ThemedBadge variant="warning" size="xs">Pro</ThemedBadge>
                            )}
                          </div>
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
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
          
          {filteredNavigation.length === 0 && searchTerm && (
            <div className="px-3 py-8 text-center">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Không tìm thấy kết quả cho "{searchTerm}"
              </p>
            </div>
          )}
        </nav>

        {/* Quick Stats */}
        {!sidebarCollapsed && (
          <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
                <div className="text-blue-600 dark:text-blue-400 font-semibold">12</div>
                <div className="text-gray-500 dark:text-gray-400">Bài viết</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                <div className="text-green-600 dark:text-green-400 font-semibold">1.2k</div>
                <div className="text-gray-500 dark:text-gray-400">Lượt xem</div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2 bg-gray-50/50 dark:bg-gray-800/50">
          {/* Theme toggle */}
          {/* {sidebarCollapsed ? (
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
          )} */}

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