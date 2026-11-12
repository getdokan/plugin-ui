/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { useSettings } from './settings-context';
import {
    LayoutMenu,
    type LayoutMenuItemData,
} from '../wordpress/layout-menu';
import type { SettingsElement } from './settings-types';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

// ============================================
// Settings Sidebar — deep-searchable menu
// ============================================

/**
 * Resolve an icon name to a Lucide icon component.
 */
function getIcon(iconName?: string): React.ReactNode {
    if (!iconName) return null;

    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
        return <IconComponent className="size-4" />;
    }

    return null;
}

/**
 * Whether anything would actually render under this page/subpage: a field,
 * section or fieldgroup of its own, or a subpage that itself has content.
 *
 * Schemas commonly declare shell pages that a premium add-on fills in later.
 * Listing those in the sidebar leads to a blank settings screen, so they are
 * left out until they have something to show.
 */
function hasRenderableContent(element: SettingsElement): boolean {
    return (element.children || []).some((child) => {
        if (child.display === false) {
            return false;
        }
        return child.type === 'subpage' ? hasRenderableContent(child) : true;
    });
}

/** A subpage that is both displayable and non-empty. */
function isVisibleSubpage(child: SettingsElement): boolean {
    return child.type === 'subpage' && child.display !== false && hasRenderableContent(child);
}

export function SettingsSidebar({
    className,
    searchPlaceholder,
    searchable = true,
}: {
    className?: string;
    searchPlaceholder?: string;
    searchable?: boolean;
}) {
    const {
        schema,
        activePage,
        activeSubpage,
        setActivePage,
        setActiveSubpage,
        searchQuery,
        setSearchQuery,
        searchIndex,
        goToFirstSearchMatch,
    } = useSettings();

    const items = useMemo(() => {
        const mapSubpageToItem = (element: SettingsElement): LayoutMenuItemData => {
            const nestedSubpages = (element.children || [])
                .filter(isVisibleSubpage)
                .map(mapSubpageToItem);

            return {
                id: element.id,
                label: element.label || element.title || element.id,
                icon: getIcon(element.icon),
                testId: `settings-menu-${element.id}`,
                children: nestedSubpages.length > 0 ? nestedSubpages : undefined,
            };
        };

        const menuItems: LayoutMenuItemData[] = schema
            .filter((page) => page.display !== false && hasRenderableContent(page))
            .map((page) => {
                const subpageItems = (page.children || [])
                    .filter(isVisibleSubpage)
                    .map(mapSubpageToItem);

                if (subpageItems.length > 0) {
                    // Page WITH subpages → parent item with expandable children
                    return {
                        id: page.id,
                        label: page.label || page.title || page.id,
                        icon: getIcon(page.icon),
                        testId: `settings-menu-${page.id}`,
                        children: subpageItems,
                    };
                }
                // Page WITHOUT subpages → clickable leaf item
                return {
                    id: page.id,
                    label: page.label || page.title || page.id,
                    icon: getIcon(page.icon),
                    testId: `settings-menu-${page.id}`,
                };
            });

        return menuItems;
    }, [schema]);

    // Keep only menu entries that contain a matching field, each with its match count.
    const filteredItems = useMemo(() => {
        if (!searchIndex) return items;

        const filterTree = (menuItems: LayoutMenuItemData[]): LayoutMenuItemData[] =>
            menuItems
                .map((item) => {
                    const count = searchIndex.counts.get(item.id) || 0;
                    if (count === 0) return null;
                    return {
                        ...item,
                        secondaryLabel: count === 1 ? '1 match' : `${count} matches`,
                        children: item.children ? filterTree(item.children) : undefined,
                    };
                })
                .filter(Boolean) as LayoutMenuItemData[];

        return filterTree(items);
    }, [items, searchIndex]);

    // Active item: subpage if exists, otherwise page (for pages without subpages)
    const activeItemId = activeSubpage || activePage;

    return (
        <div className={cn('flex flex-col h-full', className)} data-testid="settings-sidebar">
            {/* Deep-search input. Same 28px gutter the menu rows use, so the
                field's edges line up with the hover/active pills below it. */}
            {searchable && (
                <div className="shrink-0 px-7 pt-7 pb-2">
                    <div className="relative">
                        <Search className="text-muted-foreground pointer-events-none absolute left-3 inset-y-0 my-auto size-4" />
                        <Input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    goToFirstSearchMatch();
                                } else if (e.key === 'Escape') {
                                    setSearchQuery('');
                                }
                            }}
                            className="h-9 ps-9"
                            placeholder={searchPlaceholder || 'Search...'}
                            aria-label="Search settings"
                            data-testid="settings-search"
                        />
                    </div>
                </div>
            )}

            {searchIndex && filteredItems.length === 0 && (
                <p className="px-7 py-6 text-sm text-muted-foreground" data-testid="settings-search-empty">
                    No settings match &ldquo;{searchQuery.trim()}&rdquo;.
                </p>
            )}

            <LayoutMenu
                items={filteredItems}
                activeItemId={activeItemId}
                expandAll={Boolean(searchIndex)}
                onItemClick={(item) => {
                    const isPage = schema.some((p) => p.id === item.id);
                    if (isPage) {
                        const page = schema.find((p) => p.id === item.id);
                        const hasSubpages = page?.children?.some(isVisibleSubpage);
                        if (!hasSubpages) {
                            // Page without subpages — navigate directly
                            setActivePage(item.id);
                        }
                        // Pages WITH subpages: LayoutMenu handles expand/collapse
                    } else {
                        // Subpage — navigate
                        setActiveSubpage(item.id);
                    }
                }}
            />
        </div>
    );
}
