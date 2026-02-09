# MatricsPill Component

- [Introduction](#introduction)
- [Component Dependency](#component-dependency)
- [Quick Overview](#quick-overview)
- [Features](#features)
- [Props API](#props-api)
- [Usage Examples](#usage-examples)

## Introduction
`MatricsPill` displays a compact pill with an icon, label text, and a highlighted count badge—useful for dashboard summaries and quick stats.

## Component Dependency
- `@/components/ui/badge` for the pill container.
- `lucide-react` for icons.
- `@/lib/utils` for class merging.

## Quick Overview
```jsx
import { MatricsPill } from "@wedevs/plugin-ui";
import { Handbag } from "lucide-react";

export default function Example() {
  return (
    <MatricsPill icon={Handbag} text="Vendor Approval" count={10} />
  );
}
```

## Features
- Compact KPI/pill presentation.
- Customizable icon and classes.
- Emphasized circular count badge.

## Props API
| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `icon` | `LucideIcon` | Yes | - | Left icon component. |
| `text` | `string` | Yes | - | Label text. |
| `count` | `number` | Yes | - | Numeric value displayed in the circular badge. |
| `className` | `string` | No | `''` | Extra classes for the root badge. |
| `iconWrapperClassName` | `string` | No | - | Classes for the icon wrapper span. |
| `iconClassName` | `string` | No | - | Classes for the icon element. |
| `textClassName` | `string` | No | - | Classes for the label text. |
| `countClassName` | `string` | No | - | Classes for the count badge.

## Usage Examples

### 1. Basic
```jsx
<MatricsPill icon={Handbag} text="Pending Orders" count={7} />
```

### 2. With Custom Colors
```jsx
<MatricsPill
  icon={Handbag}
  text="Vendor Approval"
  count={10}
  className="bg-amber-50 text-amber-700 border-amber-200"
  countClassName="bg-amber-400 text-amber-900"
/>
```
