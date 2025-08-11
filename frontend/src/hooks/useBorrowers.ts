import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { Hex } from "viem";

// Query keys
export const borrowerQueryKeys = {
  all: ["borrowers"] as const,
  list: () => [...borrowerQueryKeys.all, "list"] as const,
  borrower: (id: string) => [...borrowerQueryKeys.all, id] as const,
  creditRequirementRate: (id: string) =>
    [...borrowerQueryKeys.all, id, "creditRequirementRate"] as const,
};

// Get all borrowers
export function useBorrowers() {
  return useQuery({
    queryKey: borrowerQueryKeys.list(),
    queryFn: () => dataService.getBorrowers(),
  });
}

// Get a specific borrower
export function useBorrower(address: Hex) {
  return useQuery({
    queryKey: borrowerQueryKeys.borrower(address),
    queryFn: () => dataService.getBorrower(address),
    enabled: !!address,
  });
}

export function useCreditRequirementRate(asset: Hex) {
  return useQuery({
    queryKey: borrowerQueryKeys.creditRequirementRate(asset),
    queryFn: () => dataService.getCreditRequirementRate(asset),
  });
}
