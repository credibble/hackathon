import type { Hex } from "viem";

export interface Pool {
  id: Hex;
  name: string;
  description: string;
  symbol: string;
  status: "live" | "paused";
  documents: string;
  terms: string;
  contractAddress: Hex;
  asset: Hex;
  credit: Hex;
  lockPeriod: number;
  withdrawDelay: number;
  borrowAPY: number;
  totalShares: bigint;
  totalTVL: bigint;
  totalBorrowed: bigint;
  sharesContract: SharesContract;
  positionContract: PositionContract;
  transactions?: Transaction[];
  snapshots: PoolSnapshot[];
  createdAt: number;
  lastUpdated: number;
}

export interface SharesContract {
  id: Hex;
  address: Hex;
  pool?: Pool;
  shares?: Share[];
  myShares?: Share[];
  createdAt: number;
}
export interface PositionContract {
  id: Hex;
  address: Hex;
  pool?: Pool;
  positions?: Position[];
  myPositions?: Position[];
  createdAt: number;
}

export interface Share {
  id: Hex;
  contract: SharesContract;
  owner: User;
  tokenId: number;
  amount: bigint;
  lockedAmount: bigint;
  timestamp: number;
  withdrawalRequested: boolean;
  withdrawRequestTime: number;
  createdAt: number;
}

export interface Position {
  id: Hex;
  contract: PositionContract;
  borrower: User;
  tokenId: number;
  amount: bigint;
  dueAmount: bigint;
  timestamp: number;
  createdAt: number;
}

export interface User {
  id: Hex;
  credit?: CreditInfo;
}

export interface Transaction {
  id: Hex;
  pool?: Pool;
  user: User;
  type:
    | "deposit"
    | "withdraw"
    | "borrow"
    | "repay"
    | "withdrawRequest"
    | "withdrawCancel"
    | "credits";
  txHash: Hex;
  amount: bigint;
  tokenId?: number;
  token: Hex;
  timestamp: number;
}

export interface MarketListing {
  id: number;
  vault: Hex;
  seller: {
    id: Hex;
  };
  share: Share;
  shares: SharesContract;
  tokenId: Hex;
  paymentToken: Hex;
  price: bigint;
  expiresIn: number;
  status: string;
  createdAt: number;
}

export interface CreditInfo {
  id: Hex;
  metadata: string;
  available: bigint;
  used: bigint;
  accessiblePools: Pool[];
  createdAt: number;
  lastUpdated: number;
}

export interface PoolSnapshot {
  id: Hex;
  pool?: Pool;
  date: number;
  openingTVL: bigint;
  closingTVL: bigint;
  openingBorrowed: bigint;
  closingBorrowed: bigint;
  highBorrowed: bigint;
  lowBorrowed: bigint;
}

export interface CreditFeed {
  id: Hex;
  ratio: bigint;
  lastUpdated: number;
}
