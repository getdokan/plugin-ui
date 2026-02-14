import type { SettingsElement } from './settings-types';

/**
 * Formats flat settings data into a hierarchical structure.
 * Also accepts already-hierarchical data (passes through).
 *
 * ## Parent resolution strategy (bottom-up)
 *
 * Each flat element may carry one or more "parent pointer" fields:
 *   `field_group_id`, `subsection_id`, `section_id`, `tab_id`, `subpage_id`, `page_id`
 *
 * These pointers are **generic** — the referenced ID can be any element type.
 * For example, `page_id` can point to a `page` **or** a `subpage`;
 * `section_id` can point to a `section` **or** a `subsection`.
 *
 * The formatter resolves each element's direct parent by checking pointers
 * from most specific to least specific. The first pointer whose value matches
 * an existing element ID in the data becomes the parent.
 *
 * When multiple elements share the same ID (e.g. a subpage and a section both
 * named "commission"), the resolver picks the element whose **type** is
 * compatible with the pointer field being used.
 *
 * Priority order (most specific → least specific):
 *   field_group_id → subsection_id → section_id → tab_id → subpage_id → page_id
 */
export function formatSettingsData(data: SettingsElement[]): SettingsElement[] {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }

    // Detect if data is already hierarchical (pages with children)
    const isHierarchical = data.some(
        (item) =>
            item.type === 'page' &&
            Array.isArray(item.children) &&
            item.children.length > 0
    );

    if (isHierarchical) {
        return data;
    }

    // ── Step 1: Enrich all items and build a multi-map (id → element[]) ─
    //
    // A multi-map is needed because the source data may contain duplicate IDs
    // (e.g. a subpage and section sharing the same id). When resolving parents
    // we pick the type-compatible element.
    const idMultiMap = new Map<string, SettingsElement[]>();

    const enrichedData: SettingsElement[] = data.map((item) => {
        const enriched: SettingsElement = {
            ...item,
            children: [],
            display: item.display !== undefined ? item.display : true,
            hook_key: item.hook_key || '',
            dependency_key: item.dependency_key || '',
            validations: Array.isArray(item.validations) ? item.validations : [],
            dependencies: Array.isArray(item.dependencies)
                ? item.dependencies
                : [],
        };

        const bucket = idMultiMap.get(enriched.id);
        if (bucket) {
            bucket.push(enriched);
        } else {
            idMultiMap.set(enriched.id, [enriched]);
        }

        return enriched;
    });

    // ── Step 2: Resolve each element's direct parent ────────────────────
    //
    // For each pointer field we define which element types are "compatible"
    // parents. When the referenced ID maps to multiple elements the
    // type-compatible one is preferred; otherwise the first match is used.
    type PointerSpec = {
        value: string | undefined | null;
        compatibleTypes: string[];
    };

    const resolveParent = (item: SettingsElement): SettingsElement | null => {
        const pointers: PointerSpec[] = [
            {
                value: item.field_group_id,
                compatibleTypes: ['fieldgroup'],
            },
            {
                value: item.subsection_id,
                compatibleTypes: ['subsection', 'section'],
            },
            {
                value: item.section_id,
                compatibleTypes: ['section', 'subsection'],
            },
            {
                value: item.tab_id,
                compatibleTypes: ['tab'],
            },
            {
                value: item.subpage_id,
                compatibleTypes: ['subpage', 'page'],
            },
            {
                value: item.page_id,
                compatibleTypes: ['page', 'subpage'],
            },
        ];

        for (const { value: ptr, compatibleTypes } of pointers) {
            if (!ptr) continue;

            const candidates = idMultiMap.get(ptr);
            if (!candidates || candidates.length === 0) continue;

            // Prefer a type-compatible candidate; fall back to first match
            const match =
                candidates.find((c) => compatibleTypes.includes(c.type)) ??
                candidates[0];

            // Don't attach an element to itself
            if (match === item) {
                // If there's another candidate, try that
                const alt = candidates.find(
                    (c) => c !== item && compatibleTypes.includes(c.type)
                );
                if (alt) return alt;
                continue;
            }

            return match;
        }

        return null;
    };

    // ── Step 3: Separate root pages and attach children to parents ──────
    const roots: SettingsElement[] = [];

    for (const element of enrichedData) {
        if (element.type === 'page') {
            // Initialize page-level defaults
            element.label = element.label ?? element.title ?? '';
            element.icon = element.icon || '';
            element.tooltip = element.tooltip || '';
            element.description = element.description || '';
            element.hook_key =
                element.hook_key || `settings_${element.id}`;
            element.dependency_key = '';
            roots.push(element);
            continue;
        }

        const parent = resolveParent(element);
        if (parent) {
            parent.children!.push(element);
        }
        // Items with no resolvable parent are silently excluded (orphans).
    }

    // Sort root pages by priority
    roots.sort((a, b) => (a.priority || 100) - (b.priority || 100));

    // ── Step 4: Recursive enrichment ────────────────────────────────────
    //
    // Walk the tree top-down to compute hook_key, dependency_key, apply
    // field-specific defaults, transform validations/dependencies, and
    // sort children at each level.
    const enrichNode = (parent: SettingsElement) => {
        if (!parent.children || parent.children.length === 0) return;

        parent.children.sort(
            (a, b) => (a.priority || 100) - (b.priority || 100)
        );

        for (const child of parent.children) {
            // Common defaults — resolve label from label ?? title ?? ''
            child.label = child.label ?? child.title ?? '';
            child.icon = child.icon || '';
            child.tooltip = child.tooltip || '';
            child.description = child.description || '';
            child.display =
                child.display !== undefined ? child.display : true;
            child.hook_key = `${parent.hook_key}_${child.id}`;
            child.dependency_key = [parent.dependency_key, child.id]
                .filter(Boolean)
                .join('.');

            // ── Field-specific defaults ──
            if (child.type === 'field') {
                child.default =
                    child.default !== undefined ? child.default : '';
                child.value =
                    child.value !== undefined
                        ? child.value
                        : child.default || '';
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
                    const iconVariants = [
                        'radio_capsule',
                        'customize_radio',
                    ];
                    child.options = child.options.map((opt) => {
                        // Resolve label from label ?? title ?? ''
                        const resolvedLabel =
                            opt.label ?? opt.title ?? '';
                        const hasIcon = 'icon' in opt || 'image' in opt;
                        const shouldHaveIcon =
                            hasIcon ||
                            iconVariants.includes(child.variant || '');
                        if (shouldHaveIcon) {
                            return {
                                ...opt,
                                label: resolvedLabel,
                                icon: opt.icon || opt.image || '',
                            };
                        }
                        return { ...opt, label: resolvedLabel };
                    });
                }
            }

            // ── Transform validations ──
            if (child.validations) {
                child.validations = child.validations.map((v) => ({
                    rules: v.rules || '',
                    message: v.message || '',
                    params: v.params || {},
                    self: child.dependency_key,
                }));
            }

            // ── Transform dependencies ──
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

            // Ensure children array exists
            if (!child.children) {
                child.children = [];
            }

            enrichNode(child);
        }
    };

    roots.forEach((root) => enrichNode(root));

    return roots;
}

