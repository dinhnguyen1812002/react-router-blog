import { useEffect, useState } from 'react';

/**
 * Hook to check if the component has been hydrated on the client
 * Useful for preventing hydration mismatches with localStorage
 */
export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};
