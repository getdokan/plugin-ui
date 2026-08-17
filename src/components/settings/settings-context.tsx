/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import type { SaveButtonRenderProps, SettingsElement } from './settings-types';
import {
    buildIdIndex,
    evaluateDependencies,
    extractValues,
    formatSettingsData,
    validateField,
} from './settings-formatter';

// ============================================
// Context Value
// ============================================

/** Filter function signature compatible with @wordpress/hooks applyFilters */
export type ApplyFiltersFunction = (hookName: string, value: any, ...args: any[]) => any;

/** A sidebar navigation held back by the unsaved-changes guard. */
export type PendingNavigation = { type: 'page' | 'subpage'; id: string };

export interface SettingsContextValue {
    /** Parsed hierarchical settings tree */
    schema: SettingsElement[];
    /** Flat map of field values keyed by element id */
    values: Record<string, any>;
    /** Validation errors keyed by element id */
    errors: Record<string, string>;
    /** Currently active page ID */
    activePage: string;
    /** Currently active subpage ID */
    activeSubpage: string;
    /** Currently active tab ID (if subpage has tab children) */
    activeTab: string;
    /** Whether the component is in a loading state */
    loading: boolean;
    /** Prefix for WordPress filter hook names */
    hookPrefix: string;
    /** Filter function for extensibility (e.g. @wordpress/hooks applyFilters) */
    applyFilters: ApplyFiltersFunction;
    /** Update a single field value */
    updateValue: (key: string, value: any) => void;
    /** Navigate to a page */
    setActivePage: (pageId: string) => void;
    /** Navigate to a subpage */
    setActiveSubpage: (subpageId: string) => void;
    /** Set active tab */
    setActiveTab: (tabId: string) => void;
    /** Check if a field should be displayed (evaluates dependencies) */
    shouldDisplay: (element: SettingsElement) => boolean;
    /** Get the currently active page element */
    getActivePage: () => SettingsElement | undefined;
    /** Get the currently active subpage element */
    getActiveSubpage: () => SettingsElement | undefined;
    /** Get the active content source element (subpage, or page when no subpages exist) */
    getActiveContentSource: () => SettingsElement | undefined;
    /** Get the active tab's children (sections) or the active content source's children */
    getActiveContent: () => SettingsElement[];
    /** Get tabs for the active content source (if any) */
    getActiveTabs: () => SettingsElement[];
    /** Whether the sidebar should be visible (false when there's only one navigable item) */
    isSidebarVisible: boolean;
    /** Check if any field on a specific page has been modified */
    isPageDirty: (pageId: string) => boolean;
    /** True when any tracked field anywhere in the schema differs from its last-saved value */
    isDirty: boolean;
    /**
     * Sidebar navigation the unsaved-changes guard is holding back, or null when
     * nothing is pending. The Settings root renders its confirm dialog off this.
     */
    pendingNavigation: PendingNavigation | null;
    /**
     * Discard unsaved changes and perform the held navigation. Pass the target
     * explicitly when the caller has it — a closing dialog clears the pending
     * state before its action handler runs.
     */
    confirmNavigation: (target?: PendingNavigation) => void;
    /** Drop the held navigation and stay on the current page */
    cancelNavigation: () => void;
    /** Check if any field on a specific page has a validation error */
    hasScopeErrors: (scopeId: string) => boolean;
    /** Get only the values that belong to a specific page */
    getPageValues: (pageId: string) => Record<string, any>;
    /** Trigger a save for the given scope. Builds treeValues from flat pageValues, then calls the consumer's onSave(scopeId, treeValues, flatValues). */
    save?: (scopeId: string, pageValues: Record<string, any>) => void | Promise<void>;
    /** Consumer-provided render function for the save button */
    renderSaveButton?: (props: SaveButtonRenderProps) => React.ReactNode;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

// ============================================
// Provider
// ============================================

/** Default identity function when no applyFilters is provided */
const defaultApplyFilters: ApplyFiltersFunction = (_hookName: string, value: any) => value;

export interface SettingsProviderProps {
    children: ReactNode;
    schema: SettingsElement[];
    values?: Record<string, any>;
    onChange?: (scopeId: string, key: string, value: any) => void;
    onSave?: (scopeId: string, treeValues: Record<string, any>, flatValues: Record<string, any>) => void | Promise<void>;
    renderSaveButton?: (props: SaveButtonRenderProps) => React.ReactNode;
    loading?: boolean;
    hookPrefix?: string;
    /** Optional filter function for extensibility (e.g. @wordpress/hooks applyFilters) */
    applyFilters?: ApplyFiltersFunction;
    /** Page ID to activate on mount (e.g. read from a URL query param). Falls back to the first page. */
    initialPage?: string;
    /** Called whenever the active page changes. Use to sync a URL query param. */
    onNavigate?: (pageId: string) => void;
    /**
     * Called whenever the dirty state flips. Consumers use this to guard their own
     * router (e.g. React Router's `useBlocker`), which this component can't see.
     */
    onDirtyChange?: (dirty: boolean) => void;
    /**
     * Called when unsaved changes are discarded (the user chose to leave anyway).
     * Controlled consumers — those passing `values` — must reset their own state
     * here, since their values take precedence over this provider's.
     */
    onDiscardChanges?: () => void;
    /**
     * Hold back sidebar navigation and warn on browser unload while there are
     * unsaved changes. Default: true.
     */
    confirmOnLeave?: boolean;
}

export function SettingsProvider({
    children,
    schema: rawSchema,
    values: externalValues,
    onChange,
    onSave,
    renderSaveButton,
    loading = false,
    hookPrefix = 'plugin_ui',
    applyFilters: applyFiltersProp,
    initialPage,
    onNavigate,
    onDirtyChange,
    onDiscardChanges,
    confirmOnLeave = true,
}: SettingsProviderProps) {
    // Format schema (handles both flat and hierarchical)
    const schema = useMemo(() => formatSettingsData(rawSchema), [rawSchema]);

    const filterFn = applyFiltersProp || defaultApplyFilters;

    // Merge external values with defaults extracted from schema
    const defaultValues = useMemo(() => extractValues(schema), [schema]);

    // Compute initial merged values synchronously to avoid isDirty flash
    const computeInitialMerged = () => ({ ...defaultValues, ...(externalValues || {}) });

    const [internalValues, setInternalValues] = useState<Record<string, any>>(computeInitialMerged);
    const [initialValues, setInitialValues] = useState<Record<string, any>>(computeInitialMerged);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Navigation state
    const [activePage, setActivePage] = useState<string>('');
    const [activeSubpage, setActiveSubpage] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('');

    // Build a memoized map of scopeId → [element ids...] for per-subpage dirty tracking.
    // The scope ID is the subpage ID when a subpage exists, otherwise the page ID itself.
    const scopeFieldKeysMap = useMemo(() => {
        const map = new Map<string, string[]>();
        const collectKeys = (elements: SettingsElement[]): string[] => {
            const keys: string[] = [];
            for (const el of elements) {
                if (el.type === 'field' && el.id) {
                    keys.push(el.id);
                }
                if (el.children?.length) {
                    keys.push(...collectKeys(el.children));
                }
            }
            return keys;
        };
        const walkSubpages = (elements: SettingsElement[]) => {
            for (const el of elements) {
                if (el.type === 'subpage') {
                    map.set(el.id, collectKeys(el.children || []));
                }
                // Recurse to find nested subpages
                if (el.children?.length) {
                    walkSubpages(el.children);
                }
            }
        };
        for (const page of schema) {
            const hasSubpages = page.children?.some((c) => c.type === 'subpage');
            if (hasSubpages) {
                walkSubpages(page.children || []);
            } else {
                // No subpages — scope to page itself
                map.set(page.id, collectKeys(page.children || []));
            }
        }
        return map;
    }, [schema]);

    // Reverse lookup: element id → scopeId (subpage ID or page ID)
    const keyToScopeMap = useMemo(() => {
        const map = new Map<string, string>();
        for (const [scopeId, keys] of scopeFieldKeysMap.entries()) {
            for (const key of keys) {
                map.set(key, scopeId);
            }
        }
        return map;
    }, [scopeFieldKeysMap]);

    // Track previous loading state to detect when loading finishes.
    const [prevLoading, setPrevLoading] = useState(loading);

    // Sync internal values when external values change.
    // NOTE: Do NOT reset initialValues on every change — that would break dirty tracking,
    // because the consumer typically updates externalValues in their onChange handler
    // (controlled component pattern). However, when loading transitions from true→false,
    // we re-snapshot initialValues so dirty tracking compares against the real saved data
    // (not just schema defaults captured at mount time before async data arrived).
    useEffect(() => {
        const merged = { ...defaultValues, ...(externalValues || {}) };
        setInternalValues(merged);

        if (prevLoading && !loading) {
            setInitialValues(merged);
        }
        setPrevLoading(loading);
    }, [defaultValues, externalValues, loading, prevLoading]);

    // Auto-select page/subpage on schema load.
    // Prefers initialPage (e.g. from a URL query param) over the first page.
    useEffect(() => {
        if (schema.length > 0 && !activePage) {
            const targetPage = (initialPage && schema.find((p) => p.id === initialPage)) || schema[0];
            setActivePage(targetPage.id);

            const firstSubpage = targetPage.children?.find((c) => c.type === 'subpage');
            if (firstSubpage) {
                setActiveSubpage(firstSubpage.id);
                const firstTab = firstSubpage.children?.find((c) => c.type === 'tab');
                if (firstTab) setActiveTab(firstTab.id);
            } else {
                setActiveSubpage('');
                const firstTab = targetPage.children?.find((c) => c.type === 'tab');
                setActiveTab(firstTab?.id || '');
            }
        }
    }, [schema]); // eslint-disable-line react-hooks/exhaustive-deps

    // Merged values: external values take precedence, then internal, then defaults
    const values = useMemo(
        () => ({ ...defaultValues, ...internalValues, ...(externalValues || {}) }),
        [defaultValues, internalValues, externalValues]
    );

    // Per-scope (subpage or page) dirty check
    const isPageDirty = useCallback(
        (scopeId: string): boolean => {
            const keys = scopeFieldKeysMap.get(scopeId);
            if (!keys) return false;
            return keys.some((key) => values[key] !== initialValues[key]);
        },
        [scopeFieldKeysMap, values, initialValues]
    );

    // Dirty across every scope, not just the visible one — the sidebar can leave a
    // modified page behind, and a consumer's router guard needs the whole picture.
    const isDirty = useMemo(
        () =>
            Array.from(scopeFieldKeysMap.values()).some((keys) =>
                keys.some((key) => values[key] !== initialValues[key])
            ),
        [scopeFieldKeysMap, values, initialValues]
    );

    // Report dirtiness outward so consumers can block their own navigation.
    useEffect(() => {
        onDirtyChange?.(isDirty);
    }, [isDirty, onDirtyChange]);

    // Browser-level exits (tab close, reload, WordPress admin menu links) can only
    // be intercepted through beforeunload, and the browser owns the wording.
    useEffect(() => {
        if (!confirmOnLeave || !isDirty) return;

        const handler = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            // Legacy browsers need returnValue set to show their prompt.
            event.returnValue = '';
            return '';
        };

        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [confirmOnLeave, isDirty]);

    // Per-scope error check
    const hasScopeErrors = useCallback(
        (scopeId: string): boolean => {
            const keys = scopeFieldKeysMap.get(scopeId);
            if (!keys) return false;
            return keys.some((key) => key in errors);
        },
        [scopeFieldKeysMap, errors]
    );

    // Per-scope values extraction
    const getPageValues = useCallback(
        (scopeId: string): Record<string, any> => {
            const keys = scopeFieldKeysMap.get(scopeId);
            if (!keys) return {};
            const scopeValues: Record<string, any> = {};
            for (const key of keys) {
                if (key in values) {
                    scopeValues[key] = values[key];
                }
            }
            return scopeValues;
        },
        [scopeFieldKeysMap, values]
    );

    // Reset per-scope dirty state after save
    const resetPageDirty = useCallback(
        (scopeId: string) => {
            const keys = scopeFieldKeysMap.get(scopeId);
            if (!keys) return;
            setInitialValues((prev) => {
                const next = { ...prev };
                for (const key of keys) {
                    if (key in values) {
                        next[key] = values[key];
                    }
                }
                return next;
            });
        },
        [scopeFieldKeysMap, values]
    );

    // Wrapped onSave that also resets dirty state for the page (only on success)
    const handleOnSave = useCallback(
        async (pageId: string, pageValues: Record<string, any>) => {
            if (!onSave) return;
            // Build nested tree from dot-separated keys
            const treeValues: Record<string, any> = {};
            for (const [dotKey, val] of Object.entries(pageValues)) {
                const parts = dotKey.split('.');
                let cursor: Record<string, any> = treeValues;
                for (let i = 0; i < parts.length - 1; i++) {
                    if (!(parts[i] in cursor) || typeof cursor[parts[i]] !== 'object') {
                        cursor[parts[i]] = {};
                    }
                    cursor = cursor[parts[i]];
                }
                cursor[parts[parts.length - 1]] = val;
            }
            try {
                await Promise.resolve(onSave(pageId, treeValues, pageValues));
                resetPageDirty(pageId);
            } catch (error: any) {
                console.error('[Settings] onSave error caught:', error);
                // If the error contains field-level errors (e.g. from a 400 response),
                // merge them into the errors state so they display on the relevant fields.
                // Error keys should match field element id values.
                if (error && typeof error === 'object' && error.errors && typeof error.errors === 'object') {
                    setErrors((prev) => ({ ...prev, ...error.errors }));
                }
            }
        },
        [onSave, resetPageDirty, setErrors]
    );

    // Update a field value
    const updateValue = useCallback(
        (key: string, value: any) => {
            // Compute the next values snapshot locally — used both for
            // setInternalValues and for cross-field validators (e.g. sum_max)
            // that need to see the post-update value of the sibling.
            const nextValues: Record<string, any> = { ...values, [key]: value };
            setInternalValues((prev) => ({ ...prev, [key]: value }));

            // Find the element to validate
            const findElement = (elements: SettingsElement[]): SettingsElement | undefined => {
                for (const el of elements) {
                    if (el.id === key) return el;
                    if (el.children) {
                        const found = findElement(el.children);
                        if (found) return found;
                    }
                }
                return undefined;
            };

            // Walk the flat tree and collect every field whose validations
            // reference the just-changed key via a cross-field rule. We
            // re-validate these so a sibling's error clears when this field
            // moves into a passing state.
            //
            // A rule references `key` when params.field === key OR `key`
            // appears in params.fields (multi-sibling form).
            const findCrossLinked = (elements: SettingsElement[], out: SettingsElement[] = []): SettingsElement[] => {
                for (const el of elements) {
                    if (el.id !== key && Array.isArray(el.validations)) {
                        for (const v of el.validations) {
                            const params = (v?.params as any) || {};
                            const linkedToKey =
                                String(params.field || '') === key ||
                                (Array.isArray(params.fields) &&
                                    params.fields.map(String).includes(key));
                            if (linkedToKey) {
                                out.push(el);
                                break;
                            }
                        }
                    }
                    if (el.children) findCrossLinked(el.children, out);
                }
                return out;
            };

            setErrors((prev) => {
                const next = { ...prev };

                const element = findElement(schema);
                if (element) {
                    const error = validateField(element, value, nextValues);
                    if (error) next[key] = error;
                    else delete next[key];
                }

                for (const linked of findCrossLinked(schema)) {
                    const linkedValue = nextValues[linked.id];
                    const linkedError = validateField(linked, linkedValue, nextValues);
                    if (linkedError) next[linked.id] = linkedError;
                    else delete next[linked.id];
                }

                return next;
            });

            // Pass scopeId (subpage ID if exists, otherwise page ID) along with key and value
            const scopeId = keyToScopeMap.get(key) || activeSubpage || activePage;
            onChange?.(scopeId, key, value);
        },
        [schema, values, onChange, keyToScopeMap, activeSubpage, activePage]
    );

    // Dependency evaluation — dep keys are plain field ids, read directly
    // from the flat values map. `idIndex` kept around (memoized cheaply) so
    // call sites that still pass it remain compatible; the resolver no
    // longer uses it.
    const idIndex = useMemo(() => buildIdIndex(schema), [schema]);
    const shouldDisplay = useCallback(
        (element: SettingsElement): boolean => {
            return evaluateDependencies(element, values, idIndex);
        },
        [values, idIndex]
    );

    // Navigation helpers — these move immediately. The guarded wrappers further
    // down are what the sidebar actually calls.
    const navigateToPage = useCallback(
        (pageId: string) => {
            setActivePage(pageId);
            onNavigate?.(pageId);
            const page = schema.find((p) => p.id === pageId);
            if (page?.children?.length) {
                const firstSubpage = page.children.find((c) => c.type === 'subpage');
                if (firstSubpage) {
                    setActiveSubpage(firstSubpage.id);
                    const firstTab = firstSubpage.children?.find((c) => c.type === 'tab');
                    setActiveTab(firstTab?.id || '');
                } else {
                    // Page without subpages — check for direct tabs
                    setActiveSubpage('');
                    const firstTab = page.children.find((c) => c.type === 'tab');
                    setActiveTab(firstTab?.id || '');
                }
            }
        },
        [schema, onNavigate]
    );

    const navigateToSubpage = useCallback(
        (subpageId: string) => {
            setActiveSubpage(subpageId);

            // Recursively find the subpage and its parent page
            const findSubpageInPage = (
                elements: SettingsElement[],
            ): SettingsElement | undefined => {
                for (const el of elements) {
                    if (el.id === subpageId && el.type === 'subpage') return el;
                    if (el.children) {
                        const found = findSubpageInPage(el.children);
                        if (found) return found;
                    }
                }
                return undefined;
            };

            for (const page of schema) {
                const subpage = findSubpageInPage(page.children || []);
                if (subpage) {
                    if (activePage !== page.id) {
                        setActivePage(page.id);
                    }
                    const firstTab = subpage.children?.find((c) => c.type === 'tab');
                    setActiveTab(firstTab?.id || '');
                    break;
                }
            }
        },
        [schema, activePage]
    );

    // ── Unsaved-changes guard ──
    //
    // The sidebar calls the handlers below. While the form is dirty they park the
    // request in `pendingNavigation` instead of moving, and the Settings root
    // renders a confirm dialog off that state. Confirming discards the edits and
    // completes the navigation; cancelling drops the request.
    const [pendingNavigation, setPendingNavigation] = useState<PendingNavigation | null>(null);
    const pendingNavigationRef = useRef<PendingNavigation | null>(null);

    const runNavigation = useCallback(
        (target: PendingNavigation) => {
            if (target.type === 'page') {
                navigateToPage(target.id);
            } else {
                navigateToSubpage(target.id);
            }
        },
        [navigateToPage, navigateToSubpage]
    );

    const guardNavigation = useCallback(
        (target: PendingNavigation) => {
            if (confirmOnLeave && isDirty) {
                pendingNavigationRef.current = target;
                setPendingNavigation(target);
                return;
            }
            runNavigation(target);
        },
        [confirmOnLeave, isDirty, runNavigation]
    );

    const handleSetActivePage = useCallback(
        (pageId: string) => guardNavigation({ type: 'page', id: pageId }),
        [guardNavigation]
    );

    const handleSetActiveSubpage = useCallback(
        (subpageId: string) => guardNavigation({ type: 'subpage', id: subpageId }),
        [guardNavigation]
    );

    // Roll every tracked field back to its last-saved value and drop the errors
    // those edits produced. Only the values this provider owns can be reset; a
    // consumer passing `values` keeps precedence, which is what `onDiscardChanges`
    // is for — mirror the reset in your own state.
    const discardChanges = useCallback(() => {
        setInternalValues(initialValues);
        setErrors({});
        onDiscardChanges?.();
    }, [initialValues, onDiscardChanges]);

    // Takes the target explicitly because the dialog's own dismissal fires
    // `onOpenChange` — and therefore `cancelNavigation` — before the action
    // button's `onClick`, so by then the state is already cleared. The dialog
    // passes the target it captured when it rendered; the ref is the fallback
    // for any caller that has none.
    const confirmNavigation = useCallback(
        (target?: PendingNavigation) => {
            const destination = target ?? pendingNavigationRef.current;
            if (!destination) return;
            pendingNavigationRef.current = null;
            setPendingNavigation(null);
            discardChanges();
            runNavigation(destination);
        },
        [discardChanges, runNavigation]
    );

    const cancelNavigation = useCallback(() => {
        pendingNavigationRef.current = null;
        setPendingNavigation(null);
    }, []);

    const getActivePage = useCallback(
        () => schema.find((p) => p.id === activePage),
        [schema, activePage]
    );

    const getActiveSubpage = useCallback(() => {
        // Recursively search for the active subpage in the page tree
        const findSubpage = (elements: SettingsElement[]): SettingsElement | undefined => {
            for (const el of elements) {
                if (el.id === activeSubpage && el.type === 'subpage') return el;
                if (el.children) {
                    const found = findSubpage(el.children);
                    if (found) return found;
                }
            }
            return undefined;
        };

        const page = getActivePage();
        if (!page?.children) return undefined;
        return findSubpage(page.children);
    }, [getActivePage, activeSubpage]);

    // The "content source" is the subpage when one is active,
    // or the page itself when it has no subpages.
    const getActiveContentSource = useCallback((): SettingsElement | undefined => {
        const subpage = getActiveSubpage();
        if (subpage) return subpage;

        // No subpage — check if the active page has no subpages (direct content)
        const page = getActivePage();
        if (!page) return undefined;
        const hasSubpages = page.children?.some((c) => c.type === 'subpage');
        return hasSubpages ? undefined : page;
    }, [getActiveSubpage, getActivePage]);

    const getActiveTabs = useCallback(() => {
        const source = getActiveContentSource();
        if (!source?.children) return [];
        return source.children.filter((c) => c.type === 'tab');
    }, [getActiveContentSource]);

    const getActiveContent = useCallback(() => {
        const source = getActiveContentSource();
        if (!source?.children) return [];

        const tabs = source.children.filter((c) => c.type === 'tab');
        if (tabs.length > 0 && activeTab) {
            const tab = tabs.find((t) => t.id === activeTab);
            return tab?.children || [];
        }

        // No tabs — return non-structural children
        return source.children.filter((c) => c.type !== 'tab' && c.type !== 'subpage');
    }, [getActiveContentSource, activeTab]);

    // Sidebar visibility: count navigable leaf items. Hidden when <= 1.
    const isSidebarVisible = useMemo(() => {
        let count = 0;
        const countLeafSubpages = (items: SettingsElement[]): void => {
            for (const item of items) {
                if (item.display === false) continue;
                if (item.type !== 'subpage') continue;
                const nested = (item.children || []).filter(
                    (c) => c.type === 'subpage' && c.display !== false
                );
                if (nested.length > 0) {
                    countLeafSubpages(nested);
                } else {
                    count++;
                }
            }
        };
        for (const page of schema) {
            if (page.display === false) continue;
            const subpages = (page.children || []).filter(
                (c) => c.type === 'subpage' && c.display !== false
            );
            if (subpages.length > 0) {
                countLeafSubpages(subpages);
            } else {
                count++; // page without subpages counts as one navigable item
            }
        }
        return count > 1;
    }, [schema]);

    const contextValue: SettingsContextValue = useMemo(
        () => ({
            schema,
            values,
            errors,
            activePage,
            activeSubpage,
            activeTab,
            loading,
            hookPrefix,
            applyFilters: filterFn,
            updateValue,
            setActivePage: handleSetActivePage,
            setActiveSubpage: handleSetActiveSubpage,
            setActiveTab,
            shouldDisplay,
            getActivePage,
            getActiveSubpage,
            getActiveContentSource,
            getActiveContent,
            getActiveTabs,
            isSidebarVisible,
            isPageDirty,
            isDirty,
            pendingNavigation,
            confirmNavigation,
            cancelNavigation,
            hasScopeErrors,
            getPageValues,
            save: handleOnSave,
            renderSaveButton,
        }),
        [
            schema,
            values,
            errors,
            activePage,
            activeSubpage,
            activeTab,
            loading,
            hookPrefix,
            filterFn,
            updateValue,
            handleSetActivePage,
            handleSetActiveSubpage,
            shouldDisplay,
            getActivePage,
            getActiveSubpage,
            getActiveContentSource,
            getActiveContent,
            getActiveTabs,
            isSidebarVisible,
            isPageDirty,
            isDirty,
            pendingNavigation,
            confirmNavigation,
            cancelNavigation,
            hasScopeErrors,
            getPageValues,
            handleOnSave,
            renderSaveButton,
        ]
    );

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    );
}

// ============================================
// Hook
// ============================================

export function useSettings(): SettingsContextValue {
    const ctx = useContext(SettingsContext);
    if (!ctx) {
        throw new Error('useSettings must be used within a <Settings> component.');
    }
    return ctx;
}
