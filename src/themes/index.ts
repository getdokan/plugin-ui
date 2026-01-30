import type { ThemeTokens } from "../providers/theme-provider";

/**
 * Default theme - Purple brand color (similar to original plugin-ui)
 */
export const defaultTheme: ThemeTokens = {
  primary: "oklch(0.5410 0.2120 265.7540)",
  primaryForeground: "oklch(1.0000 0 0)",
  ring: "oklch(0.5410 0.2120 265.7540)",
  radius: "0.5rem",
};

/**
 * Default dark theme tokens
 */
export const defaultDarkTheme: ThemeTokens = {
  background: "oklch(0.1450 0.0140 285.7500)",
  foreground: "oklch(0.9850 0.0030 264.5000)",
  card: "oklch(0.1450 0.0140 285.7500)",
  cardForeground: "oklch(0.9850 0.0030 264.5000)",
  primary: "oklch(0.6230 0.2000 265.7540)",
  primaryForeground: "oklch(0.1450 0.0140 285.7500)",
  secondary: "oklch(0.2690 0.0150 264.5419)",
  secondaryForeground: "oklch(0.9850 0.0030 264.5000)",
  muted: "oklch(0.2690 0.0150 264.5419)",
  mutedForeground: "oklch(0.7110 0.0200 264.3637)",
  border: "oklch(0.3690 0.0150 264.5313)",
  input: "oklch(0.3690 0.0150 264.5313)",
  ring: "oklch(0.6230 0.2000 265.7540)",
};

/**
 * Dokan theme - Purple brand
 */
export const dokanTheme: ThemeTokens = {
  primary: "oklch(0.5410 0.2120 265.7540)", // #7047EB
  primaryForeground: "oklch(1.0000 0 0)",
  ring: "oklch(0.5410 0.2120 265.7540)",
  radius: "0.375rem",
};

/**
 * Dokan dark theme
 */
export const dokanDarkTheme: ThemeTokens = {
  ...defaultDarkTheme,
  primary: "oklch(0.6230 0.2000 265.7540)",
  ring: "oklch(0.6230 0.2000 265.7540)",
};

/**
 * Blue theme - For plugins like WeMail
 */
export const blueTheme: ThemeTokens = {
  primary: "oklch(0.6230 0.2140 255.0900)", // Blue
  primaryForeground: "oklch(1.0000 0 0)",
  ring: "oklch(0.6230 0.2140 255.0900)",
  radius: "0.5rem",
};

/**
 * Blue dark theme
 */
export const blueDarkTheme: ThemeTokens = {
  ...defaultDarkTheme,
  primary: "oklch(0.7000 0.1800 255.0900)",
  ring: "oklch(0.7000 0.1800 255.0900)",
};

/**
 * Green theme - For plugins with nature/growth branding
 */
export const greenTheme: ThemeTokens = {
  primary: "oklch(0.6470 0.1780 145.0000)", // Green
  primaryForeground: "oklch(1.0000 0 0)",
  ring: "oklch(0.6470 0.1780 145.0000)",
  radius: "0.5rem",
};

/**
 * Green dark theme
 */
export const greenDarkTheme: ThemeTokens = {
  ...defaultDarkTheme,
  primary: "oklch(0.7200 0.1600 145.0000)",
  ring: "oklch(0.7200 0.1600 145.0000)",
};

/**
 * Orange/Amber theme - For warm branding
 */
export const amberTheme: ThemeTokens = {
  primary: "oklch(0.7690 0.1880 70.0800)", // Amber/Orange
  primaryForeground: "oklch(0.2100 0.0340 32.0000)",
  ring: "oklch(0.7690 0.1880 70.0800)",
  radius: "0.5rem",
};

/**
 * Amber dark theme
 */
export const amberDarkTheme: ThemeTokens = {
  ...defaultDarkTheme,
  primary: "oklch(0.8200 0.1600 70.0800)",
  ring: "oklch(0.8200 0.1600 70.0800)",
};

/**
 * Slate/Neutral theme - For minimal, professional look
 */
export const slateTheme: ThemeTokens = {
  primary: "oklch(0.3050 0.0170 264.5419)", // Slate
  primaryForeground: "oklch(1.0000 0 0)",
  ring: "oklch(0.3050 0.0170 264.5419)",
  radius: "0.375rem",
};

/**
 * Slate dark theme
 */
export const slateDarkTheme: ThemeTokens = {
  ...defaultDarkTheme,
  primary: "oklch(0.7110 0.0200 264.3637)",
  ring: "oklch(0.7110 0.0200 264.3637)",
};

/**
 * Helper to create a custom theme with defaults filled in
 */
export function createTheme(tokens: Partial<ThemeTokens>): ThemeTokens {
  return {
    ...defaultTheme,
    ...tokens,
  };
}

/**
 * Helper to create dark theme from light theme
 */
export function createDarkTheme(tokens: Partial<ThemeTokens>): ThemeTokens {
  return {
    ...defaultDarkTheme,
    ...tokens,
  };
}

export type {
    ThemeTokens
};

