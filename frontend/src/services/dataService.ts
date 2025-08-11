import {
  Token,
  BorrowerMetadata,
  PoolFilters,
  ListingFilters,
  TransactionFilters,
  ApiResponse,
  PaginatedResponse,
  ImpactStats,
} from "@/types";
import { graphRequest } from "@/services/graphql/client";
import {
  QUERY_CREDIT_INFO,
  QUERY_CREDIT_INFOS,
  QUERY_ALL_POOLS,
  QUERY_POOLS,
  QUERY_POOL_BY_SYMBOL,
  QUERY_USER_SHARES,
  QUERY_CREDIT_RATE,
  QUERY_MARKET_LISTINGS,
  QUERY_TRANSACTIONS,
} from "@/services/graphql/queries";
import type { Hex } from "viem";
import {
  Pool,
  CreditInfo,
  Share,
  MarketListing,
  Transaction,
  CreditFeed,
} from "@/types/graph";
import { mockTokens } from "@/data/mockData";
export class DataService {
  getTokens(): Token[] {
    return mockTokens;
  }

  getToken(address?: Hex): Token | undefined {
    return this.getTokens().find((token) => token.address === address);
  }

  async getBorrowers(
    first = 100,
    skip = 0,
    sortBy = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<
    ApiResponse<
      PaginatedResponse<
        Omit<CreditInfo, "metadata"> & { metadata: BorrowerMetadata }
      >
    >
  > {
    const { creditInfos, creditInfosCount } = await graphRequest<{
      creditInfos: CreditInfo[];
      creditInfosCount: { id: Hex }[];
    }>(QUERY_CREDIT_INFOS, {
      first: first.toString(),
      skip: skip.toString(),
      orderBy: sortBy,
      orderDirection: sortOrder,
    });

    const mapped = creditInfos.map((ci) => ({
      ...ci,
      metadata: JSON.parse(ci.metadata) as BorrowerMetadata,
    }));

    const total = creditInfosCount.length;

    return {
      success: true,
      data: {
        data: mapped,
        total: total,
        page: skip / first + 1,
        limit: first,
        hasMore: skip + first < total,
      },
    };
  }

  async getBorrower(
    address: Hex
  ): Promise<
    ApiResponse<
      | (Omit<CreditInfo, "metadata"> & { metadata: BorrowerMetadata })
      | undefined
    >
  > {
    const data = await graphRequest<{ creditInfo: CreditInfo }>(
      QUERY_CREDIT_INFO,
      { address: address.toLowerCase() }
    );
    if (!data.creditInfo) {
      return { success: false, message: "Borrower not found", data: undefined };
    }
    return {
      success: true,
      data: {
        ...data.creditInfo,
        metadata: JSON.parse(
          data.creditInfo.metadata || "{}"
        ) as BorrowerMetadata,
      },
    };
  }

  async getCreditRequirementRate(asset: Hex): Promise<ApiResponse<bigint>> {
    const { creditFeed } = await graphRequest<{ creditFeed: CreditFeed }>(
      QUERY_CREDIT_RATE,
      {
        asset,
      }
    );

    if (!creditFeed) {
      return {
        success: false,
        message: "Credit feed not found",
        data: undefined,
      };
    }

    return {
      success: true,
      data: creditFeed.ratio,
    };
  }

  async getAllPools(): Promise<ApiResponse<Pool[]>> {
    const { pools } = await graphRequest<{
      pools: Pool[];
    }>(QUERY_ALL_POOLS);

    return {
      success: true,
      data: pools,
    };
  }

  async getPools(
    page = 1,
    limit = 10,
    filters?: Partial<PoolFilters>,
    where?: Record<string, string | number | boolean | object>
  ): Promise<ApiResponse<PaginatedResponse<Pool>>> {
    const skip = (page - 1) * limit;

    const orderBy = filters.sortBy;
    const orderDirection = filters.sortOrder;

    const { pools, poolsCount } = await graphRequest<{
      pools: Pool[];
      poolsCount: { id: Hex }[];
    }>(QUERY_POOLS, {
      first: limit,
      skip: skip,
      orderBy,
      orderDirection,
      where,
    });

    const total = poolsCount.length;

    return {
      success: true,
      data: {
        data: pools,
        total,
        page,
        limit,
        hasMore: skip + limit < total,
      },
    };
  }

  async getPoolBySymbol(
    symbol: string,
    address?: Hex
  ): Promise<ApiResponse<Pool | undefined>> {
    const upperSymbol = symbol.toUpperCase();

    const { pools } = await graphRequest<{ pools: Pool[] }>(
      QUERY_POOL_BY_SYMBOL,
      { symbol: upperSymbol, address: address?.toLowerCase() }
    );

    if (!pools || pools.length === 0) {
      return { success: false, message: "Pool not found", data: undefined };
    }

    return {
      success: true,
      data: { ...pools[0], snapshots: pools[0]?.snapshots?.reverse() },
    };
  }

  // User Shares
  async getUserShares(
    page: number,
    limit: number,
    where?: Record<string, string | number | boolean | object>
  ): Promise<ApiResponse<PaginatedResponse<Share>>> {
    const { shares, sharesCount } = await graphRequest<{
      shares: Share[];
      sharesCount: { id: Hex }[];
    }>(QUERY_USER_SHARES, {
      first: limit,
      skip: (page - 1) * limit,
      where,
    });

    const total = sharesCount.length;

    return {
      success: true,
      data: {
        data: shares,
        total,
        page,
        limit,
        hasMore: page * limit < total,
      },
    };
  }

  // Marketplace
  async getMarketplaceListings(
    page: number,
    limit: number,
    filters?: Partial<ListingFilters>,
    where?: Record<string, string | number | boolean | object>
  ): Promise<ApiResponse<PaginatedResponse<MarketListing>>> {
    const orderBy = filters.sortBy;
    const orderDirection = filters.sortOrder;

    const { marketListings, marketListingsCount } = await graphRequest<{
      marketListings: MarketListing[];
      marketListingsCount: { id: Hex }[];
    }>(QUERY_MARKET_LISTINGS, {
      first: limit,
      skip: (page - 1) * limit,
      orderBy,
      orderDirection,
      where,
    });

    const total = marketListingsCount.length;

    return {
      success: true,
      data: {
        data: marketListings,
        total,
        page,
        limit,
        hasMore: page * limit < total,
      },
    };
  }

  async getTransactions(
    page: number,
    limit: number,
    filters?: Partial<TransactionFilters>,
    where?: Record<string, string | number | boolean | object>
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const orderBy = filters.sortBy;
    const orderDirection = filters.sortOrder;

    const { transactions, transactionsCount } = await graphRequest<{
      transactions: Transaction[];
      transactionsCount: { id: Hex }[];
    }>(QUERY_TRANSACTIONS, {
      first: limit,
      skip: (page - 1) * limit,
      orderBy,
      orderDirection,
      where,
    });

    const total = transactionsCount.length;

    return {
      success: true,
      data: {
        data: transactions,
        total,
        page,
        limit,
        hasMore: page * limit < total,
      },
    };
  }

  // Dashboard
  getDashboardStats() {
    // No remote aggregate yet. Return zeros.
    return {
      totalPortfolioValue: 0,
      totalEarnedYield: 0,
      activeShares: 0,
      portfolioAPY: 0,
      monthlyEarnings: 0,
      totalDeposited: 0,
    };
  }

  // Impact Stats
  async getImpactStats(): Promise<ImpactStats> {
    return {
      totalFunded: 0,
      borrowersReached: 0,
      partnerOrgsOnboarded: 0,
      loansOriginated: 0,
      averageLoanAmount: 0,
      impactStories: [],
    };
  }

  // Mutations (for future API integration)
  async depositToPool(
    poolId: string,
    amount: number,
    tokenSymbol: string
  ): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Mock success
    return true;
  }

  async withdrawFromPool(shareId: string, amount: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }

  async claimRewards(shareId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return true;
  }

  async buyShares(poolId: string, amount: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }

  async sellShares(
    shareId: string,
    amount: number,
    pricePerShare: number
  ): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }

  async borrowFromPool(poolId: string, amount: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return true;
  }

  async repayLoan(loanId: string, amount: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }
}

// Singleton instance
export const dataService = new DataService();
