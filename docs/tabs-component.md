# Tabs Component

A tabs component following ShadCN design patterns for organizing content into tabbed sections.

## Installation

```bash
npm install @wedevs/plugin-ui
```

## Import

```tsx
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@wedevs/plugin-ui";
```

## Basic Usage

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <p>Overview content goes here</p>
  </TabsContent>
  <TabsContent value="details">
    <p>Details content goes here</p>
  </TabsContent>
  <TabsContent value="settings">
    <p>Settings content goes here</p>
  </TabsContent>
</Tabs>
```

## Variants

### Default Variant (Pill Style)
Tabs with background and rounded corners:

```tsx
<Tabs defaultValue="overview">
  <TabsList variant="default">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="advanced">Advanced</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="general">General content</TabsContent>
  <TabsContent value="advanced">Advanced content</TabsContent>
</Tabs>
```

### Line Variant (Underline Style)
Tabs with bottom underline indicator:

```tsx
<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="advanced">Advanced</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="general">General content</TabsContent>
  <TabsContent value="advanced">Advanced content</TabsContent>
</Tabs>
```

## Controlled Tabs

```tsx
const [activeTab, setActiveTab] = useState("overview");

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="general">General</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="general">General content</TabsContent>
</Tabs>
```

## With Badges

```tsx
<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="notifications">
      Notifications
      <Badge className="ml-1">3</Badge>
    </TabsTrigger>
    <TabsTrigger value="messages">
      Messages
      <Badge variant="destructive" className="ml-1">5</Badge>
    </TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="general">General content</TabsContent>
  <TabsContent value="notifications">Notifications content</TabsContent>
  <TabsContent value="messages">Messages content</TabsContent>
</Tabs>
```

## With Icons

```tsx
<Tabs defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">
      <User className="mr-2" />
      Profile
    </TabsTrigger>
    <TabsTrigger value="security">
      <Shield className="mr-2" />
      Security
    </TabsTrigger>
    <TabsTrigger value="billing">
      <CreditCard className="mr-2" />
      Billing
    </TabsTrigger>
  </TabsList>
  <TabsContent value="profile">Profile settings</TabsContent>
  <TabsContent value="security">Security settings</TabsContent>
  <TabsContent value="billing">Billing information</TabsContent>
</Tabs>
```

## Complete Example

```tsx
<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="verification">Verification</TabsTrigger>
    <TabsTrigger value="subscription">Subscription</TabsTrigger>
    <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
    <TabsTrigger value="badges">
      Badges
      <Badge className="ml-1">3</Badge>
    </TabsTrigger>
  </TabsList>

  <TabsContent value="overview">
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Overview Content</h3>
      <p className="text-sm text-muted-foreground">
        This is the overview tab content. It displays general information
        about the current section.
      </p>
    </div>
  </TabsContent>

  <TabsContent value="general">
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">General Settings</h3>
      <p className="text-sm text-muted-foreground">
        Configure general settings for your application here.
      </p>
    </div>
  </TabsContent>

  <TabsContent value="verification">
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Verification</h3>
      <p className="text-sm text-muted-foreground">
        Manage verification settings and requirements.
      </p>
    </div>
  </TabsContent>

  {/* Other TabsContent components */}
</Tabs>
```

## Orientation

### Horizontal (Default)
```tsx
<Tabs defaultValue="tab1" orientation="horizontal">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Vertical
```tsx
<Tabs defaultValue="tab1" orientation="vertical" className="flex gap-4">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <div className="flex-1">
    <TabsContent value="tab1">Content 1</TabsContent>
    <TabsContent value="tab2">Content 2</TabsContent>
    <TabsContent value="tab3">Content 3</TabsContent>
  </div>
</Tabs>
```

## Props Reference

### Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | `undefined` | Default active tab (uncontrolled) |
| `value` | `string` | `undefined` | Active tab value (controlled) |
| `onValueChange` | `function` | `undefined` | Callback when tab changes |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Tab orientation |
| `className` | `string` | `undefined` | Additional CSS classes |

### TabsList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "line"` | `"default"` | Visual style variant |
| `className` | `string` | `undefined` | Additional CSS classes |

### TabsTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Unique tab identifier |
| `disabled` | `boolean` | `false` | Disable the tab |
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Tab label content |

### TabsContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Tab identifier (matches trigger) |
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Content to display |

## Best Practices

1. **Tab labels**: Keep labels short and descriptive
2. **Content organization**: Group related content under appropriate tabs
3. **Default tab**: Always specify a `defaultValue` or `value`
4. **Variants**: Use `line` variant for cleaner, minimal designs; use `default` for more prominent navigation
5. **Icons**: Use icons to enhance recognition, but ensure labels are still present
6. **Badges**: Add badges to show counts or status indicators
7. **Loading states**: Show loading indicators in tab content when fetching data

## Common Patterns

### Settings Page
```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    {/* Account settings form */}
  </TabsContent>
  <TabsContent value="security">
    {/* Security settings form */}
  </TabsContent>
  <TabsContent value="notifications">
    {/* Notification preferences */}
  </TabsContent>
  <TabsContent value="billing">
    {/* Billing information */}
  </TabsContent>
</Tabs>
```

### Dashboard
```tsx
<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="reports">Reports</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    {/* Dashboard overview */}
  </TabsContent>
  <TabsContent value="analytics">
    {/* Analytics charts */}
  </TabsContent>
  <TabsContent value="reports">
    {/* Reports table */}
  </TabsContent>
</Tabs>
```

### With Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
  </CardHeader>
  <CardContent>
    <Tabs defaultValue="info">
      <TabsList>
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="info">Personal information</TabsContent>
      <TabsContent value="activity">Recent activity</TabsContent>
      <TabsContent value="settings">User settings</TabsContent>
    </Tabs>
  </CardContent>
</Card>
```

## Accessibility

- Tabs use proper ARIA roles and attributes
- Keyboard navigation supported (Arrow keys to switch between tabs)
- Focus states clearly visible
- Tab panels properly associated with their triggers
- Disabled tabs are not keyboard accessible
- Screen reader friendly with proper labeling
