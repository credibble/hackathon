import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Coins, Heart, TrendingUp } from "lucide-react";

const HeroSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  const words = ["Confidence", "Purpose", "Security", "Trust", "Excellence"];

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const typeWriter = () => {
      if (!isDeleting) {
        // Typing
        if (currentCharIndex < currentWord.length) {
          setDisplayText(currentWord.substring(0, currentCharIndex + 1));
          setCurrentCharIndex((prev) => prev + 1);
        } else {
          // Finished typing, wait before deleting
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        // Deleting
        if (currentCharIndex > 0) {
          setDisplayText(currentWord.substring(0, currentCharIndex - 1));
          setCurrentCharIndex((prev) => prev - 1);
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const speed = isDeleting ? 50 : 100; // Faster when deleting
    const timeout = setTimeout(typeWriter, speed);

    return () => clearTimeout(timeout);
  }, [currentCharIndex, isDeleting, currentWordIndex, words]);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute top-1/2 -translate-y-1/2 -right-20 md:-right-32 w-[500px] md:w-[800px] lg:w-[1000px] h-auto opacity-10 object-cover hidden sm:block"
        >
          <source src="/videos/ecosystem_mobile_v2.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-accent-light/10 to-background/85" />
      </div>

      <div className="container mx-auto px-3 md:px-6 pt-20 md:pt-20 pb-8 md:pb-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-accent border border-accent-foreground/10 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-6 md:mb-8"
          >
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs md:text-sm font-medium text-accent-foreground">
              Live on Core DAO Testnet 2
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 md:mb-6 leading-tight"
          >
            <span className="block">Invest with Impact.</span>
            <span className="block">
              Earn with{" "}
              <span className="brand-gradient font-bold inline-block relative">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="inline-block w-0.5 h-[1em] bg-current ml-1 align-middle"
                />
              </span>
              .
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2"
          >
            Connect DeFi yields with real-world lending. Fund students, farmers,
            and entrepreneurs while earning sustainable returns through
            tokenized loan shares.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-10 md:mb-16"
          >
            <Link to="/app">
              <Button
                size="lg"
                className="w-full sm:w-auto font-semibold px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base group"
              >
                Launch App
                <ArrowRight className="ml-1.5 md:ml-2 h-3.5 w-3.5 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/partners">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto font-semibold px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base"
              >
                Partner With Us
              </Button>
            </Link>
          </motion.div>

          {/* Value Props */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto"
          >
            <div className="glass-card p-4 md:p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5 md:mb-2 text-sm md:text-base">
                Earn Real Yields
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                8-16% APY from transparent, real-world loan portfolios
              </p>
            </div>

            <div className="glass-card p-4 md:p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Heart className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5 md:mb-2 text-sm md:text-base">
                Create Impact
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Fund education, agriculture, and small businesses globally
              </p>
            </div>

            <div className="glass-card p-4 md:p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Coins className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5 md:mb-2 text-sm md:text-base">
                Trade Freely
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                NFT shares are tradeable on our integrated marketplace
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
