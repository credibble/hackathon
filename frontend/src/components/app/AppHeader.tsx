import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Menu,
  Wallet,
  LogOut,
  Settings,
  ExternalLink,
  Droplets,
  ChevronDown,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/useMobile";
import { useConnectWallet } from "@privy-io/react-auth";
import { useAccount, useDisconnect } from "wagmi";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
      console.log(wallet);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const formatAddress = (addr: string, isMobile = false) => {
    if (isMobile) {
      return `${addr.slice(0, 4)}...${addr.slice(-3)}`;
    }
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case "/app/dashboard":
        return "Dashboard";
      case "/app":
        return "Pools";
      case "/app/marketplace":
        return "Marketplace";
      case "/app/transactions":
        return "Transactions";
      case "/app/settings":
        return "Settings";
      case "/app/partner/borrow":
        return "Borrow Funds";
      case "/app/partner/positions":
        return "Loan Positions";
      default:
        if (path.startsWith("/app/pools/")) {
          return "Pool Details";
        }
        return "Dashboard";
    }
  };

  return (
    <header
      className="fixed top-0 right-0 z-50 h-12 md:h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border transition-all duration-200"
      style={{
        left: isMobile
          ? "0"
          : state === "collapsed"
          ? "var(--sidebar-width-icon)"
          : "var(--sidebar-width)",
      }}
    >
      <div className="max-w-[1248px] w-full flex items-center justify-between px-3 md:px-6 h-full mx-auto">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <SidebarTrigger>
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
          )}
          <h1 className="text-base md:text-2xl font-bold text-foreground truncate max-w-[120px] sm:max-w-none">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-1 md:space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2 md:px-3 hidden md:flex"
              >
                <Droplets className="w-4 h-4 sm:hidden" />
                <ExternalLink className="w-4 h-4 hidden sm:inline" />
                <span className="hidden sm:inline">Faucet</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 z-50">
              <DropdownMenuItem onClick={() => navigate("/app/faucet")}>
                USDT Faucet
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  window.open(
                    "https://scan.test2.btcs.network/faucet",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                CORE Faucet (external)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
          {address ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2">
                  <span className="hidden sm:inline">
                    {formatAddress(address, false)}
                  </span>
                  <span className="sm:hidden">
                    {formatAddress(address, true)}
                  </span>
                  <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/app/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => disconnect()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={connectWallet}
              className="flex items-center space-x-0 md:space-x-2 text-xs md:text-sm px-2 md:px-4 h-8 md:h-9"
            >
              <Wallet className="w-3 h-3 md:w-4 md:h-4 hidden sm:inline" />
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
