# Progress Component

A fully customizable progress indicator component with both linear and circular variants. Wraps the `@base-ui/react/progress` primitive for consistency and accessibility.

## Features

- **Linear** (default) and **Circular** progress types
- **Variants**: default, success, green, danger, warning, purple, brown
- **Sizes**: sm, md (default), lg
- **Indeterminate** state (no value)
- **Striped/Animated** mode for indeterminate or emphasis
- **Rounded** tracks (pill-style)
- **Show value** option to display percentage text

## Basic Usage

```tsx
import { Progress } from "@wedevs/plugin-ui";

// Linear progress (default)
<Progress value={70} showValue />

// Circular progress
<Progress type="circular" value={75} size="md" />

// Indeterminate (shows as looping/pulsing)
<Progress />
<Progress type="circular" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | undefined | Current progress (0-100). Omit for indeterminate. |
| `max` | number | 100 | Maximum value. |
| `min` | number | 0 | Minimum value. |
| `size` | "sm" \| "md" \| "lg" | "md" | Visual size of progress indicator. |
| `type` | "linear" \| "circular" | "linear" | Linear bar or circular ring. |
| `variant` | ProgressVariant | "default" | Color variant. |
| `showValue` | boolean | false | Display percentage text. |
| `rounded` | boolean | true | Rounded corners/pill track (linear only). |
| `striped` | boolean | false | Animated/striped indeterminate style. |
| `className` | string | - | CSS class for outer container. |

## Variants

- `default` – uses primary color (theme)
- `success` / `green` – green-600
- `danger` – red-600
- `warning` – amber-600
- `purple` – purple-600
- `brown` – amber-800

## Examples

### Linear with variants
```tsx
<Progress value={70} variant="success" showValue rounded />
<Progress value={45} variant="warning" showValue />
<Progress value={90} variant="purple" showValue />
<Progress value={30} variant="brown" showValue />
```

### Circular with variants
```tsx
<Progress type="circular" value={75} variant="green" size="md" />
<Progress type="circular" value={40} variant="purple" size="sm" />
<Progress type="circular" value={100} variant="danger" size="lg" />
```

### Indeterminate / Striped
```tsx
<Progress striped />
<Progress type="circular" />
```

### Accessibility

The component uses Base UI's accessible `ProgressRoot` which provides:
- `role="progressbar"`
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- `aria-valuetext` with formatted percentage
- Proper labeling and state management

---

## Slider Component

A knob-style slider built on `@base-ui/react/slider` for interactive progress selection.

### Basic Usage

```tsx
import { Slider } from "@wedevs/plugin-ui";

<Slider defaultValue={[50]} variant="green" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | "default" \| "green" \| "purple" \| "brown" \| "danger" | "default" | Track color. |
| `size` | "sm" \| "md" \| "lg" | "md" | Visual size. |
| `defaultValue` | number[] | [0] | Default slider value. |
| `value` | number[] | - | Controlled value. |
| `onChange` | (value: number[]) => void | - | Change handler. |
| `min` | number | 0 | Minimum value. |
| `max` | number | 100 | Maximum value. |

### Examples

```tsx
const [val, setVal] = React.useState([30]);

<Slider value={val} onChange={setVal} variant="purple" />
<Slider value={val} onChange={setVal} variant="green" />
<Slider value={val} onChange={setVal} variant="brown" />
```
