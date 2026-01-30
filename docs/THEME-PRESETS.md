# Theme Presets

plugin-ui ships with **theme presets** — ready-made `ThemeTokens` objects you can pass to `ThemeProvider` for consistent branding without defining every variable yourself.

## Importing presets

Presets are exported from the main package and from the themes subpath:

```tsx
// From main entry
import {
  ThemeProvider,
  defaultTheme,
  defaultDarkTheme,
  dokanTheme,
  dokanDarkTheme,
  blueTheme,
  blueDarkTheme,
  greenTheme,
  greenDarkTheme,
  amberTheme,
  amberDarkTheme,
  slateTheme,
  slateDarkTheme,
  createTheme,
  createDarkTheme,
} from "@wedevs/plugin-ui";

// Or from themes subpath
import {
  defaultTheme,
  dokanTheme,
  createTheme,
} from "@wedevs/plugin-ui/themes";
```

## Built-in presets

| Preset | Description | Use case |
|--------|-------------|----------|
| **defaultTheme** / **defaultDarkTheme** | Purple primary, neutral base | Generic / fallback |
| **dokanTheme** / **dokanDarkTheme** | Purple (#7047EB), smaller radius | Dokan / marketplace |
| **blueTheme** / **blueDarkTheme** | Blue primary | WeMail, communication |
| **greenTheme** / **greenDarkTheme** | Green primary | Growth, success, nature |
| **amberTheme** / **amberDarkTheme** | Amber/orange primary | Warm, alerts |
| **slateTheme** / **slateDarkTheme** | Slate/neutral primary | Minimal, professional |

Each preset overrides only a subset of tokens (typically `primary`, `primaryForeground`, `ring`, `radius`). Light presets merge with plugin-ui’s default light tokens; dark presets merge with `defaultDarkTheme`.

## Using presets with ThemeProvider

```tsx
import { ThemeProvider, dokanTheme, dokanDarkTheme } from "@wedevs/plugin-ui";

function App() {
  return (
    <ThemeProvider
      pluginId="dokan"
      tokens={dokanTheme}
      darkTokens={dokanDarkTheme}
    >
      {/* Your app */}
    </ThemeProvider>
  );
}
```

## Creating custom themes from presets

Use **createTheme** (light) and **createDarkTheme** (dark) to start from a base and override only what you need:

```tsx
import { createTheme, createDarkTheme, blueTheme, blueDarkTheme } from "@wedevs/plugin-ui";

// Extend a preset
const myTheme = createTheme({
  ...blueTheme,
  primary: "oklch(0.55 0.22 350)", // Your brand pink
  radius: "0.375rem",
});

const myDarkTheme = createDarkTheme({
  ...blueDarkTheme,
  primary: "oklch(0.75 0.18 350)",
});
```

**createTheme** merges your tokens over `defaultTheme`.  
**createDarkTheme** merges over `defaultDarkTheme`.  
Spreading a preset (e.g. `...blueTheme`) then overriding specific keys is the usual pattern.

## Defining a theme from scratch

You can pass any `ThemeTokens` object. For the full list of tokens and how they map to CSS, see [VARIABLES-MAPPING.md](./VARIABLES-MAPPING.md). Minimal example:

```tsx
const customTheme = {
  primary: "oklch(0.62 0.21 350)",
  primaryForeground: "oklch(1 0 0)",
  ring: "oklch(0.62 0.21 350)",
  radius: "0.5rem",
};
```

## Summary

- Use **presets** for quick, consistent branding (Dokan, WeMail, green, amber, slate, default).
- Use **createTheme** / **createDarkTheme** to extend defaults or a preset with a few overrides.
- Use **ThemeProvider** `tokens` and `darkTokens` with presets or custom `ThemeTokens` so your app respects the theme and variable mapping.
