# Avatar and Thumbnail Components

## Avatar

Avatar component for displaying user profile images with fallback support. Built on top of [Base UI Avatar](https://base-ui.com/react/components/avatar).

### Components

- `Avatar` - Root container component
- `AvatarImage` - The image element
- `AvatarFallback` - Fallback content when image fails to load
- `AvatarBadge` - Status badge/indicator overlay
- `AvatarGroup` - Container for stacked avatars
- `AvatarGroupCount` - Count indicator for grouped avatars

### Avatar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| number` | `"md"` | Size of the avatar. Preset values: `xs` (24px), `sm` (28px), `md` (32px), `lg` (48px). Pass a number for custom pixel size. |
| `shape` | `"circle" \| "square"` | `"circle"` | Shape of the avatar. `circle` is fully rounded, `square` has 5px border-radius. |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Inline styles (merged with size style) |

### AvatarImage Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source URL |
| `alt` | `string` | - | Alt text for accessibility |
| `className` | `string` | - | Additional CSS classes |

### AvatarFallback Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Inline styles |
| `children` | `ReactNode` | - | Fallback content (typically initials or icon) |

### AvatarBadge Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Inline styles |
| `children` | `ReactNode` | - | Badge content (typically status dot or icon) |

### AvatarGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### AvatarGroupCount Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `AvatarSize` | `"md"` | Size of the count badge (inherits Avatar sizing) |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Inline styles |
| `children` | `ReactNode` | - | Count content (number or text) |

### Usage Examples

#### Basic Avatar with image and fallback

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

#### Different sizes

```tsx
<Avatar size="xs">
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>XS</AvatarFallback>
</Avatar>

<Avatar size="sm">
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>SM</AvatarFallback>
</Avatar>

<Avatar size="md">
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>MD</AvatarFallback>
</Avatar>

<Avatar size="lg">
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>LG</AvatarFallback>
</Avatar>

<Avatar size={64}>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>64</AvatarFallback>
</Avatar>
```

#### Square shape

```tsx
<Avatar shape="square">
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

#### With status badge

```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
  <AvatarBadge>
    <span className="block size-2 rounded-full bg-green-500" />
  </AvatarBadge>
</Avatar>
```

#### Avatar group

```tsx
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"

<AvatarGroup>
  <Avatar>
    <AvatarImage src="/user1.jpg" />
    <AvatarFallback>AB</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage src="/user2.jpg" />
    <AvatarFallback>CD</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage src="/user3.jpg" />
    <AvatarFallback>EF</AvatarFallback>
  </Avatar>
  <AvatarGroupCount>+5</AvatarGroupCount>
</AvatarGroup>
```

#### Colored fallback

```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback className="bg-primary text-primary-foreground">
    JD
  </AvatarFallback>
</Avatar>
```

---

## Thumbnail

Thumbnail component for displaying images with aspect ratio support and fallback content.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `undefined` | Image source URL. If omitted, shows fallback immediately. |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| number` | `"md"` | Height of the thumbnail. Preset values: `xs` (24px), `sm` (28px), `md` (32px), `lg` (48px). Pass a number for custom pixel height. Width is calculated based on aspect ratio. |
| `aspect` | `"landscape" \| "portrait" \| "square"` | `"square"` | Aspect ratio of the thumbnail. `landscape` (16:9), `portrait` (3:4), `square` (1:1). |
| `fallback` | `ReactNode` | Default icon | Custom fallback content shown when `src` is empty or image fails to load. Defaults to a landscape image icon. |
| `alt` | `string` | `""` | Alt text for the image |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Inline styles (merged with size/aspect styles) |

### Usage Examples

#### Basic thumbnail

```tsx
import { Thumbnail } from "@/components/ui/thumbnail"

<Thumbnail src="/image.jpg" alt="Preview" />
```

#### Different sizes

```tsx
<Thumbnail src="/image.jpg" size="xs" />
<Thumbnail src="/image.jpg" size="sm" />
<Thumbnail src="/image.jpg" size="md" />
<Thumbnail src="/image.jpg" size="lg" />
<Thumbnail src="/image.jpg" size={200} />
```

#### Different aspect ratios

```tsx
<Thumbnail src="/landscape.jpg" aspect="landscape" />
<Thumbnail src="/portrait.jpg" aspect="portrait" />
<Thumbnail src="/square.jpg" aspect="square" />
```

#### With custom fallback

```tsx
<Thumbnail
  src="/image.jpg"
  fallback={<span className="text-xs">No image</span>}
/>
```

#### Loading/fallback state (no src)

```tsx
<Thumbnail fallback={<div>Loading...</div>} />
```

#### Combined size and aspect

```tsx
<Thumbnail
  src="/poster.jpg"
  size="lg"
  aspect="portrait"
  alt="Movie poster"
/>
```

#### Custom styling

```tsx
<Thumbnail
  src="/image.jpg"
  size={150}
  aspect="landscape"
  className="border-2 border-border"
/>
```

---

## Size Reference

### Avatar Sizes

| Size | Pixel Value |
|------|-------------|
| `xs` | 24px |
| `sm` | 28px |
| `md` | 32px |
| `lg` | 48px |

### Thumbnail Heights (width calculated by aspect)

| Size | Height |
|------|--------|
| `xs` | 24px |
| `sm` | 28px |
| `md` | 32px |
| `lg` | 48px |

### Thumbnail Aspect Ratios

| Aspect | Ratio |
|--------|-------|
| `landscape` | 16:9 |
| `portrait` | 3:4 |
| `square` | 1:1 |

## Notes

- **Avatar** always maintains equal width and height (1:1 aspect ratio)
- **AvatarBadge** positions itself at bottom-right and is always circular (on circle avatars) or has 3px radius (on square avatars)
- **AvatarGroup** applies negative horizontal spacing (`-space-x-2`) and ring borders to separate stacked avatars
- **Thumbnail** width is automatically calculated based on height and aspect ratio
- Both components support fully custom sizes via number prop
- Both components use `data-slot` attributes for targeting in CSS
