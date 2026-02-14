import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { SettingsProvider } from './settings-context';
import { SettingsSidebar } from './settings-sidebar';
import { SettingsContent } from './settings-content';
import { useSettings } from './settings-context';
import type { SettingsProps } from './settings-types';
import { Menu, X } from 'lucide-react';

// ============================================
// Settings Root Component
// ============================================

export function Settings({
    schema,
    values,
    onChange,
    onSave,
    renderSaveButton,
    loading = false,
    title,
    hookPrefix = 'plugin_ui',
    className,
    applyFilters,
}: SettingsProps) {
    return (
        <SettingsProvider
            schema={schema}
            values={values}
            onChange={onChange}
            onSave={onSave}
            renderSaveButton={renderSaveButton}
            loading={loading}
            hookPrefix={hookPrefix}
            applyFilters={applyFilters}
        >
            <SettingsInner
                title={title}
                className={className}
            />
        </SettingsProvider>
    );
}

// ============================================
// Inner component (has access to context)
// ============================================

function SettingsInner({
    title,
    className,
}: {
    title?: string;
    className?: string;
}) {
    const { loading, activeSubpage } = useSettings();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Close mobile sidebar when a subpage is selected
    const prevSubpage = usePrevious(activeSubpage);
    useEffect(() => {
        if (prevSubpage && activeSubpage !== prevSubpage) {
            setMobileSidebarOpen(false);
        }
    }, [activeSubpage, prevSubpage]);

    if (loading) {
        return (
            <div className={cn('flex items-center justify-center min-h-96', className)}>
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'relative flex min-h-[500px] rounded-lg border border-border bg-background overflow-hidden',
                className
            )}
        >
            {/* ── Mobile backdrop ── */}
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-200',
                    mobileSidebarOpen
                        ? 'opacity-100'
                        : 'pointer-events-none opacity-0'
                )}
                aria-hidden
                onClick={() => setMobileSidebarOpen(false)}
            />

            {/* ── Sidebar ── */}
            <aside
                className={cn(
                    // Desktop: static, always visible
                    'hidden lg:flex lg:w-64 shrink-0 flex-col border-r border-border bg-muted/30 overflow-hidden',
                    // Mobile: fixed slide-in drawer
                    'max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:w-72 max-lg:flex max-lg:flex-col max-lg:bg-background max-lg:shadow-xl',
                    'max-lg:transition-transform max-lg:duration-200 max-lg:ease-out',
                    mobileSidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full',
                )}
            >
                {/* Mobile close button */}
                <div className="flex h-12 items-center justify-between border-b border-border px-3 lg:hidden">
                    {title && (
                        <span className="text-sm font-semibold text-foreground">{title}</span>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setMobileSidebarOpen(false)}
                        aria-label="Close menu"
                    >
                        <X className="size-4" />
                    </Button>
                </div>

                {/* Desktop title */}
                {title && (
                    <div className="px-4 py-3 border-b border-border hidden lg:block">
                        <h1 className="text-base font-semibold text-foreground">{title}</h1>
                    </div>
                )}

                <SettingsSidebar className="flex-1 overflow-y-auto" />
            </aside>

            {/* ── Main content ── */}
            <div className="flex flex-1 min-w-0 flex-col">
                {/* Mobile header with menu toggle */}
                <div className="flex items-center gap-2 border-b border-border px-4 py-2 lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        onClick={() => setMobileSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="size-4" />
                    </Button>
                    {title && (
                        <span className="text-sm font-semibold text-foreground truncate">{title}</span>
                    )}
                </div>

                <SettingsContent className="flex-1" />
            </div>
        </div>
    );
}

// ============================================
// Utility: track previous value
// ============================================

function usePrevious<T>(value: T): T | undefined {
    const [prev, setPrev] = useState<T | undefined>(undefined);
    const [current, setCurrent] = useState(value);

    if (value !== current) {
        setPrev(current);
        setCurrent(value);
    }

    return prev;
}

// ============================================
// Re-exports
// ============================================

export { useSettings } from './settings-context';
export type { ApplyFiltersFunction } from './settings-context';
export { formatSettingsData, extractValues } from './settings-formatter';
export type { SettingsElement, SettingsProps, FieldComponentProps, SaveButtonRenderProps } from './settings-types';
