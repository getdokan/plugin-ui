# Dropdown Menu Component

A dropdown menu built on `@base-ui/react/menu` with consistent styling and theme-aware behavior. Compose `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, and item components to build basic menus, action menus, checkbox lists, radio groups, sectioned menus, and submenus.

See **UI/DropdownMenu** in Storybook for live examples.

## Installation

```bash
npm install @wedevs/plugin-ui
```

## Import

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@wedevs/plugin-ui";
```

## Basic Usage

Default dropdown with a label, items, and a destructive item (from the **Default** story):

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

## Action Menu

"More" icon trigger with Edit, Duplicate, and Delete. Use for row actions in tables (from the **ActionMenu** story):

```tsx
<DropdownMenu>
  <DropdownMenuTrigger className="flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-none transition-colors p-2">
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">Open menu</span>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56">
    <DropdownMenuItem>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Copy className="mr-2 h-4 w-4" />
      Duplicate
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Checkbox List

Multiple selection with `DropdownMenuCheckboxItem` (from the **CheckboxList** story):

```tsx
function CheckboxListExample() {
  const [selectedValues, setSelectedValues] = useState<string[]>(["email"]);

  const items = [
    { value: "email", label: "Email notifications" },
    { value: "sms", label: "SMS notifications" },
    { value: "push", label: "Push notifications" },
    { value: "marketing", label: "Marketing emails" },
  ];

  const toggleValue = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Notification Settings</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.value}
            checked={selectedValues.includes(item.value)}
            onCheckedChange={() => toggleValue(item.value)}
          >
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Radio Group

Single selection with `DropdownMenuRadioGroup` and `DropdownMenuRadioItem` (from the **RadioGroup** story):

```tsx
function RadioGroupExample() {
  const [status, setStatus] = useState("active");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Select Status</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Status</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
          <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="inactive">Inactive</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="archived">Archived</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Icon List

Items with leading icons in a muted box (from the **IconList** story):

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="outline">Connect App</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Integrations</DropdownMenuLabel>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <span className="mr-2 flex h-6 w-6 items-center justify-center overflow-hidden rounded-md bg-muted">
        <Github className="h-4 w-4" />
      </span>
      GitHub
    </DropdownMenuItem>
    <DropdownMenuItem>
      <span className="mr-2 flex h-6 w-6 items-center justify-center overflow-hidden rounded-md bg-muted">
        <Mail className="h-4 w-4" />
      </span>
      Email
    </DropdownMenuItem>
    <DropdownMenuItem>
      <span className="mr-2 flex h-6 w-6 items-center justify-center overflow-hidden rounded-md bg-muted">
        <MessageSquare className="h-4 w-4" />
      </span>
      Slack
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## With Shortcuts

Icons and keyboard shortcut hints (from the **WithShortcuts** story):

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="outline">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      <span>Profile</span>
      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <CreditCard className="mr-2 h-4 w-4" />
      <span>Billing</span>
      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Settings className="mr-2 h-4 w-4" />
      <span>Settings</span>
      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Keyboard className="mr-2 h-4 w-4" />
      <span>Keyboard shortcuts</span>
      <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Sectioned Menu

Multiple groups with labels and separators (from the **SectionedMenu** story):

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="outline">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuItem>
        <User className="mr-2 h-4 w-4" />
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuLabel>Team</DropdownMenuLabel>
      <DropdownMenuItem>
        <UserPlus className="mr-2 h-4 w-4" />
        Invite users
      </DropdownMenuItem>
      <DropdownMenuItem>
        <PlusCircle className="mr-2 h-4 w-4" />
        New team
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuLabel>Support</DropdownMenuLabel>
      <DropdownMenuItem>
        <LifeBuoy className="mr-2 h-4 w-4" />
        Help center
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## With Submenu

Nested submenu using `DropdownMenuSub`, `DropdownMenuSubTrigger`, and `DropdownMenuSubContent` (from the **WithSubmenu** story):

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuItem>
      <Mail className="mr-2 h-4 w-4" />
      New message
    </DropdownMenuItem>
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <UserPlus className="mr-2 h-4 w-4" />
        Invite users
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessageSquare className="mr-2 h-4 w-4" />
          Message
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <PlusCircle className="mr-2 h-4 w-4" />
          More...
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <Settings className="mr-2 h-4 w-4" />
      Settings
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Item Variants

Menu item visual variants (from the **ItemVariants** story):

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="outline">Item Variants</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuItem variant="default">Default item</DropdownMenuItem>
    <DropdownMenuItem variant="primary">Primary item (highlighted)</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Destructive item</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Props Reference

### DropdownMenuContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alignment relative to trigger |
| `alignOffset` | `number` | `0` | Offset from alignment edge |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Side of trigger |
| `sideOffset` | `number` | `4` | Offset from trigger |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive" \| "primary"` | `"primary"` | Visual variant |
| `inset` | `boolean` | `false` | Extra left padding (e.g. with submenus) |
| `disabled` | `boolean` | `false` | Disable the item |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuCheckboxItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Called when toggled |
| `inset` | `boolean` | `false` | Extra left padding |
| `disabled` | `boolean` | `false` | Disable the item |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuRadioGroup / DropdownMenuRadioItem Props

**DropdownMenuRadioGroup:** `value`, `onValueChange`, plus standard group props.

**DropdownMenuRadioItem:** `value` (required), `inset?`, `disabled?`, `className?`, `children`.

### DropdownMenuSubContent Props

Same as `DropdownMenuContent`; defaults are `align="start"`, `alignOffset={-3}`, `side="right"`, `sideOffset={0}`.

### DropdownMenuLabel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inset` | `boolean` | `false` | Extra left padding |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuTrigger Props

Accepts `className`, `render`, `nativeButton`, and other trigger props from the base menu primitive. Use `className` for styling the trigger element.

### DropdownMenuShortcut Props

Accepts `className` and standard `span` props. Use as a child of `DropdownMenuItem` for shortcut text (e.g. `⌘K`).

## Best Practices

1. **Action menus**: Use an icon trigger (e.g. `MoreHorizontal`) with `align="end"` for row or card actions.
2. **Destructive actions**: Use `variant="destructive"` and a `DropdownMenuSeparator` before them.
3. **Accessibility**: For icon-only triggers, include `<span className="sr-only">Open menu</span>` or an `aria-label`.
4. **Checkbox/radio state**: Keep selection in React state and pass `checked` / `value` and `onCheckedChange` / `onValueChange`.
5. **Sections**: Use `DropdownMenuGroup` + `DropdownMenuLabel` and `DropdownMenuSeparator` between groups.

## Common Patterns

### Row Actions

```tsx
<DropdownMenu>
  <DropdownMenuTrigger className="...">
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">Open menu</span>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive" onClick={onDelete}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Account / Settings

Use the **SectionedMenu** example above: Account group, Team group, Support group, then a destructive "Log out" item.

### Notifications / Filters (Multi-Select)

Use the **CheckboxList** example with your list of options and local state for `selectedValues`.

## Accessibility

- Menus use ARIA roles and attributes from `@base-ui/react/menu`.
- Keyboard navigation: arrow keys, Enter to select, Escape to close.
- Focus is moved into the menu when opened and restored on close.
- Provide a visible or screen-reader label for the trigger (e.g. "Open menu" in a `sr-only` span or `aria-label`).
