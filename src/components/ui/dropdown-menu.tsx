import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import * as React from 'react';

import { MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
    return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
    return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
    return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" className={cn('w-max', className)} {...props} />;
}

function DropdownMenuContent({
    align = 'start',
    alignOffset = 0,
    side = 'bottom',
    sideOffset = 4,
    className,
    ...props
}: MenuPrimitive.Popup.Props & Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) {
    return (
        <MenuPrimitive.Portal>
            <MenuPrimitive.Positioner
                className="isolate z-9999 outline-none pui-root"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}>
                <MenuPrimitive.Popup
                    data-slot="dropdown-menu-content"
                    className={cn(
                        'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-white dark:bg-popover text-popover-foreground min-w-[240px] rounded-[3px] p-[10px] shadow-[0px_6px_20px_0px_#00000014] dark:shadow-none border border-border duration-100 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 z-9999 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none data-closed:overflow-hidden',
                        className
                    )}
                    {...props}
                />
            </MenuPrimitive.Positioner>
        </MenuPrimitive.Portal>
    );
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
    return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
    className,
    inset,
    ...props
}: MenuPrimitive.GroupLabel.Props & {
    inset?: boolean;
}) {
    return (
        <MenuPrimitive.GroupLabel
            data-slot="dropdown-menu-label"
            data-inset={inset}
            className={cn('text-muted-foreground px-2 py-1.5 text-xs font-medium data-inset:pl-8', className)}
            {...props}
        />
    );
}

function DropdownMenuItem({
    className,
    inset,
    variant = 'primary',
    ...props
}: MenuPrimitive.Item.Props & {
    inset?: boolean;
    variant?: 'default' | 'destructive' | 'primary';
}) {
    return (
        <MenuPrimitive.Item
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={variant}
            className={cn(
                "hover:bg-accent focus:bg-accent hover:text-accent-foreground focus:text-accent-foreground data-[variant=primary]:hover:bg-primary data-[variant=primary]:hover:text-primary-foreground data-[variant=primary]:focus:bg-primary data-[variant=primary]:focus:text-primary-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10 data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive gap-2 rounded-sm px-4 py-2 text-sm data-inset:pl-8 [&_svg:not([class*='size-'])]:size-4 group/dropdown-menu-item relative flex cursor-pointer items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className
            )}
            {...props}
        />
    );
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
    return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
    inset?: boolean;
}) {
    return (
        <MenuPrimitive.SubmenuTrigger
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            className={cn(
                "focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 rounded-sm px-4 py-2 text-sm data-inset:pl-8 [&_svg:not([class*='size-'])]:size-4 data-popup-open:bg-accent data-popup-open:text-accent-foreground flex cursor-pointer items-center outline-hidden select-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className
            )}
            {...props}>
            {children}
            <ChevronRightIcon className="ml-auto" />
        </MenuPrimitive.SubmenuTrigger>
    );
}

