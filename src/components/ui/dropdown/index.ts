/**
 * Dropdown system: base primitives + variants.
 * - Primitives: DropdownRoot, DropdownTrigger, DropdownContent (Popover-based); MenuRoot, MenuTrigger, MenuContent, MenuItem, MenuSeparator (Menu-based).
 * - Variants: ActionMenu, SearchableDropdown, AvatarWorkspaceSelector, MultiSelectDropdown.
 */

export { DropdownRoot } from './dropdown-root';
export type { DropdownRootProps } from './dropdown-root';

export { DropdownTrigger } from './dropdown-trigger';
export type { DropdownTriggerProps } from './dropdown-trigger';

export { DropdownContent } from './dropdown-content';
export type { DropdownContentProps } from './dropdown-content';

export {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from './menu-primitives';
export type {
  MenuContentProps,
  MenuItemProps,
  MenuRootProps,
  MenuSeparatorProps,
  MenuTriggerProps,
} from './menu-primitives';

export { ActionMenu } from './action-menu';
export type { ActionMenuItem, ActionMenuProps } from './action-menu';

export { SearchableDropdown } from './searchable-dropdown';
export type {
  SearchableDropdownOption,
  SearchableDropdownProps,
} from './searchable-dropdown';

export { AvatarWorkspaceSelector } from './avatar-workspace-selector';
export type {
  AvatarWorkspaceOption,
  AvatarWorkspaceSelectorProps,
} from './avatar-workspace-selector';

export { MultiSelectDropdown } from './multi-select-dropdown';
export type {
  MultiSelectDropdownProps,
  MultiSelectOption,
} from './multi-select-dropdown';
