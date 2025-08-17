import { Link, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "~/store/authStore";
import {
  Home,
  FileText,
  Bookmark,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  shortcut?: string;
}

export function Sidebar({ children, collapsed = false, onToggleCollapsed }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Navigation items
  const navItems: NavItem[] = [
    { name: "Tổng quan", path: "/dashboard", icon: <Home className="w-5 h-5" />, shortcut: "⌘1" },
    { name: "Bài viết của tôi", path: "/dashboard/my-posts", icon: <FileText className="w-5 h-5" />, shortcut: "⌘2" },
    { name: "Viết bài mới", path: "/dashboard/posts/new", icon: <PlusCircle className="w-5 h-5" />, shortcut: "⌘N" },
    { name: "Bài viết đã lưu", path: "/dashboard/bookmarks", icon: <Bookmark className="w-5 h-5" />, shortcut: "⌘3" },
    { name: "Thống kê", path: "/dashboard/analytics", icon: <BarChart3 className="w-5 h-5" />, shortcut: "⌘4" },
    { name: "Hồ sơ", path: "/dashboard/profile", icon: <User className="w-5 h-5" />, shortcut: "⌘5" },
    { name: "Cài đặt", path: "/dashboard/settings", icon: <Settings className="w-5 h-5" />, shortcut: "⌘6" },
  ];

  const isActive = (path: string) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } transition-all duration-500 ease-out transform flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
          <Link to="/dashboard" className="flex items-center space-x-2 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
              <span className="text-white font-bold">B</span>
            </div>
            <span 
              className={`text-lg font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap transition-all duration-500 ease-out ${
                collapsed 
                  ? "opacity-0 translate-x-[-10px] w-0" 
                  : "opacity-100 translate-x-0 w-auto"
              }`}
            >
              BlogPlatform
            </span>
          </Link>
          
          {/* Toggle button */}
          <button
            onClick={onToggleCollapsed}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-95 group"
          >
            <div className="transition-transform duration-300 group-hover:rotate-12">
              {collapsed ? (
                <ChevronRight className="w-4 h-4 transition-colors duration-300" />
              ) : (
                <ChevronLeft className="w-4 h-4 transition-colors duration-300" />
              )}
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4 space-y-1 flex-1">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-out group relative overflow-hidden
                ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 dark:from-blue-900/20 dark:to-purple-900/20 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 hover:shadow-sm"
                }
                hover:scale-[1.02] hover:translate-x-1`}
              title={collapsed ? item.name : undefined}
              style={{ transitionDelay: collapsed ? '0ms' : `${index * 50}ms` }}
            >
              {/* Active indicator */}
              {isActive(item.path) && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"></div>
              )}
              
              <div className="flex-shrink-0 relative">
                <div className={`transition-all duration-300 ${isActive(item.path) ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-blue-500'}`}>
                  {item.icon}
                </div>
              </div>
              
              <span 
                className={`ml-3 flex-1 truncate transition-all duration-500 ease-out ${
                  collapsed 
                    ? "opacity-0 translate-x-[-10px] w-0" 
                    : "opacity-100 translate-x-0 w-auto"
                }`}
              >
                {item.name}
              </span>
              
              {item.shortcut && (
                <span 
                  className={`ml-2 text-xs text-gray-500 dark:text-gray-400 transition-all duration-500 ease-out ${
                    collapsed 
                      ? "opacity-0 translate-x-2 w-0" 
                      : "opacity-100 translate-x-0 w-auto"
                  }`}
                >
                  {item.shortcut}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="h-14 flex items-center justify-between px-4 border-t border-gray-200 dark:border-gray-700 overflow-hidden">
          <div 
            className={`text-xs text-gray-500 dark:text-gray-400 transition-all duration-500 ease-out ${
              collapsed 
                ? "opacity-0 translate-x-[-10px] w-0" 
                : "opacity-100 translate-x-0 w-auto"
            }`}
          >
            © 2025 BlogPlatform
          </div>
          
          <button
            className="p-2 rounded-lg text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 
                     hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 
                     hover:scale-110 active:scale-95 group"
            onClick={() => logout()}
            title="Đăng xuất"
          >
            <div className="transition-transform duration-300 group-hover:rotate-12">
              <LogOut className="w-5 h-5" />
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}