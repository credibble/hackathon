import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  HelpCircle,
  Shield,
  DollarSign,
  Users,
  TrendingUp,
  Coins,
  FileText,
  Info,
  MessageCircle,
} from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

const FAQPage = () => {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: HelpCircle,
      color: "bg-blue-100 text-blue-700",
      faqs: [
        {
          question: "What is Credibble and how does it work?",
          answer:
            "Credibble is a DeFi platform that tokenizes real-world loans through partnerships with schools, NGOs, and organizations. You can buy shares of tokenized loans where 1 onchain share equals $1 of real-world loan value. Our partners handle borrower identification and KYC, while you earn interest from actual loan repayments.",
        },
        {
          question: "How do I get started investing?",
          answer:
            "Connect your Web3 wallet, browse available loan opportunities from verified partner organizations, select loans that match your investment goals, and deposit supported tokens. You'll receive tokenized shares representing your portion of the real-world loan, with each share worth $1 of loan value.",
        },
        {
          question: "What do I need to start using Credibble?",
          answer:
            "You need a Web3 wallet (like MetaMask), cryptocurrency (USDT, USDC, CORE, or WBTC), and to be connected to the Core DAO network. Minimum investment varies by loan but typically starts at $10-50 equivalent, making it accessible for smaller investors.",
        },
        {
          question: "Is Credibble available in my country?",
          answer:
            "Credibble operates globally through local partner organizations. Availability depends on having verified partner institutions in your region and local cryptocurrency regulations. We're continuously expanding our partner network across emerging markets.",
        },
      ],
    },
    {
      title: "Investment & Returns",
      icon: TrendingUp,
      color: "bg-green-100 text-green-700",
      faqs: [
        {
          question: "What returns can I expect from my investments?",
          answer:
            "Returns depend on the specific loan terms negotiated by our partner organizations with borrowers. Typical annual returns range from 8-16% based on loan type and risk profile. Student loans often yield 8-12%, agricultural loans 10-14%, and small business loans 12-16%. You earn proportional interest based on your share ownership.",
        },
        {
          question: "How are my tokenized shares structured?",
          answer:
            "Each tokenized share represents $1 of real-world loan value. If you invest $500, you receive 500 shares of that specific loan. As borrowers make payments, you earn proportional returns. Shares are minted when loans are funded and burned when loans are fully repaid.",
        },
        {
          question: "What are the lock-up periods for my investment?",
          answer:
            "Deposits have locked durations that match the loan terms, typically 6-36 months. You can request early withdrawal anytime, but this results in interest forfeiture and a calculated waiting period (usually 7-30 days) to process the unlock and potential penalty fees.",
        },
        {
          question: "Can I trade my shares before the loan matures?",
          answer:
            "Yes, your tokenized loan shares can be traded on our secondary marketplace. Other investors can purchase your shares, allowing you to exit your position early without waiting periods or penalties, though market pricing may vary from face value.",
        },
      ],
    },
    {
      title: "Risk & Security",
      icon: Shield,
      color: "bg-red-100 text-red-700",
      faqs: [
        {
          question: "What are the main risks of tokenized loan investments?",
          answer:
            "Primary risks include borrower default, partner organization failure, early withdrawal penalties, and smart contract risks. We mitigate these through rigorous partner vetting, borrower KYC requirements, diversified loan portfolios, and comprehensive insurance coverage through partner organizations.",
        },
        {
          question: "How does the KYC process work for borrowers?",
          answer:
            "Our partner organizations (schools, NGOs, cooperatives) are responsible for identifying and KYC-ing borrowers in their local communities. They verify identity documents, assess creditworthiness, and ensure borrowers meet eligibility criteria before loans are approved and tokenized.",
        },
        {
          question: "What happens if I need early withdrawal?",
          answer:
            "Early withdrawal is possible but comes with consequences: you forfeit any accrued interest, pay a withdrawal processing fee, and must wait through a calculated waiting period (7-30 days) while the request is processed. The waiting period depends on loan terms and withdrawal amount.",
        },
        {
          question: "How do you ensure partner organization reliability?",
          answer:
            "Partner organizations undergo strict due diligence including legal verification, operational audits, financial assessments, and track record evaluation. We require established organizations with proven KYC capabilities and local community trust before approving partnerships.",
        },
        {
          question: "What protections exist against borrower defaults?",
          answer:
            "Partner organizations typically require collateral, guarantors, or community backing for loans. Many partners maintain default insurance funds and have local collection processes. Additionally, loan portfolios are diversified across multiple borrowers to minimize individual default impact.",
        },
      ],
    },
    {
      title: "Fees & Costs",
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-700",
      faqs: [
        {
          question: "What fees does Credibble charge?",
          answer:
            "We charge a small platform fee (typically 1-2%) on successful loan origination and a minimal transaction fee for share minting/burning. Early withdrawal incurs additional penalties (usually 2-5% of withdrawn amount). Partner organizations may have their own service fees which are disclosed upfront.",
        },
        {
          question: "Are there fees for early withdrawal?",
          answer:
            "Yes, early withdrawal includes: forfeited accrued interest, withdrawal processing fee (1-3%), and potential penalty fees (2-5% of principal). These fees compensate for the disruption to loan funding and administrative costs of processing early exits.",
        },
        {
          question: "How are fees calculated and deducted?",
          answer:
            "Platform fees are automatically deducted when shares are minted. Interest payments are distributed minus any applicable fees. Early withdrawal fees are calculated based on remaining loan term and withdrawal amount, clearly shown before confirming any early exit.",
        },
        {
          question: "Are there any hidden costs?",
          answer:
            "No hidden fees. All costs are transparently disclosed including: platform fees, partner organization fees, early withdrawal penalties, and blockchain gas fees. Fee structures are clearly outlined for each loan opportunity before you invest.",
        },
      ],
    },
    {
      title: "Trading & Liquidity",
      icon: Coins,
      color: "bg-purple-100 text-purple-700",
      faqs: [
        {
          question: "How does the secondary marketplace work?",
          answer:
            "Your tokenized loan shares can be listed and sold to other investors on our integrated marketplace. This provides liquidity without early withdrawal penalties. Buyers can purchase existing shares at market-determined prices, taking over your position in the loan.",
        },
        {
          question: "How is the value of my shares determined?",
          answer:
            "Each share represents $1 of loan principal plus accrued interest. Market pricing may vary based on remaining loan term, borrower performance, interest rates, and demand. Shares may trade at premium or discount to their underlying loan value.",
        },
        {
          question: "What happens when loans are fully repaid?",
          answer:
            "When borrowers complete their repayment schedule, your shares are automatically redeemed for their full value: original $1 principal plus all earned interest. Shares are burned from your wallet and you receive the final payment in your chosen token.",
        },
        {
          question: "Can I buy shares of existing loans?",
          answer:
            "Yes! You can purchase shares from other investors on our marketplace, allowing you to join ongoing loans at any stage. This lets you access loans with shorter remaining terms or potentially buy shares at discounted prices.",
        },
      ],
    },
    {
      title: "Impact & Partnerships",
      icon: Users,
      color: "bg-indigo-100 text-indigo-700",
      faqs: [
        {
          question: "How can I track the impact of my loan investments?",
          answer:
            "Your dashboard shows detailed information about the specific borrowers your shares have funded, including their loan purpose, progress updates, and repayment status. Partner organizations provide regular updates with photos and stories from the borrowers you've helped support.",
        },
        {
          question: "What types of organizations can become partners?",
          answer:
            "We partner with schools, NGOs, cooperatives, microfinance institutions, and community organizations that have established relationships with potential borrowers. Partners must demonstrate KYC capabilities, local community trust, and operational capacity to manage loan origination and collection.",
        },
        {
          question: "How do partner organizations benefit?",
          answer:
            "Partner organizations receive funding to expand their lending programs, platform fees for successful loan origination, and tools to better serve their communities. This allows them to scale their impact while maintaining their direct borrower relationships.",
        },
        {
          question: "What types of loans does Credibble support?",
          answer:
            "We support education loans (tuition, training programs), agricultural loans (equipment, seeds, seasonal funding), small business loans (working capital, equipment), and community development loans. All loans must demonstrate clear social impact and realistic repayment capacity.",
        },
      ],
    },
    {
      title: "Technical & Legal",
      icon: FileText,
      color: "bg-gray-100 text-gray-700",
      faqs: [
        {
          question: "What blockchain does Credibble use?",
          answer:
            "Credibble operates on Core DAO, a Bitcoin-secured blockchain that offers low fees, fast transactions, and strong security. This allows us to provide efficient DeFi services while maintaining the security of Bitcoin's network.",
        },
        {
          question: "Are my investments insured?",
          answer:
            "While we don't provide direct insurance, our partner institutions maintain guarantee funds and we work with insurance providers for additional coverage. Each pool's risk profile and protection mechanisms are clearly disclosed.",
        },
        {
          question: "What regulatory compliance does Credibble maintain?",
          answer:
            "We comply with relevant financial regulations in our operating jurisdictions and work with licensed partners. Our legal structure ensures compliance with securities laws while providing maximum accessibility to global investors.",
        },
        {
          question: "How do I report my earnings for tax purposes?",
          answer:
            "We provide transaction history and yield reports that you can use for tax reporting. However, we recommend consulting with a tax professional as cryptocurrency investment taxation varies by jurisdiction and individual circumstances.",
        },
        {
          question: "What happens if I lose access to my wallet?",
          answer:
            "Since Credibble is non-custodial, only you control your wallet and shares. If you lose wallet access, you'll need to recover it using your seed phrase or private keys. We cannot recover lost wallets, so please store your recovery information securely.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* Hero Section */}
      <section className="py-section bg-gradient-to-br from-background via-accent-light to-background">
        <div className="container  mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6">
                <Info className="w-4 h-4 mr-2" />
                Comprehensive Guide
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Everything you need to know about investing in real-world loans
                through Credibble's DeFi platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/app">
                  <Button size="lg" className="group">
                    Start Investing
                    <TrendingUp className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="lg">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers organized by topic to quickly locate the information
              you need.
            </p>
          </motion.div>

          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <category.icon className="w-6 h-6" />
                      </div>
                      {category.title}
                      <Badge variant="outline" className="ml-auto">
                        {category.faqs.length} questions
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible>
                      {category.faqs.map((faq, faqIndex) => (
                        <AccordionItem
                          key={faqIndex}
                          value={`${categoryIndex}-${faqIndex}`}
                          className="border-b border-border last:border-b-0"
                        >
                          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:text-primary transition-colors hover:bg-muted/30">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="mb-6">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Still have questions?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Can't find the answer you're looking for? Our support team is
                here to help.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                Contact Support
                <MessageCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Join Discord Community
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default FAQPage;
