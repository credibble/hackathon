import { dataService } from "@/services/dataService";
import { Pool, Share } from "@/types/graph";
import { formatEther, formatUnits } from "viem";

export const getFilteredChartData = (pool?: Pool, chartPeriod?: string) => {
  if (!pool) return [];

  if (pool.snapshots.length === 0) {
    return Array(12).fill({ date: new Date(), value: 0 });
  }

  const token = dataService.getToken(pool.asset);

  if (chartPeriod == "apy") {
    return pool.snapshots?.map((data) => {
      const date = new Date(data.date * 1000);

      const closingBorrowed = Number(
        formatUnits(data.closingBorrowed, token.decimals)
      );
      const closingTVL = Number(formatUnits(data.closingTVL, token.decimals));

      const value = Number(
        (pool.borrowAPY / 10_000) * (closingBorrowed / closingTVL)
      );
      return { date, value };
    });
  }

  return pool.snapshots.map((data) => {
    const date = new Date(data.date * 1000);
    const value = Number(formatUnits(data.closingTVL, token.decimals));
    return { date, value };
  });
};

export const computeExpectedAPY = (pool?: Pool): string => {
  if (!pool) return "0";
  if (pool.totalTVL == BigInt(0)) return "0";

  const token = dataService.getToken(pool.asset);

  return Number(
    Number(
      Number(pool.borrowAPY / 10_000) *
        (Number(formatUnits(pool.totalBorrowed, token.decimals)) /
          Number(formatUnits(pool.totalTVL, token.decimals)))
    )
  ).toFixed(2);
};

export const computePoolShareValue = (pool?: Pool): number => {
  if (!pool) return 0;
  if (pool.totalTVL == BigInt(0)) return 0;
  const token = dataService.getToken(pool.asset);
  return (
    Number(formatUnits(pool.totalTVL, token.decimals)) /
    Number(formatEther(pool.totalShares))
  );
};

export const computeUtilizationRate = (pool?: Pool): string => {
  if (!pool) return "0";
  if (pool.totalTVL == BigInt(0)) return "0";
  const token = dataService.getToken(pool.asset);
  return Number(
    (Number(formatUnits(pool.totalBorrowed, token.decimals)) /
      Number(formatUnits(pool.totalTVL, token.decimals))) *
      100
  ).toFixed(2);
};

export const computeAvailableValue = (share?: Share): number => {
  if (!share) return 0;
  if (share.contract.pool.totalTVL == BigInt(0)) return 0;
  const token = dataService.getToken(share.contract.pool.asset);
  return (
    (Number(formatEther(share.amount)) *
      Number(formatUnits(share.contract.pool.totalTVL, token.decimals))) /
    Number(formatEther(share.contract.pool.totalShares))
  );
};

export const computeLockedValue = (share?: Share): number => {
  if (!share) return 0;
  if (share.contract.pool.totalTVL == BigInt(0)) return 0;
  const token = dataService.getToken(share.contract.pool.asset);
  return (
    (Number(formatEther(share.lockedAmount)) *
      Number(formatUnits(share.contract.pool.totalTVL, token.decimals))) /
    Number(formatEther(share.contract.pool.totalShares))
  );
};

export const computeCurrentValue = (share?: Share): number => {
  if (!share) return 0;
  if (share.contract.pool.totalTVL == BigInt(0)) return 0;
  const token = dataService.getToken(share.contract.pool.asset);
  return (
    Number(formatUnits(share.contract.pool.totalTVL, token.decimals)) /
    Number(formatEther(share.contract.pool.totalShares))
  );
};
