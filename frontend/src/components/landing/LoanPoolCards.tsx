import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shimmer } from "@/components/ui/shimmer";
import { TrendingUp, Clock, Shield, DollarSign, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useFeaturedLoanPools } from "@/hooks/useLoans";
import { dataService } from "@/services/dataService";
import { computeExpectedAPY, computeUtilizationRate } from "@/lib/typeslibs";
import { formatLargeNumber } from "@/lib/utils";
import { formatUnits } from "viem";

const LoanPoolCards = () => {
  const { data: featuredPools, isLoading } = useFeaturedLoanPools(3);

  return (
    <section className="py-12 md:py-section bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto px-3 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Featured Investment Opportunities
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Discover high-yield opportunities to support real-world businesses
            while earning competitive returns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading
            ? // Loading shimmer
              Array.from({ length: 3 }).map((_, index) => (
                <Shimmer key={index} className="h-80" />
              ))
            : featuredPools.data.data?.map((pool, index) => {
                const token = dataService.getToken(pool.asset);
                const expectedAPY = computeExpectedAPY(pool);
                const utilizationRate = computeUtilizationRate(pool);

                return (
                  <motion.div
                    key={pool.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Card className="neuro-card h-full hover:scale-105 transition-all duration-300 overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <Badge variant="outline" className="font-mono">
                            {pool.lockPeriod / 86400} DAYS
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                          {pool.name}
                        </CardTitle>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 text-ellipsis min-h-10">
                          {pool.description}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-3 md:space-y-4">
                        {/* APY Highlight */}
                        <div className="bg-primary/5 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-primary mb-1">
                            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-lg md:text-xl font-bold">
                              {expectedAPY}%
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Expected APY
                          </span>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              TVL
                            </span>
                            <span className="font-medium text-foreground">
                              {formatLargeNumber(
                                Number(
                                  formatUnits(pool.totalTVL, token.decimals)
                                )
                              )}{" "}
                              {token.symbol}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              Lock Period
                            </span>
                            <span className="font-medium text-foreground">
                              {pool.lockPeriod / 86400}d
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              Borrowers
                            </span>
                            <span className="font-medium text-foreground">
                              {pool.positionContract.positions.length} org
                              {pool.positionContract.positions.length !== 1
                                ? "s"
                                : ""}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <Shield className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              Borrow APY
                            </span>
                            <span className="font-medium text-foreground">
                              {Number(pool.borrowAPY / 10_000).toFixed(2)}%
                            </span>
                          </div>
                        </div>

                        {/* CTA */}
                        <Link to={`/app/loan-pools/${pool.symbol}`}>
                          <Button
                            className="w-full text-xs md:text-sm mt-4"
                            variant="outline"
                          >
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-12"
        >
          <Link to="/app/loan-pools">
            <Button size="lg" className="font-semibold">
              Explore All Opportunities
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LoanPoolCards;
