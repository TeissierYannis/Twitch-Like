import React from "react";
import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { GlowButton } from "@/components/ui/glow-button";
import { DynamicLogo } from "@/components/dynamic-logo";

export default function NotFoundPage() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'GameHub';

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            
            <GlassCard variant="glow" className="p-8 md:p-12 max-w-lg w-full text-center space-y-6">
                {/* 404 Visual */}
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse" />
                            <div className="relative bg-gradient-to-br from-card to-card/90 rounded-full p-6 border-2 border-primary/20">
                                <Search className="h-16 w-16 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                    
                    <GradientText as="h1" variant="primary" className="text-6xl font-bold">
                        404
                    </GradientText>
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-foreground">
                        Lost in the Stream?
                    </h2>
                    <p className="text-muted-foreground">
                        This page seems to have gone offline. Don't worry though - 
                        there are plenty of amazing live streams waiting for you!
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <GlowButton
                        asChild
                        glowIntensity="medium" 
                        className="flex-1"
                    >
                        <Link href="/">
                            <Home className="h-4 w-4 mr-2" />
                            Discover Streams
                        </Link>
                    </GlowButton>
                    
                    <GlassCard variant="subtle" className="flex-1">
                        <Link href="/search" className="flex items-center justify-center py-2 px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <Search className="h-4 w-4 mr-2" />
                            Find Content
                        </Link>
                    </GlassCard>
                </div>

                {/* Quick Links */}
                <div className="pt-4 border-t border-border/20">
                    <p className="text-xs text-muted-foreground mb-3">Trending categories:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {[
                            { name: 'Live Gaming', icon: '🎮' },
                            { name: 'Music', icon: '🎵' },
                            { name: 'Creative', icon: '🎨' },
                            { name: 'Just Chatting', icon: '💬' }
                        ].map((category) => (
                            <Link 
                                key={category.name}
                                href={`/search?q=${category.name.toLowerCase()}`}
                                className="px-3 py-1 text-xs bg-muted/50 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            >
                                <span>{category.icon}</span>
                                {category.name}
                            </Link>
                        ))}
                    </div>
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