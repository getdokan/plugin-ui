# SelectionType Component

A card-style selection component for choosing between multiple options with icons and visual feedback.

## Installation

```bash
npm install @wedevs/plugin-ui
```

## Import

```tsx
import { SelectionType, SelectionItem } from "@wedevs/plugin-ui";
```

## Basic Usage

```tsx
const [selected, setSelected] = useState("individual");

<SelectionType value={selected} onValueChange={setSelected}>
  <SelectionItem value="individual">
    Individual
  </SelectionItem>
  <SelectionItem value="business">
    Business
  </SelectionItem>
</SelectionType>
```

## With Icons

```tsx
import { User, Building } from "lucide-react";

const [selected, setSelected] = useState("individual");

<SelectionType value={selected} onValueChange={setSelected}>
  <SelectionItem
    value="individual"
    icon={<User className="size-5" />}
  >
    Individual
  </SelectionItem>
  <SelectionItem
    value="business"
    icon={<Building className="size-5" />}
  >
    Business
  </SelectionItem>
</SelectionType>
```

## With End Icons

```tsx
import { User, ChevronRight } from "lucide-react";

const [selected, setSelected] = useState("individual");

<SelectionType value={selected} onValueChange={setSelected}>
  <SelectionItem
    value="individual"
    icon={<User className="size-5" />}
    endIcon={<ChevronRight className="size-5" />}
  >
    Individual
  </SelectionItem>
  <SelectionItem
    value="business"
    icon={<User className="size-5" />}
    endIcon={<ChevronRight className="size-5" />}
  >
    Business
  </SelectionItem>
</SelectionType>
```

## Sizes

### Small
```tsx
<SelectionType value={selected} onValueChange={setSelected}>
  <SelectionItem value="option1" size="sm">
    Small Option
  </SelectionItem>
</SelectionType>
```

### Medium (Default)
```tsx
<SelectionType value={selected} onValueChange={setSelected}>
  <SelectionItem value="option1" size="md">
    Medium Option
  </SelectionItem>
</SelectionType>
```

### Large
```tsx
<SelectionType value={selected} onValueChange={setSelected}>
  <SelectionItem value="option1" size="lg">
    Large Option
  </SelectionItem>
</SelectionType>
```

## Multiple Options

```tsx
const [accountType, setAccountType] = useState("individual");

<SelectionType value={accountType} onValueChange={setAccountType}>
  <SelectionItem
    value="individual"
    icon={<User className="size-5" />}
    endIcon={<ChevronRight className="size-5" />}
  >
    Individual
  </SelectionItem>
  <SelectionItem
    value="business"
    icon={<Building className="size-5" />}
    endIcon={<ChevronRight className="size-5" />}
  >
    Business
  </SelectionItem>
  <SelectionItem
    value="enterprise"
    icon={<Building2 className="size-5" />}
    endIcon={<ChevronRight className="size-5" />}
  >
    Enterprise
  </SelectionItem>
  <SelectionItem
    value="nonprofit"
    icon={<Heart className="size-5" />}
    endIcon={<ChevronRight className="size-5" />}
  >
    Non-Profit Organization
  </SelectionItem>
</SelectionType>
```

## Complete Example with Form

```tsx
import { User, Building, ChevronRight } from "lucide-react";

function AccountTypeSelector() {
  const [accountType, setAccountType] = useState("individual");

  const handleSubmit = () => {
    console.log("Selected account type:", accountType);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Account Type</Label>
        <SelectionType value={accountType} onValueChange={setAccountType}>
          <SelectionItem
            value="individual"
            icon={<User className="size-5" />}
            endIcon={<ChevronRight className="size-5" />}
          >
            Individual
          </SelectionItem>
          <SelectionItem
            value="business"
            icon={<Building className="size-5" />}
            endIcon={<ChevronRight className="size-5" />}
          >
            Business
          </SelectionItem>
        </SelectionType>
        <p className="text-sm text-muted-foreground">
          Selected: <strong>{accountType}</strong>
        </p>
      </div>
      <Button onClick={handleSubmit}>Continue</Button>
    </div>
  );
}
```

## Disabled State

