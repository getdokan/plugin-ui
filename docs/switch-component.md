# Switch Component

A flexible toggle switch component following ShadCN design patterns with support for labeled variants, card-style layouts, multiple sizes, and various orientations.

## Installation

```bash
npm install @wedevs/plugin-ui
```

## Import

```tsx
import { Switch, LabeledSwitch, SwitchCard } from "@wedevs/plugin-ui";
```

## Basic Switch

### Default

```tsx
<Switch />
```

### Checked

```tsx
<Switch defaultChecked />
```

### Disabled

```tsx
<Switch disabled />
<Switch disabled defaultChecked />
```

## Sizes

### Default Size

```tsx
<Switch size="default" />
```

### Small Size

```tsx
<Switch size="sm" />
```

### Size Comparison

```tsx
<div className="flex items-center gap-4">
  <Switch size="sm" />
  <Switch size="default" />
</div>
```

## Labeled Switch

A switch with an associated label and optional description.

### Basic Labeled

```tsx
<LabeledSwitch 
  id="dark-mode"
  label="Dark Mode" 
/>
```

### With Description

```tsx
<LabeledSwitch 
  id="notifications"
  label="Enable Notifications"
  description="Receive push notifications for important updates."
/>
```

### Position Right

Place the switch on the right side of the label:

```tsx
<LabeledSwitch
  id="marketing"
  label="Marketing Emails"
  description="Receive promotional content and special offers."
  position="right"
/>
```

### Small Size with Label

```tsx
<LabeledSwitch
  id="compact-mode"
  label="Compact Mode"
  description="Use smaller UI elements."
  size="sm"
/>
```

## Orientations

### Horizontal (Default)

```tsx
<LabeledSwitch
  id="horizontal"
  label="Horizontal Layout"
  description="This is the default horizontal orientation."
  orientation="horizontal"
/>
```

### Vertical

```tsx
<LabeledSwitch
  id="vertical"
  label="Vertical Layout"
  description="Label and description stack below the switch."
  orientation="vertical"
/>
```

### Responsive

Automatically switches between horizontal and vertical based on screen size:

```tsx
<LabeledSwitch
  id="responsive"
  label="Responsive Layout"
  description="Adapts to screen size automatically."
  orientation="responsive"
/>
```

## SwitchCard

A card-style switch with highlighted border when enabled.

### Basic Card

```tsx
<SwitchCard
  id="card-feature"
  label="Feature Toggle"
  description="Enable this experimental feature"
/>
```

### Card Position Right

```tsx
<SwitchCard
  id="card-right"
  label="Auto-save"
  description="Automatically save your work"
  position="right"
/>
```

### Card Disabled

```tsx
<SwitchCard
  id="card-disabled"
  label="Premium Feature"
  description="Upgrade to access this feature"
  disabled
/>
```

## Switch Group

Group multiple switches together:

```tsx
<div className="flex flex-col gap-3">
  <LabeledSwitch 
    id="setting-email"
    label="Email Notifications"
    description="Receive email updates"
  />
  <LabeledSwitch 
    id="setting-sms"
    label="SMS Notifications"
    description="Receive text message alerts"
  />
  <LabeledSwitch 
    id="setting-push"
    label="Push Notifications"
    description="Receive browser notifications"
  />
</div>
```

## Card Group

Group multiple switch cards:

```tsx
<div className="flex flex-col gap-3">
  <SwitchCard
    id="card-analytics"
    label="Analytics"
    description="Track user behavior and site performance"
  />
  <SwitchCard
    id="card-logging"
    label="Error Logging"
    description="Automatically log and report errors"
  />
  <SwitchCard
    id="card-updates"
    label="Auto Updates"
    description="Keep your software up to date automatically"
  />
</div>
```

## Real-World Examples

### Settings Panel

```tsx
function SettingsPanelExample() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">General Settings</h3>
      <div className="flex flex-col gap-3">
        <LabeledSwitch
          id="settings-dark-mode"
          label="Dark Mode"
          description="Use dark theme across the application"
          position="right"
          defaultChecked
        />
        <LabeledSwitch
          id="settings-sounds"
          label="Sound Effects"
          description="Play sounds for notifications and actions"
          position="right"
        />
        <LabeledSwitch
          id="settings-animations"
          label="Animations"
          description="Enable UI animations and transitions"
          position="right"
          defaultChecked
        />
      </div>
    </div>
  );
}
```

### Privacy Settings

```tsx
function PrivacySettingsExample() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Privacy</h3>
      <div className="flex flex-col gap-3">
        <SwitchCard
          id="privacy-analytics"
          label="Usage Analytics"
          description="Help us improve by sharing anonymous usage data"
        />
        <SwitchCard
          id="privacy-personalization"
          label="Personalization"
          description="Allow personalized recommendations based on your activity"
        />
        <SwitchCard
          id="privacy-third-party"
          label="Third-party Sharing"
          description="Share data with trusted partners for better services"
        />
      </div>
    </div>
  );
}
```

### Feature Toggles

```tsx
function FeatureToggleExample() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Experimental Features</h3>
      <div className="flex flex-col gap-3">
        <SwitchCard
          id="feature-beta"
          label="Beta Features"
          description="Try new features before they're released"
          defaultChecked
        />
        <SwitchCard
          id="feature-dev-mode"
          label="Developer Mode"
          description="Access advanced debugging tools"
        />
        <SwitchCard
          id="feature-preview"
          label="Preview Updates"
          description="Get early access to upcoming changes"
          disabled
        />
      </div>
    </div>
  );
}
```

## Controlled Switch

Use controlled state with the switch:

```tsx
import { useState } from "react";
import { Switch } from "@wedevs/plugin-ui";

function ControlledSwitch() {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}
```

## Form Validation

Use with form validation:

```tsx
<LabeledSwitch
  id="agree-terms"
  label="I agree to the terms of service"
  description="You must accept to continue"
  aria-invalid={hasError}
/>
```

## API Reference

### Switch Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Default checked state |
| `size` | `"sm" \| "default"` | `"default"` | Size of the switch |
| `disabled` | `boolean` | `false` | Disables the switch |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback when checked state changes |
| `className` | `string` | - | Additional CSS classes |

### LabeledSwitch Props

Extends all Switch props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique identifier (required for accessibility) |
| `label` | `React.ReactNode` | - | Label text |
| `description` | `React.ReactNode` | - | Optional description text |
| `orientation` | `"horizontal" \| "vertical" \| "responsive"` | `"horizontal"` | Layout orientation |
| `position` | `"left" \| "right"` | `"left"` | Switch position relative to label |

### SwitchCard Props

Same props as LabeledSwitch. Displays in a card-style container with border highlight when enabled.
