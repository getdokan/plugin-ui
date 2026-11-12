import { describe, it, expect } from '@jest/globals';
import { formatSettingsData } from './settings-formatter';
import { buildSettingsSearchIndex, normalizeSearchText, tokenizeSearchQuery } from './settings-search';
import type { SettingsElement } from './settings-types';

// Flat schema in the REST shape, formatted the same way <Settings> does it.
const flat = [
    { id: 'general', type: 'page', label: 'General' },
    { id: 'marketplace_section', type: 'section', page_id: 'general', label: 'Marketplace' },
    { id: 'store_url', type: 'field', variant: 'text', section_id: 'marketplace_section', label: 'Vendor Store URL' },
    {
        id: 'commission_type',
        type: 'field',
        variant: 'select',
        section_id: 'marketplace_section',
        label: 'Commission Type',
        options: [
            { value: 'flat', label: 'Flat' },
            { value: 'percentage', label: 'Percentage' },
        ],
    },
    {
        id: 'commission_amount',
        type: 'field',
        variant: 'number',
        section_id: 'marketplace_section',
        label: 'Commission Amount',
        dependencies: [ { key: 'commission_type', value: 'flat' } ],
    },
    {
        id: 'terms_page',
        type: 'field',
        variant: 'select',
        section_id: 'marketplace_section',
        label: 'Terms Page',
        options: [ 'Home', 'Shop', 'Cart', 'Checkout', 'Account', 'Blog', 'About', 'Contact', 'Withdraw Page' ].map(
            ( label, value ) => ( { value, label } )
        ),
    },
    { id: 'secret_field', type: 'field', variant: 'text', section_id: 'marketplace_section', label: 'Secret Withdraw', display: false },

    { id: 'vendors', type: 'page', label: 'Vendors' },
    { id: 'onboarding', type: 'subpage', page_id: 'vendors', label: 'Vendor Onboarding' },
    { id: 'onboarding_section', type: 'section', subpage_id: 'onboarding' },
    {
        id: 'terms',
        type: 'field',
        variant: 'switch',
        section_id: 'onboarding_section',
        label: 'Terms and Condition',
        description: 'Enable the terms &amp; conditions checkbox on <b>vendor</b> registration form.',
        tooltip: 'Prompt for vendors when creating store on your site',
    },
    { id: 'social', type: 'subpage', page_id: 'vendors', label: 'Social Onboarding' },
    { id: 'social_section', type: 'section', subpage_id: 'social' },
    { id: 'fb_enabled', type: 'field', variant: 'switch', section_id: 'social_section', label: 'Connect to Facebook' },
    { id: 'fb_keys', type: 'fieldgroup', section_id: 'social_section', dependencies: [ { key: 'fb_enabled', value: 'on' } ] },
    { id: 'fb_app_id', type: 'field', variant: 'text', field_group_id: 'fb_keys', label: 'Facebook App ID' },
    { id: 'fb_app_secret', type: 'field', variant: 'text', field_group_id: 'fb_keys', label: 'Facebook App Secret' },
    { id: 'fb_notice', type: 'field', variant: 'notice', section_id: 'social_section', label: 'Facebook callback notice', dependencies: [ { key: 'fb_enabled', value: 'on' } ] },
    { id: 'fb_redirect', type: 'field', variant: 'text', section_id: 'social_section', label: 'Facebook Redirect URL', dependencies: [ { key: 'fb_enabled', value: 'on' } ] },
    { id: 'fb_legacy', type: 'field', variant: 'switch', section_id: 'social_section', label: 'Facebook Legacy Login', dependencies: [ { key: 'fb_enabled', value: 'on', effect: 'hide' } ] },
    { id: 'payout_switch', type: 'field', variant: 'switch_group', section_id: 'social_section', label: 'Payouts' },
    { id: 'payout_key', type: 'field', variant: 'text', field_group_id: 'payout_switch', label: 'Payout Key' },
    { id: 'store_banner', type: 'field', variant: 'text', section_id: 'social_section', label: 'Store Banner', dependencies: [ { key: 'commission_type', value: 'percentage' } ] },
] as unknown as SettingsElement[];

const schema = formatSettingsData( flat );
const search = ( query: string ) => buildSettingsSearchIndex( schema, query )!;