function DropdownMenuSubContent({
    align = 'start',
    alignOffset = -3,
    side = 'right',
    sideOffset = 0,
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
    return (
        <DropdownMenuContent
            data-slot="dropdown-menu-sub-content"
            className={cn(
                'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-white dark:bg-popover text-popover-foreground min-w-24 rounded-md p-1 shadow-lg ring-1 duration-100 w-auto',
                className
            )}
            align={align}
            alignOffset={alignOffset}
            side={side}
            sideOffset={sideOffset}
            {...props}
        />
    );
}

function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    inset,
    ...props
}: MenuPrimitive.CheckboxItem.Props & {
    inset?: boolean;
}) {
    return (
        <MenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            data-inset={inset}
            className={cn(
                "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground gap-2 rounded-sm py-2 pr-8 pl-4 text-sm data-inset:pl-8 [&_svg:not([class*='size-'])]:size-4 relative flex cursor-pointer items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className
            )}
            checked={checked}
            {...props}>
            <span
                className="absolute right-2 flex items-center justify-center pointer-events-none"
                data-slot="dropdown-menu-checkbox-item-indicator">
                <MenuPrimitive.CheckboxItemIndicator>
                    <CheckIcon />
                </MenuPrimitive.CheckboxItemIndicator>
            </span>
            {children}
        </MenuPrimitive.CheckboxItem>
    );
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
    return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
    className,
    children,
    inset,
    ...props
}: MenuPrimitive.RadioItem.Props & {
    inset?: boolean;
}) {
    return (
        <MenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            data-inset={inset}
            className={cn(
                "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground gap-2 rounded-sm py-2 pr-8 pl-4 text-sm data-inset:pl-8 [&_svg:not([class*='size-'])]:size-4 relative flex cursor-pointer items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className
            )}
            {...props}>
            <span
                className="absolute right-2 flex items-center justify-center pointer-events-none"
                data-slot="dropdown-menu-radio-item-indicator">
                <MenuPrimitive.RadioItemIndicator>
                    <CheckIcon />
                </MenuPrimitive.RadioItemIndicator>
            </span>
            {children}
        </MenuPrimitive.RadioItem>
    );
}

function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
    return (
        <MenuPrimitive.Separator
            data-slot="dropdown-menu-separator"
            className={cn('bg-border -mx-1 my-1 h-px', className)}
            {...props}
        />
    );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="dropdown-menu-shortcut"
            className={cn(
                'text-muted-foreground group-hover/dropdown-menu-item:text-inherit group-focus/dropdown-menu-item:text-inherit ml-auto text-xs tracking-widest',
                className
            )}
            {...props}
        />
    );
}

export type ActionMenuDropdownItem = {
    value: string;
    label: string;
    icon?: React.ReactNode;
    onSelect?: () => void;
    destructive?: boolean;
    separatorBefore?: boolean;
};

export type ActionMenuDropdownProps = {
    items: ActionMenuDropdownItem[];
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    trigger?: React.ReactNode;
};

