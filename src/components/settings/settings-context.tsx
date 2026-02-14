import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import type { SettingsElement } from './settings-types';
import {
    evaluateDependencies,
    extractValues,
    formatSettingsData,
    validateField,
} from './settings-formatter';

// ============================================
// Context Value
// ============================================

export interface SettingsContextValue {
    /** Parsed hierarchical settings tree */
    schema: SettingsElement[];
    /** Flat map of field values keyed by dependency_key */
    values: Record<string, any>;
    /** Validation errors keyed by dependency_key */
    errors: Record<string, string>;
    /** Currently active page ID */
    activePage: string;
    /** Currently active subpage ID */
    activeSubpage: string;
    /** Currently active tab ID (if subpage has tab children) */
    activeTab: string;
    /** Whether any value has changed since initialization */
    isDirty: boolean;
    /** Whether the component is in a loading state */
    loading: boolean;
    /** Prefix for WordPress filter hook names */
    hookPrefix: string;
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
    /** Get the active tab's children (sections) or the active subpage's children */
    getActiveContent: () => SettingsElement[];
    /** Get tabs for the active subpage (if any) */
    getActiveTabs: () => SettingsElement[];
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

// ============================================
// Provider
// ============================================

export interface SettingsProviderProps {
    children: ReactNode;
    schema: SettingsElement[];
    values?: Record<string, any>;
    onChange?: (key: string, value: any) => void;
    loading?: boolean;
    hookPrefix?: string;
}

export function SettingsProvider({
    children,
    schema: rawSchema,
    values: externalValues,
    onChange,
    loading = false,
    hookPrefix = 'plugin_ui',
}: SettingsProviderProps) {
    // Format schema (handles both flat and hierarchical)
    const schema = useMemo(() => formatSettingsData(rawSchema), [rawSchema]);

    // Merge external values with defaults extracted from schema
    const defaultValues = useMemo(() => extractValues(schema), [schema]);
    const [internalValues, setInternalValues] = useState<Record<string, any>>({});
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Navigation state
    const [activePage, setActivePage] = useState<string>('');
    const [activeSubpage, setActiveSubpage] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('');

    // Initialize values and navigation from schema
    useEffect(() => {
        const merged = { ...defaultValues, ...(externalValues || {}) };
        setInternalValues(merged);
        setInitialValues(merged);

        // Auto-select first page/subpage
        if (schema.length > 0 && !activePage) {
            const firstPage = schema[0];
            setActivePage(firstPage.id);

            const firstSubpage = firstPage.children?.find((c) => c.type === 'subpage');
            if (firstSubpage) {
                setActiveSubpage(firstSubpage.id);

                const firstTab = firstSubpage.children?.find((c) => c.type === 'tab');
                if (firstTab) {
                    setActiveTab(firstTab.id);
                }
            }
        }
    }, [schema, externalValues]); // eslint-disable-line react-hooks/exhaustive-deps

    // Merged values: external values take precedence, then internal, then defaults
    const values = useMemo(
        () => ({ ...defaultValues, ...internalValues, ...(externalValues || {}) }),
        [defaultValues, internalValues, externalValues]
    );

    const isDirty = useMemo(() => {
        return Object.keys(values).some((key) => values[key] !== initialValues[key]);
    }, [values, initialValues]);

    // Update a field value
    const updateValue = useCallback(
        (key: string, value: any) => {
            setInternalValues((prev) => ({ ...prev, [key]: value }));

            // Find the element to validate
            const findElement = (elements: SettingsElement[]): SettingsElement | undefined => {
                for (const el of elements) {
                    if (el.dependency_key === key) return el;
                    if (el.children) {
                        const found = findElement(el.children);
                        if (found) return found;
                    }
                }
                return undefined;
            };

            const element = findElement(schema);
            if (element) {
                const error = validateField(element, value);
                setErrors((prev) => {
                    const next = { ...prev };
                    if (error) {
                        next[key] = error;
                    } else {
                        delete next[key];
                    }
                    return next;
                });
            }

            onChange?.(key, value);
        },
        [schema, onChange]
    );

    // Dependency evaluation
    const shouldDisplay = useCallback(
        (element: SettingsElement): boolean => {
            return evaluateDependencies(element, values);
        },
        [values]
    );

    // Navigation helpers
    const handleSetActivePage = useCallback(
        (pageId: string) => {
            setActivePage(pageId);
            const page = schema.find((p) => p.id === pageId);
            if (page?.children?.length) {
                const firstSubpage = page.children.find((c) => c.type === 'subpage');
                if (firstSubpage) {
                    setActiveSubpage(firstSubpage.id);
                    const firstTab = firstSubpage.children?.find((c) => c.type === 'tab');
                    setActiveTab(firstTab?.id || '');
                } else {
                    setActiveSubpage('');
                    setActiveTab('');
                }
            }
        },
        [schema]
    );

    const handleSetActiveSubpage = useCallback(
        (subpageId: string) => {
            setActiveSubpage(subpageId);
            // Find the parent page
            for (const page of schema) {
                const subpage = page.children?.find((c) => c.id === subpageId);
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

    const getActivePage = useCallback(
        () => schema.find((p) => p.id === activePage),
        [schema, activePage]
    );

    const getActiveSubpage = useCallback(() => {
        const page = getActivePage();
        return page?.children?.find((c) => c.id === activeSubpage);
    }, [getActivePage, activeSubpage]);

    const getActiveTabs = useCallback(() => {
        const subpage = getActiveSubpage();
        if (!subpage?.children) return [];
        return subpage.children.filter((c) => c.type === 'tab');
    }, [getActiveSubpage]);

    const getActiveContent = useCallback(() => {
        const subpage = getActiveSubpage();
        if (!subpage?.children) return [];

        const tabs = subpage.children.filter((c) => c.type === 'tab');
        if (tabs.length > 0 && activeTab) {
            const tab = tabs.find((t) => t.id === activeTab);
            return tab?.children || [];
        }

        // No tabs — return sections directly
        return subpage.children.filter((c) => c.type !== 'tab');
    }, [getActiveSubpage, activeTab]);

    const contextValue: SettingsContextValue = useMemo(
        () => ({
            schema,
            values,
            errors,
            activePage,
            activeSubpage,
            activeTab,
            isDirty,
            loading,
            hookPrefix,
            updateValue,
            setActivePage: handleSetActivePage,
            setActiveSubpage: handleSetActiveSubpage,
            setActiveTab,
            shouldDisplay,
            getActivePage,
            getActiveSubpage,
            getActiveContent,
            getActiveTabs,
        }),
        [
            schema,
            values,
            errors,
            activePage,
            activeSubpage,
            activeTab,
            isDirty,
            loading,
            hookPrefix,
            updateValue,
            handleSetActivePage,
            handleSetActiveSubpage,
            shouldDisplay,
            getActivePage,
            getActiveSubpage,
            getActiveContent,
            getActiveTabs,
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
