import { useMemo } from 'react';
import { useSettings } from './settings-context';
import {
    LayoutMenu,
    type LayoutMenuGroupData,
} from '../ui/layout-menu';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Settings Sidebar — uses LayoutMenu
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

    // Transform schema pages into LayoutMenuGroupData
    const groups: LayoutMenuGroupData[] = useMemo(() => {
        return schema
            .filter((page) => page.display !== false)
            .map((page) => ({
                id: page.id,
                label: page.title || page.id,
                secondaryLabel: page.description || undefined,
                items: (page.children || [])
                    .filter((subpage) => subpage.type === 'subpage' && subpage.display !== false)
                    .map((subpage) => ({
                        id: subpage.id,
                        label: subpage.title || subpage.id,
                        secondaryLabel: subpage.description || undefined,
                        icon: getIcon(subpage.icon),
                    })),
            }))
            .filter((group) => group.items.length > 0);
    }, [schema]);

    return (
        <div className={cn('flex flex-col h-full', className)}>
            <LayoutMenu
                groups={groups}
                searchable={true}
                searchPlaceholder="Search settings…"
                activeItemId={activeSubpage}
                onItemClick={(item) => {
                    setActiveSubpage(item.id);
                }}
            />
        </div>
    );
}
