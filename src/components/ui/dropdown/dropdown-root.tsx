import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { type ReactNode } from 'react';

export interface DropdownRootProps {
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled default open */
  defaultOpen?: boolean;
  /** Child content */
  children: ReactNode;
}

/**
 * Base dropdown root. Wraps Base UI Popover.Root.
 * Use with DropdownTrigger and DropdownContent for a composable anchored popup.
 */
export function DropdownRoot({
  open,
  onOpenChange,
  defaultOpen,
  children,
}: DropdownRootProps) {
  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={onOpenChange != null ? (o) => onOpenChange(o) : undefined}
      defaultOpen={defaultOpen}
    >
      {children}
    </PopoverPrimitive.Root>
  );
}

DropdownRoot.displayName = 'DropdownRoot';
