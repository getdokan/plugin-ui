import useWindowDimensions from '@/hooks/useWindowDimensions';
import { Popover, Slot } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { cn } from '@/lib/utils';
import {
    DataViews as DataViewsTable,
    type Action,
    type Field,
    type SupportedLayouts,
    type View
} from '@wordpress/dataviews/wp';
import { FileSearch, Funnel, Plus, Search, X } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

/** Convert string to snake_case (e.g. "myNamespace" -> "my_namespace"). */
function snakeCase(str: string): string {
    if( !str ) return '';
    return str
        .replace(/-/g, '_')
        .replace(/\s+/g, '_')
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .toLowerCase()
        .replace(/^_+|_+$/g, '');
}

/** Convert string to kebab-case (e.g. "myNamespace" -> "my-namespace"). */
function kebabCase(str: string): string {
    if( !str ) return '';
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

/**
 * Update the current URL's query parameters without causing a full page reload.
 */
function updateUrlQueryParams(params: Record<string, string | number | null | undefined>): void {
    if (typeof window === 'undefined') {
        return;
    }

    const url = new URL(window.location.href);

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, String(value));
        }
    });

    window.history.replaceState({}, '', url.toString());
}

/**
 * Extract query-param friendly values from a DataViews `View`.
 *
 * We intentionally support both camelCase (`perPage`) and snake_case (`per_page`)
 * so that whatever the upstream shape is, we can still sync it into the URL.
 */
function getQueryParamsFromView(view: View): Record<string, string | number | null | undefined> {
    const v = view as View & {
        page?: number;
        per_page?: number;
        perPage?: number;
        search?: string;
        filters?: unknown;
        status?: string;
    };

    const perPage = v.perPage ?? v.per_page;

    const filters =
        v.filters &&
        typeof v.filters === 'object' &&
        Object.keys(v.filters as unknown as Record<string, unknown>).length > 0
            ? JSON.stringify(v.filters)
            : null;

    // Start with the core pieces of state we always want in the URL.
    const params: Record<string, string | number | null | undefined> = {
        // Use `current_page` instead of `page` so we don't conflict with
        // WordPress admin's own `page` query param (e.g. ?page=plugin-ui-test).
        current_page: v.page ?? null,
        per_page: perPage ?? null,
        search: v.search ?? '',
        status: v.status ?? '',
        filters,
    };

    return params;
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
    const { removeFilter = __('Remove filter', 'default'), addFilter = __('Add Filter', 'default'), reset = __('Reset', 'default') } = labels;

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
    }, [activeFilters.length, onActiveFiltersChange]);

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
    searchPlaceholder?: string;
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
    const heading = title ?? __('No data found', 'default');

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
        search,
        searchLabel,
        searchPlaceholder = __('Search', 'default'),
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

    const handleViewChange = (nextView: View) => {
        // Sync key pieces of state into the URL so that the UI is shareable and bookmarkable.
        updateUrlQueryParams(getQueryParamsFromView(nextView));
        onChangeView(nextView);
    };

    const baseProps = {
        ...dataViewsTableProps,
        onChangeView: handleViewChange,
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

    // Set view type `list` for mobile devices when responsive.
    useEffect(() => {
        if (!responsive) {
            return;
        }

        const targetType: View['type'] = windowWidth <= 768 ? 'list' : 'table';

        if (view.type !== targetType) {
            onChangeView({
                ...view,
                type: targetType
            } as View);
        }
    }, [responsive, windowWidth, onChangeView, view]);

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

    const searchTerm = (view as View & { search?: string }).search ?? '';

    const searchInput = search ? (
        <InputGroup className="w-64 min-w-64">
            <InputGroupAddon>
                <Search size={18} className="text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(event) =>
                    handleViewChange({
                        ...view,
                        search: event.target.value,
                        page: 1
                    } as View)
                }
            />
        </InputGroup>
    ) : null;

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
                                    // When a tab changes, reflect that in the view state
                                    const nextView = {
                                        ...view,
                                        status: value,
                                        page: 1,
                                    } as View & { status?: string };

                                    handleViewChange(nextView);

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
                                {searchInput}
                                {(tabsWithFilterButton || tabs)?.headerSlot?.map((node, index) => (
                                    <Fragment key={index}>{node}</Fragment>
                                ))}
                            </div>
                        </div>
                    )}

                    {filter && filter.fields && filter.fields.length > 0 && (
                        <div
                            className={`transition-all flex w-full justify-between px-4 bg-background ${
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
