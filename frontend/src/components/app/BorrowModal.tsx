import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { DollarSign } from "lucide-react";
import { Pool } from "@/types/graph";
import { useCreditRequirementRate } from "@/hooks/useBorrowers";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { formatLargeNumber } from "@/lib/utils";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { poolAbi } from "@/abis";
import { dataService } from "@/services/dataService";
import { toast as toastComponent } from "sonner";

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: Pool;
  availableCredits?: number;
}

const BorrowModal = ({
  isOpen,
  onClose,
  pool,
  availableCredits,
}: BorrowModalProps) => {
  const [borrowAmount, setBorrowAmount] = useState("");

  const { toast } = useToast();
  const { address } = useAccount();

  const token = dataService.getToken(pool.asset);

  const { data: creditRequirementRate } = useCreditRequirementRate(pool.asset);
  const rate = parseFloat(
    formatEther(creditRequirementRate?.data ?? BigInt(0))
  );
  const interestRate = Number(pool.borrowAPY / 10_000);

  const creditsRequired = borrowAmount ? parseFloat(borrowAmount) * rate : 0;
  const hasEnoughCredits = creditsRequired <= availableCredits;
  const maxBorrowAmount = availableCredits / rate;

  const { writeContractAsync: borrowAsync, data: borrowHash } =
    useWriteContract();

  const {
    isPending: isBorrowPending,
    isSuccess: isBorrowSuccess,
    isError: isBorrowError,
  } = useWaitForTransactionReceipt({
    hash: borrowHash,
    confirmations: 4,
  });

  useEffect(() => {
    if (isBorrowSuccess) {
      toast({
        title: "Borrow request submitted",
        description: `Successfully borrowed $${borrowAmount.toLocaleString()} from ${
          pool.name
        }`,
      });
      setBorrowAmount("");
      onClose();
    } else if (isBorrowError) {
      toastComponent.error("Borrow failed");
    }
  }, [isBorrowSuccess, isBorrowError]);

  const handleBorrow = () => {
    const amount = parseFloat(borrowAmount);

    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid borrow amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > maxBorrowAmount) {
      toast({
        title: "Amount too high",
        description: `Maximum borrow amount is $${maxBorrowAmount.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    if (!hasEnoughCredits) {
      toast({
        title: "Insufficient credits",
        description: `You need ${creditsRequired.toFixed(
          1
        )} credits but only have ${availableCredits} available`,
        variant: "destructive",
      });
      return;
    }

    borrowAsync({
      address: pool.id,
      abi: poolAbi,
      functionName: "borrow",
      args: [parseUnits(borrowAmount, token?.decimals)],
      chain: undefined,
      account: address,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Borrow from {pool.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <Label className="text-sm text-muted-foreground">
                Interest Rate
              </Label>
              <div className="text-lg font-semibold text-primary">
                {interestRate}%
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Max Borrow
              </Label>
              <div className="text-lg font-semibold">
                {formatLargeNumber(maxBorrowAmount)}{" "}
                <span className="text-sm text-muted-foreground">
                  {token.symbol}
                </span>
              </div>
            </div>
          </div>

          {/* Credit Information */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div>
              <Label className="text-sm text-muted-foreground">
                Available Credits
              </Label>
              <div className="text-lg font-semibold text-blue-600">
                {formatLargeNumber(availableCredits)}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Credit Rate
              </Label>
              <div className="text-lg font-semibold">
                {rate}{" "}
                <span className="text-sm text-muted-foreground">
                  per {token.symbol}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrowAmount">Borrow Amount ({token.symbol})</Label>
            <Input
              id="borrowAmount"
              type="number"
              placeholder="Enter amount to borrow"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
            />
          </div>

          {borrowAmount && (
            <div
              className={`p-4 rounded-lg ${
                !hasEnoughCredits
                  ? "bg-red-50 dark:bg-red-900/20"
                  : "bg-green-50 dark:bg-green-900/20"
              }`}
            >
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Borrow Amount:</span>
                  <span className="font-semibold">
                    {parseFloat(borrowAmount).toLocaleString()}{" "}
                    <span className="text-xs text-muted-foreground">
                      {token.symbol}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Credits Required:</span>
                  <span
                    className={`font-semibold ${
                      !hasEnoughCredits ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {creditsRequired.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Credits Remaining:</span>
                  <span
                    className={`font-semibold ${
                      !hasEnoughCredits ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {(availableCredits - creditsRequired).toFixed(1)}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-semibold">{interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Interest:</span>
                  <span className="font-semibold text-orange-600">
                    {((parseFloat(borrowAmount) * interestRate) / 12).toFixed(
                      2
                    )}{" "}
                    <span className="text-xs text-muted-foreground">
                      {token.symbol}
                    </span>
                  </span>
                </div>
                {!hasEnoughCredits && (
                  <div className="text-red-600 text-xs mt-2 font-medium">
                    ⚠️ Insufficient credits for this borrow amount
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleBorrow}
              className="flex-1"
              disabled={
                !borrowAmount ||
                !hasEnoughCredits ||
                parseFloat(borrowAmount) <= 0 ||
                (borrowHash && isBorrowPending)
              }
            >
              {borrowHash && isBorrowPending ? "Borrowing..." : "Borrow"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowModal;
