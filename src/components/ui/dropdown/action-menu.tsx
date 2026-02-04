import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from './menu-primitives';

export interface ActionMenuItem {
  /** Unique key */
  id: string;
  /** Label (e.g. "Edit", "Delete") */
  label: string;
  /** Optional icon before label */
  icon?: ReactNode;
  /** Shortcut hint (e.g. "⌘P") */
  shortcut?: string;
  /** Called when item is selected */
  onSelect?: () => void;
  /** Visually disabled */
  disabled?: boolean;
  /** Show separator above this item */
  separatorBefore?: boolean;
  /** Destructive styling (e.g. Delete) */
  destructive?: boolean;
}

export interface ActionMenuProps {
  /** Actions to show in the menu */
  items: ActionMenuItem[];
  /** Trigger content; defaults to "Actions" or icon button */
  trigger?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Placement of the menu panel */
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Additional class for trigger */
  triggerClassName?: string;
  /** Additional class for content */
  contentClassName?: string;
}

/**
 * Action menu variant: list of actions (Edit, Duplicate, Delete, etc.)
 * Composes menu primitives; state is external (open/onOpenChange optional).
 */
export function ActionMenu({
  items,
  trigger,
  open,
  onOpenChange,
  align = 'end',
  side = 'bottom',
  triggerClassName,
  contentClassName,
}: ActionMenuProps) {
  return (
    <MenuRoot open={open} onOpenChange={onOpenChange}>
      <MenuTrigger
        className={cn(
          'rounded-md hover:bg-accent hover:text-accent-foreground',
          triggerClassName
        )}
        aria-label="Open action menu"
      >
        {trigger ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        )}
      </MenuTrigger>
      <MenuContent align={align} side={side} className={contentClassName}>
        {items.map((item) => (
          <span key={item.id}>
            {item.separatorBefore && <MenuSeparator />}
            <MenuItem
              disabled={item.disabled}
              onClick={item.onSelect}
              className={cn(
                item.destructive &&
                  'text-destructive focus:bg-destructive/10 focus:text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive'
              )}
            >
              {item.icon != null && (
                <span className="size-4 shrink-0" aria-hidden>
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.label}</span>
              {item.shortcut != null && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {item.shortcut}
                </span>
              )}
            </MenuItem>
          </span>
        ))}
      </MenuContent>
    </MenuRoot>
  );
}

ActionMenu.displayName = 'ActionMenu';
