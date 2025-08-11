import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app/AppSidebar";
import AppHeader from "@/components/app/AppHeader";
import { TermsOfUseModal } from "@/components/app/TermsOfUseModal";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    // Check if user has already agreed to terms
    const hasAgreedToTerms = localStorage.getItem("credibble-terms-agreed");
    if (!hasAgreedToTerms) {
      setShowTerms(true);
    }
  }, []);

  const handleTermsAccept = () => {
    localStorage.setItem("credibble-terms-agreed", "true");
    setShowTerms(false);
  };

  return (
    <SidebarProvider
      defaultOpen={!isMobile}
      style={
        {
          "--sidebar-width": "13rem",
          "--sidebar-width-mobile": "12rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <div className="min-h-screen flex w-full bg-background overflow-x-hidden">
        <AppSidebar />
        <div className="flex-1 min-h-screen min-w-0 relative">
          <AppHeader />
          <main
            className="p-3 md:p-6 bg-background flex justify-center overflow-x-hidden"
            style={{ paddingTop: "5rem" }}
          >
            <div className="max-w-[1200px] w-full min-w-0">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <TermsOfUseModal open={showTerms} onAccept={handleTermsAccept} />
    </SidebarProvider>
  );
};

export default AppLayout;
