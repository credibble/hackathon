import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { MarketListing } from "@/types/graph";
import { computePoolShareValue } from "@/lib/typeslibs";
import { dataService } from "@/services/dataService";
import { formatLargeNumber } from "@/lib/utils";
import { formatUnits, zeroAddress } from "viem";
import { useAccount, useBalance } from "wagmi";

interface BuySharesModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: MarketListing;
}

const BuySharesModal = ({ isOpen, onClose, listing }: BuySharesModalProps) => {
  const { address } = useAccount();
  const [buyAmount, setBuyAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const shareValue = computePoolShareValue(listing.shares.pool);
  const estimatedShares = parseFloat(buyAmount) / shareValue;
  const token = dataService.getToken(listing.shares.pool.asset);
  const paymentToken = dataService.getToken(listing.paymentToken);
  const balance = useBalance({
    address,
    token: token.address == zeroAddress ? undefined : token.address,
  });

  const handleBuy = async () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0 || !selectedToken) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid amount and select a token",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate buy transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Shares Purchased!",
      description: `Successfully purchased ${estimatedShares.toFixed(
        2
      )} shares with ${buyAmount} ${selectedToken}`,
    });

    setIsLoading(false);
    onClose();
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
                  shareValue *
                    Number(formatUnits(listing.share.amount, token.decimals))
                )}{" "}
                {token.symbol}
              </span>
            </div>
          </div>

          {/* Token Selection */}
          <div className="space-y-2">
            <Label htmlFor="token">Payment Token</Label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger className="neuro-button">
                <SelectValue placeholder="Select a token" />
              </SelectTrigger>
              <SelectContent className="neuro-card">
                <SelectItem value={paymentToken.symbol}>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-muted">
                      <img
                        src={paymentToken.image}
                        alt={paymentToken.symbol}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-medium">{paymentToken.symbol}</span>
                      <span className="text-xs text-muted-foreground ml-2">
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
            <Label htmlFor="buyAmount">Amount to Invest</Label>
            <div className="relative">
              <Input
                id="buyAmount"
                type="number"
                placeholder="0.00"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="pr-16"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 text-xs"
                onClick={() => {
                  if (
                    paymentToken &&
                    Number(
                      formatUnits(
                        balance?.data?.value ?? 0n,
                        balance?.data?.decimals ?? 18
                      )
                    )
                  ) {
                    setBuyAmount(
                      (
                        formatUnits(
                          balance?.data?.value ?? 0n,
                          balance?.data?.decimals ?? 18
                        ) || 0
                      ).toString()
                    );
                  }
                }}
                disabled={!paymentToken}
              >
                Max
              </Button>
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
                    {formatLargeNumber(estimatedShares)} shares
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Value</span>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-success" />
                  <span className="font-medium">
                    {formatLargeNumber(estimatedShares * shareValue)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Gas Fee Estimate */}
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <span>Estimated gas fee: ~$3.00</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleBuy}
              disabled={
                isLoading ||
                !buyAmount ||
                parseFloat(buyAmount) <= 0 ||
                !selectedToken
              }
              className="flex-1"
            >
              {isLoading ? "Purchasing..." : "Buy Shares"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuySharesModal;
