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
import { TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Pool, Share } from "@/types/graph";
import { erc721Abi, formatEther, Hex, parseUnits } from "viem";
import { dataService } from "@/services/dataService";
import { computePoolShareValue } from "@/lib/typeslibs";
import { formatLargeNumber } from "@/lib/utils";
import { Token } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { toast as toastComponent } from "sonner";
import { marketAbi, marketAddress } from "@/abis";

interface SellSharesModalProps {
  isOpen: boolean;
  onClose: () => void;
  share: Share;
  pool: Pool;
}

const SellSharesModal = ({
  isOpen,
  onClose,
  share,
  pool,
}: SellSharesModalProps) => {
  const [sellPrice, setSellAmount] = useState("");
  const { toast } = useToast();
  const { address } = useAccount();

  const [selectedToken, setSelectedToken] = useState<Token | undefined>(
    dataService.getToken(pool.asset)
  );

  const currentValue = computePoolShareValue(pool);
  const maxAmount = Number(formatEther(share.amount));
  const token = dataService.getToken(pool.asset);
  const tokens = dataService.getTokens();

  const {
    writeContractAsync: approveAsync,
    data: approveHash,
    isPending,
  } = useWriteContract();
  const {
    writeContractAsync: sellAsync,
    data: sellHash,
    isPending: isPending2,
  } = useWriteContract();

  const { isPending: isApprovePending, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
      confirmations: 2,
    });

  const {
    isPending: isSellingPending,
    isSuccess: isSellingSuccess,
    isError: isSellingError,
  } = useWaitForTransactionReceipt({
    hash: sellHash,
    confirmations: 4,
  });

  useEffect(() => {
    if (isApproveSuccess) {
      toastComponent.success("Token approved successfully!");

      const expire = 7 * 86400;

      sellAsync({
        address: marketAddress,
        abi: marketAbi,
        functionName: "list",
        args: [
          share.contract.address,
          BigInt(share.tokenId),
          selectedToken?.address,
          parseUnits(sellPrice, selectedToken?.decimals),
          BigInt(expire.toFixed(0)),
        ],
        chain: undefined,
        account: address,
      });
    }
  }, [isApproveSuccess]);

  useEffect(() => {
    if (isSellingSuccess) {
      toast({
        title: "Shares Sold!",
        description: `Successfully sold ${formatLargeNumber(
          Number(formatEther(share.amount))
        )} shares for $${formatLargeNumber(Number(sellPrice))} ${
          selectedToken?.symbol
        }`,
      });
      onClose();
    } else if (isSellingError) {
      toastComponent.error("Selling failed");
    }
  }, [isSellingSuccess, isSellingError]);

  const handleSell = async () => {
    if (
      !sellPrice ||
      parseFloat(sellPrice) <= 0 ||
      parseFloat(sellPrice) > maxAmount
    ) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to sell",
        variant: "destructive",
      });
      return;
    }

    approveAsync({
      address: share.contract.address,
      abi: erc721Abi,
      functionName: "approve",
      args: [marketAddress, BigInt(share.tokenId)],
      chain: undefined,
      account: address,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md neuro-card">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <TrendingDown className="mr-2 h-5 w-5 text-orange-500" />
            Sell Shares
          </DialogTitle>
          <DialogDescription>
            Sell your shares from {pool.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share Information */}
          <div className="neuro-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pool</span>
              <Badge variant="outline">{pool.name}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Available Shares
              </span>
              <span className="font-medium">
                {formatLargeNumber(maxAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Unit Price</span>
              <span className="font-medium">
                {formatLargeNumber(Number(currentValue))} {token.symbol}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Value</span>
              <span className="font-medium">
                {formatLargeNumber(Number(maxAmount * currentValue))}{" "}
                {token.symbol}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Token ID</span>
              <span className="font-medium">#{share.tokenId}</span>
            </div>
          </div>

          {/* Token Selection */}
          <div className="space-y-2">
            <Label htmlFor="token">Select Token</Label>
            <Select
              onValueChange={(tokenAddress) => {
                setSelectedToken(dataService.getToken(tokenAddress as Hex));
              }}
              value={selectedToken?.address}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a token to receive" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => {
                  return (
                    <SelectItem key={token?.symbol} value={token?.address}>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-muted">
                          <img
                            src={token.image}
                            alt={token.symbol}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{token?.symbol}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Sell Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="sellPrice">Price</Label>
            <div className="relative">
              <Input
                id="sellPrice"
                type="number"
                placeholder="0.00"
                value={sellPrice}
                onChange={(e) => setSellAmount(e.target.value)}
                className="pr-16"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 text-xs"
                onClick={() => setSellAmount(maxAmount.toString())}
              >
                Max
              </Button>
            </div>
          </div>

          {/* Transaction Summary */}
          {sellPrice && parseFloat(sellPrice) > 0 && (
            <div className="neuro-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  You will receive
                </span>
                <div className="flex items-center">
                  <span className="font-bold text-success">
                    {formatLargeNumber(Number(sellPrice))}{" "}
                    {selectedToken?.symbol}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Gas Fee Estimate */}
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <span>Credibble fee: ~0.0 {selectedToken?.symbol}</span>
          </div>

          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <span>Expires in 7 days</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSell}
              disabled={
                isPending ||
                isPending2 ||
                !selectedToken ||
                !sellPrice ||
                parseFloat(sellPrice) <= 0 ||
                (approveHash && isApprovePending) ||
                (sellHash && isSellingPending)
              }
              className="flex-1"
              variant="destructive"
            >
              {(approveHash && isApprovePending) ||
              (sellHash && isSellingPending)
                ? isApprovePending
                  ? "Approving..."
                  : "Listing..."
                : "List Shares"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellSharesModal;
