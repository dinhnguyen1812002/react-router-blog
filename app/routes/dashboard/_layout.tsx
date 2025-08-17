import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "~/store/authStore";

// Components
import { Sidebar } from "~/components/dashboard/Sidebar";
import { PageTransition } from "~/components/ui/PageTransition";
import { RouteLoadingIndicator } from "~/components/ui/RouteLoadingIndicator";
import { ScrollArea } from "~/components/ui/scroll-area";

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true";
    }
    return false;
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Lưu trạng thái sidebar vào localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <RouteLoadingIndicator />
      
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggleCollapsed={toggleSidebar}
      >
        <ScrollArea className="h-screen">
          <div className="p-4 lg:p-6">
            <div className="container mx-auto">
              <PageTransition>
                <Outlet />
              </PageTransition>
            </div>
          </div>
        </ScrollArea>
      </Sidebar>
    </div>
  );
}