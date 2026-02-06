# Textarea Component

A multi-line text input component following ShadCN design patterns with support for various states and configurations.

## Installation

```bash
npm install @wedevs/plugin-ui
```

## Import

```tsx
import { Textarea, Label } from "@wedevs/plugin-ui";
```

## Basic Usage

```tsx
<Textarea placeholder="Enter your text here..." />
```

## With Label

```tsx
<div className="space-y-2">
  <Label>Description</Label>
  <Textarea placeholder="Enter your description here..." rows={4} />
</div>
```

## Rows

Control the height by specifying the number of rows:

```tsx
<Textarea rows={2} placeholder="2 rows" />
<Textarea rows={4} placeholder="4 rows" />
<Textarea rows={6} placeholder="6 rows" />
```

## States

### Normal
```tsx
<Textarea placeholder="Normal state" rows={4} />
```

### With Value
```tsx
<Textarea
  defaultValue="Lorem ipsum is simply dummy text of the printing and typesetting industry."
  rows={4}
/>
```

### Error State
```tsx
<Textarea placeholder="Error state" rows={4} aria-invalid />
```

### Disabled
```tsx
<Textarea placeholder="Disabled state" rows={4} disabled />
```

## Form Field Examples

### Basic Field
```tsx
<div className="space-y-2">
  <Label>Description</Label>
  <Textarea placeholder="Enter your description here..." rows={4} />
  <p className="text-xs text-muted-foreground">
    Use this area to add help text related to this field.
  </p>
</div>
```

### With Info Icon
```tsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Label>Comments</Label>
    <Info className="size-4 text-muted-foreground" />
  </div>
  <Textarea
    defaultValue="Lorem ipsum is simply dummy text of the printing and typesetting industry."
    rows={4}
  />
  <p className="text-xs text-muted-foreground">
    Maximum 500 characters allowed.
  </p>
</div>
```

### Error State with Message
```tsx
<div className="space-y-2">
  <Label>Error State</Label>
  <Textarea placeholder="Enter your text here..." rows={4} aria-invalid />
  <p className="text-xs text-destructive">
    This field is required and cannot be empty.
  </p>
</div>
```

## Character Counter

```tsx
const [text, setText] = useState("");
const maxLength = 500;

<div className="space-y-2">
  <Label>Description</Label>
  <Textarea
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="Enter your description..."
    rows={4}
    maxLength={maxLength}
  />
  <p className="text-xs text-muted-foreground">
    {text.length} / {maxLength} characters
  </p>
</div>
```

## Auto-resize

For auto-resizing textareas based on content:

```tsx
const textareaRef = useRef(null);

const autoResize = () => {
  const textarea = textareaRef.current;
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
};

<Textarea
  ref={textareaRef}
  onChange={(e) => {
    autoResize();
    // your onChange logic
  }}
  placeholder="Auto-resizing textarea..."
  rows={1}
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `undefined` | Placeholder text |
| `value` | `string` | `undefined` | Controlled value |
| `defaultValue` | `string` | `undefined` | Uncontrolled default value |
| `rows` | `number` | `undefined` | Number of visible text rows |
| `maxLength` | `number` | `undefined` | Maximum character length |
| `disabled` | `boolean` | `false` | Disable textarea |
| `readOnly` | `boolean` | `false` | Make textarea read-only |
| `className` | `string` | `undefined` | Additional CSS classes |
| `aria-invalid` | `boolean` | `false` | Accessibility error state |
| `onChange` | `function` | `undefined` | Change event handler |

All standard HTML textarea attributes are also supported.

## Best Practices

1. **Labels**: Always provide labels for textareas for better accessibility
2. **Rows**: Set an appropriate default height with the `rows` prop
3. **Character limits**: Show character counters when enforcing length limits
4. **Help text**: Provide guidance on expected content format
5. **Error messages**: Display clear, actionable error messages
6. **Resize**: Consider if users should be able to resize the textarea

## Common Patterns

### Comment Box
```tsx
<div className="space-y-2">
  <Label>Leave a comment</Label>
  <Textarea
    placeholder="Share your thoughts..."
    rows={4}
  />
</div>
```

### Feedback Form
```tsx
<div className="space-y-2">
  <Label>Feedback</Label>
  <Textarea
    placeholder="Tell us what you think..."
    rows={6}
  />
  <p className="text-xs text-muted-foreground">
    Your feedback helps us improve our product.
  </p>
</div>
```

### Message Composer
```tsx
const [message, setMessage] = useState("");
const maxChars = 1000;

<div className="space-y-2">
  <Label>Message</Label>
  <Textarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Type your message..."
    rows={4}
    maxLength={maxChars}
  />
  <div className="flex justify-between text-xs text-muted-foreground">
    <span>{message.length} / {maxChars} characters</span>
  </div>
</div>
```

## Accessibility

- Textareas have proper focus states with ring indicators
- Use `aria-invalid` for error states
- Provide labels with the `Label` component
- Include descriptive error messages
- Disabled textareas are not keyboard accessible
- Consider providing hints about expected content format
