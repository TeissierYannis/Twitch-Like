"use client";

import React from "react";
import { Palette, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Hint } from "@/components/hint";
import { themes, type ThemeName } from "@/lib/themes";

export function ThemeCustomizer() {
  const [currentColorTheme, setCurrentColorTheme] = React.useState<ThemeName>("default");

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
    localStorage.setItem("gamehub-color-theme", themeName);
  };

  React.useEffect(() => {
    // Load saved theme on mount
    const saved = localStorage.getItem("gamehub-color-theme") as ThemeName;
    if (saved && themes[saved]) {
      applyTheme(saved);
    }
  }, []);

  // Re-apply theme when dark/light mode changes
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      applyTheme(currentColorTheme);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    return () => observer.disconnect();
  }, [currentColorTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Hint label="Customize colors" side="bottom" asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-9 h-9 px-0 hover:bg-primary/10 transition-all duration-200"
            >
              <Palette className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Customize theme colors</span>
            </Button>
          </Hint>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-card/95 backdrop-blur-md border border-border/50 shadow-lg min-w-[140px]"
      >
        <DropdownMenuLabel>Color Themes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(themes).map(([key, theme]) => (
          <DropdownMenuItem 
            key={key}
            onClick={() => applyTheme(key as ThemeName)}
            className="cursor-pointer hover:bg-primary/10 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2 border-2 border-border/50"
                style={{ 
                  background: `linear-gradient(45deg, ${theme.cssVars.light.primary}, ${theme.cssVars.light.accent})` 
                }}
              />
              <span>{theme.name}</span>
            </div>
            {currentColorTheme === key && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}