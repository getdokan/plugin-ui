# Layout

A responsive app layout with an optional header, main content, optional footer, and a right-side menu bar. The menu supports search and multi-label nested items.

## Features

- **Responsive** – Sidebar becomes a drawer on small screens; toggle via header button
- **Header** – Sticky, with optional sidebar toggle (hamburger)
- **Footer** – Nullable; omit or pass `null` to hide
- **Sidebar position** – Left, right, or nullable (no sidebar)
- **Right- or left-side menu** – Fixed sidebar with customizable width
- **Searchable menu** – Filter items by label and secondary label
- **Multi-label nested menu** – Items can have `label`, `secondaryLabel`, and nested `children`
- **Heavily customizable** – `className` on all parts; `sidebarVariant`, `sidebarBreakpoint`, `renderItem`, `renderGroupLabel`

## Layout root props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sidebarPosition` | `'left' \| 'right' \| null` | `'right'` | Sidebar side, or `null` for no sidebar |
| `sidebarVariant` | `'drawer' \| 'inline' \| 'overlay'` | `'drawer'` | Sidebar behavior on mobile |
| `sidebarBreakpoint` | `string` | `'lg'` | Breakpoint where sidebar is always visible (`lg`, `md`, `xl`) |
| `defaultSidebarOpen` | `boolean` | `false` | Initial open state for mobile sidebar |
| `className` | `string` | - | Root container classes |

## Composition

**Right sidebar (default):** main first, then sidebar.

```tsx
<Layout sidebarPosition="right">
  <LayoutHeader />
  <LayoutBody>
    <LayoutMain>{/* main content */}</LayoutMain>
    <LayoutSidebar>
      <LayoutMenu groups={groups} searchable />
    </LayoutSidebar>
  </LayoutBody>
  <LayoutFooter>{/* optional */}</LayoutFooter>
</Layout>
```

**Left sidebar:** sidebar first, then main.

```tsx
<Layout sidebarPosition="left">
  <LayoutHeader />
  <LayoutBody>
    <LayoutSidebar>
      <LayoutMenu groups={groups} searchable />
    </LayoutSidebar>
    <LayoutMain>{/* main content */}</LayoutMain>
  </LayoutBody>
</Layout>
```

**No sidebar:** use `sidebarPosition={null}`. Omit `LayoutSidebar`; header toggle is hidden.

```tsx
<Layout sidebarPosition={null}>
  <LayoutHeader />
  <LayoutBody>
    <LayoutMain>{/* main content */}</LayoutMain>
  </LayoutBody>
</Layout>
```

## LayoutMenu props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `LayoutMenuItemData[]` | `[]` | Flat list of menu items |
| `groups` | `LayoutMenuGroupData[]` | - | Grouped sections (label + items); overrides `items` |
| `searchable` | `boolean` | `true` | Show search input and filter items |
| `searchPlaceholder` | `string` | `"Search menu…"` | Search input placeholder |
| `renderItem` | `(item, depth) => ReactNode` | - | Custom render for each item |
| `renderGroupLabel` | `(group) => ReactNode` | - | Custom render for group header |

## Menu item shape

```ts
interface LayoutMenuItemData {
  id: string;
  label: string;
  secondaryLabel?: string;
  href?: string;
  onClick?: () => void;
  children?: LayoutMenuItemData[];
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}
```

## Usage

### Full layout with footer and searchable nested menu

```tsx
import {
  Layout,
  LayoutHeader,
  LayoutBody,
  LayoutMain,
  LayoutSidebar,
  LayoutFooter,
  LayoutMenu,
} from "@wedevs/plugin-ui";

const groups = [
  {
    id: "main",
    label: "Main",
    secondaryLabel: "Primary navigation",
    items: [
      { id: "dashboard", label: "Dashboard", secondaryLabel: "Overview", onClick: () => {} },
      {
        id: "reports",
        label: "Reports",
        children: [
          { id: "sales", label: "Sales", onClick: () => {} },
        ],
      },
    ],
  },
];

<Layout sidebarBreakpoint="lg">
  <LayoutHeader>
    <span className="font-semibold">App Title</span>
  </LayoutHeader>
  <LayoutBody>
    <LayoutMain>
      <h1>Content</h1>
    </LayoutMain>
    <LayoutSidebar className="w-72">
      <LayoutMenu groups={groups} searchable searchPlaceholder="Search menu…" />
    </LayoutSidebar>
  </LayoutBody>
  <LayoutFooter>
    <span className="text-sm text-muted-foreground">© 2025</span>
  </LayoutFooter>
</Layout>
```

### Without footer

Omit `LayoutFooter` or render it with no children to hide the footer:

```tsx
<Layout>
  <LayoutHeader>…</LayoutHeader>
  <LayoutBody>
    <LayoutMain>…</LayoutMain>
    <LayoutSidebar>
      <LayoutMenu items={items} searchable />
    </LayoutSidebar>
  </LayoutBody>
</Layout>
```

### Custom breakpoint and sidebar width

```tsx
<Layout sidebarBreakpoint="md" defaultSidebarOpen={false}>
  …
  <LayoutSidebar width="w-64" className="border-l">
    <LayoutMenu groups={groups} searchable />
  </LayoutSidebar>
</Layout>
```
