import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { PoolFilters } from "@/types";
import { Hex, zeroAddress } from "viem";

export const loanQueryKeys = {
  all: ["pools"] as const,
  pool: (symbol: string) => [...loanQueryKeys.all, symbol] as const,
  featured: () => [...loanQueryKeys.all, "featured"] as const,
  pools: (
    page: number,
    limit: number,
    filters: Partial<PoolFilters>,
    where?: Record<string, string | number | boolean | object>
  ) => [...loanQueryKeys.all, page, limit, filters, where] as const,
};

export function useAllPools() {
  return useQuery({
    queryKey: loanQueryKeys.all,
    queryFn: () => dataService.getAllPools(),
  });
}

export function usePools(
  page: number,
  limit: number,
  filters?: Partial<PoolFilters>,
  where?: Record<string, string | number | boolean | object>
) {
  return useQuery({
    queryKey: loanQueryKeys.pools(page, limit, filters, where),
    queryFn: () => dataService.getPools(page, limit, filters, where),
  });
}

export function usePool(symbol: string, address: Hex = zeroAddress) {
  return useQuery({
    queryKey: loanQueryKeys.pool(symbol),
    queryFn: () => dataService.getPoolBySymbol(symbol, address),
  });
}

export function useFeaturedLoanPools(limit: number = 3) {
  return useQuery({
    queryKey: loanQueryKeys.featured(),
    queryFn: () =>
      dataService.getPools(1, limit, {
        sortBy: "totalTVL",
        sortOrder: "desc",
      }),
  });
}

export function useDepositToPool() {}

export function useBuyShares() {}

export function useBorrowFromPool() {}
