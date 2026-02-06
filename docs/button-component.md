# Button Component

A comprehensive button component following ShadCN design patterns with multiple variants, sizes, states, and progressive features.

## Installation

```bash
npm install @wedevs/plugin-ui
```

## Import

```tsx
import { Button, Spinner } from "@wedevs/plugin-ui";
```

## Basic Usage

```tsx
<Button>Click me</Button>
```

## Variants

The Button component supports multiple visual styles:

### Default (Primary)
```tsx
<Button variant="default">Primary Button</Button>
```

### Secondary
```tsx
<Button variant="secondary">Secondary Button</Button>
```

### Outline
```tsx
<Button variant="outline">Outline Button</Button>
```

### Ghost
```tsx
<Button variant="ghost">Ghost Button</Button>
```

### Destructive
```tsx
<Button variant="destructive">Delete</Button>
```

### Outline Destructive
```tsx
<Button variant="outline-destructive">Cancel Subscription</Button>
```

### Success
```tsx
<Button variant="success">Apply Now</Button>
```

### Outline Success
```tsx
<Button variant="outline-success">Approve</Button>
```

### Link
```tsx
<Button variant="link">Learn More</Button>
```

## Sizes

The Button component provides multiple size options:

### Extra Small (xs)
```tsx
<Button size="xs">Extra Small</Button>
```

### Small (sm)
```tsx
<Button size="sm">Small Button</Button>
```

### Default
```tsx
<Button size="default">Default Size</Button>
```

### Large (lg)
```tsx
<Button size="lg">Large Button</Button>
```

### Icon Sizes
For icon-only buttons:

```tsx
<Button size="icon-xs"><MenuIcon /></Button>
<Button size="icon-sm"><MenuIcon /></Button>
<Button size="icon"><MenuIcon /></Button>
<Button size="icon-lg"><MenuIcon /></Button>
```

## Icons

### Icon Left
```tsx
<Button>
  <Plus />
  Create Store
</Button>
```

### Icon Right
```tsx
<Button>
  Create Store
  <ChevronDown />
</Button>
```

### Both Icons
```tsx
<Button>
  <Menu />
  Options
  <ChevronDown />
</Button>
```

### Icon Only
```tsx
<Button size="icon">
  <Menu />
</Button>
```

## States

### Disabled
```tsx
<Button disabled>Disabled Button</Button>
```

### Loading State
```tsx
<Button disabled>
  <Spinner />
  Loading...
</Button>
```

## Progressive Features

### Progress Bar
Show completion percentage (0-100):

```tsx
<Button variant="default" progress={50}>
  50% Complete
</Button>
```

### Loading with Progress
Combine spinner and progress bar:

```tsx
<Button variant="default" disabled progress={75}>
  <Spinner />
  Processing 75%
</Button>
```

### Interactive Example
```tsx
const [uploading, setUploading] = useState(false);
const [progress, setProgress] = useState(0);

<Button
  variant="default"
  disabled={uploading}
  progress={uploading ? progress : undefined}
  onClick={handleUpload}
>
  {uploading && <Spinner />}
  {uploading ? `Uploading ${progress}%` : "Upload File"}
</Button>
```

## Full Width

```tsx
<Button className="w-full">Full Width Button</Button>
```

## Custom Styling

```tsx
<Button className="rounded-full">Rounded Button</Button>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "secondary" \| "outline" \| "ghost" \| "destructive" \| "outline-destructive" \| "success" \| "outline-success" \| "link"` | `"default"` | Visual style variant |
| `size` | `"xs" \| "sm" \| "default" \| "lg" \| "icon-xs" \| "icon-sm" \| "icon" \| "icon-lg"` | `"default"` | Button size |
| `progress` | `number` | `undefined` | Progress percentage (0-100) |
| `disabled` | `boolean` | `false` | Disable button interaction |
| `className` | `string` | `undefined` | Additional CSS classes |
| `onClick` | `function` | `undefined` | Click event handler |
| `children` | `ReactNode` | `undefined` | Button content |

All standard HTML button attributes are also supported.

## Best Practices

1. **Use appropriate variants**: Use `destructive` for dangerous actions, `success` for positive confirmations
2. **Loading states**: Always disable buttons during loading and show a spinner
3. **Icon sizing**: Icons automatically size to 16px (size-4), override with custom classes if needed
4. **Progressive buttons**: Use progress bars for long-running operations to provide visual feedback
5. **Accessibility**: Always provide meaningful text, even with icon-only buttons (use screen reader text if needed)

## Common Patterns

### Form Submit Button
```tsx
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Spinner />
      Submitting...
    </>
  ) : (
    "Submit"
  )}
</Button>
```

### Confirmation Button
```tsx
<Button variant="destructive" onClick={handleDelete}>
  <Trash2 />
  Delete Item
</Button>
```

### Dropdown Trigger
```tsx
<Button variant="outline">
  Select Option
  <ChevronDown />
</Button>
```

### Upload with Progress
```tsx
<Button
  disabled={uploading}
  progress={uploadProgress}
  onClick={startUpload}
>
  {uploading && <Spinner />}
  {uploading ? `Uploading ${uploadProgress}%` : "Upload Files"}
</Button>
```

## Accessibility

- Buttons have proper focus states with ring indicators
- Disabled buttons are not keyboard accessible
- Icon-only buttons should include `aria-label` for screen readers
- Loading states maintain disabled attribute for proper interaction prevention
