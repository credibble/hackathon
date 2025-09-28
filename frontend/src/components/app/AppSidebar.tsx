import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  History,
  ShoppingCart,
  Settings,
  Home,
  HelpCircle,
  Users,
  DollarSign,
  TrendingDown,
  ExternalLink,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/useMobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const menuItems = [
    { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
    { title: "Pools", url: "/app", icon: TrendingUp },
    { title: "Transactions", url: "/app/transactions", icon: History },
    { title: "Marketplace", url: "/app/marketplace", icon: ShoppingCart },
  ];

  const partnerItems = [
    { title: "Borrow", url: "/app/partner/borrow", icon: DollarSign },
    { title: "Positions", url: "/app/partner/positions", icon: TrendingDown },
  ];

  const linkItems = [
    { title: "Homepage", url: "/", icon: Home },
    { title: "FAQ", url: "/faq", icon: HelpCircle },
    { title: "Become a Partner", url: "/partners", icon: Users },
  ];

  const bottomItems = [
    { title: "Settings", url: "/app/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar
      className="border-r border-border w-48 md:w-52"
      collapsible={isMobile ? "offcanvas" : "icon"}
      side="left"
    >
      <SidebarContent className="flex flex-col h-full">
        {/* Logo and Trigger */}
        <div className="h-12 md:h-16 p-3 md:p-6 border-b border-border flex items-center justify-center">
          {state !== "collapsed" && !isMobile ? (
            <>
              <div className="flex items-center space-x-2 flex-1">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm md:text-lg">
                    C
                  </span>
                </div>
                <span className="text-lg md:text-xl font-semibold text-foreground">
                  Credibble
                </span>
              </div>
              {!isMobile && <SidebarTrigger className="shrink-0" />}
            </>
          ) : !isMobile ? (
            <SidebarTrigger className="shrink-0" />
          ) : (
            <div className="flex items-center space-x-2 flex-1">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  C
                </span>
              </div>
              <span className="text-lg font-semibold text-foreground">
                Credibble
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="flex-1">
          {(state !== "collapsed" || isMobile) && (
            <SidebarGroupLabel className="text-xs md:text-sm">
              Platform
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {state === "collapsed" && !isMobile ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.url)}
                            className="h-9 md:h-11 relative"
                          >
                            <NavLink
                              to={item.url}
                              className="flex items-center justify-center"
                            >
                              <item.icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                              {item.title === "Marketplace" && (
                                <div className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-r from-[#fd8d37] to-[#ff9211] rounded-full shadow-sm shine-effect"></div>
                              )}
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="text-xs">
                            {item.title}
                            {item.title === "Marketplace" && " (NEW)"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className="h-9 md:h-11"
                    >
                      <NavLink
                        to={item.url}
                        className="flex items-center w-full"
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        <item.icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <div className="ml-2 flex items-center relative">
                          <span className="text-sm md:text-base">
                            {item.title}
                          </span>
                          {item.title === "Marketplace" && (
                            <Badge
                              variant="secondary"
                              className="ml-1 text-[6px] md:text-[7px] px-1 py-0 h-3 font-bold bg-gradient-to-r from-[#fd8d37] to-[#ff9211] text-white border-0 shadow-sm shine-effect"
                            >
                              NEW
                            </Badge>
                          )}
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          {(state !== "collapsed" || isMobile) && (
            <SidebarGroupLabel className="text-xs md:text-sm">
              Partner
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {partnerItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {state === "collapsed" && !isMobile ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.url)}
                            className="h-9 md:h-11"
                          >
                            <NavLink
                              to={item.url}
                              className="flex items-center justify-center"
                            >
                              <item.icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="text-xs">{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className="h-9 md:h-11"
                    >
                      <NavLink
                        to={item.url}
                        className="flex items-center"
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        <item.icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <span className="ml-2 text-sm md:text-base">
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Links Section */}
        <SidebarGroup>
          {(state !== "collapsed" || isMobile) && (
            <SidebarGroupLabel className="text-xs md:text-sm">
              Links
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Faucet selector (mobile only) */}
              <SidebarMenuItem className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="h-9 md:h-11">
                      <ExternalLink className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                      <span className="ml-2 text-sm md:text-base">Faucet</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 z-50">
                    <DropdownMenuItem
                      onClick={() => {
                        navigate("/app/faucet");
                        if (isMobile) setOpenMobile(false);
                      }}
                    >
                      USDT Faucet
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        window.open(
                          "https://hashscan.io/testnet/faucet",
                          "_blank",
                          "noopener,noreferrer"
                        );
                        if (isMobile) setOpenMobile(false);
                      }}
                    >
                      HBAR Faucet (official)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>

              {linkItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {state === "collapsed" && !isMobile ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.url)}
                            className="h-9 md:h-11"
                          >
                            <NavLink
                              to={item.url}
                              className="flex items-center justify-center"
                            >
                              <item.icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="text-xs">{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className="h-9 md:h-11"
                    >
                      <NavLink
                        to={item.url}
                        className="flex items-center"
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        <item.icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <span className="ml-2 text-sm md:text-base">
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {state === "collapsed" && !isMobile ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.url)}
                            className="h-9 md:h-11"
                          >
                            <NavLink
                              to={item.url}
                              className="flex items-center justify-center"
                            >
                              <item.icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="text-xs">{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className="h-9 md:h-11"
                    >
                      <NavLink
                        to={item.url}
                        className="flex items-center"
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        <item.icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <span className="ml-2 text-sm md:text-base">
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
