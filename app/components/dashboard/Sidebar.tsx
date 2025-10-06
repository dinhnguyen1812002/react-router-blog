import { Link, useLocation } from "react-router";
import { useState, useRef } from "react";
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
  Bell,
  Search,
  PanelRight,
} from "lucide-react";
import UserAvatar from "../ui/boring-avatar";

interface SidebarProps {
  children: React.ReactNode;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export function Sidebar({ children, collapsed = false, onToggleCollapsed }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Tổng quan", path: "/dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Bài viết của tôi", path: "/dashboard/my-posts", icon: <FileText className="w-5 h-5" /> },
    { name: "Viết bài mới", path: "/dashboard/posts/new", icon: <PlusCircle className="w-5 h-5" /> },
    { name: "Bài viết đã lưu", path: "/dashboard/bookmarks", icon: <Bookmark className="w-5 h-5" /> },
    { name: "Thống kê", path: "/dashboard/analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { name: "Hồ sơ", path: "/dashboard/profile", icon: <User className="w-5 h-5" /> },
    { name: "Cài đặt", path: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
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
  } flex flex-col border-r 
     border-gray-200 dark:border-gray-700 
     bg-white dark:bg-gray-800 shadow-lg sticky 
     transition-[width,background-color,border-color] duration-500 ease-in-out`}
>

        {/* Sidebar Header (chỉ còn logo, bỏ toggle button) */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-md text-white font-bold">
              B
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                BlogPlatform
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-3  text-sm font-medium transition-all
                ${isActive(item.path)
                  ? "  dark:bg-blue-900/30 dark:text-blue-400 border-l-4 border-l-blue-500 text"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"}`}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        {/* <div className="h-14 flex items-center justify-center border-t border-gray-200 dark:border-gray-700">
          <button
            className="p-2 rounded-lg text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            onClick={() => logout()}
            title="Đăng xuất"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div> */}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            {/* Nút toggle đưa vào đây */}
            <button
              onClick={onToggleCollapsed}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {/* {} */}
              <PanelRight className="w-4 h-4" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {
                location.pathname === "/dashboard"
                  ? "Tổng quan"
                  : location.pathname.split("/").slice(-1)[0]
              }
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Search className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex items-center space-x-2">
              {/* <img
                src={user?.avatar || "/avatar/avatar.jpg"}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              /> */}
              <UserAvatar
              variant="marble"
              name={user?.username}
              src={user?.avatar}
              size={32}
              colors={['#FF5733', '#FFC300', '#DAF7A6']}
              alt={user?.username}
               className="w-5 h-5 rounded-full" />


              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.username}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
