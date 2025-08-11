import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Shield, Coins, BarChart3, Globe, Lock, Zap } from "lucide-react";

const FeaturesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const features = [
    {
      icon: Shield,
      title: "Transparent Lending",
      description: "Every loan is verified and tracked. See exactly where your funds go and monitor repayment progress in real-time.",
      color: "bg-blue-50 border-blue-200 text-blue-600"
    },
    {
      icon: Coins,
      title: "Multi-Token Support",
      description: "Deposit with USDT, USDC, CORE, or WBTC. Flexible options to match your portfolio preferences.",
      color: "bg-green-50 border-green-200 text-green-600"
    },
    {
      icon: BarChart3,
      title: "NFT Share Ownership",
      description: "Receive tokenized shares as NFTs that represent your loan exposure. Fully tradeable on our marketplace.",
      color: "bg-purple-50 border-purple-200 text-purple-600"
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Support borrowers across emerging markets. From student loans in Africa to agricultural financing in Asia.",
      color: "bg-orange-50 border-orange-200 text-orange-600"
    },
    {
      icon: Lock,
      title: "Institutional Grade Security",
      description: "Smart contracts audited by leading security firms. Multi-signature controls and insurance coverage.",
      color: "bg-red-50 border-red-200 text-red-600"
    },
    {
      icon: Zap,
      title: "Instant Liquidity",
      description: "Don't wait for loan maturity. Trade your shares on our integrated marketplace for immediate exit.",
      color: "bg-yellow-50 border-yellow-200 text-yellow-600"
    }
  ];

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section ref={containerRef} className="py-12 md:py-section bg-gradient-to-br from-background via-accent-light to-background overflow-hidden">
      <div className="container mx-auto px-3 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Built for Modern DeFi + TradFi
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Advanced features that make real-world lending accessible, transparent, and profitable.
          </p>
        </motion.div>

        {/* Mobile Grid, Desktop Horizontal Scroll */}
        <div className="md:hidden grid grid-cols-1 gap-4 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="neuro-card p-4 text-center group"
            >
              <div className={`w-12 h-12 rounded-xl border-2 ${feature.color} flex items-center justify-center mx-auto mb-3`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Desktop Horizontal Scrolling Features */}
        <div className="hidden md:block relative h-screen flex items-center">
          <motion.div
            style={{ x }}
            className="flex space-x-6 lg:space-x-8 will-change-transform"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-none w-64 lg:w-80 h-80 lg:h-96"
              >
                <div className="neuro-card p-6 lg:p-8 h-full flex flex-col justify-center items-center text-center group hover:scale-105 transition-all duration-300">
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl border-2 ${feature.color} flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 lg:w-10 lg:h-10" />
                  </div>
                  
                  <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-3 lg:mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            Scroll to explore features →
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;