import { useAuthStore } from '~/store/authStore';
import { useAuth } from '~/hooks/useAuth';

export const AuthDebug = () => {
  const { user, token, isAuthenticated, _hasHydrated } = useAuthStore();
  const { logout } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">🔐 Auth Debug</h3>
      <div className="space-y-1">
        <div>Hydrated: {_hasHydrated ? '✅' : '❌'}</div>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>User: {user?.username || 'None'}</div>
        <div>Token: {token ? `${token.substring(0, 20)}...` : 'None'}</div>
        <button
          onClick={logout}
          className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};