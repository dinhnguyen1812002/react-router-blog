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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog - Khám phá bài viết mới nhất từ cộng đồng" },
    {
      name: "description",
      content:
        "Tổng hợp các bài viết hay nhất về công nghệ, lập trình, chia sẻ kinh nghiệm và xu hướng mới từ cộng đồng. Tìm kiếm, lọc và khám phá nội dung phù hợp với bạn.",
    },
    {
      name: "keywords",
      content:
        "blog, bài viết, lập trình, công nghệ, chia sẻ, kinh nghiệm, xu hướng",
    },
    { property: "og:title", content: "Blog cộng đồng - Bài viết mới nhất" },
    {
      property: "og:description",
      content:
        "Khám phá các bài viết nổi bật và xu hướng. Tìm kiếm theo chủ đề bạn yêu thích.",
    },
    { property: "og:type", content: "website" },
  ];
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

        <Sidebar collapsed={sidebarCollapsed} onToggleCollapsed={toggleSidebar}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </Sidebar>
      </div>
    </AuthRequired>
  );
}
