# Dropdown menu components

This library wraps `@base-ui/react/menu` into opinionated dropdown components with consistent styling and theme‑aware behavior.

All components are exported from `@wedevs/plugin-ui` and live under `src/components/ui/dropdown-menu.tsx`.

```tsx
import {
  ActionMenuDropdown,
  CheckboxListDropdown,
  IconListDropdown,
  SimpleMenuDropdown,
  SectionedMenuDropdown,
  TagMultiSelectDropdown,
} from '@wedevs/plugin-ui';
```

---

## `ActionMenuDropdown`

High‑level “more actions” menu, typically triggered by an icon button.

**Props**

- `items: ActionMenuDropdownItem[]`
  - `value: string`
  - `label: string`
  - `icon?: React.ReactNode`
  - `onSelect?: () => void`
  - `destructive?: boolean` – uses destructive colors
  - `separatorBefore?: boolean` – renders a separator above this item
- `align?: 'start' | 'center' | 'end'` – popup alignment (default `end`)
- `side?: 'top' | 'right' | 'bottom' | 'left'` – popup side (default `bottom`)
- `trigger?: React.ReactNode` – custom trigger; if omitted, a 3‑dots icon is used

**Usage**

```tsx
const items = [
  { value: 'edit', label: 'Edit', icon: <Pencil /> },
  { value: 'duplicate', label: 'Duplicate', icon: <Copy /> },
  { value: 'archive', label: 'Archive', icon: <Archive />, separatorBefore: true },
  { value: 'delete', label: 'Delete', icon: <Trash2 />, destructive: true },
];

<ActionMenuDropdown items={items} align="end" side="bottom" />;
```

---

### `CheckboxListDropdown`

Simple multi‑select list with checkbox visuals inside a dropdown.

**Props (subset)** – see `CheckboxListDropdownProps`

- `items: SimpleDropdownItem[]` – `{ value: string; label: string }`
- `selectedValues?: string[]` – controlled selection
- `selectedValue?: string[]` – initial selection (uncontrolled)
- `onChange?: (values: string[]) => void` – fired whenever selection changes
- `align?`, `side?`, `trigger?` – same as `ActionMenuDropdown`

**Usage**

```tsx
const items = Array.from({ length: 8 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Item ${i + 1}`,
}));

<CheckboxListDropdown
  items={items}
  selectedValue={['option-2', 'option-4']}
  onChange={(values) => console.log(values)}
  trigger={<Button variant="outline">Checkbox list</Button>}
/>;
```

---

### `IconListDropdown`

Dropdown list where each item can show a leading icon or avatar.

**Props**

- `items: IconDropdownItem[]` – `{ value; label; icon? }`
- `align?`, `side?`, `trigger?`

**Usage**

```tsx
const items = [
  { value: 'item-1', label: 'Item 01', icon: <Shirt /> },
  { value: 'item-2', label: 'Item 02', icon: <Image /> },
];

<IconListDropdown
  items={items}
  align="start"
  side="bottom"
  trigger={<Button variant="outline">Icon list</Button>}
/>;
```

---

### `SimpleMenuDropdown`

Single‑section menu with optional leading icons and trailing shortcuts (e.g. profile/billing/settings sheet).

**Props**

- `items: MenuDropdownItem[]`
  - `value`, `label`
  - `icon?: React.ReactNode`
  - `shortcut?: React.ReactNode` – text or JSX (e.g. `⌘P`)
  - `onSelect?: () => void`
- `align?`, `side?`, `trigger?`

**Usage**

```tsx
const items = [
  { value: 'profile', label: 'Profile', icon: <Pencil />, shortcut: '⌘P' },
  { value: 'billing', label: 'Billing', icon: <Archive />, shortcut: '⌘P' },
];

<SimpleMenuDropdown
  items={items}
  trigger={<Button variant="outline">Simple menu</Button>}
/>;
```

---

### `SectionedMenuDropdown`

Same visual style as `SimpleMenuDropdown`, but items are grouped into sections separated by dividers.

**Props**

- `sections: SectionedMenuSection[]`
  - `id?: string`
  - `items: MenuDropdownItem[]`
- `align?`, `side?`, `trigger?`

**Usage**

```tsx
const sections = [
  {
    id: 'top',
    items: [
      { value: 'profile', label: 'Profile', icon: <Pencil />, shortcut: '⌘P' },
      { value: 'billing', label: 'Billing', icon: <Archive />, shortcut: '⌘P' },
    ],
  },
  {
    id: 'bottom',
    items: [{ value: 'logout', label: 'Log out', icon: <LogOut />, shortcut: '⌘P' }],
  },
];

<SectionedMenuDropdown
  sections={sections}
  trigger={<Button variant="outline">Sectioned menu</Button>}
/>;
```

---

### `TagMultiSelectDropdown`

Tag‑based multi‑select dropdown, optionally with an inline search input inside the menu.

**Props**

- `items: SimpleDropdownItem[]`
- `selectedValues?: string[]` – controlled selection
- `selectedValue?: string[]` – initial selection (uncontrolled)
- `onChange?: (values: string[]) => void`
- `placeholder?: string` – text for trigger and search input (default `"Find an item"`)
- `showSearch?: boolean` – show filter input inside the menu (default `true`)
- `maxTagCount?: number` – limit number of visible tags before collapsing to `+N`
- `align?`, `side?`

**Behavior**

- Trigger shows selected items as pills; extra items are collapsed into a `+N` pill.
- Menu shows an optional search field and a scrollable list of items.
- Typing in the search input **filters** the list (no match highlighting, only the filtered items remain).

**Floating tags (no search in menu)**

```tsx
<TagMultiSelectDropdown
  items={items}
  selectedValue={['glaempipe', 'item-01']}
  showSearch={false}
/>;
```

**Attached search in menu**

```tsx
<TagMultiSelectDropdown
  items={items}
  selectedValue={['glaempipe', 'item-01']}
  showSearch
/>;
```
