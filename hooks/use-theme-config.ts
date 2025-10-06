"use client";

import { useState, useEffect } from "react";
import { themes, type ThemeName } from "@/lib/themes";

export function useThemeConfig() {
  const [currentColorTheme, setCurrentColorTheme] = useState<ThemeName>("default");

  const applyTheme = (themeName: ThemeName) => {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    // Get current dark/light mode
    const isDark = root.classList.contains("dark");
    const colorVars = isDark ? theme.cssVars.dark : theme.cssVars.light;
    
    // Apply CSS variables
    Object.entries(colorVars).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    setCurrentColorTheme(themeName);
    if (typeof window !== "undefined") {
      localStorage.setItem("gamehub-color-theme", themeName);
    }
  };

  const loadSavedTheme = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gamehub-color-theme") as ThemeName;
      if (saved && themes[saved]) {
        applyTheme(saved);
      } else {
        // Apply default theme if no saved theme found
        applyTheme("default");
      }
    }
  };

  useEffect(() => {
    loadSavedTheme();
  }, []);

  return {
    currentColorTheme,
    applyTheme,
    availableThemes: themes,
  };
}