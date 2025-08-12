import { Token, DashboardStats, ImpactStats } from "@/types";
import { zeroAddress } from "viem";

export const mockTokens: Token[] = [
  {
    name: "Tether USD",
    symbol: "USDT",
    image: "/tokens/usdt.png",
    decimals: 6,
    address: "0x882e4294cc7270fc91d523e413cd94da3a3cddfa",
  },
  {
    name: "Core DAO",
    symbol: "CORE",
    image: "/tokens/core.png",
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
