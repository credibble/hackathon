import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { Hex } from "viem";

export const tokenQueryKeys = {
  all: ["tokens"] as const,
  token: (symbol: string) => [...tokenQueryKeys.all, symbol] as const,
};

export function useTokens() {
  return useQuery({
    queryKey: tokenQueryKeys.all,
    queryFn: () => dataService.getTokens(),
  });
}

export function useToken(address?: Hex) {
  return useQuery({
    queryKey: tokenQueryKeys.token(address),
    queryFn: () => dataService.getToken(address),
  });
}
