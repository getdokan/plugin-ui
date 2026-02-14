import type { SettingsElement } from './settings-types';

/**
 * Formats flat settings data into a hierarchical structure.
 * Also accepts already-hierarchical data (passes through).
 */
export function formatSettingsData(data: SettingsElement[]): SettingsElement[] {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }

    // Detect if data is already hierarchical (pages with children)
    const isHierarchical = data.some(
        (item) => item.type === 'page' && Array.isArray(item.children) && item.children.length > 0
    );

    if (isHierarchical) {
        return data;
    }

    // Flat data — build hierarchy
    const enrichedData = data.map((item) => ({
        ...item,
        children: [] as SettingsElement[],
        display: item.display !== undefined ? item.display : true,
        hook_key: item.hook_key || '',
        dependency_key: item.dependency_key || '',
        validations: Array.isArray(item.validations) ? item.validations : [],
        dependencies: Array.isArray(item.dependencies) ? item.dependencies : [],
    }));

    // Identify root pages
    const roots: SettingsElement[] = [];
    enrichedData.forEach((element) => {
        if (element.type === 'page') {
            element.icon = element.icon || '';
            element.title = element.title || '';
            element.tooltip = element.tooltip || '';
            element.description = element.description || '';
            element.hook_key = element.hook_key || `settings_${element.id}`;
            element.dependency_key = '';
            roots.push(element);
        }
    });

    // Sort roots by priority
    roots.sort((a, b) => (a.priority || 100) - (b.priority || 100));

    // Recursive hierarchy builder
    const buildHierarchy = (parent: SettingsElement) => {
        const parentId = parent.id;
        const parentType = parent.type;

        const children = enrichedData.filter((item) => {
            if (parentType === 'page' && item.type === 'subpage') {
                return item.page_id === parentId && !item.subpage_id; // Added !item.subpage_id check
            }
            if (parentType === 'subpage' && item.type === 'subpage') {
                // Nested subpage support
                return item.subpage_id === parentId;
            }
            if (parentType === 'subpage' && item.type === 'tab') {
                // Tabs belong directly under their subpage
                return item.subpage_id === parentId;
            }
            if (parentType === 'subpage' && item.type === 'section') {
                if (item.subpage_id === parentId && !item.section_id) return true;
                if (!item.subpage_id) {
                    return enrichedData.some(
                        (f) => f.type === 'field' && f.section_id === item.id && f.subpage_id === parentId
                    );
                }
                return false;
            }
            if (parentType === 'tab' && item.type === 'section') {
                // Sections inside a tab
                return item.tab_id === parentId && !item.section_id;
            }
            if (parentType === 'section' && item.type === 'subsection') {
                return item.section_id === parentId;
            }
            if (parentType === 'section' && item.type === 'section') {
                return item.section_id === parentId;
            }
            if (parentType === 'section' && item.type === 'field') {
                return item.section_id === parentId && !item.field_group_id;
            }
            if (parentType === 'section' && item.type === 'fieldgroup') {
                return item.section_id === parentId;
            }
            if (parentType === 'subsection' && item.type === 'field') {
                return item.section_id === parentId && !item.field_group_id;
            }
            if (parentType === 'subsection' && item.type === 'fieldgroup') {
                return item.section_id === parentId;
            }
            if (parentType === 'fieldgroup' && item.type === 'field') {
                return item.field_group_id === parentId;
            }
            return false;
        });

        children.sort((a, b) => (a.priority || 100) - (b.priority || 100));

        children.forEach((child) => {
            child.icon = child.icon || '';
            child.title = child.title || '';
            child.tooltip = child.tooltip || '';
            child.description = child.description || '';
            child.display = child.display !== undefined ? child.display : true;
            child.hook_key = `${parent.hook_key}_${child.id}`;
            child.dependency_key = [parent.dependency_key, child.id].filter(Boolean).join('.');

            // Field-specific defaults
            if (child.type === 'field') {
                child.default = child.default !== undefined ? child.default : '';
                child.value = child.value !== undefined ? child.value : (child.default || '');
                child.readonly = child.readonly || false;
                child.disabled = child.disabled || false;
                child.size = child.size || 20;
                child.helper_text = child.helper_text || '';
                child.postfix = child.postfix || '';
                child.prefix = child.prefix || '';
                child.image_url = child.image_url || '';
                child.placeholder = child.placeholder || '';

                if (child.variant === 'customize_radio') {
                    child.grid_config = child.grid_config || [];
                }

                if (child.options && Array.isArray(child.options)) {
                    const iconVariants = ['radio_capsule', 'customize_radio'];
                    child.options = child.options.map((opt) => {
                        const hasIcon = 'icon' in opt || 'image' in opt;
                        const shouldHaveIcon = hasIcon || iconVariants.includes(child.variant || '');
                        if (shouldHaveIcon) {
                            return { ...opt, icon: opt.icon || opt.image || '' };
                        }
                        return opt;
                    });
                }
            }

            // Transform validations
            if (child.validations) {
                child.validations = child.validations.map((v) => {
                    // Pass-through already formatted validations
                    return {
                        rules: v.rules || '',
                        message: v.message || '',
                        params: v.params || {},
                        self: child.dependency_key,
                    };
                });
            }

            // Transform dependencies
            if (child.dependencies) {
                child.dependencies = child.dependencies.map((d) => ({
                    ...d,
                    self: child.dependency_key,
                    to_self: d.to_self ?? true,
                    attribute: d.attribute || 'display',
                    effect: d.effect || 'show',
                    comparison: d.comparison || '==',
                }));
            }

            // Ensure children array exists for nested structures
            if (!child.children) {
                child.children = [];
            }

            parent.children!.push(child);
            buildHierarchy(child);
        });
    };

    roots.forEach((root) => buildHierarchy(root));

    return roots;
}

