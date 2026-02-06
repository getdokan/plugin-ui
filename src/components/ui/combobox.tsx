import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';

const Combobox = ComboboxPrimitive.Root;

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
    return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxTrigger({ className, children, ...props }: ComboboxPrimitive.Trigger.Props) {
    return (
        <ComboboxPrimitive.Trigger
            data-slot="combobox-trigger"
            className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
            {...props}>
            {children}
            <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />
        </ComboboxPrimitive.Trigger>
    );
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
    return (
        <ComboboxPrimitive.Clear
            data-slot="combobox-clear"
            render={<InputGroupButton variant="ghost" size="icon-xs" />}
            className={cn(className)}
            {...props}>
            <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.Clear>
    );
}

function ComboboxInput({
    className,
    children,
    disabled = false,
    showTrigger = true,
    showClear = false,
    ...props
}: ComboboxPrimitive.Input.Props & {
    showTrigger?: boolean;
    showClear?: boolean;
}) {
    return (
        <InputGroup className={cn('w-auto', className)}>
            <ComboboxPrimitive.Input render={<InputGroupInput disabled={disabled} />} {...props} />
            <InputGroupAddon align="inline-end">
                {showTrigger && (
                    <InputGroupButton
                        size="icon-xs"
                        variant="ghost"
                        render={<ComboboxTrigger />}
                        data-slot="input-group-button"
                        className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
                        disabled={disabled}
                    />
                )}
                {showClear && <ComboboxClear disabled={disabled} />}
            </InputGroupAddon>
            {children}
        </InputGroup>
    );
}

function ComboboxContent({
    className,
    side = 'bottom',
    sideOffset = 6,
    align = 'start',
    alignOffset = 0,
    anchor,
    ...props
}: ComboboxPrimitive.Popup.Props &
    Pick<ComboboxPrimitive.Positioner.Props, 'side' | 'align' | 'sideOffset' | 'alignOffset' | 'anchor'>) {
    const { mode, cssVariables } = useTheme();
    return (
        <ComboboxPrimitive.Portal>
            <ComboboxPrimitive.Positioner
                side={side}
                sideOffset={sideOffset}
                align={align}
                alignOffset={alignOffset}
                anchor={anchor}
                className={cn('isolate z-9999 pui-root', mode)}
                style={cssVariables}>
                <ComboboxPrimitive.Popup
                    data-slot="combobox-content"
                    data-chips={!!anchor}
                    className={cn(
                        'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:border-input/30 overflow-hidden rounded-md shadow-md ring-1 duration-100 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:shadow-none data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) data-[chips=true]:min-w-(--anchor-width)',
                        className
                    )}
                    {...props}
                />
            </ComboboxPrimitive.Positioner>
        </ComboboxPrimitive.Portal>
    );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
    return (
        <ComboboxPrimitive.List
            data-slot="combobox-list"
            className={cn(
                'no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 p-1 data-empty:p-0 overflow-y-auto overscroll-contain',
                className
            )}
            {...props}
        />
    );
}

/** Matches DropdownMenuItem styling for consistent menu appearance. */
const comboboxItemStyles = cn(
    'hover:bg-accent hover:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground ',
    'data-[variant=primary]:hover:bg-primary data-[variant=primary]:hover:text-primary-foreground data-[variant=primary]:data-highlighted:bg-primary data-[variant=primary]:data-highlighted:text-primary-foreground ',
    'data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary data-selected:hover:text-primary-foreground data-selected:data-highlighted:bg-primary data-selected:data-highlighted:text-primary-foreground ',
    "gap-2 rounded-none px-4 py-2 text-sm [&_svg:not([class*='size-'])]:size-4 ",
    'group/combobox-item relative flex w-full cursor-pointer items-center outline-hidden select-none ',
    'data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0'
);

function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
    return (
        <ComboboxPrimitive.Item data-slot="combobox-item" className={cn(comboboxItemStyles, className)} {...props}>
            {children}
            <ComboboxPrimitive.ItemIndicator
                render={
                    <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
                }>
                <CheckIcon className="pointer-events-none" />
            </ComboboxPrimitive.ItemIndicator>
        </ComboboxPrimitive.Item>
    );
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
    return <ComboboxPrimitive.Group data-slot="combobox-group" className={cn(className)} {...props} />;
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
    return (
        <ComboboxPrimitive.GroupLabel
            data-slot="combobox-label"
            className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
            {...props}
        />
    );
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
    return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />;
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
    return (
        <ComboboxPrimitive.Empty
            data-slot="combobox-empty"
            className={cn(
                'text-muted-foreground hidden w-full justify-center py-2 text-center text-sm group-data-empty/combobox-content:flex',
                className
            )}
            {...props}
        />
    );
}

function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props) {
    return (
        <ComboboxPrimitive.Separator
            data-slot="combobox-separator"
            className={cn('bg-border -mx-1 my-1 h-px', className)}
            {...props}
        />
    );
}

