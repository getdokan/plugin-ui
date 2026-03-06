# @wedevs/plugin-ui

Scoped, themeable React component library for WordPress plugins. Built on ShadCN patterns, Tailwind CSS v4, and Base-UI primitives.

## Architecture

```
src/
├── components/
│   ├── ui/              # Core ShadCN-style components (150+ exports)
│   ├── settings/        # Schema-driven settings system
│   └── wordpress/       # WordPress integration (Layout, DataViews)
├── providers/           # ThemeProvider (CSS variable injection)
├── themes/              # Built-in theme presets
├── hooks/               # useMobile, useWindowDimensions
└── lib/                 # Utilities (cn, renderIcon, WpMedia, wordpress-date)
```

## Import Patterns

```tsx
// Main entry (includes styles)
import { Settings, Button, ThemeProvider } from '@wedevs/plugin-ui';

// Sub-path exports
import { Settings } from '@wedevs/plugin-ui/settings';
import { Button, Input } from '@wedevs/plugin-ui/components/ui';
import { ThemeProvider } from '@wedevs/plugin-ui/providers';
import { defaultTheme, createTheme } from '@wedevs/plugin-ui/themes';
import { cn } from '@wedevs/plugin-ui/utils';

// Styles (import in your entry point)
import '@wedevs/plugin-ui/styles.css';
```

## CSS Setup (Tailwind v4)

```css
@import "tailwindcss";
@import "@wedevs/plugin-ui/styles.css" layer(plugin-ui);
```

## Settings System

Schema-driven settings page with hierarchical navigation, dependency evaluation, validation, and WordPress hook extensibility.

### Element Hierarchy

`page` → `subpage` → `tab` → `section` → `subsection` → `field` / `fieldgroup`

### Basic Usage

```tsx
import { Settings } from '@wedevs/plugin-ui';

<Settings
  schema={settingsSchema}        // SettingsElement[] (flat or hierarchical)
  values={values}                // Record<string, any> keyed by dependency_key
  onChange={(scopeId, key, value) => {
    setValues(prev => ({ ...prev, [key]: value }));
  }}
  onSave={async (scopeId, treeValues, flatValues) => {
    // treeValues: nested object built from dot-separated keys
    //   e.g. { dokan: { general: { store_name: "..." } } }
    // flatValues: original flat dot-keyed values
    //   e.g. { "dokan.general.store_name": "..." }
    await api.post(`/settings/${scopeId}`, treeValues);
  }}
  renderSaveButton={({ dirty, onSave }) => (
    <Button onClick={onSave} disabled={!dirty}>Save</Button>
  )}
  hookPrefix="my_plugin"         // WordPress filter hook prefix
  applyFilters={applyFilters}    // @wordpress/hooks applyFilters for field extensibility
/>
```

### Key Concepts

- **`dependency_key`**: Unique key on each field element, used as the key in `values` and `flatValues`
- **Dependencies**: Elements can conditionally show/hide based on other field values via `dependencies` array
- **Validation**: Per-field `validations` array with rules and error messages
- **Dirty tracking**: Per-scope (subpage/page) dirty state; resets only on successful save
- **Error handling**: If `onSave` throws `{ errors: { fieldKey: "message" } }`, errors display on the relevant fields
- **Extensibility**: `applyFilters` enables WordPress hooks like `{hookPrefix}_settings_{variant}_field`

### Settings Hooks

```tsx
import { useSettings } from '@wedevs/plugin-ui';

const {
  values,              // All current field values
  activePage,          // Current page element
  activeSubpage,       // Current subpage element (if any)
  activeTab,           // Current tab element (if any)
  isPageDirty,         // (pageId) => boolean
  getPageValues,       // (pageId) => Record<string, any>
  errors,              // Record<string, string> validation errors
} = useSettings();
```

## Theme System

