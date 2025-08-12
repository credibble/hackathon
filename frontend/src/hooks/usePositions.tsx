import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";

// Query keys
export const positionQueryKeys = {
  all: ["positions"] as const,
  list: (
    page: number,
    limit: number,
    where?: Record<string, string | number | boolean | object>
  ) => [...positionQueryKeys.all, "list", { page, limit, where }] as const,
};

// Get user shares
export function useUserPositions(
  page: number,
  limit: number,
  where?: Record<string, string | number | boolean | object>
) {
  return useQuery({
    queryKey: positionQueryKeys.list(page, limit, where),
    queryFn: () => dataService.getUserPositions(page, limit, where),
  });
}
