import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Theme token definitions following ShadCN/tweakcn pattern.
 * All color values should be valid CSS color values (oklch, hsl, rgb, hex).
 *
 * @example
 * ```tsx
 * const myTheme: ThemeTokens = {
 *   primary: "oklch(0.5410 0.2120 265.7540)",
 *   primaryForeground: "oklch(1.0000 0 0)",
 *   success: "oklch(0.6470 0.1780 145.0000)",
 *   radius: "0.5rem",
 * };
 *
 * <ThemeProvider pluginId="my-plugin" tokens={myTheme}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export interface ThemeTokens {
  /* ========================================
     Core Colors
     ======================================== */

  /** Page/app background color. shadcn: `--background` */
  background?: string;
  /** Default text color. shadcn: `--foreground` */
  foreground?: string;

  /* ========================================
     Card
     ======================================== */

  /** Card background color. shadcn: `--card` */
  card?: string;
  /** Card text color. shadcn: `--card-foreground` */
  cardForeground?: string;

  /* ========================================
     Popover
     ======================================== */

  /** Popover/dropdown background. shadcn: `--popover` */
  popover?: string;
  /** Popover text color. shadcn: `--popover-foreground` */
  popoverForeground?: string;

  /* ========================================
     Primary - Main brand color
     ======================================== */

  /** Primary brand color (buttons, links, etc.). shadcn: `--primary` */
  primary?: string;
  /** Text color on primary backgrounds. shadcn: `--primary-foreground` */
  primaryForeground?: string;

  /* ========================================
     Secondary
     ======================================== */

  /** Secondary/muted action color. shadcn: `--secondary` */
  secondary?: string;
  /** Text on secondary backgrounds. shadcn: `--secondary-foreground` */
  secondaryForeground?: string;

  /* ========================================
     Muted - Subtle backgrounds & text
     ======================================== */

  /** Muted/subtle background. shadcn: `--muted` */
  muted?: string;
  /** Muted/subtle text (descriptions, placeholders). shadcn: `--muted-foreground` */
  mutedForeground?: string;

  /* ========================================
     Accent - Highlights
     ======================================== */

  /** Accent color for highlights. shadcn: `--accent` */
  accent?: string;
  /** Text on accent backgrounds. shadcn: `--accent-foreground` */
  accentForeground?: string;

  /* ========================================
     Status Colors
     ======================================== */

  /** Destructive/error/danger color. shadcn: `--destructive` */
  destructive?: string;
  /** Text on destructive backgrounds. shadcn: `--destructive-foreground` */
  destructiveForeground?: string;

  /** Success color (green). shadcn: `--success` */
  success?: string;
  /** Text on success backgrounds. shadcn: `--success-foreground` */
  successForeground?: string;

  /** Warning color (yellow/amber). shadcn: `--warning` */
  warning?: string;
  /** Text on warning backgrounds. shadcn: `--warning-foreground` */
  warningForeground?: string;

  /** Info color (blue). shadcn: `--info` */
  info?: string;
  /** Text on info backgrounds. shadcn: `--info-foreground` */
  infoForeground?: string;

  /* ========================================
     Border, Input & Focus Ring
     ======================================== */

  /** Default border color. shadcn: `--border` */
  border?: string;
  /** Input field border color. shadcn: `--input` */
  input?: string;
  /** Focus ring color. shadcn: `--ring` */
  ring?: string;

  /* ========================================
     Chart Colors
     ======================================== */

  /** Chart color 1. shadcn: `--chart-1` */
  chart1?: string;
  /** Chart color 2. shadcn: `--chart-2` */
  chart2?: string;
  /** Chart color 3. shadcn: `--chart-3` */
  chart3?: string;
  /** Chart color 4. shadcn: `--chart-4` */
  chart4?: string;
  /** Chart color 5. shadcn: `--chart-5` */
  chart5?: string;

  /* ========================================
     Sidebar (for admin layouts)
     ======================================== */

  /** Sidebar background. shadcn: `--sidebar` */
  sidebar?: string;
  /** Sidebar text color. shadcn: `--sidebar-foreground` */
  sidebarForeground?: string;
  /** Sidebar primary/active item. shadcn: `--sidebar-primary` */
  sidebarPrimary?: string;
  /** Text on sidebar primary. shadcn: `--sidebar-primary-foreground` */
  sidebarPrimaryForeground?: string;
  /** Sidebar accent/hover. shadcn: `--sidebar-accent` */
  sidebarAccent?: string;
  /** Text on sidebar accent. shadcn: `--sidebar-accent-foreground` */
  sidebarAccentForeground?: string;
  /** Sidebar border color. shadcn: `--sidebar-border` */
  sidebarBorder?: string;
  /** Sidebar focus ring. shadcn: `--sidebar-ring` */
  sidebarRing?: string;

  /* ========================================
     Typography
     ======================================== */

  /** Sans-serif font family. shadcn: `--font-sans` */
  fontSans?: string;
  /** Serif font family. shadcn: `--font-serif` */
  fontSerif?: string;
  /** Monospace font family. shadcn: `--font-mono` */
  fontMono?: string;

  /* ========================================
     Border Radius
     ======================================== */

  /** Base border radius (e.g., "0.5rem"). shadcn: `--radius` */
  radius?: string;

  /* ========================================
     Custom Tokens
     ======================================== */

  /** Allow additional custom tokens */
  [key: string]: string | undefined;
}

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  pluginId: string;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  tokens: ThemeTokens;
  resolvedMode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Convert camelCase to kebab-case for CSS variable names
 */
function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * Convert theme tokens to CSS custom properties (camelCase → --kebab-case for shadcn).
 */
function tokensToCssVariables(tokens: ThemeTokens): Record<string, string> {
  const variables: Record<string, string> = {};

  Object.entries(tokens).forEach(([key, value]) => {
    if (value !== undefined) {
      const cssKey = `--${toKebabCase(key)}`;
      variables[cssKey] = value;
    }
  });

  return variables;
}

export interface ThemeProviderProps {
  /**
   * Unique plugin identifier (e.g., "dokan", "wemail", "appsero")
   * This is used for CSS scoping via data-pui-plugin attribute
   */
  pluginId: string;

  /**
   * Theme tokens to override defaults
   */
  tokens?: ThemeTokens;

  /**
   * Dark mode tokens (optional, for dark mode support)
   */
  darkTokens?: ThemeTokens;

  /**
   * Initial theme mode
   * @default 'light'
   */
  defaultMode?: ThemeMode;

  /**
   * Controlled theme mode. If provided, the internal state is ignored.
   */
  mode?: ThemeMode;

  /**
   * Storage key for persisting theme preference
   * Set to false to disable persistence
   */
  storageKey?: string | false;

  /**
   * Child components
   */
  children: ReactNode;

  /**
   * Additional CSS classes for the root container
   */
  className?: string;

  /**
   * Additional inline styles for the root container
   */
  style?: React.CSSProperties;
}

/**
 * Default light theme tokens following tweakcn pattern
 */
const defaultLightTokens: ThemeTokens = {
  background: "oklch(1 0 0)",
  foreground: "oklch(0.1450 0 0)",
  card: "oklch(1 0 0)",
  cardForeground: "oklch(0.1450 0 0)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.1450 0 0)",
  primary: "oklch(0.2050 0 0)",
  primaryForeground: "oklch(0.9850 0 0)",
  secondary: "oklch(0.9700 0 0)",
  secondaryForeground: "oklch(0.2050 0 0)",
  muted: "oklch(0.9700 0 0)",
  mutedForeground: "oklch(0.5560 0 0)",
  accent: "oklch(0.9700 0 0)",
  accentForeground: "oklch(0.2050 0 0)",
  destructive: "oklch(0.5770 0.2450 27.3250)",
  destructiveForeground: "oklch(1 0 0)",
  border: "oklch(0.9220 0 0)",
  input: "oklch(0.9220 0 0)",
  ring: "oklch(0.7080 0 0)",
  chart1: "oklch(0.8100 0.1000 252)",
  chart2: "oklch(0.6200 0.1900 260)",
  chart3: "oklch(0.5500 0.2200 263)",
  chart4: "oklch(0.4900 0.2200 264)",
  chart5: "oklch(0.4200 0.1800 266)",
  sidebar: "oklch(0.9850 0 0)",
  sidebarForeground: "oklch(0.1450 0 0)",
  sidebarPrimary: "oklch(0.2050 0 0)",
  sidebarPrimaryForeground: "oklch(0.9850 0 0)",
  sidebarAccent: "oklch(0.9700 0 0)",
  sidebarAccentForeground: "oklch(0.2050 0 0)",
  sidebarBorder: "oklch(0.9220 0 0)",
  sidebarRing: "oklch(0.7080 0 0)",
  fontSans:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  fontSerif: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
  fontMono:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  radius: "0.625rem",
  "shadow-2xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
  "shadow-xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
  "shadow-sm":
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
  shadow: "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
  "shadow-md":
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)",
  "shadow-lg":
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)",
  "shadow-xl":
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)",
  "shadow-2xl": "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
};

/**
 * Default dark theme tokens
 */
const defaultDarkTokens: ThemeTokens = {
  background: "oklch(0.1450 0 0)",
  foreground: "oklch(0.9850 0 0)",
  card: "oklch(0.2050 0 0)",
  cardForeground: "oklch(0.9850 0 0)",
  popover: "oklch(0.2690 0 0)",
  popoverForeground: "oklch(0.9850 0 0)",
  primary: "oklch(0.9220 0 0)",
  primaryForeground: "oklch(0.2050 0 0)",
  secondary: "oklch(0.2690 0 0)",
  secondaryForeground: "oklch(0.9850 0 0)",
  muted: "oklch(0.2690 0 0)",
  mutedForeground: "oklch(0.7080 0 0)",
  accent: "oklch(0.3710 0 0)",
  accentForeground: "oklch(0.9850 0 0)",
  destructive: "oklch(0.7040 0.1910 22.2160)",
  destructiveForeground: "oklch(0.9850 0 0)",
  border: "oklch(0.2750 0 0)",
  input: "oklch(0.3250 0 0)",
  ring: "oklch(0.5560 0 0)",
  chart1: "oklch(0.8100 0.1000 252)",
  chart2: "oklch(0.6200 0.1900 260)",
  chart3: "oklch(0.5500 0.2200 263)",
  chart4: "oklch(0.4900 0.2200 264)",
  chart5: "oklch(0.4200 0.1800 266)",
  sidebar: "oklch(0.2050 0 0)",
  sidebarForeground: "oklch(0.9850 0 0)",
  sidebarPrimary: "oklch(0.4880 0.2430 264.3760)",
  sidebarPrimaryForeground: "oklch(0.9850 0 0)",
  sidebarAccent: "oklch(0.2690 0 0)",
  sidebarAccentForeground: "oklch(0.9850 0 0)",
  sidebarBorder: "oklch(0.2750 0 0)",
  sidebarRing: "oklch(0.4390 0 0)",
  fontSans:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  fontSerif: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
  fontMono:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  radius: "0.625rem",
  "shadow-2xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
  "shadow-xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
  "shadow-sm":
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
  shadow: "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
  "shadow-md":
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)",
  "shadow-lg":
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)",
  "shadow-xl":
    "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)",
  "shadow-2xl": "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
};

/**
 * ThemeProvider component for scoped theming across plugins
 *
 * @example
 * ```tsx
 * import { ThemeProvider } from '@wedevs/plugin-ui';
 *
 * const dokanTokens = {
 *   primary: 'oklch(0.5410 0.2120 265.7540)', // Purple
 *   radius: '0.375rem',
 * };
 *
 * function DokanApp() {
 *   return (
 *     <ThemeProvider pluginId="dokan" tokens={dokanTokens}>
 *       <YourComponents />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export function ThemeProvider({
  pluginId,
  tokens = {},
  darkTokens = {},
  defaultMode = "light",
  storageKey = `pui-theme-${pluginId}`,
  children,
  className = "",
  style = {},
  mode: controlledMode,
}: ThemeProviderProps) {
  // Initialize mode from storage or default
  const [internalMode, setInternalModeState] = useState<ThemeMode>(() => {
    if (storageKey && typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
    }
    return defaultMode;
  });

  // The actual mode being used
  const mode = controlledMode !== undefined ? controlledMode : internalMode;

  // Track system preference
  const [systemPreference, setSystemPreference] = useState<"light" | "dark">(
    () => {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return "light";
    },
  );

  // Listen to system preference changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Resolve actual mode
  const resolvedMode = mode === "system" ? systemPreference : mode;

  // Set mode with persistence
  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setInternalModeState(newMode);
      if (storageKey && typeof window !== "undefined") {
        localStorage.setItem(storageKey, newMode);
      }
    },
    [storageKey],
  );

  // Merge tokens with defaults based on resolved mode
  const mergedTokens = useMemo(() => {
    const baseTokens =
      resolvedMode === "dark" ? defaultDarkTokens : defaultLightTokens;
    const customTokens = resolvedMode === "dark" ? darkTokens : tokens;

    return {
      ...baseTokens,
      ...customTokens,
    };
  }, [tokens, darkTokens, resolvedMode]);

  // Convert tokens to CSS variables
  const cssVariables = useMemo(
    () => tokensToCssVariables(mergedTokens),
    [mergedTokens],
  );

  // Context value
  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      pluginId,
      mode,
      setMode,
      tokens: mergedTokens,
      resolvedMode,
    }),
    [pluginId, mode, setMode, mergedTokens, resolvedMode],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        data-pui-plugin={pluginId}
        data-pui-mode={resolvedMode}
        className={`pui-root ${
          resolvedMode === "dark" ? "dark" : ""
        } ${className}`.trim()}
        style={{ ...cssVariables, ...style }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { mode, setMode, tokens, pluginId } = useTheme();
 *
 *   return (
 *     <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
 *       Toggle theme
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

/**
 * Hook to check if component is within a ThemeProvider
 */
export function useThemeOptional(): ThemeContextValue | null {
  return useContext(ThemeContext);
}

export default ThemeProvider;
