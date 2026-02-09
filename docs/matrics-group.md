# MatricsGroup Components

- [Introduction](#introduction)
- [Component Dependency](#component-dependency)
- [Quick Overview](#quick-overview)
- [Features](#features)
- [Props API](#props-api)
- [Usage Examples](#usage-examples)

## Introduction
`MatricsGroup` displays multiple `MatricsGroupItem` blocks inside a single card container with a subtle separator between items. Use it to present a set of related metrics.

## Component Dependency
- `@/components/ui/card` for the group container and content.
- `@/components/ui/tooltip` for optional item tooltips.
- `lucide-react` for icons.
- `@/lib/utils` for class merging.

## Quick Overview
```jsx
import { MatricsGroup, MatricsGroupItem } from "@wedevs/plugin-ui";
import { Handbag, Info } from "lucide-react";

<MatricsGroup>
  <MatricsGroupItem
    label="Revenue"
    value="$12,345"
    change="+10%"
    changeDirection="up"
    icon={Handbag}
    tooltipIcon={Info}
    tooltip="Total sales in last 30 days"
  />
  <MatricsGroupItem
    label="Orders"
    value={320}
  />
</MatricsGroup>
```

## Features
- Grouped metrics inside a single card.
- Optional icon per item.
- Optional change indicator with `up`, `down`, `neutral` coloring.
- Optional tooltip per item.

## Props API

### MatricsGroupItem
Extends `React.HTMLAttributes<HTMLDivElement>` (rendered as `CardContent`).

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `label` | `string` | Yes | - | Short label beneath the value. |
| `value` | `string \| number` | Yes | - | Primary metric value. |
| `change` | `string \| number` | No | - | Change delta text (e.g., `+10%`). |
| `changeDirection` | `'up' \| 'down' \| 'neutral'` | No | `'neutral'` | Colors the change text. |
| `icon` | `LucideIcon` | No | - | Optional left icon. |
| `tooltip` | `string \| ReactNode` | No | - | Tooltip content. |
| `tooltipIcon` | `LucideIcon` | No | `Info` | Icon for tooltip trigger. |
| `className` | `string` | No | - | Extra classes for the item. |

### MatricsGroup
Extends `React.HTMLAttributes<HTMLDivElement>` (rendered as a `Card`).

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | Yes | - | One or more `MatricsGroupItem` elements. |
| `onCardClick` | `() => void` | No | - | Click handler for the entire group card. |
| `className` | `string` | No | - | Extra classes for the group card.

## Usage Examples

### 1. Minimal
```jsx
<MatricsGroup>
  <MatricsGroupItem label="Orders" value={320} />
  <MatricsGroupItem label="Refunds" value={5} change="-2" changeDirection="down" />
</MatricsGroup>
```

### 2. With icons and tooltips
```jsx
<MatricsGroup>
  <MatricsGroupItem label="Revenue" value="$12,345" change="+10%" changeDirection="up" icon={Handbag} tooltip="Last 30 days" />
  <MatricsGroupItem label="AOV" value="$37.20" tooltip="Average order value" />
</MatricsGroup>
```