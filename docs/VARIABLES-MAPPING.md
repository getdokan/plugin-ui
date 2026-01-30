# Variables Mapping

This document describes how design tokens and CSS variables are mapped across the plugin-ui theme system.

## Overview

The theme system has three layers:

1. **ThemeTokens (TypeScript)** — camelCase keys in `ThemeProvider` (e.g. `primaryForeground`)
2. **Base CSS variables** — kebab-case custom properties on `.pui-root` (e.g. `--primary-foreground`)
3. **Tailwind theme** — `@theme inline` mappings for utilities (e.g. `--color-primary-foreground: var(--primary-foreground)`)

---

## 1. ThemeTokens → Base CSS Variables

**Where:** `src/providers/theme-provider.tsx`

Theme tokens (JS object) are converted to CSS custom properties and applied as inline styles on the `.pui-root` container.

**Conversion rule:** camelCase → kebab-case with `--` prefix.

- Implemented by `toKebabCase()` and `tokensToCssVariables()`.
- Example: `primaryForeground` → `--primary-foreground`
- Chart tokens: `chart1` → `--chart-1`, `chart2` → `--chart-2`, etc.

| ThemeToken (camelCase) | CSS variable (base) |
|------------------------|---------------------|
| `background` | `--background` |
| `foreground` | `--foreground` |
| `card` | `--card` |
| `cardForeground` | `--card-foreground` |
| `popover` | `--popover` |
| `popoverForeground` | `--popover-foreground` |
| `primary` | `--primary` |
| `primaryForeground` | `--primary-foreground` |
| `secondary` | `--secondary` |
| `secondaryForeground` | `--secondary-foreground` |
| `muted` | `--muted` |
| `mutedForeground` | `--muted-foreground` |
| `accent` | `--accent` |
| `accentForeground` | `--accent-foreground` |
| `destructive` | `--destructive` |
| `destructiveForeground` | `--destructive-foreground` |
| `success` | `--success` |
| `successForeground` | `--success-foreground` |
| `warning` | `--warning` |
| `warningForeground` | `--warning-foreground` |
| `info` | `--info` |
| `infoForeground` | `--info-foreground` |
| `border` | `--border` |
| `input` | `--input` |
| `ring` | `--ring` |
| `chart1` … `chart5` | `--chart-1` … `--chart-5` |
| `sidebar` | `--sidebar` |
| `sidebarForeground` | `--sidebar-foreground` |
| `sidebarPrimary` | `--sidebar-primary` |
| `sidebarPrimaryForeground` | `--sidebar-primary-foreground` |
| `sidebarAccent` | `--sidebar-accent` |
| `sidebarAccentForeground` | `--sidebar-accent-foreground` |
| `sidebarBorder` | `--sidebar-border` |
| `sidebarRing` | `--sidebar-ring` |
| `fontSans` | `--font-sans` |
| `fontSerif` | `--font-serif` |
| `fontMono` | `--font-mono` |
| `radius` | `--radius` |
| *(any custom key)* | `--<kebab-case>` |

**Modal:** When `Modal` renders in a portal (outside the main `ThemeProvider` tree), it creates its own `.pui-root` and copies the same token → CSS variable mapping so theme applies inside the modal. See `src/components/ui/modal.tsx` (CSS variable copy logic).

---

## 2. Base CSS Variables (defaults)

**Where:** `src/styles.css` (`.pui-root` and `.pui-root.dark`)

Default values for the base variables are defined in CSS. They are overridden when `ThemeProvider` passes `tokens` (and `darkTokens`), which are converted and applied as inline styles.

Base variables include:

