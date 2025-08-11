import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/providers/Web3Provider";

// Landing Pages
import LandingPage from "./pages/LandingPage";
import PartnersPage from "./pages/PartnersPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import FAQPage from "./pages/FAQPage";
import SupportPage from "./pages/SupportPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import RiskCompliancePage from "./pages/RiskCompliancePage";
import CareersPage from "./pages/CareersPage";

// App Pages
import AppLayout from "./pages/app/AppLayout";
import LoanPoolsPage from "./pages/app/LoanPoolsPage";
import PoolDetailPage from "./pages/app/PoolDetailPage";
import DashboardPage from "./pages/app/DashboardPage";
import TransactionsPage from "./pages/app/TransactionsPage";
import MarketplacePage from "./pages/app/MarketplacePage";
import SettingsPage from "./pages/app/SettingsPage";
import BorrowPage from "./pages/app/partner/BorrowPage";
import PositionsPage from "./pages/app/partner/PositionsPage";
import FaucetPage from "./pages/app/FaucetPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/ui/cookie-consent";

const queryClient = new QueryClient();

const App = () => (
  <Web3Provider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Landing Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/risk-compliance" element={<RiskCompliancePage />} />
            <Route path="/careers" element={<CareersPage />} />

            {/* App Pages */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="loan-pools" element={<LoanPoolsPage />} />
              <Route path="loan-pools/:poolId" element={<PoolDetailPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="marketplace" element={<MarketplacePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="partner/borrow" element={<BorrowPage />} />
              <Route path="partner/positions" element={<PositionsPage />} />
              <Route path="faucet" element={<FaucetPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Web3Provider>
);

export default App;
