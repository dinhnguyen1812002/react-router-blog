import { useQuery } from '@tanstack/react-query';
import { adminApi, type AdminStats } from '~/api/admin';

export const useAdminStats = () => {
  return useQuery<AdminStats, Error>({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
