import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "~/store/authStore";

// Components
import { Sidebar } from "~/components/dashboard/Sidebar";
import { PageTransition } from "~/components/ui/PageTransition";
import { RouteLoadingIndicator } from "~/components/ui/RouteLoadingIndicator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { AuthRequired } from "~/components/ProtectedRoute";
import type { Route } from "./+types";



export function meta({ }: Route.MetaArgs) {
  return [{ title: "Dashboard" }, { name: "description", content: "Dashboard" }];
}
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
    <AuthRequired>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <RouteLoadingIndicator />

        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapsed={toggleSidebar}
        >
         
          <PageTransition>
            <Outlet />
          </PageTransition>
        </Sidebar>
      </div>
    </AuthRequired>
  );
}