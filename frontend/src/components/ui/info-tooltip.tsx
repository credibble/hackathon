import React, { useState } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  iconClassName?: string;
  size?: "sm" | "md" | "lg";
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  side = "top",
  className,
  iconClassName,
  size = "sm"
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  const handleToggle = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const handleClose = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <TooltipProvider delayDuration={isMobile ? 0 : 300}>
      <Tooltip open={isMobile ? isOpen : undefined} onOpenChange={isMobile ? setIsOpen : undefined}>
        <TooltipTrigger
          asChild
          onClick={handleToggle}
          onTouchStart={handleToggle}
          className={cn("cursor-pointer", className)}
        >
          <Info 
            className={cn(
              iconSizes[size],
              "text-muted-foreground hover:text-foreground transition-colors",
              iconClassName
            )}
          />
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          className="max-w-[280px] sm:max-w-[320px] md:max-w-sm text-xs leading-relaxed z-[100]"
          onPointerDownOutside={handleClose}
          onEscapeKeyDown={handleClose}
        >
          {content}
        </TooltipContent>
      </Tooltip>
      {/* Mobile backdrop to close tooltip */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={handleClose}
          onTouchStart={handleClose}
        />
      )}
    </TooltipProvider>
  );
};