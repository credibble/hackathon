import { Link } from "react-router-dom";
import { Twitter, MessageCircle } from "lucide-react";

const LandingFooter = () => {
  const footerLinks = {
    Platform: [
      { name: "How It Works", href: "/how-it-works" },
      { name: "Pools", href: "/app" },
      { name: "Marketplace", href: "/app/marketplace" },
      { name: "Partners", href: "/partners" },
    ],
    Resources: [
      { name: "Documentation", href: "#" },
      { name: "FAQ", href: "/faq" },
      { name: "Support", href: "/support" },
      { name: "Careers", href: "/careers" },
    ],
    Legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Risk & Compliance", href: "/risk-compliance" },
    ],
  };

  const socialLinks = [
    { name: "X (Twitter)", href: "https://x.com/credibble_fi", icon: Twitter },
    { name: "Discord", href: "#", icon: MessageCircle },
  ];

  return (
    <footer className="bg-gradient-to-b from-muted/20 to-muted/50 border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  C
                </span>
              </div>
              <span className="text-xl font-semibold text-foreground">
                Credibble
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Connecting DeFi with real-world lending through tokenized loan
              shares.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary-hover transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4 text-secondary-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Credibble. Built on Core DAO. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">
            Invest responsibly. Past performance does not guarantee future
            results.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
