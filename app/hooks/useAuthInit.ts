import { useAuthStore } from '~/store/authStore';

/**
 * Checks if the auth state has been rehydrated from storage.
 * This hook should be used once in the root component to prevent rendering
 * until the auth state is known.
 */
export const useAuthInit = () => {
  const isInitialized = useAuthStore((state) => state._hasHydrated);

  return { isInitialized };
};