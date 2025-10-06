import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/authStore";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRoles = [],
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      toast.error("Bạn cần đăng nhập để truy cập trang này");
      navigate(redirectTo, { replace: true });
    } else if (requireAuth && isAuthenticated && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => user?.roles?.includes(role));
      if (!hasRequiredRole) {
        toast.error("Bạn không có quyền truy cập trang này");
        navigate(redirectTo, { replace: true });
      }
    } else if (!requireAuth && isAuthenticated) {
      // Redirect authenticated users away from auth pages
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, requireAuth, requiredRoles, redirectTo, navigate]);

  // Show loading or nothing while redirecting
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireAuth && isAuthenticated && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => user?.roles?.includes(role));
    if (!hasRequiredRole) {
      return null;
    }
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// Convenience components
export function AuthRequired({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireAuth={true}>{children}</ProtectedRoute>;
}

export function AdminRequired({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireAuth={true} requiredRoles={["ROLE_ADMIN"]}>{children}</ProtectedRoute>;
}

export function GuestOnly({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>;
}
