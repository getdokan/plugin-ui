# ButtonToggleGroup Component

- [Introduction](#introduction)
- [Component Dependency](#component-dependency)
- [Quick Overview](#quick-overview)
- [Features](#features)
- [Props API](#props-api)
- [Usage Examples](#usage-examples)

## Introduction
`ButtonToggleGroup` is a specialized wrapper around the standard `ToggleGroup` component, designed to easily create segmented controls with optional icons (start or end) and specific active state styling. It uses the theme's primary color for the active item and ensures borders are visible for unselected items.

## Component Dependency
- `@/components/ui/toggle-group` for the underlying group logic.
- `@/lib/utils` for class merging.

## Quick Overview
```jsx
import { ButtonToggleGroup } from "@wedevs/plugin-ui";
import { List, Grid } from "lucide-react";

const items = [
  { value: "list", label: "List View", startIcon: <List /> },
  { value: "grid", label: "Grid View", startIcon: <Grid /> },
];

<ButtonToggleGroup 
  items={items} 
  value="list" 
  onChange={(val) => console.log(val)} 
/>
```

## Features
- **Icon Support**: Easily add `startIcon` or `endIcon` to each toggle item.
- **Unified Style**: Uses the theme's primary color as background for the active item.
- **Customizable**: Pass `className` for the container or `itemClassName` for individual items.
- **Standard Toggle Props**: Supports `value`, `onChange`, and `size`.
- **Improved Rounding**: Respects the rounding applied to the container via `className`.

## Props API

### ButtonToggleGroup

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `items` | `ButtonToggleGroupItem[]` | Yes | - | Array of items to render in the group. |
| `value` | `string` | No | - | The value of the currently active item. |
| `onChange` | `(value: string) => void` | No | - | Callback fired when the active item changes. |
| `size` | `'sm' \| 'default' \| 'lg'` | No | `'default'` | Size of the toggle items. |
| `className` | `string` | No | - | Extra classes for the `ToggleGroup` container. |
| `itemClassName` | `string` | No | - | Extra classes for each `ToggleGroupItem`. |

### ButtonToggleGroupItem (Interface)

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | Yes | Unique value for the item. |
| `label` | `string` | Yes | Text label to display. |
| `startIcon` | `React.ReactNode` | No | Icon to display before the label. |
| `endIcon` | `React.ReactNode` | No | Icon to display after the label. |

## Usage Examples

### 1. Simple Toggle with Icons
```jsx
const items = [
  { value: "day", label: "Day", startIcon: <Sun size={16} /> },
  { value: "night", label: "Night", startIcon: <Moon size={16} /> },
];

<ButtonToggleGroup items={items} />
```

### 2. Large Rounded Control
```jsx
const items = [
  { value: "asc", label: "Ascending", endIcon: <ArrowUp size={16} /> },
  { value: "desc", label: "Descending", endIcon: <ArrowDown size={16} /> },
];

<ButtonToggleGroup items={items} className="rounded-xl" />
```

### 3. Mixed Icons and No Icons
```jsx
const items = [
  { value: "home", label: "Home", startIcon: <Home size={16} /> },
  { value: "settings", label: "Settings" },
  { value: "profile", label: "Profile", endIcon: <User size={16} /> },
];

<ButtonToggleGroup items={items} />
```
