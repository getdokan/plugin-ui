# MatricsCard Component

- [Introduction](#introduction)
- [Component Dependency](#component-dependency)
- [Quick Overview](#quick-overview)
- [Features](#features)
- [Props API](#props-api)
- [Usage Examples](#usage-examples)

## Introduction
`MatricsCard` (Metrics Card) is used to display key performance indicators (KPIs) or metrics with an icon, value, trend indicator, and optional tooltip.

## Component Dependency
- `lucide-react` for icons.
- `@/components/ui/card` for the container.
- `@/components/ui/tooltip` for the tooltip.
- `@/lib/utils` and `tailwind-merge` for class management.

## Quick Overview
```jsx
import { MatricsCard } from "@wedevs/plugin-ui";
import { Handbag } from "lucide-react";

const Example = () => {
  return (
    <MatricsCard
      value="$12,345"
      count="+10%"
      countDirection="up"
      shortDescription="from last month"
      icon={Handbag}
      tooltip="Total sales in last 30 days"
    />
  );
};
```

## Features
- Icon display with hover effects.
- Trend indicator (`count` and `countDirection`).
- Short description support.
- Optional tooltip for detailed information.
- Clickable card with `onCardClick`.

## Props API
| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `value` | `string \| number \| JSX.Element` | Yes | - | The main metric value to display. |
| `shortDescription` | `string \| JSX.Element` | Yes | - | A brief description of the metric. |
| `icon` | `LucideIcon` | No | `Info` | Icon displayed on the left. |
| `count` | `string \| number` | No | - | Trend value (e.g., "+10%"). |
| `countDirection` | `'up' \| 'down' \| 'neutral'` | No | `'neutral'` | Color-codes the trend value (green, red, or gray). |
| `tooltip` | `string \| JSX.Element` | No | - | Content for the help tooltip. |
| `tooltipIcon` | `LucideIcon` | No | `Info` | Icon used for the tooltip trigger. |
| `onCardClick` | `() => void` | No | - | Callback when the card is clicked. |
| `className` | `string` | No | `''` | Additional class names for the card. |

## Usage Examples

### 1. Basic Metric Card
```jsx
<MatricsCard
  value="1,234"
  shortDescription="Total Users"
/>
```

### 2. Metric with Trend and Tooltip
```jsx
import { TrendingUp, Info } from "lucide-react";

<MatricsCard
  icon={TrendingUp}
  value="85%"
  count="+5.2%"
  countDirection="up"
  shortDescription="Conversion Rate"
  tooltip="Measured over the last 7 days"
  tooltipIcon={Info}
/>
```
