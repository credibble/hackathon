import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/useToast";
import { Badge } from "@/components/ui/badge";
import { Shimmer } from "@/components/ui/shimmer";
import { useTheme } from "@/contexts/ThemeContext";
import { Monitor, Moon, Sun, LogOut } from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";

const SettingsPage = () => {
  const [isMainnet, setIsMainnet] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleNetworkToggle = (checked: boolean) => {
    setIsMainnet(checked);
    toast({
      title: `Switched to ${checked ? "Mainnet" : "Testnet"}`,
      description: `You are now connected to ${
        checked ? "Core DAO Mainnet" : "Core DAO Testnet 2"
      }`,
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribed(true);
    toast({
      title: "Subscribed successfully!",
      description: `You'll receive updates at ${email}`,
    });
  };

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
    setEmail("");
    toast({
      title: "Unsubscribed",
      description: "You have been unsubscribed from updates",
    });
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base">Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="flex flex-col items-center gap-2 h-auto p-4"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-5 w-5" />
                <span className="text-sm">Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="flex flex-col items-center gap-2 h-auto p-4"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-5 w-5" />
                <span className="text-sm">Dark</span>
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                className="flex flex-col items-center gap-2 h-auto p-4"
                onClick={() => setTheme("system")}
              >
                <Monitor className="h-5 w-5" />
                <span className="text-sm">System</span>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Choose your preferred theme or use system setting to automatically
              match your device
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {loading ? (
              <Shimmer className="h-5 w-32" />
            ) : (
              <>
                Network Settings
                <Badge variant={isMainnet ? "default" : "secondary"}>
                  {isMainnet ? "Mainnet" : "Testnet"}
                </Badge>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Shimmer className="h-4 w-24" />
                  <Shimmer className="h-3 w-48" />
                </div>
                <Shimmer className="h-6 w-12 rounded-full" />
              </div>
              <Shimmer className="h-16 w-full rounded-lg" />
              <Shimmer className="h-16 w-full rounded-lg" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="network-toggle" className="text-base">
                    Core DAO Network
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Switch between testnet and mainnet environments
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="network-toggle"
                    className="text-sm text-muted-foreground"
                  >
                    Testnet
                  </Label>
                  <Switch
                    id="network-toggle"
                    checked={isMainnet}
                    onCheckedChange={handleNetworkToggle}
                    disabled={true}
                  />
                  <Label
                    htmlFor="network-toggle"
                    className="text-sm text-muted-foreground"
                  >
                    Mainnet
                  </Label>
                </div>
              </div>

              <div className="rounded-lg border p-3 bg-muted/30">
                <div className="text-sm">
                  <div className="font-medium">Current Network:</div>
                  <div className="text-muted-foreground">
                    Core DAO Testnet 2 (Chain ID: 1114)
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-3 bg-yellow-50 dark:bg-yellow-900/20">
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <div className="font-medium">Mainnet Coming Soon</div>
                  <div className="text-yellow-700 dark:text-yellow-300">
                    Mainnet functionality will be available in a future update
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Wallet Settings */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="text-sm">
                <div className="font-medium">Connected Address:</div>
                <div className="text-muted-foreground font-mono break-all">
                  {address}
                </div>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              className="w-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Disconnect Wallet
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="text-sm text-muted-foreground">
                  Get notified about new loan pools, platform updates, and
                  important announcements
                </div>
              </div>
              <Button type="submit" className="w-full">
                Subscribe to Updates
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-green-800 dark:text-green-200">
                      Subscribed to Updates
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      {email}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    Active
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleUnsubscribe}
                className="w-full"
              >
                Unsubscribe from Updates
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
