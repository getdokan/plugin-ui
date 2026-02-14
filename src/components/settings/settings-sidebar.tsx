import { useMemo } from 'react';
import { useSettings } from './settings-context';
import {
    LayoutMenu,
    type LayoutMenuItemData,
} from '../ui/layout-menu';
import type { SettingsElement } from './settings-types';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Settings Sidebar — uses LayoutMenu
// Page titles render as expandable parent items,
// subpage titles render as clickable child items.
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

export function SettingsSidebar({ className }: { className?: string }) {
    const {
        schema,
        activeSubpage,
        setActiveSubpage,
    } = useSettings();

    // Recursive helper: map a subpage element to a LayoutMenuItemData
    const mapSubpageToItem = (element: SettingsElement): LayoutMenuItemData => {
        const nestedSubpages = (element.children || [])
            .filter((child) => child.type === 'subpage' && child.display !== false)
            .map(mapSubpageToItem);

        return {
            id: element.id,
            label: element.title || element.id,
            icon: getIcon(element.icon),
            children: nestedSubpages.length > 0 ? nestedSubpages : undefined,
        };
    };

    // Map each page as a parent item with subpages as children
    const items: LayoutMenuItemData[] = useMemo(() => {
        return schema
            .filter((page) => page.display !== false)
            .map((page) => {
                const subpageItems = (page.children || [])
                    .filter((child) => child.type === 'subpage' && child.display !== false)
                    .map(mapSubpageToItem);

                return {
                    id: page.id,
                    label: page.title || page.id,
                    icon: getIcon(page.icon),
                    children: subpageItems.length > 0 ? subpageItems : undefined,
                };
            })
            .filter((item) => item.children && item.children.length > 0);
    }, [schema]);

    return (
        <div className={cn('flex flex-col h-full', className)}>
            <LayoutMenu
                items={items}
                searchable={true}
                searchPlaceholder="Search settings…"
                activeItemId={activeSubpage}
                onItemClick={(item) => {
                    // Only navigate when clicking a leaf subpage (not a page parent)
                    const isPage = schema.some((p) => p.id === item.id);
                    if (!isPage) {
                        setActiveSubpage(item.id);
                    }
                }}
            />
        </div>
    );
}
