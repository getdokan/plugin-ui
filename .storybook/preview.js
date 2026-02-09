import React from "react";
import { ThemeProvider } from "../src/providers";
import * as Themes from "../src/themes";
import "../src/styles.css";
import { withThemeByClassName } from "@storybook/addon-themes";

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
        { value: 'dokan', title: 'Dokan' },
        { value: 'blue', title: 'Blue' },
        { value: 'green', title: 'Green' },
        { value: 'amber', title: 'Amber' },
        { value: 'slate', title: 'Slate' },
      ],
      showName: true,
    },
  },
};

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
  (Story, context) => {
    const { brand } = context.globals;
    const mode = context.globals.theme || 'light';
    
    const themeMap = {
        default: { tokens: Themes.defaultTheme, darkTokens: Themes.defaultDarkTheme },
        dokan: { tokens: Themes.dokanTheme, darkTokens: Themes.dokanDarkTheme },
        blue: { tokens: Themes.blueTheme, darkTokens: Themes.blueDarkTheme },
        green: { tokens: Themes.greenTheme, darkTokens: Themes.greenDarkTheme },
        amber: { tokens: Themes.amberTheme, darkTokens: Themes.amberDarkTheme },
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