/**
 * Extracts a flat key-value map of field values from a hierarchical schema.
 */
export function extractValues(
    schema: SettingsElement[]
): Record<string, any> {
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
                return currentValue == expectedValue; // eslint-disable-line eqeqeq
            case '!=':
                return currentValue != expectedValue; // eslint-disable-line eqeqeq
            case '===':
                return currentValue === expectedValue;
            case '!==':
                return currentValue !== expectedValue;
            case 'in':
                return (
                    Array.isArray(expectedValue) &&
                    expectedValue.includes(currentValue)
                );
            case 'not_in':
                return (
                    Array.isArray(expectedValue) &&
                    !expectedValue.includes(currentValue)
                );
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
                    if (
                        Array.isArray(forbidden) &&
                        forbidden.includes(value)
                    ) {
                        return (
                            validation.message.replace(
                                '%s',
                                String(value)
                            ) ||
                            `The value "${value}" is not allowed.`
                        );
                    }
                    break;
                }
                case 'required':
                case 'not_empty': {
                    if (
                        value === undefined ||
                        value === null ||
                        value === ''
                    ) {
                        return (
                            validation.message ||
                            'This field is required.'
                        );
                    }
                    if (
                        typeof value === 'string' &&
                        value.trim() === ''
                    ) {
                        return (
                            validation.message ||
                            'This field cannot be empty.'
                        );
                    }
                    break;
                }
                case 'min':
                case 'min_value': {
                    let min: number | undefined;

                    if ('min' in params) min = Number(params.min);
                    else if ('value' in params)
                        min = Number(params.value);

                    if (
                        min !== undefined &&
                        !isNaN(min) &&
                        Number(value) < min
                    ) {
                        return (
                            validation.message ||
                            `Value must be at least ${min}.`
                        );
                    }
                    break;
                }
                case 'max':
                case 'max_value': {
                    let max: number | undefined;

                    if ('max' in params) max = Number(params.max);
                    else if ('value' in params)
                        max = Number(params.value);

                    if (
                        max !== undefined &&
                        !isNaN(max) &&
                        Number(value) > max
                    ) {
                        return (
                            validation.message ||
                            `Value must be at most ${max}.`
                        );
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
