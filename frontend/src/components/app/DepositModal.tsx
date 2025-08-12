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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Token } from "@/types";
import { Info } from "lucide-react";
import { Pool } from "@/types/graph";
import { computeExpectedAPY, computePoolShareValue } from "@/lib/typeslibs";
import { formatLargeNumber } from "@/lib/utils";
import { dataService } from "@/services/dataService";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { erc20Abi, formatUnits, parseUnits, zeroAddress } from "viem";
import { poolAbi } from "@/abis";
import { toast } from "sonner";

const INITIAL_LP = 1000;

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: Pool;
}

const DepositModal = ({ isOpen, onClose, pool }: DepositModalProps) => {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(
    dataService.getToken(pool.asset)
  );

  const shareValue = computePoolShareValue(pool);
  const expectedAPY = computeExpectedAPY(pool);
  const estimatedShares = amount
    ? shareValue == 0
      ? INITIAL_LP
      : Math.floor(parseFloat(amount) / shareValue)
    : 0;
  const balance = useBalance({
    address,
    token:
      selectedToken?.address == zeroAddress
        ? undefined
        : selectedToken?.address,
  });

  const {
    writeContractAsync: approveAsync,
    data: approveHash,
    isPending,
  } = useWriteContract();
  const {
    writeContractAsync: depositAsync,
    data: depositHash,
    isPending: isPending2,
  } = useWriteContract();

  const { isPending: isApprovePending, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
      confirmations: 2,
    });

  const {
    isPending: isDepositPending,
    isSuccess: isDepositSuccess,
    isError: isDepositError,
  } = useWaitForTransactionReceipt({
    hash: depositHash,
    confirmations: 4,
  });

  useEffect(() => {
    if (isApproveSuccess) {
      toast.success("Token approved successfully!");

      depositAsync({
        address: pool.contractAddress,
        abi: poolAbi,
        functionName: "deposit",
        args: [parseUnits(amount, selectedToken?.decimals)],
        value:
          selectedToken?.address === zeroAddress
            ? parseUnits(amount, selectedToken?.decimals)
            : undefined,
        chain: undefined,
        account: address,
      });
    }
  }, [isApproveSuccess]);

  useEffect(() => {
    if (isDepositSuccess) {
      onClose();
      setAmount("");
      setSelectedToken(null);
      toast.success("Deposit successful!");
    } else if (isDepositError) {
      toast.error("Deposit failed");
    }
  }, [isDepositSuccess, isDepositError]);

  const handleDeposit = async () => {
    if (!selectedToken || !amount) return;

    if (selectedToken?.address != zeroAddress) {
      approveAsync({
        address: pool.asset,
        abi: erc20Abi,
        functionName: "approve",
        args: [pool.id, parseUnits(amount, selectedToken?.decimals)],
        chain: undefined,
        account: address,
      });
    } else {
      depositAsync({
        address: pool.contractAddress,
        abi: poolAbi,
        functionName: "deposit",
        args: [parseUnits(amount, selectedToken?.decimals)],
        value:
          selectedToken?.address === zeroAddress
            ? parseUnits(amount, selectedToken?.decimals)
            : undefined,
        chain: undefined,
        account: address,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md neuro-card">
        <DialogHeader>
          <DialogTitle>Deposit to {pool.name}</DialogTitle>
          <DialogDescription>
            Purchase tokenized shares and start earning yield
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pool Info */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Expected APY
              </span>
              <span className="font-semibold text-success">{expectedAPY}%</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Share Token</span>
              <Badge variant="outline">{pool.symbol}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Share Unit Value
              </span>
              <span className="font-semibold">
                {formatLargeNumber(shareValue)} {selectedToken?.symbol}
              </span>
            </div>
          </div>

          {/* Token Selection */}
          <div className="space-y-2">
            <Label htmlFor="token">Select Deposit Token</Label>
            <Select
              onValueChange={(tokenSymbol) => {
                if (selectedToken?.symbol === tokenSymbol) {
                  setSelectedToken(selectedToken);
                }
              }}
              defaultValue={selectedToken?.symbol}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a token to deposit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  key={selectedToken?.symbol}
                  value={selectedToken?.symbol}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-muted">
                      <img
                        src={selectedToken?.image}
                        alt={selectedToken?.symbol}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="font-medium">{selectedToken?.symbol}</div>
                      <div className="text-xs text-muted-foreground ">
                        Balance:{" "}
                        {formatLargeNumber(
                          Number(
                            formatUnits(
                              balance?.data?.value ?? 0n,
                              balance?.data?.decimals ?? 18
                            )
                          )
                        )}{" "}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Deposit Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {selectedToken && amount && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Available:{" "}
                  {formatLargeNumber(
                    Number(
                      formatUnits(
                        balance?.data?.value ?? 0n,
                        balance?.data?.decimals ?? 18
                      )
                    )
                  )}{" "}
                  {selectedToken?.symbol}
                </span>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() =>
                    setAmount(
                      (
                        formatUnits(
                          balance?.data?.value ?? 0n,
                          balance?.data?.decimals ?? 18
                        ) || 0
                      ).toString()
                    )
                  }
                >
                  Max
                </Button>
              </div>
            )}
          </div>

          {/* Estimate */}
          {amount && selectedToken && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900 mb-1">
                    Transaction Summary
                  </div>
                  <div className="text-blue-700">
                    You will receive approximately{" "}
                    <strong>{estimatedShares.toLocaleString()}</strong>{" "}
                    {pool.symbol} shares
                  </div>
                  <div className="text-blue-600 text-xs mt-1">
                    Based on current share price of{" "}
                    {formatLargeNumber(shareValue)} {selectedToken?.symbol}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={
                isPending ||
                isPending2 ||
                !selectedToken ||
                !amount ||
                parseFloat(amount) <= 0 ||
                (approveHash && isApprovePending) ||
                (depositHash && isDepositPending)
              }
              className="flex-1"
            >
              {(approveHash && isApprovePending) ||
              (depositHash && isDepositPending)
                ? isApprovePending
                  ? "Approving..."
                  : "Depositing..."
                : "Deposit & Earn"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
