import type { SettingsElement as SettingsElementType } from './settings-types';
import { useSettings } from './settings-context';
import { FieldRenderer } from './field-renderer';
import { cn } from '@/lib/utils';
import { FileText, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";
import { RawHTML } from "@wordpress/element";

// ============================================
// Settings Content — renders heading, tabs, sections
// ============================================

export function SettingsContent({ className }: { className?: string }) {
    const {
        activePage,
        activeSubpage,
        getActiveContentSource,
        getActiveTabs,
        getActiveContent,
        activeTab,
        setActiveTab,
        isPageDirty,
        getPageValues,
        onSave,
        renderSaveButton,
    } = useSettings();

    const contentSource = getActiveContentSource();
    const tabs = getActiveTabs();
    const content = getActiveContent();

    // Scope ID: subpage ID if a subpage is active, otherwise page ID
    const scopeId = activeSubpage || activePage;
    const dirty = isPageDirty(scopeId);

    const handleSave = () => {
        if (!onSave) return;
        const scopeValues = getPageValues(scopeId);
        onSave(scopeId, scopeValues);
    };

    // Determine whether to show a save area
    const showSaveArea = Boolean(onSave);

    if (!contentSource) {
        return (
            <div className={cn('flex-1 p-6', className)} />
        );
    }

    return (
        <div className={cn('flex flex-col overflow-y-auto', className)} data-testid="settings-content">
            <div className="flex-1">
                {/* Heading */}
                <div className="px-6 pt-6 pb-4" data-testid={`settings-heading-${contentSource.id}`}>
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            {(contentSource.label || contentSource.title) && (
                                <h2 className="text-2xl font-bold text-foreground leading-tight">
                                    {contentSource.label || contentSource.title}
                                </h2>
                            )}
                            {contentSource.description && (
                                <p className="text-sm text-muted-foreground">
                                    {contentSource.description}
                                </p>
                            )}
                        </div>
                        {contentSource.doc_link && (
                            <a
                                href={contentSource.doc_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground flex gap-1 items-center text-sm hover:text-foreground transition-colors shrink-0"
                            >
                                <FileText className="size-4" />
                                { contentSource.doc_link_text ?? '' }
                            </a>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                {tabs.length > 0 && (
                    <div className="px-6 border-b border-border" data-testid="settings-tabs">
                        <nav className="flex gap-4 -mb-px">
                            {tabs
                                .filter((tab) => tab.display !== false)
                                .map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        data-testid={`settings-tab-${tab.id}`}
                                        className={cn(
                                            'px-1 py-2.5 text-sm font-medium border-b-2 transition-colors',
                                            activeTab === tab.id
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                        )}
                                    >
                                        {tab.label || tab.title}
                                    </button>
                                ))}
                        </nav>
                    </div>
                )}

                {/* Content — sections, fields, fieldgroups, subsections */}
                <div className="p-6 space-y-6">
                    {content.map((item) => (
                        <ContentBlock key={item.id} element={item} />
                    ))}
                </div>
            </div>

            {/* Per-scope save button — sticky at the bottom */}
            {showSaveArea && (
                <div
                    className="sticky bottom-0 border-t border-border bg-background px-6 py-3 flex justify-end"
                    data-testid={`settings-save-${scopeId}`}
                >
                    {renderSaveButton
                        ? renderSaveButton({ scopeId, dirty, onSave: handleSave })
                        : null}
                </div>
            )}
        </div>
    );
}

// ============================================
// Content Block — dispatches top-level content by type
// ============================================

function ContentBlock({ element }: { element: SettingsElementType }) {
    const { shouldDisplay } = useSettings();

    if (!shouldDisplay(element)) {
        return null;
    }

    switch (element.type) {
        case 'section':
            return <SettingsSection section={element} />;

        case 'subsection':
            return (
                <div className="rounded-lg border border-border bg-card overflow-hidden" data-testid={`settings-subsection-${element.id}`}>
                    <SettingsSubSection element={element} />
                </div>
            );

        case 'field':
            // Direct field under a subpage (no section wrapper)
            // Wrap in a minimal card for consistent styling
            return (
                <div className="rounded-lg border border-border bg-card overflow-hidden" data-testid={`settings-field-block-${element.id}`}>
                    <FieldRenderer element={element} />
                </div>
            );

        case 'fieldgroup':
            return (
                <div className="rounded-lg border border-border bg-card overflow-hidden" data-testid={`settings-fieldgroup-${element.id}`}>
                    <SettingsFieldGroup element={element} />
                </div>
            );

        default:
            return null;
    }
}

// ============================================
// Settings Section
// ============================================

function SettingsSection({ section }: { section: SettingsElementType }) {
    const { shouldDisplay } = useSettings();

    if (!shouldDisplay(section)) {
        return null;
    }

    const sectionLabel = section.label || section.title || '';
    const hasHeading = Boolean(sectionLabel || section.description);
    const tooltip = section?.tooltip || '';

    return (
        <div className="rounded-lg border border-border bg-card overflow-hidden" data-testid={`settings-section-${section.id}`}>
            {hasHeading && (
                <div className={ cn( 'px-5 pt-5 pb-3 flex justify-between items-start', section?.children?.length > 0 && 'border-b border-border' ) }>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            {sectionLabel && (
                              <h3 className="text-lg font-semibold text-foreground">
                                  {sectionLabel}
                              </h3>
                            )}

                            {tooltip && (
                              <TooltipProvider>
                                  <Tooltip>
                                      <TooltipTrigger>
                                          <button type="button" className="inline-flex">
                                              <Info className="size-3.5 text-muted-foreground cursor-help" />
                                          </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <p className="max-w-xs text-xs">{tooltip}</p>
                                      </TooltipContent>
                                  </Tooltip>
                              </TooltipProvider>
                            )}
                        </div>

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
                            { section.doc_link_text ?? '' }
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

    const elementLabel = element.label || element.title || '';

    return (
        <div className={cn(!allChildrenAreFields && 'p-4')}>
            {(elementLabel || element.description) && (
                <div className="px-4 pt-3 pb-2">
                    {elementLabel && (
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                            {elementLabel}
                        </h4>
                    )}
                    {element.description && (
                        <div className="text-xs text-muted-foreground leading-relaxed">
                            <RawHTML>{element.description}</RawHTML>
                        </div>
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
      <div className="flex flex-wrap gap-4">
          {element.children?.map((child) => (
            <FieldRenderer key={child.id} element={child} />
          ))}
      </div>
    );
}
