import { createContext, useContext, useMemo } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useAuthStore } from "~/store/authStore";

type AuthContextValue = ReturnType<typeof useAuth> & {
  isInitialized: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  isInitialized: boolean;
}

export function AuthProvider({ children, isInitialized }: AuthProviderProps) {
  const auth = useAuth();
  const value = useMemo(
    () => ({
      ...auth,
      isInitialized,
    }),
    [auth, isInitialized]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context) {
    return context;
  }

  // Safe fallback if used outside provider, keeps compatibility.
  return {
    ...useAuth(),
    isInitialized: true,
  };
}

export function useAuthStatus() {
  const { isAuthenticated, user } = useAuthStore();
  return { isAuthenticated, user };
}
