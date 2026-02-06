# Breadcrumb Component

A navigation breadcrumb component following ShadCN design patterns for displaying hierarchical navigation paths.

## Installation

```bash
npm install @wedevs/plugin-ui
```

## Import

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from "@wedevs/plugin-ui";
```

## Basic Usage

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Multi-Level Navigation

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Shipping</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Service</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Settings</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## With Icons

### Icon on Each Item
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#" className="flex items-center gap-1.5">
        <Settings className="size-4" />
        Settings
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#" className="flex items-center gap-1.5">
        <Truck className="size-4" />
        Shipping
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage className="flex items-center gap-1.5">
        <Settings className="size-4" />
        Settings
      </BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Home Icon
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#" className="flex items-center gap-1.5">
        <Home className="size-4" />
        Home
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Electronics</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Laptop</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Custom Separators

### Slash Separator
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <span className="text-muted-foreground">/</span>
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Documentation</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <span className="text-muted-foreground">/</span>
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumbs</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Dot Separator
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <span className="text-muted-foreground">•</span>
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Blog</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <span className="text-muted-foreground">•</span>
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbPage>Article</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## With Ellipsis

For long paths, use ellipsis to collapse middle items:

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Responsive Breadcrumbs

Hide certain items on smaller screens:

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem className="hidden sm:block">
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator className="hidden sm:block" />
    <BreadcrumbItem className="hidden md:block">
      <BreadcrumbLink href="#">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator className="hidden md:block" />
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Category</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Component Structure

### Breadcrumb
The root navigation element.

```tsx
<Breadcrumb>
  {/* BreadcrumbList */}
</Breadcrumb>
```

### BreadcrumbList
Ordered list container for breadcrumb items.

```tsx
<BreadcrumbList>
  {/* BreadcrumbItems */}
</BreadcrumbList>
```

### BreadcrumbItem
Individual breadcrumb item container.

```tsx
<BreadcrumbItem>
  {/* BreadcrumbLink or BreadcrumbPage */}
</BreadcrumbItem>
```

### BreadcrumbLink
Clickable link for navigation.

```tsx
<BreadcrumbLink href="/path">Label</BreadcrumbLink>
```

### BreadcrumbPage
Current page indicator (non-clickable).

```tsx
<BreadcrumbPage>Current Page</BreadcrumbPage>
```

### BreadcrumbSeparator
Visual separator between items. Defaults to ChevronRight icon.

```tsx
<BreadcrumbSeparator />
{/* or */}
<BreadcrumbSeparator>
  <span>/</span>
</BreadcrumbSeparator>
```

### BreadcrumbEllipsis
Collapsed items indicator.

```tsx
<BreadcrumbEllipsis />
```

## Complete Example

```tsx
import { Home, ChevronRight } from "lucide-react";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/" className="flex items-center gap-1.5">
        <Home className="size-4" />
        Home
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem className="hidden md:block">
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator className="hidden md:block" />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products/electronics">
        Electronics
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Laptops</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## With Dropdown Menu

For complex hierarchies, you can integrate dropdown menus:

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis onClick={() => setShowMenu(!showMenu)} />
      {/* Dropdown menu implementation */}
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Props Reference

### Breadcrumb Props

Extends standard HTML `<nav>` attributes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes |

### BreadcrumbList Props

Extends standard HTML `<ol>` attributes.

### BreadcrumbItem Props

Extends standard HTML `<li>` attributes.

### BreadcrumbLink Props

Extends standard HTML `<a>` attributes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | Required | Link destination |
| `className` | `string` | `undefined` | Additional CSS classes |

### BreadcrumbPage Props

Extends standard HTML `<span>` attributes.

### BreadcrumbSeparator Props

Extends standard HTML `<li>` attributes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | ChevronRight | Custom separator content |

## Best Practices

1. **Current page**: Always use `BreadcrumbPage` for the current page (last item)
2. **Hierarchy**: Show clear hierarchical relationships
3. **Mobile**: Consider hiding intermediate levels on mobile
4. **Icons**: Use icons sparingly, typically only for home
5. **Separator**: Use the default separator or choose one that matches your design
6. **Links**: All items except the current page should be clickable links
7. **Length**: For very long paths, use ellipsis to collapse middle items

## Accessibility

- Uses proper semantic HTML (`<nav>`, `<ol>`, `<li>`)
- Includes `aria-label="breadcrumb"` on the nav element
- Current page uses `aria-current="page"`
- Separators are marked `aria-hidden="true"` as they're presentational
- All links are keyboard accessible
- Proper focus states for interactive elements
