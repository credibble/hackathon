import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";

// Query keys
export const shareQueryKeys = {
  all: ["shares"] as const,
  list: (
    page: number,
    limit: number,
    where?: Record<string, string | number | boolean | object>
  ) => [...shareQueryKeys.all, "list", { page, limit, where }] as const,
};

// Get user shares
export function useUserShares(
  page: number,
  limit: number,
  where?: Record<string, string | number | boolean | object>
) {
  return useQuery({
    queryKey: shareQueryKeys.list(page, limit, where),
    queryFn: () => dataService.getUserShares(page, limit, where),
  });
}
