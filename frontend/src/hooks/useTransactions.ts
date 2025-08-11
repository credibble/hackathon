import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { TransactionFilters } from "@/types";

export const transactionQueryKeys = {
  all: ["transactions"] as const,
  list: (
    page: number,
    limit: number,
    filters?: Partial<TransactionFilters>,
    where?: Record<string, string | number | boolean | object>
  ) =>
    [...transactionQueryKeys.all, "list", page, limit, filters, where] as const,
};

// Get all transactions
export function useTransactions(
  page: number,
  limit: number,
  filters?: Partial<TransactionFilters>,
  where?: Record<string, string | number | boolean | object>
) {
  return useQuery({
    queryKey: transactionQueryKeys.list(page, limit, filters, where),
    queryFn: () => dataService.getTransactions(page, limit, filters, where),
  });
}
