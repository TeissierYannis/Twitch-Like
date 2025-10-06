import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "strong" | "glow";
  blur?: "sm" | "md" | "lg" | "xl";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", blur = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "relative rounded-lg border transition-all duration-300",
          // Backdrop blur variants
          {
            "backdrop-blur-sm": blur === "sm",
            "backdrop-blur-md": blur === "md", 
            "backdrop-blur-lg": blur === "lg",
            "backdrop-blur-xl": blur === "xl",
          },
          // Card variants
          {
            // Default glassmorphism
            "bg-card/90 border-border/20 shadow-glass": variant === "default",
            // Subtle transparency
            "bg-card/70 border-border/10 shadow-sm": variant === "subtle",
            // Strong glass effect
            "bg-card/95 border-border/30 shadow-glass-lg": variant === "strong",
            // Glowing effect
            "bg-card/90 border-primary/20 shadow-glow": variant === "glow",
          },
          className
        )}
        {...props}
      >
        {/* Optional glow effect for glow variant */}
        {variant === "glow" && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg -z-10 blur-xl" />
        )}
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard, type GlassCardProps };