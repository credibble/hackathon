import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pool, Share } from "@/types/graph";
import { formatEther, parseEther } from "viem";
import { computePoolShareValue } from "@/lib/typeslibs";
import { formatLargeNumber } from "@/lib/utils";
import { dataService } from "@/services/dataService";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { poolAbi } from "@/abis";
import { toast as toastComponent } from "sonner";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  share: Share;
  pool: Pool;
}

const WithdrawModal = ({
  isOpen,
  onClose,
  share,
  pool,
}: WithdrawModalProps) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { toast } = useToast();
  const { address } = useAccount();

  const token = dataService.getToken(pool.asset);
  const currentValue = computePoolShareValue(pool);
  const maxWithdrawable = Number(formatEther(share.amount));
  const shareValue = (parseFloat(withdrawAmount) || 0) * currentValue;
  const outputAmount = shareValue * currentValue;
  const isLockPeriodOver =
    Date.now() > share.timestamp * 1000 + pool.lockPeriod;

  const {
    writeContractAsync: withdrawAsync,
    data: withdrawHash,
    isPending,
  } = useWriteContract();

  const {
    isPending: isWithdrawPending,
    isSuccess: isWithdrawSuccess,
    isError: isWithdrawError,
  } = useWaitForTransactionReceipt({
    hash: withdrawHash,
    confirmations: 4,
  });

  useEffect(() => {
    if (isWithdrawSuccess) {
      toast({
        title: "Withdrawal Initiated",
        description: `Withdrawing ${formatLargeNumber(
          shareValue
        )} shares from ${pool.name}. You'll receive the funds in ${
          pool.withdrawDelay / 86400
        } days.`,
      });
      onClose();
    } else if (isWithdrawError) {
      toastComponent.error("Withdrawal failed");
    }
  }, [isWithdrawSuccess, isWithdrawError]);

  const handleWithdraw = async () => {
    if (!withdrawAmount || shareValue <= 0 || shareValue > maxWithdrawable) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    withdrawAsync({
      address: pool.contractAddress,
      abi: poolAbi,
      functionName: "requestWithdraw",
      args: [BigInt(share.tokenId), parseEther(withdrawAmount)],
      chain: undefined,
      account: address,
    });
  };

  const setMaxAmount = () => {
    setWithdrawAmount(maxWithdrawable.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md neuro-card">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <TrendingDown className="mr-2 h-5 w-5 text-orange-600" />
            Withdraw Shares
          </DialogTitle>
          <DialogDescription>
            Withdraw your shares from {pool.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Alerts */}
          {!isLockPeriodOver && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Lock period not over:</strong> Withdrawing now will
                result in loss of interest rewards.
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>{pool.withdrawDelay / 86400}-day waiting period:</strong>{" "}
              Your withdrawal will be processed after a{" "}
              {pool.withdrawDelay / 86400}-day waiting period for security.
            </AlertDescription>
          </Alert>

          {/* Withdrawal Amount */}
          <div className="space-y-2">
            <Label htmlFor="withdrawAmount">Shares to Withdraw</Label>
            <div className="relative">
              <Input
                id="withdrawAmount"
                type="number"
                placeholder="0"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={maxWithdrawable}
                step="0.1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2"
                onClick={setMaxAmount}
              >
                MAX
              </Button>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Available: {maxWithdrawable.toLocaleString()} shares</span>
              <span>
                @ {formatLargeNumber(currentValue)} {token.symbol} per share
              </span>
            </div>
          </div>

          {/* Output Amount */}
          <div className="neuro-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pool</span>
              <Badge variant="outline">{pool.name}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Shares to Withdraw
              </span>
              <span className="font-medium">
                {formatLargeNumber(Number(withdrawAmount))}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Share Value</span>
              <div className="flex items-center">
                <span className="text-lg font-bold text-green-600">
                  {formatLargeNumber(outputAmount)}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  {token.symbol}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Withdraw delay
              </span>
              <span className="font-medium text-orange-600">
                {pool.withdrawDelay / 86400} days
              </span>
            </div>
          </div>

          {/* Gas Fee Estimate */}
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <span>Withdraw fee: ~0.0 {token.symbol}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={
                isPending ||
                !withdrawAmount ||
                shareValue <= 0 ||
                shareValue > maxWithdrawable ||
                (withdrawHash && isWithdrawPending)
              }
              className="flex-1"
            >
              {withdrawHash && isWithdrawPending
                ? "Processing..."
                : "Withdraw Shares"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
