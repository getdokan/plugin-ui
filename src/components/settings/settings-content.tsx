import type { SettingsElement as SettingsElementType } from './settings-types';
import { useSettings } from './settings-context';
import { FieldRenderer } from './field-renderer';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

// ============================================
// Settings Content — renders heading, tabs, sections
// ============================================

export function SettingsContent({ className }: { className?: string }) {
    const {
        getActiveSubpage,
        getActiveTabs,
        getActiveContent,
        activeTab,
        setActiveTab,
    } = useSettings();

    const subpage = getActiveSubpage();
    const tabs = getActiveTabs();
    const content = getActiveContent();

    if (!subpage) {
        return (
            <div className={cn('flex-1 p-6', className)}>
                <p className="text-muted-foreground text-sm">Select a menu item to view settings.</p>
            </div>
        );
    }

    return (
        <div className={cn('flex-1 overflow-y-auto', className)}>
            {/* Page heading */}
            <div className="px-6 pt-6 pb-4">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        {subpage.title && (
                            <h2 className="text-2xl font-bold text-foreground leading-tight">
                                {subpage.title}
                            </h2>
                        )}
                        {subpage.description && (
                            <p className="text-sm text-muted-foreground">
                                {subpage.description}
                            </p>
                        )}
                    </div>
                    {subpage.doc_link && (
                        <a
                            href={subpage.doc_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground flex gap-1 items-center text-sm hover:text-foreground transition-colors shrink-0"
                        >
                            <FileText className="size-4" />
                            Doc
                        </a>
                    )}
                </div>
            </div>

            {/* Tabs */}
            {tabs.length > 0 && (
                <div className="px-6 border-b border-border">
                    <nav className="flex gap-4 -mb-px">
                        {tabs
                            .filter((tab) => tab.display !== false)
                            .map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'px-1 py-2.5 text-sm font-medium border-b-2 transition-colors',
                                        activeTab === tab.id
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                    )}
                                >
                                    {tab.title}
                                </button>
                            ))}
                    </nav>
                </div>
            )}

            {/* Sections */}
            <div className="p-6 space-y-6">
                {content.map((section) => (
                    <SettingsSection key={section.id} section={section} />
                ))}
            </div>
        </div>
    );
}

// ============================================
// Settings Section
// ============================================

function SettingsSection({ section }: { section: SettingsElementType }) {
    const { shouldDisplay } = useSettings();

    if (!shouldDisplay(section)) {
        return null;
    }

    const hasHeading = Boolean(section.title || section.description);

    return (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
            {hasHeading && (
                <div className="px-5 pt-5 pb-3 flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        {section.title && (
                            <h3 className="text-lg font-semibold text-foreground">
                                {section.title}
                            </h3>
                        )}
                        {section.description && (
                            <p className="text-sm text-muted-foreground">
                                {section.description}
                            </p>
                        )}
                    </div>
                    {section.doc_link && (
                        <a
                            href={section.doc_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground flex gap-1 items-center text-sm hover:text-foreground transition-colors shrink-0"
                        >
                            <FileText className="size-4" />
                            Doc
                        </a>
                    )}
                </div>
            )}

            <div className="divide-y divide-border">
                {section.children?.map((child) => (
                    <ElementRenderer key={child.id} element={child} />
                ))}
            </div>
        </div>
    );
}

// ============================================
// Element Renderer — dispatches by type
// ============================================

function ElementRenderer({ element }: { element: SettingsElementType }) {
    const { shouldDisplay } = useSettings();

    if (!shouldDisplay(element)) {
        return null;
    }

    switch (element.type) {
        case 'section':
        case 'subsection':
            return <SettingsSubSection element={element} />;

        case 'field':
            return <FieldRenderer element={element} />;

        case 'fieldgroup':
            return <SettingsFieldGroup element={element} />;

        default:
            return null;
    }
}

// ============================================
// Sub-Section
// ============================================

function SettingsSubSection({ element }: { element: SettingsElementType }) {
    const allChildrenAreFields = element.children?.every(
        (c) => c.type === 'field' || c.type === 'fieldgroup'
    );

    return (
        <div className={cn(!allChildrenAreFields && 'p-4')}>
            {(element.title || element.description) && (
                <div className="px-4 pt-3 pb-2">
                    {element.title && (
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                            {element.title}
                        </h4>
                    )}
                    {element.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {element.description}
                        </p>
                    )}
                </div>
            )}
            <div className={cn(allChildrenAreFields && 'divide-y divide-border')}>
                {element.children?.map((child) => (
                    <ElementRenderer key={child.id} element={child} />
                ))}
            </div>
        </div>
    );
}

// ============================================
// Field Group
// ============================================

function SettingsFieldGroup({ element }: { element: SettingsElementType }) {
    return (
        <div className="p-4">
            <div className="flex flex-wrap gap-4">
                {element.children?.map((child) => (
                    <FieldRenderer key={child.id} element={child} />
                ))}
            </div>
        </div>
    );
}
