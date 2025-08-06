import { useAuthStore } from "~/store/authStore";

export default function StorageDebug() {
  const { user, token, isAuthenticated } = useAuthStore();

  const checkStorage = () => {
    console.log('🔍 Current Auth State:');
    console.log('- User:', user);
    console.log('- Token:', token ? `${token.substring(0, 20)}...` : 'None');
    console.log('- Is Authenticated:', isAuthenticated);
    
    console.log('\n📦 localStorage Keys:');
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          console.log(`- ${key}:`, value ? (value.length > 100 ? `${value.substring(0, 100)}...` : value) : 'null');
        }
      }
    }
  };

  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      console.log('🧹 Cleared all localStorage');
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Storage Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current State */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current Auth State</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User:</strong> {user ? user.username : 'None'}</p>
            <p><strong>Email:</strong> {user ? user.email : 'None'}</p>
            <p><strong>Token:</strong> {token ? `${token.substring(0, 30)}...` : 'None'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Debug Actions</h2>
          <div className="space-y-3">
            <button
              onClick={checkStorage}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Check Storage (Console)
            </button>
            
            <button
              onClick={clearStorage}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear All Storage
            </button>
            
            <a
              href="/login"
              className="block w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>

      {/* Storage Info */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Storage Information</h2>
        <div className="text-sm space-y-2">
          <p><strong>Primary Storage:</strong> localStorage key "auth-storage" (managed by Zustand persist)</p>
          <p><strong>Refresh Token:</strong> localStorage key "refresh-token"</p>
          <p><strong>Auto-sync:</strong> Zustand store ↔ localStorage</p>
          <p><strong>Token Usage:</strong> Axios interceptor reads from Zustand store</p>
        </div>
      </div>
    </div>
  );
}