```tsx
import { ThemeProvider, createTheme } from '@wedevs/plugin-ui';

// Use a built-in preset
<ThemeProvider theme={defaultTheme}>
  <App />
</ThemeProvider>

// Create a custom theme
const myTheme = createTheme({
  primary: '220 90% 56%',        // HSL values (without hsl() wrapper)
  background: '0 0% 100%',
  foreground: '0 0% 3.9%',
  // ... see ThemeTokens type for all available tokens
});
```

Built-in presets: `defaultTheme`, `slateTheme`, `amberMinimalTheme`, `t3ChatTheme`, `midnightBloomTheme`, `bubblegumTheme`, `cyberpunkTheme`, `twitterTheme` (each with a dark variant).

## UI Components

### Form
`Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `DatePicker`, `DateRangePicker`, `Calendar`, `CurrencyInput`, `InputOTP`, `RichTextEditor`, `FileUpload`

Card variants: `CheckboxCard`, `RadioCard`, `SwitchCard`
Labeled variants: `LabeledCheckbox`, `LabeledRadio`, `LabeledSwitch`

### Layout
`Card`, `Tabs`, `Separator`, `ScrollArea`, `Layout` (WordPress sidebar+content), `Sidebar` (shadcn primitives), `Field` (form control wrapper with label, description, error)

### Data Display
`Badge`, `Avatar`, `AvatarGroup`, `Progress`, `CircularProgress`, `Skeleton`, `Spinner`, `Thumbnail`, `DataViews` (WordPress DataViews wrapper)

### Overlay
`Modal`, `Sheet`, `Popover`, `Tooltip`, `DropdownMenu`, `AlertDialog`, `Toaster` (sonner toast)

### Feedback
`Alert`, `Notice`, `toast()` (from sonner)

### WordPress-Specific
`Layout` (sidebar layout with WordPress hook integration), `DataViews` (wraps `@wordpress/dataviews` with filter hooks), `LayoutMenu` (navigation menu)

## WordPress Integration

### Layout Component

```tsx
import { Layout, LayoutHeader, LayoutBody, LayoutSidebar, LayoutMain } from '@wedevs/plugin-ui';

<Layout namespace="my-plugin">
  <LayoutHeader>Header</LayoutHeader>
  <LayoutBody>
    <LayoutSidebar menuItems={menuItems} />
    <LayoutMain>Content</LayoutMain>
  </LayoutBody>
</Layout>
```

### DataViews Component

```tsx
import { DataViews } from '@wedevs/plugin-ui';

<DataViews
  namespace="my-plugin"
  data={items}
  fields={fields}
  actions={actions}
  paginationInfo={paginationInfo}
/>
```

Supports WordPress filter hooks: `{snakeNamespace}_dataviews_{elementName}`

## Conventions

- **Composition pattern**: All components use compound component pattern (e.g., `Card` + `CardHeader` + `CardContent`)
- **`cn()` utility**: Use for merging Tailwind classes — combines `clsx` + `tailwind-merge`
- **`Field` wrapper**: Use to wrap form controls with consistent label, description, and error display
- **No WordPress dependency in UI components**: Only `Layout`, `DataViews`, and `Settings` (via `applyFilters`) touch WordPress APIs
- **Externals**: React, ReactDOM, and WordPress packages (`@wordpress/components`, `@wordpress/dataviews`, `@wordpress/hooks`, `@wordpress/i18n`, `@wordpress/date`) are externalized — consumers must provide them

## Before Committing & Pushing

GitHub CI runs these checks on PRs to `main`. Run them locally before pushing to avoid failures:

```bash
npm run lint          # ESLint (src/**/*.{ts,tsx})
npm run typecheck     # tsc --noEmit
```

Both must pass. The CI pipeline (`.github/workflows/ci.yml`) runs these on `ubuntu-latest` with Node 24.

## Documentation

- `src/components/settings/Settings.mdx` — Full settings API reference
- `DEVELOPER_GUIDE.md` — WordPress integration guide
- `src/DeveloperGuide.mdx` — Storybook developer guide
