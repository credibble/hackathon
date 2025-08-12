import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  ArrowUpRight,
  Grid3X3,
  List,
  Info,
  Search,
} from "lucide-react";
import { formatLargeNumber } from "@/lib/utils";
import { ShimmerCard } from "@/components/ui/shimmer";
import { usePools } from "@/hooks/useLoans";
import { PoolSort } from "@/types";
import { formatUnits } from "viem";
import { dataService } from "@/services/dataService";
import { computeExpectedAPY, computeUtilizationRate } from "@/lib/typeslibs";

const PER_PAGE = 10;
type Tab = "all" | "live" | "paused";

const LoanPoolsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<PoolSort>("borrowAPY");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: pools, isLoading: poolsLoading } = usePools(
    currentPage,
    PER_PAGE,
    {
      sortBy,
      sortOrder: sortBy === "name" || sortBy === "lockPeriod" ? "asc" : "desc",
    },
    {
      ...(searchQuery ? { name_contains_nocase: searchQuery } : {}),
      ...(activeTab !== "all" ? { status: activeTab } : {}),
    }
  );
  const totalPages = Math.ceil((pools?.data?.total || 0) / PER_PAGE);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-50 text-green-700 border-green-200";
      case "paused":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <p className="text-sm md:text-base text-muted-foreground">
            Discover and invest in real-world lending opportunities
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search pools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>

        <div className="flex gap-2 md:gap-4 flex-shrink-0 w-full md:w-auto">
          <Select value={sortBy} onValueChange={(e: PoolSort) => setSortBy(e)}>
            <SelectTrigger className="w-full md:w-40 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="borrowAPY">APY (High to Low)</SelectItem>
              <SelectItem value="totalTVL">TVL (High to Low)</SelectItem>
              <SelectItem value="lockPeriod">Lock Period</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as Tab)}
      >
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="all" className="text-xs md:text-sm">
            All Pools
          </TabsTrigger>
          <TabsTrigger value="live" className="text-xs md:text-sm">
            Live
          </TabsTrigger>
          <TabsTrigger value="paused" className="text-xs md:text-sm">
            Paused
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 md:mt-6">
          {/* Pool Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
                : "divide-y divide-border border border-border rounded-lg overflow-hidden"
            }
          >
            {poolsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card
                    key={i}
                    className={
                      viewMode === "grid"
                        ? "h-full flex flex-col"
                        : "border-0 rounded-none shadow-none"
                    }
                  >
                    <ShimmerCard />
                  </Card>
                ))
              : pools?.data?.data?.map((pool, index) => {
                  const token = dataService.getToken(pool.asset);
                  const expectedAPY = computeExpectedAPY(pool);
                  const utilizationRate = computeUtilizationRate(pool);

                  return (
                    <motion.div
                      key={pool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card
                        className={`hover:shadow-medium transition-all duration-300 group ${
                          viewMode === "list"
                            ? "border-0 rounded-none shadow-none"
                            : "h-full flex flex-col"
                        }`}
                      >
                        {viewMode === "grid" ? (
                          <>
                            <CardHeader className="flex-shrink-0 p-4 md:p-6">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex gap-1 md:gap-2">
                                  <Badge
                                    variant="outline"
                                    className="border text-xs"
                                  >
                                    {Math.round(pool.lockPeriod / 86400)}d lock
                                    period
                                  </Badge>
                                  <Badge
                                    className={`${getStatusColor(
                                      pool.status
                                    )} border text-xs`}
                                  >
                                    {pool.status}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg md:text-2xl font-bold text-success">
                                    {expectedAPY}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Expected APY
                                  </div>
                                </div>
                              </div>

                              <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem]">
                                {pool.name}
                              </CardTitle>
                              <CardDescription className="line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] text-sm">
                                {pool.description}
                              </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3 md:space-y-4 flex-1 flex flex-col p-4 md:p-6">
                              {/* Key Metrics */}
                              <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground flex items-center">
                                    <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                    TVL
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          Total Value Locked - total funds
                                          deposited in this pool
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </span>
                                  <span className="font-medium">
                                    {formatLargeNumber(
                                      Number(
                                        formatUnits(
                                          pool.totalTVL,
                                          token.decimals
                                        )
                                      )
                                    )}{" "}
                                    {token.symbol}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground flex items-center">
                                    <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                    Lock Period
                                  </span>
                                  <span className="font-medium">
                                    {Math.ceil(pool.lockPeriod / 86400)}d
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground flex items-center">
                                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                    Utilization
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          Percentage of deposited funds
                                          currently being used for loans
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </span>
                                  <span className="font-medium">
                                    {utilizationRate}%
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground flex items-center">
                                    <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                    Borrowers
                                  </span>
                                  <span className="font-medium">
                                    {pool.positionContract.positions.length}
                                  </span>
                                </div>
                              </div>

                              <div className="flex-shrink-0">
                                <span className="text-xs text-muted-foreground">
                                  Accepts:
                                </span>
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  <Badge
                                    key={token.symbol}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {token.symbol}
                                  </Badge>
                                </div>
                              </div>

                              {/* CTA */}
                              <div className="mt-auto">
                                <Link
                                  to={`/pools/${pool.symbol.toLowerCase()}`}
                                >
                                  <Button
                                    className="w-full group text-sm"
                                    variant="outline"
                                  >
                                    View Details
                                    <ArrowUpRight className="ml-2 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </>
                        ) : (
                          <div className="flex items-center justify-between p-4 md:p-6 w-full hover:bg-muted/30 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-1 md:gap-2 mb-2">
                                <Badge
                                  variant="outline"
                                  className="border text-xs"
                                >
                                  {Math.round(pool.lockPeriod / 86400)}d lock
                                </Badge>
                                <Badge
                                  className={`${getStatusColor(
                                    pool.status
                                  )} border text-xs`}
                                >
                                  {pool.status}
                                </Badge>
                              </div>
                              <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors mb-1">
                                {pool.name}
                              </CardTitle>
                              <CardDescription className="mb-2 text-sm">
                                {pool.description}
                              </CardDescription>
                              <div className="flex gap-1 flex-wrap">
                                <Badge
                                  key={token.symbol}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {token.symbol}
                                </Badge>
                              </div>
                            </div>
                            <div className="hidden md:grid grid-cols-4 gap-8 items-center">
                              <div className="text-center">
                                <div className="text-xl md:text-2xl font-bold text-success">
                                  {expectedAPY}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  APY
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-base md:text-lg font-semibold">
                                  {formatLargeNumber(
                                    Number(
                                      formatUnits(pool.totalTVL, token.decimals)
                                    )
                                  )}{" "}
                                  {token.symbol}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  TVL
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-base md:text-lg font-semibold">
                                  {Math.round(pool.lockPeriod / 86400)}d
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Lock Period
                                </div>
                              </div>
                              <Link to={`/pools/${pool.symbol.toLowerCase()}`}>
                                <Button
                                  className="group text-sm"
                                  variant="outline"
                                >
                                  View Details
                                  <ArrowUpRight className="ml-2 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Button>
                              </Link>
                            </div>
                            <div className="md:hidden ml-4">
                              <Link to={`/pools/${pool.symbol.toLowerCase()}`}>
                                <Button
                                  className="group text-sm"
                                  size="sm"
                                  variant="outline"
                                >
                                  View
                                  <ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )}
                      </Card>
                    </motion.div>
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

          {!poolsLoading && (pools?.data?.data?.length || 0) === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-2">No pools found</div>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoanPoolsPage;
