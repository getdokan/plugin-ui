// ============================================
// Settings Element Types
// ============================================

export type SettingsValidation = {
    rules: string;
    message: string;
    params?: Record<string, any> | any[];
    self?: string;
};

export type SettingsElementDependency = {
    key?: string;
    value?: any;
    currentValue?: any;
    to_self?: boolean;
    self?: string;
    attribute?: string;
    effect?: string;
    comparison?: string;
};

export type SettingsElementOption = {
    /** Primary display text (preferred over `title`). */
    label?: string;
    /** @deprecated Use `label` instead. Kept as fallback for backward compatibility. */
    title?: string;
    value: string | number;
    description?: string;
    icon?: string;
    image?: string;
    preview?: boolean;
};

export type SettingsElement = {
    id: string;
    type: 'page' | 'subpage' | 'tab' | 'section' | 'subsection' | 'field' | 'fieldgroup' | string;
    variant?: string;
    icon?: string;
    /** Primary display text (preferred over `title`). */
    label?: string;
    /** @deprecated Use `label` instead. Kept as fallback for backward compatibility. */
    title?: string;
    description?: string;
    tooltip?: string;
    display?: boolean;
    hook_key?: string;
    dependency_key?: string;
    children?: SettingsElement[];

    // Field-specific
    value?: string | number | boolean | Array<string | number> | Record<string, any>;
    default?: string | number | boolean | Array<string | number>;
    options?: SettingsElementOption[];
    readonly?: boolean;
    disabled?: boolean;
    placeholder?: string | number;
    min?: number;
    max?: number;
    increment?: number;
    size?: number;
    helper_text?: string;
    prefix?: string;
    postfix?: string;
    suffix?: string;
    image_url?: string;
    doc_link?: string;
    css_class?: string;
    wrapper_class?: string;
    content_class?: string;
    divider?: boolean;

    // Switch-specific
    enable_state?: { value: string | number; title: string };
    disable_state?: { value: string | number; title: string };
    switcher_type?: string | null;
    should_confirm?: boolean;
    confirm_modal?: Record<string, any>;

    // Radio-specific
    radio_variant?: 'simple' | 'card' | 'template' | string;
    grid_config?: any[];

    // HTML-specific
    html_content?: string;
    escape_html?: boolean;

    // Validation & Dependencies
    validations?: SettingsValidation[];
    dependencies?: SettingsElementDependency[];

    // Flat data pointers (used by formatter)
    // These are generic parent pointers — each can reference any ancestor type.
    // The formatter resolves the actual parent by looking up the element type via ID.
    // e.g. `page_id` can point to a page OR a subpage;
    //      `section_id` can point to a section OR a subsection.
    page_id?: string;
    subpage_id?: string;
    tab_id?: string;
    section_id?: string;
    subsection_id?: string;
    field_group_id?: string;
    priority?: number;

    // Validation error (runtime)
    validationError?: string;

    // Allow additional properties
    [key: string]: any;
};

// ============================================
// Component Props
// ============================================

export interface SettingsProps {
    /** Settings schema — JSON array (flat or hierarchical) */
    schema: SettingsElement[];
    /** Current values, keyed by dependency_key */
    values?: Record<string, any>;
    /** Called when a field value changes */
    onChange?: (key: string, value: any) => void;
    /** Called when the save button is clicked, with all current values */
    onSave?: (values: Record<string, any>) => void;
    /** Whether settings are loading */
    loading?: boolean;
    /** Title displayed above the settings */
    title?: string;
    /** Prefix for WordPress filter hook names (default: "plugin_ui") */
    hookPrefix?: string;
    /** Additional class name for the root element */
    className?: string;
    /**
     * Optional filter function for field extensibility.
     * Pass @wordpress/hooks `applyFilters` to enable consumer plugins
     * to inject/override field types via filter hooks.
     * Signature: (hookName: string, value: any, ...args: any[]) => any
     * If not provided, fields render without filtering.
     */
    applyFilters?: (hookName: string, value: any, ...args: any[]) => any;
}

export interface FieldComponentProps {
    element: SettingsElement;
    onChange: (key: string, value: any) => void;
}
