import { useEffect, useMemo, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { parseUnits } from "viem";
import { coreTestnet2 } from "viem/chains";
import { dataService } from "@/services/dataService";

const ERC20_MINT_ABI = [
  {
    type: "function",
    name: "faucet",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

const MAX = 1000;

export default function FaucetPage() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const [amount, setAmount] = useState<string>("100");

  const token = dataService.getTokens()[0];

  useEffect(() => {
    document.title = `${token.symbol} Faucet | Credibble`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc)
      metaDesc.setAttribute(
        "content",
        `Request test ${token.symbol} tokens (Max 1000) on Hedera Testnet.`
      );
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical)
      canonical.setAttribute("href", `${window.location.origin}/app/faucet`);
    else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", `${window.location.origin}/app/faucet`);
      document.head.appendChild(link);
    }
  }, []);

  const parsedAmount = useMemo(() => {
    const n = Math.max(0, Math.min(MAX, Number(amount || 0)));
    try {
      return parseUnits(n.toString(), token.decimals);
    } catch {
      return 0n;
    }
  }, [amount]);

  const onRequest = async () => {
    if (!isConnected || !address) {
      toast.error(`Connect your wallet to request ${token.symbol}`);
      return;
    }
    if (Number(amount) <= 0) {
      toast.error("Enter an amount greater than 0");
      return;
    }
    if (Number(amount) > MAX) {
      setAmount(String(MAX));
    }

    try {
      const hash = await writeContractAsync({
        address: token.address,
        abi: ERC20_MINT_ABI,
        functionName: "faucet",
        args: [address as `0x${string}`, parsedAmount],
        account: address as `0x${string}`,
        chain: coreTestnet2,
      });

      toast.info("Transaction submitted. Waiting for confirmation...", {
        duration: 3000,
      });

      toast.success(
        `Request sent! If the token supports public minting, your ${token.symbol} will arrive shortly.`
      );
    } catch (e) {
      console.error(e);
      toast.error(
        e?.shortMessage ||
          e?.message ||
          "Faucet transaction failed. Please try again later."
      );
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <article className="max-w-xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            {token.symbol} Faucet
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Request testnet {token.symbol} on Hedera Testnet. Maximum 1000{" "}
            {token.symbol} per request.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Request Tokens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Token</span>
                <span className="font-medium">{token.symbol} (6 decimals)</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-muted-foreground">Contract</span>
                <a
                  className="font-medium underline underline-offset-4"
                  href={`https://scan.test2.btcs.network/address/${token.address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {token.address.slice(0, 6)}...{token.address.slice(-4)}
                </a>
              </div>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm mb-2">
                Amount
              </label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={MAX}
                  step={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setAmount(String(MAX))}
                >
                  Max
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Maximum {MAX} {token.symbol} per request.
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={onRequest} disabled={!isConnected || isPending}>
                {isPending ? "Requesting..." : `Request ${token.symbol}`}
              </Button>
            </div>

            <aside className="text-xs text-muted-foreground">
              Note: This calls the token's mint function. If the contract does
              not allow public minting, the transaction will fail. In that case
              contact our support.
            </aside>
          </CardContent>
        </Card>
      </article>
    </main>
  );
}
