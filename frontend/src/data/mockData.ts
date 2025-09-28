import { Token, DashboardStats, ImpactStats } from "@/types";
import { zeroAddress } from "viem";

export const mockTokens: Token[] = [
  {
    name: "Tether USD",
    symbol: "USDT",
    image: "/tokens/usdt.png",
    decimals: 6,
    address: "0xcd8de66e0ab126d008d0c7ab824d2b27c0cf6e70",
  },
  {
    name: "Nigerian Naira",
    symbol: "NGN",
    image: "/tokens/ngn.png",
    decimals: 6,
    address: "0xcd8de66e0ab126d008d0c7ab824d2b27c0cf6e70",
  },
  {
    name: "Hedera",
    symbol: "HBAR",
    image: "/tokens/habr.png",
    decimals: 18,
    address: zeroAddress,
  },
];

export const mockDashboardStats: DashboardStats = {
  totalPortfolioValue: 16450.0,
  totalEarnedYield: 548.75,
  activeShares: 2,
  portfolioAPY: 13.2,
  monthlyEarnings: 125.3,
  totalDeposited: 15000.0,
};
