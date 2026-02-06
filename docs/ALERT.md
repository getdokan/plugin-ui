# Alert Component

A flexible alert component for displaying important messages with various visual styles.

## Import

```tsx
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"
```

## Components

| Component | Description |
|-----------|-------------|
| `Alert` | Main container component |
| `AlertTitle` | Bold heading text |
| `AlertDescription` | Supporting message content |
| `AlertAction` | Action button/container (top-right absolute) |

---

## Alert Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `default \| destructive \| success \| warning \| info` | `"default"` | Visual style of the alert |
| `bgColor` | `string` | - | Custom background color (CSS value) |
| `borderColor` | `string` | - | Custom border color (CSS value) |
| `titleColor` | `string` | - | Custom title text color (CSS value) |
| `descriptionColor` | `string` | - | Custom description text color (CSS value) |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Additional inline styles |
| `...props` | `ComponentProps<"div">` | - | Standard HTML div attributes |

### Variant Styles

| Variant | Background | Border | Title Color | Description Color |
|---------|-----------|--------|-------------|-------------------|
| `default` | `#F8F9F8` | `#E9E9E9` | `#25252D` | `#575757` |
| `destructive` | Red-50 | Transparent | Red-700 | Red-500 |
| `success` | Green-50 | None | Green-700 | Green-700 |
| `warning` | Yellow-50 | None | Yellow-900 | Yellow-900 |
| `info` | Blue-600 | None | White | White/80 |

---

## Usage Examples

### Title Only

```tsx
<Alert>
  <AlertTitle>Default Alert - Title Only</AlertTitle>
</Alert>

<Alert variant="success">
  <AlertTitle>Settings saved successfully!</AlertTitle>
</Alert>
```

### With Description

```tsx
<Alert>
  <AlertTitle>Default Alert - With Description</AlertTitle>
  <AlertDescription>This is a default alert with both title and description. It uses neutral colors with a light gray background.</AlertDescription>
</Alert>
```

### All Variants

```tsx
// Default
<Alert>
  <AlertTitle>Default</AlertTitle>
  <AlertDescription>Neutral information message.</AlertDescription>
</Alert>

// Destructive (Error)
<Alert variant="destructive">
  <AlertTitle>Error occurred</AlertTitle>
  <AlertDescription>Something went wrong while processing your request. Please try again later.</AlertDescription>
</Alert>

// Success
<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Your changes have been saved successfully.</AlertDescription>
</Alert>

// Warning
<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Your session will expire in 5 minutes. Please save your work.</AlertDescription>
</Alert>

// Info
<Alert variant="info">
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>Did you know? You can customize the theme colors in the settings panel.</AlertDescription>
</Alert>
```

### With Inline Buttons

```tsx
<Alert>
  <div className="flex items-center">
    <AlertTitle>Default Alert - With Buttons</AlertTitle>
    <div className="flex justify-end ml-auto gap-2">
      <Button size="sm">Confirm</Button>
      <Button size="sm" variant="secondary">Cancel</Button>
    </div>
  </div>
</Alert>
```

### With Action Buttons Below

```tsx
<Alert variant="info">
  <AlertTitle>New Update Available</AlertTitle>
  <AlertDescription>A new version of the plugin is available for download.</AlertDescription>
  <div className="flex gap-2 mt-2">
    <Button size="sm" variant="primary">Update Now</Button>
    <Button size="sm" variant="ghost">Later</Button>
  </div>
</Alert>
```

### With Close Button (AlertAction)

```tsx
import { X } from "lucide-react"

<Alert variant="info">
  <AlertTitle>Update Available</AlertTitle>
  <AlertDescription>A new version of the app is now available.</AlertDescription>
  <AlertAction>
    <Button
      size="icon"
      variant="ghost"
      className="h-8 w-8 p-0"
    >
      <X className="h-4 w-4" />
    </Button>
  </AlertAction>
</Alert>
```

### Dismissible Alert (With State)

```tsx
import { useState } from "react"
import { X } from "lucide-react"

function DismissibleAlert() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Alert variant="info">
      <AlertTitle>Update Available</AlertTitle>
      <AlertDescription>A new version of the app is now available.</AlertDescription>
      <AlertAction>
        <Button
          onClick={() => setIsVisible(false)}
          size="icon"
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertAction>
    </Alert>
  )
}
```

### With Icon

```tsx
import { CheckCircle, AlertTriangle, Info } from "lucide-react"

// Success with icon
<Alert variant="success">
  <CheckCircle className="size-4" />
  <AlertTitle>Payment successful</AlertTitle>
  <AlertDescription>Your subscription has been activated.</AlertDescription>
</Alert>

// Warning with icon
<Alert variant="warning">
  <AlertTriangle className="size-4" />
  <AlertTitle>Please review before continuing</AlertTitle>
</Alert>
```

### Custom Colors (Full Override)

```tsx
<Alert
  bgColor="#FEF3C7"
  borderColor="#F59E0B"
  titleColor="#92400E"
  descriptionColor="#B45309"
>
  <AlertTitle>Custom Colors Alert</AlertTitle>
  <AlertDescription>This alert uses custom colors defined via props instead of variant presets.</AlertDescription>
</Alert>

// Custom purple theme
<Alert
  bgColor="#F3E8FF"
  borderColor="#A855F7"
  titleColor="#6B21A8"
  descriptionColor="#7E22CE"
>
  <AlertTitle>Purple Theme Alert</AlertTitle>
  <AlertDescription>Custom purple themed alert for special use cases.</AlertDescription>
</Alert>
```

### Mixing Variant with Custom Colors

```tsx
// Uses success variant colors but overrides description color
<Alert
  variant="success"
  descriptionColor="#15803d"
>
  <AlertTitle>Custom Description Color</AlertTitle>
  <AlertDescription>This uses success variant colors but with a darker custom description color.</AlertDescription>
</Alert>
```

### Description Only (No Title)

```tsx
<Alert variant="info">
  <AlertDescription>Simple informational message without a title.</AlertDescription>
</Alert>
```

---

## Best Practices

- Use `default` for general notices
- Use `destructive` for errors or critical issues
- Use `success` for successful operations
- Use `warning` for cautionary messages
- Use `info` for helpful tips or supplementary information
- Include an `AlertAction` with a close button for dismissible alerts
- Keep descriptions concise and actionable
- Use icons to reinforce the message type when appropriate

---

## Accessibility

The `Alert` component includes `role="alert"` for screen readers, ensuring important messages are announced to users with assistive technologies.
