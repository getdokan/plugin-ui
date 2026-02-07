import React from "react";
import { ThemeProvider } from "../src/providers";
import "../src/styles.css";

export const parameters = {
  controls: {
    matchers: { color: /(background|color)$/i, date: /Date$/i },
    expanded: true,
  },
  layout: "centered",
  // Accessibility (axe-core). See https://storybook.js.org/docs/writing-tests/accessibility-testing
  a11y: {
    config: {},
    options: {},
    // 'error' = fail tests on violations; 'todo' = warn only; 'off' = skip
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

export const decorators = [
  (Story) =>
    React.createElement(
      ThemeProvider,
      { pluginId: "storybook" },
      React.createElement("div", { className: "pui-root min-h-[200px] p-6" }, React.createElement(Story))
    ),
];
