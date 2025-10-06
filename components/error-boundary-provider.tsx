"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import { ErrorInfo } from "react";

interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
}

// Global error handler for logging
const handleError = (error: Error, errorInfo: ErrorInfo) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Global ErrorBoundary:', error, errorInfo);
  }

  // In production, you would send this to your error reporting service
  // e.g., Sentry, LogRocket, Bugsnag, etc.
  if (process.env.NODE_ENV === 'production') {
    // Example with Sentry:
    // Sentry.captureException(error, {
    //   contexts: {
    //     react: {
    //       componentStack: errorInfo.componentStack,
    //     },
    //   },
    // });
    
    // For now, just log to console
    console.error('Production error:', error.message);
  }
};

export const ErrorBoundaryProvider = ({ children }: ErrorBoundaryProviderProps) => {
  return (
    <ErrorBoundary 
      onError={handleError}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      {children}
    </ErrorBoundary>
  );
};