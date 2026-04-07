import useWindowDimensions from '@/hooks/useWindowDimensions';
import { cn, kebabCase, snakeCase } from '@/lib/utils';
import { Popover, Slot } from '@wordpress/components';
import {
    DataViews as DataViewsTable,
    type Action,
    type Field,
    type SupportedLayouts,
    type View
} from '@wordpress/dataviews/wp';
import { __ } from '@wordpress/i18n';
import { FileSearch, Funnel, Plus, Search, X } from 'lucide-react';
import type React from 'react';
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    Spinner
} from '../ui';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

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
function getQueryParamsFromView(view: View, tabViewKey: string): Record<string, string | number | null | undefined> {
    const v = view as View & {
        [key: string]: any;
    };

    const perPage = v.perPage ?? v.per_page;

    const filters =
        typeof v.filters === 'object' && Object.keys(v.filters).length > 0 ? JSON.stringify(v.filters) : null;

    // Start with the core pieces of state we always want in the URL.
    const params: Record<string, any> = {
        // Use `current_page` instead of `page` so we don't conflict with
        // WordPress admin's own `page` query param (e.g. ?page=plugin-ui-test).
        current_page: v.page ?? null,
        per_page: perPage ?? null,
        search: v.search ?? '',
        [tabViewKey]: v[tabViewKey] ?? '',
        filters
    };

    return params;
}

// Extended action type with automatic destructive confirmation support
export type DestructiveActionConfig = {
    /** When true, shows an AlertDialog confirmation before executing the action callback. */
    isDestructive?: boolean;
    /** Custom title for the confirmation dialog. Defaults to the action label. */
    confirmTitle?: string;
    /** Custom message for the confirmation dialog. */
    confirmMessage?: string;
    /** Custom label for the confirm button. Defaults to the action label. */
    confirmButtonLabel?: string;
    /** Custom label for the cancel button. Defaults to "Cancel". */
    cancelButtonLabel?: string;
};

// Re-export types from @wordpress/dataviews with prefixed names to avoid conflicts
export type DataViewAction<Item> = Action<Item> & DestructiveActionConfig;
export type { Field as DataViewField, SupportedLayouts as DataViewLayouts, View as DataViewState };

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
    const {
        removeFilter = __('Remove filter', 'default'),
        addFilter = __('Add Filter', 'default'),
        reset = __('Reset', 'default')
    } = labels;

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
        <Fragment>
            <div className={cn('sm:flex w-full justify-between items-center', className)}>
                <div className="flex flex-row flex-wrap gap-4 items-center">
                    {activeFilters.map((id) => {
                        const field = fields.find((f) => f.id === id);
                        if (!field) {
                            return null;
                        }
                        return (
                            <div
                                className="relative flex items-center pe-2 border rounded-md border-border **:border-0 **:shadow-none"
                                key={id}>
                                {field.field}
                                <span
                                    role="button"
                                    aria-label={removeFilter}
                                    className="inline-flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-primary z-10"
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
                                className="w-full flex items-center gap-3! px-4! py-2! text-sm text-muted-foreground hover:bg-accent! hover:text-primary transition-all duration-200 border-none bg-transparent! group"
                                onClick={() => handleAddFilter(f.id)}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </Popover>
            )}
        </Fragment>
    );
};

interface Tab {
    label: string;
    value: string;
    className?: string;
    icon?: React.ComponentType<{ className?: string }>;
    count?: number;
    disabled?: boolean;
}

