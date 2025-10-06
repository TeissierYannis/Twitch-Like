"use client";

import { Suspense } from "react";
import { GlassCard } from "@/components/ui/glass-card";

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

const DefaultFallback = () => (
  <GlassCard className="p-6 animate-pulse">
    <div className="space-y-3">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-4 bg-muted rounded w-5/6" />
    </div>
  </GlassCard>
);

export const LazyComponent = ({ 
  children, 
  fallback = <DefaultFallback />, 
  className = "" 
}: LazyComponentProps) => {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  );
};