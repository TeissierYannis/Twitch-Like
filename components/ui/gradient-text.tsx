import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  variant?: "primary" | "accent" | "rainbow" | "sunset" | "ocean" | "forest";
  animated?: boolean;
}

const gradientVariants = {
  primary: "bg-gradient-to-r from-primary to-primary/80",
  accent: "bg-gradient-to-r from-primary to-accent",
  rainbow: "bg-gradient-to-r from-primary via-accent to-secondary",
  sunset: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500",
  ocean: "bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500",
  forest: "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500",
};

const GradientText = forwardRef<HTMLElement, GradientTextProps>(
  ({ className, as: Component = "span", variant = "primary", animated = false, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          // Base gradient text styles
          "bg-clip-text text-transparent font-medium",
          gradientVariants[variant],
          // Animation
          animated && "animate-pulse",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GradientText.displayName = "GradientText";

export { GradientText, type GradientTextProps };