/**
 * Extracts a flat key-value map of field values from a hierarchical schema.
 */
export function extractValues(schema: SettingsElement[]): Record<string, any> {
    const values: Record<string, any> = {};

    const walk = (elements: SettingsElement[]) => {
        for (const el of elements) {
            if (el.type === 'field' && el.dependency_key) {
                values[el.dependency_key] = el.value;
            }
            if (el.children && el.children.length > 0) {
                walk(el.children);
            }
        }
    };

    walk(schema);
    return values;
}

/**
 * Evaluates whether a field should be displayed based on its dependencies.
 */
export function evaluateDependencies(
    element: SettingsElement,
    values: Record<string, any>
): boolean {
    if (!element.dependencies || element.dependencies.length === 0) {
        return element.display !== false;
    }

    return element.dependencies.every((dep) => {
        if (!dep.key) return true;

        const currentValue = values[dep.key];
        const comparison = dep.comparison || '==';
        const expectedValue = dep.value;

        switch (comparison) {
            case '==':
                return currentValue == expectedValue;    // eslint-disable-line eqeqeq
            case '!=':
                return currentValue != expectedValue;    // eslint-disable-line eqeqeq
            case '===':
                return currentValue === expectedValue;
            case '!==':
                return currentValue !== expectedValue;
            case 'in':
                return Array.isArray(expectedValue) && expectedValue.includes(currentValue);
            case 'not_in':
                return Array.isArray(expectedValue) && !expectedValue.includes(currentValue);
            default:
                return true;
        }
    });
}

/**
 * Validates a field value against its validation rules.
 * Supports pipe-delimited rules: "not_empty|min_value|max_value"
 * Returns an error message string or null if valid.
 */
export function validateField(
    element: SettingsElement,
    value: any
): string | null {
    if (!element.validations || element.validations.length === 0) {
        return null;
    }

    for (const validation of element.validations) {
        // Handle pipe-delimited rules
        const rules = validation.rules.split('|');

        for (const rule of rules) {
            const params = (validation.params as any) || {};

            switch (rule) {
                case 'not_in': {
                    const forbidden = params.values || [];
                    if (Array.isArray(forbidden) && forbidden.includes(value)) {
                        return validation.message.replace('%s', String(value)) ||
                            `The value "${value}" is not allowed.`;
                    }
                    break;
                }
                case 'required':
                case 'not_empty': {
                    if (value === undefined || value === null || value === '') {
                        return validation.message || 'This field is required.';
                    }
                    if (typeof value === 'string' && value.trim() === '') {
                        return validation.message || 'This field cannot be empty.';
                    }
                    break;
                }
                case 'min':
                case 'min_value': {
                    let min: number | undefined;

                    // Handle params structure: { min: 1 } or { value: 1 } or just pass as arg if manually formatted
                    if ('min' in params) min = Number(params.min);
                    else if ('value' in params) min = Number(params.value);

                    if (min !== undefined && !isNaN(min) && Number(value) < min) {
                        return validation.message || `Value must be at least ${min}.`;
                    }
                    break;
                }
                case 'max':
                case 'max_value': {
                    let max: number | undefined;

                    if ('max' in params) max = Number(params.max);
                    else if ('value' in params) max = Number(params.value);

                    if (max !== undefined && !isNaN(max) && Number(value) > max) {
                        return validation.message || `Value must be at most ${max}.`;
                    }
                    break;
                }
                default:
                    break;
            }
        }
    }

    return null;
}
