# RadioGroup Component

A flexible radio group component following ShadCN design patterns with support for labeled variants, card-style layouts, and various orientations.

## Installation

```bash
npm install @wedevs/plugin-ui
```

## Import

```tsx
import { RadioGroup, RadioGroupItem, LabeledRadio, RadioCard } from "@wedevs/plugin-ui";
```

## Basic RadioGroup

### Default

```tsx
<RadioGroup defaultValue="option1">
  <RadioGroupItem value="option1" />
  <RadioGroupItem value="option2" />
  <RadioGroupItem value="option3" />
</RadioGroup>
```

### Disabled

```tsx
<RadioGroup defaultValue="option1" disabled>
  <RadioGroupItem value="option1" />
  <RadioGroupItem value="option2" />
</RadioGroup>
```

## Labeled Radio

A radio button with an associated label and optional description.

### Basic Labeled

```tsx
<RadioGroup defaultValue="email">
  <LabeledRadio 
    id="email"
    value="email" 
    label="Email notifications" 
  />
  <LabeledRadio 
    id="sms"
    value="sms" 
    label="SMS notifications" 
  />
  <LabeledRadio 
    id="push"
    value="push" 
    label="Push notifications" 
  />
</RadioGroup>
```

### With Description

```tsx
<RadioGroup defaultValue="standard">
  <LabeledRadio
    id="standard"
    value="standard"
    label="Standard Shipping"
    description="Delivery in 5-7 business days"
  />
  <LabeledRadio
    id="express"
    value="express"
    label="Express Shipping"
    description="Delivery in 2-3 business days"
  />
  <LabeledRadio
    id="overnight"
    value="overnight"
    label="Overnight Shipping"
    description="Next day delivery"
  />
</RadioGroup>
```

### Position Right

Place the radio button on the right side of the label:

```tsx
<RadioGroup defaultValue="option1">
  <LabeledRadio
    id="option1"
    value="option1"
    label="Option 1"
    description="Description for option 1"
    position="right"
  />
  <LabeledRadio
    id="option2"
    value="option2"
    label="Option 2"
    description="Description for option 2"
    position="right"
  />
</RadioGroup>
```

## Orientations

### Horizontal (Default)

```tsx
<RadioGroup defaultValue="horizontal">
  <LabeledRadio
    id="horizontal"
    value="horizontal"
    label="Horizontal Layout"
    description="This is the default horizontal orientation."
    orientation="horizontal"
  />
</RadioGroup>
```

### Vertical

```tsx
<RadioGroup defaultValue="vertical">
  <LabeledRadio
    id="vertical"
    value="vertical"
    label="Vertical Layout"
    description="Label and description stack below the radio."
    orientation="vertical"
  />
</RadioGroup>
```

### Responsive

Automatically switches between horizontal and vertical based on screen size:

```tsx
<RadioGroup defaultValue="responsive">
  <LabeledRadio
    id="responsive"
    value="responsive"
    label="Responsive Layout"
    description="Adapts to screen size automatically."
    orientation="responsive"
  />
</RadioGroup>
```

## RadioCard

A card-style radio button with highlighted border when selected.

### Basic Card

```tsx
<RadioGroup defaultValue="starter">
  <RadioCard
    id="card-starter"
    value="starter"
    label="Starter Plan"
    description="$9/month - Perfect for individuals"
  />
  <RadioCard
    id="card-professional"
    value="professional"
    label="Professional Plan"
    description="$29/month - Best for small teams"
  />
  <RadioCard
    id="card-enterprise"
    value="enterprise"
    label="Enterprise Plan"
    description="$99/month - For large organizations"
  />
</RadioGroup>
```

### Card Position Right

```tsx
<RadioGroup defaultValue="basic">
  <RadioCard
    id="card-right-basic"
    value="basic"
    label="Basic"
    description="Essential features only"
    position="right"
  />
  <RadioCard
    id="card-right-pro"
    value="pro"
    label="Pro"
    description="Advanced features included"
    position="right"
  />
</RadioGroup>
```

### Card Disabled

```tsx
<RadioGroup defaultValue="available">
  <RadioCard
    id="available"
    value="available"
    label="Available Option"
    description="This option is available"
  />
  <RadioCard
    id="unavailable"
    value="unavailable"
    label="Unavailable Option"
    description="This option is currently unavailable"
    disabled
  />
</RadioGroup>
```