describe( 'settings search text', () => {
    it( 'strips tags, decodes entities, collapses whitespace and lowercases', () => {
        expect( normalizeSearchText( ' Terms &amp; <b>Conditions</b>&nbsp; Page ' ) ).toBe( 'terms & conditions page' );
        expect( normalizeSearchText( undefined ) ).toBe( '' );
        expect( tokenizeSearchQuery( '  Vendor   STORE ' ) ).toEqual( [ 'vendor', 'store' ] );
    } );

    it( 'returns no index for an empty query', () => {
        expect( buildSettingsSearchIndex( schema, '   ' ) ).toBeNull();
    } );
} );

describe( 'settings search matching', () => {
    it( 'requires every word, anywhere in the field or the headings above it', () => {
        const index = search( 'vendor store' );
        expect( index.hits.has( 'store_url' ) ).toBe( true );
        // "store" only appears in the tooltip, "vendor" in the description and page name.
        expect( index.hits.has( 'terms' ) ).toBe( true );
        expect( index.hits.has( 'commission_amount' ) ).toBe( false );

        expect( [ ...search( 'facebook secret' ).hits ] ).toEqual( [ 'fb_app_secret' ] );
    } );

    it( 'searches short option lists but not long ones', () => {
        expect( search( 'percentage' ).hits.has( 'commission_type' ) ).toBe( true );
        expect( search( 'withdraw page' ).hits.has( 'terms_page' ) ).toBe( false );
    } );

    it( 'skips elements with display: false', () => {
        const index = search( 'secret withdraw' );
        expect( index.hits.size ).toBe( 0 );
        expect( index.sourceOrder ).toEqual( [] );
        expect( index.totalHits ).toBe( 0 );
    } );

    it( 'marks only the outermost matching field', () => {
        const index = search( 'payout' );
        expect( index.hits.has( 'payout_switch' ) ).toBe( true );
        expect( index.hits.has( 'payout_key' ) ).toBe( true );
        expect( [ ...index.markRoots ] ).toEqual( [ 'payout_switch' ] );
    } );
} );

describe( 'settings search counts', () => {
    it( 'counts a switch and the detail panel that depends on it as one setting', () => {
        const index = search( 'facebook' );
        // fb_enabled + fb_keys group + fb_notice are one setting; fb_redirect and fb_legacy are their own.
        expect( index.counts.get( 'social' ) ).toBe( 3 );
        // Plus payout_switch (with its child) and store_banner.
        expect( index.totals.get( 'social' ) ).toBe( 5 );
        expect( index.counts.get( 'vendors' ) ).toBe( 3 );
    } );

    it( 'lists pages with matches in menu order and sums their counts', () => {
        const index = search( 'store' );
        expect( index.sourceOrder ).toEqual( [ 'general', 'onboarding', 'social' ] );
        expect( index.counts.get( 'vendors' ) ).toBe( 2 );
        expect( index.totalHits ).toBe( 3 );
    } );
} );

describe( 'settings search dependencies', () => {
    it( 'keeps a same-page controller visible and says how to reveal the match', () => {
        const index = search( 'commission amount' );
        expect( index.visible.has( 'commission_amount' ) ).toBe( true );
        expect( index.visible.has( 'marketplace_section' ) ).toBe( true );
        expect( index.visible.has( 'commission_type' ) ).toBe( true );
        expect( index.dependencyHints.get( 'commission_amount' ) ).toEqual( [
            expect.objectContaining( { label: 'Commission Type', location: undefined, action: 'change' } ),
        ] );
    } );

    it( 'names the page of a controller that lives elsewhere and leaves it hidden', () => {
        const index = search( 'store banner' );
        expect( index.visible.has( 'commission_type' ) ).toBe( false );
        expect( index.dependencyHints.get( 'store_banner' ) ).toEqual( [
            expect.objectContaining( { label: 'Commission Type', location: 'General', action: 'change' } ),
        ] );
    } );

    it( 'tells whether to turn the controller on or off', () => {
        const index = search( 'facebook' );
        expect( index.dependencyHints.get( 'fb_redirect' )?.[ 0 ].action ).toBe( 'on' );
        expect( index.dependencyHints.get( 'fb_legacy' )?.[ 0 ].action ).toBe( 'off' );
        // Fields inside a hidden group inherit the group's rule.
        expect( index.dependencyHints.get( 'fb_app_id' )?.[ 0 ] ).toEqual(
            expect.objectContaining( { label: 'Connect to Facebook', action: 'on' } )
        );
    } );
} );
