import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
  children?: React.ReactNode;
}

export const Shimmer = ({ className, children }: ShimmerProps) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-muted/50 rounded-md",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer",
        "before:bg-gradient-to-r before:from-transparent before:via-foreground/20 before:to-transparent",
        className
      )}
    >
      {children}
    </div>
  );
};

export const ShimmerCard = ({ className }: { className?: string }) => {
  return (
    <div className={cn("p-4 md:p-6 space-y-3 md:space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Shimmer className="h-5 w-16 md:h-6 md:w-20" />
          <Shimmer className="h-5 w-12 md:h-6 md:w-16" />
        </div>
        <Shimmer className="h-6 w-16 md:h-8 md:w-20" />
      </div>
      
      <div className="space-y-2">
        <Shimmer className="h-6 w-3/4 md:h-7 md:w-2/3" />
        <Shimmer className="h-4 w-full md:h-5 md:w-5/6" />
        <Shimmer className="h-4 w-2/3 md:h-5 md:w-3/4" />
      </div>
      
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div>
          <Shimmer className="h-3 w-12 md:h-4 md:w-16 mb-1" />
          <Shimmer className="h-5 w-16 md:h-6 md:w-20" />
        </div>
        <div>
          <Shimmer className="h-3 w-16 md:h-4 md:w-20 mb-1" />
          <Shimmer className="h-5 w-20 md:h-6 md:w-24" />
        </div>
      </div>
      
      <Shimmer className="h-9 w-full md:h-10" />
    </div>
  );
};

export const ShimmerTable = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 md:p-4">
          <Shimmer className="h-4 w-24 md:h-5 md:w-32" />
          <Shimmer className="h-4 w-32 md:h-5 md:w-40 flex-1" />
          <Shimmer className="h-4 w-16 md:h-5 md:w-20" />
          <Shimmer className="h-4 w-20 md:h-5 md:w-24" />
          <Shimmer className="h-8 w-16 md:h-9 md:w-20" />
        </div>
      ))}
    </div>
  );
};