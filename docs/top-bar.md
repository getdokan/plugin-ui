# TopBar Component

- [Introduction](#introduction)
- [Component Dependency](#component-dependency)
- [Quick Overview](#quick-overview)
- [Features](#features)
- [Props API](#props-api)
- [Usage Examples](#usage-examples)

## Introduction
`TopBar` renders a lightweight header bar suitable for plugin dashboards. It shows a logo, a list of versions (with optional PRO styling), and any right-side controls (buttons, badges, etc.). It also exposes a convenience `TopBar.UpgradeBtn` component.

## Component Dependency
- `@/components/ui` `Badge`, `Button`
- `@/components/crown-icon` for PRO badge
- `@base-ui/react` `Separator`
- `@/lib/utils` for class merging

## Quick Overview
```jsx
import { TopBar, Badge } from "@wedevs/plugin-ui";

<TopBar
  logo={<img src="/logo.svg" className="h-7" alt="Logo" />}
  versions={[
    { version: '1.0.0', isPro: true },
    { version: '1.1.0' },
  ]}
  rightSideComponents={
    <>
      <TopBar.UpgradeBtn upgradeText="Upgrade" />
      <Badge variant="outline" className="h-7.5">Status</Badge>
    </>
  }
/>
```

## Features
- Flexible left slot for `logo`.
- Versions list with optional PRO indicator using a crown icon.
- Customizable PRO badge colors.
- Right-side area for custom controls.
- Provided `TopBar.UpgradeBtn` button.

## Props API

### TopBar
| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `logo` | `ReactNode` | Yes | - | Logo element rendered on the left. |
| `versions` | `Array<{ version: string; isPro: boolean; proBadgeBg?: string; proBadgeColor?: string; proBadgeBorderColor?: string; className?: string; }>` | No | `[]` | Versions to display. If `isPro` is true, shows a crown inside a colored circle. |
| `rightSideComponents` | `ReactNode` | No | `<></>` | Any elements to render on the right side. |
| `className` | `string` | No | - | Extra classes for the wrapper.

### TopBar.UpgradeBtn
All props of `Button` plus:

| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `upgradeText` | `string` | No | `''` | Text to display when no `children` are provided. |
| `children` | `ReactNode` | No | - | If provided, fully controls the button contents. |
| `crownIconProps` | `React.ComponentProps<typeof CrownIcon>` | No | `{}` | Props forwarded to `CrownIcon`.

## Usage Examples

### 1. Basic
```jsx
<TopBar logo={<MyLogo />} versions={[{ version: '2.0.0' }]} />
```

### 2. With PRO badge and actions
```jsx
<TopBar
  logo={<MyLogo />}
  versions={[
    { version: '1.0.0', isPro: true, proBadgeBg: '#FFBC00', proBadgeColor: '#000', proBadgeBorderColor: '#F2A200' },
    { version: '1.1.0' },
  ]}
  rightSideComponents={
    <>
      <TopBar.UpgradeBtn upgradeText="Upgrade" />
      <Badge variant="outline" className="h-7.5">Connected</Badge>
    </>
  }
/>
```