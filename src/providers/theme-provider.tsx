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
  background: "oklch(1.0000 0 0)",
  foreground: "oklch(0.2686 0 0)",
  card: "oklch(1.0000 0 0)",
  cardForeground: "oklch(0.2686 0 0)",
  popover: "oklch(1.0000 0 0)",
  popoverForeground: "oklch(0.2686 0 0)",
  primary: "oklch(0.5410 0.2120 265.7540)", // Purple similar to #7047EB
  primaryForeground: "oklch(1.0000 0 0)",
  secondary: "oklch(0.9670 0.0029 264.5419)",
  secondaryForeground: "oklch(0.4461 0.0263 256.8018)",
  muted: "oklch(0.9846 0.0017 247.8389)",
  mutedForeground: "oklch(0.5510 0.0234 264.3637)",
  accent: "oklch(0.9869 0.0214 95.2774)",
  accentForeground: "oklch(0.4732 0.1247 46.2007)",
  destructive: "oklch(0.6368 0.2078 25.3313)",
  destructiveForeground: "oklch(1.0000 0 0)",
  border: "oklch(0.9276 0.0058 264.5313)",
  input: "oklch(0.9276 0.0058 264.5313)",
  ring: "oklch(0.5410 0.2120 265.7540)",
  chart1: "oklch(0.5410 0.2120 265.7540)",
  chart2: "oklch(0.6658 0.1574 58.3183)",
  chart3: "oklch(0.5553 0.1455 48.9975)",
  chart4: "oklch(0.4732 0.1247 46.2007)",
  chart5: "oklch(0.4137 0.1054 45.9038)",
  sidebar: "oklch(0.9846 0.0017 247.8389)",
  sidebarForeground: "oklch(0.2686 0 0)",
  sidebarPrimary: "oklch(0.5410 0.2120 265.7540)",
  sidebarPrimaryForeground: "oklch(1.0000 0 0)",
  sidebarAccent: "oklch(0.9869 0.0214 95.2774)",
  sidebarAccentForeground: "oklch(0.4732 0.1247 46.2007)",
  sidebarBorder: "oklch(0.9276 0.0058 264.5313)",
  sidebarRing: "oklch(0.5410 0.2120 265.7540)",
  fontSans: "Inter, ui-sans-serif, system-ui, sans-serif",
  fontSerif: "ui-serif, Georgia, serif",
  fontMono: "ui-monospace, monospace",
  radius: "0.5rem",
};

/**
 * Default dark theme tokens
 */
const defaultDarkTokens: ThemeTokens = {
  background: "oklch(0.2046 0 0)",
  foreground: "oklch(0.9219 0 0)",
  card: "oklch(0.2686 0 0)",
  cardForeground: "oklch(0.9219 0 0)",
  popover: "oklch(0.2686 0 0)",
  popoverForeground: "oklch(0.9219 0 0)",
  primary: "oklch(0.5410 0.2120 265.7540)",
  primaryForeground: "oklch(1.0000 0 0)",
  secondary: "oklch(0.2686 0 0)",
  secondaryForeground: "oklch(0.9219 0 0)",
  muted: "oklch(0.2393 0 0)",
  mutedForeground: "oklch(0.7155 0 0)",
  accent: "oklch(0.4732 0.1247 46.2007)",
  accentForeground: "oklch(0.9243 0.1151 95.7459)",
  destructive: "oklch(0.6368 0.2078 25.3313)",
  destructiveForeground: "oklch(1.0000 0 0)",
  border: "oklch(0.3715 0 0)",
  input: "oklch(0.3715 0 0)",
  ring: "oklch(0.5410 0.2120 265.7540)",
  chart1: "oklch(0.8369 0.1644 84.4286)",
  chart2: "oklch(0.6658 0.1574 58.3183)",
  chart3: "oklch(0.4732 0.1247 46.2007)",
  chart4: "oklch(0.5553 0.1455 48.9975)",
  chart5: "oklch(0.4732 0.1247 46.2007)",
  sidebar: "oklch(0.1684 0 0)",
  sidebarForeground: "oklch(0.9219 0 0)",
  sidebarPrimary: "oklch(0.5410 0.2120 265.7540)",
  sidebarPrimaryForeground: "oklch(1.0000 0 0)",
  sidebarAccent: "oklch(0.4732 0.1247 46.2007)",
  sidebarAccentForeground: "oklch(0.9243 0.1151 95.7459)",
  sidebarBorder: "oklch(0.3715 0 0)",
  sidebarRing: "oklch(0.5410 0.2120 265.7540)",
  fontSans: "Inter, ui-sans-serif, system-ui, sans-serif",
  fontSerif: "ui-serif, Georgia, serif",
  fontMono: "ui-monospace, monospace",
  radius: "0.5rem",
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
}: ThemeProviderProps) {
  // Initialize mode from storage or default
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (storageKey && typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
    }
    return defaultMode;
  });

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
      setModeState(newMode);
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
