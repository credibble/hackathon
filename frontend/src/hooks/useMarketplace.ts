import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { ListingFilters } from "@/types";

export const marketplaceQueryKeys = {
  all: ["marketplace"] as const,
  listings: (
    page: number,
    limit: number,
    filters: Partial<ListingFilters>,
    where?: Record<string, string | number | boolean | object>
  ) =>
    [
      ...marketplaceQueryKeys.all,
      "listings",
      page,
      limit,
      filters,
      where,
    ] as const,
  listing: (id: string) => [...marketplaceQueryKeys.all, id] as const,
};

export function useMarketplaceListings(
  page: number,
  limit: number,
  filters: Partial<ListingFilters>,
  where?: Record<string, string | number | boolean | object>
) {
  return useQuery({
    queryKey: marketplaceQueryKeys.listings(page, limit, filters, where),
    queryFn: () =>
      dataService.getMarketplaceListings(page, limit, filters, where),
  });
}
