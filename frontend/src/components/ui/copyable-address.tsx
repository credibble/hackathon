import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

interface CopyableAddressProps {
  address: string;
  label?: string;
  className?: string;
  showFullAddress?: boolean;
}

const CopyableAddress = ({
  address,
  label,
  className,
  showFullAddress = false,
}: CopyableAddressProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast({
        title: "Address copied!",
        description: "The address has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy address to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (addr: string) => {
    if (showFullAddress) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <span className="text-muted-foreground text-sm">{label}:</span>}
      <div className="flex items-center gap-1 bg-muted/50 rounded-md px-2 py-1">
        <a
          href={`ttps://scan.test2.btcs.network/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          <code className="text-sm font-mono">{formatAddress(address)}</code>
        </a>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default CopyableAddress;
