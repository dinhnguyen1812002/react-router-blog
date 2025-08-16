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
  onClose,
}: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  // Close user menu when sidebar collapses
  useEffect(() => {
    if (isCollapsed) {
      setShowUserMenu(false);
    }
  }, [isCollapsed]);

  // Navigation items
  const navItems: NavItem[] = [
    {
      name: "Tổng quan",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      shortcut: "⌘1",
    },
    {
      name: "Bài viết của tôi",
      path: "/dashboard/my-posts",
      icon: <FileText className="w-5 h-5" />,
      shortcut: "⌘2",
    },
    {
      name: "Viết bài mới",
      path: "/dashboard/posts/new",
      icon: <PlusCircle className="w-5 h-5" />,
      shortcut: "⌘N",
    },
    {
      name: "Bài viết đã lưu",
      path: "/dashboard/bookmarks",
      icon: <Bookmark className="w-5 h-5" />,
      shortcut: "⌘3",
    },
    {
      name: "Thống kê",
      path: "/dashboard/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      shortcut: "⌘4",
    },
    {
      name: "Hồ sơ",
      path: "/dashboard/profile",
      icon: <User className="w-5 h-5" />,
      shortcut: "⌘5",
    },
    {
      name: "Cài đặt",
      path: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
      shortcut: "⌘6",
    },
  ];

  // Check if a nav item is active
  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${isCollapsed ? "lg:w-20" : "lg:w-64"}
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
      <div
        ref={userMenuRef}
        className={`px-4 py-4 border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? "text-center" : ""} relative`}
      >
        <div
          className={`flex items-center space-x-3 ${!isCollapsed ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg p-2 -m-2 transition-colors" : ""}`}
          onClick={() => !isCollapsed && setShowUserMenu(!showUserMenu)}
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden ring-2 ring-blue-100 dark:ring-blue-900/30">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.username || "Người dùng"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || "email@example.com"}
              </div>
              {user?.roles && user.roles.length > 0 && (
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {user.roles.includes("ADMIN")
                      ? "Admin"
                      : user.roles.includes("MODERATOR")
                        ? "Moderator"
                        : user.roles.includes("AUTHOR")
                          ? "Tác giả"
                          : "Thành viên"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User dropdown menu */}
        {showUserMenu && !isCollapsed && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <Link
              to="/dashboard/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                setShowUserMenu(false);
                onClose();
              }}
            >
              <User className="w-4 h-4 mr-3" />
              Hồ sơ cá nhân
            </Link>
            <Link
              to="/dashboard/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                setShowUserMenu(false);
                onClose();
              }}
            >
              <Settings className="w-4 h-4 mr-3" />
              Cài đặt
            </Link>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => {
                logout();
                setShowUserMenu(false);
                onClose();
              }}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Đăng xuất
            </button>
          </div>
        )}

        {/* Collapsed state tooltip */}
        {isCollapsed && user && (
          <div className="mt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.username}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium group
              ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30"
              }
            `}
            onClick={() => onClose()}
          >
            <div className="flex-shrink-0">{item.icon}</div>
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
