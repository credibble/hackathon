import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, User, Copy, ExternalLink, Settings, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useTokens } from '@/hooks/useTokens';
import { useBalance } from '@/hooks/useBalance';
import { useNavigate } from 'react-router-dom';

export function ConnectButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: tokens } = useTokens();
  const { data: balances } = useBalance();
  const navigate = useNavigate();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const openExplorer = () => {
    if (address && chain?.blockExplorers?.default) {
      window.open(`${chain.blockExplorers.default.url}/address/${address}`, '_blank');
    }
  };

  if (!ready) {
    return (
      <Button disabled size="sm" variant="outline">
        <Wallet className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (!authenticated || !isConnected) {
    return (
      <Button onClick={login} size="sm" className="font-semibold">
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="font-semibold">
          <Wallet className="w-4 h-4 mr-2" />
          {address ? formatAddress(address) : 'Connected'}
          {chain && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {chain.name}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Wallet</DropdownMenuLabel>
        
        {user?.email && (
          <DropdownMenuItem>
            <User className="w-4 h-4 mr-2" />
            <span className="text-sm text-muted-foreground">{user.email.address}</span>
          </DropdownMenuItem>
        )}
        
        {address && (
          <>
            <DropdownMenuItem onClick={copyAddress}>
              <Copy className="w-4 h-4 mr-2" />
              <div className="flex flex-col">
                <span className="text-sm">{formatAddress(address)}</span>
                <span className="text-xs text-muted-foreground">Copy Address</span>
              </div>
            </DropdownMenuItem>
            {chain?.blockExplorers?.default && (
              <DropdownMenuItem onClick={openExplorer}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View on {chain.name} Explorer
              </DropdownMenuItem>
            )}
          </>
        )}
        
        <DropdownMenuSeparator />
        
        {/* Token Balances */}
        <DropdownMenuLabel className="flex items-center">
          <Coins className="w-4 h-4 mr-2" />
          Token Balances
        </DropdownMenuLabel>
        {tokens && tokens.length > 0 ? (
          <div className="max-h-32 overflow-y-auto">
            {tokens.map((token) => (
              <DropdownMenuItem key={token.symbol} className="justify-between">
                <div className="flex items-center">
                  <img 
                    src={token.image} 
                    alt={token.symbol} 
                    className="w-5 h-5 mr-2 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <span className="text-sm font-medium">{token.symbol}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {(balances?.[token.address] || 0).toLocaleString()}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <DropdownMenuItem disabled>
            <span className="text-sm text-muted-foreground">No tokens found</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {/* Settings */}
        <DropdownMenuItem onClick={() => navigate('/app/settings')}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Disconnect */}
        <DropdownMenuItem 
          onClick={() => {
            disconnect();
            logout();
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}