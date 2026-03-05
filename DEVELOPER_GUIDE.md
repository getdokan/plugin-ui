# @wedevs/plugin-ui — Developer Guide

A ShadCN-style React component library built for WordPress plugins. Provides 50+ themed, accessible UI components powered by Tailwind CSS v4, `@base-ui/react` headless primitives, and first-class WordPress integration.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Setup](#project-setup)
  - [1. package.json](#1-packagejson)
  - [2. Webpack Configuration](#2-webpack-configuration)
  - [3. PostCSS Configuration](#3-postcss-configuration)
  - [4. TypeScript Configuration](#4-typescript-configuration)
  - [5. CSS Setup (Tailwind v4)](#5-css-setup-tailwind-v4)
  - [6. PHP Asset Enqueuing](#6-php-asset-enqueuing)
  - [7. React Entry Point](#7-react-entry-point)
- [ThemeProvider](#themeprovider)
  - [Theme Tokens](#theme-tokens)
  - [Dark Mode](#dark-mode)
  - [Built-in Theme Presets](#built-in-theme-presets)
- [Component Catalog](#component-catalog)
  - [Layout Components](#layout-components)
  - [Form Components](#form-components)
  - [Data Display Components](#data-display-components)
  - [Overlay Components](#overlay-components)
  - [Feedback Components](#feedback-components)
  - [Navigation Components](#navigation-components)
  - [WordPress-specific Components](#wordpress-specific-components)
- [WordPress Integration](#wordpress-integration)
  - [Layout System](#layout-system)
  - [Settings Page](#settings-page)
  - [File Upload (WP Media)](#file-upload-wp-media)
  - [Date/Calendar with WP Locale](#datecalendar-with-wp-locale)
  - [DataViews](#dataviews)
- [Pro Plugin / Add-on Architecture](#pro-plugin--add-on-architecture)
  - [Sharing plugin-ui via Webpack Externals](#sharing-plugin-ui-via-webpack-externals)
  - [Hook-based Extension Pattern](#hook-based-extension-pattern)
- [Utilities & Hooks](#utilities--hooks)
- [Re-exported Libraries](#re-exported-libraries)

---

## Quick Start

```tsx
import { ThemeProvider, Button, Card, CardHeader, CardTitle, CardContent } from '@wedevs/plugin-ui';
import '@wedevs/plugin-ui/styles.css';

function App() {
  return (
    <ThemeProvider pluginId="my-plugin">
      <Card>
        <CardHeader>
          <CardTitle>Hello World</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Click me</Button>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |
| WordPress | 6.4+ |
| `@wordpress/scripts` | 28+ |
| React | 18.2+ |
| Tailwind CSS | 4.x |

---

## Installation

```bash
# From the same monorepo / adjacent directory
npm install @wedevs/plugin-ui@file:../plugin-ui

# Or from npm (when published)
npm install @wedevs/plugin-ui
```

---

## Project Setup

### 1. package.json

```json
{
  "name": "my-wordpress-plugin",
  "dependencies": {
    "@wedevs/plugin-ui": "file:../plugin-ui",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.6.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.0",
    "@wordpress/scripts": "^28.0.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^4.1.0"
  },
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start"
  }
}
```

### 2. Webpack Configuration

Use `@wordpress/scripts` as the base, with custom entry points:

```js
// webpack.config.js
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
  ...defaultConfig,
  entry: {
    'my-plugin-app': path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    ...defaultConfig.output,
    filename: '[name].js',
  },
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.resolve?.alias,
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: [
      ...(defaultConfig.resolve?.extensions || []),
      '.ts', '.tsx',
    ],
  },
};
```

### 3. PostCSS Configuration

```js
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### 4. TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build"]
}
```

### 5. CSS Setup (Tailwind v4)

Create your main CSS file. This is the most critical configuration step:

```css
/* src/styles/main.css */

/* 1. Import Tailwind */
@import "tailwindcss";

/* 2. Import plugin-ui component styles */
@import '@wedevs/plugin-ui/styles.css';

/* 3. Scan your source files for Tailwind classes */
@source "../../src";

/* 4. Scan plugin-ui dist for Tailwind classes used by components */
@source "../../../node_modules/@wedevs/plugin-ui/dist";

/* 5. Map CSS variables to Tailwind theme tokens */
@theme inline {
    /* Colors */
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-destructive-foreground: var(--destructive-foreground);
    --color-success: var(--success);
    --color-success-foreground: var(--success-foreground);
    --color-warning: var(--warning);
    --color-warning-foreground: var(--warning-foreground);
    --color-info: var(--info);
    --color-info-foreground: var(--info-foreground);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --color-chart-1: var(--chart-1);
    --color-chart-2: var(--chart-2);
    --color-chart-3: var(--chart-3);
    --color-chart-4: var(--chart-4);
    --color-chart-5: var(--chart-5);
    --color-sidebar: var(--sidebar);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-ring: var(--sidebar-ring);

    /* Typography */
    --font-sans: var(--font-sans);
    --font-serif: var(--font-serif);
    --font-mono: var(--font-mono);

    /* Border Radius */
    --radius-sm: calc(var(--radius) - 4px);
    --radius-md: calc(var(--radius) - 2px);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) + 4px);
    --radius-2xl: calc(var(--radius) + 8px);

    /* Shadows */
    --shadow-2xs: var(--shadow-2xs);
    --shadow-xs: var(--shadow-xs);
    --shadow-sm: var(--shadow-sm);
    --shadow: var(--shadow);
    --shadow-md: var(--shadow-md);
    --shadow-lg: var(--shadow-lg);
    --shadow-xl: var(--shadow-xl);
    --shadow-2xl: var(--shadow-2xl);
}
```

> **Why is `@theme inline` needed?** Tailwind v4 needs to know about your CSS variables to generate utilities like `bg-primary`, `text-muted-foreground`, etc. The `@theme inline` block maps `--primary` (set by ThemeProvider) to `--color-primary` (used by Tailwind).

### 6. PHP Asset Enqueuing

Register and enqueue the built JS/CSS in your WordPress plugin:

```php
<?php
// includes/Assets.php

namespace MyPlugin;

class Assets {
    public function __construct() {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
    }

    public function enqueue_scripts($hook) {
        // Only load on your plugin page
        if ($hook !== 'toplevel_page_my-plugin') {
            return;
        }

        $asset_file = MY_PLUGIN_PATH . '/build/my-plugin-app.asset.php';
        $asset_data = file_exists($asset_file) ? include $asset_file : [];

        $dependencies = $asset_data['dependencies'] ?? [];
        $version = $asset_data['version'] ?? MY_PLUGIN_VERSION;

        // Enqueue the JavaScript bundle
        wp_enqueue_script(
            'my-plugin-app',
            MY_PLUGIN_URL . '/build/my-plugin-app.js',
            $dependencies,
            $version,
            true
        );

        // Enqueue the CSS bundle
        wp_enqueue_style(
            'my-plugin-app',
            MY_PLUGIN_URL . '/build/my-plugin-app.css',
            ['wp-components'],
            $version
        );

        // Pass data to JavaScript
        wp_localize_script(
            'my-plugin-app',
            'myPluginData',
            [
                'rest_url' => esc_url_raw(get_rest_url()),
                'nonce'    => wp_create_nonce('wp_rest'),
            ]
        );
    }
}
```

Create a container div for React to mount into:

```php
// admin-page.php
<div id="my-plugin-app" class="wrap"></div>
```

> **Note:** `@wordpress/scripts` automatically generates the `.asset.php` file with correct WordPress dependencies during build.

### 7. React Entry Point

```tsx
// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, type ThemeTokens } from '@wedevs/plugin-ui';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles/main.css';

const myThemeTokens: ThemeTokens = {
  primary: 'oklch(.511 .262 276.966)',
  primaryForeground: 'oklch(0.9850 0 0)',
  radius: '0.625rem',
  // ... more tokens as needed
};

const container = document.getElementById('my-plugin-app');
if (container) {
  const root = createRoot(container);
  root.render(
    <ThemeProvider pluginId="my-plugin" tokens={myThemeTokens}>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  );
}
```

---

## ThemeProvider

The `ThemeProvider` wraps your app and injects CSS custom properties under the `.pui-root` scope. All plugin-ui components read these variables for their styles.

```tsx
import { ThemeProvider } from '@wedevs/plugin-ui';

<ThemeProvider
  pluginId="my-plugin"       // Required: unique CSS scope identifier
  tokens={lightTokens}       // Optional: light theme overrides
  darkTokens={darkTokens}    // Optional: dark theme overrides
  defaultMode="light"        // Optional: "light" | "dark" | "system"
  mode="light"               // Optional: controlled mode (overrides user preference)
  storageKey="my-theme"      // Optional: localStorage key for mode persistence
>
  {children}
</ThemeProvider>
```

Access the theme context in child components:

```tsx
import { useTheme } from '@wedevs/plugin-ui';

function ThemeToggle() {
  const { mode, setMode } = useTheme();
  return (
    <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
      Toggle: {mode}
    </button>
  );
}
```

### Theme Tokens

All tokens use the OKLCh color space for perceptually uniform color manipulation:

| Token | Description |
|-------|-------------|
| `background` / `foreground` | Page background and text |
| `card` / `cardForeground` | Card surfaces |
| `popover` / `popoverForeground` | Dropdown/popover surfaces |
| `primary` / `primaryForeground` | Primary brand color |
| `secondary` / `secondaryForeground` | Secondary color |
| `muted` / `mutedForeground` | Muted/disabled state |
| `accent` / `accentForeground` | Accent highlights |
| `destructive` / `destructiveForeground` | Danger/delete actions |
| `success` / `successForeground` | Success state |
| `warning` / `warningForeground` | Warning state |
| `info` / `infoForeground` | Informational state |
| `border` | Default border color |
| `input` | Input border color |
| `ring` | Focus ring color |
| `chart1`–`chart5` | Chart/graph colors |
| `sidebar*` | Sidebar-specific colors |
| `radius` | Base border radius |
| `fontSans` / `fontSerif` / `fontMono` | Font families |
| `shadow*` | Shadow values |

### Dark Mode

Pass both `tokens` and `darkTokens` to enable dark mode:

```tsx
const lightTokens: ThemeTokens = {
  background: 'oklch(1 0 0)',
  foreground: 'oklch(0.1450 0 0)',
  primary: 'oklch(.511 .262 276.966)',
  // ...
};

const darkTokens: ThemeTokens = {
  background: 'oklch(0.1450 0 0)',
  foreground: 'oklch(0.9850 0 0)',
  primary: 'oklch(0.9220 0 0)',
  // ...
};

<ThemeProvider
  pluginId="my-plugin"
  tokens={lightTokens}
  darkTokens={darkTokens}
  defaultMode="system"  // Respects OS preference
>
  <App />
</ThemeProvider>
```

### Built-in Theme Presets

Use pre-made themes instead of defining tokens manually:

```tsx
import { defaultTheme, defaultDarkTheme, twitterTheme, cyberpunkTheme } from '@wedevs/plugin-ui';

<ThemeProvider pluginId="my-plugin" tokens={twitterTheme} darkTokens={defaultDarkTheme}>
```

Available presets: `defaultTheme`, `slateTheme`, `amberMinimalTheme`, `t3ChatTheme`, `midnightBloomTheme`, `bubblegumTheme`, `cyberpunkTheme`, `twitterTheme` — each with a `*DarkTheme` variant.

---

## Component Catalog

### Layout Components

#### Button

```tsx
import { Button } from '@wedevs/plugin-ui';

<Button variant="default" size="default">Save</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline" size="icon"><Icon /></Button>
<Button variant="ghost">Cancel</Button>
<Button variant="link">Learn more</Button>
<Button variant="success">Confirm</Button>
<Button progress={75}>Uploading...</Button>
```

**Variants:** `default`, `secondary`, `outline`, `ghost`, `destructive`, `outline-destructive`, `success`, `outline-success`, `link`
**Sizes:** `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`

#### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '@wedevs/plugin-ui';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
    <CardAction><Button variant="ghost" size="icon-sm"><MoreIcon /></Button></CardAction>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

#### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@wedevs/plugin-ui';

<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="advanced">Advanced</TabsTrigger>
  </TabsList>
  <TabsContent value="general">General settings...</TabsContent>
  <TabsContent value="advanced">Advanced settings...</TabsContent>
</Tabs>
```

#### Separator

```tsx
import { Separator } from '@wedevs/plugin-ui';

<Separator />
<Separator orientation="vertical" />
```

#### ScrollArea

```tsx
import { ScrollArea, ScrollBar } from '@wedevs/plugin-ui';

<ScrollArea className="h-72 w-48">
  <div>Long content...</div>
  <ScrollBar orientation="vertical" />
</ScrollArea>
```

### Form Components

#### Input

```tsx
import { Input } from '@wedevs/plugin-ui';

<Input type="text" placeholder="Enter name" />
<Input type="email" disabled />
```

#### InputGroup

```tsx
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from '@wedevs/plugin-ui';

<InputGroup>
  <InputGroupAddon>https://</InputGroupAddon>
  <InputGroupInput placeholder="example.com" />
  <InputGroupButton>Go</InputGroupButton>
</InputGroup>
```

#### CurrencyInput

```tsx
import { CurrencyInput } from '@wedevs/plugin-ui';

<CurrencyInput
  value={amount}
  onChange={(val) => setAmount(val)}
  currency="USD"
  currencyOptions={[
    { value: 'USD', label: '$' },
    { value: 'EUR', label: '€' },
  ]}
/>
```

#### Textarea

```tsx
import { Textarea } from '@wedevs/plugin-ui';

<Textarea placeholder="Write a description..." rows={4} />
```

#### Select

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@wedevs/plugin-ui';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opt1">Option 1</SelectItem>
    <SelectItem value="opt2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### Combobox (Multi-select)

```tsx
import { Combobox, ComboboxTrigger, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxChips } from '@wedevs/plugin-ui';

<Combobox multiple value={selected} onValueChange={setSelected}>
  <ComboboxTrigger>
    <ComboboxChips />
    <ComboboxInput placeholder="Search..." />
  </ComboboxTrigger>
  <ComboboxContent>
    <ComboboxItem value="react">React</ComboboxItem>
    <ComboboxItem value="vue">Vue</ComboboxItem>
  </ComboboxContent>
</Combobox>
```

#### Checkbox

```tsx
import { Checkbox, LabeledCheckbox, CheckboxCard } from '@wedevs/plugin-ui';

<Checkbox checked={checked} onCheckedChange={setChecked} />
<LabeledCheckbox label="Accept terms" description="Read the full terms" />
<CheckboxCard label="Premium" description="Enable premium features" />
```

#### RadioGroup

```tsx
import { RadioGroup, RadioGroupItem, LabeledRadio, RadioCard } from '@wedevs/plugin-ui';

<RadioGroup value={value} onValueChange={setValue}>
  <LabeledRadio value="flat" label="Flat Rate" description="Single rate" />
  <LabeledRadio value="percent" label="Percentage" description="Based on total" />
</RadioGroup>

<RadioGroup value={value} onValueChange={setValue}>
  <RadioCard value="basic" label="Basic" />
  <RadioCard value="pro" label="Pro" />
</RadioGroup>
```

#### Switch

```tsx
import { Switch, LabeledSwitch, SwitchCard } from '@wedevs/plugin-ui';

<Switch checked={on} onCheckedChange={setOn} />
<LabeledSwitch label="Dark Mode" description="Toggle dark theme" />
<SwitchCard label="Notifications" description="Enable email notifications" />
```

#### Slider

```tsx
import { Slider } from '@wedevs/plugin-ui';

<Slider value={[50]} onChange={(val) => setValue(val)} min={0} max={100} step={1} />
```

#### ColorPicker

```tsx
import { ColorPicker } from '@wedevs/plugin-ui';

<ColorPicker value={color} onChange={setColor} placeholder="Pick a color" />
```

#### Label

```tsx
import { Label } from '@wedevs/plugin-ui';

<Label required>Email Address</Label>
```

#### Field (Form Layout)

```tsx
import { Field, FieldLabel, FieldContent, FieldDescription, FieldError } from '@wedevs/plugin-ui';

<Field orientation="horizontal">
  <FieldLabel required>Store Name</FieldLabel>
  <FieldContent>
    <Input value={name} onChange={e => setName(e.target.value)} />
    <FieldDescription>Your public store name</FieldDescription>
    <FieldError>This field is required</FieldError>
  </FieldContent>
</Field>
```

### Data Display Components

#### Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from '@wedevs/plugin-ui';

<Avatar>
  <AvatarImage src="/photo.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

<AvatarGroup>
  <Avatar>...</Avatar>
  <Avatar>...</Avatar>
  <AvatarGroupCount count={5} />
</AvatarGroup>
```

#### Badge

```tsx
import { Badge } from '@wedevs/plugin-ui';

<Badge>New</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Expired</Badge>
```

#### Breadcrumb

```tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@wedevs/plugin-ui';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

#### Skeleton

```tsx
import { Skeleton } from '@wedevs/plugin-ui';

<Skeleton className="h-4 w-[200px]" />
<Skeleton className="h-12 w-12 rounded-full" />
```

#### Progress

```tsx
import { Progress, ProgressTrack, ProgressIndicator, CircularProgress } from '@wedevs/plugin-ui';

<Progress value={65}>
  <ProgressTrack><ProgressIndicator /></ProgressTrack>
</Progress>

<CircularProgress value={75} />
```

#### MetricsCard

```tsx
import { MatricsCard } from '@wedevs/plugin-ui';

<MatricsCard
  icon={<DollarSign />}
  value="$12,450"
  count="+12%"
  countDirection="up"
  shortDescription="Total Revenue"
  tooltip="Revenue from last 30 days"
/>
```

#### Chart (Recharts Wrapper)

```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent, recharts } from '@wedevs/plugin-ui';
const { BarChart, Bar, XAxis, YAxis } = recharts;

<ChartContainer config={{ revenue: { label: 'Revenue', color: 'var(--chart-1)' } }}>
  <BarChart data={data}>
    <XAxis dataKey="month" />
    <YAxis />
    <Bar dataKey="revenue" fill="var(--chart-1)" />
    <ChartTooltip content={<ChartTooltipContent />} />
  </BarChart>
</ChartContainer>
```

#### Thumbnail

```tsx
import { Thumbnail } from '@wedevs/plugin-ui';

<Thumbnail src="/product.jpg" alt="Product" size="md" aspect="square" />
```

### Overlay Components

#### Modal (Dialog)

```tsx
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalClose } from '@wedevs/plugin-ui';

<Modal open={open} onOpenChange={setOpen}>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Confirm Action</ModalTitle>
      <ModalDescription>This cannot be undone.</ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <ModalClose asChild><Button variant="outline">Cancel</Button></ModalClose>
      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

#### AlertDialog

```tsx
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@wedevs/plugin-ui';

<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### Sheet (Side Drawer)

```tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@wedevs/plugin-ui';

<Sheet>
  <SheetTrigger asChild><Button>Open Panel</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader><SheetTitle>Details</SheetTitle></SheetHeader>
    <div>Panel content...</div>
    <SheetFooter><Button>Save</Button></SheetFooter>
  </SheetContent>
</Sheet>
```

#### Popover

```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@wedevs/plugin-ui';

<Popover>
  <PopoverTrigger asChild><Button variant="outline">Options</Button></PopoverTrigger>
  <PopoverContent>
    <p>Popover content</p>
  </PopoverContent>
</Popover>
```

#### DropdownMenu

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuLabel } from '@wedevs/plugin-ui';

<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="ghost">Menu</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Tooltip

```tsx
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@wedevs/plugin-ui';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger><InfoIcon /></TooltipTrigger>
    <TooltipContent>Helpful information</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Feedback Components

#### Alert

```tsx
import { Alert, AlertTitle, AlertDescription, AlertAction } from '@wedevs/plugin-ui';

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
  <AlertAction><Button size="sm">Retry</Button></AlertAction>
</Alert>
```

#### Notice

```tsx
import { Notice, NoticeTitle, NoticeAction } from '@wedevs/plugin-ui';

<Notice variant="info">
  <NoticeTitle>Update Available</NoticeTitle>
  <NoticeAction><Button size="sm">Update Now</Button></NoticeAction>
</Notice>
```

#### Spinner

```tsx
import { Spinner } from '@wedevs/plugin-ui';

<Spinner />
```

### Navigation Components

#### Sidebar

```tsx
import { Sidebar, SidebarProvider, SidebarContent, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarHeader, SidebarFooter, SidebarTrigger } from '@wedevs/plugin-ui';

<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>Logo</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>Settings</SidebarFooter>
  </Sidebar>
  <main>
    <SidebarTrigger />
    <div>Main content</div>
  </main>
</SidebarProvider>
```

### WordPress-specific Components

These components integrate with WordPress APIs directly.

---

## WordPress Integration

### Layout System

A pre-built WordPress admin layout with responsive sidebar, header, and content areas:

```tsx
import {
  Layout, LayoutBody, LayoutSidebar, LayoutMain, LayoutHeader, LayoutFooter,
  LayoutMenu, useLayout
} from '@wedevs/plugin-ui';

function AdminPage() {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCartIcon />, badge: 5 },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      children: [
        { id: 'general', label: 'General' },
        { id: 'payments', label: 'Payments' },
      ],
    },
  ];

  return (
    <Layout namespace="my-plugin">
      <LayoutBody>
        <LayoutSidebar collapsible="icon" variant="sidebar">
          <LayoutMenu
            items={menuItems}
            activeId={activePageId}
            onSelect={(id) => navigate(`/${id}`)}
            searchable
          />
        </LayoutSidebar>
        <LayoutMain>
          <LayoutHeader>Page Title</LayoutHeader>
          <Outlet />
          <LayoutFooter>Footer</LayoutFooter>
        </LayoutMain>
      </LayoutBody>
    </Layout>
  );
}
```

The `namespace` prop integrates with `@wordpress/hooks`, enabling other plugins to extend your layout via actions like `{namespace}_toggle_sidebar`.

### Settings Page

A schema-driven settings page built for WordPress:

```tsx
import { Settings, type SettingsElement } from '@wedevs/plugin-ui';
import { Button } from '@wedevs/plugin-ui';
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

const schema: SettingsElement[] = [
  {
    id: 'general',
    type: 'page',
    label: __('General', 'my-plugin'),
    children: [
      {
        id: 'store',
        type: 'subpage',
        label: __('Store', 'my-plugin'),
        icon: 'Store',
        children: [
          {
            id: 'basic_section',
            type: 'section',
            label: __('Basic Settings', 'my-plugin'),
            children: [
              {
                id: 'store_name',
                type: 'field',
                variant: 'text',
                label: __('Store Name', 'my-plugin'),
                dependency_key: 'store_name',
                default: '',
              },
              {
                id: 'enable_tax',
                type: 'field',
                variant: 'switch',
                label: __('Enable Tax', 'my-plugin'),
                dependency_key: 'enable_tax',
                default: false,
              },
              {
                id: 'tax_rate',
                type: 'field',
                variant: 'number',
                label: __('Tax Rate (%)', 'my-plugin'),
                dependency_key: 'tax_rate',
                dependencies: [{ key: 'enable_tax', value: true, comparison: '=' }],
              },
            ],
          },
        ],
      },
    ],
  },
];

function SettingsPage() {
  const [values, setValues] = useState({});

  return (
    <Settings
      schema={schema}
      values={values}
      title={__('My Plugin', 'my-plugin')}
      hookPrefix="my_plugin"
      applyFilters={applyFilters}
      onChange={(scopeId, key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
      }}
      onSave={async (scopeId, pageValues) => {
        await apiFetch({
          path: `/my-plugin/v1/settings/${scopeId}`,
          method: 'POST',
          data: pageValues,
        });
      }}
      renderSaveButton={({ dirty, onSave }) => (
        <Button onClick={onSave} disabled={!dirty}>
          {__('Save Changes', 'my-plugin')}
        </Button>
      )}
    />
  );
}
```

Field variants: `text`, `number`, `textarea`, `select`, `switch`, `radio_capsule`, `customize_radio`, `multicheck`, `checkbox_group`, `base_field_label`, `html`.

> See [Settings.mdx](src/components/settings/Settings.mdx) in Storybook for full documentation.

### File Upload (WP Media)

```tsx
import { FileUpload } from '@wedevs/plugin-ui';

<FileUpload
  text="Upload Logo"
  description="Recommended: 200x200px PNG"
  onUpload={(media) => {
    if (media) {
      setLogo(media.url);
    }
  }}
  variant="button"
/>
```

This opens the native WordPress Media Library modal and returns `IWpMedia` data.

### Date/Calendar with WP Locale

Components automatically detect WordPress locale and timezone:

```tsx
import { Calendar, DatePicker, DateRangePicker } from '@wedevs/plugin-ui';

// Calendar respects WP locale & timezone automatically
<Calendar mode="single" selected={date} onSelect={setDate} />

// Date picker with WP-formatted display
<DatePicker value={date} onChange={setDate} placeholder="Select date" />

// Date range picker
<DateRangePicker
  mode="range"
  value={range}
  onChange={setRange}
/>
```

WordPress date utilities:

```tsx
import { getWordPressTimezone, getWordPressLocale, formatWordPressDate } from '@wedevs/plugin-ui';

const tz = getWordPressTimezone();       // e.g., "America/New_York"
const locale = getWordPressLocale();     // e.g., "en_US"
const formatted = formatWordPressDate(new Date()); // Uses WP date format setting
```

### DataViews

Wrapper around `@wordpress/dataviews` for consistent table/grid rendering:

```tsx
import { DataViews } from '@wedevs/plugin-ui';

<div className="pui-root">
  <DataViews
    data={orders}
    fields={[
      { id: 'id', header: 'ID' },
      { id: 'customer', header: 'Customer' },
      { id: 'total', header: 'Total', render: ({ item }) => `$${item.total}` },
    ]}
    view={view}
    onChangeView={setView}
  />
</div>
```

> **Note:** Wrap DataViews in a `<div className="pui-root">` to ensure proper styling scope.

---

## Pro Plugin / Add-on Architecture

This section explains how to build a "pro" or add-on plugin that extends a base plugin using shared plugin-ui components, as demonstrated by wepos/wepos-pro.

### Sharing plugin-ui via Webpack Externals

The base plugin bundles `@wedevs/plugin-ui` and exposes it as a global. Add-on plugins use it as an external to avoid bundling it twice:

**Base plugin (e.g., wepos) — entry point:**

```tsx
// Base plugin populates the global with real module exports
import * as PluginUI from '@wedevs/plugin-ui';
Object.assign((window as any).__myPluginUI, PluginUI);
```

**Base plugin — PHP inline script (before any bundles load):**

```php
wp_add_inline_script(
    'wp-hooks',
    'window.__myPluginUI = window.__myPluginUI || {};',
    'after'
);
```

**Add-on plugin — webpack.config.js:**

```js
module.exports = {
  ...defaultConfig,
  externals: {
    ...defaultConfig.externals,
    '@wedevs/plugin-ui': '__myPluginUI',
  },
};
```

**Add-on plugin — PHP dependency ordering:**

```php
// Ensure add-on loads BEFORE base so hooks register first
$wp_scripts = wp_scripts();
if (isset($wp_scripts->registered['base-plugin-app'])) {
    $wp_scripts->registered['base-plugin-app']->deps[] = 'addon-plugin-app';
}
```

### Hook-based Extension Pattern

Add-on plugins extend the base via WordPress hooks (`@wordpress/hooks`):

```tsx
// addon/src/index.tsx
import { Button } from '@wedevs/plugin-ui';
import { addFilter } from './hooks';
import { registerPlugin } from '@wordpress/plugins';

// Add routes to the base app
addFilter('my_plugin_routes', 'addon/routes', (routes) => [
  ...routes,
  { path: '/premium-feature', element: <PremiumPage /> },
]);

// Add sidebar menu items
addFilter('my_plugin_sidebar_items', 'addon/sidebar', (items) => [
  ...items,
  { id: 'premium', label: 'Premium', icon: <CrownIcon /> },
]);

// Register slot fills for extensible areas
registerPlugin('addon-extra-widget', {
  scope: 'my-plugin-dashboard',
  render: () => <ExtraWidget />,
});
```

---

## Utilities & Hooks

### `cn()` — Class Name Merger

```tsx
import { cn } from '@wedevs/plugin-ui';

<div className={cn('p-4 rounded-lg', isActive && 'bg-primary text-primary-foreground')} />
```

### `useIsMobile()`

```tsx
import { useIsMobile } from '@wedevs/plugin-ui';

const isMobile = useIsMobile(); // true if viewport < 768px
```

### `useWindowDimensions()`

```tsx
import { useWindowDimensions } from '@wedevs/plugin-ui';

const { width, height } = useWindowDimensions();
```

### `renderIcon()`

```tsx
import { renderIcon } from '@wedevs/plugin-ui';

// Works with both component references and JSX elements
renderIcon(Settings, { size: 16 })     // <Settings size={16} />
renderIcon(<Settings />, { size: 16 }) // <Settings />
```

---

## Re-exported Libraries

plugin-ui re-exports these libraries so you don't need to install them separately:

```tsx
// Recharts — charting library
import { recharts } from '@wedevs/plugin-ui';
const { LineChart, Line, XAxis, YAxis, CartesianGrid } = recharts;

// React Day Picker — calendar primitives
import { ReactDayPicker } from '@wedevs/plugin-ui';
const { DayPicker } = ReactDayPicker;
```

---

## Directory Structure Reference

Recommended project structure for a WordPress plugin using plugin-ui:

```
my-plugin/
├── build/                      # wp-scripts output
│   ├── my-plugin-app.js
│   ├── my-plugin-app.css
│   └── my-plugin-app.asset.php
├── includes/
│   └── Assets.php              # PHP enqueue class
├── src/
│   ├── index.tsx               # React entry point
│   ├── App.tsx                 # Routes & layout
│   ├── components/             # Your React components
│   ├── pages/                  # Route pages
│   ├── hooks/                  # Custom hooks
│   ├── store/                  # @wordpress/data stores
│   ├── api/                    # REST API calls
│   └── styles/
│       └── main.css            # Tailwind + plugin-ui imports
├── webpack.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
└── my-plugin.php               # Plugin main file
```
