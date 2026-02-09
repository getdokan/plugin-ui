import useWindowDimensions from '@/hooks/useWindowDimensions';
import { Popover, Slot } from '@wordpress/components';
// @ts-ignore
import { cn } from '@/lib/utils';
import {
    DataViews as DataViewsTable,
    type Action,
    type Field,
    type SupportedLayouts,
    type View
} from '@wordpress/dataviews/wp';
import { FileSearch, Funnel, Plus, X } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

/** Convert string to snake_case (e.g. "myNamespace" -> "my_namespace"). */
function snakeCase(str: string): string {
    return str
        .replace(/-/g, '_')
        .replace(/\s+/g, '_')
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .toLowerCase()
        .replace(/^_+|_+$/g, '');
}

/** Convert string to kebab-case (e.g. "myNamespace" -> "my-namespace"). */
function kebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase()
        .replace(/^-+|-+$/g, '');
}

declare global {
    interface Window {
        wp?: { hooks?: { applyFilters: (hookName: string, value: unknown, ...args: unknown[]) => unknown } };
    }
}

/**
 * Apply WordPress filters to a table element when wp.hooks is available.
 * Hook name format: `{snakeNamespace}_dataviews_{elementName}`
 */
function applyFiltersToTableElements<Item>(
    namespace: string,
    elementName: string,
    element: unknown,
    props: DataViewsProps<Item>
): unknown {
    if (typeof window === 'undefined' || !window.wp?.hooks?.applyFilters) {
        return element;
    }
    const hookName = `${snakeCase(namespace)}_dataviews_${elementName}`;
    return window.wp.hooks.applyFilters(hookName, element, props) as unknown;
}

// Re-export types from @wordpress/dataviews with prefixed names to avoid conflicts
export type {
    Action as DataViewAction,
    Field as DataViewField,
    SupportedLayouts as DataViewLayouts,
    View as DataViewState
};

// Filter types
export interface DataViewFilterField {
    field: React.ReactNode;
    label: string;
    id: string;
}

export interface DataViewFilterProps {
    fields: DataViewFilterField[];
    onFilterRemove?: (filterId: string) => void;
    onReset?: () => void;
    openOnMount?: boolean;
    openSelectorSignal?: number;
    onFirstFilterAdded?: () => void;
    onActiveFiltersChange?: (count: number) => void;
    buttonPopOverAnchor?: HTMLElement | null;
    className?: string;
    labels?: {
        removeFilter?: string;
        addFilter?: string;
        reset?: string;
    };
}

