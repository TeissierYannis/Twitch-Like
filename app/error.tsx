"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { GlowButton } from "@/components/ui/glow-button";
import { DynamicLogo } from "@/components/dynamic-logo";

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'GameHub';

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            
            <GlassCard variant="glow" className="p-8 md:p-12 max-w-md w-full text-center space-y-6">
                {/* Logo */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-destructive/10 rounded-full blur-xl" />
                        <div className="relative bg-gradient-to-br from-card to-card/90 rounded-full p-4 border-2 border-destructive/20">
                            <AlertTriangle className="h-12 w-12 text-destructive" />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-3">
                    <GradientText as="h1" variant="primary" className="text-2xl font-bold">
                        Oops! Something went wrong
                    </GradientText>
                    <p className="text-muted-foreground">
                        We encountered an unexpected error. Don't worry, our team has been notified.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground/70 font-mono">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <GlowButton
                        onClick={reset}
                        glowIntensity="medium"
                        className="flex-1"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Try Again
                    </GlowButton>
                    
                    <GlassCard variant="subtle" className="flex-1">
                        <Link href="/" className="flex items-center justify-center py-2 px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <Home className="h-4 w-4 mr-2" />
                            Back to {appName}
                        </Link>
                    </GlassCard>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-border/20">
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <DynamicLogo size={16} />
                        <span>{appName}</span>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}