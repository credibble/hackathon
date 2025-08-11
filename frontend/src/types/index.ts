import { Hex } from "viem";

export interface Token {
  name: string;
  symbol: string;
  image: string;
  decimals: number;
  address: Hex;
}

export interface BorrowerMetadata {
  name: string;
  logo: string;
  description: string;
  website: string;
  location: string;
  sector: string;
  email: string;
  mobile: string;
}

export interface DocumentMetadata {
  name: string;
  type: string;
  size: number;
  date: string;
  url: string;
}

export interface DashboardStats {
  totalPortfolioValue: number;
  totalEarnedYield: number;
  activeShares: number;
  portfolioAPY: number;
  monthlyEarnings: number;
  totalDeposited: number;
}

export interface ImpactStats {
  totalFunded: number;
  borrowersReached: number;
  partnerOrgsOnboarded: number;
  loansOriginated: number;
  averageLoanAmount: number;
  impactStories: Array<{
    title: string;
    description: string;
    image?: string;
    location: string;
    amount: number;
  }>;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form Types
export interface DepositForm {
  poolId: string;
  amount: number;
  token: Token;
}

export interface WithdrawForm {
  shareId: string;
  amount: number;
}

export interface SellForm {
  shareId: string;
  amount: number;
  pricePerShare: number;
}

// Filter Types

export type PoolSort = "borrowAPY" | "totalTVL" | "lockPeriod" | "name";

export type OrderDirection = "asc" | "desc";

export interface PoolFilters {
  risk: "default";
  sortBy: PoolSort;
  sortOrder: OrderDirection;
}

export type MarketStatus = "all" | "active" | "sold";
export type MarketSort = "price" | "expiresIn" | "createdAt";

export interface ListingFilters {
  sortBy: MarketSort;
  sortOrder: OrderDirection;
}

export type TransactionType =
  | "all"
  | "deposit"
  | "withdraw"
  | "borrow"
  | "repay"
  | "withdrawRequest"
  | "withdrawCancel"
  | "credits";

export interface TransactionFilters {
  sortBy: "timestamp";
  sortOrder: OrderDirection;
}
