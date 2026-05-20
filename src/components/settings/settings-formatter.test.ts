import { describe, it, expect } from '@jest/globals';
import { formatSettingsData } from './settings-formatter';
import type { SettingsElement } from './settings-types';

describe('settings-formatter id handling', () => {
    it('preserves the element id through nested parent resolution', () => {
        // Field is nested two levels deep (page -> section -> field). The
        // formatter must place it under the right parent without mutating
        // its id — after the dependency_key cleanup, id is the sole
        // identifier used by consumers.
        const input: SettingsElement[] = [
            { id: 'general', type: 'page' } as SettingsElement,
            {
                id: 'commission_section',
                type: 'section',
                page_id: 'general',
            } as SettingsElement,
            {
                id: 'commission_type',
                type: 'field',
                section_id: 'commission_section',
            } as SettingsElement,
        ];

        const out = formatSettingsData(input);
        const page = out.find((e) => e.id === 'general')!;
        const section = page.children!.find(
            (c) => c.id === 'commission_section'
        )!;
        const field = section.children!.find(
            (c) => c.id === 'commission_type'
        )!;

        expect(field.id).toBe('commission_type');
        expect(section.id).toBe('commission_section');
        expect(page.id).toBe('general');
    });

    it('does not emit a dependency_key property on enriched elements', () => {
        // dependency_key was removed in Task 11 of the cleanup; the
        // formatter must no longer materialize it.
        const input: SettingsElement[] = [
            { id: 'general', type: 'page' } as SettingsElement,
            {
                id: 'commission_type',
                type: 'field',
                page_id: 'general',
            } as SettingsElement,
        ];

        const out = formatSettingsData(input);
        const page = out.find((e) => e.id === 'general')!;
        const field = page.children!.find(
            (c) => c.id === 'commission_type'
        )!;

        expect('dependency_key' in page).toBe(false);
        expect('dependency_key' in field).toBe(false);
    });
});
