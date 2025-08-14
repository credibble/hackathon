import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CopyableAddress from "@/components/ui/copyable-address";
import ClaimWithdrawModal from "@/components/app/ClaimWithdrawModal";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Trophy,
  Clock,
  CreditCard,
} from "lucide-react";
import { ShimmerTable } from "@/components/ui/shimmer";
import { useTransactions } from "@/hooks/useTransactions";
import { useAllPools } from "@/hooks/useLoans";
import { dataService } from "@/services/dataService";
import { TransactionType } from "@/types";
import { useAccount } from "wagmi";
import { formatUnits, zeroAddress } from "viem";
import { formatLargeNumber } from "@/lib/utils";
import { Transaction } from "@/types/graph";

const PER_PAGE = 10;

const TransactionsPage = () => {
  const { address } = useAccount();

  const [filterPool, setFilterPool] = useState("all");
  const [filterType, setFilterType] = useState<TransactionType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { data: allPools } = useAllPools();
  const {
    data: transactions,
    isLoading,
    refetch: refetchTransactions,
  } = useTransactions(
    currentPage,
    PER_PAGE,
    {
      sortBy: "timestamp",
      sortOrder: "desc",
    },
    {
      ...{ user_: { id: address ? address.toLowerCase() : zeroAddress } },
      ...(filterPool !== "all" && {
        pool_: { name_contains_nocase: filterPool },
      }),
      ...(filterType !== "all" && { type_contains_nocase: filterType }),
    }
  );
  const totalPages = Math.ceil((transactions?.data?.total || 0) / PER_PAGE);

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex items-center gap-2">
        <InfoTooltip
          content="Complete history of all your deposits, withdrawals, and rewards"
          side="bottom"
          size="md"
        />
      </div>
      <p className="text-muted-foreground">View your transaction history</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full min-w-0">
        <Select value={filterPool} onValueChange={setFilterPool}>
          <SelectTrigger className="w-full sm:w-48 md:w-60 min-w-0">
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
          value={filterType}
          onValueChange={(value) => setFilterType(value as TransactionType)}
        >
          <SelectTrigger className="w-full sm:w-32 md:w-40 min-w-0">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdraw">Withdraw</SelectItem>
            <SelectItem value="borrow">Borrow</SelectItem>
            <SelectItem value="repay">Repay</SelectItem>
            <SelectItem value="withdrawRequest">Pending Withdraw</SelectItem>
            <SelectItem value="withdrawCancel">Cancelled Withdraw</SelectItem>
            <SelectItem value="credits">Credits</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg md:text-xl">
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="overflow-y-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 md:p-4 font-medium text-xs md:text-sm">
                      Date
                    </th>
                    <th className="text-left p-2 md:p-4 font-medium text-xs md:text-sm">
                      <div className="flex items-center gap-1">
                        Pool
                        <InfoTooltip
                          content="The loan pool where this transaction occurred"
                          side="top"
                        />
                      </div>
                    </th>
                    <th className="text-left p-2 md:p-4 font-medium text-xs md:text-sm">
                      <div className="flex items-center gap-1">
                        Action
                        <InfoTooltip
                          content="Type of transaction: deposit, withdraw, claim rewards, etc."
                          side="top"
                        />
                      </div>
                    </th>
                    <th className="text-left p-2 md:p-4 font-medium text-xs md:text-sm">
                      Token
                    </th>
                    <th className="text-left p-2 md:p-4 font-medium text-xs md:text-sm">
                      Amount
                    </th>
                    <th className="text-left p-2 md:p-4 font-medium text-xs md:text-sm">
                      <div className="flex items-center gap-1">
                        Status
                        <InfoTooltip
                          content={
                            <div>
                              Completed: Transaction confirmed on blockchain
                              <br />
                              Pending: Waiting for confirmation
                            </div>
                          }
                          side="top"
                        />
                      </div>
                    </th>
                    <th className="text-left p-2 md:p-4 font-medium text-xs md:text-sm">
                      <div className="flex items-center gap-1">
                        Hash
                        <InfoTooltip
                          content="Unique blockchain transaction identifier"
                          side="top"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-0">
                        <ShimmerTable rows={8} />
                      </td>
                    </tr>
                  ) : (
                    transactions?.data?.data.map((tx) => {
                      const token = dataService.getToken(tx.token);

                      return (
                        <tr
                          key={tx.id}
                          className="border-b border-border hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-2 md:p-4 text-xs md:text-sm">
                            {new Date(tx.timestamp * 1000).toLocaleDateString()}
                          </td>
                          <td className="p-2 md:p-4">
                            <div
                              className="text-xs md:text-sm font-medium truncate max-w-[120px] md:max-w-[200px]"
                              title={tx?.pool?.name || "NA"}
                            >
                              {tx?.pool?.name || "NA"}
                            </div>
                            <div className="text-xs text-muted-foreground hidden md:block">
                              {tx?.pool?.symbol || "NA"}
                            </div>
                          </td>
                          <td className="p-2 md:p-4">
                            <div className="flex items-center">
                              {tx.type === "deposit" ? (
                                <ArrowDownLeft className="h-3 w-3 md:h-4 md:w-4 text-green-600 mr-1 md:mr-2" />
                              ) : tx.type === "withdraw" ? (
                                <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-blue-600 mr-1 md:mr-2" />
                              ) : tx.type === "withdrawRequest" ? (
                                <Clock className="h-3 w-3 md:h-4 md:w-4 text-orange-600 mr-1 md:mr-2" />
                              ) : tx.type === "replenish_credits" ? (
                                <CreditCard className="h-3 w-3 md:h-4 md:w-4 text-yellow-600 mr-1 md:mr-2" />
                              ) : tx.type === "spend_credits" ? (
                                <CreditCard className="h-3 w-3 md:h-4 md:w-4 text-orange-600 mr-1 md:mr-2" />
                              ) : tx.type === "create_credits" ? (
                                <CreditCard className="h-3 w-3 md:h-4 md:w-4 text-green-600 mr-1 md:mr-2" />
                              ) : (
                                <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-orange-600 mr-1 md:mr-2" />
                              )}
                              <Badge
                                variant="outline"
                                className="capitalize text-xs"
                              >
                                {tx.type}
                              </Badge>
                              {tx.type === "withdrawRequest" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 p-1 h-6"
                                  onClick={() => setSelectedTransaction(tx)}
                                >
                                  <Trophy className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </td>
                          <td className="p-2 md:p-4">
                            <div className="flex items-center">
                              <div className="w-5 h-5 md:w-6 md:h-6 bg-muted rounded-full flex items-center justify-center mr-1 md:mr-2">
                                <span className="text-xs font-medium">
                                  {tx?.tokenId
                                    ? tx?.pool?.symbol?.charAt(0)
                                    : token?.symbol?.charAt(0) || "C"}
                                </span>
                              </div>
                              <span className="text-xs md:text-sm">
                                {tx?.tokenId
                                  ? tx?.pool?.symbol
                                  : token?.symbol || "CRDT"}
                              </span>
                            </div>
                          </td>
                          <td className="p-2 md:p-4 text-xs md:text-sm font-mono">
                            {formatLargeNumber(
                              Number(
                                formatUnits(tx.amount, token?.decimals ?? 18)
                              )
                            )}
                          </td>
                          <td className="p-2 md:p-4">
                            <Badge
                              className={`text-xs ${
                                tx.type !== "withdrawRequest" &&
                                tx.type !== "withdrawCancel" &&
                                tx.type !== "create_credits"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {tx.type === "withdrawRequest"
                                ? tx.type
                                : "Completed"}
                            </Badge>
                          </td>
                          <td className="p-2 md:p-4">
                            <div className="flex items-center gap-1 md:gap-2">
                              <CopyableAddress
                                address={tx.txHash}
                                className="text-xs"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="p-1"
                              >
                                <a
                                  href={`https://scan.test2.btcs.network/tx/${tx.txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {!isLoading && (transactions?.data?.data?.length || 0) === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-2">
                    No transactions found
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center my-6 md:mt-8">
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
        </CardContent>
      </Card>

      {/* Claim Pending Withdrawal Modal */}
      {selectedTransaction && (
        <ClaimWithdrawModal
          isOpen={selectedTransaction !== null}
          onClose={() => {
            setSelectedTransaction(null);
            refetchTransactions();
          }}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
