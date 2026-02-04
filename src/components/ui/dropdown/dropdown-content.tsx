import { cn } from '@/lib/utils';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { forwardRef, type ReactNode } from 'react';

const contentBaseClasses =
  'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md ' +
  'data-[state=open]:animate-in data-[state=closed]:animate-out ' +
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ' +
  'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 ' +
  'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 ' +
  'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';

export interface DropdownContentProps {
  /** Content of the dropdown panel */
  children: ReactNode;
  /** Align popup to trigger */
  align?: 'start' | 'center' | 'end';
  /** Side of trigger to show popup */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Gap between trigger and content */
  sideOffset?: number;
  /** Additional class for the popup panel */
  className?: string;
}

/**
 * Base dropdown content. Portals and positions the panel; wraps Popover.Portal + Positioner + Popup.
 */
export const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>(
  function DropdownContent(
    { children, align = 'center', side = 'bottom', sideOffset = 4, className },
    ref
  ) {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          align={align}
          side={side}
          sideOffset={sideOffset}
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup
            ref={ref}
            className={cn(contentBaseClasses, className)}
          >
            {children}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    );
  }
);

DropdownContent.displayName = 'DropdownContent';
