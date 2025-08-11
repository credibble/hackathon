import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard } from "lucide-react";

interface RepayModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolName: string;
  outstandingAmount: number;
  interestOwed: number;
}

const RepayModal = ({ isOpen, onClose, poolName, outstandingAmount, interestOwed }: RepayModalProps) => {
  const [repayAmount, setRepayAmount] = useState("");
  const { toast } = useToast();

  const totalOwed = outstandingAmount + interestOwed;
  const creditRegain = Math.round(parseFloat(repayAmount) * 0.8); // 80% of repay amount becomes available credit

  const handleRepay = () => {
    const amount = parseFloat(repayAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid repay amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Repayment processed",
      description: `Successfully repaid $${amount.toLocaleString()} to ${poolName}`,
    });
    
    setRepayAmount("");
    onClose();
  };

  const handleFullRepay = () => {
    setRepayAmount(totalOwed.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Repay Loan - {poolName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <Label className="text-sm text-muted-foreground">Principal</Label>
              <div className="text-lg font-semibold">${outstandingAmount.toLocaleString()}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Interest Owed</Label>
              <div className="text-lg font-semibold text-orange-600">${interestOwed.toLocaleString()}</div>
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-center">
              <Label className="text-sm text-muted-foreground">Total Amount Owed</Label>
              <div className="text-2xl font-bold text-red-600">${totalOwed.toLocaleString()}</div>
            </div>
          </div>

          {repayAmount && parseFloat(repayAmount) > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-center">
                <Label className="text-sm text-muted-foreground">Credit Regain</Label>
                <div className="text-xl font-bold text-green-600">{creditRegain.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Available credit after repayment</p>
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
              Pay Full Amount (${totalOwed.toLocaleString()})
            </Button>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleRepay} className="flex-1">
              Repay
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepayModal;