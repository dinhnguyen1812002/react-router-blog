import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate(redirectTo, { replace: true });
    } else if (!requireAuth && isAuthenticated) {
      // Redirect authenticated users away from auth pages
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, requireAuth, redirectTo, navigate]);

  // Show loading or nothing while redirecting
  if (requireAuth && !isAuthenticated) {
    return null;
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

export function GuestOnly({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>;
}
