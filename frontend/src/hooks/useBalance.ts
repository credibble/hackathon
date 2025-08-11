import { useTokens } from "@/hooks/useTokens";

// Extremely lightweight balance map for UI display; returns zeros by default
export function useBalance() {
  const { data: tokens } = useTokens();
  const balances: Record<string, number> = {};
  (tokens || []).forEach((t) => {
    balances[t.address] = 0;
  });
  return { data: balances } as const;
}