## Horizontal Card Layout

Display cards in a horizontal row:

```tsx
<RadioGroup defaultValue="visa" className="flex flex-row gap-3">
  <RadioCard
    id="card-visa"
    value="visa"
    label="Visa"
    description="**** 4242"
  />
  <RadioCard
    id="card-mastercard"
    value="mastercard"
    label="Mastercard"
    description="**** 5555"
  />
  <RadioCard
    id="card-amex"
    value="amex"
    label="Amex"
    description="**** 0000"
  />
</RadioGroup>
```

## Real-World Examples

### Payment Method Selection

```tsx
import { CreditCard, Wallet, Building } from "lucide-react";

function PaymentMethodExample() {
  return (
    <RadioGroup defaultValue="card">
      <RadioCard
        id="payment-card"
        value="card"
        label="Credit/Debit Card"
        description="Pay securely with your card"
      />
      <RadioCard
        id="payment-wallet"
        value="wallet"
        label="Digital Wallet"
        description="PayPal, Apple Pay, Google Pay"
      />
      <RadioCard
        id="payment-bank"
        value="bank"
        label="Bank Transfer"
        description="Direct bank transfer"
      />
    </RadioGroup>
  );
}
```

### Pricing Tiers

```tsx
function PricingTierExample() {
  return (
    <RadioGroup defaultValue="monthly">
      <RadioCard
        id="pricing-monthly"
        value="monthly"
        label="Monthly"
        description="$12/month, billed monthly"
      />
      <RadioCard
        id="pricing-yearly"
        value="yearly"
        label="Yearly"
        description="$99/year, save 30%"
      />
      <RadioCard
        id="pricing-lifetime"
        value="lifetime"
        label="Lifetime"
        description="$299 one-time payment"
      />
    </RadioGroup>
  );
}
```

### Notification Preferences

```tsx
function NotificationPreferences() {
  return (
    <RadioGroup defaultValue="all">
      <LabeledRadio
        id="notify-all"
        value="all"
        label="All Notifications"
        description="Receive all email and push notifications"
      />
      <LabeledRadio
        id="notify-important"
        value="important"
        label="Important Only"
        description="Only receive critical updates"
      />
      <LabeledRadio
        id="notify-none"
        value="none"
        label="None"
        description="Disable all notifications"
      />
    </RadioGroup>
  );
}
```

## Controlled RadioGroup

Use controlled state with the radio group:

```tsx
import { useState } from "react";
import { RadioGroup, LabeledRadio } from "@wedevs/plugin-ui";

function ControlledRadioGroup() {
  const [value, setValue] = useState("option1");

  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <LabeledRadio id="ctrl-option1" value="option1" label="Option 1" />
      <LabeledRadio id="ctrl-option2" value="option2" label="Option 2" />
      <LabeledRadio id="ctrl-option3" value="option3" label="Option 3" />
    </RadioGroup>
  );
}
```

## Form Validation

Use with form validation:

```tsx
<RadioGroup aria-invalid={hasError}>
  <LabeledRadio
    id="valid-option1"
    value="option1"
    label="Option 1"
  />
  <LabeledRadio
    id="valid-option2"
    value="option2"
    label="Option 2"
  />
</RadioGroup>
```

## API Reference

### RadioGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled value |
| `defaultValue` | `string` | - | Default selected value |
| `disabled` | `boolean` | `false` | Disables all radio buttons in the group |
| `onValueChange` | `(value: string) => void` | - | Callback when value changes |
| `className` | `string` | - | Additional CSS classes |

### RadioGroupItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Value for this radio option (required) |
| `disabled` | `boolean` | `false` | Disables this radio button |
| `className` | `string` | - | Additional CSS classes |

### LabeledRadio Props

Extends all RadioGroupItem props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique identifier (required for accessibility) |
| `label` | `React.ReactNode` | - | Label text |
| `description` | `React.ReactNode` | - | Optional description text |
| `orientation` | `"horizontal" \| "vertical" \| "responsive"` | `"horizontal"` | Layout orientation |
| `position` | `"left" \| "right"` | `"left"` | Radio position relative to label |

### RadioCard Props

Same props as LabeledRadio. Displays in a card-style container with border highlight when selected.