interface TabsProps {
    items?: Tab[];
    /** @deprecated Use `items` instead. Kept for backward compatibility. */
    tabs?: Tab[];
    onSelect?: (value: string) => void;
    defaultValue?: string;
    /** The view object key that tab selection maps to. Defaults to `'status'`. */
    viewKey?: string;
    headerContent?: React.ReactNode[];
    /** @deprecated Use `headerContent` instead. Kept for backward compatibility. */
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
    actions?: DataViewAction<Item>[];
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
    children?: React.ReactNode;
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

/**
 * Renders a skeleton loading state matching the current view type.
 */
function SkeletonTable({
    rows,
    headers,
    hasActions,
    hasBulkActions,
    viewType = 'table'
}: {
    rows: number;
    headers: string[];
    hasActions: boolean;
    hasBulkActions: boolean;
    viewType?: string;
}) {
    if (viewType === 'grid') {
        return (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 p-4">
                {Array.from({ length: rows }, (_, i) => (
                    <div key={i} className="rounded-lg border border-border bg-background p-4 space-y-3">
                        <Skeleton className="aspect-video w-full rounded-md" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <div className="flex gap-2 pt-1">
                            <Skeleton className="h-5 w-14 rounded-full" />
                            <Skeleton className="h-5 w-14 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (viewType === 'list') {
        return (
            <div className="divide-y divide-border">
                {Array.from({ length: rows }, (_, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4">
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        {hasActions && <Skeleton className="h-4 w-8 shrink-0" />}
                    </div>
                ))}
            </div>
        );
    }

    const widths = ['w-3/4', 'w-1/2', 'w-2/3', 'w-5/6', 'w-2/5'];

    return (
        <table className="w-full text-sm border-collapse">
            <thead>
                <tr className="bg-background border-b border-border">
                    {hasBulkActions && (
                        <th className="h-12 bg-background w-12 px-5 align-middle">
                            <Skeleton className="h-4 w-4 rounded-sm" />
                        </th>
                    )}
                    {headers.map((label, colIdx) => {
                        const isActions = hasActions && colIdx === headers.length - 1;
                        return (
                            <th
                                key={colIdx}
                                className={cn(
                                    'h-12 bg-background px-5 align-middle text-[11px] font-medium text-foreground uppercase tracking-normal',
                                    isActions ? 'text-right' : 'text-left'
                                )}>
                                {label}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: rows }, (_, rowIdx) => (
                    <tr key={rowIdx} className="bg-background border-b border-border last:border-b-0">
                        {hasBulkActions && (
                            <td className="h-12 w-12 px-5 align-middle">
                                <Skeleton className="h-4 w-4 rounded-sm" />
                            </td>
                        )}
                        {headers.map((_, colIdx) => {
                            const isActions = hasActions && colIdx === headers.length - 1;
                            return (
                                <td key={colIdx} className="h-12 px-5 align-middle">
                                    <div className={cn(isActions && 'flex justify-end')}>
                                        <Skeleton className={cn('h-4', widths[colIdx % widths.length])} />
                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

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
        isLoading = false,
        empty,
        emptyIcon,
        emptyTitle,
        emptyDescription,
        header,
        filter,
        tabs,
        search,
        searchPlaceholder = __('Search', 'default'),
        children,
        ...dataViewsTableProps
    } = props;

    // --- Dynamic bulk action toolbar offset based on actual thead height ---
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const [theadHeight, setTheadHeight] = useState(0);

    useLayoutEffect(() => {
        const container = tableContainerRef.current;
        if (!container) return;

        const thead = container.querySelector('thead');
        if (!thead) return;

        const observer = new ResizeObserver(([entry]) => {
            setTheadHeight(entry.contentRect.height);
        });
        observer.observe(thead);
        setTheadHeight(thead.offsetHeight);

        return () => observer.disconnect();
    }, [view.type]);

    // --- Destructive action confirmation via AlertDialog ---
    const [pendingDestructiveAction, setPendingDestructiveAction] = useState<{
        action: DataViewAction<Item> & { callback: (...args: any[]) => void };
        items: Item[];
        context: any;
    } | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    // Ariakit (WP Menu) and base-ui (AlertDialog) both manipulate body scroll
    // styles independently. When one saves the other's overflow:hidden as the
    // "original" state, closing the dialog restores that instead of the clean
    // state. Force-clear after all their scheduled cleanups have run.
    const prevPendingRef = useRef(pendingDestructiveAction);
    useEffect(() => {
        const wasOpen = prevPendingRef.current !== null;
        const isClosed = pendingDestructiveAction === null;
        prevPendingRef.current = pendingDestructiveAction;

        if (wasOpen && isClosed) {
            const timer = setTimeout(() => {
                const hasOpenOverlay =
                    document.documentElement.hasAttribute('data-base-ui-scroll-locked') ||
                    document.documentElement.classList.contains('lockscroll') ||
                    document.querySelector('[data-dialog-prevent-body-scroll]') !== null;

                if (!hasOpenOverlay) {
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [pendingDestructiveAction]);

    const handleDestructiveConfirm = useCallback(async () => {
        if (pendingDestructiveAction) {
            setIsConfirming(true);
            try {
                await pendingDestructiveAction.action.callback(
                    pendingDestructiveAction.items,
                    pendingDestructiveAction.context
                );
            } finally {
                setIsConfirming(false);
                setPendingDestructiveAction(null);
            }
        }
    }, [pendingDestructiveAction]);

    const handleDestructiveCancel = useCallback(() => {
        setPendingDestructiveAction(null);
    }, []);

    /**
     * Wrap destructive ActionButton actions so they show an AlertDialog
     * confirmation before executing the original callback.
     */
    const wrapDestructiveActions = useCallback(
        (actions: DataViewAction<Item>[] | undefined): Action<Item>[] | undefined => {
            if (!actions) return actions;

            return actions.map((action) => {
                if (!action.isDestructive || !('callback' in action) || typeof action.callback !== 'function') {
                    return action as Action<Item>;
                }

                const originalCallback = action.callback;
                return {
                    ...action,
                    callback: (items: Item[], context: any) => {
                        setPendingDestructiveAction({
                            action: { ...action, callback: originalCallback } as any,
                            items,
                            context
                        });
                    }
                } as Action<Item>;
            });
        },
        []
    );

    /**
     * Disable sorting & column hiding globally
     */
    const normalizedFields = fields.map((field) => ({
        enableSorting: false,
        enableHiding: false,
        ...field
    }));

    const defaultLayouts = {
        table: { density: 'comfortable' },
        list: {},
        grid: {}
    };

    // Ensure view.fields is populated with all field IDs if not specified
    const normalizedView = {
        ...view,
        fields: view.fields?.length ? view.fields : fields.map((f) => f.id)
    };

    const handleViewChange = (nextView: View) => {
        // Sync key pieces of state into the URL so that the UI is shareable and bookmarkable.
        updateUrlQueryParams(getQueryParamsFromView(nextView, tabViewKey));
        onChangeView(nextView);
    };

    const baseProps = {
        ...dataViewsTableProps,
        isLoading,
        onChangeView: handleViewChange,
        view: normalizedView,
        fields: normalizedFields,
        defaultLayouts: props.defaultLayouts || defaultLayouts,
        empty: empty || <ListEmpty icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
    };

    // Run WordPress filter hooks on table elements (only applies when wp.hooks exists)
    const filteredActions = applyFiltersToTableElements(namespace, 'actions', baseProps.actions, props) as
        | DataViewAction<Item>[]
        | undefined;

    const viewPerPageValue =
        (view as View & { perPage?: number; per_page?: number }).perPage ??
        (view as View & { per_page?: number }).per_page ??
        10;

    const filteredProps = {
        ...baseProps,
        data: applyFiltersToTableElements(namespace, 'data', baseProps.data, props) as typeof baseProps.data,
        view: applyFiltersToTableElements(namespace, 'view', baseProps.view, props) as typeof baseProps.view,
        fields: applyFiltersToTableElements(namespace, 'fields', baseProps.fields, props) as typeof baseProps.fields,
        actions: wrapDestructiveActions(filteredActions),
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

        const targetType = windowWidth <= 768 ? 'list' : 'table';

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

    const hasFilters = (filter?.fields?.length ?? 0) > 0;

    const filterButton = hasFilters ? (
        <button
            type="button"
            ref={setButtonRef}
            title="Filter"
            className={cn(
                'relative inline-flex items-center gap-2 rounded-md bg-transparent! hover:bg-transparent! px-3 py-1.5 text-sm hover:text-primary',
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
    ) : null;

    const resolvedTabsConfig = hasFilters
        ? {
              ...tabs,
              headerContent: [...(tabs?.headerContent || tabs?.headerSlot || []), filterButton]
          }
        : tabs;

    // Backward compatibility: prefer modern keys and fallback to deprecated aliases.
    const tabItems = resolvedTabsConfig?.items ?? resolvedTabsConfig?.tabs ?? [];
    const defaultTabValue = resolvedTabsConfig?.defaultValue ?? tabItems[0]?.value;
    const tabViewKey = resolvedTabsConfig?.viewKey ?? 'status';
    const headerContent = resolvedTabsConfig?.headerContent ?? resolvedTabsConfig?.headerSlot ?? [];

    const paginationDetails = filteredProps.paginationInfo;
    const explicitTotalPages = paginationDetails?.totalPages;
    const perPage = viewPerPageValue;
    const computedTotalPages =
        typeof paginationDetails?.totalItems === 'number' && typeof perPage === 'number' && perPage > 0
            ? Math.ceil(paginationDetails.totalItems / perPage)
            : 0;
    const shouldShowPagination =
        !isLoading && (typeof explicitTotalPages === 'number' ? explicitTotalPages : computedTotalPages) > 1;
    const showFullWidthHeader = !tabItems.length && (search || hasFilters);

    const tableNameSpace = kebabCase(namespace);

    if (!namespace) {
        throw new Error('Namespace is required for the DataViewTable component');
    }

    const filterId = `${snakeCase(namespace)}_dataviews`;
    const beforeSlotId = `${filterId}-before`;
    const afterSlotId = `${filterId}-after`;

    const searchTerm = (view as View & { search?: string }).search ?? '';
    const [localSearch, setLocalSearch] = useState(searchTerm);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

    // Sync local state when the external view search changes (e.g. tab reset)
    useEffect(() => {
        setLocalSearch(searchTerm);
    }, [searchTerm]);

    const handleSearchChange = useCallback(
        (value: string) => {
            setLocalSearch(value);
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            debounceRef.current = setTimeout(() => {
                handleViewChange({
                    ...view,
                    search: value,
                    page: 1
                } as View);
            }, 500);
        },
        [handleViewChange, view]
    );

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const searchInput = search ? (
        <InputGroup className="md:w-64 md:min-w-64">
            <InputGroupAddon>
                <Search size={18} className="text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
                className="border-none!"
                placeholder={searchPlaceholder}
                value={localSearch}
                onChange={(event) => handleSearchChange(event.target.value)}
            />
        </InputGroup>
    ) : null;

    return (
        <div
            ref={tableContainerRef}
            className={cn('pui-root-dataviews', children && 'custom-layout')}
            id={tableNameSpace}
            data-filter-id={filterId}>
            <Slot name={beforeSlotId} fillProps={{ ...filteredProps }} />
            {/* Header Content */}
            <div className="w-full flex items-center flex-col justify-between rounded-tr-md rounded-tl-md">
                {header && <div className="font-semibold text-sm text-foreground">{header}</div>}
                <div
                    className={cn(
                        'flex gap-2 md:flex-row flex-col justify-between w-full',
                        (tabItems.length || search || headerContent.length) &&
                            'border-b border-border p-4 md:px-4 md:py-0'
                    )}>
                    {tabItems.length > 0 && (
                        <Tabs
                            defaultValue={defaultTabValue}
                            onValueChange={(value) => {
                                // When a tab changes, reflect that in the view state
                                const nextView = {
                                    ...view,
                                    [tabViewKey]: value,
                                    page: 1
                                } as View & { [key: string]: string | number };

                                handleViewChange(nextView);

                                tabs?.onSelect?.(value);
                                filteredProps.onChangeSelection?.([]);
                            }}>
                            <TabsList variant="line" className="p-0 flex-wrap md:flex-nowrap">
                                {tabItems.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        disabled={tab.disabled}
                                        className={cn(
                                            'cursor-pointer! flex! py-2! px-2! text-xs! md:py-6! md:px-4! md:text-sm! text-muted-foreground! bg-transparent! rounded-none! hover:bg-transparent!',
                                            'focus:outline-none! shadow-none!',
                                            tab.className
                                        )}>
                                        {tab.icon && <tab.icon className="size-4" />}
                                        {tab.label}{' '}
                                        {tab.count !== undefined && (
                                            <span className="text-muted-foreground">({tab.count})</span>
                                        )}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    )}
                    <div className={cn('flex items-center gap-2', showFullWidthHeader && 'justify-end w-full py-2')}>
                        {searchInput}
                        {headerContent.map((node, index) => (
                            <Fragment key={index}>{node}</Fragment>
                        ))}
                    </div>
                </div>

                {hasFilters && (
                    <div
                        className={`transition-all flex w-full justify-between px-4 my-4 bg-background ${
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
            </div>
            {/* @ts-expect-error - Complex conditional types from wrapper don't perfectly align with @wordpress/dataviews types */}
            <DataViewsTable {...filteredProps}>
                {children ? (
                    children
                ) : (
                    <Fragment>
                        {view.type === 'table' && filteredProps?.selection?.length > 0 && (
                            <div
                                className={cn(
                                    'animate-in py-1.5 fade-in-0 slide-in-from-top-1 duration-200 transition-all ease-in-out flex items-center bg-background z-1 border-b px-6 min-h-13 justify-between border-border w-full'
                                )}
                                style={theadHeight ? { marginBottom: -theadHeight, minHeight: theadHeight } : undefined}>
                                <DataViewsTable.BulkActionToolbar />
                            </div>
                        )}
                        {isLoading ? (
                            <SkeletonTable
                                viewType={view.type}
                                rows={viewPerPageValue}
                                hasActions={!!props.actions?.length}
                                hasBulkActions={!!props.onChangeSelection}
                                headers={[
                                    ...fields.map((f) => f.label ?? f.id),
                                    ...(props.actions?.length ? [__('Actions', 'default')] : [])
                                ]}
                            />
                        ) : (
                            <DataViewsTable.Layout />
                        )}
                        {shouldShowPagination && (
                            <div className="flex items-center justify-between">
                                <DataViewsTable.Pagination />
                            </div>
                        )}
                    </Fragment>
                )}
            </DataViewsTable>

            <Slot name={afterSlotId} fillProps={{ ...filteredProps }} />

            {/* Destructive action confirmation AlertDialog */}
            {pendingDestructiveAction && (
                <AlertDialog open onOpenChange={(open) => !open && !isConfirming && handleDestructiveCancel()}>
                    <AlertDialogContent size="default">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {pendingDestructiveAction.action.confirmTitle ||
                                    (typeof pendingDestructiveAction.action.label === 'function'
                                        ? pendingDestructiveAction.action.label(pendingDestructiveAction.items)
                                        : pendingDestructiveAction.action.label)}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {pendingDestructiveAction.action.confirmMessage ||
                                    __('Are you sure? This action cannot be undone.', 'default')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isConfirming}>
                                {pendingDestructiveAction.action.cancelButtonLabel || __('Cancel', 'default')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                variant="destructive"
                                onClick={handleDestructiveConfirm}
                                disabled={isConfirming}>
                                {isConfirming && <Spinner className="mr-2" />}
                                {pendingDestructiveAction.action.confirmButtonLabel ||
                                    (typeof pendingDestructiveAction.action.label === 'function'
                                        ? pendingDestructiveAction.action.label(pendingDestructiveAction.items)
                                        : pendingDestructiveAction.action.label)}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}

DataViews.Pagination = DataViewsTable.Pagination as React.ComponentType<any>;
DataViews.Layout = DataViewsTable.Layout as React.ComponentType<any>;
DataViews.Search = DataViewsTable.Search as React.ComponentType<any>;
DataViews.Filters = DataViewsTable.Filters as React.ComponentType<any>;
DataViews.BulkActionToolbar = DataViewsTable.BulkActionToolbar as React.ComponentType<any>;
