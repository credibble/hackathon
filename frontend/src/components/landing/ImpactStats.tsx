import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shimmer } from "@/components/ui/shimmer";
import { DollarSign, Users, Building, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useImpactStats } from "@/hooks/useDashboard";

const ImpactStats = () => {
  const { data: impactStats, isLoading } = useImpactStats();

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 bg-gradient-to-b from-background to-accent/5">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <Shimmer className="h-8 w-64 mx-auto mb-4" />
            <Shimmer className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Shimmer key={i} className="h-32" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!impactStats) return null;

  const stats = [
    {
      icon: DollarSign,
      value: `$${(impactStats.totalFunded / 1000000).toFixed(1)}M`,
      label: "Total Funded",
      description: "Deployed to real-world lending"
    },
    {
      icon: Users,
      value: impactStats.borrowersReached.toLocaleString(),
      label: "Borrowers Reached",
      description: "Lives impacted globally"
    },
    {
      icon: Building,
      value: impactStats.partnerOrgsOnboarded.toString(),
      label: "Partner Organizations",
      description: "Trusted institutions worldwide"
    },
    {
      icon: TrendingUp,
      value: impactStats.loansOriginated.toString(),
      label: "Loans Originated",
      description: "Individual funding successes"
    }
  ];

  return (
    <section className="py-12 md:py-section bg-gradient-to-br from-accent-light via-background to-accent-light">
      <div className="container mx-auto px-3 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Real Impact, Real Numbers
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            See the tangible difference your investments are making in communities worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="neuro-card p-4 md:p-6 lg:p-8 text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <stat.icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
              </div>
              
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1.5 md:mb-2">
                {stat.value}
              </div>
              
              <div className="font-semibold text-foreground mb-1 text-sm md:text-base">
                {stat.label}
              </div>
              
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Impact Stories Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 md:mt-16 max-w-4xl mx-auto"
        >
          <h3 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6 md:mb-8">
            Impact Stories
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {impactStats.impactStories.map((story, index) => (
              <div
                key={index}
                className="glass-card p-4 md:p-6 hover:shadow-medium transition-all duration-300"
              >
                <h4 className="font-semibold text-foreground mb-1.5 md:mb-2 text-sm md:text-base">
                  {story.title}
                </h4>
                <p className="text-muted-foreground text-xs md:text-sm mb-2.5 md:mb-3">
                  {story.description}
                </p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">{story.location}</span>
                  <span className="font-medium text-success">
                    ${story.amount.toLocaleString()} funded
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStats;