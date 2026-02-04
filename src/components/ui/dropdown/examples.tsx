/**
 * Example usage for dropdown variants.
 * Use these snippets in docs or design-system demos.
 */

import { Archive, Copy, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  ActionMenu,
  AvatarWorkspaceSelector,
  MultiSelectDropdown,
  SearchableDropdown,
} from './index';

/* ========== 1. Action Menu (Edit / Duplicate / Delete) ========== */

const actionMenuItems = [
  {
    id: 'edit',
    label: 'Edit',
    icon: <Pencil className="size-4" />,
    onSelect: () => console.log('Edit'),
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: <Copy className="size-4" />,
    onSelect: () => console.log('Duplicate'),
  },
  {
    id: 'sep1',
    label: 'Archive',
    icon: <Archive className="size-4" />,
    separatorBefore: true,
    onSelect: () => console.log('Archive'),
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="size-4" />,
    destructive: true,
    onSelect: () => console.log('Delete'),
  },
];

export function ActionMenuExample() {
  return <ActionMenu items={actionMenuItems} align="end" side="bottom" />;
}

/* ========== 2. Searchable Dropdown (Command-style) ========== */

const searchableOptions = [
  { value: 'dromendars', label: 'Dromendars', group: 'Projects' },
  { value: 'glaempipe', label: 'Glaempipe', group: 'Projects' },
  { value: 'quillows', label: 'Quillows', group: 'Items' },
  { value: 'wispwillow', label: 'Wispwillow Bark', group: 'Items' },
];

export function SearchableDropdownExample() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <SearchableDropdown
      options={searchableOptions}
      value={value}
      onValueChange={setValue}
      searchPlaceholder="Find an item"
      triggerPlaceholder="Select item..."
    />
  );
}

/* ========== 3. Avatar / Workspace Selector ========== */

const avatarOptions = [
  {
    id: 'settings',
    label: 'Settings',
    shortcut: '⌘P',
    onSelect: () => console.log('Settings'),
  },
  { id: 'profile', label: 'Profile', onSelect: () => console.log('Profile') },
  { id: 'billing', label: 'Billing', onSelect: () => console.log('Billing') },
  {
    id: 'logout',
    label: 'Log out',
    separatorBefore: true,
    onSelect: () => console.log('Log out'),
  },
];

export function AvatarWorkspaceSelectorExample() {
  return (
    <AvatarWorkspaceSelector
      options={avatarOptions}
      trigger={
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
          alt=""
          className="size-8 rounded-full border border-border"
        />
      }
      align="end"
      side="bottom"
    />
  );
}

/* ========== 4. Multi-select Dropdown with Tags ========== */

const multiSelectOptions = [
  { value: 'quillows', label: 'Quillows' },
  { value: 'glaempipe', label: 'Glaempipe' },
  { value: 'dromendars', label: 'Dromendars' },
  { value: 'item01', label: 'Item 01' },
  { value: 'item02', label: 'Item 02' },
];

export function MultiSelectDropdownExample() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MultiSelectDropdown
      options={multiSelectOptions}
      value={value}
      onValueChange={setValue}
      placeholder="Select items..."
      searchPlaceholder="Find an item"
    />
  );
}
