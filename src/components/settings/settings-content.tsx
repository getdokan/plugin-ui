import { useEffect, useRef, useState } from 'react';
import type { SettingsElement as SettingsElementType } from './settings-types';
import { useSettings } from './settings-context';
import { FieldRenderer } from './field-renderer';
import { cn } from '@/lib/utils';
import { ChevronDown, FileText, Info } from "lucide-react";
import { ScrollArea, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { RawHTML } from "@wordpress/element";
import { DANGER_BORDER, DANGER_SURFACE, DANGER_TEXT } from "./fields";
import { SearchHiddenGroup } from './search-dependency-hint';
import { SEARCH_HIGHLIGHT_CSS, SEARCH_MATCH_ATTR } from './search-match-style';

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
        hasScopeErrors,
        getPageValues,
        save,
        renderSaveButton,
        searchQuery,
        setSearchQuery,
        searchIndex,
        showAllSearchFields,
        setShowAllSearchFields,
        isDirty,
    } = useSettings();

    const contentRef = useRef<HTMLDivElement>(null);

    // After "Show all", bring the first match back into view.
    useEffect(() => {
        if (!showAllSearchFields) return;
        const timer = window.setTimeout(() => {
            contentRef.current
                ?.querySelector(`[${SEARCH_MATCH_ATTR}]`)
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80);
        return () => window.clearTimeout(timer);
    }, [showAllSearchFields]);

    const contentSource = getActiveContentSource();
    const tabs = getActiveTabs();
    const content = getActiveContent();

    // Scope ID: subpage ID if a subpage is active, otherwise page ID
    const scopeId = activeSubpage || activePage;
    const dirty = isPageDirty(scopeId);
    const hasErrors = hasScopeErrors(scopeId);

    const handleSave = () => {
        if (!save || hasErrors) return;
        const scopeValues = getPageValues(scopeId);
        save(scopeId, scopeValues);
    };

    // Determine whether to show a save area
    // Hidden when the active page/subpage — or the currently-active tab — sets
    // hide_save: true. Tab-level hide_save lets a single tab under a shared
    // scope (e.g. an action-only tab) opt out without affecting siblings.
    const activeTabElement = tabs.find((t) => t.id === activeTab);
    const showSaveArea =
        Boolean(save) && !contentSource?.hide_save && !activeTabElement?.hide_save;

    if (!contentSource) {
        return (
            <div className={cn('flex-1 p-6', className)} />
        );
    }

    return (
        <ScrollArea className={cn('flex flex-col overflow-y-auto', className)} data-testid="settings-content">
            {searchIndex && <style>{SEARCH_HIGHLIGHT_CSS}</style>}
            <div className="flex-1" ref={contentRef}>
                {/* Heading */}
                {!contentSource.hide_heading && (
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
                )}

                {/* Tabs */}
                {tabs.length > 0 && (
                    <div className="px-6 border-b border-border" data-testid="settings-tabs">
                        <nav className="flex gap-4 -mb-px" role="tablist" aria-label="Settings sections">
                            {tabs
                                .filter((tab) => tab.display !== false)
                                .map((tab) => {
                                    const tabId = `settings-tab-${scopeId}-${tab.id}`;
                                    const isSelected = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            id={tabId}
                                            role="tab"
                                            aria-selected={isSelected}
                                            aria-controls={`settings-tabpanel-${scopeId}`}
                                            tabIndex={isSelected ? 0 : -1}
                                            onClick={() => setActiveTab(tab.id)}
                                            data-testid={`settings-tab-${tab.id}`}
                                            className={cn(
                                                'px-1 py-2.5 text-sm font-medium border-b-2 transition-colors',
                                                isSelected
                                                    ? 'border-primary text-primary'
                                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                            )}
                                        >
                                            {tab.label || tab.title}
                                            {searchIndex && (
                                                <span
                                                    className={cn(
                                                        'ml-1.5 inline-flex min-w-5 justify-center rounded-full px-1.5 text-xs',
                                                        (searchIndex.counts.get(tab.id) || 0) > 0
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'bg-muted text-muted-foreground'
                                                    )}
                                                    data-testid={`settings-tab-count-${tab.id}`}
                                                    aria-hidden="true"
                                                >
                                                    {searchIndex.counts.get(tab.id) || 0}
                                                </span>
                                            )}
                                            {searchIndex && (
                                                <span className="sr-only">
                                                    {(searchIndex.counts.get(tab.id) || 0) === 1
                                                        ? ', 1 match'
                                                        : `, ${searchIndex.counts.get(tab.id) || 0} matches`}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                        </nav>
                    </div>
                )}

                {/* Content — sections, fields, fieldgroups, subsections */}
                <div
                    id={tabs.length > 0 ? `settings-tabpanel-${scopeId}` : undefined}
                    role={tabs.length > 0 ? 'tabpanel' : undefined}
                    aria-labelledby={tabs.length > 0 ? `settings-tab-${scopeId}-${activeTab}` : undefined}
                    className="p-6 space-y-6"
                >
                    {searchIndex && (
                        <SearchResultsBar
                            query={searchQuery.trim()}
                            matches={searchIndex.counts.get(contentSource.id) || 0}
                            total={searchIndex.totals.get(contentSource.id) || 0}
                            elsewhere={searchIndex.totalHits - (searchIndex.counts.get(contentSource.id) || 0)}
                            showAll={showAllSearchFields}
                            dirty={isDirty}
                            onToggleShowAll={() => setShowAllSearchFields(!showAllSearchFields)}
                            onClear={() => setSearchQuery('')}
                        />
                    )}
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
                    ? renderSaveButton({ scopeId, dirty, hasErrors, onSave: handleSave })
                    : (
                      <Button
                        onClick={handleSave}
                        disabled={!dirty || hasErrors}
                      >
                        Save Changes
                      </Button>
                    )}
              </div>
            )}

        </ScrollArea>
    );
}

// ============================================
// Content Block — dispatches top-level content by type
// ============================================

function ContentBlock({ element }: { element: SettingsElementType }) {
    const { shouldDisplay, isSearchVisible, isSearchHiddenHit, isSearchHiddenGroup } = useSettings();

    if (!isSearchVisible(element)) {
        return null;
    }
    if (isSearchHiddenGroup(element)) {
        return (
            <div className="rounded-sm border border-border bg-card overflow-hidden">
                <SearchHiddenGroup element={element} />
            </div>
        );
    }
    if (!shouldDisplay(element) && !isSearchHiddenHit(element)) {
        return null;
    }

    switch (element.type) {
        case 'section':
            return <SettingsSection section={element} />;

        case 'subsection':
            return (
                <div className="rounded-sm border border-border bg-card overflow-hidden" data-testid={`settings-subsection-${element.id}`}>
                    <SettingsSubSection element={element} />
                </div>
            );

        case 'field':
            // Direct field under a page (no section wrapper).
            // Fields with no_wrap skip the card — e.g. the license variant
            // which brings its own full-width card UI.
            if (element.no_wrap) {
                return <FieldRenderer element={element} />;
            }
            return (
                <div className="rounded-sm border border-border bg-card overflow-hidden" data-testid={`settings-field-block-${element.id}`}>
                    <FieldRenderer element={element} />
                </div>
            );

        case 'fieldgroup':
            return (
                <div className="rounded-sm border border-border bg-card overflow-hidden" data-testid={`settings-fieldgroup-${element.id}`}>
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
    const { shouldDisplay, isSearchVisible, isSearchHiddenGroup, searchIndex } = useSettings();
    const collapsible = section.collapsible === true;
    const [open, setOpen] = useState(!section.collapsed);

    if (!isSearchVisible(section)) {
        return null;
    }
    if (isSearchHiddenGroup(section)) {
        return (
            <div className="rounded-sm border border-border bg-card overflow-hidden">
                <SearchHiddenGroup element={section} />
            </div>
        );
    }
    if (!shouldDisplay(section)) {
        return null;
    }

    const sectionLabel = section.label || section.title || '';
    const hasHeading = Boolean(sectionLabel || section.description);
    const tooltip = section?.tooltip || '';
    const hasChildren = (section.children?.length ?? 0) > 0;
    const contentId = `settings-section-content-${section.id}`;
    // Search results are never tucked inside a collapsed section.
    const bodyVisible = !collapsible || open || Boolean(searchIndex?.visible.has(section.id));

    const toggle = () => setOpen((o) => !o);
    const onHeadingKeyDown = (e: React.KeyboardEvent) => {
        if (!collapsible) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
        }
    };

    // Always a <div> so nested interactive children (doc links, tooltip triggers,
    // field controls) keep their native behavior — a <button> would invalidate
    // them. When collapsible, we add role="button" + keyboard handlers for a11y.
    const HeadingTag: keyof JSX.IntrinsicElements = 'div';

    return (
        <div className={ cn( 'rounded-sm border overflow-hidden', section.is_danger ? `${DANGER_SURFACE} ${DANGER_BORDER}` : 'border-border bg-card' ) } data-testid={`settings-section-${section.id}`}>
            {hasHeading && (
                <HeadingTag
                    {...(collapsible
                        ? {
                              role: 'button' as const,
                              tabIndex: 0,
                              onClick: toggle,
                              onKeyDown: onHeadingKeyDown,
                              'aria-expanded': bodyVisible,
                              'aria-controls': contentId,
                          }
                        : {})}
                    className={ cn(
                        'px-5 pt-5 pb-3 flex justify-between items-start w-full text-left',
                        hasChildren && bodyVisible && 'border-b border-border',
                        collapsible && 'cursor-pointer select-none hover:bg-muted/30 transition-colors'
                    ) }
                >
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            {sectionLabel && (
                              <h3 className={ cn( 'text-lg font-semibold', section.is_danger ? DANGER_TEXT : 'text-foreground' ) }>
                                  {sectionLabel}
                              </h3>
                            )}

                            {tooltip && (
                              <TooltipProvider>
                                  <Tooltip>
                                      <TooltipTrigger>
                                          <span
                                              className="inline-flex"
                                              onClick={(e) => e.stopPropagation()}
                                          >
                                              <Info className="size-3.5 text-muted-foreground cursor-help" />
                                          </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <p className="max-w-xs text-xs">{tooltip}</p>
                                      </TooltipContent>
                                  </Tooltip>
                              </TooltipProvider>
                            )}
                        </div>

                        {section.description && (
                            <p className={ cn( 'text-sm', section.is_danger ? DANGER_TEXT : 'text-muted-foreground' ) }>
                                {section.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 self-center">
                        {section.doc_link && (
                            <a
                                href={section.doc_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground flex gap-1 items-center text-sm hover:text-foreground transition-colors"
                            >
                                <FileText className="size-4" />
                                { section.doc_link_text ?? '' }
                            </a>
                        )}
                        {collapsible && (
                            <ChevronDown
                                className={ cn(
                                    'size-5 text-muted-foreground transition-transform duration-200',
                                    bodyVisible && 'rotate-180'
                                ) }
                            />
                        )}
                    </div>
                </HeadingTag>
            )}

            {hasChildren && bodyVisible && (
                <div id={contentId} className="divide-y divide-border">
                    {section.children?.map((child) => (
                        <ElementRenderer key={child.id} element={child} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================
// Element Renderer — dispatches by type
// ============================================

function ElementRenderer({ element, isNested, isGroupParent }: { element: SettingsElementType, isNested?: boolean, isGroupParent?: boolean }) {
    const { shouldDisplay, isSearchVisible, isSearchHiddenHit, isSearchHiddenGroup } = useSettings();

    if (!isSearchVisible(element)) {
        return null;
    }
    if (isSearchHiddenGroup(element)) {
        return <SearchHiddenGroup element={element} />;
    }
    if (!shouldDisplay(element) && !isSearchHiddenHit(element)) {
        return null;
    }

    switch (element.type) {
        case 'section':
        case 'subsection':
            return <SettingsSubSection element={element} isNested={isNested} isGroupParent={isGroupParent} />;

        case 'field':
            return <FieldRenderer element={element} isNested={isNested} isGroupParent={isGroupParent} />;

        case 'fieldgroup':
            return <SettingsFieldGroup element={element} isNested={isNested} isGroupParent={isGroupParent} />;

        default:
            return null;
    }
}

// ============================================
// Sub-Section
// ============================================

function SettingsSubSection({ element, isNested, isGroupParent }: { element: SettingsElementType, isNested?: boolean, isGroupParent?: boolean }) {
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
                {element.children?.map((child, index) => (
                    <ElementRenderer
                        key={child.id}
                        element={child}
                        isNested={isNested}
                        isGroupParent={isGroupParent && index === (element.children?.length ?? 0) - 1}
                    />
                ))}
            </div>
        </div>
    );
}

// ============================================
// Field Group
// ============================================

function SettingsFieldGroup({ element, isNested, isGroupParent }: { element: SettingsElementType, isNested?: boolean, isGroupParent?: boolean }) {
    return (
      <div className="flex flex-col w-full divide-y divide-border">
          {element.children?.map((child) => (
            <FieldRenderer key={child.id} element={child} isNested={isNested} isGroupParent={isGroupParent} />
          ))}
      </div>
    );
}

// ============================================
// Search Results Bar
// ============================================

function SearchResultsBar({
    query,
    matches,
    total,
    elsewhere,
    showAll,
    dirty,
    onToggleShowAll,
    onClear,
}: {
    query: string;
    matches: number;
    total: number;
    elsewhere: number;
    showAll: boolean;
    dirty: boolean;
    onToggleShowAll: () => void;
    onClear: () => void;
}) {
    let message: string;
    if (matches === 0) {
        message = elsewhere > 0
            ? `No settings on this page match “${query}”. ${dirty ? 'Save your changes, then pick' : 'Pick'} a page from the menu to see the ${elsewhere === 1 ? 'match' : `${elsewhere} matches`}.`
            : `No settings match “${query}”. Try a different word.`;
    } else if (showAll) {
        message = `Showing all ${total} settings. Matches for “${query}” are highlighted.`;
    } else {
        message = `Showing ${matches} of ${total} ${total === 1 ? 'setting' : 'settings'} matching “${query}”.`;
    }

    const linkClass = 'font-medium text-primary hover:underline cursor-pointer bg-transparent border-0 p-0';

    return (
        <div
            className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground"
            role="status"
            data-testid="settings-search-results-bar"
        >
            <span>{message}</span>
            <span className="flex items-center gap-3">
                {(matches > 0 || showAll) && (
                    <button type="button" className={linkClass} onClick={onToggleShowAll} data-testid="settings-search-show-all">
                        {showAll ? 'Show matches only' : 'Show all settings'}
                    </button>
                )}
                {matches === 0 && !showAll && total > 0 && (
                    <button type="button" className={linkClass} onClick={onToggleShowAll} data-testid="settings-search-show-all">
                        Show this page
                    </button>
                )}
                <button type="button" className={linkClass} onClick={onClear} data-testid="settings-search-clear">
                    Clear search
                </button>
            </span>
        </div>
    );
}
