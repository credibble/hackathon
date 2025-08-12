import { motion } from "framer-motion";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Shield, Globe, ArrowRight } from "lucide-react";

const PartnersPage = () => {
  const benefits = [
    {
      icon: Users,
      title: "Access to Capital",
      description: "Connect with DeFi investors seeking impact-driven returns",
    },
    {
      icon: Shield,
      title: "Risk Sharing",
      description:
        "Diversify funding sources and reduce dependence on traditional finance",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Tap into international capital markets through blockchain technology",
    },
  ];

  const requirements = [
    "Established organization with 3+ years operating history",
    "Proven track record in loan origination and management",
    "KYC/AML compliance and regulatory licenses",
    "Audited financial statements from past 2 years",
    "Minimum $500K annual loan origination volume",
    "Commitment to transparency and impact reporting",
  ];

  const process = [
    {
      step: "1",
      title: "Application",
      description:
        "Submit initial application with organization details and credentials",
    },
    {
      step: "2",
      title: "Due Diligence",
      description:
        "Comprehensive review of operations, compliance, and track record",
    },
    {
      step: "3",
      title: "Integration",
      description: "Technical integration and pilot loan pool setup",
    },
    {
      step: "4",
      title: "Launch",
      description:
        "Go live with your first loan pool and start raising capital",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      <main>
        {/* Hero Section */}
        <section className="py-section bg-gradient-to-br from-background via-accent-light to-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge className="mb-6" variant="secondary">
                Partner Program
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Partner with Credibble
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Join our network of trusted institutions connecting borrowers to
                decentralized capital. Scale your lending operations with
                transparent, global DeFi funding.
              </p>
              <Button size="lg" className="font-semibold">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-section bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Partner with Credibble?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Unlock new funding sources and expand your impact through our
                DeFi lending platform.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <benefit.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {benefit.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-section bg-accent-light">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Partner Requirements
                </h2>
                <p className="text-muted-foreground mb-8">
                  We work with established organizations that share our
                  commitment to transparency, compliance, and impact. Here's
                  what we look for in potential partners:
                </p>
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{requirement}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Partnership Process
                </h2>
                <div className="space-y-6">
                  {process.map((item, index) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex space-x-4"
                    >
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-section bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Fill out the form below and our partnership team will be in
                  touch within 24 hours.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Partnership Application</CardTitle>
                  <CardDescription>
                    Tell us about your organization and how you'd like to work
                    together.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Organization Name
                      </label>
                      <Input placeholder="Your organization name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Contact Email
                      </label>
                      <Input type="email" placeholder="contact@yourorg.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Country/Region
                      </label>
                      <Input placeholder="Where you operate" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Annual Loan Volume
                      </label>
                      <Input placeholder="e.g., $5M annually" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Organization Description
                    </label>
                    <Textarea
                      placeholder="Describe your organization, mission, and lending focus..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Partnership Goals
                    </label>
                    <Textarea
                      placeholder="What do you hope to achieve through this partnership?"
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button size="lg" className="w-full font-semibold">
                    Submit Application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default PartnersPage;