- **Colors:** `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--success`, `--success-foreground`, `--warning`, `--warning-foreground`, `--info`, `--info-foreground`, `--border`, `--input`, `--ring`, `--chart-1` … `--chart-5`, `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`
- **Typography:** `--font-sans`, `--font-serif`, `--font-mono`
- **Radius:** `--radius`
- **Shadows:** `--shadow-2xs`, `--shadow-xs`, `--shadow-sm`, `--shadow`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-2xl`

---

## 3. Tailwind v4 theme mapping

**Where:** `src/styles.css` (`@theme inline { ... }`)

Tailwind v4 expects theme variables with specific names. The base variables are mapped into this theme so utility classes work.

### Colors

| Tailwind theme variable | Maps from (base) |
|------------------------|------------------|
| `--color-background` | `var(--background)` |
| `--color-foreground` | `var(--foreground)` |
| `--color-card` | `var(--card)` |
| `--color-card-foreground` | `var(--card-foreground)` |
| `--color-popover` | `var(--popover)` |
| `--color-popover-foreground` | `var(--popover-foreground)` |
| `--color-primary` | `var(--primary)` |
| `--color-primary-foreground` | `var(--primary-foreground)` |
| `--color-secondary` | `var(--secondary)` |
| `--color-secondary-foreground` | `var(--secondary-foreground)` |
| `--color-muted` | `var(--muted)` |
| `--color-muted-foreground` | `var(--muted-foreground)` |
| `--color-accent` | `var(--accent)` |
| `--color-accent-foreground` | `var(--accent-foreground)` |
| `--color-destructive` | `var(--destructive)` |
| `--color-destructive-foreground` | `var(--destructive-foreground)` |
| `--color-success` | `var(--success)` |
| `--color-success-foreground` | `var(--success-foreground)` |
| `--color-warning` | `var(--warning)` |
| `--color-warning-foreground` | `var(--warning-foreground)` |
| `--color-info` | `var(--info)` |
| `--color-info-foreground` | `var(--info-foreground)` |
| `--color-border` | `var(--border)` |
| `--color-input` | `var(--input)` |
| `--color-ring` | `var(--ring)` |
| `--color-chart-1` … `--color-chart-5` | `var(--chart-1)` … `var(--chart-5)` |
| `--color-sidebar` | `var(--sidebar)` |
| `--color-sidebar-foreground` | `var(--sidebar-foreground)` |
| `--color-sidebar-primary` | `var(--sidebar-primary)` |
| `--color-sidebar-primary-foreground` | `var(--sidebar-primary-foreground)` |
| `--color-sidebar-accent` | `var(--sidebar-accent)` |
| `--color-sidebar-accent-foreground` | `var(--sidebar-accent-foreground)` |
| `--color-sidebar-border` | `var(--sidebar-border)` |
| `--color-sidebar-ring` | `var(--sidebar-ring)` |

Usage examples: `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, `ring-ring`, etc.

### Typography

| Tailwind theme variable | Maps from (base) |
|------------------------|------------------|
| `--font-sans` | `var(--font-sans)` |
| `--font-serif` | `var(--font-serif)` |
| `--font-mono` | `var(--font-mono)` |

Usage: `font-sans`, `font-serif`, `font-mono`.

### Border radius

| Tailwind theme variable | Formula |
|------------------------|--------|
| `--radius-sm` | `calc(var(--radius) - 4px)` |
| `--radius-md` | `calc(var(--radius) - 2px)` |
| `--radius-lg` | `var(--radius)` |
| `--radius-xl` | `calc(var(--radius) + 4px)` |
| `--radius-2xl` | `calc(var(--radius) + 8px)` |

Usage: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`.

### Shadows

| Tailwind theme variable | Maps from (base) |
|------------------------|------------------|
| `--shadow-2xs` | `var(--shadow-2xs)` |
| `--shadow-xs` | `var(--shadow-xs)` |
| `--shadow-sm` | `var(--shadow-sm)` |
| `--shadow` | `var(--shadow)` |
| `--shadow-md` | `var(--shadow-md)` |
| `--shadow-lg` | `var(--shadow-lg)` |
| `--shadow-xl` | `var(--shadow-xl)` |
| `--shadow-2xl` | `var(--shadow-2xl)` |

Usage: `shadow-sm`, `shadow`, `shadow-md`, etc.

---

## Flow summary

```
ThemeTokens (JS)     →  tokensToCssVariables()  →  inline styles on .pui-root
                                                         ↓
                                              Base CSS variables (--primary, etc.)
                                                         ↓
                                              @theme inline in styles.css
                                                         ↓
                                              Tailwind theme (--color-primary, etc.)
                                                         ↓
                                              Utilities: bg-primary, text-foreground, rounded-md, …
```

**Custom tokens:** Any extra key on `ThemeTokens` is converted with the same rule (`camelCase` → `--kebab-case`) and set on `.pui-root`. To use them in Tailwind you must either reference `var(--your-token)` in CSS or extend the `@theme inline` block with the corresponding `--color-*` / other theme variable.
