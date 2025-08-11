import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { toast } from "sonner";
import { Hex } from "viem";

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

export function useWithdrawFromPool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shareId, amount }: { shareId: string; amount: number }) =>
      dataService.withdrawFromPool(shareId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      toast.success("Withdrawal successful!");
    },
    onError: (error) => {
      toast.error("Withdrawal failed. Please try again.");
      console.error("Withdrawal error:", error);
    },
  });
}

// Claim rewards mutation
export function useClaimRewards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shareId }: { shareId: string }) =>
      dataService.claimRewards(shareId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Rewards claimed successfully!");
    },
    onError: (error) => {
      toast.error("Failed to claim rewards. Please try again.");
      console.error("Claim rewards error:", error);
    },
  });
}

// Sell shares mutation
export function useSellShares() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shareId,
      amount,
      pricePerShare,
    }: {
      shareId: string;
      amount: number;
      pricePerShare: number;
    }) => dataService.sellShares(shareId, amount, pricePerShare),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
      toast.success("Shares listed for sale successfully!");
    },
    onError: (error) => {
      toast.error("Failed to list shares for sale. Please try again.");
      console.error("Sell shares error:", error);
    },
  });
}
