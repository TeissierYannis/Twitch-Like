"use client";

export const SkipNavigation = () => {
  return (
    <a
      href="#main-content"
      className="absolute left-0 top-0 z-[9999] -translate-y-full bg-primary px-4 py-2 text-primary-foreground transition-transform focus:translate-y-0 sr-only focus:not-sr-only"
    >
      Skip to main content
    </a>
  );
};