# Toggle Component

- [Introduction](#introduction)
- [Component Dependency](#component-dependency)
- [Quick Overview](#quick-overview)
- [Features](#features)
- [Props API](#props-api)
- [Usage Examples](#usage-examples)

## Introduction
`Toggle` is a small, pressable switch/button built on `@base-ui/react/toggle`, styled to match plugin-ui. It supports `default` and `outline` variants and three sizes.

## Component Dependency
- `@base-ui/react/toggle`
- `class-variance-authority` for variants
- `@/lib/utils` for class merging

## Quick Overview
```jsx
import { Toggle } from "@wedevs/plugin-ui";

<Toggle aria-label="Bold">
  Bold
</Toggle>
```

## Features
- Accessible pressable control (`aria-pressed`).
- Variants: `default`, `outline`.
- Sizes: `sm`, `default`, `lg`.

## Props API
Extends `TogglePrimitive.Props` and accepts `toggleVariants` options.

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `variant` | `'default' \| 'outline'` | No | `'default'` | Visual style. |
| `size` | `'sm' \| 'default' \| 'lg'` | No | `'default'` | Control size. |
| `className` | `string` | No | - | Extra classes. |
| `...props` | `TogglePrimitive.Props` | No | - | All other toggle props.

## Usage Examples

### 1. Outline variant
```jsx
<Toggle variant="outline" aria-label="Italic">
  Italic
</Toggle>
```

### 2. With icon
```jsx
import { Bold } from "lucide-react";

<Toggle aria-label="Bold">
  <Bold />
</Toggle>
```