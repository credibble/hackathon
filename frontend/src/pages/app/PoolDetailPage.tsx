import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
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
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Shield,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  FileText,
  Trophy,
  TrendingDown,
  Info,
} from "lucide-react";
import { formatLargeNumber } from "@/lib/utils";
import { Link } from "react-router-dom";
import DepositModal from "@/components/app/DepositModal";
import WithdrawModal from "@/components/app/WithdrawModal";
import SellSharesModal from "@/components/app/SellSharesModal";
import CopyableAddress from "@/components/ui/copyable-address";
import { Shimmer, ShimmerCard } from "@/components/ui/shimmer";
import { usePool } from "@/hooks/useLoans";
import { useAccount } from "wagmi";
import { dataService } from "@/services/dataService";
import {
  computeExpectedAPY,
  computePoolShareValue,
  computeUtilizationRate,
  getFilteredChartData,
} from "@/lib/typeslibs";
import { formatEther, formatUnits } from "viem";
import { BorrowerMetadata, DocumentMetadata } from "@/types";

const PoolDetailPage = () => {
  const { poolId } = useParams();
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState("tvl");

  const {
    data: pool,
    isLoading: poolLoading,
    refetch: refetchPool,
  } = usePool(poolId, address);

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

  if (poolLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/app">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pools
            </Button>
          </Link>
        </div>

        <Card className="neuro-card">
          <ShimmerCard className="h-48 sm:h-64" />
        </Card>

        <Card className="neuro-card">
          <ShimmerCard className="h-80" />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="neuro-card">
            <ShimmerCard />
          </Card>
          <Card className="neuro-card">
            <ShimmerCard />
          </Card>
        </div>
      </div>
    );
  }

  if (!pool?.data) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Pool Not Found
        </h1>
        <p className="text-muted-foreground mb-4">
          The requested loan pool could not be found.
        </p>
        <Link to="/app">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pools
          </Button>
        </Link>
      </div>
    );
  }

  const token = dataService.getToken(pool?.data?.asset);
  const expectedAPY = computeExpectedAPY(pool?.data);
  const utilizationRate = computeUtilizationRate(pool?.data);
  const shareValue = computePoolShareValue(pool?.data);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/app">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pools
            </Button>
          </Link>
        </div>
      </div>

      {/* Pool Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="neuro-card">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="border">
                  {Math.round(pool.data.lockPeriod / 86400)}d lock period
                </Badge>
                <Badge className={`${getStatusColor(pool.data.status)} border`}>
                  {pool.data.status}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl mb-2">
                    {pool.data.name}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    {pool.data.description}
                  </CardDescription>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-3xl sm:text-4xl font-bold text-success mb-1">
                    {expectedAPY}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expected APY
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Range: {(Number(expectedAPY) * 0.8).toFixed(2)}% -{" "}
                    {(Number(expectedAPY) * 1.2).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-foreground">
                    {formatLargeNumber(
                      Number(formatUnits(pool.data.totalTVL, token.decimals))
                    )}{" "}
                    <span className="text-base sm:text-lg text-muted-foreground">
                      {token.symbol}
                    </span>
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total Value Locked - all funds currently deposited</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Value Locked
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  Lock Period
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(pool.data.lockPeriod / 86400)} days
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {utilizationRate}%
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Percentage of deposited funds actively being used for
                        loans
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-sm text-muted-foreground">
                  Utilization Rate
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  Borrow APY
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold text-foreground">
                    {Number(pool.data.borrowAPY / 10_000).toFixed(2)}%
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Interest rate paid by borrowers on loans from this pool
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
              <Button size="lg" onClick={() => setIsDepositModalOpen(true)}>
                Deposit & Earn
              </Button>
              <Link to="/app/marketplace" className="block">
                <Button variant="outline" size="lg" className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Buy Shares
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                disabled={!pool.data.sharesContract.myShares.length}
                onClick={() => setIsWithdrawModalOpen(true)}
              >
                <TrendingDown className="mr-2 h-4 w-4" />
                Withdraw Shares
              </Button>
              <Button
                variant="outline"
                size="lg"
                disabled={!pool.data.sharesContract.myShares.length}
                onClick={() => setIsSellModalOpen(true)}
              >
                <TrendingDown className="mr-2 h-4 w-4" />
                Sell Shares
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* APY Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="neuro-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  APY Performance History
                </CardTitle>
                <CardDescription className="text-sm">
                  Historical APY performance for this loan pool
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {[
                  { key: "apy", label: "APY" },
                  { key: "tvl", label: "TVL" },
                ].map((metric) => (
                  <Button
                    key={metric.key}
                    variant={chartPeriod === metric.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartPeriod(metric.key)}
                    className="min-w-[60px] text-xs sm:text-sm"
                  >
                    {metric.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {poolLoading ? (
              <div className="h-60 sm:h-80">
                <Shimmer className="h-full w-full" />
              </div>
            ) : (
              <div className="h-60 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getFilteredChartData(pool.data, chartPeriod)}
                  >
                    <defs>
                      <linearGradient
                        id="apyGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          day: "numeric",
                          minute: "numeric",
                          hour: "numeric",
                        })
                      }
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickFormatter={(value) =>
                        chartPeriod == "apy"
                          ? `${value}%`
                          : `${formatLargeNumber(value)}`
                      }
                      width={40}
                    />
                    <ChartTooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        fontSize: "12px",
                      }}
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                      formatter={(value: number) => [
                        chartPeriod === "apy"
                          ? `${value.toFixed(2)}%`
                          : `${formatLargeNumber(value)} ${token.symbol}`,
                        chartPeriod === "apy" ? "APY" : "TVL",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#apyGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Information */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="borrowers">Borrowers</TabsTrigger>
          <TabsTrigger value="legal">Legal Documents</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {/* Pool Details */}
            <Card className="neuro-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Pool Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Total Value Locked
                  </span>
                  <span className="font-medium">
                    {formatLargeNumber(
                      Number(formatUnits(pool?.data?.totalTVL, token.decimals))
                    )}{" "}
                    {token.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Share Token</span>
                  <span className="font-medium">{pool.data.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token Value</span>
                  <span className="font-medium">
                    {formatLargeNumber(shareValue)} {token.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Supply</span>
                  <span className="font-medium">
                    {formatLargeNumber(
                      Number(formatEther(pool.data.totalShares))
                    )}
                  </span>
                </div>

                {/* Contract Addresses */}
                <div className="pt-4 border-t border-border space-y-3">
                  <CopyableAddress
                    address={pool.data.contractAddress}
                    label="Pool Contract"
                    className="text-sm"
                  />
                  <CopyableAddress
                    address={pool.data.sharesContract.address}
                    label="Share Token"
                    className="text-sm"
                  />
                  <CopyableAddress
                    address={pool.data.positionContract.address}
                    label="Position Token"
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Risk Information */}
            <Card className="neuro-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Risk Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lock Period</span>
                  <span className="font-medium">
                    {Math.round(pool.data.lockPeriod / 86400)} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Withdraw Delay</span>
                  <span className="font-medium">
                    {Math.round(pool.data.withdrawDelay / 86400)} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Borrow APY</span>
                  <span className="font-medium">
                    {Number(pool.data.borrowAPY / 10_000).toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accepted Tokens */}
          <Card className="neuro-card">
            <CardHeader>
              <CardTitle>Accepted Deposit Tokens</CardTitle>
              <CardDescription>
                You can deposit any of these tokens to participate in this pool
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-muted">
                      <span className="text-xs font-semibold">
                        {token.symbol.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-xs text-muted-foreground">
                        {token.name}
                      </div>
                    </div>
                  </div>
                  <CopyableAddress
                    address={token.address}
                    className="text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="borrowers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pool.data.positionContract.positions?.map((position) => {
              const meta = JSON.parse(
                position.borrower.credit.metadata
              ) as BorrowerMetadata;

              return (
                <Card key={position.id} className="neuro-card">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {meta.name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle>{meta.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {formatLargeNumber(
                            Number(
                              formatEther(position.amount + position.dueAmount)
                            )
                          )}{" "}
                          {token.symbol}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {meta.description}
                    </CardDescription>
                    {meta.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={meta.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {pool.data.positionContract.positions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-2">
                No borrowers found
              </div>
              <p className="text-sm text-muted-foreground">
                Come back later to see if new borrowers have joined
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Legal Documents
              </CardTitle>
              <CardDescription>
                Official documents and legal information for this loan pool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(JSON.parse(pool.data.documents) as DocumentMetadata[]).map(
                (doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size} • {doc.date}
                        </div>
                      </div>
                    </div>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        Download
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card className="overflow-hidden">
            <CardContent
              className="space-y-4 html_pool_terms"
              dangerouslySetInnerHTML={{
                __html: pool.data.terms,
              }}
            ></CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => {
          setIsDepositModalOpen(false);
          refetchPool();
        }}
        pool={pool.data}
      />

      {pool.data.sharesContract.myShares.length > 0 && (
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          share={pool.data.sharesContract.myShares[0]}
          pool={pool.data}
        />
      )}

      {pool.data.sharesContract.myShares.length > 0 && (
        <SellSharesModal
          isOpen={isSellModalOpen}
          onClose={() => setIsSellModalOpen(false)}
          share={pool.data.sharesContract.myShares[0]}
          pool={pool.data}
        />
      )}
    </div>
  );
};

export default PoolDetailPage;
