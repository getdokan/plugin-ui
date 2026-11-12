// ============================================
// Search match style
// ============================================

/** Attribute on a matching setting's row; styled by SEARCH_HIGHLIGHT_CSS. */
export const SEARCH_MATCH_ATTR = 'data-settings-search-match';

// Matching settings are marked as whole rows: a brand-coloured bar on the left
// edge plus a faint tint. Overlays (not backgrounds) so field cards with their
// own background can't cover them.
export const SEARCH_HIGHLIGHT_CSS = `
[${SEARCH_MATCH_ATTR}] {
    position: relative;
}
[${SEARCH_MATCH_ATTR}]::before,
[${SEARCH_MATCH_ATTR}]::after {
    content: '';
    position: absolute;
    pointer-events: none;
    z-index: 1;
}
[${SEARCH_MATCH_ATTR}]::before {
    inset: 0 auto 0 0;
    width: 3px;
    background-color: var(--primary, #7047eb);
}
[${SEARCH_MATCH_ATTR}]::after {
    inset: 0;
    background-color: color-mix(in srgb, var(--primary, #7047eb) 5%, transparent);
}
`;
