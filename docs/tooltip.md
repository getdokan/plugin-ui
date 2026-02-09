# Tooltip Components

- [Introduction](#introduction)
- [Component Dependency](#component-dependency)
- [Quick Overview](#quick-overview)
- [Features](#features)
- [Props API](#props-api)
- [Usage Examples](#usage-examples)

## Introduction
`Tooltip`, `TooltipTrigger`, `TooltipContent`, and `TooltipProvider` are thin wrappers around `@base-ui/react/tooltip` with default styles aligned to plugin-ui themes. Use them to display contextual help on hover/focus.

## Component Dependency
- `@base-ui/react/tooltip` primitives.
- `@/providers` for theme mode (`useTheme`).
- `@/lib/utils` for class merging.

## Quick Overview
```jsx
import { Tooltip, TooltipContent, TooltipTrigger } from "@wedevs/plugin-ui";

<Tooltip>
  <TooltipTrigger>
    <span>Hover me</span>
  </TooltipTrigger>
  <TooltipContent>Helpful text</TooltipContent>
</Tooltip>
```

## Features
- Built-in provider with configurable `delay`.
- Themed popup with arrow and smooth animations.
- Positioning via `side` and `align` props.

## Props API

### TooltipProvider
| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `delay` | `number` | No | `0` | Delay (ms) before opening. |
| `...props` | `TooltipPrimitive.Provider.Props` | No | - | Passed to underlying provider. |

### Tooltip
| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `...props` | `TooltipPrimitive.Root.Props` | No | - | Root props.

### TooltipTrigger
| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `...props` | `TooltipPrimitive.Trigger.Props` | No | - | Trigger element props.

### TooltipContent
| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | No | `'top'` | Preferred side of the tooltip. |
| `sideOffset` | `number` | No | `4` | Offset from the trigger. |
| `align` | `'start' \| 'center' \| 'end'` | No | `'center'` | Alignment relative to trigger. |
| `alignOffset` | `number` | No | `0` | Offset for alignment. |
| `className` | `string` | No | - | Additional classes for popup. |
| `portalClassName` | `string` | No | - | Classes for portal node. |
| `positionerClassName` | `string` | No | - | Classes for positioner. |
| `arrowClassName` | `string` | No | - | Classes for the arrow. |
| `...props` | `TooltipPrimitive.Popup.Props` | No | - | Popup props.

## Usage Examples

### 1. Basic
```jsx
<Tooltip>
  <TooltipTrigger>
    <button className="p-2">i</button>
  </TooltipTrigger>
  <TooltipContent>Help text</TooltipContent>
</Tooltip>
```

### 2. Positioned
```jsx
<Tooltip>
  <TooltipTrigger>Hover</TooltipTrigger>
  <TooltipContent side="left" align="start">Left aligned</TooltipContent>
</Tooltip>
```
