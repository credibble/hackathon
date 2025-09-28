import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CreditCard,
  AlertTriangle,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import RepayModal from "@/components/app/RepayModal";
import { Shimmer, ShimmerCard } from "@/components/ui/shimmer";
import { useNavigate } from "react-router-dom";
import { Pool, Position } from "@/types/graph";
import { useBorrower } from "@/hooks/useBorrowers";
import { useAccount } from "wagmi";
import { useUserPositions } from "@/hooks/usePositions";
import { formatLargeNumber } from "@/lib/utils";
import { formatUnits } from "viem";
import { dataService } from "@/services/dataService";

const PositionsPage = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { data: borrowerData, isLoading: loading } = useBorrower(address);
  const { data: positions, isLoading: isPositionsLoading } = useUserPositions(
    currentPage,
    10,
    { borrower_: { id: address?.toLowerCase() } }
  );

  if (loading || isPositionsLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your active borrowing positions and track payment schedules
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <ShimmerCard />
            </Card>
          ))}
        </div>

        <div>
          <div className="mb-4">
            <Shimmer className="h-6 w-40" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <ShimmerCard className="h-48" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!address || !borrowerData?.data) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-2">No profile found</div>
        <p className="text-sm text-muted-foreground">
          Contact support to create your borrower profile and access loan pools.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your active borrowing positions and track payment schedules
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Outstanding
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              <span className="text-base sm:text-lg text-muted-foreground">
                $
              </span>
              {formatLargeNumber(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {positions.data.le} active loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interest Owed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-orange-600">
              <span className="text-base sm:text-lg text-muted-foreground">
                $
              </span>
              {formatLargeNumber(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Accrued interest charges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {positions?.data?.data?.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active loan positions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Positions */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Active Positions</h2>
        <div className="space-y-4">
          {positions?.data?.data?.map((position) => {
            const token = dataService.getToken(position.contract.pool.asset);
            const totalAmount =
              Number(formatUnits(position.amount, token.decimals)) +
              Number(formatUnits(position.dueAmount, token.decimals));
            const timeElapsed = Number(
              Math.ceil(Date.now() / 1000) - position.timestamp
            );
            const interestRate =
              Number(formatUnits(position.amount, token.decimals)) *
              Number(position.contract.pool.borrowAPY / 10_000);
            const interestOwed =
              Math.round(interestRate * timeElapsed) /
              Number(365 * 24 * 60 * 60);

            return (
              <Card
                key={position.id}
                className="hover:shadow-lg transition-all duration-300 relative"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={`https://hashscan.io/testnet/nft/${position.contract.address}/${position.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 flex items-center gap-1 hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      <span className="text-xs font-medium">
                        #{position.tokenId}
                      </span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-60 w-4/5" hideArrow>
                    <p>View NFT</p>
                  </TooltipContent>
                </Tooltip>
                <CardHeader className="pb-3 pr-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {position.contract.pool.name}
                      </CardTitle>
                    </div>
                    <Badge
                      className={`${
                        totalAmount > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {totalAmount > 0 ? "Active" : "No outstanding"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Principal</span>
                      <div className="font-semibold">
                        {formatLargeNumber(
                          Number(formatUnits(position.amount, token.decimals))
                        )}{" "}
                        {token.symbol}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Outstanding</span>
                      <div className="font-semibold text-orange-600">
                        {formatLargeNumber(totalAmount)} {token.symbol}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Borrow APY</span>
                      <div className="font-semibold">
                        {position.contract.pool.borrowAPY / 10_000}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Interest Owed
                      </div>
                      <div className="text-base sm:text-lg font-bold text-red-600">
                        {formatLargeNumber(interestOwed)} {token.symbol}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      className="flex-1"
                      size="default"
                      onClick={() => {
                        setSelectedPosition(position);
                        setIsRepayModalOpen(true);
                      }}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Repay
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="default"
                      onClick={() =>
                        navigate(
                          `/app/pools/${position.contract.pool.symbol.toLowerCase()}`
                        )
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Go to Pool
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Repay Modal */}
      {selectedPosition && (
        <RepayModal
          isOpen={isRepayModalOpen}
          onClose={() => setIsRepayModalOpen(false)}
          position={selectedPosition}
        />
      )}
    </div>
  );
};

export default PositionsPage;
