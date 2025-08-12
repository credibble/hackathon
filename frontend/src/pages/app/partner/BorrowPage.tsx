import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, MapPin, Phone, Mail } from "lucide-react";
import BorrowModal from "@/components/app/BorrowModal";
import { Shimmer, ShimmerCard } from "@/components/ui/shimmer";
import { Pool } from "@/types/graph";
import { useBorrower } from "@/hooks/useBorrowers";
import { useAccount } from "wagmi";
import { formatLargeNumber } from "@/lib/utils";
import { formatEther, formatUnits } from "viem";
import { computeExpectedAPY } from "@/lib/typeslibs";
import { dataService } from "@/services/dataService";

const BorrowPage = () => {
  const { address } = useAccount();
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);

  const {
    data: borrowerData,
    isLoading: loading,
    refetch: refetchBorrower,
  } = useBorrower(address);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Access capital from available loan pools to fund your operations and
            growth initiatives
          </p>
        </div>

        <Card>
          <ShimmerCard className="h-48" />
        </Card>

        <div>
          <div className="mb-4">
            <Shimmer className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <ShimmerCard />
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
          Access capital from available loan pools to fund your operations and
          growth initiatives
        </p>
      </div>

      {/* Partner Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Partner Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16 self-center sm:self-start">
              <img
                className="w-full h-full object-cover rounded-full"
                src={borrowerData.data.metadata.logo}
                alt={borrowerData.data.metadata.name}
              />
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h3 className="text-lg sm:text-xl font-semibold">
                  {borrowerData.data.metadata.name}
                </h3>
                <Badge className="bg-green-100 text-green-800 self-center sm:self-start">
                  Standard
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span>{borrowerData.data.metadata.sector}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span>{borrowerData.data.metadata.location}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="break-all">
                    {borrowerData.data.metadata.email}
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span>{borrowerData.data.metadata.mobile}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Credit Limit</div>
              <div className="text-lg sm:text-2xl font-bold text-primary">
                {formatLargeNumber(
                  Number(formatEther(borrowerData.data.available)) +
                    Number(formatEther(borrowerData.data.used))
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Used Credit</div>
              <div className="text-lg sm:text-2xl font-bold text-orange-600">
                {formatLargeNumber(Number(formatEther(borrowerData.data.used)))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">
                Available Credit
              </div>
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {formatLargeNumber(
                  Number(formatEther(borrowerData.data.available))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Pools */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Accesible Pools</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Choose from our diverse range of loan pools with competitive rates and
          flexible terms. Each pool is designed to meet specific funding needs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {borrowerData?.data.accessiblePools?.map((pool) => {
            const expectedAPY = computeExpectedAPY(pool);
            const token = dataService.getToken(pool.asset);
            return (
              <Card
                key={pool.id}
                className="hover:shadow-lg transition-all duration-300 h-full flex flex-col"
              >
                <CardHeader className="pb-3 flex-shrink-0">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-2 flex-1">
                      {pool.name}
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800 flex-shrink-0">
                      {expectedAPY}% APR
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {pool.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  {pool.positionContract.positions &&
                    pool.positionContract.positions.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          Borrowers:
                        </span>
                        <div className="flex -space-x-2">
                          {pool.positionContract.positions
                            .slice(0, 3)
                            .map((borrower, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 bg-muted rounded-full border-2 border-background flex items-center justify-center"
                              >
                                <span className="text-xs font-medium">
                                  #{borrower.tokenId}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  <div className="grid grid-cols-2 gap-3 text-sm flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Available:</span>
                      <div className="font-semibold">
                        {formatLargeNumber(
                          Number(
                            formatUnits(
                              pool.totalTVL - pool.totalBorrowed,
                              token.decimals
                            )
                          )
                        )}{" "}
                        <span className="text-xs text-muted-foreground">
                          {token.symbol}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Lock Period:
                      </span>
                      <div className="font-semibold">
                        {Math.round(pool.lockPeriod / 86400)}d
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Borrow APY:</span>
                      <div className="font-semibold">
                        {Number(pool.borrowAPY / 10_000).toFixed(2)}%
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">TVL:</span>
                      <div className="font-semibold">
                        {formatLargeNumber(
                          Number(formatUnits(pool.totalTVL, token.decimals))
                        )}{" "}
                        <span className="text-xs text-muted-foreground">
                          {token.symbol}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedPool(pool);
                        setIsBorrowModalOpen(true);
                      }}
                    >
                      Borrow from Pool
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {(borrowerData?.data?.accessiblePools?.length || 0) === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">No pools found</div>
            <p className="text-sm text-muted-foreground">
              Contact us to request for access to loan pools.
            </p>
          </div>
        )}
      </div>

      {/* Borrow Modal */}
      {selectedPool && borrowerData?.data && (
        <BorrowModal
          isOpen={isBorrowModalOpen}
          onClose={() => {
            setIsBorrowModalOpen(false);
            refetchBorrower();
          }}
          pool={selectedPool}
          availableCredits={Number(formatEther(borrowerData?.data.available))}
        />
      )}
    </div>
  );
};

export default BorrowPage;
