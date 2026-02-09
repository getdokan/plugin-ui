import React from "react";
import { ThemeProvider } from "../src/providers";
import * as Themes from "../src/themes";
import "../src/styles.css";

// Optional: theme-by-class-name decorator (light/dark on html); skip if addon not installed
let withThemeByClassName = null;
try {
  // eslint-disable-next-line global-require -- optional addon
  withThemeByClassName = require("@storybook/addon-themes").withThemeByClassName;
} catch {
  // Addon not available; decorators below will omit it
}

// Ensure React is available in the story iframe
if (typeof window !== "undefined") {
  window.React = React;
}

export const parameters = {
  controls: {
    matchers: { color: /(background|color)$/i, date: /Date$/i },
    expanded: true,
  },
  layout: "centered",
  a11y: {
    test: "error",
  },
  viewport: {
    viewports: {
      mobile: {
        name: "Mobile",
        styles: { width: "375px", height: "667px" },
        type: "mobile",
      },
      tablet: {
        name: "Tablet",
        styles: { width: "768px", height: "1024px" },
        type: "tablet",
      },
      desktop: {
        name: "Desktop",
        styles: { width: "1280px", height: "800px" },
        type: "desktop",
      },
    },
  },
};

export const globalTypes = {
  brand: {
    name: 'Brand',
    description: 'Global brand theme',
    defaultValue: 'default',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'default', title: 'Default' },
        { value: 'amber-minimal', title: 'Amber Minimal' },
        { value: 't3-chat', title: 'T3 Chat' },
        { value: 'midnight-bloom', title: 'Midnight Bloom' },
        { value: 'bubblegum', title: 'Bubblegum' },
        { value: 'cyberpunk', title: 'Cyberpunk' },
        { value: 'twitter', title: 'Twitter' },
        { value: 'slate', title: 'Slate' },
      ],
      showName: true,
    },
  },
};

export const decorators = [
  ...(withThemeByClassName
    ? [
        withThemeByClassName({
          themes: { light: "light", dark: "dark" },
          defaultTheme: "light",
        }),
      ]
    : []),
  (Story, context) => {
    const { brand } = context.globals;
    const mode = context.globals.theme || 'light';
    
    const themeMap = {
        default: { tokens: Themes.defaultTheme, darkTokens: Themes.defaultDarkTheme },
        'amber-minimal': { tokens: Themes.amberMinimalTheme, darkTokens: Themes.amberMinimalDarkTheme },
        't3-chat': { tokens: Themes.t3ChatTheme, darkTokens: Themes.t3ChatDarkTheme },
        'midnight-bloom': { tokens: Themes.midnightBloomTheme, darkTokens: Themes.midnightBloomDarkTheme },
        'bubblegum': { tokens: Themes.bubblegumTheme, darkTokens: Themes.bubblegumDarkTheme },
        'cyberpunk': { tokens: Themes.cyberpunkTheme, darkTokens: Themes.cyberpunkDarkTheme },
        'twitter': { tokens: Themes.twitterTheme, darkTokens: Themes.twitterDarkTheme },
        slate: { tokens: Themes.slateTheme, darkTokens: Themes.slateDarkTheme },
    };
    
    const activeBrand = themeMap[brand] || themeMap.default;

    return React.createElement(
      ThemeProvider,
      { 
        pluginId: "storybook", 
        mode: mode,
        tokens: activeBrand.tokens,
        darkTokens: activeBrand.darkTokens,
      },
      React.createElement("div", { className: "bg-background text-foreground min-h-[200px] p-6" }, React.createElement(Story))
    );
  },
];
