import type { SettingsElement, SettingsElementDependency } from './settings-types';

// ============================================
// Settings search — field-level index
// ============================================

/** Navigation containers: only their label takes part in matching. */
const NAV_TYPES = new Set(['page', 'subpage', 'tab']);

/** Field variants that only show text (notices, headings); they belong to the setting they explain. */
export const TEXT_ONLY_VARIANTS = new Set(['notice', 'html', 'info', 'base_field_label']);

/** Option lists longer than this are data (pages, countries), not part of the setting's wording. */
const MAX_SEARCHED_OPTIONS = 8;

/** Why a matching field is hidden, and what reveals it. */
export interface SearchDependencyHint {
    /** Label of the field that controls visibility. */
    label: string;
    /** Page/subpage label when the controlling field lives elsewhere. */
    location?: string;
    /** What to do with the controlling field to reveal this one. */
    action: 'on' | 'off' | 'change';
    /** The rule itself, so the UI can tell which one is failing right now. */
    dep: SettingsElementDependency;
}

export interface SettingsSearchIndex {
    /** Normalized query split into words; every word must match. */
    tokens: string[];
    /** Fields whose text (with their parents' headings) matches the query. */
    hits: Set<string>;
    /** Hits that are not inside another hit field: the rows to mark as matches. */
    markRoots: Set<string>;
    /** Elements to render while filtering: hits, their parents, and the fields they depend on. */
    visible: Set<string>;
    /** Matching setting count per page, subpage and tab (see `assignSettingUnits`). */
    counts: Map<string, number>;
    /** Total setting count per page, subpage and tab. */
    totals: Map<string, number>;
    /** Pages/subpages that render content and contain a hit, in menu order. */
    sourceOrder: string[];
    /** Hint per hit that has visibility dependencies. */
    dependencyHints: Map<string, SearchDependencyHint[]>;
    /** Matching rows across the whole schema. */
    totalHits: number;
}

