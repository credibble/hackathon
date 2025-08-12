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
import { CreditCard } from "lucide-react";
import { Position } from "@/types/graph";
import {
  formatEther,
  formatUnits,
  parseUnits,
  zeroAddress,
  erc20Abi,
} from "viem";
import { useCreditRequirementRate } from "@/hooks/useBorrowers";
import { formatLargeNumber } from "@/lib/utils";
import { dataService } from "@/services/dataService";
import { toast as toastComponent } from "sonner";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { poolAbi } from "@/abis";

interface RepayModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: Position;
}

const RepayModal = ({ isOpen, onClose, position }: RepayModalProps) => {
  const [repayAmount, setRepayAmount] = useState("");
  const { toast } = useToast();
  const { address } = useAccount();

  const { data: creditRequirementRate } = useCreditRequirementRate(
    position.contract.pool.asset
  );
  const rate = parseFloat(
    formatEther(creditRequirementRate?.data ?? BigInt(0))
  );
  const token = dataService.getToken(position.contract.pool.asset);
  const [timeElapsed, setTimeElapsed] = useState<number>(
    Number(Math.ceil(Date.now() / 1000) - position.timestamp)
  );
  const [isMax, setIsMax] = useState(false);
  const [creditRegain, setCreditRegain] = useState(
    Math.round(parseFloat(repayAmount) * rate)
  );

  useEffect(() => {
    setInterval(() => {
      setTimeElapsed(Number(Math.ceil(Date.now() / 1000) - position.timestamp));
    }, 10_000);
  });

  const totalOwed =
    Number(formatUnits(position.amount, token.decimals)) +
    Number(formatUnits(position.dueAmount, token.decimals));

  const interestRate =
    Number(formatUnits(position.amount, token.decimals)) *
    Number(position.contract.pool.borrowAPY / 10_000);
  const interestOwed =
    Math.round(interestRate * timeElapsed) / Number(365 * 24 * 60 * 60);

  useEffect(() => {
    setCreditRegain(
      isMax
        ? (totalOwed + interestOwed) * rate
        : Math.round(parseFloat(repayAmount) * rate)
    );
  }, [repayAmount, rate, isMax, totalOwed, interestOwed]);

  const {
    writeContractAsync: approveAsync,
    data: approveHash,
    isPending,
  } = useWriteContract();
  const {
    writeContractAsync: depositAsync,
    data: repayHash,
    isPending: isPending2,
  } = useWriteContract();

  const { isPending: isApprovePending, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
      confirmations: 2,
    });

  const {
    isPending: isRepayPending,
    isSuccess: isRepaySuccess,
    isError: isRepayError,
  } = useWaitForTransactionReceipt({
    hash: repayHash,
    confirmations: 4,
  });

  useEffect(() => {
    if (isApproveSuccess) {
      toastComponent.success("Token approved successfully!");

      const amount = parseFloat(repayAmount);

      if (isMax) {
        depositAsync({
          address: position.contract.pool.contractAddress,
          abi: poolAbi,
          functionName: "repayAll",
          args: [BigInt(position.tokenId)],
          value:
            token?.address === zeroAddress
              ? parseUnits(repayAmount, token?.decimals)
              : undefined,
          chain: undefined,
          account: address,
        });
      } else {
        depositAsync({
          address: position.contract.pool.contractAddress,
          abi: poolAbi,
          functionName: "repay",
          args: [
            BigInt(position.tokenId),
            parseUnits(repayAmount, token?.decimals),
          ],
          value:
            token?.address === zeroAddress
              ? parseUnits(repayAmount, token?.decimals)
              : undefined,
          chain: undefined,
          account: address,
        });
      }
    }
  }, [isApproveSuccess]);

  useEffect(() => {
    const amount = parseFloat(repayAmount);

    if (isRepaySuccess) {
      toast({
        title: "Repayment processed",
        description: `Successfully repaid ${formatLargeNumber(amount)} ${
          token?.symbol
        } to ${position.contract.pool.name}`,
      });
      setRepayAmount("");
      onClose();
    } else if (isRepayError) {
      toastComponent.error("Repay failed");
    }
  }, [isRepaySuccess, isRepayError]);

  const handleRepay = () => {
    setIsMax(false);

    const amount = parseFloat(repayAmount);

    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid repay amount",
        variant: "destructive",
      });
      return;
    }

    approveAsync({
      address: position.contract.pool.asset,
      abi: erc20Abi,
      functionName: "approve",
      args: [
        position.contract.pool.id,
        parseUnits(repayAmount, token?.decimals),
      ],
      chain: undefined,
      account: address,
    });
  };

  const handleFullRepay = () => {
    setIsMax(true);

    const maxAmount = (totalOwed * 1.05 + interestOwed).toString();

    approveAsync({
      address: position.contract.pool.asset,
      abi: erc20Abi,
      functionName: "approve",
      args: [position.contract.pool.id, parseUnits(maxAmount, token?.decimals)],
      chain: undefined,
      account: address,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Repay Loan - {position.contract.pool.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <Label className="text-sm text-muted-foreground">
                Outstanding
              </Label>
              <div className="text-lg font-semibold">
                {formatLargeNumber(totalOwed)} {token.symbol}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Interest Owed
              </Label>
              <div className="text-lg font-semibold text-orange-600">
                {formatLargeNumber(interestOwed)} {token.symbol}
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-center">
              <Label className="text-sm text-muted-foreground">
                Total Amount Owed
              </Label>
              <div className="text-2xl font-bold text-red-600">
                {formatLargeNumber(Number(totalOwed) + Number(interestOwed))}
              </div>
            </div>
          </div>

          {repayAmount && parseFloat(repayAmount) > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-center">
                <Label className="text-sm text-muted-foreground">
                  Credit Regain
                </Label>
                <div className="text-xl font-bold text-green-600">
                  {creditRegain.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Available credit after repayment
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="repayAmount">Repay Amount (USD)</Label>
            <Input
              id="repayAmount"
              type="number"
              placeholder="Enter amount to repay"
              value={repayAmount}
              onChange={(e) => setRepayAmount(e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullRepay}
              className="w-full"
            >
              Pay Full Amount
            </Button>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleRepay}
              className="flex-1"
              disabled={
                isPending ||
                isPending2 ||
                (approveHash && isApprovePending) ||
                (repayHash && isRepayPending)
              }
            >
              {(approveHash && isApprovePending) ||
              (repayHash && isRepayPending)
                ? isApprovePending
                  ? "Approving..."
                  : "Repaying..."
                : "Repay"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepayModal;
