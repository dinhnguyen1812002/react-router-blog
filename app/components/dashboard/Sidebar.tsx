import { Link, Outlet, useLocation } from "react-router";
import { useState } from "react";
import { useAuthStore } from "~/store/authStore";
import {
  Home,
  FileText,
  Bookmark,
  BarChart3,
  User,
  Settings,
  LogOut,
  PlusCircle,
  BookOpen,
  PanelRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  children: React.ReactNode;
}

export function Sidebar({ collapsed, onToggleCollapsed, children }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: "Tổng quan", path: "/dashboard", icon: Home },
    { name: "Bài viết của tôi", path: "/dashboard/my-posts", icon: FileText },
    { name: "Viết bài mới", path: "/dashboard/posts/new", icon: PlusCircle },
    { name: "Series", path: "/dashboard/series", icon: BookOpen },
    { name: "Bài viết đã lưu", path: "/dashboard/bookmarks", icon: Bookmark },
    { name: "Thống kê", path: "/dashboard/analytics", icon: BarChart3 },
    { name: "Hồ sơ", path: "/dashboard/profile", icon: User },
    { name: "Cài đặt", path: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (path: string) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const active = isActive(item.path);
    const Icon = item.icon;

    const button = (
      <Button
        variant="ghost"
        asChild
        className={cn(
          "w-full justify-start gap-3 transition-colors",
          collapsed ? "justify-center px-2" : "px-3",
          active && "bg-muted"
        )}
      >
        <Link to={item.path}>
          <Icon className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="text-sm">{item.name}</span>}
        </Link>
      </Button>
    );

    if (collapsed) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 h-screen flex flex-col border-r  transition-all duration-300  dark:bg-muted/40",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center px-4 dark:text-white">
          {!collapsed &&  
            <Link to="/dashboard" className="flex items-center space-x-2">
                  <span className="text-lg font-semibold dark:text-white">BlogPlatform</span>
              </Link>
          }
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 dark:text-white">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t p-2 dark:text-white">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => logout()}
                  className={cn(
                    "w-full gap-3 text-destructive hover:text-destructive hover:bg-destructive/10",
                    collapsed ? "justify-center px-2" : "justify-start px-3"
                  )}
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="text-sm">xuất</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <p>xuất</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center 
                          justify-between border-b dark:bg-muted px-6 ">
          <div className="flex items-center gap-3 ">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapsed}
            >
              {collapsed ? 
              <PanelRight className="h-5 w-5 dark:text-white" /> 
              :
              <PanelRight className="h-5 w-5 dark:text-white" />}
            </Button>
            <h1 className="text-lg font-semibold dark:text-white">
              {location.pathname === "/dashboard"
                ? "Tổng quan"
                : navItems.find((item) => isActive(item.path))?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground dark:text-white  ">
              {user?.username}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-muted/40 p-6 dark:bg-muted/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
}