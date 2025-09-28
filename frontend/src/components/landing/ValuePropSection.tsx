import { motion } from "framer-motion";
import { DollarSign, Shield, BarChart3 } from "lucide-react";

const ValuePropSection = () => {
  const steps = [
    {
      number: "01",
      title: "Select Loan Pool",
      description:
        "Choose from vetted loan pools supporting education, agriculture, or small business financing.",
      icon: DollarSign,
      color: "bg-blue-50 border-blue-200 text-blue-600",
    },
    {
      number: "02",
      title: "Purchase NFT Share",
      description:
        "Deposit USDT, USDC, HBAR, or WBTC to receive tokenized shares representing your loan exposure.",
      icon: Shield,
      color: "bg-green-50 border-green-200 text-green-600",
    },
    {
      number: "03",
      title: "Earn Yield or Sell Early",
      description:
        "Collect regular yield payments or trade your NFT shares on the marketplace for early exit.",
      icon: BarChart3,
      color: "bg-purple-50 border-purple-200 text-purple-600",
    },
  ];

  return (
    <section className="py-12 md:py-section bg-gradient-to-br from-accent-light via-background to-accent-light">
      <div className="container mx-auto px-3 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
              Simple Process, Real Impact
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Our streamlined platform makes it easy to start earning yield
              while supporting borrowers worldwide.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="space-y-6 md:space-y-8 lg:space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-6 md:gap-8 lg:gap-12`}
              >
                {/* Content */}
                <div className="flex-1 space-y-3 md:space-y-4">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <span className="text-2xl md:text-3xl font-bold text-primary/20">
                      {step.number}
                    </span>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base lg:text-lg">
                    {step.description}
                  </p>
                </div>

                {/* Visual */}
                <div className="flex-1 flex justify-center">
                  <div className="neuro-card p-6 md:p-8 w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 flex flex-col items-center justify-center">
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl border-2 ${step.color} flex items-center justify-center mb-3 md:mb-4`}
                    >
                      <step.icon className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    </div>
                    <div className="text-center">
                      <div className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-1.5 md:mb-2">
                        {step.number}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {step.title}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuePropSection;
