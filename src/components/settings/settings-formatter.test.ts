import { describe, it, expect } from '@jest/globals';
import { formatSettingsData } from './settings-formatter';
import type { SettingsElement } from './settings-types';

describe('settings-formatter dependency_key handling', () => {
    it('preserves server-supplied dependency_key without overwriting (nested)', () => {
        // Field is nested two levels deep (page -> section -> field) so that
        // the legacy overwrite behavior (parent.dependency_key + '.' + id)
        // would yield a dot-path different from the server value.
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
                dependency_key: 'commission_type',
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

        expect(field.dependency_key).toBe('commission_type');
    });

    it('falls back to id when server omits dependency_key (nested)', () => {
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

        expect(field.dependency_key).toBe('commission_type');
    });

    it('uses element id (not empty string) for the dependency_key on a page itself', () => {
        const input: SettingsElement[] = [
            { id: 'general', type: 'page' } as SettingsElement,
        ];

        const out = formatSettingsData(input);
        const page = out.find((e) => e.id === 'general')!;

        // Pages used to receive `dependency_key = ''`. They should now fall
        // back to their id when the server omits the field.
        expect(page.dependency_key).toBe('general');
    });
});
