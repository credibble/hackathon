import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How does tokenized loan sharing work?",
      answer:
        "Each 1-unit onchain share equals $1 of real-world loan value. Partner organizations (schools, NGOs) identify and KYC borrowers, we fund them with your deposits, and mint shares for you. It's a direct bridge between DeFi and TradFi.",
    },
    {
      question: "Can I withdraw my investment early?",
      answer:
        "Yes, but early withdrawal results in interest loss and a calculated waiting period. You can trade your shares on our marketplace anytime for immediate liquidity without penalties.",
    },
    {
      question: "What tokens can I use to invest?",
      answer:
        "We accept USDT, USDC, CORE, and WBTC. All deposits are converted to USD-equivalent for loan origination, and you receive yields in your deposited token.",
    },
    {
      question: "How are partner organizations vetted?",
      answer:
        "All partners undergo rigorous due diligence including track record verification, compliance checks, and ongoing monitoring. They're responsible for borrower KYC and connecting us to verified students, farmers, and entrepreneurs.",
    },
    {
      question: "What returns can I expect?",
      answer:
        "Target APY ranges from 8-16% based on pool risk, loan terms, and geographic factors. Returns come from real loan interest payments, not speculative trading, providing stable yields uncorrelated to crypto markets.",
    },
  ];

  return (
    <section id="faq" className="py-section bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about investing in real-world loans
            through Credibble.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card border border-glass-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/faq">
              <Button variant="outline" size="lg" className="font-semibold">
                View All FAQs
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