const FilterItems = ({
    fields,
    onReset = () => {},
    onFilterRemove = () => {},
    className = '',
    openOnMount = false,
    openSelectorSignal = 0,
    onFirstFilterAdded = () => {},
    onActiveFiltersChange = () => {},
    buttonPopOverAnchor = null,
    labels = {}
}: DataViewFilterProps) => {
    const { removeFilter = 'Remove filter', addFilter = 'Add Filter', reset = 'Reset' } = labels;

    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
        if (openOnMount) {
            setIsPopoverOpen(true);
        }
    }, [openOnMount]);

    useEffect(() => {
        if (openSelectorSignal !== 0) {
            setIsPopoverOpen(true);
        }
    }, [openSelectorSignal]);

    const [popoverAnchor, setPopoverAnchor] = useState(buttonPopOverAnchor);
    const [addButtonAnchor, setAddButtonAnchor] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setPopoverAnchor(buttonPopOverAnchor);
    }, [buttonPopOverAnchor]);

    useEffect(() => {
        if (activeFilters.length === 0) {
            setPopoverAnchor(buttonPopOverAnchor);
        }
    }, [activeFilters.length, buttonPopOverAnchor]);

    useEffect(() => {
        if (activeFilters.length > 0 && addButtonAnchor) {
            setPopoverAnchor(addButtonAnchor);
        }
    }, [activeFilters.length, addButtonAnchor]);

    useEffect(() => {
        onActiveFiltersChange?.(activeFilters.length);
    }, [activeFilters.length]);

    const availableFilters = fields.filter((f) => !activeFilters.includes(f.id));

    const handleAddFilter = (id: string) => {
        setActiveFilters((prev) => {
            if (prev.includes(id)) {
                return prev;
            }
            if (prev.length === 0) {
                onFirstFilterAdded?.();
            }
            return [...prev, id];
        });
        setIsPopoverOpen(false);
    };

    const handleReset = () => {
        setActiveFilters([]);
        onReset();
    };

    const handleRemoveFilter = (id: string) => {
        setActiveFilters((prev) => prev.filter((f) => f !== id));
        onFilterRemove?.(id);
    };

    return (
        <>
            <div className={cn('flex w-full justify-between items-center', className)}>
                <div className="flex flex-row flex-wrap gap-4 items-center">
                    {activeFilters.map((id) => {
                        const field = fields.find((f) => f.id === id);
                        if (!field) {
                            return null;
                        }
                        return (
                            <div className="relative inline-flex items-center" key={id}>
                                <div className="[&>input]:pr-8 [&>select]:pr-8">{field.field}</div>
                                <span
                                    role="button"
                                    aria-label={removeFilter}
                                    className="absolute right-2 inline-flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-primary z-10"
                                    onClick={() => handleRemoveFilter(id)}>
                                    <X size="12" />
                                </span>
                            </div>
                        );
                    })}
                    {availableFilters.length > 0 && (
                        <span ref={setAddButtonAnchor}>
                            <Button
                                className="flex gap-2 items-center justify-center shadow-none"
                                variant="ghost"
                                onClick={() => setIsPopoverOpen((currentState) => !currentState)}>
                                <Plus size="16" />
                                {addFilter}
                            </Button>
                        </span>
                    )}
                </div>

                <Button className="flex" variant="ghost" onClick={handleReset}>
                    {reset}
                </Button>
            </div>
            {isPopoverOpen && (
                <Popover
                    anchor={popoverAnchor}
                    offset={15}
                    position="bottom right"
                    className="pui-root"
                    onClose={() => setIsPopoverOpen(false)}>
                    <div className="py-1 min-w-40 bg-popover border-border rounded-md">
                        {availableFilters.map((f) => (
                            <button
                                key={f.id}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-primary transition-all duration-200 border-none bg-transparent group"
                                onClick={() => handleAddFilter(f.id)}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </Popover>
            )}
        </>
    );
};

interface Tab {
    label: string;
    value: string;
    className?: string;
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
}

interface TabsProps {
    tabs: Tab[];
    onSelect?: (tabValue: string) => void;
    initialTab?: string;
    headerSlot?: React.ReactNode[];
}

type ItemWithId = { id: string };

export type DataViewsProps<Item> = {
    view: View;
    /** Required. Enables WordPress filter hooks and before/after Slots. Hook: `{snake_namespace}_dataviews_{elementName}` */
    namespace: string;
    responsive?: boolean;
    onChangeView: (view: View) => void;
    fields: Field<Item>[];
    search?: boolean;
    searchLabel?: string;
    actions?: Action<Item>[];
    data: Item[];
    isLoading?: boolean;
    paginationInfo: {
        totalItems: number;
        totalPages: number;
    };
    defaultLayouts?: SupportedLayouts;
    selection?: string[];
    onChangeSelection?: (items: string[]) => void;
    onClickItem?: (item: Item) => void;
    isItemClickable?: (item: Item) => boolean;
    empty?: JSX.Element;
    emptyIcon?: JSX.Element;
    emptyTitle?: string;
    emptyDescription?: string;
    header?: JSX.Element;
    filter?: DataViewFilterProps;
    tabs?: TabsProps;
} & (Item extends ItemWithId ? { getItemId?: (item: Item) => string } : { getItemId: (item: Item) => string });

interface ListEmptyProps {
    icon?: JSX.Element;
    title?: string;
    description?: string;
}

const ListEmpty = ({ icon, description, title }: ListEmptyProps) => {
    const desc = description ?? '';
    const heading = title ?? 'No data found';

    return (
        <div className="w-full flex items-center justify-center py-40">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center text-primary rounded-full bg-accent">
                    {icon || <FileSearch size={52} />}
                </div>
                <div className="text-foreground text-lg font-semibold">{heading}</div>
                {desc && <div className="mt-1 text-sm text-muted-foreground">{desc}</div>}
            </div>
        </div>
    );
};

export function DataViews<Item>(props: DataViewsProps<Item>) {
    const { width: windowWidth } = useWindowDimensions();
    const [showFilters, setShowFilters] = useState(false);
    const [openSelectorSignal, setOpenSelectorSignal] = useState(0);
    const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>();
    const [activeFilterCount, setActiveFilterCount] = useState(0);
    const {
        responsive = true,
        namespace,
        onChangeView,
        fields,
        view,
        empty,
        emptyIcon,
        emptyTitle,
        emptyDescription,
        header,
        filter,
        tabs,
        ...dataViewsTableProps
    } = props;
    /**
     * Disable sorting & column hiding globally
     */
    const normalizedFields = fields.map((field) => ({
        enableSorting: false,
        enableHiding: false,
        ...field
    }));
    const defaultLayouts =
        props.defaultLayouts ||
        ({
            table: { density: 'comfortable' },
            list: {}
        } as SupportedLayouts);

    // Ensure view.fields is populated with all field IDs if not specified
    const normalizedView = {
        ...view,
        fields: view.fields ?? fields.map((f) => f.id)
    };

    const baseProps = {
        ...dataViewsTableProps,
        onChangeView,
        view: normalizedView,
        fields: normalizedFields,
        defaultLayouts,
        empty: empty || <ListEmpty icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
    };

    // Run WordPress filter hooks on table elements (only applies when wp.hooks exists)
    const filteredProps = {
        ...baseProps,
        data: applyFiltersToTableElements(namespace, 'data', baseProps.data, props) as typeof baseProps.data,
        view: applyFiltersToTableElements(namespace, 'view', baseProps.view, props) as typeof baseProps.view,
        fields: applyFiltersToTableElements(namespace, 'fields', baseProps.fields, props) as typeof baseProps.fields,
        actions: applyFiltersToTableElements(
            namespace,
            'actions',
            baseProps.actions,
            props
        ) as typeof baseProps.actions,
        defaultLayouts: applyFiltersToTableElements(
            namespace,
            'layouts',
            baseProps.defaultLayouts,
            props
        ) as typeof baseProps.defaultLayouts
    };

    if (responsive) {
        // Set view type `list` for mobile device.
        useEffect(
            () =>
                onChangeView({
                    ...view,
                    type: windowWidth <= 768 ? 'list' : 'table'
                } as View),
            [windowWidth]
        );
    }

    // Auto-hide filter area when there are no active filters
    useEffect(() => {
        if (activeFilterCount === 0) {
            setShowFilters(false);
        }
    }, [activeFilterCount]);

    const tabsWithFilterButton =
        filter?.fields && tabs && filter.fields.length > 0
            ? (() => {
                  const existing = tabs?.headerSlot || [];
                  const newButton = (
                      <button
                          type="button"
                          ref={setButtonRef}
                          title="Filter"
                          className={cn(
                              'relative inline-flex items-center gap-2 rounded-md bg-transparent hover:bg-transparent px-3 py-1.5 text-sm hover:text-primary',
                              showFilters ? 'text-primary' : 'text-muted-foreground'
                          )}
                          onClick={() => {
                              if (activeFilterCount > 0) {
                                  setShowFilters((prev) => !prev);
                              } else {
                                  setOpenSelectorSignal((s) => s + 1);
                              }
                          }}>
                          <Funnel size={20} />
                          {activeFilterCount > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                  {activeFilterCount}
                              </span>
                          )}
                      </button>
                  );

                  return {
                      ...tabs,
                      headerSlot: [...existing, newButton]
                  };
              })()
            : tabs;

    const tableNameSpace = kebabCase(namespace);

    if (!namespace) {
        throw new Error('Namespace is required for the DataViewTable component');
    }

    const filterId = `${snakeCase(namespace)}_dataviews`;
    const beforeSlotId = `${filterId}-before`;
    const afterSlotId = `${filterId}-after`;

    return (
        <div className="pui-root-dataviews" id={tableNameSpace} data-filter-id={filterId}>
            <Slot name={beforeSlotId} fillProps={{ ...filteredProps }} />
            {/* @ts-expect-error - Complex conditional types from wrapper don't perfectly align with @wordpress/dataviews types */}
            <DataViewsTable {...filteredProps}>
                <div className="w-full flex items-center flex-col justify-between gap-4 rounded-tr-md rounded-tl-md">
                    {header && <div className="font-semibold text-sm text-foreground">{header}</div>}

                    {tabs && tabs.tabs && tabs.tabs.length > 0 && (
                        <div className="md:flex justify-between w-full items-center px-4 border-b border-border">
                            <Tabs
                                defaultValue={
                                    (tabsWithFilterButton || tabs)?.initialTab ||
                                    (tabsWithFilterButton || tabs)?.tabs[0]?.value
                                }
                                onValueChange={(value) => {
                                    tabs?.onSelect?.(value);
                                    filteredProps.onChangeSelection?.([]);
                                }}>
                                <TabsList variant="line" className="p-0">
                                    {(tabsWithFilterButton || tabs)?.tabs.map((tab) => (
                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
                                            disabled={tab.disabled}
                                            className={cn(
                                                'py-4 px-3 md:py-6 border-0 md:px-4 bg-transparent rounded-none hover:bg-transparent',
                                                tab.className
                                            )}>
                                            {tab.icon && <tab.icon className="size-4" />}
                                            {tab.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                            <div className="flex items-center gap-2">
                                {(tabsWithFilterButton || tabs)?.headerSlot?.map((node, index) => (
                                    <Fragment key={index}>{node}</Fragment>
                                ))}
                            </div>
                        </div>
                    )}

                    {filter && filter.fields && filter.fields.length > 0 && (
                        <div
                            className={`transition-all flex w-full justify-between p-4 bg-background ${
                                showFilters ? '' : 'hidden!'
                            }`}>
                            <FilterItems
                                {...filter}
                                openSelectorSignal={openSelectorSignal}
                                onFirstFilterAdded={() => setShowFilters(true)}
                                onReset={() => {
                                    if (filter?.onReset) {
                                        filter.onReset();
                                    }
                                    setShowFilters(false);
                                }}
                                onActiveFiltersChange={(count) => setActiveFilterCount(count)}
                                buttonPopOverAnchor={buttonRef}
                            />
                        </div>
                    )}

                    <div
                        className={cn(
                            'transition-all duration-300 ease-in-out -mb-13 flex items-center bg-background z-1 border-b px-5 h-13 justify-between border-border w-full',
                            filteredProps.selection && filteredProps.selection.length > 0
                                ? 'opacity-100 visible translate-y-0'
                                : 'opacity-0 invisible -translate-y-2'
                        )}>
                        <DataViewsTable.BulkActionToolbar />
                    </div>
                </div>
                <DataViewsTable.Layout />
                <div className="flex items-center justify-between [&>div]:w-full [&>div]:flex [&>div]:justify-between! [&>div]:p-4">
                    <DataViewsTable.Pagination />
                </div>
            </DataViewsTable>
            <Slot name={afterSlotId} fillProps={{ ...filteredProps }} />
        </div>
    );
}
