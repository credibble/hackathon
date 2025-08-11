import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ConnectButton } from "@/components/ui/connect-button";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const LandingHeader = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Partners", href: "/partners" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border rounded-none"
    >
      <div className="container mx-auto px-3 md:px-6 py-2 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1.5 md:space-x-2">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm md:text-lg">
                C
              </span>
            </div>
            <span className="text-lg md:text-xl font-semibold text-foreground">
              Credibble
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <ThemeToggle />
            <Link to="/app">
              <Button
                size="sm"
                className="font-medium text-xs md:text-sm px-3 md:px-4"
              >
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default LandingHeader;
