# Notice Component

A callout-style notice component for displaying short, important messages with a left border accent. Similar to Alert but designed for simpler, title-only messages.

## Import

```tsx
import { Notice, NoticeTitle, NoticeAction } from "@/components/ui/notice"
```

## Components

| Component | Description |
|-----------|-------------|
| `Notice` | Main container with left border accent |
| `NoticeTitle` | Message text (medium weight) |
| `NoticeAction` | Action button/container (top-right absolute) |

---

## Notice Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `default \| destructive \| success \| warning \| info` | `"default"` | Visual style (border + title color) |
| `bgColor` | `string` | `"#EFEAFF"` | Custom background color (CSS value) |
| `borderColor` | `string` | - | Custom left border color (CSS value) |
| `titleColor` | `string` | - | Custom title text color (CSS value) |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Additional inline styles |
| `...props` | `ComponentProps<"div">` | - | Standard HTML div attributes |

### Variant Styles

| Variant | Border Color | Title Color | Background |
|---------|--------------|-------------|------------|
| `default` | `#9CA3AF` (gray) | `#25252D` | `#EFEAFF` (default) |
| `destructive` | Red-500 | Red-700 | `#EFEAFF` |
| `success` | Green-500 | Green-700 | `#EFEAFF` |
| `warning` | Yellow-500 | Yellow-900 | `#EFEAFF` |
| `info` | Blue-500 | Blue-700 | `#EFEAFF` |

---

## Usage Examples

### Basic Notice

```tsx
<Notice>
  <NoticeTitle>Default notice message.</NoticeTitle>
</Notice>
```

### All Variants

```tsx
// Default
<Notice>
  <NoticeTitle>Neutral info displayed here. Carry on.</NoticeTitle>
</Notice>

// Success
<Notice variant="success">
  <NoticeTitle>A successful message appears to those who did well.</NoticeTitle>
</Notice>

// Destructive (Error)
<Notice variant="destructive">
  <NoticeTitle>An error occurred while processing your request.</NoticeTitle>
</Notice>

// Warning
<Notice variant="warning">
  <NoticeTitle>Warning! Please review before you continue.</NoticeTitle>
</Notice>

// Info
<Notice variant="info">
  <NoticeTitle>Informational message for your reference.</NoticeTitle>
</Notice>
```

### With Close Button

```tsx
<Notice variant="success">
  <NoticeTitle>Success message with close button.</NoticeTitle>
  <NoticeAction>
    <button
      className="text-green-500 hover:text-green-700 text-xl leading-none"
      aria-label="Close"
      onClick={() => {}}
    >
      ×
    </button>
  </NoticeAction>
</Notice>
```

### Custom Colors

```tsx
// Custom purple notice
<Notice
  bgColor="#F3E8FF"
  borderColor="#A855F7"
  titleColor="#6B21A8"
>
  <NoticeTitle>Custom purple notice with left border.</NoticeTitle>
</Notice>
```

### Dismissible Notice (With State)

```tsx
import { useState } from "react"

function DismissibleNotice() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Notice variant="info">
      <NoticeTitle>Informational notice that can be dismissed.</NoticeTitle>
      <NoticeAction>
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-500 hover:text-blue-700 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </NoticeAction>
    </Notice>
  )
}
```

---

## Notice vs Alert

| Feature | Notice | Alert |
|---------|--------|-------|
| **Style** | Left border only (callout) | Full border |
| **Content** | Title only | Title + Description |
| **Use Case** | Brief messages | Detailed messages |
| **Border** | 3px left accent | Full rounded border |
| **Background** | Light purple default | Varied by variant |

---

## Best Practices

- Use `Notice` for brief, single-line messages
- Use `Alert` when you need descriptions or detailed content
- Always include a close button for dismissible notices
- Keep title text short and actionable
- Use `variant` to match the message severity
- Use custom colors to match your brand when needed

---

## Accessibility

The `Notice` component includes `role="status"` for screen readers, ensuring messages are properly announced without being treated as urgent alerts (unlike `Alert` which uses `role="alert"`).