```tsx
<SelectionType value={selected} onValueChange={setSelected}>
  <SelectionItem value="option1">Available Option</SelectionItem>
  <SelectionItem value="option2" disabled>
    Disabled Option
  </SelectionItem>
</SelectionType>
```

## Custom Styling

```tsx
<SelectionType value={selected} onValueChange={setSelected}>
  <SelectionItem
    value="premium"
    className="border-primary bg-primary/5"
    icon={<Star className="size-5" />}
  >
    Premium Account
  </SelectionItem>
  <SelectionItem
    value="basic"
    icon={<User className="size-5" />}
  >
    Basic Account
  </SelectionItem>
</SelectionType>
```

## Props Reference

### SelectionType Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | Currently selected value |
| `onValueChange` | `function` | `undefined` | Callback when selection changes |
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | SelectionItem components |

### SelectionItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Unique identifier for this option |
| `icon` | `ReactNode` | `undefined` | Icon to display on the left |
| `endIcon` | `ReactNode` | `undefined` | Icon to display on the right |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `variant` | `"default" \| "selected"` | `"default"` | Visual variant (auto-managed) |
| `disabled` | `boolean` | `false` | Disable the option |
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Option label |
| `onClick` | `function` | `undefined` | Additional click handler |

All standard HTML button attributes are also supported.

## Best Practices

1. **Icons**: Use meaningful icons that represent each option
2. **Labels**: Keep labels concise but descriptive
3. **Grouping**: Use the dashed border container to visually group related options
4. **End icons**: ChevronRight is commonly used to indicate that selection leads to next step
5. **Feedback**: The selected state is automatically styled with primary color
6. **Accessibility**: Provide clear labels and maintain focus states

## Common Patterns

### Account Type Selection
```tsx
<SelectionType value={accountType} onValueChange={setAccountType}>
  <SelectionItem
    value="personal"
    icon={<User className="size-5" />}
    endIcon={<ChevronRight className="size-5" />}
  >
    Personal Account
  </SelectionItem>
  <SelectionItem
    value="business"
    icon={<Building className="size-5" />}
    endIcon={<ChevronRight className="size-5" />}
  >
    Business Account
  </SelectionItem>
</SelectionType>
```

### Plan Selection
```tsx
<SelectionType value={plan} onValueChange={setPlan}>
  <SelectionItem
    value="free"
    icon={<Gift className="size-5" />}
    endIcon={<ChevronRight className="size-5" />}
  >
    Free Plan
  </SelectionItem>
  <SelectionItem
    value="pro"
    icon={<Zap className="size-5" />}
    endIcon={<ChevronRight className="size-5" />}
  >
    Pro Plan
  </SelectionItem>
  <SelectionItem
    value="enterprise"
    icon={<Crown className="size-5" />}
    endIcon={<ChevronRight className="size-5" />}
  >
    Enterprise Plan
  </SelectionItem>
</SelectionType>
```

### User Role Selection
```tsx
<SelectionType value={role} onValueChange={setRole}>
  <SelectionItem
    value="admin"
    icon={<Shield className="size-5" />}
  >
    Administrator
  </SelectionItem>
  <SelectionItem
    value="editor"
    icon={<Edit className="size-5" />}
  >
    Editor
  </SelectionItem>
  <SelectionItem
    value="viewer"
    icon={<Eye className="size-5" />}
  >
    Viewer
  </SelectionItem>
</SelectionType>
```

### With Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Choose Your Account Type</CardTitle>
    <CardDescription>
      Select the type of account you want to create
    </CardDescription>
  </CardHeader>
  <CardContent>
    <SelectionType value={selected} onValueChange={setSelected}>
      <SelectionItem
        value="individual"
        icon={<User className="size-5" />}
        endIcon={<ChevronRight className="size-5" />}
      >
        Individual
      </SelectionItem>
      <SelectionItem
        value="business"
        icon={<Building className="size-5" />}
        endIcon={<ChevronRight className="size-5" />}
      >
        Business
      </SelectionItem>
    </SelectionType>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Continue</Button>
  </CardFooter>
</Card>
```

## Accessibility

- Each selection item is a button with proper keyboard navigation
- Focus states are clearly visible
- Selected state is indicated both visually and programmatically
- Icons have appropriate sizing for touch targets
- Disabled items are not keyboard accessible
- Proper ARIA attributes for screen readers
