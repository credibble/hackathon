import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shimmer, ShimmerCard } from "@/components/ui/shimmer";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Activity,
  ExternalLink,
  ArrowUpRight,
  TrendingDown,
  Info,
} from "lucide-react";
import { useUserShares } from "@/hooks/useShares";
import { formatLargeNumber } from "@/lib/utils";
import SellSharesModal from "@/components/app/SellSharesModal";
import { Link } from "react-router-dom";
import { Share } from "@/types/graph";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { dataService } from "@/services/dataService";
import {
  computeAvailableValue,
  computeCurrentValue,
  computeLockedValue,
} from "@/lib/typeslibs";
import { useAllPools } from "@/hooks/useLoans";

const DashboardPage = () => {
  const { address } = useAccount();

  const { data: allPools } = useAllPools();
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedShare, setSelectedShare] = useState<Share | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: userShares, isLoading: sharesLoading } = useUserShares(
    currentPage,
    10,
    { owner_: { id: address?.toLowerCase() } }
  );

  if (!address) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-2">No wallet connected</div>
        <p className="text-sm text-muted-foreground">
          Connect your wallet to see your shares and earnings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground">
          Overview of your portfolio and earnings
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6">
        {sharesLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 md:pb-2">
                <Shimmer className="h-4 w-24 md:h-5 md:w-32" />
                <Shimmer className="h-3 w-3 md:h-4 md:w-4 rounded-full" />
              </CardHeader>
              <CardContent className="pt-0">
                <Shimmer className="h-6 w-20 md:h-8 md:w-28 mb-1" />
                <Shimmer className="h-3 w-16 md:h-4 md:w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 md:pb-2">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <CardTitle className="text-xs md:text-sm font-medium">
                    Total Portfolio
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Total value of all your active loan pool investments
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg md:text-2xl font-bold">
                  ${formatLargeNumber(0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +0.0% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 md:pb-2">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <CardTitle className="text-xs md:text-sm font-medium">
                    Earned Yield
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Total interest and rewards earned from your investments
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg md:text-2xl font-bold">
                  ${formatLargeNumber(0)}
                </div>
                <p className="text-xs text-muted-foreground">{0}% APY</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 md:pb-2">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <CardTitle className="text-xs md:text-sm font-medium">
                    Active Shares
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Number of share tokens you currently hold across all
                        pools
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <PieChart className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg md:text-2xl font-bold">
                  {userShares?.data?.data?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Out of {allPools?.data?.length || 0} pools available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 md:pb-2">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <CardTitle className="text-xs md:text-sm font-medium">
                    Monthly Earnings
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Average monthly yield generated from your investments
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Activity className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg md:text-2xl font-bold">
                  ${formatLargeNumber(0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +0.0% from last month
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Current Shares */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Current Shares
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your active investments
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {userShares?.data?.data?.length || 0}{" "}
            {(userShares?.data?.data?.length || 0) === 1
              ? "Position"
              : "Positions"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {sharesLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-full">
                  <ShimmerCard />
                </Card>
              ))
            : userShares?.data?.data?.map((share) => {
                const token = dataService.getToken(share.contract.pool.asset);
                const availableValue = computeAvailableValue(share);
                const lockedValue = computeLockedValue(share);
                const currentValue = computeCurrentValue(share);
                const lockedPercentage =
                  (lockedValue / (lockedValue + availableValue)) * 100;
                const isPositive = lockedValue == 0;

                return (
                  <Card
                    key={share.id}
                    className="h-full hover:shadow-lg transition-all duration-300 group overflow-hidden relative"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`https://scan.test2.btcs.network/token/${share.tokenId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3 right-3 flex items-center gap-1 hover:opacity-70 transition-opacity cursor-pointer"
                        >
                          <span className="text-xs font-medium">
                            #{share.tokenId}
                          </span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent
                        className="text-xs max-w-60 w-4/5"
                        hideArrow
                      >
                        <p>View NFT</p>
                      </TooltipContent>
                    </Tooltip>
                    <CardHeader className="pb-2 md:pb-3 pr-20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm md:text-lg line-clamp-1 group-hover:text-primary transition-colors">
                            {share.contract.pool.name}
                          </CardTitle>
                          <div className="flex items-center gap-1.5 md:gap-2 mt-1.5 md:mt-2">
                            <Badge
                              className={`text-xs ${
                                isPositive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {isPositive
                                ? "Active"
                                : `Locked ${lockedPercentage.toFixed(2)}%`}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 md:space-y-4">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/30 rounded-lg p-2 md:p-3">
                          <p className="text-xs text-muted-foreground font-medium">
                            Shares
                          </p>
                          <p className="text-sm md:text-lg font-bold">
                            {formatLargeNumber(
                              Number(formatEther(share.amount))
                            )}
                          </p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2 md:p-3">
                          <p className="text-xs text-muted-foreground font-medium">
                            Unit Value
                          </p>
                          <p className="text-sm md:text-lg font-bold">
                            {formatLargeNumber(currentValue)}{" "}
                            {
                              dataService.getToken(share.contract.pool.asset)
                                .symbol
                            }
                          </p>
                        </div>
                      </div>

                      {/* Value Section */}
                      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-3 md:p-4 border border-primary/20">
                        <div className="text-center">
                          <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">
                            Current Value
                          </p>
                          <p className="text-xl md:text-2xl font-bold text-foreground">
                            {formatLargeNumber(
                              Number(formatEther(share.amount)) * currentValue
                            )}{" "}
                            {token.symbol}
                          </p>
                          <p
                            className={`text-xs md:text-sm font-medium ${
                              isPositive ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {`${share.contract.pool.symbol}`}(
                            {isPositive
                              ? `No Lock`
                              : `Locked ${lockedPercentage.toFixed(2)}&`}
                            )
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                        <div>
                          <p className="text-muted-foreground">Release Date</p>
                          <p className="font-medium">
                            {new Date(
                              share.contract.pool.lockPeriod * 1000 +
                                share.timestamp * 1000
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Locked Date</p>
                          <p className="font-medium">
                            {new Date(
                              share.timestamp * 1000
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs md:text-sm"
                          onClick={() => {
                            setSelectedShare(share);
                            setIsSellModalOpen(true);
                          }}
                        >
                          <TrendingDown className="mr-1 h-3 w-3" />
                          Sell
                        </Button>
                        <Link
                          to={`/app/pools/${share.contract.pool.symbol.toLowerCase()}`}
                        >
                          <Button
                            size="sm"
                            className="flex-1 text-xs md:text-sm w-full"
                          >
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            Go to Pool
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        {(userShares?.data?.data?.length || 0) === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">No shares found</div>
            <p className="text-sm text-muted-foreground">
              Go to pool page to buy shares and start earning yield.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedShare && (
        <SellSharesModal
          isOpen={isSellModalOpen}
          onClose={() => setIsSellModalOpen(false)}
          share={selectedShare}
          pool={selectedShare.contract.pool}
        />
      )}
    </div>
  );
};

export default DashboardPage;
