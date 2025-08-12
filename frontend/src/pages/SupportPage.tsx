import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { Mail, MessageCircle, Phone } from "lucide-react";

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy form submission
    toast({
      title: "Support request submitted",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      category: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Support Center
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Need help? We're here to assist you. Get in touch with our
                support team.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Options */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Get help via email within 24 hours
                    </p>
                    <a
                      href="mailto:support@credible.finance"
                      className="text-primary hover:underline"
                    >
                      support@credible.finance
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Live Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Chat with our team in real-time
                    </p>
                    <Button variant="outline" className="w-full">
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Phone Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Monday - Friday, 9AM - 6PM EST
                    </p>
                    <a
                      href="tel:+1-555-CREDIBLE"
                      className="text-primary hover:underline"
                    >
                      +1 (555) CREDIBLE
                    </a>
                  </CardContent>
                </Card>
              </div>

              {/* Support Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit a Support Request</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon
                      as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleChange("email", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            handleChange("category", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">
                              Technical Issue
                            </SelectItem>
                            <SelectItem value="account">
                              Account Support
                            </SelectItem>
                            <SelectItem value="payments">
                              Payments & Deposits
                            </SelectItem>
                            <SelectItem value="partnerships">
                              Partnership Inquiry
                            </SelectItem>
                            <SelectItem value="general">
                              General Question
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) =>
                            handleChange("subject", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          rows={6}
                          value={formData.message}
                          onChange={(e) =>
                            handleChange("message", e.target.value)
                          }
                          placeholder="Please describe your issue or question in detail..."
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Submit Support Request
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default SupportPage;
