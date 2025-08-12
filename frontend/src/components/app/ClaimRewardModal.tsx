import { useState } from "react";
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

interface ClaimRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingRewards: number;
  poolName: string;
}

const ClaimRewardModal = ({
  isOpen,
  onClose,
  pendingRewards,
  poolName,
}: ClaimRewardModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClaim = async () => {
    setIsLoading(true);

    // Simulate claim transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Withdrawal Claimed!",
      description: `Successfully claimed withdrawal of $${pendingRewards.toFixed(
        2
      )} from ${poolName}`,
    });

    setIsLoading(false);
    onClose();
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
            Claim your pending withdrawal from {poolName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Reward Information */}
          <div className="neuro-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pool</span>
              <Badge variant="outline">{poolName}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Withdrawal Amount
              </span>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-success" />
                <span className="text-lg font-bold text-success">
                  {pendingRewards.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Token</span>
              <span className="font-medium">USDC</span>
            </div>
          </div>

          {/* Gas Fee Estimate */}
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <span>Estimated gas fee: ~$2.50</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleClaim}
              disabled={isLoading || pendingRewards <= 0}
              className="flex-1"
            >
              {isLoading ? "Claiming..." : "Claim Withdrawal"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimRewardModal;
