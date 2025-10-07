import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";

interface GlowButtonProps extends Omit<ButtonProps, "variant"> {
  glowIntensity?: "subtle" | "medium" | "strong";
  animated?: boolean;
}

const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, glowIntensity = "medium", animated = false, ...props }, ref) => {
    return (
      <div className="relative group">
        {/* Glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10",
            {
              "bg-gradient-to-r from-primary/20 to-accent/20 blur-md": glowIntensity === "subtle",
              "bg-gradient-to-r from-primary/40 to-accent/40 blur-lg": glowIntensity === "medium",
              "bg-gradient-to-r from-primary/60 to-accent/60 blur-xl": glowIntensity === "strong",
            },
            animated && "animate-pulse"
          )}
        />
        <Button
          ref={ref}
          className={cn(
            "relative bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90",
            "shadow-lg hover:shadow-glow transition-all duration-300",
            "border border-primary/20",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

GlowButton.displayName = "GlowButton";

export { GlowButton };
export type { GlowButtonProps };