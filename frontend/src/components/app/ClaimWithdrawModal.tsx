import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Trophy } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Transaction } from "@/types/graph";
import { formatLargeNumber } from "@/lib/utils";
import { formatEther, formatUnits } from "viem";
import { dataService } from "@/services/dataService";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { toast as toastComponent } from "sonner";
import { poolAbi } from "@/abis";

interface ClaimWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

const ClaimWithdrawModal = ({
  isOpen,
  onClose,
  transaction,
}: ClaimWithdrawModalProps) => {
  const { toast } = useToast();
  const { address } = useAccount();

  const claimAmount = formatEther(transaction.amount);
  const isClaimable =
    Date.now() / 1000 >= transaction.timestamp + transaction.pool.withdrawDelay;
  const claimTime =
    Number(transaction.timestamp) + Number(transaction.pool.withdrawDelay);

  const {
    writeContractAsync: claimAsync,
    data: claimHash,
    isPending,
  } = useWriteContract();
  const {
    writeContractAsync: cancelAsync,
    data: cancelHash,
    isPending: isPending2,
  } = useWriteContract();

  const {
    isPending: isClaimPending,
    isSuccess: isClaimSuccess,
    isError: isClaimError,
  } = useWaitForTransactionReceipt({
    hash: claimHash,
    confirmations: 4,
  });
  const {
    isPending: isCancelPending,
    isSuccess: isCancelSuccess,
    isError: isCancelError,
  } = useWaitForTransactionReceipt({
    hash: cancelHash,
    confirmations: 4,
  });

  useEffect(() => {
    if (isClaimSuccess) {
      toast({
        title: "Withdrawal Claimed!",
        description: `Successfully claimed withdrawal of ${formatLargeNumber(
          Number(claimAmount)
        )} ${transaction?.pool?.symbol} from ${transaction.pool?.name}`,
      });

      onClose();
    } else if (isClaimError) {
      toastComponent.error("Withdrawal claim failed");
    }
  }, [isClaimSuccess, isClaimError]);

  useEffect(() => {
    if (isCancelSuccess) {
      toast({
        title: "Withdrawal Cancelled!",
        description: `Successfully cancelled withdrawal of ${formatLargeNumber(
          Number(claimAmount)
        )} ${transaction?.pool?.symbol} from ${transaction.pool?.name}`,
      });

      onClose();
    } else if (isCancelError) {
      toastComponent.error("Withdrawal cancel failed");
    }
  }, [isCancelSuccess, isCancelError]);

  const handleClaim = async () => {
    claimAsync({
      address: transaction.pool.id,
      abi: poolAbi,
      functionName: "claimWithdraw",
      args: [BigInt(transaction.tokenId)],
      chain: undefined,
      account: address,
    });
  };

  const handleCancel = async () => {
    cancelAsync({
      address: transaction.pool.id,
      abi: poolAbi,
      functionName: "cancelWithdraw",
      args: [BigInt(transaction.tokenId)],
      chain: undefined,
      account: address,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md neuro-card">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-success" />
            Claim Pending Withdrawal
          </DialogTitle>
          <DialogDescription>
            Claim your pending withdrawal from {transaction?.pool?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Reward Information */}
          <div className="neuro-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pool</span>
              <Badge variant="outline">{transaction?.pool?.name}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Withdrawal Amount
              </span>
              <div className="flex items-center">
                <span className="text-lg font-bold text-success">
                  {formatLargeNumber(Number(claimAmount))}{" "}
                  {transaction?.pool?.symbol}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Token</span>
              <span className="font-medium">{transaction?.pool?.symbol}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Claimable on
              </span>
              <span className="font-medium">
                {new Date(claimTime * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Gas Fee Estimate */}
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <span>Credibblr fee: ~0.0 {transaction?.pool?.symbol}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isPending2 || (cancelHash && isCancelPending)}
              className="flex-1"
            >
              {cancelHash && isCancelPending ? "Cancelling..." : "Cancel"}
            </Button>
            <Button
              onClick={handleClaim}
              disabled={
                isPending || !isClaimable || (claimHash && isClaimPending)
              }
              className="flex-1"
            >
              {claimHash && isClaimPending ? "Claiming..." : "Claim Withdrawal"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimWithdrawModal;
