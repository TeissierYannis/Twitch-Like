"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home, Bug } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { GlowButton } from "@/components/ui/glow-button";
import { DynamicLogo } from "@/components/dynamic-logo";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Here you could also send to an error reporting service
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const appName = process.env.NEXT_PUBLIC_APP_NAME || 'GameHub';

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <GlassCard variant="glow" className="p-6 md:p-8 max-w-lg w-full text-center space-y-4">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-destructive/10 rounded-full blur-xl" />
                <div className="relative bg-gradient-to-br from-card to-card/90 rounded-full p-3 border-2 border-destructive/20">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <GradientText as="h3" variant="primary" className="text-lg font-semibold">
                Something went wrong
              </GradientText>
              <p className="text-sm text-muted-foreground">
                This component encountered an unexpected error.
              </p>
            </div>

            {/* Error Details (Development only) */}
            {this.props.showDetails && process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left">
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                  <Bug className="inline h-3 w-3 mr-1" />
                  Show technical details
                </summary>
                <div className="mt-2 p-3 bg-muted/50 rounded text-xs font-mono text-left space-y-2">
                  <div>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <GlowButton
                onClick={this.handleReset}
                size="sm"
                glowIntensity="subtle"
                className="flex-1"
              >
                <RotateCcw className="h-3 w-3 mr-2" />
                Try Again
              </GlowButton>
              
              <GlassCard variant="subtle" className="flex-1">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full flex items-center justify-center py-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Home className="h-3 w-3 mr-2" />
                  Go Home
                </button>
              </GlassCard>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-border/20">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <DynamicLogo size={12} />
                <span>{appName}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC version for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}