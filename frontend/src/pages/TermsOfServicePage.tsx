import { motion } from "framer-motion";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

const TermsOfServicePage = () => {
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Terms of Service
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Last updated: August 2025
              </p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using the Credibble platform, you accept
                    and agree to be bound by the terms and provision of this
                    agreement. If you do not agree to abide by the above, please
                    do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    2. Platform Description
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Credibble is a decentralized finance (DeFi) platform that
                    connects investors with real-world lending opportunities
                    through tokenized loan shares. The platform operates on the
                    Core DAO blockchain and facilitates investment in various
                    loan pools.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    3. User Responsibilities
                  </h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Users are responsible for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>
                        Maintaining the security of their wallet and private
                        keys
                      </li>
                      <li>
                        Conducting their own due diligence before investing
                      </li>
                      <li>
                        Understanding the risks associated with DeFi investments
                      </li>
                      <li>
                        Complying with applicable laws and regulations in their
                        jurisdiction
                      </li>
                      <li>Providing accurate information when required</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    4. Investment Risks
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All investments carry risk, including the potential loss of
                    principal. Cryptocurrency and DeFi investments are
                    particularly volatile and speculative. Past performance does
                    not guarantee future results. Users should only invest what
                    they can afford to lose.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    5. Platform Fees
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Credibble charges management fees and performance fees as
                    disclosed in the platform interface. All fees are
                    transparently displayed before investment confirmation.
                    Users are also responsible for blockchain transaction fees.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    6. Prohibited Activities
                  </h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Users may not:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Use the platform for illegal activities</li>
                      <li>Attempt to manipulate or exploit the platform</li>
                      <li>Provide false or misleading information</li>
                      <li>Interfere with the platform's operation</li>
                      <li>Violate any applicable laws or regulations</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    7. Limitation of Liability
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Credibble shall not be liable for any direct, indirect,
                    incidental, special, consequential, or exemplary damages
                    resulting from the use of the platform. This includes but is
                    not limited to investment losses, technical failures, or
                    security breaches.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    8. Modifications
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Credibble reserves the right to modify these terms at any
                    time. Users will be notified of significant changes and
                    continued use constitutes acceptance of the modified terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    9. Contact Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For questions about these Terms of Service, please contact
                    us at credibble.xyz@gmail.com.
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

export default TermsOfServicePage;
