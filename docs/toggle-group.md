# ToggleGroup Components

- [Introduction](#introduction)
- [Component Dependency](#component-dependency)
- [Quick Overview](#quick-overview)
- [Features](#features)
- [Props API](#props-api)
- [Usage Examples](#usage-examples)

## Introduction
`ToggleGroup` and `ToggleGroupItem` provide a segmented control built on `@base-ui/react/toggle-group` and `@base-ui/react/toggle`. They share visual variants with the `Toggle` component and support horizontal/vertical orientation and custom spacing.

## Component Dependency
- `@base-ui/react/toggle-group` and `@base-ui/react/toggle`
- `@/components/ui/toggle` for shared variants
- `@/lib/utils` for class merging

## Quick Overview
```jsx
import { ToggleGroup, ToggleGroupItem } from "@wedevs/plugin-ui";

<ToggleGroup orientation="horizontal" variant="outline" spacing={0}>
  <ToggleGroupItem value="all">All</ToggleGroupItem>
  <ToggleGroupItem value="missed">Missed</ToggleGroupItem>
</ToggleGroup>
```

## Features
- Horizontal or vertical orientation.
- `spacing` control; with `spacing={0}` items visually merge (rounded ends only).
- Inherits `variant` and `size` from group to items by context.

## Props API

### ToggleGroup
Extends `ToggleGroupPrimitive.Props` and accepts variant/size of `toggleVariants`.

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `variant` | `'default' \| 'outline'` | No | `'default'` | Visual style passed to children. |
| `size` | `'sm' \| 'default' \| 'lg'` | No | `'default'` | Size passed to children. |
| `spacing` | `number` | No | `0` | Gap between items. Zero merges borders. |
| `orientation` | `'horizontal' \| 'vertical'` | No | `'horizontal'` | Layout direction. |
| `className` | `string` | No | - | Extra classes.
| `...props` | `ToggleGroupPrimitive.Props` | No | - | Other toggle-group props (type, value, onValueChange, etc.).

### ToggleGroupItem
Extends `TogglePrimitive.Props` and accepts `toggleVariants` options. Inherits `variant` and `size` from the nearest `ToggleGroup` unless overridden.

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `value` | `string` | Yes | - | Item value.
| `variant` | `'default' \| 'outline'` | No | `'default'` | Visual style. |
| `size` | `'sm' \| 'default' \| 'lg'` | No | `'default'` | Item size. |
| `className` | `string` | No | - | Extra classes. |
| `...props` | `TogglePrimitive.Props` | No | - | Other toggle props.

## Usage Examples

### 1. Horizontal, outline, merged
```jsx
<ToggleGroup orientation="horizontal" variant="outline" spacing={0}>
  <ToggleGroupItem value="all">All</ToggleGroupItem>
  <ToggleGroupItem value="missed">Missed</ToggleGroupItem>
</ToggleGroup>
```

### 2. Vertical with spacing
```jsx
<ToggleGroup orientation="vertical" spacing={8}>
  <ToggleGroupItem value="open">Open</ToggleGroupItem>
  <ToggleGroupItem value="closed">Closed</ToggleGroupItem>
</ToggleGroup>
```