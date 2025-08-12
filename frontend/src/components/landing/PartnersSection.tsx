import { motion } from "framer-motion";
import { useBorrowers } from "@/hooks/useBorrowers";
import { Shimmer } from "@/components/ui/shimmer";

const PartnersSection = () => {
  const { data, isLoading } = useBorrowers();

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-3 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3 md:mb-4">
            Trusted by Leading Organizations
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            We partner with established institutions that share our commitment
            to transparency and impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Shimmer key={index} className="h-48" />
              ))
            : (data?.data?.data ?? []).slice(0, 3).map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-4 md:p-6 text-center group hover:scale-105 transition-all duration-300"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-primary transition-colors overflow-hidden">
                    {partner.metadata?.logo ? (
                      <img
                        src={partner.metadata.logo}
                        alt={partner.metadata?.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-xl md:text-2xl font-bold text-accent-foreground group-hover:text-primary-foreground">
                        {(partner.metadata?.name || "Partner").charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5 md:mb-2 text-sm md:text-base">
                    {partner.metadata?.name || "Partner"}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {partner.metadata?.description || "Impact partner"}
                  </p>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
