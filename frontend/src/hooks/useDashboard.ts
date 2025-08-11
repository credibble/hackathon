import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";

// Query keys
export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardQueryKeys.all, 'stats'] as const,
  impact: () => [...dashboardQueryKeys.all, 'impact'] as const,
};

// Get dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: () => dataService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get impact statistics
export function useImpactStats() {
  return useQuery({
    queryKey: dashboardQueryKeys.impact(),
    queryFn: () => dataService.getImpactStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}