# Checkbox Component

A flexible checkbox component following ShadCN design patterns with support for labeled variants, card-style layouts, and various orientations.

## Installation

```bash
npm install @wedevs/plugin-ui
```

## Import

```tsx
import { Checkbox, LabeledCheckbox, CheckboxCard } from "@wedevs/plugin-ui";
```

## Basic Checkbox

### Default

```tsx
<Checkbox />
```

### Checked

```tsx
<Checkbox defaultChecked />
```

### Indeterminate

```tsx
<Checkbox indeterminate />
```

### Disabled

```tsx
<Checkbox disabled />
<Checkbox disabled defaultChecked />
```

## Labeled Checkbox

A checkbox with an associated label and optional description.

### Basic Labeled

```tsx
<LabeledCheckbox 
  id="terms"
  label="Accept terms and conditions" 
/>
```

### With Description

```tsx
<LabeledCheckbox 
  id="newsletter"
  label="Subscribe to newsletter"
  description="Get updates about new features and promotions."
/>
```

### Position Right

Place the checkbox on the right side of the label:

```tsx
<LabeledCheckbox
  id="marketing"
  label="Receive marketing emails"
  description="We'll send you promotional content occasionally."
  position="right"
/>
```

## Orientations

### Horizontal (Default)

```tsx
<LabeledCheckbox
  id="horizontal"
  label="Horizontal Layout"
  description="This is the default horizontal orientation."
  orientation="horizontal"
/>
```

### Vertical

```tsx
<LabeledCheckbox
  id="vertical"
  label="Vertical Layout"
  description="Label and description stack below the checkbox."
  orientation="vertical"
/>
```

### Responsive

Automatically switches between horizontal and vertical based on screen size:

```tsx
<LabeledCheckbox
  id="responsive"
  label="Responsive Layout"
  description="Adapts to screen size automatically."
  orientation="responsive"
/>
```

## Checkbox Card

A card-style checkbox with highlighted border when selected.

### Basic Card

```tsx
<CheckboxCard
  id="card-basic"
  label="Basic Plan"
  description="Perfect for getting started"
/>
```

### Card Position Right

```tsx
<CheckboxCard
  id="card-right"
  label="Pro Plan"
  description="Best for growing businesses"
  position="right"
/>
```

### Card Disabled

```tsx
<CheckboxCard
  id="card-disabled"
  label="Enterprise Plan"
  description="Coming soon"
  disabled
/>
```

## Checkbox Group

Group multiple checkboxes together:

```tsx
<div className="flex flex-col gap-3">
  <LabeledCheckbox 
    id="feature-1"
    label="Feature 1"
    description="Enable first feature"
  />
  <LabeledCheckbox 
    id="feature-2"
    label="Feature 2"
    description="Enable second feature"
  />
  <LabeledCheckbox 
    id="feature-3"
    label="Feature 3"
    description="Enable third feature"
  />
</div>
```

## Card Group

Group multiple checkbox cards:

```tsx
<div className="flex flex-col gap-3">
  <CheckboxCard
    id="plan-starter"
    label="Starter"
    description="$9/month - Basic features"
  />
  <CheckboxCard
    id="plan-professional"
    label="Professional"
    description="$29/month - Advanced features"
  />
  <CheckboxCard
    id="plan-business"
    label="Business"
    description="$99/month - All features included"
  />
</div>
```

## Select All Pattern

Implement a "select all" checkbox pattern:

```tsx
import { useState } from "react";
import { Checkbox, LabeledCheckbox } from "@wedevs/plugin-ui";

function SelectAllExample() {
  const allItems = ["item1", "item2", "item3"];
  const [selected, setSelected] = useState<string[]>([]);

  const allSelected = selected.length === allItems.length;
  const someSelected = selected.length > 0 && !allSelected;

  const handleSelectAll = () => {
    setSelected(allSelected ? [] : allItems);
  };

  const handleItemToggle = (item: string) => {
    setSelected(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="border-b pb-2 mb-2">
        <LabeledCheckbox
          id="select-all"
          label="Select All"
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={handleSelectAll}
        />
      </div>
      {allItems.map(item => (
        <LabeledCheckbox
          key={item}
          id={`item-${item}`}
          label={`Item ${item}`}
          checked={selected.includes(item)}
          onCheckedChange={() => handleItemToggle(item)}
        />
      ))}
    </div>
  );
}
```

## Controlled Checkbox

Use controlled state with the checkbox:

```tsx
import { useState } from "react";
import { Checkbox } from "@wedevs/plugin-ui";

function ControlledCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}
```

## Form Validation

Use with form validation:

```tsx
<LabeledCheckbox
  id="agree-terms"
  label="I agree to the terms of service"
  description="You must accept to continue"
  aria-invalid={hasError}
/>
```

## API Reference

### Checkbox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Default checked state |
| `indeterminate` | `boolean` | `false` | Shows indeterminate (minus) indicator |
| `disabled` | `boolean` | `false` | Disables the checkbox |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback when checked state changes |
| `className` | `string` | - | Additional CSS classes |

### LabeledCheckbox Props

Extends all Checkbox props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique identifier (required for accessibility) |
| `label` | `React.ReactNode` | - | Label text |
| `description` | `React.ReactNode` | - | Optional description text |
| `orientation` | `"horizontal" \| "vertical" \| "responsive"` | `"horizontal"` | Layout orientation |
| `position` | `"left" \| "right"` | `"left"` | Checkbox position relative to label |

### CheckboxCard Props

Same props as LabeledCheckbox. Displays in a card-style container with border highlight when checked.
