import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { MarketListing } from "@/types/graph";
import { computePoolShareValue } from "@/lib/typeslibs";
import { dataService } from "@/services/dataService";
import { formatLargeNumber } from "@/lib/utils";
import {
  formatEther,
  formatUnits,
  zeroAddress,
  erc20Abi,
  parseUnits,
} from "viem";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { marketAbi, marketAddress } from "@/abis";
import { Token } from "@/types";
import { toast as toastComponent } from "sonner";

interface BuySharesModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: MarketListing;
}

const BuySharesModal = ({ isOpen, onClose, listing }: BuySharesModalProps) => {
  const { address } = useAccount();
  const token = dataService.getToken(listing.shares.pool.asset);
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(
    dataService.getToken(listing.paymentToken)
  );
  const { toast } = useToast();

  const buyAmount = formatUnits(listing.price, selectedToken?.decimals);

  const shareValue = computePoolShareValue(listing.shares.pool);
  const balance = useBalance({
    address,
    token:
      selectedToken.address == zeroAddress ? undefined : selectedToken.address,
  });

  const {
    writeContractAsync: approveAsync,
    data: approveHash,
    isPending,
  } = useWriteContract();
  const {
    writeContractAsync: buyAsync,
    data: buyHash,
    isPending: isPending2,
  } = useWriteContract();

  const { isPending: isApprovePending, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
      confirmations: 2,
    });

  const {
    isPending: isBuyPending,
    isSuccess: isBuySuccess,
    isError: isBuyError,
  } = useWaitForTransactionReceipt({
    hash: buyHash,
    confirmations: 4,
  });

  useEffect(() => {
    if (isApproveSuccess) {
      toastComponent.success("Token approved successfully!");

      buyAsync({
        address: marketAddress,
        abi: marketAbi,
        functionName: "purchase",
        args: [BigInt(listing.id)],
        value:
          token?.address === zeroAddress
            ? parseUnits(buyAmount, selectedToken?.decimals)
            : undefined,
        chain: undefined,
        account: address,
      });
    }
  }, [isApproveSuccess]);

  useEffect(() => {
    if (isBuySuccess) {
      toast({
        title: "Shares Purchased!",
        description: `Successfully purchased ${formatLargeNumber(
          Number(formatEther(listing.share.amount))
        )} shares with ${buyAmount} ${selectedToken}`,
      });
      onClose();
    } else if (isBuyError) {
      toastComponent.error("Buy failed");
    }
  }, [isBuySuccess, isBuyError]);

  const handleBuy = async () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0 || !selectedToken) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid amount and select a token",
        variant: "destructive",
      });
      return;
    }

    if (selectedToken?.address != zeroAddress) {
      approveAsync({
        address: selectedToken?.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [marketAddress, parseUnits(buyAmount, selectedToken?.decimals)],
        chain: undefined,
        account: address,
      });
    } else {
      buyAsync({
        address: marketAddress,
        abi: marketAbi,
        functionName: "purchase",
        args: [BigInt(listing.id)],
        value:
          selectedToken?.address === zeroAddress
            ? parseUnits(buyAmount, selectedToken?.decimals)
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
          <DialogTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-success" />
            Buy Shares
          </DialogTitle>
          <DialogDescription>
            Purchase shares from {listing.shares.pool.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Pool Information */}
          <div className="neuro-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pool</span>
              <Badge variant="outline">{listing.shares.pool.name}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Share Value</span>
              <span className="font-medium">
                {formatLargeNumber(
                  shareValue * Number(formatEther(listing.share.amount))
                )}{" "}
                {token.symbol}
              </span>
            </div>
          </div>

          {/* Token Selection */}
          <div className="space-y-2">
            <Label htmlFor="token">Payment Token</Label>
            <Select
              onValueChange={(tokenSymbol) => {
                if (selectedToken?.symbol === tokenSymbol) {
                  setSelectedToken(selectedToken);
                }
              }}
              defaultValue={selectedToken?.symbol}
            >
              <SelectTrigger className="neuro-button">
                <SelectValue placeholder="Select a token" />
              </SelectTrigger>
              <SelectContent className="neuro-card">
                <SelectItem value={selectedToken?.symbol}>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-muted">
                      <img
                        src={selectedToken?.image}
                        alt={selectedToken?.symbol}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="font-medium">
                        {selectedToken?.symbol}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Balance:{" "}
                        {formatLargeNumber(
                          Number(
                            formatUnits(
                              balance?.data?.value ?? 0n,
                              balance?.data?.decimals ?? 18
                            )
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buy Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="buyAmount">Price ({selectedToken?.symbol})</Label>
            <div className="relative">
              <Input
                id="buyAmount"
                type="number"
                disabled
                placeholder="0.00"
                value={buyAmount}
                className="pr-16"
              />
            </div>
          </div>

          {/* Transaction Summary */}
          {buyAmount && parseFloat(buyAmount) > 0 && selectedToken && (
            <div className="neuro-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  You will receive
                </span>
                <div className="flex items-center">
                  <span className="font-bold text-success">
                    {formatLargeNumber(
                      Number(formatEther(listing.share.amount))
                    )}{" "}
                    shares
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Value</span>
                <div className="flex items-center">
                  <span className="font-medium">
                    {formatLargeNumber(
                      Number(formatEther(listing.share.amount)) * shareValue
                    )}{" "}
                    {token?.symbol}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Gas Fee Estimate */}
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <span>Credibble fee: ~0.00 {selectedToken?.symbol}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleBuy}
              disabled={
                isPending ||
                isPending2 ||
                !buyAmount ||
                parseFloat(buyAmount) <= 0 ||
                !selectedToken ||
                (approveHash && isApprovePending) ||
                (buyHash && isBuyPending)
              }
              className="flex-1"
            >
              {(approveHash && isApprovePending) || (buyHash && isBuyPending)
                ? isApprovePending
                  ? "Approving..."
                  : "Buying..."
                : "Buy Shares"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuySharesModal;
