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

export const mockImpactStats: ImpactStats = {
  totalFunded: 2250000,
  borrowersReached: 1250,
  partnerOrgsOnboarded: 8,
  loansOriginated: 856,
  averageLoanAmount: 2627,
  impactStories: [
    {
      title: "Maria's University Dreams",
      description:
        "With a $2,500 education loan, Maria from Brazil completed her engineering degree and now works at a renewable energy company.",
      image: "/impact/maria.jpg",
      location: "São Paulo, Brazil",
      amount: 2500,
    },
    {
      title: "Farmer Collective Success",
      description:
        "A group of 15 farmers in Kenya used $18,000 in agricultural loans to purchase modern equipment, increasing yields by 40%.",
      image: "/impact/farmers.jpg",
      location: "Nairobi, Kenya",
      amount: 18000,
    },
  ],
};
