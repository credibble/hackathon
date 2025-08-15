import { motion } from "framer-motion";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

const PrivacyPolicyPage = () => {
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
                Privacy Policy
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Last updated: August 2025
              </p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    1. Information We Collect
                  </h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      We collect information you provide directly to us, such as
                      when you create an account, subscribe to updates, or
                      contact support.
                    </p>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-foreground">
                        Personal Information:
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Email addresses for notifications and support</li>
                        <li>Wallet addresses for transaction processing</li>
                        <li>Communication preferences</li>
                        <li>Support inquiry details</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    2. How We Use Your Information
                  </h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      We use the information we collect to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Provide and maintain our platform services</li>
                      <li>Process transactions and manage investments</li>
                      <li>Send important updates and notifications</li>
                      <li>Provide customer support</li>
                      <li>Improve our platform and services</li>
                      <li>Comply with legal and regulatory requirements</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    3. Information Sharing
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell, trade, or rent your personal information to
                    third parties. We may share your information only in the
                    following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and prevent fraud</li>
                    <li>
                      With trusted service providers under strict
                      confidentiality agreements
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    4. Blockchain Privacy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Please note that blockchain transactions are publicly
                    visible on the blockchain network. While wallet addresses
                    are pseudonymous, all transaction data is permanently
                    recorded on the blockchain and cannot be deleted or
                    modified.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    5. Data Security
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate security measures to protect your
                    personal information against unauthorized access,
                    alteration, disclosure, or destruction. However, no internet
                    transmission is completely secure, and we cannot guarantee
                    absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    6. Cookie Policy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and similar technologies to enhance your
                    experience, analyze usage patterns, and personalize content.
                    You can control cookie settings through your browser
                    preferences.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    7. Your Rights
                  </h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      You have the right to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Access your personal information</li>
                      <li>Correct inaccurate information</li>
                      <li>Request deletion of your information</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Data portability where applicable</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    8. International Users
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our platform may be accessed from various countries. By
                    using our services, you consent to the transfer and
                    processing of your information in accordance with this
                    Privacy Policy, regardless of your location.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    9. Changes to This Policy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Privacy Policy periodically. We will
                    notify you of any material changes by posting the new policy
                    on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    10. Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy, please
                    contact us at credibble.xyz@gmail.com.
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

export default PrivacyPolicyPage;
