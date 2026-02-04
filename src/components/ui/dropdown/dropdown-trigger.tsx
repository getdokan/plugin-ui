import { cn } from '@/lib/utils';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { forwardRef, type ReactNode } from 'react';

export interface DropdownTriggerProps {
  /** Trigger content (e.g. button, avatar) */
  children: ReactNode;
  /** Additional class for the trigger button */
  className?: string;
}

/**
 * Base dropdown trigger. Wraps Base UI Popover.Trigger.
 * Renders a button; use DropdownRoot with custom trigger via render if needed.
 */
export const DropdownTrigger = forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(function DropdownTrigger({ className, children, ...props }, ref) {
  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive.Trigger>
  );
});

DropdownTrigger.displayName = 'DropdownTrigger';