function ActionMenuDropdown({ items, align = 'end', side = 'bottom', trigger }: ActionMenuDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={
                    trigger
                        ? 'outline-none'
                        : 'flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground outline-none transition-colors'
                }>
                {trigger ? (
                    trigger
                ) : (
                    <>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} side={side} className="w-56 p-1">
                {items?.map((item) => (
                    <React.Fragment key={item.value}>
                        {item.separatorBefore && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                            onClick={item.onSelect}
                            variant={item.destructive ? 'destructive' : 'default'}>
                            {/* Enhanced icon handling to keep size consistent */}
                            {item.icon && (
                                <span className="mr-2 flex h-4 w-4 items-center justify-center [&>svg]:size-4">
                                    {item.icon}
                                </span>
                            )}
                            {item.label}
                        </DropdownMenuItem>
                    </React.Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export type SimpleDropdownItem = {
    value: string;
    label: string;
};

export type IconDropdownItem = SimpleDropdownItem & {
    icon?: React.ReactNode;
};

export type CheckboxListDropdownProps = {
    items: SimpleDropdownItem[];
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    trigger?: React.ReactNode;
    selectedValues?: string[];
    selectedValue?: string[];
    onChange?: (values: string[]) => void;
};

function CheckboxListDropdown({
    items,
    align = 'start',
    side = 'bottom',
    trigger,
    selectedValues,
    selectedValue,
    onChange
}: CheckboxListDropdownProps) {
    const [internalSelectedValues, setInternalSelectedValues] = React.useState<string[]>(() => selectedValue ?? []);

    const isControlled = selectedValues !== undefined;
    const currentValues = isControlled ? selectedValues : internalSelectedValues;

    const setValues = (values: string[]) => {
        if (!isControlled) {
            setInternalSelectedValues(values);
        }
        onChange?.(values);
    };

    const toggleValue = (value: string) => {
        setValues(currentValues.includes(value) ? currentValues.filter((v) => v !== value) : [...currentValues, value]);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={
                    trigger
                        ? 'outline-none'
                        : 'flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground outline-none transition-colors'
                }>
                {trigger ? (
                    trigger
                ) : (
                    <>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} side={side} className="min-w-[240px] p-1">
                {items?.map((item) => (
                    <DropdownMenuItem
                        key={item.value}
                        onClick={() => toggleValue(item.value)}
                        className="gap-2"
                        role="menuitemcheckbox"
                        aria-checked={currentValues.includes(item.value)}>
                        <span className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-border bg-background">
                            {currentValues.includes(item.value) && <CheckIcon className="h-3 w-3" />}
                        </span>
                        <span>{item.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export type IconListDropdownProps = {
    items: IconDropdownItem[];
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    trigger?: React.ReactNode;
};

function IconListDropdown({ items, align = 'start', side = 'bottom', trigger }: IconListDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={
                    trigger
                        ? 'outline-none'
                        : 'flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground outline-none transition-colors'
                }>
                {trigger ? (
                    trigger
                ) : (
                    <>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} side={side} className="min-w-[260px] p-1">
                {items?.map((item) => (
                    <DropdownMenuItem key={item.value}>
                        {item.icon && (
                            <span className="mr-2 flex h-6 w-6 items-center justify-center overflow-hidden rounded-md bg-muted [&>svg]:size-4">
                                {item.icon}
                            </span>
                        )}
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ========= Simple menu variants (icon + shortcut) =========

export type MenuDropdownItem = {
    value: string;
    label: string;
    icon?: React.ReactNode;
    shortcut?: React.ReactNode;
    onSelect?: () => void;
};

export type SimpleMenuDropdownProps = {
    items: MenuDropdownItem[];
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    trigger?: React.ReactNode;
};

function SimpleMenuDropdown({ items, align = 'start', side = 'bottom', trigger }: SimpleMenuDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={
                    trigger
                        ? 'outline-none'
                        : 'flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground outline-none transition-colors'
                }>
                {trigger ? (
                    trigger
                ) : (
                    <>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} side={side} className="min-w-[260px] p-1">
                {items?.map((item) => (
                    <DropdownMenuItem key={item.value} className="gap-3">
                        {item.icon && (
                            <span className="mr-1 flex h-4 w-4 items-center justify-center [&>svg]:size-4">
                                {item.icon}
                            </span>
                        )}
                        <span className="flex-1 text-sm">{item.label}</span>
                        {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export type SectionedMenuSection = {
    id?: string;
    items: MenuDropdownItem[];
};

export type SectionedMenuDropdownProps = {
    sections: SectionedMenuSection[];
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    trigger?: React.ReactNode;
};

function SectionedMenuDropdown({ sections, align = 'start', side = 'bottom', trigger }: SectionedMenuDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={
                    trigger
                        ? 'outline-none'
                        : 'flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground outline-none transition-colors'
                }>
                {trigger ? (
                    trigger
                ) : (
                    <>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} side={side} className="min-w-[260px] p-1">
                {sections.map((section, sectionIndex) => (
                    <React.Fragment key={section.id ?? sectionIndex}>
                        {sectionIndex > 0 && <DropdownMenuSeparator className="my-1" />}
                        {section.items.map((item) => (
                            <DropdownMenuItem key={item.value} className="gap-3">
                                {item.icon && (
                                    <span className="mr-1 flex h-4 w-4 items-center justify-center [&>svg]:size-4">
                                        {item.icon}
                                    </span>
                                )}
                                <span className="flex-1 text-sm">{item.label}</span>
                                {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
                            </DropdownMenuItem>
                        ))}
                    </React.Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Base + high-level components
export {
    ActionMenuDropdown,
    CheckboxListDropdown,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    IconListDropdown,
    SectionedMenuDropdown,
    SimpleMenuDropdown
};
