import { cn } from '@/lib/utils';
import { Layout, LayoutBody, LayoutSidebar, LayoutMain } from '../ui/layout';
import { Button } from '../ui/button';
import { SettingsProvider } from './settings-context';
import { SettingsSidebar } from './settings-sidebar';
import { SettingsContent } from './settings-content';
import { useSettings } from './settings-context';
import type { SettingsProps, SettingsElement } from './settings-types';
import { Save } from 'lucide-react';

// ============================================
// Settings Root Component
// ============================================

export function Settings({
    schema,
    values,
    onChange,
    onSave,
    loading = false,
    title,
    hookPrefix = 'plugin_ui',
    className,
}: SettingsProps) {
    return (
        <SettingsProvider
            schema={schema}
            values={values}
            onChange={onChange}
            loading={loading}
            hookPrefix={hookPrefix}
        >
            <SettingsInner
                onSave={onSave}
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
    onSave,
    title,
    className,
}: {
    onSave?: (values: Record<string, any>) => void;
    title?: string;
    className?: string;
}) {
    const { values, isDirty, loading } = useSettings();

    const handleSave = () => {
        onSave?.(values);
    };

    if (loading) {
        return (
            <div className={cn('flex items-center justify-center min-h-96', className)}>
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Loading settings…</p>
                </div>
            </div>
        );
    }

    return (
        <Layout
            sidebarPosition="left"
            sidebarVariant="inline"
            sidebarBreakpoint="lg"
            defaultSidebarOpen={true}
            className={cn('min-h-[600px] rounded-lg border border-border bg-background overflow-hidden', className)}
        >
            <LayoutBody>
                <LayoutSidebar width="w-64">
                    {title && (
                        <div className="px-4 py-3 border-b border-border">
                            <h1 className="text-base font-semibold text-foreground">{title}</h1>
                        </div>
                    )}
                    <SettingsSidebar />
                </LayoutSidebar>

                <LayoutMain className="p-0 flex flex-col">
                    <SettingsContent className="flex-1" />

                    {/* Save bar */}
                    {isDirty && onSave && (
                        <div className="sticky bottom-0 border-t border-border bg-background px-6 py-3 flex justify-end">
                            <Button onClick={handleSave} size="default">
                                <Save className="size-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    )}
                </LayoutMain>
            </LayoutBody>
        </Layout>
    );
}

// ============================================
// Re-exports
// ============================================

export { useSettings } from './settings-context';
export { formatSettingsData, extractValues } from './settings-formatter';
export type { SettingsElement, SettingsProps, FieldComponentProps } from './settings-types';
