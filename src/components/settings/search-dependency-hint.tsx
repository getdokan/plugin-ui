import { EyeOff } from 'lucide-react';
import type { SettingsElement } from './settings-types';
import { useSettings } from './settings-context';
import { evaluateDependencies } from './settings-formatter';
import { TEXT_ONLY_VARIANTS, type SettingsSearchIndex } from './settings-search';
import { SEARCH_MATCH_ATTR } from './search-match-style';

// ============================================
// Search dependency hint
// ============================================
//
// Stands in for matching fields that their dependencies currently hide, so a
// search never looks empty when the setting exists but is switched off.

const labelOf = (element: SettingsElement) => element.label || element.title || element.id;

/** What reveals this field, phrased as an instruction (without the trailing "to show …"). */
function revealInstruction(
    element: SettingsElement,
    searchIndex: SettingsSearchIndex | null,
    values: Record<string, unknown>
): string | null {
    const hints = searchIndex?.dependencyHints.get(element.id) || [];
    // Name the rule that is failing right now, not just the first one.
    const hint =
        hints.find((h) => !evaluateDependencies({ id: '', type: 'field', dependencies: [h.dep] }, values)) ??
        hints[0];
    if (!hint) return null;
    const where = hint.location ? ` on the “${hint.location}” page` : ' above';
    const verb = { on: 'Turn on', off: 'Turn off', change: 'Change' }[hint.action];
    return `${verb} “${hint.label}”${where}`;
}

function HintRow({ title, reason, testId, marked }: { title: string; reason: string; testId: string; marked?: boolean }) {
    return (
        <div
            className="flex items-start gap-3 px-5 py-4 bg-muted/40"
            data-testid={testId}
            {...(marked ? { [SEARCH_MATCH_ATTR]: '' } : {})}
        >
            <EyeOff className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="flex flex-col gap-1">
                {marked && <span className="sr-only">Search match:</span>}
                <span className="text-sm font-medium text-foreground">{title}</span>
                <span className="text-xs text-muted-foreground">{reason}</span>
            </div>
        </div>
    );
}

export function SearchDependencyHint({
    element,
    parentLabel,
    marked,
}: {
    element: SettingsElement;
    /** Label of the switch the field sits under, when that is what hides it. */
    parentLabel?: string;
    /** Mark the row as a match when nothing around it already does. */
    marked?: boolean;
}) {
    const { searchIndex, values } = useSettings();
    const instruction = parentLabel
        ? `Turn on “${parentLabel}”`
        : revealInstruction(element, searchIndex, values);

    return (
        <HintRow
            title={labelOf(element)}
            reason={instruction ? `${instruction} to show this setting.` : 'This setting is hidden by another setting.'}
            testId={`settings-search-hidden-${element.id}`}
            marked={marked}
        />
    );
}

/** Matching fields under a container, stopping at the first match on each branch. */
function collectRowHits(element: SettingsElement, hits: Set<string>, out: SettingsElement[] = []): SettingsElement[] {
    for (const child of element.children || []) {
        if (child.display === false) continue;
        if (child.type === 'field' && hits.has(child.id)) {
            out.push(child);
        } else {
            collectRowHits(child, hits, out);
        }
    }
    return out;
}

/** Stands in for a section or group that its dependencies hide but that holds matches. */
export function SearchHiddenGroup({ element }: { element: SettingsElement }) {
    const { searchIndex, values } = useSettings();
    if (!searchIndex) return null;
    const rows = collectRowHits(element, searchIndex.hits);
    if (rows.length === 0) return null;
    if (rows.length === 1) return <SearchDependencyHint element={rows[0]} marked />;

    // One row for the whole group: the same switch reveals all of it. Name the
    // inputs, not notices or help text that happen to sit in the group.
    const inputs = rows.filter((row) => !TEXT_ONLY_VARIANTS.has(row.variant || ''));
    const names = (inputs.length ? inputs : rows).map(labelOf);
    const listed = names.length > 3 ? `${names.slice(0, 3).join(', ')} and ${names.length - 3} more` : names.join(', ');
    const groupLabel = element.label || element.title;
    const instruction = revealInstruction(rows[0], searchIndex, values);

    return (
        <HintRow
            title={groupLabel ? `${groupLabel}: ${listed}` : listed}
            reason={instruction ? `${instruction} to show these settings.` : 'These settings are hidden by another setting.'}
            testId={`settings-search-hidden-group-${element.id}`}
            marked
        />
    );
}
