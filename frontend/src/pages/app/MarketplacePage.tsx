import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Filter, Info } from "lucide-react";
import { data, Link } from "react-router-dom";
import BuySharesModal from "@/components/app/BuySharesModal";
import { ShimmerCard } from "@/components/ui/shimmer";
import { MarketListing } from "@/types/graph";
import { useMarketplaceListings } from "@/hooks/useMarketplace";
import { MarketSort, MarketStatus } from "@/types";
import { useAllPools } from "@/hooks/useLoans";
import { formatLargeNumber } from "@/lib/utils";
import { formatEther, formatUnits } from "viem";
import { dataService } from "@/services/dataService";

const PER_PAGE = 10;

const MarketplacePage = () => {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(
    null
  );
  const [filterPool, setFilterPool] = useState("all");
  const [filterStatus, setFilterStatus] = useState<MarketStatus>("all");
  const [sortBy, setSortBy] = useState<MarketSort>("price");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allPools } = useAllPools();
  const {
    data: listings,
    isLoading,
    refetch: refetchListings,
  } = useMarketplaceListings(
    currentPage,
    PER_PAGE,
    {
      sortBy,
      sortOrder: "asc",
    },
    {
      ...(filterPool === "all"
        ? undefined
        : { shares_: { pool_: { name_contains_nocase: filterPool } } }),
      ...(filterStatus === "all" ? undefined : { status: filterStatus }),
    }
  );

  const totalPages = Math.ceil((listings?.data?.total || 0) / PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-5 w-5 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Buy and sell loan pool shares from other investors</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-muted-foreground">Trade loan pool shares</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 overflow-x-auto">
        <Select value={filterPool} onValueChange={setFilterPool}>
          <SelectTrigger className="w-full sm:w-48 md:w-60">
            <SelectValue placeholder="Filter by Pool" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pools</SelectItem>
            {allPools?.data?.map((pool) => (
              <SelectItem key={pool.id} value={pool.name}>
                {pool.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as MarketSort)}
        >
          <SelectTrigger className="w-full sm:w-40 md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price (High to Low)</SelectItem>
            <SelectItem value="expiresIn">Expires In</SelectItem>
            <SelectItem value="createdAt">Newest First</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterStatus}
          onValueChange={(value) => setFilterStatus(value as MarketStatus)}
        >
          <SelectTrigger className="w-full sm:w-32 md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-full flex flex-col">
                <ShimmerCard />
              </Card>
            ))
          : listings?.data?.data?.map((listing) => {
              const paymentToken = dataService.getToken(listing.paymentToken);

              return (
                <Card
                  key={listing.id}
                  className="h-full hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <CardHeader className="flex-shrink-0 pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Token ID: #{listing.tokenId}
                      </Badge>
                      <Badge
                        className={
                          listing.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {listing.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm md:text-lg line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem]">
                      {listing?.shares?.pool?.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-xs md:text-sm">
                      <User className="h-3 w-3 mr-1" />
                      <span className="truncate">{listing.seller.id}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-3 md:gap-4 flex-1">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Amount
                        </p>
                        <p className="font-semibold text-sm md:text-base">
                          {formatLargeNumber(
                            Number(formatEther(listing.share.amount))
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Price per Share
                        </p>
                        <p className="font-semibold text-sm md:text-base">
                          {listing.status == "sold"
                            ? 0
                            : `${formatLargeNumber(
                                Number(
                                  formatUnits(
                                    listing.price,
                                    paymentToken.decimals
                                  )
                                ) / Number(formatEther(listing.share.amount))
                              )}`}{" "}
                          {paymentToken.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-3 md:pt-4 flex-shrink-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs md:text-sm text-muted-foreground">
                          Total Price
                        </span>
                        <span className="text-base md:text-lg font-bold text-primary">
                          {formatLargeNumber(
                            Number(
                              formatUnits(listing.price, paymentToken.decimals)
                            )
                          )}{" "}
                          {paymentToken.symbol}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Listed:{" "}
                        {new Date(
                          listing.createdAt * 1000
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Expires:{" "}
                        {new Date(
                          listing.expiresIn * 1000
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button
                        className="flex-1 text-xs md:text-sm"
                        disabled={listing.status === "sold"}
                        onClick={() => {
                          setSelectedListing(listing);
                          setIsBuyModalOpen(true);
                        }}
                      >
                        Purchase
                      </Button>
                      {listing?.shares?.pool?.symbol && (
                        <Button
                          variant="outline"
                          size="lg"
                          asChild
                          className="text-xs"
                        >
                          <Link
                            to={`/app/pools/${listing.shares.pool.symbol.toLowerCase()}`}
                          >
                            View Pool
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 md:mt-8">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-xs md:text-sm px-2 md:px-3"
            >
              <span className="hidden md:inline">Previous</span>
              <span className="md:hidden">Prev</span>
            </Button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }

              if (
                page === currentPage - 2 &&
                currentPage > 4 &&
                totalPages > 7
              ) {
                return (
                  <span
                    key="ellipsis1"
                    className="px-1 md:px-2 text-muted-foreground text-xs md:text-sm"
                  >
                    ...
                  </span>
                );
              }
              if (
                page === currentPage + 2 &&
                currentPage < totalPages - 3 &&
                totalPages > 7
              ) {
                return (
                  <span
                    key="ellipsis2"
                    className="px-1 md:px-2 text-muted-foreground text-xs md:text-sm"
                  >
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[2rem] md:min-w-[2.5rem] text-xs md:text-sm"
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-xs md:text-sm px-2 md:px-3"
            >
              <span className="hidden md:inline">Next</span>
              <span className="md:hidden">Next</span>
            </Button>
          </div>
        </div>
      )}

      {!isLoading && (listings?.data?.data?.length || 0) === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No listings found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters
          </p>
        </div>
      )}

      {/* Buy Shares Modal */}
      {selectedListing && (
        <BuySharesModal
          isOpen={isBuyModalOpen}
          onClose={() => {
            setIsBuyModalOpen(false);
            refetchListings();
          }}
          listing={selectedListing}
        />
      )}
    </div>
  );
};

export default MarketplacePage;
