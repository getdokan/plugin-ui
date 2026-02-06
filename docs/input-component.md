# Input Component

A flexible input component following ShadCN design patterns with support for various states, icons, and input groups.

## Installation

```bash
npm install @wedevs/plugin-ui
```

## Import

```tsx
import { Input, InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton, InputGroupText, Label } from "@wedevs/plugin-ui";
```

## Basic Usage

```tsx
<Input placeholder="Enter text" />
```

## With Label

```tsx
<div className="space-y-2">
  <Label>Username</Label>
  <Input placeholder="Enter your username" />
</div>
```

## Input Types

```tsx
<Input type="text" placeholder="Text input" />
<Input type="email" placeholder="Email input" />
<Input type="password" placeholder="Password input" />
<Input type="number" placeholder="Number input" />
<Input type="search" placeholder="Search input" />
```

## Sizes

### Small
```tsx
<Input placeholder="Small input" className="h-8 text-sm" />
```

### Default
```tsx
<Input placeholder="Default input" />
```

### Large
```tsx
<Input placeholder="Large input" className="h-12 text-base" />
```

## States

### Normal
```tsx
<Input placeholder="Normal state" />
```

### Focus
```tsx
<Input placeholder="Focus state" autoFocus />
```

### Error
```tsx
<Input placeholder="Error state" aria-invalid />
```

### Disabled
```tsx
<Input placeholder="Disabled state" disabled />
```

## Input Groups

Input groups allow you to add icons, text, or buttons before or after the input.

### Icon Left
```tsx
<InputGroup>
  <InputGroupAddon align="inline-start">
    <InputGroupText>
      <Search />
    </InputGroupText>
  </InputGroupAddon>
  <InputGroupInput placeholder="Search..." />
</InputGroup>
```

### Icon Right (Button)
```tsx
<InputGroup>
  <InputGroupInput placeholder="Select option" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-xs">
      <ChevronDown />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

### Both Icons
```tsx
<InputGroup>
  <InputGroupAddon align="inline-start">
    <InputGroupText>
      <Search />
    </InputGroupText>
  </InputGroupAddon>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-xs">
      <ChevronDown />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

## Specialized Inputs

### Currency Input
```tsx
<InputGroup>
  <InputGroupAddon align="inline-start">
    <InputGroupText>$</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput type="text" placeholder="0.00" />
  <InputGroupAddon align="inline-end">
    <InputGroupText>USD</InputGroupText>
  </InputGroupAddon>
</InputGroup>
```

### Number Input with Buttons
```tsx
const [quantity, setQuantity] = useState(1);

<InputGroup>
  <InputGroupAddon align="inline-start">
    <InputGroupButton
      size="icon-xs"
      onClick={() => setQuantity(Math.max(0, quantity - 1))}
    >
      <Minus />
    </InputGroupButton>
  </InputGroupAddon>
  <InputGroupInput
    type="number"
    value={quantity}
    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
    className="text-center"
  />
  <InputGroupAddon align="inline-end">
    <InputGroupButton
      size="icon-xs"
      onClick={() => setQuantity(quantity + 1)}
    >
      <Plus />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

### URL Input
```tsx
<InputGroup className="[--radius:9999px]">
  <InputGroupAddon align="inline-start">
    <InputGroupText>https://</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput placeholder="example.com" />
  <InputGroupAddon align="inline-end">
    <InputGroupText>.com</InputGroupText>
  </InputGroupAddon>
</InputGroup>
```

### Tag Input
```tsx
const [tags, setTags] = useState(["tag1", "tag2"]);
const [tagInput, setTagInput] = useState("");

const handleKeyDown = (e) => {
  if (e.key === "Enter" && tagInput.trim()) {
    e.preventDefault();
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  }
};

<div className="flex items-center gap-2 min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
  <Search className="size-4 text-muted-foreground" />
  <div className="flex flex-wrap items-center gap-1 flex-1">
    {tags.map((tag, i) => (
      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-xs">
        {tag}
        <X
          className="size-3 cursor-pointer hover:text-destructive"
          onClick={() => setTags(tags.filter((_, index) => index !== i))}
        />
      </span>
    ))}
    <input
      type="text"
      value={tagInput}
      onChange={(e) => setTagInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={tags.length === 0 ? "Type to add tags" : ""}
      className="flex-1 outline-none bg-transparent min-w-[100px]"
    />
  </div>
</div>
```

## Form Field Examples

### Basic Field
```tsx
<div className="space-y-2">
  <Label>Pick user name</Label>
  <Input placeholder="Type something" />
</div>
```

### With Help Text
```tsx
<div className="space-y-2">
  <Label>Pick user name</Label>
  <Input placeholder="Type something" />
  <p className="text-xs text-muted-foreground">
    Use this area to add help text related to this field.
  </p>
</div>
```

### With Info Icon
```tsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Label>Pick user name</Label>
    <Info className="size-4 text-muted-foreground" />
  </div>
  <Input placeholder="Type something" />
  <p className="text-xs text-muted-foreground">
    Use this area to add help text related to this field.
  </p>
</div>
```

### Error State
```tsx
<div className="space-y-2">
  <Label>Pick user name</Label>
  <Input placeholder="Type something" aria-invalid />
  <p className="text-xs text-destructive">
    This field is required and cannot be empty.
  </p>
</div>
```

### Disabled State
```tsx
<div className="space-y-2">
  <Label>Pick user name</Label>
  <Input placeholder="Type something" disabled />
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    <Info className="size-4" />
    <span>This field is currently disabled.</span>
  </div>
</div>
```

## Props Reference

### Input Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `"text"` | HTML input type |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `value` | `string` | `undefined` | Controlled value |
| `defaultValue` | `string` | `undefined` | Uncontrolled default value |
| `disabled` | `boolean` | `false` | Disable input |
| `error` | `boolean` | `false` | Error state styling |
| `className` | `string` | `undefined` | Additional CSS classes |
| `aria-invalid` | `boolean` | `false` | Accessibility error state |

### InputGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Group content |

### InputGroupAddon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"inline-start" \| "inline-end"` | Required | Position of addon |
| `children` | `ReactNode` | `undefined` | Addon content |

## Best Practices

1. **Labels**: Always provide labels for inputs for better accessibility
2. **Error states**: Use `aria-invalid` for error states and provide error messages
3. **Help text**: Add descriptive help text below inputs when needed
4. **Placeholder vs Label**: Use labels for field identification, placeholders for examples
5. **Disabled states**: Explain why fields are disabled when possible
6. **Input groups**: Keep addon content concise and relevant

## Accessibility

- Inputs have proper focus states with ring indicators
- Use `aria-invalid` for error states
- Provide labels with the `Label` component
- Include descriptive error messages
- Disabled inputs are not keyboard accessible
- Input groups maintain focus states properly
