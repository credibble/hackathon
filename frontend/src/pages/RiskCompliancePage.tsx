import { motion } from "framer-motion";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { AlertTriangle, Shield, FileText, Scale } from "lucide-react";

const RiskCompliancePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      <main className="py-section">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Risk Disclosure & Compliance
              </h1>
              <p className="text-lg text-muted-foreground">
                Important information about risks and regulatory compliance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="glass-card p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Risk Disclosure
                </h3>
                <p className="text-muted-foreground text-sm">
                  Understanding investment risks and potential losses
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <Scale className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Compliance
                </h3>
                <p className="text-muted-foreground text-sm">
                  Regulatory framework and legal compliance
                </p>
              </div>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-12">
                {/* Risk Disclosure Section */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                    <h2 className="text-3xl font-bold text-foreground m-0">
                      Risk Disclosure
                    </h2>
                  </div>

                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-semibold text-warning mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Important Risk Warning
                    </h3>
                    <p className="text-foreground font-medium">
                      All investments in Credibble carry significant risks,
                      including the potential for total loss of invested
                      capital. Please read and understand all risks before
                      investing.
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-4">
                        Investment Risks
                      </h3>
                      <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                        <li>
                          <strong>Credit Risk:</strong> Borrowers may default on
                          their loans, resulting in partial or total loss of
                          invested funds
                        </li>
                        <li>
                          <strong>Liquidity Risk:</strong> Loan shares may not
                          be easily sold on the secondary market
                        </li>
                        <li>
                          <strong>Market Risk:</strong> The value of loan shares
                          may fluctuate based on market conditions
                        </li>
                        <li>
                          <strong>Currency Risk:</strong> Investments in
                          different currencies may be affected by exchange rate
                          fluctuations
                        </li>
                        <li>
                          <strong>Interest Rate Risk:</strong> Changes in
                          interest rates may affect loan performance and
                          valuations
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-4">
                        Technology Risks
                      </h3>
                      <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                        <li>
                          <strong>Smart Contract Risk:</strong> Bugs or
                          vulnerabilities in smart contracts could lead to loss
                          of funds
                        </li>
                        <li>
                          <strong>Blockchain Risk:</strong> Network congestion,
                          forks, or other blockchain issues may affect
                          transactions
                        </li>
                        <li>
                          <strong>Platform Risk:</strong> Technical failures or
                          security breaches could impact platform operations
                        </li>
                        <li>
                          <strong>Wallet Risk:</strong> Loss of private keys or
                          wallet compromise could result in permanent loss of
                          assets
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-4">
                        Regulatory Risks
                      </h3>
                      <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                        <li>
                          <strong>Legal Changes:</strong> Changes in
                          cryptocurrency or lending regulations may affect
                          platform operations
                        </li>
                        <li>
                          <strong>Compliance Risk:</strong> Regulatory
                          requirements may limit access or functionality
                        </li>
                        <li>
                          <strong>Taxation:</strong> Tax treatment of DeFi
                          investments may change or be unclear in your
                          jurisdiction
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Compliance Section */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Scale className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground m-0">
                      Compliance Framework
                    </h2>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-4">
                        Regulatory Approach
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Credibble operates within existing regulatory frameworks
                        and maintains compliance with applicable laws. Our
                        approach includes:
                      </p>
                      <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                        <li>
                          Adherence to anti-money laundering (AML) requirements
                        </li>
                        <li>
                          Know Your Customer (KYC) procedures where required
                        </li>
                        <li>
                          Compliance with securities regulations in applicable
                          jurisdictions
                        </li>
                        <li>Regular legal and compliance reviews</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-4">
                        Partner Due Diligence
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        All lending partners undergo comprehensive due
                        diligence:
                      </p>
                      <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                        <li>Financial stability and track record assessment</li>
                        <li>Legal entity verification and licensing checks</li>
                        <li>Operational and risk management evaluation</li>
                        <li>Ongoing monitoring and performance review</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-4">
                        Geographic Restrictions
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Access to Credibble may be restricted in certain
                        jurisdictions. Users are responsible for ensuring
                        compliance with local laws and regulations.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-4">
                        Audit and Security
                      </h3>
                      <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                        <li>
                          Regular smart contract audits by reputable security
                          firms
                        </li>
                        <li>
                          Continuous security monitoring and vulnerability
                          assessments
                        </li>
                        <li>Insurance coverage for certain platform risks</li>
                        <li>Transparent reporting and disclosures</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Contact Section */}
                <section className="border-t border-border pt-8">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    Questions or Concerns?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about risks or compliance matters,
                    please contact our legal team at
                    <a
                      href="mailto:credibble.xyz@gmail.com"
                      className="text-primary hover:underline ml-1"
                    >
                      credibble.xyz@gmail.com
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default RiskCompliancePage;
