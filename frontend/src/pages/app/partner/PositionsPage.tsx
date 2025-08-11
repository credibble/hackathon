import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CreditCard, AlertTriangle, DollarSign, ExternalLink } from "lucide-react";
import RepayModal from "@/components/app/RepayModal";
import { Shimmer, ShimmerCard } from "@/components/ui/shimmer";
import { useNavigate } from "react-router-dom";

const PositionsPage = () => {
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  // Mock loan positions data
  const loanPositions = [
    {
      id: "loan-1",
      tokenId: "LOAN-001",
      poolId: "pool-1",
      poolName: "Agricultural Finance Pool",
      principalAmount: 50000,
      currentBalance: 48500,
      interestRate: 12.5,
      interestOwed: 2100,
      borrowDate: "2024-01-15",
      status: "active",
      nextPaymentAmount: 8500,
    },
    {
      id: "loan-2",
      tokenId: "LOAN-002",
      poolId: "pool-2",
      poolName: "Small Business Growth Fund",
      principalAmount: 75000,
      currentBalance: 71200,
      interestRate: 10.8,
      interestOwed: 1850,
      borrowDate: "2023-11-20",
      status: "active",
      nextPaymentAmount: 12800,
    },
    {
      id: "loan-3",
      tokenId: "LOAN-003",
      poolId: "pool-3",
      poolName: "Micro Enterprise Support",
      principalAmount: 25000,
      currentBalance: 8500,
      interestRate: 15.2,
      interestOwed: 650,
      borrowDate: "2023-08-10",
      status: "overdue",
      nextPaymentAmount: 9150,
    },
  ];

  const totalBorrowed = loanPositions.reduce((sum, loan) => sum + loan.currentBalance, 0);
  const totalInterestOwed = loanPositions.reduce((sum, loan) => sum + loan.interestOwed, 0);
  const activeLoanCount = loanPositions.filter(loan => loan.status === 'active').length;

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your active borrowing positions and track payment schedules</p>
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your active borrowing positions and track payment schedules</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{totalBorrowed.toLocaleString()} <span className="text-base sm:text-lg text-muted-foreground">USDC</span></div>
            <p className="text-xs text-muted-foreground">Across {activeLoanCount} active loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interest Owed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{totalInterestOwed.toLocaleString()} <span className="text-base sm:text-lg text-muted-foreground">USDC</span></div>
            <p className="text-xs text-muted-foreground">Accrued interest charges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{activeLoanCount}</div>
            <p className="text-xs text-muted-foreground">Active loan positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Positions */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Active Positions</h2>
        <div className="space-y-4">
          {loanPositions.map((loan) => (
            <Card key={loan.id} className="hover:shadow-lg transition-all duration-300 relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href={`https://etherscan.io/token/${loan.tokenId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 flex items-center gap-1 hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    <span className="text-xs font-medium">#{loan.id.split('-')[1] || '1'}</span>
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
                    <CardTitle className="text-lg">{loan.poolName}</CardTitle>
                  </div>
                  <Badge className={`${
                    loan.status === 'active' ? 'bg-green-100 text-green-800' :
                    loan.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {loan.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Principal</span>
                    <div className="font-semibold">{loan.principalAmount.toLocaleString()} USDC</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Outstanding</span>
                    <div className="font-semibold text-orange-600">{loan.currentBalance.toLocaleString()} USDC</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Interest Rate</span>
                    <div className="font-semibold">{loan.interestRate}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Interest Owed</div>
                    <div className="text-base sm:text-lg font-bold text-red-600">{loan.interestOwed.toLocaleString()} USDC</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    className="flex-1 h-10 sm:h-auto"
                    size="sm"
                    onClick={() => {
                      setSelectedLoan(loan);
                      setIsRepayModalOpen(true);
                    }}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Repay
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-10 sm:h-auto" 
                    size="sm"
                    onClick={() => navigate(`/app/pools/${loan.poolId}`)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Go to Pool
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Repay Modal */}
      {selectedLoan && (
        <RepayModal
          isOpen={isRepayModalOpen}
          onClose={() => setIsRepayModalOpen(false)}
          poolName={selectedLoan.poolName}
          outstandingAmount={selectedLoan.currentBalance}
          interestOwed={selectedLoan.interestOwed}
        />
      )}
    </div>
  );
};

export default PositionsPage;