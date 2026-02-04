import { cn } from '@/lib/utils';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { forwardRef, type ReactNode } from 'react';

const popupBaseClasses =
  'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md ' +
  'data-[state=open]:animate-in data-[state=closed]:animate-out ' +
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ' +
  'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 ' +
  'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 ' +
  'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';

const itemBaseClasses =
  'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none ' +
  'focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground ' +
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

export interface MenuRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function MenuRoot({
  open,
  onOpenChange,
  defaultOpen,
  children,
}: MenuRootProps) {
  return (
    <MenuPrimitive.Root
      open={open}
      onOpenChange={onOpenChange != null ? (o) => onOpenChange(o) : undefined}
      defaultOpen={defaultOpen}
    >
      {children}
    </MenuPrimitive.Root>
  );
}

MenuRoot.displayName = 'MenuRoot';

export interface MenuTriggerProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

const MenuTriggerInner = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <MenuPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.Trigger>
  )
);

MenuTriggerInner.displayName = 'MenuTrigger';

export function MenuTrigger({
  className,
  children,
  ...props
}: MenuTriggerProps) {
  return (
    <MenuTriggerInner className={className} {...props}>
      {children}
    </MenuTriggerInner>
  );
}

export interface MenuContentProps {
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  className?: string;
}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  function MenuContent(
    { children, align = 'center', side = 'bottom', sideOffset = 4, className },
    ref
  ) {
    return (
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          align={align}
          side={side}
          sideOffset={sideOffset}
          className="isolate z-50"
        >
          <MenuPrimitive.Popup
            ref={ref}
            className={cn(popupBaseClasses, className)}
          >
            {children}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    );
  }
);

MenuContent.displayName = 'MenuContent';

export interface MenuItemProps extends Omit<
  MenuPrimitive.Item.Props,
  'className'
> {
  className?: string;
  children?: ReactNode;
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  function MenuItem({ className, children, ...props }, ref) {
    return (
      <MenuPrimitive.Item
        ref={ref}
        className={cn(itemBaseClasses, className)}
        {...props}
      >
        {children}
      </MenuPrimitive.Item>
    );
  }
);

MenuItem.displayName = 'MenuItem';

export interface MenuSeparatorProps {
  className?: string;
}

export function MenuSeparator({ className }: MenuSeparatorProps) {
  return (
    <MenuPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-border', className)}
    />
  );
}

MenuSeparator.displayName = 'MenuSeparator';