/** Lowercase, strip HTML tags, collapse whitespace. */
export function normalizeSearchText(text: unknown): string {
    if (text === undefined || text === null) return '';
    return String(text)
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

export function tokenizeSearchQuery(query: string): string[] {
    return normalizeSearchText(query).split(' ').filter(Boolean);
}

function ownSearchText(element: SettingsElement): string {
    const parts: unknown[] = [element.label, element.title];
    if (!NAV_TYPES.has(element.type)) {
        parts.push(element.description, element.placeholder, element.tooltip);
        // Short choice lists (None / Single / Multiple) describe the setting; long ones
        // such as a list of every WordPress page would match almost any word.
        const options = element.options || [];
        if (options.length <= MAX_SEARCHED_OPTIONS) {
            for (const option of options) {
                parts.push(option.label, option.title, option.description);
            }
        }
    }
    return normalizeSearchText(parts.filter(Boolean).join(' '));
}

function isContentSource(element: SettingsElement): boolean {
    if (element.type !== 'page' && element.type !== 'subpage') return false;
    return !(element.children || []).some(
        (child) => child.type === 'subpage' && child.display !== false
    );
}

const TRUTHY_VALUES = new Set(['true', '1', 'on', 'yes']);
const FALSY_VALUES = new Set(['false', '0', 'off', 'no', '']);

/** Turn the controller on, off, or just change it — from a dependency rule. */
function revealAction(dep: { value?: unknown; comparison?: string; effect?: string }): 'on' | 'off' | 'change' {
    const value = String(dep.value ?? '').toLowerCase();
    const isOn = dep.value === true || TRUTHY_VALUES.has(value);
    const isOff = dep.value === false || FALSY_VALUES.has(value);
    if (!isOn && !isOff) return 'change';
    const op = dep.comparison || '==';
    // "show when equal" and "hide when not equal" both reveal at the given value.
    const equals = op === '==' || op === '===';
    const notEquals = op === '!=' || op === '!==';
    if (!equals && !notEquals) return 'change';
    const revealsAtValue = (dep.effect || 'show') === 'show' ? equals : notEquals;
    return revealsAtValue === isOn ? 'on' : 'off';
}

/** Dependency keys used by an element and everything inside it (raw key and its last dotted segment). */
function collectDependencyKeys(element: SettingsElement, out: Set<string> = new Set()): Set<string> {
    for (const dep of element.dependencies || []) {
        if (!dep.key) continue;
        out.add(dep.key);
        out.add(dep.key.split('.').pop() as string);
    }
    for (const child of element.children || []) collectDependencyKeys(child, out);
    return out;
}

/**
 * Map every field to the "setting" it is part of, which is what counts call a setting.
 *
 * Each top-level field or field group in a section is one setting. A field group or a
 * text-only row that depends on an earlier sibling field is that field's detail panel
 * (e.g. the App ID/Secret group under "Connect to Facebook"), so it joins its setting.
 * Ordinary fields keep their own setting even when they depend on a sibling.
 */
function assignSettingUnits(elements: SettingsElement[], unitOf: Map<string, string>): void {
    const markSubtree = (element: SettingsElement, unit: string) => {
        unitOf.set(element.id, unit);
        for (const child of element.children || []) {
            if (child?.id) markSubtree(child, unit);
        }
    };

    const precedingFields: string[] = [];
    for (const element of elements) {
        if (!element?.id || element.display === false) continue;
        const isFieldLike = element.type === 'field' || element.type === 'fieldgroup';
        if (!isFieldLike) {
            assignSettingUnits(element.children || [], unitOf);
            continue;
        }

        let unit = element.id;
        const isDetail = element.type === 'fieldgroup' || TEXT_ONLY_VARIANTS.has(element.variant || '');
        if (isDetail) {
            const keys = collectDependencyKeys(element);
            for (let i = precedingFields.length - 1; i >= 0; i--) {
                if (keys.has(precedingFields[i])) {
                    unit = unitOf.get(precedingFields[i]) || precedingFields[i];
                    break;
                }
            }
        }
        markSubtree(element, unit);
        if (element.type === 'field') precedingFields.push(element.id);
    }
}

/**
 * Build the field-level search index for a formatted (hierarchical) schema.
 * Returns null for an empty query.
 */
export function buildSettingsSearchIndex(
    schema: SettingsElement[],
    query: string
): SettingsSearchIndex | null {
    const tokens = tokenizeSearchQuery(query);
    if (tokens.length === 0) return null;

    const byId = new Map<string, SettingsElement>();
    const parentOf = new Map<string, string>();
    const sourceOf = new Map<string, string>();

    const register = (elements: SettingsElement[], parentId: string | null, sourceId: string | null) => {
        for (const element of elements) {
            if (!element?.id || element.display === false) continue;
            byId.set(element.id, element);
            if (parentId) parentOf.set(element.id, parentId);
            const nextSource = isContentSource(element) ? element.id : sourceId;
            if (nextSource) sourceOf.set(element.id, nextSource);
            register(element.children || [], element.id, nextSource);
        }
    };
    register(schema, null, null);

    const findById = (key: string): SettingsElement | undefined => {
        const direct = byId.get(key);
        if (direct) return direct;
        for (const [id, element] of byId) {
            if (id.split('.').pop() === key) return element;
        }
        return undefined;
    };

    const hits = new Set<string>();
    const markRoots = new Set<string>();
    const visible = new Set<string>();
    const counts = new Map<string, number>();
    const totals = new Map<string, number>();
    const dependencyHints = new Map<string, SearchDependencyHint[]>();
    const sourcesWithHits = new Set<string>();

    const showWithAncestors = (id: string) => {
        let current: string | undefined = id;
        while (current && !visible.has(current)) {
            visible.add(current);
            current = parentOf.get(current);
        }
    };

    const unitOf = new Map<string, string>();
    assignSettingUnits(schema, unitOf);

    // Settings per page/subpage/tab: all of them, and those containing a hit.
    const totalUnits = new Map<string, Set<string>>();
    const hitUnits = new Map<string, Set<string>>();
    const addUnit = (map: Map<string, Set<string>>, navIds: string[], unit: string) => {
        for (const navId of navIds) {
            if (!map.has(navId)) map.set(navId, new Set());
            map.get(navId)!.add(unit);
        }
    };

    const labelOf = (element?: SettingsElement) =>
        element ? element.label || element.title || element.id : '';

    const walk = (
        elements: SettingsElement[],
        chainText: string,
        navIds: string[],
        inheritedDeps: SettingsElementDependency[],
        insideHitField: boolean
    ) => {
        for (const element of elements) {
            if (!element?.id || element.display === false) continue;

            const text = `${chainText} ${ownSearchText(element)}`;
            const isNav = NAV_TYPES.has(element.type);
            const nextNav = isNav ? [...navIds, element.id] : navIds;
            const isField = element.type === 'field';
            const unit = unitOf.get(element.id) || element.id;
            // A hidden group hides everything inside it, so its rules apply to its fields too.
            const deps = isNav ? inheritedDeps : [...inheritedDeps, ...(element.dependencies || [])];

            if (isField) addUnit(totalUnits, nextNav, unit);

            const isHit = isField && tokens.every((token) => text.includes(token));
            if (isHit) {
                hits.add(element.id);
                if (!insideHitField) markRoots.add(element.id);
                showWithAncestors(element.id);
                addUnit(hitUnits, nextNav, unit);
                const source = sourceOf.get(element.id);
                if (source) sourcesWithHits.add(source);

                // Keep the fields this one depends on in view, so it can be revealed.
                const hints: SearchDependencyHint[] = [];
                const seen = new Set<string>();
                for (const dep of deps) {
                    if (!dep.key) continue;
                    const controller = findById(dep.key);
                    if (!controller || controller.id === element.id || seen.has(controller.id)) continue;
                    seen.add(controller.id);
                    const controllerSource = sourceOf.get(controller.id);
                    const sameSource = controllerSource === source;
                    if (sameSource) showWithAncestors(controller.id);
                    hints.push({
                        label: labelOf(controller),
                        location: sameSource ? undefined : labelOf(byId.get(controllerSource || '')),
                        action: revealAction(dep),
                        dep,
                    });
                }
                if (hints.length) dependencyHints.set(element.id, hints);
            }

            walk(element.children || [], text, nextNav, deps, insideHitField || isHit);
        }
    };
    walk(schema, '', [], [], false);

    for (const [navId, units] of totalUnits) totals.set(navId, units.size);
    for (const [navId, units] of hitUnits) counts.set(navId, units.size);

    // Menu order: the order content sources appear in the tree.
    const sourceOrder: string[] = [];
    const collectOrder = (elements: SettingsElement[]) => {
        for (const element of elements) {
            if (!element?.id || element.display === false) continue;
            if (isContentSource(element) && sourcesWithHits.has(element.id)) {
                sourceOrder.push(element.id);
            }
            if (element.type === 'page' || element.type === 'subpage') {
                collectOrder(element.children || []);
            }
        }
    };
    collectOrder(schema);

    return {
        tokens,
        hits,
        markRoots,
        visible,
        counts,
        totals,
        sourceOrder,
        dependencyHints,
        totalHits: sourceOrder.reduce((sum, id) => sum + (counts.get(id) || 0), 0),
    };
}