function ComboboxChips({
    className,
    ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & ComboboxPrimitive.Chips.Props) {
    return (
        <ComboboxPrimitive.Chips
            data-slot="combobox-chips"
            className={cn(
                'dark:bg-input/30 border-input focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive dark:has-aria-invalid:border-destructive/50 flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:ring-3 has-aria-invalid:ring-3 has-data-[slot=combobox-chip]:px-1.5',
                className
            )}
            {...props}
        />
    );
}

function ComboboxChip({
    className,
    children,
    showRemove = true,
    ...props
}: ComboboxPrimitive.Chip.Props & {
    showRemove?: boolean;
}) {
    return (
        <ComboboxPrimitive.Chip
            data-slot="combobox-chip"
            className={cn(
                'bg-secondary text-secondary-foreground flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap has-data-[slot=combobox-chip-remove]:pr-0 has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
                className
            )}
            {...props}>
            {children}
            {showRemove && (
                <ComboboxPrimitive.ChipRemove
                    render={<Button variant="ghost" size="icon-xs" />}
                    className="-ml-1 opacity-50 hover:opacity-100"
                    data-slot="combobox-chip-remove">
                    <XIcon className="pointer-events-none" />
                </ComboboxPrimitive.ChipRemove>
            )}
        </ComboboxPrimitive.Chip>
    );
}

function ComboboxChipsInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
    return (
        <ComboboxPrimitive.Input
            data-slot="combobox-chip-input"
            className={cn('min-w-16 flex-1 outline-none', className)}
            {...props}
        />
    );
}

function useComboboxAnchor() {
    return React.useRef<HTMLDivElement | null>(null);
}

// ========= Tag multi-select (combobox-based, same API as TagMultiSelectDropdown) =========

export type TagMultiSelectComboboxItem = { value: string; label: string };

export type TagMultiSelectComboboxProps = {
    items: TagMultiSelectComboboxItem[];
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    selectedValues?: string[];
    selectedValue?: string[];
    onChange?: (values: string[]) => void;
    placeholder?: string;
    searchable?: boolean;
    maxTagCount?: number;
};

function TagMultiSelectCombobox({
    items,
    align = 'start',
    side = 'bottom',
    selectedValues,
    selectedValue,
    onChange,
    placeholder = 'Find an item',
    searchable = true,
    maxTagCount
}: TagMultiSelectComboboxProps) {
    const { mode, cssVariables } = useTheme();
    const [internalValue, setInternalValue] = React.useState<TagMultiSelectComboboxItem[]>(() =>
        items.filter((i) => (selectedValue ?? []).includes(i.value))
    );
    const isControlled = selectedValues !== undefined;
    const selectedItems = isControlled ? items.filter((i) => selectedValues.includes(i.value)) : internalValue;

    const setSelected = (next: TagMultiSelectComboboxItem[]) => {
        if (!isControlled) setInternalValue(next);
        onChange?.(next.map((i) => i.value));
    };

    const handleValueChange = (value: TagMultiSelectComboboxItem[] | TagMultiSelectComboboxItem | null) => {
        const next = Array.isArray(value) ? value : value ? [value] : [];
        setSelected(next);
    };

    const visibleTagCount = maxTagCount ?? selectedItems.length;
    const visibleTags = selectedItems.slice(0, visibleTagCount);
    const remainingCount = Math.max(selectedItems.length - visibleTagCount, 0);

    return (
        <ComboboxPrimitive.Root
            items={items}
            multiple
            value={selectedItems}
            onValueChange={handleValueChange}
            itemToStringLabel={(item) => item.label}
            itemToStringValue={(item) => item.value}>
            <ComboboxPrimitive.Trigger
                render={<div />}
                nativeButton={false}
                className={cn(
                    'inline-flex min-w-[260px] max-w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-popup-open:bg-muted'
                )}>
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 text-left">
                    {visibleTags.map((item) => (
                        <span
                            key={item.value}
                            className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                            {item.label}
                        </span>
                    ))}
                    {remainingCount > 0 && (
                        <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                            +{remainingCount}
                        </span>
                    )}
                    {selectedItems.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
                </div>
                <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            </ComboboxPrimitive.Trigger>
            <ComboboxPrimitive.Portal>
                <ComboboxPrimitive.Positioner
                    side={side}
                    align={align}
                    sideOffset={4}
                    className={cn('isolate z-9999 outline-none pui-root', mode)}
                    style={cssVariables}>
                    <ComboboxPrimitive.Popup
                        className={cn(
                            'min-w-[280px] overflow-hidden rounded-[3px] border border-border bg-white py-[10px] px-0 shadow-[0px_6px_20px_0px_#00000014] dark:bg-popover dark:shadow-none text-popover-foreground',
                            'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95',
                            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
                        )}>
                        {searchable && (
                            <div
                                className="px-4 pb-2"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}>
                                <ComboboxPrimitive.Input
                                    placeholder={placeholder}
                                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>
                        )}
                        <ComboboxPrimitive.Empty className="py-2 px-4 text-center text-sm text-muted-foreground">
                            No results.
                        </ComboboxPrimitive.Empty>
                        <ComboboxPrimitive.List
                            className="max-h-60 overflow-y-auto data-empty:p-0"
                            children={(item: TagMultiSelectComboboxItem) => (
                                <ComboboxPrimitive.Item key={item.value} value={item} className={comboboxItemStyles}>
                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border border-border bg-background data-selected:border-primary data-selected:bg-primary data-selected:[&_svg]:text-primary-foreground">
                                        <ComboboxPrimitive.ItemIndicator
                                            keepMounted
                                            className="flex items-center justify-center">
                                            <CheckIcon className="h-3 w-3" />
                                        </ComboboxPrimitive.ItemIndicator>
                                    </span>
                                    <span>{item.label}</span>
                                </ComboboxPrimitive.Item>
                            )}
                        />
                    </ComboboxPrimitive.Popup>
                </ComboboxPrimitive.Positioner>
            </ComboboxPrimitive.Portal>
        </ComboboxPrimitive.Root>
    );
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  TagMultiSelectCombobox,
  useComboboxAnchor
};

