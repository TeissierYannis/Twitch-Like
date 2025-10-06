import { type ThemeName } from "./themes";

export function generateThemeCSS(themeName: ThemeName, colors: Record<string, string>) {
  return `
/* ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} Theme */
:root {
${Object.entries(colors).map(([key, value]) => `  --${key}: ${value};`).join('\n')}
}

.dark {
${Object.entries(colors).map(([key, value]) => `  --${key}: ${value};`).join('\n')}
}
`;
}

export function hslToOklch(h: number, s: number, l: number): string {
  // Convert HSL to OKLCH (approximation)
  const lightness = l / 100;
  const chroma = (s / 100) * Math.min(lightness, 1 - lightness);
  const hue = h;
  
  return `oklch(${lightness.toFixed(4)} ${chroma.toFixed(4)} ${hue})`;
}

export function createCustomTheme(
  name: string,
  primaryHue: number,
  accentHue: number
) {
  const lightTheme = {
    background: hslToOklch(primaryHue, 5, 95),
    foreground: hslToOklch(primaryHue, 10, 20),
    card: hslToOklch(primaryHue, 15, 96),
    "card-foreground": hslToOklch(primaryHue, 10, 20),
    popover: hslToOklch(0, 0, 100),
    "popover-foreground": hslToOklch(primaryHue, 10, 20),
    primary: hslToOklch(primaryHue, 70, 50),
    "primary-foreground": hslToOklch(0, 0, 100),
    secondary: hslToOklch(accentHue, 30, 80),
    "secondary-foreground": hslToOklch(primaryHue, 10, 30),
    muted: hslToOklch(primaryHue, 15, 88),
    "muted-foreground": hslToOklch(primaryHue, 10, 60),
    accent: hslToOklch(accentHue, 40, 85),
    "accent-foreground": hslToOklch(primaryHue, 10, 30),
    destructive: hslToOklch(0, 70, 60),
    "destructive-foreground": hslToOklch(0, 0, 100),
    border: hslToOklch(primaryHue, 70, 50),
    input: hslToOklch(primaryHue, 5, 92),
    ring: hslToOklch(primaryHue, 60, 60),
  };

  const darkTheme = {
    background: hslToOklch(primaryHue, 15, 8),
    foreground: hslToOklch(accentHue, 10, 95),
    card: hslToOklch(primaryHue, 15, 12),
    "card-foreground": hslToOklch(accentHue, 10, 95),
    popover: hslToOklch(primaryHue, 15, 12),
    "popover-foreground": hslToOklch(accentHue, 10, 95),
    primary: hslToOklch(accentHue, 40, 75),
    "primary-foreground": hslToOklch(primaryHue, 15, 8),
    secondary: hslToOklch(primaryHue, 30, 65),
    "secondary-foreground": hslToOklch(primaryHue, 15, 8),
    muted: hslToOklch(primaryHue, 10, 20),
    "muted-foreground": hslToOklch(primaryHue, 30, 65),
    accent: hslToOklch(accentHue, 40, 55),
    "accent-foreground": hslToOklch(accentHue, 10, 95),
    destructive: hslToOklch(0, 60, 65),
    "destructive-foreground": hslToOklch(primaryHue, 15, 8),
    border: hslToOklch(primaryHue, 20, 25),
    input: hslToOklch(primaryHue, 15, 15),
    ring: hslToOklch(accentHue, 40, 60),
  };

  return {
    name,
    cssVars: {
      light: lightTheme,
      dark: darkTheme,
    },
  };
}

// Predefined color schemes
export const colorSchemes = {
  sunset: { primary: 20, accent: 50 }, // Orange/Yellow
  ocean: { primary: 220, accent: 200 }, // Blue
  forest: { primary: 140, accent: 110 }, // Green
  lavender: { primary: 280, accent: 320 }, // Purple/Pink
  rose: { primary: 350, accent: 15 }, // Pink/Red
  mint: { primary: 160, accent: 180 }, // Mint/Cyan
};