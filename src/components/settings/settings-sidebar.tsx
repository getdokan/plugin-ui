import { useMemo, useState } from 'react';
import { useSettings } from './settings-context';
import {
    LayoutMenu,
    type LayoutMenuItemData,
} from '../ui/layout-menu';
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
 * Collect all searchable text from a schema subtree.
 * Includes labels, titles, descriptions, option labels, placeholder text.
 */
function collectSearchableText(element: SettingsElement): string {
    const texts: string[] = [];
    const walk = (el: SettingsElement) => {
        if (el.label) texts.push(el.label);
        if (el.title) texts.push(el.title);
        if (el.description) texts.push(el.description);
        if (el.placeholder) texts.push(String(el.placeholder));
        if (el.options) {
            for (const opt of el.options) {
                if (opt.label) texts.push(opt.label);
                if (opt.title) texts.push(opt.title);
                if (opt.description) texts.push(opt.description);
            }
        }
        if (el.children) el.children.forEach(walk);
    };
    walk(element);
    return texts.join(' ').toLowerCase();
}

export function SettingsSidebar({ className }: { className?: string }) {
    const {
        schema,
        activePage,
        activeSubpage,
        setActivePage,
        setActiveSubpage,
    } = useSettings();

    const [search, setSearch] = useState('');

    // Build menu items + a search index (id → all searchable text in subtree)
    const { items, searchIndex } = useMemo(() => {
        const searchIdx = new Map<string, string>();

        const mapSubpageToItem = (element: SettingsElement): LayoutMenuItemData => {
            const nestedSubpages = (element.children || [])
                .filter((child) => child.type === 'subpage' && child.display !== false)
                .map(mapSubpageToItem);

            searchIdx.set(element.id, collectSearchableText(element));

            return {
                id: element.id,
                label: element.label || element.title || element.id,
                icon: getIcon(element.icon),
                testId: `settings-menu-${element.id}`,
                children: nestedSubpages.length > 0 ? nestedSubpages : undefined,
            };
        };

        const menuItems: LayoutMenuItemData[] = schema
            .filter((page) => page.display !== false)
            .map((page) => {
                const subpageItems = (page.children || [])
                    .filter((child) => child.type === 'subpage' && child.display !== false)
                    .map(mapSubpageToItem);

                searchIdx.set(page.id, collectSearchableText(page));

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

        return { items: menuItems, searchIndex: searchIdx };
    }, [schema]);

    // Deep-search filter: matches against full subtree content, not just labels
    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;

        const matchesDeep = (item: LayoutMenuItemData): boolean => {
            const text = searchIndex.get(item.id) || '';
            if (text.includes(q)) return true;
            return item.children?.some(matchesDeep) || false;
        };

        const filterTree = (menuItems: LayoutMenuItemData[]): LayoutMenuItemData[] => {
            return menuItems
                .map((item) => {
                    if (!item.children) {
                        return matchesDeep(item) ? item : null;
                    }
                    // Parent: filter children first
                    const filteredChildren = filterTree(item.children);
                    if (filteredChildren.length > 0) {
                        return { ...item, children: filteredChildren };
                    }
                    // Keep parent if its own subtree text matches
                    return matchesDeep(item) ? item : null;
                })
                .filter(Boolean) as LayoutMenuItemData[];
        };

        return filterTree(items);
    }, [items, search, searchIndex]);

    // Active item: subpage if exists, otherwise page (for pages without subpages)
    const activeItemId = activeSubpage || activePage;

    return (
        <div className={cn('flex flex-col h-full', className)} data-testid="settings-sidebar">
            {/* Deep-search input */}
            <div className="shrink-0 p-2">
                <div className="relative">
                    <Search className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
                    <Input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8 pl-8"
                        aria-label="Search settings"
                        data-testid="settings-search"
                    />
                </div>
            </div>

            <LayoutMenu
                items={filteredItems}
                searchable={false}
                activeItemId={activeItemId}
                onItemClick={(item) => {
                    const isPage = schema.some((p) => p.id === item.id);
                    if (isPage) {
                        const page = schema.find((p) => p.id === item.id);
                        const hasSubpages = page?.children?.some(
                            (c) => c.type === 'subpage' && c.display !== false
                        );
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
