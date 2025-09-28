import { motion } from "framer-motion";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Wallet,
  Search,
  CreditCard,
  TrendingUp,
  RefreshCw,
  Shield,
  Users,
  FileText,
  CheckCircle,
  ArrowRight,
  DollarSign,
} from "lucide-react";

const HowItWorksPage = () => {
  const investorSteps = [
    {
      icon: Wallet,
      title: "Connect Wallet",
      description: "Connect your Web3 wallet to access the platform",
      details: "Support for MetaMask, WalletConnect, and other popular wallets",
    },
    {
      icon: Search,
      title: "Browse Loan Pools",
      description:
        "Explore active loan pools with different risk levels and terms",
      details: "Filter by APY, duration, geography, and impact focus",
    },
    {
      icon: CreditCard,
      title: "Deposit & Earn",
      description: "Deposit USDT, USDC, HBAR, or WBTC to receive NFT shares",
      details:
        "Get tokenized shares representing your portion of the loan pool",
    },
    {
      icon: TrendingUp,
      title: "Collect Yields",
      description:
        "Earn regular interest payments as borrowers repay their loans",
      details: "Monthly distributions automatically sent to your wallet",
    },
    {
      icon: RefreshCw,
      title: "Trade or Hold",
      description:
        "Hold until maturity or trade your NFT shares on our marketplace",
      details: "Exit early by selling to other investors at market price",
    },
  ];

  const partnerSteps = [
    {
      icon: FileText,
      title: "Apply & Verify",
      description:
        "Submit partnership application with organization credentials",
      details: "KYC verification and due diligence process",
    },
    {
      icon: Users,
      title: "Borrower Assessment",
      description: "Use your expertise to assess and approve loan applications",
      details: "Leverage local knowledge and existing borrower relationships",
    },
    {
      icon: DollarSign,
      title: "Pool Creation",
      description: "Create loan pools with specific terms and risk profiles",
      details: "Set APY targets, duration, and collateral requirements",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Provide guarantees and manage loan performance",
      details: "First-loss protection and active loan monitoring",
    },
    {
      icon: CheckCircle,
      title: "Reporting",
      description:
        "Maintain transparency with regular impact and performance reports",
      details: "Automated reporting on loan status and borrower outcomes",
    },
  ];

  const keyFeatures = [
    {
      title: "Transparent Loan Tracking",
      description: "Every loan is verified and progress tracked on-chain",
      benefit: "Full visibility into where your money goes",
    },
    {
      title: "NFT Share Ownership",
      description: "Receive tradeable NFTs representing loan pool shares",
      benefit: "Liquidity through marketplace trading",
    },
    {
      title: "Multi-Token Support",
      description: "Deposit with USDT, USDC, HBAR, or WBTC",
      benefit: "Flexibility to use your preferred assets",
    },
    {
      title: "Impact Measurement",
      description: "Track real-world impact of your investments",
      benefit: "See the difference your capital makes",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      <main>
        {/* Hero Section */}
        <section className="py-section bg-gradient-to-br from-background via-accent-light to-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge className="mb-6" variant="secondary">
                How It Works
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Bridge DeFi with Real-World Impact
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Understand how Credibble connects decentralized finance with
                transparent, real-world lending to create sustainable yields and
                measurable impact.
              </p>
              <Link to="/app">
                <Button size="lg" className="font-semibold">
                  Start Investing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* For Investors */}
        <section className="py-section bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                For Investors
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Earn sustainable yields while creating positive impact through
                real-world lending.
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              {investorSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center gap-8 md:gap-16 mb-16 last:mb-0`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <step.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {step.title}
                            </CardTitle>
                            <CardDescription className="text-base mt-1">
                              {step.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{step.details}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Step Visual */}
                  <div className="flex-1 flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* For Partners */}
        <section className="py-section bg-accent-light">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                For Partner Organizations
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Access global capital and scale your lending operations through
                transparent DeFi funding.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {partnerSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription className="text-base">
                        {step.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {step.details}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-section bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Key Platform Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built-in features that make real-world lending accessible,
                transparent, and profitable.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground font-medium">
                          {feature.benefit}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-section bg-gradient-to-br from-primary/5 via-background to-accent-light">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of investors already earning sustainable yields
                while creating positive impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/app">
                  <Button size="lg" className="w-full sm:w-auto font-semibold">
                    Launch App
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/partners">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto font-semibold"
                  >
                    Become a Partner
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default HowItWorksPage;
