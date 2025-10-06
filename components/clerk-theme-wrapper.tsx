"use client";

import { useTheme } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

interface ClerkThemeWrapperProps {
  children: React.ReactNode;
}

export function ClerkThemeWrapper({ children }: ClerkThemeWrapperProps) {
  const { theme } = useTheme();
  
  return (
    <ClerkProvider
      appearance={{
        theme: theme === "dark" ? dark : undefined,
        elements: {
          formButtonPrimary: 
            "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground",
          card: "bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: 
            "border border-border/50 hover:bg-muted/50 text-foreground",
          formFieldInput: 
            "bg-background/50 border-border/50 focus:ring-primary/50 focus:border-primary/50",
          footerActionLink: "text-primary hover:text-primary/80",
        },
      }}
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}