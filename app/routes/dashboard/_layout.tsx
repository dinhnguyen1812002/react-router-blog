import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '~/store/authStore';


// Components
import { Sidebar } from '~/components/dashboard/Sidebar';
// import { Header } from '~/components/dashboard/Header';
import { PageTransition } from '~/components/ui/PageTransition';
import { RouteLoadingIndicator } from '~/components/ui/RouteLoadingIndicator';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    }
    return false;
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Đóng sidebar khi chuyển trang (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Lưu trạng thái sidebar vào localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  // Chuyển đổi theme

  // Chuyển đổi trạng thái sidebar
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <RouteLoadingIndicator />
      
      {/* Overlay cho mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
     
        onToggleCollapse={toggleSidebarCollapse}
      
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        {/* <Header 
          onOpenSidebar={() => setSidebarOpen(true)}
          user={user}
        /> */}

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}