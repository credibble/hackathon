import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import ValuePropSection from "@/components/landing/ValuePropSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import LoanPoolCards from "@/components/landing/LoanPoolCards";
import ImpactStats from "@/components/landing/ImpactStats";
import PartnersSection from "@/components/landing/PartnersSection";
import FAQSection from "@/components/landing/FAQSection";
import LandingFooter from "@/components/landing/LandingFooter";

const LandingPage = () => {
  return (
    <div className="w-full">
      <LandingHeader />
      <HeroSection />
      <ValuePropSection />
      <FeaturesSection />
      <LoanPoolCards />
      <ImpactStats />
      <PartnersSection />
      <FAQSection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;