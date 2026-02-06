import useWindowDimensions from '@/hooks/useWindowDimensions';
import { Popover } from '@wordpress/components';
// @ts-ignore
import { DataViews, type Action, type Field, type SupportedLayouts, type View } from '@wordpress/dataviews/wp';
import { Fragment, useEffect, useState } from 'react';
import { FileSearch, Funnel, Plus, X } from 'lucide-react';
import { Button } from './button';
import { Tabs, TabsList, TabsTrigger } from './tabs';
import { cn } from '@/lib/utils';

// Re-export types from @wordpress/dataviews with prefixed names to avoid conflicts
export type { Action as DataViewAction, Field as DataViewField, SupportedLayouts as DataViewLayouts, View as DataViewState };

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

    const filteredFields: DataViewFilterField[] = fields;

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

    const availableFilters = filteredFields.filter((f) => !activeFilters.includes(f.id));

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
                        const field = filteredFields.find((f) => f.id === id);
                        if (!field) {
                            return null;
                        }
                        return (
                            <div className="relative inline-block" key={id}>
                                <div className="relative inline-block">
                                    {field.field}
                                    <button
                                        type="button"
                                        aria-label={removeFilter}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#828282] hover:text-[#7047EB] z-10"
                                        onClick={() => handleRemoveFilter(id)}>
                                        <X size="14" />
                                    </button>
                                </div>
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
                    className="dokan-layout"
                    onClose={() => setIsPopoverOpen(false)}>
                    <div className="py-1 min-w-40 bg-white border-[#E9E9E9] rounded-md">
                        {availableFilters.map((f) => (
                            <button
                                key={f.id}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#828282] hover:bg-[#EFEAFF] hover:text-[#7047EB] transition-all duration-200 border-none bg-transparent group"
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
    name: string;
    title: string;
    className?: string;
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
}

interface TabsProps {
    tabs: Tab[];
    onSelect?: (tabName: string) => void;
    initialTabName?: string;
    additionalComponents?: React.ReactNode[];
    className?: string;
}

type ItemWithId = { id: string };

export type DataViewsProps<Item> = {
    view: View;
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
                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center text-[#7047EB] rounded-full bg-[#EFEAFF]">
                    {icon || <FileSearch size={52} />}
                </div>
                <div className="text-[#111827] text-lg font-semibold">{heading}</div>
                {desc && <div className="mt-1 text-sm text-[#6B7280]">{desc}</div>}
            </div>
        </div>
    );
};

export function DataViewTable<Item>(props: DataViewsProps<Item>) {
    const { width: windowWidth } = useWindowDimensions();
    const [showFilters, setShowFilters] = useState(false);
    const [openSelectorSignal, setOpenSelectorSignal] = useState(0);
    const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>();
    const [hasActiveFilters, setHasActiveFilters] = useState(false);
    const { responsive = true, onChangeView, fields, view, empty, emptyIcon, emptyTitle, emptyDescription } = props;
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

    const filteredProps = {
        ...props,
        view: normalizedView,
        fields: normalizedFields,
        defaultLayouts,
        empty: empty || <ListEmpty icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
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
        if (!hasActiveFilters) {
            setShowFilters(false);
        }
    }, [hasActiveFilters]);

    const tabsWithFilterButton =
        filteredProps.filter?.fields && filteredProps.tabs && filteredProps.filter.fields.length > 0
            ? (() => {
                  const existing = filteredProps.tabs?.additionalComponents || [];
                  const newButton = (
                      <button
                          type="button"
                          ref={setButtonRef}
                          title="Filter"
                          className={cn(
                              'inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm hover:text-[#7047EB]',
                              showFilters ? 'text-[#7047EB]' : 'text-[#828282]'
                          )}
                          onClick={() => {
                              if (hasActiveFilters) {
                                  setShowFilters((prev) => !prev);
                              } else {
                                  setOpenSelectorSignal((s) => s + 1);
                              }
                          }}>
                          <Funnel size={20} />
                      </button>
                  );

                  return {
                      ...filteredProps.tabs,
                      additionalComponents: [...existing, newButton]
                  };
              })()
            : filteredProps.tabs;

    return (
        <div className="pui-root-datatable">
            <DataViews {...filteredProps}>
                <div className="w-full flex items-center flex-col justify-between rounded-tr-md rounded-tl-md">
                    {filteredProps.header && (
                        <div className="font-semibold text-sm text-[#25252D]">{filteredProps.header}</div>
                    )}
                    {filteredProps.tabs && filteredProps.tabs.tabs && filteredProps.tabs.tabs.length > 0 && (
                        <div className="flex justify-between w-full items-center px-4 border-b border-border">
                            <Tabs
                                defaultValue={
                                    (tabsWithFilterButton || filteredProps.tabs)?.initialTabName ||
                                    (tabsWithFilterButton || filteredProps.tabs)?.tabs[0]?.name
                                }
                                onValueChange={(value) => {
                                    filteredProps.tabs?.onSelect?.(value);
                                    filteredProps.selection = [];
                                    filteredProps.onChangeSelection?.([]);
                                }}>
                                <TabsList variant="line" className="p-0">
                                    {(tabsWithFilterButton || filteredProps.tabs)?.tabs.map((tab) => (
                                        <TabsTrigger
                                            key={tab.name}
                                            value={tab.name}
                                            disabled={tab.disabled}
                                            className={cn('py-6 border-0 px-4',tab.className)}>
                                            {tab.icon && <tab.icon className="size-4" />}
                                            {tab.title}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                            <div className="flex items-center gap-2">
                                {(tabsWithFilterButton || filteredProps.tabs)?.additionalComponents?.map(
                                    (node, index) => (
                                        <Fragment key={index}>{node}</Fragment>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                    {filteredProps.filter && filteredProps.filter.fields && filteredProps.filter.fields.length > 0 && (
                        <div
                            className={`transition-all flex w-full justify-between p-4 bg-white ${
                                showFilters ? '' : 'hidden!'
                            }`}>
                            <FilterItems
                                {...filteredProps.filter}
                                openSelectorSignal={openSelectorSignal}
                                onFirstFilterAdded={() => setShowFilters(true)}
                                onReset={() => {
                                    if (filteredProps.filter?.onReset) {
                                        filteredProps.filter.onReset();
                                    }
                                    setShowFilters(false);
                                }}
                                onActiveFiltersChange={(count) => setHasActiveFilters(count > 0)}
                                buttonPopOverAnchor={buttonRef}
                            />
                        </div>
                    )}

                    <div
                        className={cn(
                            'transition-opacity -mb-16.25 flex items-center bg-white z-1 border-t px-5 py-4 justify-between border-gray-200 w-full',
                            filteredProps.selection && filteredProps.selection.length > 0
                                ? 'opacity-100 visible'
                                : 'opacity-0 invisible '
                        )}>
                        <DataViews.BulkActionToolbar />
                    </div>
                </div>
                <DataViews.Layout />
                <div className="flex items-center justify-between [&>div]:w-full [&>div]:flex [&>div]:justify-between! [&>div]:p-4">
                    <DataViews.Pagination />
                </div>
            </DataViews>
        </div>
    );
}
