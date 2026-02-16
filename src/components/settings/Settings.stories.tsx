import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Settings } from './index';
import type { SettingsElement, SettingsProps } from './settings-types';
import image from './image.svg';
import image2 from './image2.svg';

// ============================================
// Event Log — shows onChange / onSave events
// ============================================

type LogEntry = {
    id: number;
    time: string;
    type: 'change' | 'save';
    pageId: string;
    key?: string;
    value?: any;
    values?: Record<string, any>;
};

function EventLog({ entries }: { entries: LogEntry[] }) {
    return (
        <div className="mt-4 rounded-lg border border-border bg-muted/40 max-h-64 overflow-y-auto">
            <div className="px-3 py-2 border-b border-border bg-muted/60 flex justify-between items-center">
                <span className="text-xs font-semibold text-foreground">Event Log</span>
                <span className="text-xs text-muted-foreground">{entries.length} events</span>
            </div>
            {entries.length > 0 ? (
                <div className="divide-y divide-border">
                    {entries.map((entry) => (
                        <div key={entry.id} className="px-3 py-2 text-xs font-mono">
                            <span className="text-muted-foreground">{entry.time}</span>{' '}
                            <span className={entry.type === 'save' ? 'text-green-600 font-bold' : 'text-blue-600 font-bold'}>
                                {entry.type === 'save' ? 'onSave' : 'onChange'}
                            </span>{' '}
                            <span className="text-orange-600">{`pageId="${entry.pageId}"`}</span>
                            {entry.type === 'change' && (
                                <>
                                    {' '}
                                    <span className="text-foreground">{`key="${entry.key}"`}</span>{' '}
                                    <span className="text-purple-600">
                                        {`value=${JSON.stringify(entry.value)}`}
                                    </span>
                                </>
                            )}
                            {entry.type === 'save' && (
                                <>
                                    {' '}
                                    <span className="text-foreground">
                                        values={JSON.stringify(entry.values, null, 0).slice(0, 120)}
                                        {JSON.stringify(entry.values).length > 120 ? '…' : ''}
                                    </span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="px-3 py-4 text-center text-xs text-muted-foreground italic">
                    No events yet. Interact with the settings to see events logged here.
                </div>
            )}
        </div>
    );
}

function useEventLog() {
    const [entries, setEntries] = useState<LogEntry[]>([]);
    const counter = useRef(0);

    const log = (entry: Omit<LogEntry, 'id' | 'time'>) => {
        counter.current += 1;
        setEntries((prev) => [
            {
                ...entry,
                id: counter.current,
                time: new Date().toLocaleTimeString(),
            },
            ...prev.slice(0, 49), // keep last 50
        ]);
    };

    return { entries, log };
}

// ============================================
// Sample Schema — exercises all field variants
// ============================================

// ============================================
// Sample Schema — exercises all field variants
// ============================================

const sampleSchema: SettingsElement[] = [
    // ── Page: General ──
    {
        id: 'general',
        type: 'page',
        label: 'General',
        priority: 10,
        children: [
            // Nested Subpage: Location (Nested Example)
            {
                id: 'location',
                type: 'subpage',
                label: 'Location',
                icon: 'MapPin',
                page_id: 'general',
                priority: 5,
                children: [
                    {
                        id: 'map_settings',
                        type: 'section',
                        label: 'Map Settings',
                        subpage_id: 'location',
                        priority: 10,
                        children: [
                            {
                                id: 'map_zoom',
                                type: 'field',
                                variant: 'number',
                                label: 'Map Zoom Level',
                                dependency_key: 'location.map_zoom_level',
                                default: 10,
                                min: 1,
                                max: 18,
                                section_id: 'map_settings',
                                priority: 10,
                                validations: [
                                    {
                                        rules: 'not_empty|min_value|max_value',
                                        message: '',
                                        params: { min: 1, max: 18 },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            // Subpage: Store
            {
                id: 'store',
                type: 'subpage',
                label: 'Store Settings',
                description: 'Configure your store defaults and appearance.',
                icon: 'Store',
                page_id: 'general',
                priority: 10,
                children: [
                    // Tab: Basic
                    {
                        id: 'store_basic',
                        type: 'tab',
                        label: 'Basic',
                        subpage_id: 'store',
                        priority: 10,
                        children: [
                            // Section: Address
                            {
                                id: 'address_section',
                                type: 'section',
                                label: 'Address Information',
                                description: 'Default address for your store.',
                                tab_id: 'store_basic',
                                priority: 10,
                                children: [
                                    {
                                        id: 'store_name',
                                        type: 'field',
                                        variant: 'text',
                                        label: 'Store Name',
                                        description: 'This is the display name of your store.',
                                        tooltip: 'Visible to customers and on invoices.',
                                        dependency_key: 'store_name',
                                        default: 'My Awesome Store',
                                        section_id: 'address_section',
                                        priority: 10,
                                        validations: [
                                            {
                                                rules: 'required',
                                                message: 'Store name is required.',
                                                params: {},
                                            },
                                        ],
                                    },
                                    {
                                        id: 'store_city',
                                        type: 'field',
                                        variant: 'text',
                                        label: 'City',
                                        dependency_key: 'store_city',
                                        placeholder: 'Enter city',
                                        section_id: 'address_section',
                                        priority: 20,
                                    },
                                    {
                                        id: 'store_color',
                                        type: 'field',
                                        variant: 'color_picker',
                                        label: 'Store Brand Color',
                                        description: 'Choose your primary brand color.',
                                        dependency_key: 'store_color',
                                        default: '#3b82f6',
                                        section_id: 'address_section',
                                        priority: 25,
                                    },
                                    {
                                        id: 'store_country',
                                        type: 'field',
                                        variant: 'select',
                                        label: 'Country',
                                        description: 'Select the country where your store is located.',
                                        dependency_key: 'store_country',
                                        default: 'us',
                                        options: [
                                            { value: 'us', label: 'United States' },
                                            { value: 'uk', label: 'United Kingdom' },
                                            { value: 'ca', label: 'Canada' },
                                            { value: 'au', label: 'Australia' },
                                            { value: 'bd', label: 'Bangladesh' },
                                        ],
                                        section_id: 'address_section',
                                        priority: 30,
                                    },
                                ],
                            },
                            // Section: Display
                            {
                                id: 'display_section',
                                type: 'section',
                                label: 'Display Options',
                                tab_id: 'store_basic',
                                priority: 20,
                                children: [
                                    {
                                        id: 'enable_store_listing',
                                        type: 'field',
                                        variant: 'switch',
                                        label: 'Enable Store Listing',
                                        description: 'Show the store on your public marketplace.',
                                        dependency_key: 'enable_store_listing',
                                        default: true,
                                        section_id: 'display_section',
                                        priority: 10,
                                    },
                                    {
                                        id: 'products_per_page',
                                        type: 'field',
                                        variant: 'number',
                                        label: 'Products Per Page',
                                        description: 'How many products to show per page.',
                                        dependency_key: 'products_per_page',
                                        default: 12,
                                        min: 1,
                                        max: 100,
                                        section_id: 'display_section',
                                        priority: 20,
                                        dependencies: [
                                            {
                                                key: 'enable_store_listing',
                                                value: true,
                                                comparison: '==',
                                            },
                                        ],
                                    },
                                    {
                                        id: 'layout_mode',
                                        type: 'field',
                                        variant: 'radio_capsule',
                                        label: 'Layout Mode',
                                        description: 'Choose a layout for the product grid.',
                                        dependency_key: 'layout_mode',
                                        default: 'grid',
                                        options: [
                                            { value: 'grid', label: 'Grid' },
                                            { value: 'list', label: 'List' },
                                            { value: 'compact', label: 'Compact' },
                                        ],
                                        section_id: 'display_section',
                                        priority: 30,
                                        dependencies: [
                                            {
                                                key: 'enable_store_listing',
                                                value: true,
                                                comparison: '==',
                                            },
                                        ],
                                    },
                                    {
                                        id: 'withdraw_charge_test',
                                        type: 'field',
                                        variant: 'combine_input',
                                        label: 'Withdraw Charge',
                                        description: 'Set the commission and fixed fee.',
                                        dependency_key: 'withdraw_charge_test',
                                        default: { admin_percentage: 10, additional_fee: 5 },
                                        section_id: 'display_section',
                                        priority: 35,
                                    },
                                    {
                                        id: 'withdraw_charge_swapped',
                                        type: 'field',
                                        variant: 'combine_input',
                                        label: 'Withdraw Charge (Swapped)',
                                        description: 'Fixed fee comes first here.',
                                        dependency_key: 'withdraw_charge_swapped',
                                        default: { admin_percentage: 10, additional_fee: 5 },
                                        swapped: true,
                                        money_sign: '€',
                                        section_id: 'display_section',
                                        priority: 40,
                                    },
                                ],
                            },
                        ],
                    },
                    // Tab: Advanced
                    {
                        id: 'store_advanced',
                        type: 'tab',
                        label: 'Advanced',
                        subpage_id: 'store',
                        priority: 20,
                        children: [
                            {
                                id: 'advanced_section',
                                type: 'section',
                                label: 'Advanced Settings',
                                description: 'Careful, these settings affect the whole store.',
                                tab_id: 'store_advanced',
                                priority: 10,
                                children: [
                                    {
                                        id: 'custom_css',
                                        type: 'field',
                                        variant: 'textarea',
                                        label: 'Custom CSS',
                                        description: 'Add custom CSS styles for your store.',
                                        dependency_key: 'custom_css',
                                        placeholder: '/* Enter your custom CSS here */',
                                        section_id: 'advanced_section',
                                        priority: 10,
                                    },
                                    {
                                        id: 'html_block',
                                        type: 'field',
                                        variant: 'html',
                                        label: 'Information',
                                        html_content:
                                            '<p style="color: #666; padding: 12px; background: #f8f8f8; border-radius: 6px;">This is an HTML block rendered from your settings schema. It can contain <strong>any HTML content</strong>.</p>',
                                        section_id: 'advanced_section',
                                        priority: 20,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            // Subpage: Selling
            {
                id: 'selling',
                type: 'subpage',
                label: 'Selling Options',
                description: 'Configure selling behavior for vendors.',
                icon: 'ShoppingCart',
                page_id: 'general',
                priority: 20,
                children: [
                    {
                        id: 'selling_section',
                        type: 'section',
                        label: 'Selling Configuration',
                        subpage_id: 'selling',
                        priority: 10,
                        children: [
                            {
                                id: 'commission_type',
                                type: 'field',
                                variant: 'select',
                                label: 'Commission Type',
                                description: 'How commission is calculated for vendors.',
                                dependency_key: 'commission_type',
                                default: 'percentage',
                                options: [
                                    { value: 'percentage', label: 'Percentage' },
                                    { value: 'flat', label: 'Flat Rate' },
                                    { value: 'combined', label: 'Combined' },
                                ],
                                section_id: 'selling_section',
                                priority: 10,
                            },
                            {
                                id: 'commission_rate',
                                type: 'field',
                                variant: 'number',
                                label: 'Commission Rate',
                                description: 'The commission percentage for vendors.',
                                dependency_key: 'commission_rate',
                                default: 10,
                                postfix: '%',
                                min: 0,
                                max: 100,
                                section_id: 'selling_section',
                                priority: 20,
                            },
                            {
                                id: 'allowed_categories',
                                type: 'field',
                                variant: 'multicheck',
                                label: 'Allowed Product Categories',
                                description: 'Select which categories vendors can sell in.',
                                dependency_key: 'allowed_categories',
                                default: ['electronics', 'clothing'],
                                options: [
                                    { value: 'electronics', label: 'Electronics' },
                                    { value: 'clothing', label: 'Clothing' },
                                    { value: 'home', label: 'Home & Garden' },
                                    { value: 'sports', label: 'Sports' },
                                    { value: 'books', label: 'Books' },
                                ],
                                section_id: 'selling_section',
                                priority: 30,
                            },
                            {
                                id: 'store_template',
                                type: 'field',
                                variant: 'customize_radio',
                                label: 'Store Template',
                                description: 'Choose a template for vendor store pages.',
                                dependency_key: 'store_template',
                                default: 'default',
                                options: [
                                    { value: 'default', label: 'Default', description: 'Standard layout with sidebar' },
                                    { value: 'modern', label: 'Modern', description: 'Full-width hero layout' },
                                    { value: 'minimal', label: 'Minimal', description: 'Clean and simple' },
                                ],
                                section_id: 'selling_section',
                                priority: 40,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    // ── Page: Payments ──
    {
        id: 'payments',
        type: 'page',
        label: 'Payments',
        priority: 20,
        children: [
            {
                id: 'payment_methods',
                type: 'subpage',
                label: 'Payment Methods',
                description: 'Manage your payment gateways.',
                icon: 'CreditCard',
                page_id: 'payments',
                priority: 10,
                children: [
                    {
                        id: 'payments_section',
                        type: 'section',
                        label: 'Gateway Settings',
                        subpage_id: 'payment_methods',
                        priority: 10,
                        children: [
                            {
                                id: 'enable_paypal',
                                type: 'field',
                                variant: 'switch',
                                label: 'Enable PayPal',
                                description: 'Allow payments via PayPal.',
                                dependency_key: 'enable_paypal',
                                default: true,
                                section_id: 'payments_section',
                                priority: 10,
                            },
                            {
                                id: 'paypal_email',
                                type: 'field',
                                variant: 'text',
                                label: 'PayPal Email',
                                placeholder: 'you@example.com',
                                dependency_key: 'paypal_email',
                                section_id: 'payments_section',
                                priority: 20,
                                dependencies: [
                                    {
                                        key: 'enable_paypal',
                                        value: true,
                                        comparison: '==',
                                    },
                                ],
                                validations: [
                                    {
                                        rules: 'required',
                                        message: 'PayPal email is required when PayPal is enabled.',
                                        params: {},
                                    },
                                ],
                            },
                            {
                                id: 'enable_stripe',
                                type: 'field',
                                variant: 'switch',
                                label: 'Enable Stripe',
                                description: 'Accept credit card payments through Stripe.',
                                dependency_key: 'enable_stripe',
                                default: false,
                                section_id: 'payments_section',
                                priority: 30,
                            },
                            {
                                id: 'label_info',
                                type: 'field',
                                variant: 'base_field_label',
                                label: 'Need more gateways?',
                                description: 'Contact support for additional payment integrations.',
                                doc_link: 'https://example.com/docs/payments',
                                section_id: 'payments_section',
                                priority: 40,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

// ============================================
// Flat Sample Schema — tests the formatter
// Every element is a flat object with parent pointers.
// The formatter builds the hierarchy automatically.
// ============================================

const flatSampleSchema: SettingsElement[] = [
    // ── Pages ──
    { id: 'general', type: 'page', label: 'General', icon: 'Settings', priority: 10 },
    { id: 'payments', type: 'page', label: 'Payments', icon: 'CreditCard', priority: 20 },
    { id: 'appearance', type: 'page', label: 'Appearance', icon: 'Palette', priority: 30 },

    // ── Subpages under General ──
    {
        id: 'store',
        type: 'subpage',
        label: 'Store Settings',
        description: 'Configure your store defaults and appearance.',
        icon: 'Store',
        page_id: 'general',
        priority: 10,
    },
    {
        id: 'selling',
        type: 'subpage',
        label: 'Selling Options',
        description: 'Configure selling behavior for vendors.',
        icon: 'ShoppingCart',
        page_id: 'general',
        priority: 20,
    },
    {
        id: 'location',
        type: 'subpage',
        label: 'Location',
        icon: 'MapPin',
        page_id: 'general',
        priority: 30,
    },

    // ── Subpages under Payments ──
    {
        id: 'payment_methods',
        type: 'subpage',
        label: 'Payment Methods',
        description: 'Manage your payment gateways.',
        icon: 'CreditCard',
        page_id: 'payments',
        priority: 10,
    },
    {
        id: 'withdraw',
        type: 'subpage',
        label: 'Withdraw Settings',
        description: 'Configure vendor withdrawal options.',
        icon: 'Wallet',
        page_id: 'payments',
        priority: 20,
    },

    // ── Subpages under Appearance ──
    {
        id: 'theme',
        type: 'subpage',
        label: 'Theme',
        description: 'Customize the look and feel.',
        icon: 'Brush',
        page_id: 'appearance',
        priority: 10,
    },

    // ── Tabs under Store Settings ──
    { id: 'store_basic', type: 'tab', label: 'Basic', page_id: 'store', priority: 10 },
    { id: 'store_advanced', type: 'tab', label: 'Advanced', page_id: 'store', priority: 20 },

    // ── Sections under Store > Basic tab ──
    {
        id: 'address_section',
        type: 'section',
        label: 'Address Information',
        description: 'Default address for your store.',
        section_id: 'store_basic',
        priority: 10,
    },
    {
        id: 'display_section',
        type: 'section',
        label: 'Display Options',
        section_id: 'store_basic',
        priority: 20,
    },

    // ── Section under Store > Advanced tab ──
    {
        id: 'advanced_section',
        type: 'section',
        label: 'Advanced Settings',
        description: 'Careful, these settings affect the whole store.',
        section_id: 'store_advanced',
        priority: 10,
    },

    // ── Section under Selling ──
    {
        id: 'selling_section',
        type: 'section',
        label: 'Selling Configuration',
        page_id: 'selling',
        priority: 10,
    },

    // ── Sections under Location ──
    {
        id: 'map_settings',
        type: 'section',
        label: 'Map Settings',
        page_id: 'location',
        priority: 10,
    },

    // ── Section under Payment Methods ──
    {
        id: 'payments_section',
        type: 'section',
        label: 'Gateway Settings',
        page_id: 'payment_methods',
        priority: 10,
    },

    // ── Section under Withdraw (with subsections) ──
    {
        id: 'withdraw_options_section',
        type: 'section',
        label: 'Withdrawal Schedule',
        description: 'Configure how often vendors can withdraw earnings.',
        page_id: 'withdraw',
        priority: 10,
    },

    // ── Subsections under Withdraw > withdraw_options_section ──
    {
        id: 'weekly_schedule',
        type: 'subsection',
        label: 'Weekly Schedule',
        section_id: 'withdraw_options_section',
        priority: 10,
        dependencies: [
            { key: 'withdraw.withdraw_options_section.withdraw_frequency', value: 'weekly', comparison: '==' },
        ],
    },
    {
        id: 'monthly_schedule',
        type: 'subsection',
        label: 'Monthly Schedule',
        section_id: 'withdraw_options_section',
        priority: 20,
        dependencies: [
            { key: 'withdraw.withdraw_options_section.withdraw_frequency', value: 'monthly', comparison: '==' },
        ],
    },

    // ── Fieldgroup under Withdraw (inside weekly_schedule subsection) ──
    {
        id: 'weekly_timing_group',
        type: 'fieldgroup',
        label: '',
        section_id: 'weekly_schedule',
        priority: 10,
    },

    // ── Section under Theme (fields directly under subpage — no section) ──
    // (Theme subpage will also have a direct field to test subpage → field)

    // ══════════════════════════════════════════
    //  FIELDS
    // ══════════════════════════════════════════

    // ── Address section fields ──
    {
        id: 'store_name',
        type: 'field',
        variant: 'text',
        label: 'Store Name',
        description: 'This is the display name of your store.',
        tooltip: 'Visible to customers and on invoices.',
        default: 'My Awesome Store',
        section_id: 'address_section',
        priority: 10,
        validations: [{ rules: 'required', message: 'Store name is required.', params: {} }],
    },
    {
        id: 'store_city',
        type: 'field',
        variant: 'text',
        label: 'City',
        placeholder: 'Enter city',
        section_id: 'address_section',
        priority: 20,
    },
    {
        id: 'store_country',
        type: 'field',
        variant: 'select',
        label: 'Country',
        description: 'Select the country where your store is located.',
        default: 'us',
        options: [
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'ca', label: 'Canada' },
            { value: 'au', label: 'Australia' },
            { value: 'bd', label: 'Bangladesh' },
        ],
        section_id: 'address_section',
        priority: 30,
    },

    // ── Display section fields ──
    {
        id: 'enable_store_listing',
        type: 'field',
        variant: 'switch',
        label: 'Enable Store Listing',
        description: 'Show the store on your public marketplace.',
        default: true,
        section_id: 'display_section',
        priority: 10,
    },
    {
        id: 'products_per_page',
        type: 'field',
        variant: 'number',
        label: 'Products Per Page',
        description: 'How many products to show per page.',
        default: 12,
        min: 1,
        max: 100,
        section_id: 'display_section',
        priority: 20,
        dependencies: [{ key: 'enable_store_listing', value: true, comparison: '==' }],
    },
    {
        id: 'layout_mode',
        type: 'field',
        variant: 'radio_capsule',
        label: 'Layout Mode',
        description: 'Choose a layout for the product grid.',
        default: 'grid',
        options: [
            { value: 'grid', label: 'Grid' },
            { value: 'list', label: 'List' },
            { value: 'compact', label: 'Compact' },
        ],
        section_id: 'display_section',
        priority: 30,
        dependencies: [{ key: 'enable_store_listing', value: true, comparison: '==' }],
    },

    // ── Advanced section fields ──
    {
        id: 'custom_css',
        type: 'field',
        variant: 'textarea',
        label: 'Custom CSS',
        description: 'Add custom CSS styles for your store.',
        placeholder: '/* Enter your custom CSS here */',
        section_id: 'advanced_section',
        priority: 10,
    },
    {
        id: 'html_block',
        type: 'field',
        variant: 'html',
        label: 'Information',
        html_content:
            '<p style="color: #666; padding: 12px; background: #f8f8f8; border-radius: 6px;">This is an HTML block rendered from your settings schema. It can contain <strong>any HTML content</strong>.</p>',
        section_id: 'advanced_section',
        priority: 20,
    },

    // ── Selling section fields ──
    {
        id: 'commission_type',
        type: 'field',
        variant: 'select',
        label: 'Commission Type',
        description: 'How commission is calculated for vendors.',
        default: 'percentage',
        options: [
            { value: 'percentage', label: 'Percentage' },
            { value: 'flat', label: 'Flat Rate' },
            { value: 'combined', label: 'Combined' },
        ],
        section_id: 'selling_section',
        priority: 10,
    },
    {
        id: 'commission_rate',
        type: 'field',
        variant: 'number',
        label: 'Commission Rate',
        description: 'The commission percentage for vendors.',
        default: 10,
        postfix: '%',
        min: 0,
        max: 100,
        section_id: 'selling_section',
        priority: 20,
    },
    {
        id: 'allowed_categories',
        type: 'field',
        variant: 'multicheck',
        label: 'Allowed Product Categories',
        description: 'Select which categories vendors can sell in.',
        default: ['electronics', 'clothing'],
        options: [
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'home', label: 'Home & Garden' },
            { value: 'sports', label: 'Sports' },
            { value: 'books', label: 'Books' },
        ],
        section_id: 'selling_section',
        priority: 30,
    },
    {
        id: 'store_template',
        type: 'field',
        variant: 'customize_radio',
        label: 'Store Template',
        description: 'Choose a template for vendor store pages.',
        default: 'default',
        options: [
            { value: 'default', label: 'Default', description: 'Standard layout with sidebar' },
            { value: 'modern', label: 'Modern', description: 'Full-width hero layout' },
            { value: 'minimal', label: 'Minimal', description: 'Clean and simple' },
        ],
        section_id: 'selling_section',
        priority: 40,
    },

    // ── Map Settings fields ──
    {
        id: 'map_zoom',
        type: 'field',
        variant: 'number',
        label: 'Map Zoom Level',
        default: 10,
        min: 1,
        max: 18,
        section_id: 'map_settings',
        priority: 10,
        validations: [{ rules: 'not_empty|min_value|max_value', message: '', params: { min: 1, max: 18 } }],
    },

    // ── Payment Methods section fields ──
    {
        id: 'enable_paypal',
        type: 'field',
        variant: 'switch',
        label: 'Enable PayPal',
        description: 'Allow payments via PayPal.',
        default: true,
        section_id: 'payments_section',
        priority: 10,
    },
    {
        id: 'paypal_email',
        type: 'field',
        variant: 'text',
        label: 'PayPal Email',
        placeholder: 'you@example.com',
        section_id: 'payments_section',
        priority: 20,
        dependencies: [{ key: 'enable_paypal', value: true, comparison: '==' }],
        validations: [{ rules: 'required', message: 'PayPal email is required when PayPal is enabled.', params: {} }],
    },
    {
        id: 'enable_stripe',
        type: 'field',
        variant: 'switch',
        label: 'Enable Stripe',
        description: 'Accept credit card payments through Stripe.',
        default: false,
        section_id: 'payments_section',
        priority: 30,
    },
    {
        id: 'label_info',
        type: 'field',
        variant: 'base_field_label',
        label: 'Need more gateways?',
        description: 'Contact support for additional payment integrations.',
        doc_link: 'https://example.com/docs/payments',
        section_id: 'payments_section',
        priority: 40,
    },

    // ── Withdraw section fields ──
    {
        id: 'withdraw_frequency',
        type: 'field',
        variant: 'select',
        label: 'Withdraw Frequency',
        description: 'How often can vendors withdraw their earnings.',
        default: 'weekly',
        options: [
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
        ],
        section_id: 'withdraw_options_section',
        priority: 5,
    },

    // ── Fields inside weekly_schedule subsection → weekly_timing_group fieldgroup ──
    {
        id: 'weekly_day',
        type: 'field',
        variant: 'select',
        label: 'Day of Week',
        description: 'Which day of the week should withdrawals be processed.',
        default: 'monday',
        options: [
            { value: 'monday', label: 'Monday' },
            { value: 'wednesday', label: 'Wednesday' },
            { value: 'friday', label: 'Friday' },
        ],
        field_group_id: 'weekly_timing_group',
        priority: 10,
    },
    {
        id: 'weekly_time',
        type: 'field',
        variant: 'text',
        label: 'Time',
        description: 'Time of day (24h format).',
        default: '09:00',
        placeholder: 'HH:MM',
        field_group_id: 'weekly_timing_group',
        priority: 20,
    },

    // ── Fields inside monthly_schedule subsection (direct, no fieldgroup) ──
    {
        id: 'monthly_day',
        type: 'field',
        variant: 'number',
        label: 'Day of Month',
        description: 'Which day of the month should withdrawals be processed.',
        default: 1,
        min: 1,
        max: 28,
        section_id: 'monthly_schedule',
        priority: 10,
    },

    // ── Theme subpage: direct fields (no section wrapper) ──
    {
        id: 'color_scheme',
        type: 'field',
        variant: 'radio_capsule',
        label: 'Color Scheme',
        description: 'Choose the primary color scheme for the storefront.',
        default: 'light',
        options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'System' },
        ],
        page_id: 'theme',
        priority: 10,
    },
    {
        id: 'font_size',
        type: 'field',
        variant: 'number',
        label: 'Base Font Size',
        description: 'The base font size in pixels.',
        default: 16,
        min: 12,
        max: 24,
        postfix: 'px',
        page_id: 'theme',
        priority: 20,
    },
];

// ============================================
// Meta
// ============================================

const meta = {
    title: 'Components/Settings',
    component: Settings,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'A schema-driven settings page component. Accepts a hierarchical or flat settings schema, ' +
                    'renders a sidebar menu, tabbed content, sections, and field components. ' +
                    'All state (values, navigation) is managed internally via React Context. ' +
                    'Consumers provide `onChange` and `onSave` callbacks for persistence.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        schema: { control: false },
        values: { control: false },
        onChange: { action: 'onChange' },
        onSave: { action: 'onSave' },
        loading: { control: 'boolean' },
        title: { control: 'text' },
        hookPrefix: { control: 'text' },
    },
} satisfies Meta<typeof Settings>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// Story wrapper components (proper React components for hooks)
// ============================================

function SettingsStoryWrapper({
    initialValues = {},
    ...args
}: SettingsProps & { initialValues?: Record<string, unknown> }) {
    const [values, setValues] = useState<Record<string, unknown>>(initialValues);
    const { entries, log } = useEventLog();

    return (
        <div className="flex flex-col gap-4">
            <div className="h-[700px] flex flex-col">
                <Settings
                    {...args}
                    className="flex-1"
                    values={values}
                    onChange={(scopeId, key, value) => {
                        setValues((prev) => ({ ...prev, [key]: value }));
                        log({ type: 'change', pageId: scopeId, key, value });
                    }}
                    onSave={(scopeId, scopeValues) => {
                        // eslint-disable-next-line no-console
                        console.log(`Save scope "${scopeId}":`, scopeValues);
                        log({ type: 'save', pageId: scopeId, values: scopeValues });
                    }}
                    renderSaveButton={({ dirty, onSave: save }) => (
                        <Button onClick={save} disabled={!dirty}>
                            <Save className="size-4 mr-2" />
                            Save Changes
                        </Button>
                    )}
                />
            </div>
            <EventLog entries={entries} />
        </div>
    );
}

// ============================================
// Stories
// ============================================

/** Full settings page with sidebar navigation, tabs, sections, and various field types. */
export const Default: Story = {
    args: {
        schema: sampleSchema,
        title: 'Settings',
        loading: false,
        hookPrefix: 'my_plugin',
    },
    render: (args) => <SettingsStoryWrapper {...args} />,
};

/** Loading state. */
export const Loading: Story = {
    args: {
        schema: sampleSchema,
        loading: true,
        title: 'Settings',
    },
};

/** With pre-populated values. */
export const WithValues: Story = {
    args: {
        schema: sampleSchema,
        title: 'Acme Store Settings',
    },
    render: (args) => (
        <SettingsStoryWrapper
            {...args}
            initialValues={{
                store_name: 'Acme Store',
                store_city: 'San Francisco',
                store_country: 'us',
                enable_store_listing: true,
                products_per_page: 24,
                layout_mode: 'list',
                commission_type: 'percentage',
                commission_rate: 15,
                allowed_categories: ['electronics', 'clothing', 'books'],
                enable_paypal: true,
                paypal_email: 'acme@example.com',
                enable_stripe: true,
                'location.map_zoom_level': 14,
            }}
        />
    ),
};

/** Dependency demo — toggle the switch to show/hide dependent fields. */
export const DependencyDemo: Story = {
    args: {
        schema: sampleSchema,
        title: 'Dependency Demo',
    },
    render: (args) => (
        <SettingsStoryWrapper
            {...args}
            initialValues={{ enable_store_listing: false }}
        />
    ),
};

// ============================================
// Flat Array Stories
// ============================================

/**
 * Flat array schema — the formatter auto-builds the hierarchy.
 *
 * Exercises: pages, subpages, tabs, sections, subsections, fieldgroups,
 * fields directly under subpages (no section), and dependency-based
 * subsection visibility.
 */
export const FlatArray: Story = {
    args: {
        schema: flatSampleSchema,
        title: 'Flat Array Settings',
        hookPrefix: 'flat_demo',
    },
    render: (args) => <SettingsStoryWrapper {...args} />,
};

/** Flat array with pre-populated values. */
export const FlatArrayWithValues: Story = {
    args: {
        schema: flatSampleSchema,
        title: 'Flat Array (Pre-populated)',
    },
    render: (args) => (
        <SettingsStoryWrapper
            {...args}
            initialValues={{
                'store.store_basic.address_section.store_name': 'Acme Store',
                'store.store_basic.address_section.store_city': 'San Francisco',
                'store.store_basic.address_section.store_country': 'us',
                'store.store_basic.display_section.enable_store_listing': true,
                'store.store_basic.display_section.products_per_page': 24,
                'store.store_basic.display_section.layout_mode': 'list',
                'selling.selling_section.commission_type': 'percentage',
                'selling.selling_section.commission_rate': 15,
                'selling.selling_section.allowed_categories': ['electronics', 'clothing', 'books'],
                'payment_methods.payments_section.enable_paypal': true,
                'payment_methods.payments_section.paypal_email': 'acme@example.com',
                'withdraw.withdraw_options_section.withdraw_frequency': 'weekly',
                'withdraw.withdraw_options_section.weekly_schedule.weekly_timing_group.weekly_day': 'monday',
                'theme.color_scheme': 'dark',
                'theme.font_size': 18,
            }}
        />
    ),
};

// ============================================
// Single Page (no sidebar) — page without subpages
// ============================================

const singlePageSchema: SettingsElement[] = [
    {
        id: 'email_settings',
        type: 'page',
        label: 'Email Settings',
        description: 'Configure email notification preferences.',
        icon: 'Mail',
        children: [
            {
                id: 'notifications_section',
                type: 'section',
                label: 'Notifications',
                children: [
                    {
                        id: 'admin_email',
                        type: 'field',
                        variant: 'text',
                        label: 'Admin Email',
                        description: 'Primary email for admin notifications.',
                        default: 'admin@example.com',
                        dependency_key: 'admin_email',
                    },
                    {
                        id: 'enable_notifications',
                        type: 'field',
                        variant: 'switch',
                        label: 'Enable Notifications',
                        description: 'Send email notifications for new orders.',
                        default: true,
                        dependency_key: 'enable_notifications',
                    },
                    {
                        id: 'notification_frequency',
                        type: 'field',
                        variant: 'select',
                        label: 'Frequency',
                        default: 'instant',
                        options: [
                            { value: 'instant', label: 'Instant' },
                            { value: 'hourly', label: 'Hourly Digest' },
                            { value: 'daily', label: 'Daily Digest' },
                        ],
                        dependency_key: 'notification_frequency',
                        dependencies: [{ key: 'enable_notifications', value: true, comparison: '==' }],
                    },
                ],
            },
        ],
    },
];

/**
 * Single page with no subpages — sidebar is auto-hidden.
 * Demonstrates that the menu bar is hidden when there is only one navigable item.
 */
export const SinglePage: Story = {
    args: {
        schema: singlePageSchema,
        title: 'Email Settings',
    },
    render: (args) => <SettingsStoryWrapper {...args} />,
};

// ============================================
// Mixed: pages with and without subpages
// ============================================

const mixedSchema: SettingsElement[] = [
    // Page WITH subpages
    {
        id: 'general',
        type: 'page',
        label: 'General',
        icon: 'Settings',
        children: [
            {
                id: 'store',
                type: 'subpage',
                label: 'Store Settings',
                icon: 'Store',
                children: [
                    {
                        id: 'store_section',
                        type: 'section',
                        label: 'Store Info',
                        children: [
                            {
                                id: 'store_name',
                                type: 'field',
                                variant: 'text',
                                label: 'Store Name',
                                default: 'My Store',
                                dependency_key: 'store_name',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'appearance',
                type: 'subpage',
                label: 'Appearance',
                icon: 'Palette',
                children: [
                    {
                        id: 'appearance_section',
                        type: 'section',
                        label: 'Theme',
                        children: [
                            {
                                id: 'color_scheme',
                                type: 'field',
                                variant: 'radio_capsule',
                                label: 'Color Scheme',
                                default: 'light',
                                options: [
                                    { value: 'light', label: 'Light' },
                                    { value: 'dark', label: 'Dark' },
                                    { value: 'auto', label: 'Auto' },
                                ],
                                dependency_key: 'color_scheme',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    // Page WITHOUT subpages — appears as a leaf menu item alongside "General"
    {
        id: 'about',
        type: 'page',
        label: 'About',
        description: 'Plugin information and version details.',
        icon: 'Info',
        children: [
            {
                id: 'about_section',
                type: 'section',
                label: 'Version',
                children: [
                    {
                        id: 'version_info',
                        type: 'field',
                        variant: 'html',
                        label: 'Current Version',
                        html_content: '<p><strong>v2.5.0</strong> — Released Feb 2026</p>',
                    },
                ],
            },
        ],
    },
];

/**
 * Mixed schema: one page with subpages + one page without.
 * Demonstrates pages with and without submenus coexisting in the sidebar.
 */
export const MixedPages: Story = {
    args: {
        schema: mixedSchema,
        title: 'Plugin Settings',
    },
    render: (args) => <SettingsStoryWrapper {...args} />,
};

const dokanSettingsSchema: SettingsElement[] = [
    {
        "id": "general",
        "type": "page",
        "title": "General",
        "icon": "Settings",
        "tooltip": "",
        "display": true,
        "hook_key": "dokan_settings_general",
        "children": [
            {
                "id": "marketplace",
                "type": "subpage",
                "title": "Marketplace",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_general_marketplace",
                "children": [
                    {
                        "id": "marketplace_settings",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_general_marketplace_marketplace_settings",
                        "children": [
                            {
                                "id": "vendor_store_url",
                                "type": "field",
                                "title": "Vendor Store URL",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_general_marketplace_marketplace_settings_vendor_store_url",
                                "children": [],
                                "description": "Define the vendor store URL (https://core-dokan.test/[this-text]/[vendor-name])",
                                "dependency_key": "marketplace.marketplace_settings.vendor_store_url",
                                "dependencies": [],
                                "validations": [
                                    {
                                        "rules": "not_in",
                                        "message": "The store URL &quot;%s&quot; is reserved by WordPress and cannot be used. Please choose a different value like &quot;store&quot;.",
                                        "params": {
                                            "values": [
                                                "s",
                                                "p",
                                                "page",
                                                "paged",
                                                "author",
                                                "feed",
                                                "search",
                                                "post",
                                                "tag",
                                                "category",
                                                "attachment",
                                                "name",
                                                "order",
                                                "orderby",
                                                "rest",
                                                "rest_route",
                                                "wp-json",
                                                "shop",
                                                "cart",
                                                "checkout"
                                            ]
                                        },
                                        "self": "marketplace.marketplace_settings.vendor_store_url"
                                    }
                                ],
                                "variant": "text",
                                "value": "store",
                                "default": "store",
                                "placeholder": "Store",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "layout": "full-width"
                            },
                            {
                                "id": "enable_single_seller_mode",
                                "type": "field",
                                "title": "Single Seller Mode",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_general_marketplace_marketplace_settings_enable_single_seller_mode",
                                "children": [],
                                "description": "Restrict customers from purchasing products from multiple vendors in a single order.",
                                "dependency_key": "marketplace.marketplace_settings.enable_single_seller_mode",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "store_category_mode",
                                "type": "field",
                                "title": "Store Category",
                                "icon": "",
                                "tooltip": "Only admin can create store categories from Dashboard -&gt; Vendors -&gt; Store Categories to assign categories from vendor listing page. If you select single, vendor will only have one category available during store setup or when navigating to vendor Dashboard -&gt; Store -&gt; Store categories. If you select multiple, multiple categories will be available. Select none if you don&#039;t want either.",
                                "display": true,
                                "hook_key": "dokan_settings_general_marketplace_marketplace_settings_store_category_mode",
                                "children": [],
                                "description": "",
                                "dependency_key": "marketplace.marketplace_settings.store_category_mode",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "none",
                                "default": "single",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "none",
                                        "title": "None",
                                        "icon": ""
                                    },
                                    {
                                        "value": "single",
                                        "title": "Single",
                                        "icon": ""
                                    },
                                    {
                                        "value": "multiple",
                                        "title": "Multiple",
                                        "icon": ""
                                    }
                                ]
                            },
                            {
                                "id": "show_customer_details_to_vendors",
                                "type": "field",
                                "title": "Show Customer Details to Vendors",
                                "icon": "",
                                "tooltip": "It will show customer information from the &quot;General Details&quot; section of the single order details page.",
                                "display": true,
                                "hook_key": "dokan_settings_general_marketplace_marketplace_settings_show_customer_details_to_vendors",
                                "children": [],
                                "description": "Allow vendors to view customer shipping and contact information for orders.",
                                "dependency_key": "marketplace.marketplace_settings.show_customer_details_to_vendors",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "guest_product_enquiry",
                                "type": "field",
                                "title": "Guest Product Enquiry",
                                "icon": "",
                                "tooltip": "When checked, user can inquire about products from the product page without signing in.",
                                "display": true,
                                "hook_key": "dokan_settings_general_marketplace_marketplace_settings_guest_product_enquiry",
                                "children": [],
                                "description": "Guest customers can submit product enquiries without logging in.",
                                "dependency_key": "marketplace.marketplace_settings.guest_product_enquiry",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "add_to_cart_button_visibility",
                                "type": "field",
                                "title": "Add to Cart Button Visibility",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_general_marketplace_marketplace_settings_add_to_cart_button_visibility",
                                "children": [],
                                "description": "Control &#039;Add to Cart&#039; button visibility based on your marketplace model.",
                                "dependency_key": "marketplace.marketplace_settings.add_to_cart_button_visibility",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            }
                        ],
                        "description": "",
                        "dependency_key": "marketplace.marketplace_settings",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "live_search",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_general_marketplace_live_search",
                        "children": [
                            {
                                "id": "live_search_base",
                                "type": "field",
                                "title": "Live Search Options",
                                "icon": "",
                                "tooltip": "Select one option which one will apply on search box.",
                                "display": true,
                                "hook_key": "dokan_settings_general_marketplace_live_search_live_search_base",
                                "children": [],
                                "description": "Choose how search results should be displayed to users",
                                "dependency_key": "marketplace.live_search.live_search_base",
                                "dependencies": [],
                                "validations": [],
                                "variant": "base_field_label",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "suffix": "",
                                "doc_link": "https://wedevs.com/docs/dokan/developers/live-search/",
                                "doc_link_text": "Doc"
                            },
                            {
                                "id": "search_box_radio",
                                "type": "field",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_general_marketplace_live_search_search_box_radio",
                                "children": [],
                                "description": "",
                                "dependency_key": "marketplace.live_search.search_box_radio",
                                "dependencies": [],
                                "validations": [],
                                "variant": "customize_radio",
                                "value": "old_live_search",
                                "default": "suggestion_box",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "title": "Search with Suggestion Box",
                                        "value": "suggestion_box",
                                        "image": image,
                                        "preview": true,
                                        "description": ""
                                    },
                                    {
                                        "title": "Autoload Replace Current Content",
                                        "value": "old_live_search",
                                        "image": image2,
                                        "preview": true
                                    }
                                ],
                                "radio_variant": "card",
                                "css_class": "!mt-0",
                                "grid_config": []
                            }
                        ],
                        "description": "",
                        "dependency_key": "marketplace.live_search",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Configure core marketplace functionalities and customer shopping experience.",
                "dependency_key": "marketplace",
                "dependencies": [],
                "validations": [],
                "priority": 100,
                "doc_link": "https://wedevs.com/docs/dokan/developers/marketplace/",
                "doc_link_text": "Doc",
            },
            {
                "id": "dokan_pages",
                "type": "subpage",
                "title": "Page Setup",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_general_dokan_pages",
                "children": [
                    {
                        "id": "dashboard_section",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_general_dokan_pages_dashboard_section",
                        "children": [
                            {
                                "id": "dashboard",
                                "type": "field",
                                "title": "Dashboard",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_general_dokan_pages_dashboard_section_dashboard",
                                "children": [],
                                "description": "Select a page to show vendor dashboard.",
                                "dependency_key": "dokan_pages.dashboard_section.dashboard",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select",
                                "value": "6",
                                "default": "",
                                "placeholder": "Select page",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": 582,
                                        "title": "Classic Cart"
                                    },
                                    {
                                        "value": 329,
                                        "title": ""
                                    },
                                    {
                                        "value": 320,
                                        "title": "Single Product"
                                    },
                                    {
                                        "value": 316,
                                        "title": "Block Shop"
                                    },
                                    {
                                        "value": 106,
                                        "title": "Vendor registration"
                                    },
                                    {
                                        "value": 61,
                                        "title": "Product Subscription"
                                    },
                                    {
                                        "value": 60,
                                        "title": "Request for Quote"
                                    },
                                    {
                                        "value": 54,
                                        "title": "Checkout 2"
                                    },
                                    {
                                        "value": 222,
                                        "title": "My account Bn"
                                    },
                                    {
                                        "value": 219,
                                        "title": "My account"
                                    },
                                    {
                                        "value": 13,
                                        "title": "My account"
                                    },
                                    {
                                        "value": 12,
                                        "title": "Checkout"
                                    },
                                    {
                                        "value": 11,
                                        "title": "Cart"
                                    },
                                    {
                                        "value": 10,
                                        "title": "Shop"
                                    },
                                    {
                                        "value": 194,
                                        "title": "test-board"
                                    },
                                    {
                                        "value": 8,
                                        "title": "My Orders"
                                    },
                                    {
                                        "value": 7,
                                        "title": "Store List"
                                    },
                                    {
                                        "value": 6,
                                        "title": "Dashboard"
                                    },
                                    {
                                        "value": 2,
                                        "title": "Sample Page"
                                    }
                                ]
                            }
                        ],
                        "description": "",
                        "dependency_key": "dokan_pages.dashboard_section",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "my_orders_section",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_general_dokan_pages_my_orders_section",
                        "children": [
                            {
                                "id": "my_orders",
                                "type": "field",
                                "title": "My Orders",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_general_dokan_pages_my_orders_section_my_orders",
                                "children": [],
                                "description": "Select a page to show my orders",
                                "dependency_key": "dokan_pages.my_orders_section.my_orders",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select",
                                "value": "8",
                                "default": "",
                                "placeholder": "Select page",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": 582,
                                        "title": "Classic Cart"
                                    },
                                    {
                                        "value": 329,
                                        "title": ""
                                    },
                                    {
                                        "value": 320,
                                        "title": "Single Product"
                                    },
                                    {
                                        "value": 316,
                                        "title": "Block Shop"
                                    },
                                    {
                                        "value": 106,
                                        "title": "Vendor registration"
                                    },
                                    {
                                        "value": 61,
                                        "title": "Product Subscription"
                                    },
                                    {
                                        "value": 60,
                                        "title": "Request for Quote"
                                    },
                                    {
                                        "value": 54,
                                        "title": "Checkout 2"
                                    },
                                    {
                                        "value": 222,
                                        "title": "My account Bn"
                                    },
                                    {
                                        "value": 219,
                                        "title": "My account"
                                    },
                                    {
                                        "value": 13,
                                        "title": "My account"
                                    },
                                    {
                                        "value": 12,
                                        "title": "Checkout"
                                    },
                                    {
                                        "value": 11,
                                        "title": "Cart"
                                    },
                                    {
                                        "value": 10,
                                        "title": "Shop"
                                    },
                                    {
                                        "value": 194,
                                        "title": "test-board"
                                    },
                                    {
                                        "value": 8,
                                        "title": "My Orders"
                                    },
                                    {
                                        "value": 7,
                                        "title": "Store List"
                                    },
                                    {
                                        "value": 6,
                                        "title": "Dashboard"
                                    },
                                    {
                                        "value": 2,
                                        "title": "Sample Page"
                                    }
                                ]
                            }
                        ],
                        "description": "",
                        "dependency_key": "dokan_pages.my_orders_section",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "store_listing_section",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_general_dokan_pages_store_listing_section",
                        "children": [
                            {
                                "id": "store_listing",
                                "type": "field",
                                "title": "Store Listing",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_general_dokan_pages_store_listing_section_store_listing",
                                "children": [],
                                "description": "Select a page to show all stores",
                                "dependency_key": "dokan_pages.store_listing_section.store_listing",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select",
                                "value": "7",
                                "default": "",
                                "placeholder": "Select page",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": 582,
                                        "title": "Classic Cart"
                                    },
                                    {
                                        "value": 329,
                                        "title": ""
                                    },
                                    {
                                        "value": 320,
                                        "title": "Single Product"
                                    },
                                    {
                                        "value": 316,
                                        "title": "Block Shop"
                                    },
                                    {
                                        "value": 106,
                                        "title": "Vendor registration"
                                    },
                                    {
                                        "value": 61,
                                        "title": "Product Subscription"
                                    },
                                    {
                                        "value": 60,
                                        "title": "Request for Quote"
                                    },
                                    {
                                        "value": 54,
                                        "title": "Checkout 2"
                                    },
                                    {
                                        "value": 222,
                                        "title": "My account Bn"
                                    },
                                    {
                                        "value": 219,
                                        "title": "My account"
                                    },
                                    {
                                        "value": 13,
                                        "title": "My account"
                                    },
                                    {
                                        "value": 12,
                                        "title": "Checkout"
                                    },
                                    {
                                        "value": 11,
                                        "title": "Cart"
                                    },
                                    {
                                        "value": 10,
                                        "title": "Shop"
                                    },
                                    {
                                        "value": 194,
                                        "title": "test-board"
                                    },
                                    {
                                        "value": 8,
                                        "title": "My Orders"
                                    },
                                    {
                                        "value": 7,
                                        "title": "Store List"
                                    },
                                    {
                                        "value": 6,
                                        "title": "Dashboard"
                                    },
                                    {
                                        "value": 2,
                                        "title": "Sample Page"
                                    }
                                ]
                            }
                        ],
                        "description": "",
                        "dependency_key": "dokan_pages.store_listing_section",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "reg_tc_page_section",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_general_dokan_pages_reg_tc_page_section",
                        "children": [
                            {
                                "id": "reg_tc_page",
                                "type": "field",
                                "title": "Terms and Conditions Page",
                                "icon": "",
                                "tooltip": "Select a page to display the Terms and Conditions of your store for Vendors.",
                                "display": true,
                                "hook_key": "dokan_settings_general_dokan_pages_reg_tc_page_section_reg_tc_page",
                                "children": [],
                                "description": "Select where you want to add Dokan pages.",
                                "dependency_key": "dokan_pages.reg_tc_page_section.reg_tc_page",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select",
                                "value": "",
                                "default": "",
                                "placeholder": "Select page",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": 582,
                                        "title": "Classic Cart"
                                    },
                                    {
                                        "value": 329,
                                        "title": ""
                                    },
                                    {
                                        "value": 320,
                                        "title": "Single Product"
                                    },
                                    {
                                        "value": 316,
                                        "title": "Block Shop"
                                    },
                                    {
                                        "value": 106,
                                        "title": "Vendor registration"
                                    },
                                    {
                                        "value": 61,
                                        "title": "Product Subscription"
                                    },
                                    {
                                        "value": 60,
                                        "title": "Request for Quote"
                                    },
                                    {
                                        "value": 54,
                                        "title": "Checkout 2"
                                    },
                                    {
                                        "value": 222,
                                        "title": "My account Bn"
                                    },
                                    {
                                        "value": 219,
                                        "title": "My account"
                                    },
                                    {
                                        "value": 13,
                                        "title": "My account"
                                    },
                                    {
                                        "value": 12,
                                        "title": "Checkout"
                                    },
                                    {
                                        "value": 11,
                                        "title": "Cart"
                                    },
                                    {
                                        "value": 10,
                                        "title": "Shop"
                                    },
                                    {
                                        "value": 194,
                                        "title": "test-board"
                                    },
                                    {
                                        "value": 8,
                                        "title": "My Orders"
                                    },
                                    {
                                        "value": 7,
                                        "title": "Store List"
                                    },
                                    {
                                        "value": 6,
                                        "title": "Dashboard"
                                    },
                                    {
                                        "value": 2,
                                        "title": "Sample Page"
                                    }
                                ]
                            }
                        ],
                        "description": "",
                        "dependency_key": "dokan_pages.reg_tc_page_section",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Link your WordPress pages to essential Dokan marketplace functions and features.",
                "dependency_key": "dokan_pages",
                "dependencies": [],
                "validations": [],
                "priority": 200,
                "doc_link": "https://wedevs.com/docs/dokan/settings/page-settings-2/",
                "doc_link_text": "Doc",
            },
            {
                "id": "location",
                "type": "subpage",
                "title": "Location",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_general_location",
                "children": [
                    {
                        "id": "map_api_configuration",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_general_location_map_api_configuration",
                        "children": [
                            {
                                "id": "map_api_source",
                                "type": "field",
                                "title": "Map API Source",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_general_location_map_api_configuration_map_api_source",
                                "children": [],
                                "description": "Which map API source you want to use in your site?",
                                "dependency_key": "location.map_api_configuration.map_api_source",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "google_maps",
                                "default": "google_maps",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "google_maps",
                                        "title": "Google Maps",
                                        "icon": ""
                                    },
                                    {
                                        "value": "mapbox",
                                        "title": "Mapbox",
                                        "icon": ""
                                    }
                                ]
                            },
                            {
                                "id": "google_map_api_key",
                                "type": "field",
                                "variant": "show_hide",
                                "title": "Google Map API Key",
                                "icon": "",
                                "tooltip": "Insert Google API Key (with hyperlink) to display store map.",
                                "display": true,
                                "hook_key": "dokan_settings_general_location_map_api_configuration_google_map_api_key",
                                "children": [],
                                "description": "<a href=\"https://developers.google.com/maps/documentation/javascript/\" class=\"text-primary underline\" target=\"_blank\" rel=\"noopener noreferrer\">API Key</a> is needed to display map on store page.",
                                "dependency_key": "location.map_api_configuration.google_map_api_key",
                                "dependencies": [
                                    {
                                        "key": "location.map_api_configuration.map_api_source",
                                        "value": "google_maps",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "==",
                                        "self": "location.map_api_configuration.google_map_api_key"
                                    },
                                    {
                                        "key": "location.map_api_configuration.map_api_source",
                                        "value": "mapbox",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "==",
                                        "self": "location.map_api_configuration.google_map_api_key"
                                    }
                                ],
                                "validations": [],
                                "value": "AIzaSyD9N67E6zpGuZqT-o_EI8da5qLbWonLOWw",
                                "default": "",
                                "placeholder": "Enter your Google Maps API key",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "layout": "full-width"
                            },
                            {
                                "id": "mapbox_api_key",
                                "type": "field",
                                "variant": "show_hide",
                                "title": "Mapbox API Key",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_general_location_map_api_configuration_mapbox_api_key",
                                "children": [],
                                "description": "Enter your Mapbox API key to enable map functionality.",
                                "dependency_key": "location.map_api_configuration.mapbox_api_key",
                                "dependencies": [
                                    {
                                        "key": "location.map_api_configuration.map_api_source",
                                        "value": "mapbox",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "==",
                                        "self": "location.map_api_configuration.mapbox_api_key"
                                    },
                                    {
                                        "key": "location.map_api_configuration.map_api_source",
                                        "value": "google_maps",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "==",
                                        "self": "location.map_api_configuration.mapbox_api_key"
                                    }
                                ],
                                "validations": [],
                                "value": "",
                                "default": "",
                                "placeholder": "Enter your Mapbox API key",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "layout": "full-width"
                            }
                        ],
                        "description": "",
                        "dependency_key": "location.map_api_configuration",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "map_display_settings",
                        "type": "section",
                        "title": "Map Display",
                        "icon": "",
                        "tooltip": "Control the visibility of location maps site-wide.",
                        "display": true,
                        "hook_key": "dokan_settings_general_location_map_display_settings",
                        "children": [
                            {
                                "id": "location_map_position",
                                "type": "field",
                                "title": "Location Map Position",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_general_location_map_display_settings_location_map_position",
                                "children": [],
                                "description": "",
                                "dependency_key": "location.map_display_settings.location_map_position",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "top",
                                "default": "top",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "top",
                                        "title": "Top",
                                        "icon": ""
                                    },
                                    {
                                        "value": "left",
                                        "title": "Left",
                                        "icon": ""
                                    },
                                    {
                                        "value": "right",
                                        "title": "Right",
                                        "icon": ""
                                    }
                                ]
                            },
                            {
                                "id": "show_filters_before_map",
                                "type": "field",
                                "title": "Show Filters Before Location Map",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_general_location_map_display_settings_show_filters_before_map",
                                "children": [],
                                "description": "",
                                "dependency_key": "location.map_display_settings.show_filters_before_map",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "radius_search_unit",
                                "type": "field",
                                "title": "Radius Search Unit",
                                "icon": "",
                                "tooltip": "Choose the unit for radius search distance.",
                                "display": true,
                                "hook_key": "dokan_settings_general_location_map_display_settings_radius_search_unit",
                                "children": [],
                                "description": "",
                                "dependency_key": "location.map_display_settings.radius_search_unit",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "km",
                                "default": "km",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "km",
                                        "title": "Kilometers",
                                        "icon": ""
                                    },
                                    {
                                        "value": "miles",
                                        "title": "Miles",
                                        "icon": ""
                                    }
                                ]
                            },
                            {
                                "id": "radius_search_min_distance",
                                "type": "field",
                                "title": "Radius Search - Minimum Distance",
                                "icon": "",
                                "tooltip": "Set the minimum unit distance of the radius.",
                                "display": true,
                                "hook_key": "dokan_settings_general_location_map_display_settings_radius_search_min_distance",
                                "children": [],
                                "description": "Set minimum distance for radius search.",
                                "dependency_key": "location.map_display_settings.radius_search_min_distance",
                                "dependencies": [],
                                "validations": [
                                    {
                                        "rules": "not_empty|min_value",
                                        "message": "",
                                        "params": [],
                                        "self": "location.map_display_settings.radius_search_min_distance"
                                    }
                                ],
                                "variant": "number",
                                "value": 0,
                                "default": "0",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "km",
                                "prefix": "",
                                "image_url": "",
                                "minimum": null,
                                "maximum": null,
                                "step": 0.1,
                                "addon_icon": false
                            },
                            {
                                "id": "radius_search_max_distance",
                                "type": "field",
                                "title": "Radius Search - Maximum Distance",
                                "icon": "",
                                "tooltip": "Set the maximum unit distance of the radius.",
                                "display": true,
                                "hook_key": "dokan_settings_general_location_map_display_settings_radius_search_max_distance",
                                "children": [],
                                "description": "Set maximum distance for radius search.",
                                "dependency_key": "location.map_display_settings.radius_search_max_distance",
                                "dependencies": [],
                                "validations": [
                                    {
                                        "rules": "not_empty|min_value",
                                        "message": "",
                                        "params": {
                                            "min": 1
                                        },
                                        "self": "location.map_display_settings.radius_search_max_distance"
                                    }
                                ],
                                "variant": "number",
                                "value": 10,
                                "default": "10",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "km",
                                "prefix": "",
                                "image_url": "",
                                "minimum": null,
                                "maximum": null,
                                "step": 0.1,
                                "addon_icon": false
                            },
                            {
                                "id": "map_zoom_level",
                                "type": "field",
                                "title": "Map Zoom Level",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_general_location_map_display_settings_map_zoom_level",
                                "children": [],
                                "description": "To zoom in, increase the number. To zoom out, decrease the number.",
                                "dependency_key": "location.map_display_settings.map_zoom_level",
                                "dependencies": [],
                                "validations": [
                                    {
                                        "rules": "not_empty|min_value|max_value",
                                        "message": "",
                                        "params": {
                                            "min": 1,
                                            "max": 18
                                        },
                                        "self": "location.map_display_settings.map_zoom_level"
                                    }
                                ],
                                "variant": "number",
                                "value": 11,
                                "default": "11",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "minimum": null,
                                "maximum": null,
                                "step": 0.1,
                                "addon_icon": false
                            }
                        ],
                        "description": "Control the visibility of location maps site-wide.",
                        "dependency_key": "location.map_display_settings",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "map_placement",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_general_location_map_placement",
                        "children": [
                            {
                                "id": "map_placement_locations",
                                "type": "field",
                                "title": "Map Placement Locations",
                                "icon": "",
                                "tooltip": "Select the pages where you want to display the store location map.",
                                "display": true,
                                "hook_key": "dokan_settings_general_location_map_placement_map_placement_locations",
                                "children": [],
                                "description": "Choose where the store location map appears",
                                "dependency_key": "location.map_placement.map_placement_locations",
                                "dependencies": [],
                                "validations": [],
                                "variant": "multicheck",
                                "value": [ "store_listing", "shop_page" ],
                                "default": [ "store_listing", "shop_page" ],
                                "options": [
                                    {
                                        "value": "store_listing",
                                        "title": "Store Listing"
                                    },
                                    {
                                        "value": "shop_page",
                                        "title": "Shop Page"
                                    },
                                    {
                                        "value": "single_product_location_tab",
                                        "title": "Location tab in single product page."
                                    }
                                ],
                                "helper_text": ""
                            }
                        ],
                        "description": "",
                        "dependency_key": "location.map_placement",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Configure how map locations are displayed throughout your marketplace.",
                "dependency_key": "location",
                "dependencies": [],
                "validations": [],
                "priority": 300,
                "doc_link": "https://wedevs.com/docs/dokan/settings/page-settings-2/",
                "doc_link_text": "Doc",
            }
        ],
        "description": "Configure the general settings for your marketplace.",
        "dependency_key": "",
        "dependencies": [],
        "validations": []
    },
    {
        "id": "product",
        "type": "page",
        "title": "Product",
        "icon": "Box",
        "tooltip": "",
        "display": true,
        "hook_key": "dokan_settings_product",
        "children": [
            {
                "id": "product_advertisement",
                "type": "subpage",
                "title": "Product Advertisement",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_product_product_advertisement",
                "children": [
                    {
                        "id": "product_advertisement_settings",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_product_product_advertisement_settings",
                        "children": [
                            {
                                "id": "advertisement_available_slots",
                                "type": "field",
                                "title": "No. of Available Slot",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_product_advertisement_advertisement_available_slots",
                                "children": [],
                                "description": "Enter how many products can be advertised, enter -1 for no limit.",
                                "dependency_key": "product_advertisement.advertisement_available_slots",
                                "dependencies": [],
                                "validations": [
                                    {
                                        "rules": "not_empty|min_value",
                                        "message": "You need to enter a positive integer for this field. Enter -1 for no limit.",
                                        "params": {
                                            "min": -1
                                        },
                                        "self": "product_advertisement.advertisement_available_slots"
                                    }
                                ],
                                "variant": "number",
                                "value": 100,
                                "default": "100",
                                "placeholder": "Type something",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "minimum": null,
                                "maximum": null,
                                "step": 0.1,
                                "addon_icon": false
                            },
                            {
                                "id": "advertisement_expire_days",
                                "type": "field",
                                "title": "Expire After Days",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_product_advertisement_advertisement_expire_days",
                                "children": [],
                                "description": "Enter how many days product will be advertised, enter -1 if you don&#039;t want to set any expiration period.",
                                "dependency_key": "product_advertisement.advertisement_expire_days",
                                "dependencies": [],
                                "validations": [
                                    {
                                        "rules": "not_empty|min_value",
                                        "message": "You need to enter a positive integer for this field. Enter -1 for no limit.",
                                        "params": {
                                            "min": -1
                                        },
                                        "self": "product_advertisement.advertisement_expire_days"
                                    }
                                ],
                                "variant": "number",
                                "value": 10,
                                "default": "10",
                                "placeholder": "e.g 10",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "$",
                                "image_url": "",
                                "minimum": null,
                                "maximum": null,
                                "step": 0.1,
                                "addon_icon": false
                            },
                            {
                                "id": "advertisement_cost_usd",
                                "type": "field",
                                "title": "Advertisement Cost (USD)",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_product_advertisement_advertisement_cost_usd",
                                "children": [],
                                "description": "Cost of per advertisement. Set 0 (zero) to purchase.",
                                "dependency_key": "product_advertisement.advertisement_cost_usd",
                                "dependencies": [
                                    {
                                        "key": "product_advertisement.vendor_can_purchase_advertisement",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "product_advertisement.advertisement_cost_usd"
                                    },
                                    {
                                        "key": "product_advertisement.vendor_can_purchase_advertisement",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "product_advertisement.advertisement_cost_usd"
                                    }
                                ],
                                "validations": [
                                    {
                                        "rules": "not_empty|min_value",
                                        "message": "Cost can not be empty or less than 0",
                                        "params": {
                                            "min": 0
                                        },
                                        "self": "product_advertisement.advertisement_cost_usd"
                                    }
                                ],
                                "variant": "number",
                                "value": 15,
                                "default": "15",
                                "placeholder": "e.g 10",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "&#36;",
                                "image_url": "",
                                "minimum": null,
                                "maximum": null,
                                "step": 1,
                                "addon_icon": false
                            },
                            {
                                "id": "vendor_can_purchase_advertisement",
                                "type": "field",
                                "title": "Vendor Can Purchase Advertisement",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_product_advertisement_vendor_can_purchase_advertisement",
                                "children": [],
                                "description": "If you check this checkbox, vendors will be able to purchase advertisement from product listing and product edit page.",
                                "dependency_key": "product_advertisement.vendor_can_purchase_advertisement",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "advertisement_in_subscription",
                                "type": "field",
                                "title": "Advertisement In Subscription",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_product_advertisement_advertisement_in_subscription",
                                "children": [],
                                "description": "If you check this checkbox, vendor will be able to advertise their products without any additional cost based on the plan they are subscribed to.",
                                "dependency_key": "product_advertisement.advertisement_in_subscription",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "mark_advertised_as_featured",
                                "type": "field",
                                "title": "Mark Advertised Product as Featured?",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_product_advertisement_mark_advertised_as_featured",
                                "children": [],
                                "description": "If you check this checkbox, advertised product will be marked as featured. Products will be automatically removed from featured list after advertisement is expired.",
                                "dependency_key": "product_advertisement.mark_advertised_as_featured",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "display_advertised_on_top",
                                "type": "field",
                                "title": "Display Advertised Product on Top?",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_product_advertisement_display_advertised_on_top",
                                "children": [],
                                "description": "If you check this checkbox, advertised products will be displayed on top of the catalog listing eg: shop page, single store page etc.",
                                "dependency_key": "product_advertisement.display_advertised_on_top",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "out_of_stock_visibility",
                                "type": "field",
                                "title": "Out of Stock Visibility",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_product_advertisement_out_of_stock_visibility",
                                "children": [],
                                "description": "Hide out of stock items from the advertisement list. Note that, if WooCommerce setting for out of stock visibility is checked, product will be hidden despite this setting.",
                                "dependency_key": "product_advertisement.out_of_stock_visibility",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "If you enable this option, out of stock products will not be displayed in the advertisement list.",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            }
                        ],
                        "description": "",
                        "dependency_key": "product.product_advertisement_settings",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                ],
                "description": "Configure settings for your vendor to feature their products on store pages.",
                "dependency_key": "product_advertisement",
                "dependencies": [],
                "validations": [],
                "priority": 100,
                "doc_link": "https://dokan.co/docs/wordpress/modules/product-advertising/",
                "doc_link_text": "Doc"
            },
            {
                "id": "request_for_quote",
                "type": "subpage",
                "title": "Request for Quote",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_product_request_for_quote",
                "children": [
                    {
                        "id": "request_for_quote_settings",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "children": [
                            {
                                "id": "enable_quote_out_of_stock",
                                "type": "field",
                                "title": "Enable Quote for Out of Stock Products",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_request_for_quote_enable_quote_out_of_stock",
                                "children": [],
                                "description": "Enable/Disable quote button for out of stock products. (Note: It is compatible with simple and variable products only)",
                                "dependency_key": "request_for_quote.enable_quote_out_of_stock",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "enable_ajax_add_to_quote",
                                "type": "field",
                                "title": "Enable Ajax Add to Quote",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_request_for_quote_enable_ajax_add_to_quote",
                                "children": [],
                                "description": "Enable seamless quote request functionality with instant product additions.",
                                "dependency_key": "request_for_quote.enable_ajax_add_to_quote",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "redirect_to_quote_page",
                                "type": "field",
                                "title": "Redirect to Quote Page",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_request_for_quote_redirect_to_quote_page",
                                "children": [],
                                "description": "Redirect to the quote page after a product is successfully added to quote.",
                                "dependency_key": "request_for_quote.redirect_to_quote_page",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "decrease_offered_price",
                                "type": "field",
                                "title": "Decrease Offered Price",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_request_for_quote_decrease_offered_price",
                                "children": [],
                                "description": "Enter number in percent to decrease the offered price from standard price of product. Set zero (0) for standard price. Note: offered price will be display according to settings of cart. (eg: including/excluding tax)",
                                "dependency_key": "request_for_quote.decrease_offered_price",
                                "dependencies": [],
                                "validations": [],
                                "variant": "number",
                                "value": 0,
                                "default": "0",
                                "placeholder": "e.g 10",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "$",
                                "image_url": "",
                                "minimum": null,
                                "maximum": null,
                                "step": 0.1,
                                "addon_icon": false
                            },
                            {
                                "id": "convert_to_order",
                                "type": "field",
                                "title": "Convert to Order",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_request_for_quote_convert_to_order",
                                "children": [],
                                "description": "Customers can Convert to Order. Adding customers is important here.",
                                "dependency_key": "request_for_quote.convert_to_order",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "quote_converter_display",
                                "type": "field",
                                "title": "Quote Converter Display",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_request_for_quote_quote_converter_display",
                                "children": [],
                                "description": "Enable display of &quot;Quote converted by&quot; in customer&#039;s my-account quote details page.",
                                "dependency_key": "request_for_quote.quote_converter_display",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            }
                        ]
                    }
                ],
                "description": "You can configure your site to allow customers to send customized quotes on the selected products.",
                "dependency_key": "request_for_quote",
                "dependencies": [],
                "validations": [],
                "priority": 300,
                "doc_link": "https://dokan.co/docs/wordpress/modules/dokan-request-for-quotation-module/",
                "doc_link_text": "Doc"
            },
            {
                "id": "wholesale",
                "type": "subpage",
                "title": "Wholesale",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_product_wholesale",
                "children": [
                    {
                        "id": "wholesale_settings",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_wholesale_wholesale_settings",
                        "children": [
                            {
                                "id": "display_wholesale_pricing_to",
                                "type": "field",
                                "title": "Display Wholesale Pricing To",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_wholesale_display_wholesale_pricing_to",
                                "children": [],
                                "description": "Define which user types can see discounted wholesale prices.",
                                "dependency_key": "wholesale.display_wholesale_pricing_to",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "wholesale_customer",
                                "default": "wholesale_customer",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "wholesale_customer",
                                        "title": "Only Wholesale Customer",
                                        "icon": ""
                                    },
                                    {
                                        "value": "all_user",
                                        "title": "All Users",
                                        "icon": ""
                                    }
                                ]
                            },
                            {
                                "id": "wholesale_price_on_shop_archive",
                                "type": "field",
                                "title": "Wholesale Price on Shop Archive",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_wholesale_wholesale_price_on_shop_archive",
                                "children": [],
                                "description": "Show in price column",
                                "dependency_key": "wholesale.wholesale_price_on_shop_archive",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "need_approval_for_customer",
                                "type": "field",
                                "title": "Need Approval for Customer",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_wholesale_need_approval_for_customer",
                                "children": [],
                                "description": "Customer need admin approval for becoming a wholesale customer.",
                                "dependency_key": "wholesale.need_approval_for_customer",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            }
                        ]
                    }
                ],
                "description": "You can configure wholesale settings for your store and allow vendors to operate on wholesale price and quantity.",
                "dependency_key": "wholesale",
                "dependencies": [],
                "validations": [],
                "priority": 400,
                "doc_link": "https://dokan.co/docs/wordpress/modules/dokan-wholesale/",
                "doc_link_text": "Doc"
            },
            {
                "id": "printful_integration",
                "type": "subpage",
                "title": "Printful",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_product_printful_integration",
                "children": [
                    {
                        "id": "shipping_recipient_notice",
                        "type": "field",
                        "title": "",
                        "icon": "Info",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_product_printful_integration_shipping_recipient_notice",
                        "children": [],
                        "description": "To enable Printful correctly, assign Shipping Fee Recipient, and Shipping Tax Fee Recipient to individual vendors. Each vendor manages and fulfills orders using their Printful account.",
                        "dependency_key": "printful_integration.shipping_recipient_notice",
                        "dependencies": [],
                        "validations": [],
                        "variant": "notice",
                        "value": null,
                        "notice_type": "warning",
                        "notice_icon": "Info",
                        "notice_title": "",
                        "notice_description": "To enable Printful correctly, assign Shipping Fee Recipient, and Shipping Tax Fee Recipient to individual vendors. Each vendor manages and fulfills orders using their Printful account.",
                        "link_title": "Shipping Fee Recipient Settings",
                        "link_url": "",
                        "link_icon": "",
                        "active_tab": "transaction.fees"
                    },
                    {
                        "id": "size_guide_popup_title_notice",
                        "type": "field",
                        "title": "Size Guide Title",
                        "icon": "Info",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_product_printful_integration_size_guide_popup_title_notice",
                        "children": [],
                        "description": "To ensure accurate pricing and successful integration, please select one of the Printful supported currencies from WooCommerce \u2192 Settings \u2192 General \u2192 Currency, under Currency Options. Please select one of these currencies to match Printful: USD, EUR, GBP, CAD, JPY, AUD, BRL, CHF, DKK, HKD, MXN, NZD, SEK.",
                        "dependency_key": "printful_integration.size_guide_popup_title_notice",
                        "dependencies": [],
                        "validations": [],
                        "variant": "notice",
                        "value": null,
                        "notice_type": "warning",
                        "notice_icon": "Info",
                        "notice_title": "Size Guide Title",
                        "notice_description": "To ensure accurate pricing and successful integration, please select one of the Printful supported currencies from WooCommerce \u2192 Settings \u2192 General \u2192 Currency, under Currency Options. Please select one of these currencies to match Printful: USD, EUR, GBP, CAD, JPY, AUD, BRL, CHF, DKK, HKD, MXN, NZD, SEK.",
                        "link_title": "Currency Settings \ud83d\udd17",
                        "link_url": "https://core-dokan.test/wp-admin/admin.php?page=wc-settings&tab=general#pricing_options-description",
                        "link_icon": "",
                        "active_tab": ""
                    },
                    {
                        "id": "printful_api_settings",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_product_printful_integration_printful_api_settings",
                        "children": [
                            {
                                "id": "printful_api_settings_group",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_printful_integration_printful_api_settings_printful_api_settings_group",
                                "children": [
                                    {
                                        "id": "printful_enable",
                                        "type": "field",
                                        "title": "Printful App",
                                        "icon": "CircleCheck",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_product_printful_integration_printful_api_settings_printful_api_settings_group_printful_enable",
                                        "children": [],
                                        "description": "Connect to your Printful account with your website. <a href=\"https://www.printful.com/docs\" class=\"text-primary underline\" target=\"_blank\" rel=\"noopener noreferrer\">Get Help</a>",
                                        "dependency_key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_enable",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://play-lh.googleusercontent.com/EYQl0LgcDlhvcIbdk13hXyEOjWzIft2Olnkt2YgBZdKlH0VBpqDsRUm3G0dhFSwDCcnD",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "printful_create_app",
                                        "type": "field",
                                        "title": "If you don&#039;t have a Printful app ",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_product_printful_integration_printful_api_settings_printful_api_settings_group_printful_create_app",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_create_app",
                                        "dependencies": [
                                            {
                                                "key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_enable",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "printful_integration.printful_api_settings.printful_api_settings_group.printful_create_app"
                                            },
                                            {
                                                "key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_enable",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "printful_integration.printful_api_settings.printful_api_settings_group.printful_create_app"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "info",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "",
                                        "link_text": "+ Create an App",
                                        "link_url": "https://developers.printful.com/apps",
                                        "show_icon": true
                                    },
                                    {
                                        "id": "printful_app_url",
                                        "type": "field",
                                        "title": "App URL",
                                        "icon": "",
                                        "tooltip": "Your store URL, which will be required when creating the Printful App.",
                                        "display": true,
                                        "hook_key": "dokan_settings_product_printful_integration_printful_api_settings_printful_api_settings_group_printful_app_url",
                                        "children": [],
                                        "description": "Your website URL for Printful app configuration.",
                                        "dependency_key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_app_url",
                                        "dependencies": [
                                            {
                                                "key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_enable",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "printful_integration.printful_api_settings.printful_api_settings_group.printful_app_url"
                                            },
                                            {
                                                "key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_enable",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "printful_integration.printful_api_settings.printful_api_settings_group.printful_app_url"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "copy_field",
                                        "value": "https://core-dokan.test/dashboard/settings/printful/",
                                        "default": "https://core-dokan.test/dashboard/settings/printful/",
                                        "placeholder": "https://core-dokan.test/dashboard/settings/printful/",
                                        "readonly": true,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "This URL will be used by Printful to communicate with your website.",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "printful_redirection_domains",
                                        "type": "field",
                                        "title": "Redirection Domains",
                                        "icon": "",
                                        "tooltip": "Your store domain, which will be required in creating the App.",
                                        "display": true,
                                        "hook_key": "dokan_settings_product_printful_integration_printful_api_settings_printful_api_settings_group_printful_redirection_domains",
                                        "children": [],
                                        "description": "Domains allowed for redirection after Printful authentication. Enter one domain per line.",
                                        "dependency_key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_redirection_domains",
                                        "dependencies": [
                                            {
                                                "key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_enable",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "printful_integration.printful_api_settings.printful_api_settings_group.printful_redirection_domains"
                                            },
                                            {
                                                "key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_enable",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "printful_integration.printful_api_settings.printful_api_settings_group.printful_redirection_domains"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "copy_field",
                                        "value": "core-dokan.test",
                                        "default": "core-dokan.test",
                                        "placeholder": "core-dokan.test",
                                        "readonly": true,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "These domains will be whitelisted for OAuth redirects.",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "printful_client_id",
                                        "type": "field",
                                        "title": "Client ID",
                                        "icon": "",
                                        "tooltip": "You can get it from Facebook Developer platform -> Login -> Select  &quot;Add A New App&quot; -> Collect Client ID.",
                                        "display": true,
                                        "hook_key": "dokan_settings_product_printful_integration_printful_api_settings_printful_api_settings_group_printful_client_id",
                                        "children": [],
                                        "description": "Your Printful app Client ID.",
                                        "dependency_key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_client_id",
                                        "dependencies": [
                                            {
                                                "key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_enable",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "printful_integration.printful_api_settings.printful_api_settings_group.printful_client_id"
                                            },
                                            {
                                                "key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_enable",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "printful_integration.printful_api_settings.printful_api_settings_group.printful_client_id"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Client ID",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "printful_secret_key",
                                        "type": "field",
                                        "title": "Secret Key",
                                        "icon": "",
                                        "tooltip": "You can get it from Facebook Developer platform -> Login -> Select  &quot;Add A New App&quot; -> Collect App secret.",
                                        "display": true,
                                        "hook_key": "dokan_settings_product_printful_integration_printful_api_settings_printful_api_settings_group_printful_secret_key",
                                        "children": [],
                                        "description": "Your Printful app Secret Key.",
                                        "dependency_key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_secret_key",
                                        "dependencies": [
                                            {
                                                "key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_enable",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "printful_integration.printful_api_settings.printful_api_settings_group.printful_secret_key"
                                            },
                                            {
                                                "key": "printful_integration.printful_api_settings.printful_api_settings_group.printful_enable",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "printful_integration.printful_api_settings.printful_api_settings_group.printful_secret_key"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Secret Key",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    }
                                ],
                                "description": "",
                                "dependency_key": "printful_integration.printful_api_settings.printful_api_settings_group",
                                "dependencies": [],
                                "validations": [],
                                "content_class": ""
                            }
                        ],
                        "description": "",
                        "dependency_key": "printful_integration.printful_api_settings",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "size_guide_settings",
                        "type": "section",
                        "title": "Size Guide",
                        "icon": "",
                        "tooltip": "These settings control how the size guide will look on your Single Product Page.",
                        "display": true,
                        "hook_key": "dokan_settings_product_printful_integration_size_guide_settings",
                        "children": [
                            {
                                "id": "size_guide_popup_title",
                                "type": "field",
                                "title": "Size Guide Popup Title",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_printful_integration_size_guide_settings_size_guide_popup_title",
                                "children": [],
                                "description": "",
                                "dependency_key": "printful_integration.size_guide_settings.size_guide_popup_title",
                                "dependencies": [],
                                "validations": [],
                                "variant": "text",
                                "value": "Size Guide",
                                "default": "Size Guide",
                                "placeholder": "Type something",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            },
                            {
                                "id": "size_guide_popup_text_color",
                                "type": "field",
                                "title": "Size guide popup text color",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_printful_integration_size_guide_settings_size_guide_popup_text_color",
                                "children": [],
                                "description": "",
                                "dependency_key": "printful_integration.size_guide_settings.size_guide_popup_text_color",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select_color_picker",
                                "value": "#25252d",
                                "default": "#25252d",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": []
                            },
                            {
                                "id": "size_guide_popup_background_color",
                                "type": "field",
                                "title": "Size Guide Popup Background Color",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_printful_integration_size_guide_settings_size_guide_popup_background_color",
                                "children": [],
                                "description": "",
                                "dependency_key": "printful_integration.size_guide_settings.size_guide_popup_background_color",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select_color_picker",
                                "value": "#ffffff",
                                "default": "#ffffff",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": []
                            },
                            {
                                "id": "size_guide_tab_background_color",
                                "type": "field",
                                "title": "Size Guide Tab Background Color",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_printful_integration_size_guide_settings_size_guide_tab_background_color",
                                "children": [],
                                "description": "",
                                "dependency_key": "printful_integration.size_guide_settings.size_guide_tab_background_color",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select_color_picker",
                                "value": "#ffffff",
                                "default": "#ffffff",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": []
                            },
                            {
                                "id": "size_guide_active_tab_background_color",
                                "type": "field",
                                "title": "Size Guide Active Tab Background Color",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_printful_integration_size_guide_settings_size_guide_active_tab_background_color",
                                "children": [],
                                "description": "",
                                "dependency_key": "printful_integration.size_guide_settings.size_guide_active_tab_background_color",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select_color_picker",
                                "value": "#7047eb",
                                "default": "#7047eb",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": []
                            },
                            {
                                "id": "size_guide_button_text",
                                "type": "field",
                                "title": "Size Guide Button Text",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_printful_integration_size_guide_settings_size_guide_button_text",
                                "children": [],
                                "description": "",
                                "dependency_key": "printful_integration.size_guide_settings.size_guide_button_text",
                                "dependencies": [],
                                "validations": [],
                                "variant": "text",
                                "value": "Size Guide",
                                "default": "Size Guide",
                                "placeholder": "Type something",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            },
                            {
                                "id": "size_guide_button_text_color",
                                "type": "field",
                                "title": "Size Guide Button Text Color",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_printful_integration_size_guide_settings_size_guide_button_text_color",
                                "children": [],
                                "description": "",
                                "dependency_key": "printful_integration.size_guide_settings.size_guide_button_text_color",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select_color_picker",
                                "value": "#ffffff",
                                "default": "#ffffff",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": []
                            },
                            {
                                "id": "size_guide_measurement_unit",
                                "type": "field",
                                "title": "Primary Measurement Unit",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_product_printful_integration_size_guide_settings_size_guide_measurement_unit",
                                "children": [],
                                "description": "",
                                "dependency_key": "printful_integration.size_guide_settings.size_guide_measurement_unit",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "inches",
                                "default": "inches",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "inches",
                                        "title": "Inches",
                                        "icon": ""
                                    },
                                    {
                                        "value": "centimeter",
                                        "title": "Centimeter",
                                        "icon": ""
                                    }
                                ]
                            }
                        ],
                        "description": "These settings control how the size guide will look on your Single Product Page.",
                        "dependency_key": "printful_integration.size_guide_settings",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": "https://wedevs.com/docs/dokan-lite/printful-integration/",
                        "doc_link_text": "Doc"
                    }
                ],
                "description": "Configure Dokan to give vendors the ability to connect with Printful.",
                "dependency_key": "printful_integration",
                "dependencies": [],
                "validations": [],
                "priority": 200,
                "doc_link": "https://dokan.co/docs/wordpress/modules/printful/",
                "doc_link_text": "Doc"
            }
        ],
        "description": "Configure product-related settings for your marketplace.",
        "dependency_key": "",
        "dependencies": [],
        "validations": []
    },
    {
        "id": "ai_assist",
        "type": "page",
        "title": "AI Assist",
        "icon": "Sparkles",
        "tooltip": "",
        "display": true,
        "hook_key": "dokan_settings_ai_assist",
        "children": [
            {
                "id": "product_generation",
                "type": "subpage",
                "title": "Content Generation",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_ai_assist_product_generation",
                "description": "Set up AI to elevate your platform with enhanced capabilities.",
                "children": [
                    {
                        "id": "product_image_section",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section",
                        "children": [
                            {
                                "id": "product_info_generate",
                                "type": "field",
                                "title": "Product Info Generate",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section_product_info_generate",
                                "children": [],
                                "description": "Let vendors generate product info by AI.",
                                "dependency_key": "product_generation.product_image_section.product_info_generate",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "product_info_engine",
                                "type": "field",
                                "title": "Engine",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section_product_info_engine",
                                "children": [],
                                "description": "Select which AI provider to use for generating content.",
                                "dependency_key": "product_generation.product_image_section.product_info_engine",
                                "dependencies": [
                                    {
                                        "key": "product_generation.product_image_section.product_info_generate",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "product_generation.product_image_section.product_info_engine"
                                    },
                                    {
                                        "key": "product_generation.product_image_section.product_info_generate",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "product_generation.product_image_section.product_info_engine"
                                    }
                                ],
                                "validations": [],
                                "variant": "select",
                                "value": "chatgpt",
                                "default": "chatgpt",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "chatgpt",
                                        "title": "ChatGPT"
                                    },
                                    {
                                        "value": "gemini",
                                        "title": "Gemini"
                                    }
                                ]
                            },
                            {
                                "id": "openai_api_info_group",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section_openai_api_info_group",
                                "children": [
                                    {
                                        "id": "openai_api_info",
                                        "type": "field",
                                        "title": "OpenAI API",
                                        "icon": "CircleCheck",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section_openai_api_info_group_openai_api_info",
                                        "children": [],
                                        "description": "Connect to your OpenAI account with your website. <a href=\"https://platform.openai.com/api-keys\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary hover:underline flex-inline items-center gap-0.5\">Get Help <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-arrow-up-right inline-block\"><path d=\"M7 7h10v10\"/><path d=\"M7 17 17 7\"/></svg></a>",
                                        "dependency_key": "product_generation.product_image_section.openai_api_info_group.openai_api_info",
                                        "dependencies": [
                                            {
                                                "key": "product_generation.product_image_section.product_info_generate",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "product_generation.product_image_section.openai_api_info_group.openai_api_info"
                                            },
                                            {
                                                "key": "product_generation.product_image_section.product_info_generate",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "product_generation.product_image_section.openai_api_info_group.openai_api_info"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "base_field_label",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://images.seeklogo.com/logo-png/46/2/chatgpt-logo-png_seeklogo-465219.png",
                                        "suffix": "",
                                        "doc_link": null
                                    },
                                    {
                                        "id": "openai_api_notice",
                                        "type": "field",
                                        "title": "You can get your API Keys in your ",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section_openai_api_info_group_openai_api_notice",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "product_generation.product_image_section.openai_api_info_group.openai_api_notice",
                                        "dependencies": [
                                            {
                                                "key": "product_generation.product_image_section.product_info_generate",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "product_generation.product_image_section.openai_api_info_group.openai_api_notice"
                                            },
                                            {
                                                "key": "product_generation.product_image_section.product_info_generate",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "product_generation.product_image_section.openai_api_info_group.openai_api_notice"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "info",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "",
                                        "link_text": "OpenAI Account.",
                                        "link_url": "https://platform.openai.com/api-keys",
                                        "show_icon": true
                                    },
                                    {
                                        "id": "openai_api_key",
                                        "type": "field",
                                        "title": "API Key",
                                        "icon": "",
                                        "tooltip": "Enter your OpenAI API key for content generation.",
                                        "display": true,
                                        "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section_openai_api_info_group_openai_api_key",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "product_generation.product_image_section.openai_api_info_group.openai_api_key",
                                        "dependencies": [
                                            {
                                                "key": "product_generation.product_image_section.product_info_generate",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "product_generation.product_image_section.openai_api_info_group.openai_api_key"
                                            },
                                            {
                                                "key": "product_generation.product_image_section.product_info_generate",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "product_generation.product_image_section.openai_api_info_group.openai_api_key"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your OpenAI API key",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                ],
                                "description": "",
                                "dependency_key": "product_generation.product_image_section.openai_api_info_group",
                                "dependencies": [
                                    {
                                        "key": "product_generation.product_image_section.product_info_engine",
                                        "value": "chatgpt",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "product_generation.product_image_section.openai_api_info_group"
                                    },
                                    {
                                        "key": "product_generation.product_image_section.product_info_engine",
                                        "value": "chatgpt",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "product_generation.product_image_section.openai_api_info_group"
                                    }
                                ],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "openai_model",
                                "type": "field",
                                "title": "Model",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section_openai_api_info_group_openai_model",
                                "children": [],
                                "description": "More advanced models provide higher quality output but may cost more per generation.",
                                "dependency_key": "product_generation.product_image_section.openai_api_info_group.openai_model",
                                "dependencies": [
                                    {
                                        "key": "product_generation.product_image_section.product_info_generate",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "product_generation.product_image_section.openai_api_info_group.openai_api_info"
                                    },
                                    {
                                        "key": "product_generation.product_image_section.product_info_generate",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "product_generation.product_image_section.openai_api_info_group.openai_api_info"
                                    },
                                    {
                                        "key": "product_generation.product_image_section.product_info_engine",
                                        "value": "chatgpt",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "product_generation.product_image_section.openai_api_info_group"
                                    },
                                    {
                                        "key": "product_generation.product_image_section.product_info_engine",
                                        "value": "chatgpt",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "product_generation.product_image_section.openai_api_info_group"
                                    }
                                ],
                                "validations": [],
                                "variant": "select",
                                "value": "chatgpt-4o-latest",
                                "default": "chatgpt-4o-latest",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "gpt-3.5-turbo",
                                        "title": "OpenAI GPT-3.5 Turbo"
                                    },
                                    {
                                        "value": "gpt-4o-mini",
                                        "title": "OpenAI GPT-4o Mini"
                                    },
                                    {
                                        "value": "gpt-4o",
                                        "title": "OpenAI GPT-4o"
                                    },
                                    {
                                        "value": "chatgpt-4o-latest",
                                        "title": "OpenAI ChatGPT-4o"
                                    }
                                ]
                            },
                            {
                                "id": "gemini_api_info_group",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section_gemini_api_info_group",
                                "children": [
                                    {
                                        "id": "gemini_api_info",
                                        "type": "field",
                                        "title": "Gemini API",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section_gemini_api_info_group_gemini_api_info",
                                        "children": [],
                                        "description": "Connect to your Gemini account with your website. <a href=\"https://aistudio.google.com/app/apikey\" target=\"_blank\" rel=\"noopener noreferrer\">Get Help</a>",
                                        "dependency_key": "product_generation.product_image_section.gemini_api_info_group.gemini_api_info",
                                        "dependencies": [
                                            {
                                                "key": "product_generation.product_image_section.product_info_generate",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "product_generation.product_image_section.gemini_api_info_group.gemini_api_info"
                                            },
                                            {
                                                "key": "product_generation.product_image_section.product_info_generate",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "product_generation.product_image_section.gemini_api_info_group.gemini_api_info"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "base_field_label",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/gemini-color.png",
                                        "suffix": "",
                                        "doc_link": null
                                    },
                                    {
                                        "id": "gemini_api_notice",
                                        "type": "field",
                                        "title": "You can get your API Keys in your Gemini Account.",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section_gemini_api_info_group_gemini_api_notice",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "product_generation.product_image_section.gemini_api_info_group.gemini_api_notice",
                                        "dependencies": [
                                            {
                                                "key": "product_generation.product_image_section.product_info_generate",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "product_generation.product_image_section.gemini_api_info_group.gemini_api_notice"
                                            },
                                            {
                                                "key": "product_generation.product_image_section.product_info_generate",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "product_generation.product_image_section.gemini_api_info_group.gemini_api_notice"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "info",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "",
                                        "link_text": "Gemini Account",
                                        "link_url": "https://aistudio.google.com/app/apikey",
                                        "show_icon": true
                                    },
                                    {
                                        "id": "gemini_api_key",
                                        "type": "field",
                                        "title": "API Key",
                                        "icon": "",
                                        "tooltip": "Enter your Gemini API key for content generation.",
                                        "display": true,
                                        "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section_gemini_api_info_group_gemini_api_key",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "product_generation.product_image_section.gemini_api_info_group.gemini_api_key",
                                        "dependencies": [
                                            {
                                                "key": "product_generation.product_image_section.product_info_generate",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "product_generation.product_image_section.gemini_api_info_group.gemini_api_key"
                                            },
                                            {
                                                "key": "product_generation.product_image_section.product_info_generate",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "product_generation.product_image_section.gemini_api_info_group.gemini_api_key"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Gemini API key",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    }
                                ],
                                "description": "",
                                "dependency_key": "product_generation.product_image_section.gemini_api_info_group",
                                "dependencies": [
                                    {
                                        "key": "product_generation.product_image_section.product_info_engine",
                                        "value": "gemini",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "product_generation.product_image_section.gemini_api_info_group"
                                    },
                                    {
                                        "key": "product_generation.product_image_section.product_info_engine",
                                        "value": "gemini",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "product_generation.product_image_section.gemini_api_info_group"
                                    }
                                ],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "gemini_model",
                                "type": "field",
                                "title": "Model",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_ai_assist_product_generation_product_image_section_gemini_api_info_group_gemini_model",
                                "children": [],
                                "description": "More advanced models provide higher quality output but may cost more per generation.",
                                "dependency_key": "product_generation.product_image_section.gemini_api_info_group.gemini_model",
                                "dependencies": [
                                    {
                                        "key": "product_generation.product_image_section.product_info_engine",
                                        "value": "gemini",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "product_generation.product_image_section.gemini_api_info_group"
                                    },
                                    {
                                        "key": "product_generation.product_image_section.product_info_engine",
                                        "value": "gemini",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "product_generation.product_image_section.gemini_api_info_group"
                                    },
                                    {
                                        "key": "product_generation.product_image_section.product_info_generate",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "product_generation.product_image_section.gemini_api_info_group.gemini_model"
                                    },
                                    {
                                        "key": "product_generation.product_image_section.product_info_generate",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "product_generation.product_image_section.gemini_api_info_group.gemini_model"
                                    }
                                ],
                                "validations": [],
                                "variant": "select",
                                "value": "gemini-2.0-flash",
                                "default": "gemini-2.0-flash",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "gemini-2.5-flash",
                                        "title": "Gemini 2.5 Flash"
                                    },
                                    {
                                        "value": "gemini-2.5-pro",
                                        "title": "Gemini 2.5 Pro"
                                    },
                                    {
                                        "value": "gemini-2.5-flash-lite-preview-06-17",
                                        "title": "Gemini 2.5 Flash Lite"
                                    }
                                ]
                            }
                        ],
                        "description": "",
                        "dependency_key": "product_generation.product_image_section",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "product_description_section",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_ai_assist_product_generation_product_description_section",
                        "children": [
                            {
                                "id": "product_image_enhancement",
                                "type": "field",
                                "title": "Product Image Enhancement",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_ai_assist_product_generation_product_description_section_product_image_enhancement",
                                "children": [],
                                "description": "Allow vendors to enhance and generate professional product images using AI.",
                                "dependency_key": "product_generation.product_description_section.product_image_enhancement",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "product_image_engine",
                                "type": "field",
                                "title": "Engine",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_ai_assist_product_generation_product_description_section_product_image_engine",
                                "children": [],
                                "description": "Select your AI provider for image processing and generation.",
                                "dependency_key": "product_generation.product_description_section.product_image_engine",
                                "dependencies": [
                                    {
                                        "key": "product_generation.product_description_section.product_image_enhancement",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "product_generation.product_description_section.product_image_engine"
                                    },
                                    {
                                        "key": "product_generation.product_description_section.product_image_enhancement",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "product_generation.product_description_section.product_image_engine"
                                    }
                                ],
                                "validations": [],
                                "variant": "select",
                                "value": "leonardo-ai",
                                "default": "leonardo-ai",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "leonardo-ai",
                                        "title": "Leonardo AI"
                                    }
                                ]
                            },
                            {
                                "id": "leonardo_api_info_group",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_ai_assist_product_generation_product_description_section_leonardo_api_info_group",
                                "children": [
                                    {
                                        "id": "leonardo_api_info",
                                        "type": "field",
                                        "title": "Leonardo AI API",
                                        "icon": "CircleCheck",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_ai_assist_product_generation_product_description_section_leonardo_api_info_group_leonardo_api_info",
                                        "children": [],
                                        "description": "Connect to your Leonardo AI account with your website. <a href=\"https://leonardo.ai/docs\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary hover:underline flex-inline items-center gap-0.5\">Get Help <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-arrow-up-right inline-block\"><path d=\"M7 7h10v10\"/><path d=\"M7 17 17 7\"/></svg></a>",
                                        "dependency_key": "product_generation.product_description_section.leonardo_api_info_group.leonardo_api_info",
                                        "dependencies": [
                                            {
                                                "key": "product_generation.product_description_section.product_image_enhancement",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "product_generation.product_description_section.leonardo_api_info_group.leonardo_api_info"
                                            },
                                            {
                                                "key": "product_generation.product_description_section.product_image_enhancement",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "product_generation.product_description_section.leonardo_api_info_group.leonardo_api_info"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "base_field_label",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://brandlogos.net/wp-content/uploads/2025/05/leonardo_ai-logo_brandlogos.net_ctjsa.png",
                                        "suffix": "",
                                        "doc_link": null
                                    },
                                    {
                                        "id": "leonardo_api_notice",
                                        "type": "field",
                                        "title": "You can get your API Keys in your ",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_ai_assist_product_generation_product_description_section_leonardo_api_info_group_leonardo_api_notice",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "product_generation.product_description_section.leonardo_api_info_group.leonardo_api_notice",
                                        "dependencies": [
                                            {
                                                "key": "product_generation.product_description_section.product_image_enhancement",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "product_generation.product_description_section.leonardo_api_info_group.leonardo_api_notice"
                                            },
                                            {
                                                "key": "product_generation.product_description_section.product_image_enhancement",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "product_generation.product_description_section.leonardo_api_info_group.leonardo_api_notice"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "info",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "",
                                        "link_text": "Leonardo AI account.",
                                        "link_url": "https://leonardo.ai/api",
                                        "show_icon": true
                                    },
                                    {
                                        "id": "leonardo_api_key",
                                        "type": "field",
                                        "title": "API Key",
                                        "icon": "",
                                        "tooltip": "Enter your Leonardo AI API key for image generation.",
                                        "display": true,
                                        "hook_key": "dokan_settings_ai_assist_product_generation_product_description_section_leonardo_api_info_group_leonardo_api_key",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "product_generation.product_description_section.leonardo_api_info_group.leonardo_api_key",
                                        "dependencies": [
                                            {
                                                "key": "product_generation.product_description_section.product_image_enhancement",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "product_generation.product_description_section.leonardo_api_info_group.leonardo_api_key"
                                            },
                                            {
                                                "key": "product_generation.product_description_section.product_image_enhancement",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "product_generation.product_description_section.leonardo_api_info_group.leonardo_api_key"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "126464 - 8485895 - 94848",
                                        "default": "",
                                        "placeholder": "Enter your Leonardo AI API key",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    }
                                ],
                                "description": "",
                                "dependency_key": "product_generation.product_description_section.leonardo_api_info_group",
                                "dependencies": [
                                    {
                                        "key": "product_generation.product_description_section.product_image_engine",
                                        "value": "leonardo-ai",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "product_generation.product_description_section.leonardo_api_info_group"
                                    },
                                    {
                                        "key": "product_generation.product_description_section.product_image_engine",
                                        "value": "leonardo-ai",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "product_generation.product_description_section.leonardo_api_info_group"
                                    }
                                ],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "leonardo_model",
                                "type": "field",
                                "title": "Model",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_ai_assist_product_generation_product_description_section_leonardo_api_info_group_leonardo_model",
                                "children": [],
                                "description": "Choose the AI model for image enhancement and generation. Different models excel at various image types and styles.",
                                "dependency_key": "product_generation.product_description_section.leonardo_api_info_group.leonardo_model",
                                "dependencies": [
                                    {
                                        "key": "product_generation.product_description_section.product_image_engine",
                                        "value": "leonardo-ai",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "product_generation.product_description_section.leonardo_api_info_group"
                                    },
                                    {
                                        "key": "product_generation.product_description_section.product_image_engine",
                                        "value": "leonardo-ai",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "product_generation.product_description_section.leonardo_api_info_group"
                                    },
                                    {
                                        "key": "product_generation.product_description_section.product_image_enhancement",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "product_generation.product_description_section.leonardo_api_info_group.leonardo_model"
                                    },
                                    {
                                        "key": "product_generation.product_description_section.product_image_enhancement",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "product_generation.product_description_section.leonardo_api_info_group.leonardo_model"
                                    }
                                ],
                                "validations": [],
                                "variant": "select",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "",
                                        "title": "Select Model"
                                    }
                                ]
                            }
                        ],
                        "description": "",
                        "dependency_key": "product_generation.product_description_section",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Set up AI to elevate your platform with enhanced capabilities.",
                "dependency_key": "product_generation",
                "dependencies": [],
                "validations": [],
                "priority": 100,
                "doc_link": "https://dokan.co/docs/wordpress/settings/dokan-ai-assistant/",
                "doc_link_text": "Doc"
            }
        ],
        "description": "Configure AI-powered features to enhance your marketplace experience.",
        "dependency_key": "",
        "dependencies": [],
        "validations": []
    },
    {
        "id": "vendor",
        "type": "page",
        "title": "Vendors",
        "icon": "Users",
        "tooltip": "",
        "display": true,
        "hook_key": "dokan_settings_vendor",
        "children": [
            {
                "id": "vendor_onboarding",
                "type": "subpage",
                "title": "Vendor Onboarding",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_vendor_vendor_onboarding",
                "children": [
                    {
                        "id": "vendor_vendor_onboarding_settings",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_vendor_vendor_onboarding_settings",
                        "children": [
                            {
                                "id": "enable_selling",
                                "type": "field",
                                "title": "Enable Selling",
                                "icon": "",
                                "tooltip": "If checked, vendors will have permission to sell immediately after registration. If unchecked, newly registered vendors cannot add products until selling capability is activated manually from admin dashboard.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_onboarding_enable_selling",
                                "children": [],
                                "description": "Immediately enable selling for newly registered vendors.",
                                "dependency_key": "vendor_onboarding.enable_selling",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "automatically",
                                "default": "automatically",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "automatically",
                                        "title": "Automatically",
                                        "icon": ""
                                    },
                                    {
                                        "value": "manually",
                                        "title": "Manually",
                                        "icon": ""
                                    },
                                    {
                                        "value": "verified_only",
                                        "title": "Verified Only",
                                        "icon": ""
                                    }
                                ]
                            },
                            {
                                "id": "address_fields",
                                "type": "field",
                                "title": "Address Fields",
                                "icon": "",
                                "tooltip": "Add Address Fields on the Vendor Registration form.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_onboarding_address_fields",
                                "children": [],
                                "description": "Add Address Fields on the Vendor Registration form.",
                                "dependency_key": "vendor_onboarding.address_fields",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "terms_conditions",
                                "type": "field",
                                "title": "Terms and Conditions",
                                "icon": "",
                                "tooltip": "Prompt terms and condition check for vendors when creating store on your site",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_onboarding_terms_conditions",
                                "children": [],
                                "description": "Enable the terms &amp; conditions checkbox on vendor registration form.",
                                "dependency_key": "vendor_onboarding.terms_conditions",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "welcome_wizard",
                                "type": "field",
                                "title": "Welcome Wizard",
                                "icon": "",
                                "tooltip": "If checked, vendors will be prompted through a guided setup process.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_onboarding_welcome_wizard",
                                "children": [],
                                "description": "Welcome wizard for newly registered vendors.",
                                "dependency_key": "vendor_onboarding.welcome_wizard",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "vendor_setup_wizard_logo",
                                "type": "field",
                                "title": "Vendor Setup Wizard Logo",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_onboarding_vendor_setup_wizard_logo",
                                "children": [],
                                "description": "Recommended logo size (270px X 90px). If no logo is uploaded, site title is shown by default.",
                                "dependency_key": "vendor_onboarding.vendor_setup_wizard_logo",
                                "dependencies": [],
                                "validations": [],
                                "variant": "file_upload",
                                "value": "",
                                "default": "",
                                "placeholder": "+ Choose File",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "Recommended logo size (270px X 90px). If no logo is uploaded, site title is shown by default.",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "allowed_types": [
                                    "image/jpeg",
                                    "image/png",
                                    "image/gif",
                                    "image/svg+xml"
                                ],
                                "max_file_size": 2097152,
                                "multiple": false,
                                "input_type": "file_upload"
                            },
                            {
                                "id": "vendor_setup_wizard_message",
                                "type": "field",
                                "title": "Vendor Setup Wizard Message",
                                "icon": "",
                                "tooltip": "This is a tooltip for the rich text field.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_onboarding_vendor_setup_wizard_message",
                                "children": [],
                                "description": "",
                                "dependency_key": "vendor_onboarding.vendor_setup_wizard_message",
                                "dependencies": [],
                                "validations": [],
                                "variant": "rich_text",
                                "value": "<p>Thank you for choosing The Marketplace to power your online store! This quick setup wizard will help you configure the basic settings. <strong>It&rsquo;s completely optional and shouldn&rsquo;t take longer than two minutes.</strong></p>",
                                "default": "",
                                "placeholder": "Enter your welcome message here...",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            }
                        ],
                        "description": "",
                        "dependency_key": "vendor.vendor_vendor_onboarding_settings",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                ],
                "description": "Control the onboarding experience for vendors joining your marketplace.",
                "dependency_key": "vendor_onboarding",
                "dependencies": [],
                "validations": [],
                "priority": 100,
                "doc_link": "https://wedevs.com/docs/dokan-lite/vendor-onboarding/"
            },
            {
                "id": "vendor_capabilities",
                "type": "subpage",
                "title": "Vendor Capabilities",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_vendor_vendor_capabilities",
                "children": [
                    {
                        "id": "vendor_capabilities",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities",
                        "children": [
                            {
                                "id": "global_digital_mode",
                                "type": "field",
                                "title": "Selling Product Types",
                                "icon": "",
                                "tooltip": "Select the type of products vendor can sell.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_global_digital_mode",
                                "children": [],
                                "description": "Select a type for vendors what type of product they can sell only.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.global_digital_mode",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "sell_both",
                                "default": "physical",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "sell_physical",
                                        "title": "Physical",
                                        "startIcon": "Box"
                                    },
                                    {
                                        "value": "sell_digital",
                                        "title": "Digital",
                                        "startIcon": "Download"
                                    },
                                    {
                                        "value": "sell_both",
                                        "title": "Both",
                                        "startIcon": "Dices"
                                    }
                                ]
                            },
                            {
                                "id": "product_status",
                                "type": "field",
                                "title": "Product Status",
                                "icon": "",
                                "tooltip": "The status of a product when a vendor creates or updates it.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_product_status",
                                "children": [],
                                "description": "The status of a product when a vendor creates or updates it.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.product_status",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "pending",
                                "default": "published",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "publish",
                                        "title": "Published",
                                        "icon": ""
                                    },
                                    {
                                        "value": "pending",
                                        "title": "Pending Review",
                                        "icon": ""
                                    }
                                ]
                            },
                            {
                                "id": "duplicate_product",
                                "type": "field",
                                "title": "Duplicate Product",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_duplicate_product",
                                "children": [],
                                "description": "Allow vendor to duplicate their product.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.duplicate_product",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "allow_vendor_create_manual_order",
                                "type": "field",
                                "title": "Allow vendors to create orders",
                                "icon": "",
                                "tooltip": "When enabled, vendors can create manual orders directly from their dashboard for direct sales.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_allow_vendor_create_manual_order",
                                "children": [],
                                "description": "Enable vendors to create orders manually from their dashboard.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.allow_vendor_create_manual_order",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "one_page_creation",
                                "type": "field",
                                "title": "One Page Product Creation",
                                "icon": "",
                                "tooltip": "If disabled, instead of a single add product page it will open a pop up window or vendor will redirect to product page when adding new product.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_one_page_creation",
                                "children": [],
                                "description": "Add new product in single page view.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.one_page_creation",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "product_popup",
                                "type": "field",
                                "title": "Product Popup",
                                "icon": "",
                                "tooltip": "If disabled, instead of a pop up window vendor will redirect to product page when adding new product.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_product_popup",
                                "children": [],
                                "description": "Add new product in popup view.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.product_popup",
                                "dependencies": [
                                    {
                                        "key": "vendor_capabilities.vendor_capabilities.one_page_creation",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "!==",
                                        "self": "vendor_capabilities.vendor_capabilities.product_popup"
                                    },
                                    {
                                        "key": "vendor_capabilities.vendor_capabilities.one_page_creation",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "===",
                                        "self": "vendor_capabilities.vendor_capabilities.product_popup"
                                    }
                                ],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "order_status_change",
                                "type": "field",
                                "title": "Order Status Change",
                                "icon": "",
                                "tooltip": "Checking this will enable sellers to change the order status. If unchecked, only admin can change the order status.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_order_status_change",
                                "children": [],
                                "description": "Allow vendor to update order status.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.order_status_change",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "select_any_category",
                                "type": "field",
                                "title": "Select any category",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_select_any_category",
                                "children": [],
                                "description": "Allow vendors to select any category while creating/editing products.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.select_any_category",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "category_selection",
                                "type": "field",
                                "title": "Product Category Selection",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_category_selection",
                                "children": [],
                                "description": "Control how vendors assign categories to their products.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.category_selection",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "single",
                                "default": "single",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "single",
                                        "title": "Single",
                                        "icon": ""
                                    },
                                    {
                                        "value": "multiple",
                                        "title": "Multiple",
                                        "icon": ""
                                    }
                                ]
                            },
                            {
                                "id": "vendors_create_tags",
                                "type": "field",
                                "title": "Vendors Can Create Tags",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_vendors_create_tags",
                                "children": [],
                                "description": "Allow vendors to create new product tags from vendor dashboard.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.vendors_create_tags",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "add_new_attribute_values",
                                "type": "field",
                                "title": "Add New Attribute Values",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_add_new_attribute_values",
                                "children": [],
                                "description": "Allow vendors to add new values to predefined attribute.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.add_new_attribute_values",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "product_review_management",
                                "type": "field",
                                "title": "Product Review Management by Vendors",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_product_review_management",
                                "children": [],
                                "description": "Allow vendors to manage product review status changes from their dashboard.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.product_review_management",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "discount_order_settings",
                                "type": "field",
                                "title": "Discount Editing",
                                "icon": "",
                                "tooltip": "Select the pages where you want to display the store location map.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_discount_order_settings",
                                "children": [],
                                "description": "Vendor can add order and product quantity discount.",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.discount_order_settings",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "discount_settings",
                                "type": "field",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_capabilities_vendor_capabilities_discount_settings",
                                "children": [],
                                "description": "",
                                "dependency_key": "vendor_capabilities.vendor_capabilities.discount_settings",
                                "dependencies": [
                                    {
                                        "key": "vendor_capabilities.vendor_capabilities.discount_order_settings",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "vendor_capabilities.vendor_capabilities.discount_settings"
                                    },
                                    {
                                        "key": "vendor_capabilities.vendor_capabilities.discount_order_settings",
                                        "value": "off",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "===",
                                        "self": "vendor_capabilities.vendor_capabilities.discount_settings"
                                    }
                                ],
                                "validations": [],
                                "variant": "multicheck",
                                "value": {
                                    "order-discount": "Order Discount",
                                    "product-discount": "Product Quantity Discount"
                                },
                                "default": [
                                    "order-discount",
                                    "product-discount"
                                ],
                                "options": [
                                    {
                                        "value": "order-discount",
                                        "title": "Order Discount"
                                    },
                                    {
                                        "value": "product-discount",
                                        "title": "Product Quantity Discount"
                                    }
                                ],
                                "helper_text": ""
                            }
                        ],
                        "description": "",
                        "dependency_key": "vendor_capabilities.vendor_capabilities",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Configure what vendors can do and control within your marketplace.",
                "dependency_key": "vendor_capabilities",
                "dependencies": [],
                "validations": [],
                "priority": 300,
                "doc_link": "http://localhost:6006/?path=/story/components-settings--dokan-settings&globals=theme:light",
                "doc_link_text": "Doc"
            },
            {
                "id": "single_product_multi_vendor",
                "type": "subpage",
                "title": "Single Product Multi-Vendor",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_vendor_single_product_multi_vendor",
                "children": [
                    {
                        "id": "single_product_multi_vendor",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_vendor_single_product_multi_vendor_single_product_multi_vendor",
                        "children": [
                            {
                                "id": "single_product_multiple_vendor",
                                "type": "field",
                                "title": "Single Product Multiple Vendor",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_single_product_multi_vendor_single_product_multi_vendor_single_product_multiple_vendor",
                                "children": [],
                                "description": "Enable Single Product Multiple Vendor functionality.",
                                "dependency_key": "single_product_multi_vendor.single_product_multi_vendor.single_product_multiple_vendor",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sell_item_button_text",
                                "type": "field",
                                "title": "Sell Item Button Text",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_single_product_multi_vendor_single_product_multi_vendor_sell_item_button_text",
                                "children": [],
                                "description": "Change your sell this item button text.",
                                "dependency_key": "single_product_multi_vendor.single_product_multi_vendor.sell_item_button_text",
                                "dependencies": [],
                                "validations": [],
                                "variant": "text",
                                "value": "Sell This Item",
                                "default": "Sell This Item",
                                "placeholder": "Sell This Item",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            },
                            {
                                "id": "available_vendor_display_area_title",
                                "type": "field",
                                "title": "Available Vendor Display Area Title",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_single_product_multi_vendor_single_product_multi_vendor_available_vendor_display_area_title",
                                "children": [],
                                "description": "Set your heading for available vendor section in single product page.",
                                "dependency_key": "single_product_multi_vendor.single_product_multi_vendor.available_vendor_display_area_title",
                                "dependencies": [],
                                "validations": [],
                                "variant": "text",
                                "value": "Other Available Vendor",
                                "default": "Other Available Vendor",
                                "placeholder": "Other Available Vendor",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            },
                            {
                                "id": "available_vendor_section_display_position",
                                "type": "field",
                                "title": "Available Vendor Section Display Position",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_single_product_multi_vendor_single_product_multi_vendor_available_vendor_section_display_position",
                                "children": [],
                                "description": "Control where customers see the list of available vendors when viewing products sold by multiple vendors.",
                                "dependency_key": "single_product_multi_vendor.single_product_multi_vendor.available_vendor_section_display_position",
                                "dependencies": [],
                                "validations": [],
                                "variant": "customize_radio",
                                "value": "below_tabs",
                                "default": "below_tabs",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "title": "Top of Product Tab",
                                        "value": "below_tabs",
                                        "description": "",
                                        "image": image
                                    },
                                    {
                                        "title": "Inside Product Tab",
                                        "value": "inside_tabs",
                                        "description": "",
                                        "image": image2
                                    },
                                    {
                                        "title": "Bottom of Product Tab",
                                        "value": "after_tabs",
                                        "description": "",
                                        "image": image
                                    }
                                ],
                                "radio_variant": "card",
                                "css_class": "md:!grid-cols-3",
                                "grid_config": []
                            },
                            {
                                "id": "spmv_products_display",
                                "type": "field",
                                "title": "SPMV Products Display",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_single_product_multi_vendor_single_product_multi_vendor_spmv_products_display",
                                "children": [],
                                "description": "Select option for shown products under SPMV concept. &quot;Show all products&quot; will show all duplicate products.",
                                "dependency_key": "single_product_multi_vendor.single_product_multi_vendor.spmv_products_display",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select",
                                "value": "",
                                "default": "",
                                "placeholder": "Show all products",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "show_all",
                                        "title": "Show all products"
                                    },
                                    {
                                        "value": "min_price",
                                        "title": "Min price"
                                    },
                                    {
                                        "value": "max_price",
                                        "title": "Max price"
                                    },
                                    {
                                        "value": "top_rated_vendor",
                                        "title": "Top rated vendor"
                                    }
                                ]
                            }
                        ],
                        "description": "",
                        "dependency_key": "single_product_multi_vendor.single_product_multi_vendor",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "You can configure your site to allow vendors to sell other vendor&#039;s products with desired customizations.",
                "dependency_key": "single_product_multi_vendor",
                "dependencies": [],
                "validations": [],
                "priority": 600,
                "doc_link": "https://wedevs.com/docs/dokan/vendor-settings/single-product-multi-vendor/",
                "doc_link_text": "Doc"
            },
            {
                "id": "store_state",
                "type": "subpage",
                "title": "Store Stats",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_vendor_store_state",
                "children": [
                    {
                        "id": "store_stats_section",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_vendor_store_state_store_stats_section",
                        "children": [
                            {
                                "id": "analytics_authenticate_user",
                                "type": "field",
                                "title": "Google Analytics Authentication",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_store_state_store_stats_section_analytics_authenticate_user",
                                "children": [],
                                "description": "Connect your Google Analytics account to track vendor store performance.",
                                "dependency_key": "store_state.store_stats_section.analytics_authenticate_user",
                                "dependencies": [],
                                "validations": [],
                                "variant": "google_analytics",
                                "value": {
                                    "connected": false,
                                    "profile_id": "profile_1",
                                    "profiles": [
                                        { "value": "profile_1", "label": "All Web Site Data" },
                                        { "value": "profile_2", "label": "Test Profile" }
                                    ],
                                    "disconnect_url": "#",
                                    "auth_url": "#"
                                },
                                "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png"
                            },
                            {
                                "id": "google_analytics_add_tracking_code",
                                "type": "field",
                                "title": "Add Tracking Code",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_store_state_store_stats_section_add_tracking_code",
                                "children": [],
                                "description": "This is an optional settings that will add Analytics Global Site Tag in you site header. If you use any SEO plugin or add your tracking code by other means, then choose `no` in the settings.",
                                "dependency_key": "store_state.store_stats_section.add_tracking_code",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                }
                            }
                        ],
                        "description": "",
                        "dependency_key": "store_state.store_stats_section",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Set up Google Analytics tracking for vendor stores in your marketplace.",
                "dependency_key": "store_state",
                "dependencies": [],
                "validations": [],
                "priority": 500,
                "doc_link": "https://wedevs.com/docs/dokan/vendor-settings/store-state/",
                "doc_link_text": "Doc"
            },
            {
                "id": "social_onboarding",
                "type": "subpage",
                "title": "Social Onboarding",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_vendor_social_onboarding",
                "children": [
                    {
                        "id": "social_onboarding",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding",
                        "children": [
                            {
                                "id": "social_login",
                                "type": "field",
                                "title": "Social Login",
                                "icon": "",
                                "tooltip": "Check this to allow social login/signup for customers and vendors.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_social_login",
                                "children": [],
                                "description": "Enabling this will add Social Icons under registration form to allow users to login or register using Social Profiles.",
                                "dependency_key": "social_onboarding.social_onboarding.social_login",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "facebook_api_group",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_facebook_api_group",
                                "children": [
                                    {
                                        "id": "facebook_enabled",
                                        "type": "field",
                                        "title": "Connect to Facebook",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_facebook_api_group_facebook_enabled",
                                        "children": [],
                                        "description": "Configure your Facebook API settings. <a href=\"https://dokan.co/docs/wordpress/settings/dokan-social-login/configuring-facebook/\" class=\"text-primary underline\" target=\"_blank\">Get Help </a>",
                                        "dependency_key": "social_onboarding.social_onboarding.facebook_api_group.facebook_enabled",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2021/06/15/12/51/facebook-6338508_640.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "facebook_info",
                                        "type": "field",
                                        "title": "You can successfully connect Facebook with your website.",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_facebook_api_group_facebook_info",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "social_onboarding.social_onboarding.facebook_api_group.facebook_info",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.facebook_api_group.facebook_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.facebook_api_group.facebook_info"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.facebook_api_group.facebook_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.facebook_api_group.facebook_info"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "info",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "",
                                        "link_text": "+ Create an App",
                                        "link_url": "https://developers.facebook.com/apps/",
                                        "show_icon": true
                                    },
                                    {
                                        "id": "facebook_redirect_url",
                                        "type": "field",
                                        "title": "Redirect URL",
                                        "icon": "",
                                        "tooltip": "Your store URL, which will be required in creating the App.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_facebook_api_group_facebook_redirect_url",
                                        "children": [],
                                        "description": "Your store URL, which will be required in creating the App.",
                                        "dependency_key": "social_onboarding.social_onboarding.facebook_api_group.facebook_redirect_url",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.facebook_api_group.facebook_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.facebook_api_group.facebook_redirect_url"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.facebook_api_group.facebook_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.facebook_api_group.facebook_redirect_url"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "copy_field",
                                        "value": "https://core-dokan.test/my-account/",
                                        "default": "https://core-dokan.test/wp-admin/admin-ajax.php?action=dokan_facebook_callback",
                                        "placeholder": "https://core-dokan.test/wp-admin/admin-ajax.php?action=dokan_facebook_callback",
                                        "readonly": true,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "facebook_app_id",
                                        "type": "field",
                                        "title": "Facebook App ID",
                                        "icon": "",
                                        "tooltip": "You can get it from Facebook Developer platform -&gt; Login -&gt; Select &quot;Add A New App&quot; -&gt; Collect App ID.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_facebook_api_group_facebook_app_id",
                                        "children": [],
                                        "description": "Enter your Facebook App ID from Facebook Developer Console.",
                                        "dependency_key": "social_onboarding.social_onboarding.facebook_api_group.facebook_app_id",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.facebook_api_group.facebook_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.facebook_api_group.facebook_app_id"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.facebook_api_group.facebook_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.facebook_api_group.facebook_app_id"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Facebook App ID",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "facebook_app_secret",
                                        "type": "field",
                                        "title": "Facebook App Secret",
                                        "icon": "",
                                        "tooltip": "You can get it from Facebook Developer platform -&gt; Login -&gt; Select &quot;Add A New App&quot; -&gt; Collect App secret.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_facebook_api_group_facebook_app_secret",
                                        "children": [],
                                        "description": "Enter your Facebook App Secret from Facebook Developer Console.",
                                        "dependency_key": "social_onboarding.social_onboarding.facebook_api_group.facebook_app_secret",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.facebook_api_group.facebook_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.facebook_api_group.facebook_app_secret"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.facebook_api_group.facebook_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.facebook_api_group.facebook_app_secret"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Facebook App Secret",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    }
                                ],
                                "description": "",
                                "dependency_key": "social_onboarding.social_onboarding.facebook_api_group",
                                "dependencies": [
                                    {
                                        "key": "social_onboarding.social_onboarding.social_login",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "==",
                                        "self": "social_onboarding.social_onboarding.facebook_api_group"
                                    },
                                    {
                                        "key": "social_onboarding.social_onboarding.social_login",
                                        "value": "off",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "==",
                                        "self": "social_onboarding.social_onboarding.facebook_api_group"
                                    },
                                    {
                                        "key": "social_onboarding.social_onboarding.social_login",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "social_onboarding.social_onboarding.facebook_api_group"
                                    }
                                ],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "x_api_group",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_x_api_group",
                                "children": [
                                    {
                                        "id": "x_enabled",
                                        "type": "field",
                                        "title": "Connect to X (Twitter)",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_x_api_group_x_enabled",
                                        "children": [],
                                        "description": "Configure your X API settings. <a href=\"https://dokan.co/docs/wordpress/settings/dokan-social-login/configuring-twitter/\" class=\"text-primary underline\" target=\"_blank\">Get Help</a>",
                                        "dependency_key": "social_onboarding.social_onboarding.x_api_group.x_enabled",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2021/06/15/12/51/facebook-6338508_640.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "twitter_info",
                                        "type": "field",
                                        "title": "You can successfully connect Twitter with your website.",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_x_api_group_twitter_info",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "social_onboarding.social_onboarding.x_api_group.twitter_info",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.x_api_group.x_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.x_api_group.twitter_info"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.x_api_group.x_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.x_api_group.twitter_info"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "info",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "",
                                        "link_text": "+ Create an App",
                                        "link_url": "https://apps.twitter.com/",
                                        "show_icon": true
                                    },
                                    {
                                        "id": "x_redirect_url",
                                        "type": "field",
                                        "title": "Callback URL ",
                                        "icon": "",
                                        "tooltip": "Your store URL, which will be required in creating the App.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_x_api_group_x_redirect_url",
                                        "children": [],
                                        "description": "The redirect URL for X Login. Copy this URL and add it to your X App settings.",
                                        "dependency_key": "social_onboarding.social_onboarding.x_api_group.x_redirect_url",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.x_api_group.x_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.x_api_group.x_redirect_url"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.x_api_group.x_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.x_api_group.x_redirect_url"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "copy_field",
                                        "value": "https://core-dokan.test/my-account/",
                                        "default": "https://core-dokan.test/wp-admin/admin-ajax.php?action=dokan_x_callback",
                                        "placeholder": "",
                                        "readonly": true,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "x_api_key",
                                        "type": "field",
                                        "title": "Consumer Key",
                                        "icon": "",
                                        "tooltip": "You can get it from Twitter Developer platform -&gt; Login -&gt; Select  &quot;Create an App&quot; -&gt; Input URL &amp; integrate X with Dokan. Go to &quot;Keys and Tokens&quot; -&gt; View Keys -&gt; Collect API key and use as Consumer Key",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_x_api_group_x_api_key",
                                        "children": [],
                                        "description": "Enter your X API Key from X Developer Console.",
                                        "dependency_key": "social_onboarding.social_onboarding.x_api_group.x_api_key",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.x_api_group.x_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.x_api_group.x_api_key"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.x_api_group.x_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.x_api_group.x_api_key"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your X API Key",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "x_api_secret",
                                        "type": "field",
                                        "title": "Consumer Secret",
                                        "icon": "",
                                        "tooltip": "You can get it from Twitter Developer platform -&gt; Login -&gt; Select  &quot;Create an App&quot; -&gt; Input URL &amp; integrate X with Dokan. Go to &quot;Keys and Tokens&quot; -&gt; View Keys -&gt; Collect API secret and use as Consumer secret.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_x_api_group_x_api_secret",
                                        "children": [],
                                        "description": "Enter your X API Secret from X Developer Console.",
                                        "dependency_key": "social_onboarding.social_onboarding.x_api_group.x_api_secret",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.x_api_group.x_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.x_api_group.x_api_secret"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.x_api_group.x_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.x_api_group.x_api_secret"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your X API Secret",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    }
                                ],
                                "description": "",
                                "dependency_key": "social_onboarding.social_onboarding.x_api_group",
                                "dependencies": [
                                    {
                                        "key": "social_onboarding.social_onboarding.social_login",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "==",
                                        "self": "social_onboarding.social_onboarding.x_api_group"
                                    },
                                    {
                                        "key": "social_onboarding.social_onboarding.social_login",
                                        "value": "off",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "==",
                                        "self": "social_onboarding.social_onboarding.x_api_group"
                                    }
                                ],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "google_api_group",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_google_api_group",
                                "children": [
                                    {
                                        "id": "google_enabled",
                                        "type": "field",
                                        "title": "Connect to Google",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_google_api_group_google_enabled",
                                        "children": [],
                                        "description": "Configure your Google API settings. <a href=\"https://dokan.co/docs/wordpress/settings/dokan-social-login/configuring-google/\" class=\"text-primary underline\" target=\"_blank\">Get Help</a>",
                                        "dependency_key": "social_onboarding.social_onboarding.google_api_group.google_enabled",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2021/06/15/12/51/facebook-6338508_640.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "google_info",
                                        "type": "field",
                                        "title": "You can successfully connect to your Google account with your website.",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_google_api_group_google_info",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "social_onboarding.social_onboarding.google_api_group.google_info",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.google_api_group.google_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.google_api_group.google_info"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.google_api_group.google_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.google_api_group.google_info"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "info",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "",
                                        "link_text": "+ Create an App",
                                        "link_url": "https://console.developers.google.com/project",
                                        "show_icon": true
                                    },
                                    {
                                        "id": "google_redirect_url",
                                        "type": "field",
                                        "title": "Redirect URL",
                                        "icon": "",
                                        "tooltip": "Your store URL, which will be required in syncing with Google API.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_google_api_group_google_redirect_url",
                                        "children": [],
                                        "description": "The redirect URL for Google Login. Copy this URL and add it to your Google OAuth settings.",
                                        "dependency_key": "social_onboarding.social_onboarding.google_api_group.google_redirect_url",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.google_api_group.google_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.google_api_group.google_redirect_url"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.google_api_group.google_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.google_api_group.google_redirect_url"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "copy_field",
                                        "value": "https://core-dokan.test/my-account/",
                                        "default": "https://core-dokan.test/wp-admin/admin-ajax.php?action=dokan_google_callback",
                                        "placeholder": "https://core-dokan.test/wp-admin/admin-ajax.php?action=dokan_google_callback",
                                        "readonly": true,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "google_client_id",
                                        "type": "field",
                                        "title": "Google Client ID",
                                        "icon": "",
                                        "tooltip": "You can get it from Google Console Platform -&gt; Google+API -&gt; Enable -&gt; Manage -&gt; Credentials -&gt; Create Credentials -&gt; OAuth client ID -&gt; Web Application -&gt; Fill in the information &amp; click Create. A pop up will show &quot;Client ID&quot;.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_google_api_group_google_client_id",
                                        "children": [],
                                        "description": "Enter your Google Client ID from Google Cloud Console.",
                                        "dependency_key": "social_onboarding.social_onboarding.google_api_group.google_client_id",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.google_api_group.google_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.google_api_group.google_client_id"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.google_api_group.google_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.google_api_group.google_client_id"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Google Client ID",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "google_client_secret",
                                        "type": "field",
                                        "title": "Google Client Secret",
                                        "icon": "",
                                        "tooltip": "You can get it from Google Console Platform -&gt; Google+API -&gt; Enable -&gt; Manage -&gt; Credentials -&gt; Create Credentials -&gt; OAuth client ID -&gt; Web Application -&gt; Fill in the information &amp; click Create. A pop up will show &quot;Client Credentials&quot;.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_google_api_group_google_client_secret",
                                        "children": [],
                                        "description": "Enter your Google Client Secret from Google Cloud Console.",
                                        "dependency_key": "social_onboarding.social_onboarding.google_api_group.google_client_secret",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.google_api_group.google_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.google_api_group.google_client_secret"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.google_api_group.google_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.google_api_group.google_client_secret"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Google Client Secret",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    }
                                ],
                                "description": "",
                                "dependency_key": "social_onboarding.social_onboarding.google_api_group",
                                "dependencies": [
                                    {
                                        "key": "social_onboarding.social_onboarding.social_login",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "social_onboarding.social_onboarding.google_api_group"
                                    },
                                    {
                                        "key": "social_onboarding.social_onboarding.social_login",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "social_onboarding.social_onboarding.google_api_group"
                                    }
                                ],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "linkedin_api_group",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_linkedin_api_group",
                                "children": [
                                    {
                                        "id": "linkedin_enabled",
                                        "type": "field",
                                        "title": "Connect to LinkedIn",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_linkedin_api_group_linkedin_enabled",
                                        "children": [],
                                        "description": "Configure your LinkedIn API settings. <a href=\"https://dokan.co/docs/wordpress/settings/dokan-social-login/configuring-linkedin/\" class=\"text-primary underline\" target=\"_blank\">Get Help</a>",
                                        "dependency_key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_enabled",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2021/06/15/12/51/facebook-6338508_640.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "linkedin_info",
                                        "type": "field",
                                        "title": "You can successfully connect LinkedIn with your website.",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_linkedin_api_group_linkedin_info",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_info",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_info"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_info"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "info",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "",
                                        "link_text": "+ Create an App",
                                        "link_url": "https://www.linkedin.com/developer/apps",
                                        "show_icon": true
                                    },
                                    {
                                        "id": "linkedin_redirect_url",
                                        "type": "field",
                                        "title": "Redirect URL",
                                        "icon": "",
                                        "tooltip": "Your store URL, which will be required in creating the App.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_linkedin_api_group_linkedin_redirect_url",
                                        "children": [],
                                        "description": "The redirect URL for LinkedIn Login. Copy this URL and add it to your LinkedIn App settings.",
                                        "dependency_key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_redirect_url",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_redirect_url"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_redirect_url"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "copy_field",
                                        "value": "https://core-dokan.test/my-account/",
                                        "default": "https://core-dokan.test/wp-admin/admin-ajax.php?action=dokan_linkedin_callback",
                                        "placeholder": "https://core-dokan.test/wp-admin/admin-ajax.php?action=dokan_linkedin_callback",
                                        "readonly": true,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "linkedin_client_id",
                                        "type": "field",
                                        "title": "LinkedIn Client ID",
                                        "icon": "",
                                        "tooltip": "You can get it from LinkedIn Developers platform -&gt; Create an App -&gt; Fill necessary info -&gt; Click &quot;Create app&quot; -&gt; &quot;Auth&quot; section -&gt; Collect Client ID.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_linkedin_api_group_linkedin_client_id",
                                        "children": [],
                                        "description": "Enter your LinkedIn Client ID from LinkedIn Developer Console.",
                                        "dependency_key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_client_id",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_client_id"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_client_id"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your LinkedIn Client ID",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "linkedin_client_secret",
                                        "type": "field",
                                        "title": "LinkedIn Client Secret",
                                        "icon": "",
                                        "tooltip": "You can get it from LinkedIn Developers platform -&gt; Create an App -&gt; Fill necessary info -&gt; Click &quot;Create app&quot; -&gt; &quot;Auth&quot; section -&gt; Collect Client Secret.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_linkedin_api_group_linkedin_client_secret",
                                        "children": [],
                                        "description": "Enter your LinkedIn Client Secret from LinkedIn Developer Console.",
                                        "dependency_key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_client_secret",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_client_secret"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.linkedin_api_group.linkedin_client_secret"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your LinkedIn Client Secret",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    }
                                ],
                                "description": "",
                                "dependency_key": "social_onboarding.social_onboarding.linkedin_api_group",
                                "dependencies": [
                                    {
                                        "key": "social_onboarding.social_onboarding.social_login",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "social_onboarding.social_onboarding.linkedin_api_group"
                                    },
                                    {
                                        "key": "social_onboarding.social_onboarding.social_login",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "social_onboarding.social_onboarding.linkedin_api_group"
                                    }
                                ],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "apple_api_group",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_apple_api_group",
                                "children": [
                                    {
                                        "id": "apple_enabled",
                                        "type": "field",
                                        "title": "Connect to Apple",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_apple_api_group_apple_enabled",
                                        "children": [],
                                        "description": "Configure your Apple API settings. <a href=\"https://dokan.co/docs/wordpress/settings/dokan-social-login/configuring-apple/\" class=\"text-primary underline\" target=\"_blank\">Get Help</a>",
                                        "dependency_key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2021/06/15/12/51/facebook-6338508_640.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "apple_info",
                                        "type": "field",
                                        "title": "You can successfully connect your Apple account with your website.",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_apple_api_group_apple_info",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "social_onboarding.social_onboarding.apple_api_group.apple_info",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.apple_api_group.apple_info"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.apple_api_group.apple_info"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "info",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "",
                                        "link_text": "+ Create an App",
                                        "link_url": "https://appleid.apple.com/",
                                        "show_icon": true
                                    },
                                    {
                                        "id": "apple_redirect_url",
                                        "type": "field",
                                        "title": "Redirect URL",
                                        "icon": "",
                                        "tooltip": "Your store URL, which will be required in creating the app.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_apple_api_group_apple_redirect_url",
                                        "children": [],
                                        "description": "The redirect URL for Apple Sign In. Copy this URL and add it to your Apple Developer account.",
                                        "dependency_key": "social_onboarding.social_onboarding.apple_api_group.apple_redirect_url",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.apple_api_group.apple_redirect_url"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.apple_api_group.apple_redirect_url"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "copy_field",
                                        "value": "https://core-dokan.test/my-account/",
                                        "default": "https://core-dokan.test/wp-admin/admin-ajax.php?action=dokan_apple_callback",
                                        "placeholder": "https://core-dokan.test/wp-admin/admin-ajax.php?action=dokan_apple_callback",
                                        "readonly": true,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "apple_service_id",
                                        "type": "field",
                                        "title": "Apple Service ID",
                                        "icon": "",
                                        "tooltip": "You can get it from Apple Developer platform -&gt; login -&gt; Certificates, IDs &amp; Profiles -&gt; Indentifiers -&gt; Service IDs (drop down) -&gt; Register for Service ID -&gt; Collect Service ID.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_apple_api_group_apple_service_id",
                                        "children": [],
                                        "description": "Enter your Apple Service ID from Apple Developer Console.",
                                        "dependency_key": "social_onboarding.social_onboarding.apple_api_group.apple_service_id",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.apple_api_group.apple_service_id"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.apple_api_group.apple_service_id"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Apple Service ID",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "apple_team_id",
                                        "type": "field",
                                        "title": "Apple Team ID",
                                        "icon": "",
                                        "tooltip": "You can get it from Apple Developer platform -&gt; login -&gt; Membership -&gt;  Collect Team ID.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_apple_api_group_apple_team_id",
                                        "children": [],
                                        "description": "Enter your Apple Team ID from Apple Developer Console.",
                                        "dependency_key": "social_onboarding.social_onboarding.apple_api_group.apple_team_id",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.apple_api_group.apple_team_id"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.apple_api_group.apple_team_id"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Apple Team ID",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "apple_key_id",
                                        "type": "field",
                                        "title": "Apple Key ID",
                                        "icon": "",
                                        "tooltip": "You can get it from Apple Developer platform -&gt; login -&gt; Certificates, IDs &amp; Profiles -&gt; Keys -&gt; Click &quot; + &quot; -&gt; Register for new Key -&gt; Download &quot;Apple Key Content&quot; -&gt; Collect Key ID.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_apple_api_group_apple_key_id",
                                        "children": [],
                                        "description": "Enter your Apple Key ID from Apple Developer Console.",
                                        "dependency_key": "social_onboarding.social_onboarding.apple_api_group.apple_key_id",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.apple_api_group.apple_key_id"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.apple_api_group.apple_key_id"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Apple Key ID",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "apple_key_content",
                                        "type": "field",
                                        "title": "Apple Key Content",
                                        "icon": "",
                                        "tooltip": "You can get it from Apple Developer platform -&gt; login -&gt; Certificates, IDs &amp; Profiles -&gt; Keys -&gt; Click &quot; + &quot; -&gt; Register for new Key -&gt; Download &quot;Apple Key Content&quot; -&gt; Collect Key Content.",
                                        "display": true,
                                        "hook_key": "dokan_settings_vendor_social_onboarding_social_onboarding_apple_api_group_apple_key_content",
                                        "children": [],
                                        "description": "Paste your Apple private key content including BEGIN and END lines.",
                                        "dependency_key": "social_onboarding.social_onboarding.apple_api_group.apple_key_content",
                                        "dependencies": [
                                            {
                                                "key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "social_onboarding.social_onboarding.apple_api_group.apple_key_content"
                                            },
                                            {
                                                "key": "social_onboarding.social_onboarding.apple_api_group.apple_enabled",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "social_onboarding.social_onboarding.apple_api_group.apple_key_content"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "textarea",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Write here",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    }
                                ],
                                "description": "",
                                "dependency_key": "social_onboarding.social_onboarding.apple_api_group",
                                "dependencies": [
                                    {
                                        "key": "social_onboarding.social_onboarding.social_login",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "social_onboarding.social_onboarding.apple_api_group"
                                    },
                                    {
                                        "key": "social_onboarding.social_onboarding.social_login",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "social_onboarding.social_onboarding.apple_api_group"
                                    }
                                ],
                                "validations": [],
                                "content_class": ""
                            }
                        ],
                        "description": "",
                        "dependency_key": "social_onboarding.social_onboarding",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Define settings to allow vendors to use their social profiles to register or log in to the marketplace.",
                "dependency_key": "social_onboarding",
                "dependencies": [],
                "validations": [],
                "priority": 200,
                "doc_link": "https://dokan.co/docs/wordpress/settings/dokan-social-login/",
                "doc_link_text": "Doc"
            },
            {
                "id": "vendor_subscription",
                "type": "subpage",
                "title": "Vendor Subscription",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_vendor_vendor_subscription",
                "children": [
                    {
                        "id": "vendor_subscription",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_vendor_vendor_subscription_vendor_subscription",
                        "children": [
                            {
                                "id": "vendor_subscription",
                                "type": "field",
                                "title": "Vendor Subscription",
                                "icon": "",
                                "tooltip": "Allow vendors to purchase subscription packages to sell products in your marketplace",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_subscription_vendor_subscription_vendor_subscription",
                                "children": [],
                                "description": "Allow vendors to purchase subscription packages to sell products in your marketplace",
                                "dependency_key": "vendor_subscription.vendor_subscription.vendor_subscription",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "subscription_view_page",
                                "type": "field",
                                "title": "Subscription View Page",
                                "icon": "",
                                "tooltip": "Select the page where vendors can view and purchase available subscription plans.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_subscription_vendor_subscription_subscription_view_page",
                                "children": [],
                                "description": "Select the page where vendors can view and purchase available subscription plans.",
                                "dependency_key": "vendor_subscription.vendor_subscription.subscription_view_page",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select",
                                "value": "61",
                                "default": "",
                                "placeholder": "Sample Page",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": 582,
                                        "title": "Classic Cart"
                                    },
                                    {
                                        "value": 329,
                                        "title": ""
                                    },
                                    {
                                        "value": 320,
                                        "title": "Single Product"
                                    },
                                    {
                                        "value": 316,
                                        "title": "Block Shop"
                                    },
                                    {
                                        "value": 106,
                                        "title": "Vendor registration"
                                    },
                                    {
                                        "value": 61,
                                        "title": "Product Subscription"
                                    },
                                    {
                                        "value": 60,
                                        "title": "Request for Quote"
                                    },
                                    {
                                        "value": 54,
                                        "title": "Checkout 2"
                                    },
                                    {
                                        "value": 222,
                                        "title": "My account Bn"
                                    },
                                    {
                                        "value": 219,
                                        "title": "My account"
                                    },
                                    {
                                        "value": 13,
                                        "title": "My account"
                                    },
                                    {
                                        "value": 12,
                                        "title": "Checkout"
                                    },
                                    {
                                        "value": 11,
                                        "title": "Cart"
                                    },
                                    {
                                        "value": 10,
                                        "title": "Shop"
                                    },
                                    {
                                        "value": 194,
                                        "title": "test-board"
                                    },
                                    {
                                        "value": 8,
                                        "title": "My Orders"
                                    },
                                    {
                                        "value": 7,
                                        "title": "Store List"
                                    },
                                    {
                                        "value": 6,
                                        "title": "Dashboard"
                                    },
                                    {
                                        "value": 2,
                                        "title": "Sample Page"
                                    }
                                ]
                            },
                            {
                                "id": "subscription_in_registration",
                                "type": "field",
                                "title": "Subscription in Registration Form",
                                "icon": "",
                                "tooltip": "If checked, vendor completes registration only after subscribing to a pack",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_subscription_vendor_subscription_subscription_in_registration",
                                "children": [],
                                "description": "Enable subscription pack in registration form for new vendor.",
                                "dependency_key": "vendor_subscription.vendor_subscription.subscription_in_registration",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "email_alert_before_expiry",
                                "type": "field",
                                "title": "Email Notification for Expiry Alerts",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_subscription_vendor_subscription_email_alert_before_expiry",
                                "children": [],
                                "description": "Send automatic email reminders to vendors before their subscription expires.",
                                "dependency_key": "vendor_subscription.vendor_subscription.subscription_in_registration",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "alert_days_before_expiry",
                                "type": "field",
                                "title": "Alert Days Before Expiry",
                                "icon": "",
                                "tooltip": "Number of days before subscription expires to send the reminder email.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_subscription_vendor_subscription_alert_days_before_expiry",
                                "children": [],
                                "description": "Number of days before subscription expires to send the reminder email.",
                                "dependency_key": "vendor_subscription.vendor_subscription.alert_days_before_expiry",
                                "dependencies": [],
                                "validations": [],
                                "variant": "number",
                                "value": 10,
                                "default": "10",
                                "placeholder": "10",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "Days",
                                "prefix": "",
                                "image_url": "",
                                "minimum": null,
                                "maximum": null,
                                "step": 0.1,
                                "addon_icon": false
                            },
                            {
                                "id": "products_status_on_expiry",
                                "type": "field",
                                "title": "Products Status on Expiry",
                                "icon": "",
                                "tooltip": "What happens to vendor's products when their subscription expires",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_subscription_vendor_subscription_products_status_on_expiry",
                                "children": [],
                                "description": "What happens to vendor&#039;s products when their subscription expires",
                                "dependency_key": "vendor_subscription.vendor_subscription.products_status_on_expiry",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "draft",
                                "default": "draft",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "draft",
                                        "title": "Draft",
                                        "icon": ""
                                    },
                                    {
                                        "value": "publish",
                                        "title": "Published",
                                        "icon": ""
                                    },
                                    {
                                        "value": "pending",
                                        "title": "Pending Review",
                                        "icon": ""
                                    }
                                ]
                            },
                            {
                                "id": "cancelling_email_subject",
                                "type": "field",
                                "title": "Cancelling Email Subject",
                                "icon": "",
                                "tooltip": "Enter subject text for canceled subscriptions email notification.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_subscription_vendor_subscription_cancelling_email_subject",
                                "children": [],
                                "description": "Enter subject text for canceled subscriptions email notification.",
                                "dependency_key": "vendor_subscription.vendor_subscription.cancelling_email_subject",
                                "dependencies": [],
                                "validations": [],
                                "variant": "textarea",
                                "value": "Subscription Package Cancel notification.",
                                "default": "Subscription Package Cancel notification.",
                                "placeholder": "Enter subject text",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            },
                            {
                                "id": "cancelling_email_body",
                                "type": "field",
                                "title": "Cancelling Email Body",
                                "icon": "",
                                "tooltip": "Enter body text for canceled subscriptions email notification.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_subscription_vendor_subscription_cancelling_email_body",
                                "children": [],
                                "description": "Enter body text for canceled subscriptions email notification.",
                                "dependency_key": "vendor_subscription.vendor_subscription.cancelling_email_body",
                                "dependencies": [],
                                "validations": [],
                                "variant": "textarea",
                                "value": "Dear subscriber, Your subscription has expired. Please renew your package to continue using it.",
                                "default": "Dear subscriber, Your subscription has expired. Please renew your package to continue using it.",
                                "placeholder": "Enter body text",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            },
                            {
                                "id": "alert_email_subject",
                                "type": "field",
                                "title": "Alert Email Subject",
                                "icon": "",
                                "tooltip": "Enter subject text for package end notification alert email",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_subscription_vendor_subscription_alert_email_subject",
                                "children": [],
                                "description": "Enter subject text for package end notification alert email",
                                "dependency_key": "vendor_subscription.vendor_subscription.alert_email_subject",
                                "dependencies": [],
                                "validations": [],
                                "variant": "textarea",
                                "value": "Subscription Ending Soon",
                                "default": "Subscription Ending Soon",
                                "placeholder": "Enter subject text",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            },
                            {
                                "id": "alert_email_body",
                                "type": "field",
                                "title": "Alert Email body",
                                "icon": "",
                                "tooltip": "Enter body text for package end notification alert email.",
                                "display": true,
                                "hook_key": "dokan_settings_vendor_vendor_subscription_vendor_subscription_alert_email_body",
                                "children": [],
                                "description": "Enter body text for package end notification alert email.",
                                "dependency_key": "vendor_subscription.vendor_subscription.alert_email_body",
                                "dependencies": [],
                                "validations": [],
                                "variant": "textarea",
                                "value": "Dear subscriber, Your subscription will be ending soon. Please renew your package in a timely manner for continued usage.",
                                "default": "Dear subscriber, Your subscription will be ending soon. Please renew your package in a timely manner for continued usage.",
                                "placeholder": "Enter body text",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            }
                        ],
                        "description": "",
                        "dependency_key": "vendor_subscription.vendor_subscription",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Configure marketplace settings to authorize vendors to create subscription products for their stores.",
                "dependency_key": "vendor_subscription",
                "dependencies": [],
                "validations": [],
                "priority": 400,
                "doc_link": "https://wedevs.com/docs/dokan/vendor-settings/vendor-subscription/",
                "doc_link_text": "Doc"
            }
        ],
        "description": "Configure vendor-related settings and capabilities.",
        "dependency_key": "",
        "dependencies": [],
        "validations": []
    },
    {
        "id": "verification",
        "type": "page",
        "title": "Vendor Verification",
        "icon": "Shield",
        "tooltip": "",
        "display": true,
        "hook_key": "dokan_settings_verification",
        "children": [
            {
                "id": "email-verification-page",
                "type": "subpage",
                "title": "Email Verification",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_verification_email-verification-page",
                "children": [
                    {
                        "id": "email-verification-content",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_verification_email-verification-page_email-verification-content",
                        "children": [
                            {
                                "id": "enabled",
                                "type": "field",
                                "title": "Email Verification",
                                "icon": "",
                                "tooltip": "Check this if you want user to verify their email address upon registration.",
                                "display": true,
                                "hook_key": "dokan_settings_verification_email-verification-page_email-verification-content_enabled",
                                "children": [],
                                "description": "Enabling this will send a verification email to allow users to verify their email address after the registration form is submitted.",
                                "dependency_key": "email-verification-page.email-verification-content.enabled",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "registration_notice",
                                "type": "field",
                                "title": "Registration Notice",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_verification_email-verification-page_email-verification-content_registration_notice",
                                "children": [],
                                "description": "This notice will be shown after a user has registered with pending email verification.",
                                "dependency_key": "email-verification-page.email-verification-content.registration_notice",
                                "dependencies": [],
                                "validations": [],
                                "variant": "textarea",
                                "value": "We have sent a verification link to your email. Please check your inbox to activate your account",
                                "default": "We have sent a verification link to your email. Please check your inbox to activate your account",
                                "placeholder": "Enter the notice text to display after registration...",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            },
                            {
                                "id": "login_notice",
                                "type": "field",
                                "title": "Login Notice",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_verification_email-verification-page_email-verification-content_login_notice",
                                "children": [],
                                "description": "This notice will be shown after a user has registered with pending email verification.",
                                "dependency_key": "email-verification-page.email-verification-content.login_notice",
                                "dependencies": [],
                                "validations": [],
                                "variant": "textarea",
                                "value": "Your email address needs verification. Please check your email and click the verification link.",
                                "default": "Your email address needs verification. Please check your email and click the verification link.",
                                "placeholder": "Enter the notice text to display during login...",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            }
                        ],
                        "description": "",
                        "dependency_key": "email-verification-page.email-verification-content",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Manage email verification requirements for user accounts.",
                "dependency_key": "email-verification-page",
                "dependencies": [],
                "validations": [],
                "priority": 200,
                "doc_link": ""
            },
            {
                "id": "vendor-verification-page",
                "type": "subpage",
                "title": "Vendor Verification",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_verification_vendor-verification-page",
                "children": [
                    {
                        "id": "verified-icons",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_verification_vendor-verification-page_verified-icons",
                        "children": [
                            {
                                "id": "verified_icon",
                                "type": "field",
                                "title": "Verified Icons",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_verification_vendor-verification-page_verified-icons_verified_icon",
                                "children": [],
                                "description": "Choose your preferred icon for verified stores in the marketplace.",
                                "dependency_key": "vendor-verification-page.verified-icons.verified_icon",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select",
                                "value": "check_circle_solid",
                                "default": "check_circle_solid",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "check_circle_solid",
                                        "title": "Icon 1",
                                        "icon_name": "CircleCheckBig"
                                    },
                                    {
                                        "value": "check_circle_regular",
                                        "title": "Icon 2",
                                        "icon_name": "CircleCheck"
                                    },
                                    {
                                        "value": "check_solid",
                                        "title": "Icon 3",
                                        "icon_name": "Check"
                                    },
                                    {
                                        "value": "check_double_solid",
                                        "title": "Icon 4",
                                        "icon_name": "CheckCheck"
                                    },
                                    {
                                        "value": "check_square_solid",
                                        "title": "Icon 5",
                                        "icon_name": "SquareCheckBig"
                                    },
                                    {
                                        "value": "check_squire_regular",
                                        "title": "Icon 6",
                                        "icon_name": "SquareCheck"
                                    },
                                    {
                                        "value": "user_check_solid",
                                        "title": "Icon 7",
                                        "icon_name": "UserCheck"
                                    },
                                    {
                                        "value": "certificate_solid",
                                        "title": "Icon 8",
                                        "icon_name": "BadgeCheck"
                                    }
                                ]
                            }
                        ],
                        "description": "",
                        "dependency_key": "vendor-verification-page.verified-icons",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "verification-methods",
                        "type": "section",
                        "title": "Verification Methods",
                        "icon": "",
                        "tooltip": "Manage the verification methods vendors can use.",
                        "display": true,
                        "hook_key": "dokan_settings_verification_vendor-verification-page_verification-methods",
                        "children": [
                            {
                                "id": "verification_methods_list",
                                "type": "field",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_verification_vendor-verification-page_verification-methods_verification_methods_list",
                                "children": [],
                                "description": "",
                                "dependency_key": "vendor-verification-page.verification-methods.verification_methods_list",
                                "dependencies": [],
                                "validations": [],
                                "variant": "verification_methods",
                                "value": [],
                                "api_endpoint": "dokan/v1/verification-methods"
                            }
                        ],
                        "description": "Manage the verification methods vendors can use.",
                        "dependency_key": "vendor-verification-page.verification-methods",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "You can authenticate your vendors by authorizing vendors to connect their social profiles to their storefront.",
                "dependency_key": "vendor-verification-page",
                "dependencies": [],
                "validations": [],
                "priority": 100,
                "doc_link": ""
            },
            {
                "id": "sms-gateways-page",
                "type": "subpage",
                "title": "Verification SMS Gateways",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_verification_sms-gateways-page",
                "children": [
                    {
                        "id": "sms-provider",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider",
                        "children": [
                            {
                                "id": "sms_provider",
                                "type": "field",
                                "title": "SMS Provider",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_sms_provider",
                                "children": [],
                                "description": "",
                                "dependency_key": "sms-gateways-page.sms-provider.sms_provider",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "twilio",
                                "default": "twilio",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "twilio",
                                        "title": "Twilio",
                                        "icon": ""
                                    },
                                    {
                                        "value": "nexmo",
                                        "title": "Vonage",
                                        "icon": ""
                                    }
                                ]
                            },
                            {
                                "id": "twilio_api_group",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_twilio_api_group",
                                "children": [
                                    {
                                        "id": "connect_to_twilio",
                                        "type": "field",
                                        "title": "Connect to Twilio",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_twilio_api_group_connect_to_twilio",
                                        "children": [],
                                        "description": "Connect to your Twilio account with your website.",
                                        "dependency_key": "sms-gateways-page.sms-provider.twilio_api_group.connect_to_twilio",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://e7.pngegg.com/pngimages/122/431/png-clipart-round-red-button-illustration-twilio-logo-icons-logos-emojis-tech-companies-thumbnail.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Connected"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disconnected"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "twilio_info",
                                        "type": "field",
                                        "title": "Configure your gateway from the link and fill the details below.",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_twilio_api_group_twilio_info",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "sms-gateways-page.sms-provider.twilio_api_group.twilio_info",
                                        "dependencies": [
                                            {
                                                "key": "sms-gateways-page.sms-provider.twilio_api_group.connect_to_twilio",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "sms-gateways-page.sms-provider.twilio_api_group.twilio_info"
                                            },
                                            {
                                                "key": "sms-gateways-page.sms-provider.twilio_api_group.connect_to_twilio",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "sms-gateways-page.sms-provider.twilio_api_group.twilio_info"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "info",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "",
                                        "link_text": "Link",
                                        "link_url": "https://www.twilio.com",
                                        "show_icon": true
                                    },
                                    {
                                        "id": "from_number",
                                        "type": "field",
                                        "title": "From Number",
                                        "icon": "",
                                        "tooltip": "The phone number that will appear as the sender of SMS messages.",
                                        "display": true,
                                        "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_twilio_api_group_from_number",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "sms-gateways-page.sms-provider.twilio_api_group.from_number",
                                        "dependencies": [
                                            {
                                                "key": "sms-gateways-page.sms-provider.twilio_api_group.connect_to_twilio",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "sms-gateways-page.sms-provider.twilio_api_group.from_number"
                                            },
                                            {
                                                "key": "sms-gateways-page.sms-provider.twilio_api_group.connect_to_twilio",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "sms-gateways-page.sms-provider.twilio_api_group.from_number"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Twilio phone number...",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "account_sid",
                                        "type": "field",
                                        "title": "Account SID",
                                        "icon": "",
                                        "tooltip": "Your Twilio Account SID from the Twilio Console.",
                                        "display": true,
                                        "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_twilio_api_group_account_sid",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "sms-gateways-page.sms-provider.twilio_api_group.account_sid",
                                        "dependencies": [
                                            {
                                                "key": "sms-gateways-page.sms-provider.twilio_api_group.connect_to_twilio",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "sms-gateways-page.sms-provider.twilio_api_group.account_sid"
                                            },
                                            {
                                                "key": "sms-gateways-page.sms-provider.twilio_api_group.connect_to_twilio",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "sms-gateways-page.sms-provider.twilio_api_group.account_sid"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Account SID...",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "auth_token",
                                        "type": "field",
                                        "title": "Auth Token",
                                        "icon": "",
                                        "tooltip": "Your Twilio Auth Token from the Twilio Console.",
                                        "display": true,
                                        "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_twilio_api_group_auth_token",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "sms-gateways-page.sms-provider.twilio_api_group.auth_token",
                                        "dependencies": [
                                            {
                                                "key": "sms-gateways-page.sms-provider.twilio_api_group.connect_to_twilio",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "sms-gateways-page.sms-provider.twilio_api_group.auth_token"
                                            },
                                            {
                                                "key": "sms-gateways-page.sms-provider.twilio_api_group.connect_to_twilio",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "sms-gateways-page.sms-provider.twilio_api_group.auth_token"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Auth Token...",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "sms_code_type",
                                        "type": "field",
                                        "title": "SMS Code Type",
                                        "icon": "",
                                        "tooltip": "Choose the type of verification code to send via SMS.",
                                        "display": true,
                                        "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_twilio_api_group_sms_code_type",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "sms-gateways-page.sms-provider.twilio_api_group.sms_code_type",
                                        "dependencies": [
                                            {
                                                "key": "sms-gateways-page.sms-provider.twilio_api_group.connect_to_twilio",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "sms-gateways-page.sms-provider.twilio_api_group.sms_code_type"
                                            },
                                            {
                                                "key": "sms-gateways-page.sms-provider.twilio_api_group.connect_to_twilio",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "sms-gateways-page.sms-provider.twilio_api_group.sms_code_type"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "radio_capsule",
                                        "value": "numeric",
                                        "default": "numeric",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "",
                                        "options": [
                                            {
                                                "value": "numeric",
                                                "title": "Numeric",
                                                "icon": ""
                                            },
                                            {
                                                "value": "alphanumeric",
                                                "title": "Alphanumeric",
                                                "icon": ""
                                            }
                                        ]
                                    }
                                ],
                                "description": "",
                                "dependency_key": "sms-gateways-page.sms-provider.twilio_api_group",
                                "dependencies": [
                                    {
                                        "key": "sms-gateways-page.sms-provider.sms_provider",
                                        "value": "twilio",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "sms-gateways-page.sms-provider.twilio_api_group"
                                    },
                                    {
                                        "key": "sms-gateways-page.sms-provider.sms_provider",
                                        "value": "twilio",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "sms-gateways-page.sms-provider.twilio_api_group"
                                    }
                                ],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "vonage_api_group",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_vonage_api_group",
                                "children": [
                                    {
                                        "id": "connect_to_vonage",
                                        "type": "field",
                                        "title": "Connect to Vonage",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_vonage_api_group_connect_to_vonage",
                                        "children": [],
                                        "description": "Connect to your Vonage account with your website.",
                                        "dependency_key": "sms-gateways-page.sms-provider.vonage_api_group.connect_to_vonage",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://core-dokan.test/wp-content/plugins/dokan-lite/assets/images/admin-settings-icons/verification/vonage_logo_icon.svg",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Connected"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disconnected"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "vonage_info",
                                        "type": "field",
                                        "title": "Configure your gateway from the link and fill the details below.",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_vonage_api_group_vonage_info",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "sms-gateways-page.sms-provider.vonage_api_group.vonage_info",
                                        "dependencies": [
                                            {
                                                "key": "sms-gateways-page.sms-provider.vonage_api_group.connect_to_vonage",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "sms-gateways-page.sms-provider.vonage_api_group.vonage_info"
                                            },
                                            {
                                                "key": "sms-gateways-page.sms-provider.vonage_api_group.connect_to_vonage",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "sms-gateways-page.sms-provider.vonage_api_group.vonage_info"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "info",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "",
                                        "link_text": "Link",
                                        "link_url": "https://www.vonage.com",
                                        "show_icon": true
                                    },
                                    {
                                        "id": "nexmo_username",
                                        "type": "field",
                                        "title": "API Key",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_vonage_api_group_nexmo_username",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "sms-gateways-page.sms-provider.vonage_api_group.nexmo_username",
                                        "dependencies": [
                                            {
                                                "key": "sms-gateways-page.sms-provider.vonage_api_group.connect_to_vonage",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "sms-gateways-page.sms-provider.vonage_api_group.nexmo_username"
                                            },
                                            {
                                                "key": "sms-gateways-page.sms-provider.vonage_api_group.connect_to_vonage",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "sms-gateways-page.sms-provider.vonage_api_group.nexmo_username"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Vonage API Key...",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "nexmo_pass",
                                        "type": "field",
                                        "title": "API Secret",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_verification_sms-gateways-page_sms-provider_vonage_api_group_nexmo_pass",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "sms-gateways-page.sms-provider.vonage_api_group.nexmo_pass",
                                        "dependencies": [
                                            {
                                                "key": "sms-gateways-page.sms-provider.vonage_api_group.connect_to_vonage",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "sms-gateways-page.sms-provider.vonage_api_group.nexmo_pass"
                                            },
                                            {
                                                "key": "sms-gateways-page.sms-provider.vonage_api_group.connect_to_vonage",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "!==",
                                                "self": "sms-gateways-page.sms-provider.vonage_api_group.nexmo_pass"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "show_hide",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Enter your Vonage API Secret...",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    }
                                ],
                                "description": "",
                                "dependency_key": "sms-gateways-page.sms-provider.vonage_api_group",
                                "dependencies": [
                                    {
                                        "key": "sms-gateways-page.sms-provider.sms_provider",
                                        "value": "nexmo",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "sms-gateways-page.sms-provider.vonage_api_group"
                                    },
                                    {
                                        "key": "sms-gateways-page.sms-provider.sms_provider",
                                        "value": "nexmo",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "sms-gateways-page.sms-provider.vonage_api_group"
                                    }
                                ],
                                "validations": [],
                                "content_class": ""
                            }
                        ],
                        "description": "",
                        "dependency_key": "sms-gateways-page.sms-provider",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "sender",
                        "type": "section",
                        "title": "Sender",
                        "icon": "",
                        "tooltip": "Configure sender information and SMS message templates.",
                        "display": true,
                        "hook_key": "dokan_settings_verification_sms-gateways-page_sender",
                        "children": [
                            {
                                "id": "sender_name",
                                "type": "field",
                                "title": "Sender Name",
                                "icon": "",
                                "tooltip": "The name that will appear as the sender of SMS messages.",
                                "display": true,
                                "hook_key": "dokan_settings_verification_sms-gateways-page_sender_sender_name",
                                "children": [],
                                "description": "",
                                "dependency_key": "sms-gateways-page.sender.sender_name",
                                "dependencies": [],
                                "validations": [],
                                "variant": "text",
                                "value": "Market Team",
                                "default": "Market Team",
                                "placeholder": "Enter sender name...",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            },
                            {
                                "id": "sms_text",
                                "type": "field",
                                "title": "SMS Text",
                                "icon": "",
                                "tooltip": "This will be displayed in SMS. %CODE% will be replaced by verification code.",
                                "display": true,
                                "hook_key": "dokan_settings_verification_sms-gateways-page_sender_sms_text",
                                "children": [],
                                "description": "This will be displayed in SMS. %CODE% will be replaced by verification code.",
                                "dependency_key": "sms-gateways-page.sender.sms_text",
                                "dependencies": [],
                                "validations": [],
                                "variant": "textarea",
                                "value": "Your verification code is: %CODE%",
                                "default": "Your verification code is: %CODE%",
                                "placeholder": "Enter SMS message template...",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            },
                            {
                                "id": "sms_sent_success",
                                "type": "field",
                                "title": "SMS Sent Success",
                                "icon": "",
                                "tooltip": "Message to display when SMS is sent successfully.",
                                "display": true,
                                "hook_key": "dokan_settings_verification_sms-gateways-page_sender_sms_sent_success",
                                "children": [],
                                "description": "",
                                "dependency_key": "sms-gateways-page.sender.sms_sent_success",
                                "dependencies": [],
                                "validations": [],
                                "variant": "textarea",
                                "value": "SMS sent. Please enter your verification code",
                                "default": "SMS sent. Please enter your verification code",
                                "placeholder": "Enter success message...",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            },
                            {
                                "id": "sms_sent_error",
                                "type": "field",
                                "title": "SMS Sent Error",
                                "icon": "",
                                "tooltip": "Message to display when SMS sending fails.",
                                "display": true,
                                "hook_key": "dokan_settings_verification_sms-gateways-page_sender_sms_sent_error",
                                "children": [],
                                "description": "",
                                "dependency_key": "sms-gateways-page.sender.sms_sent_error",
                                "dependencies": [],
                                "validations": [],
                                "variant": "textarea",
                                "value": "Unable to send sms. Contact admin",
                                "default": "Unable to send sms. Contact admin",
                                "placeholder": "Enter error message...",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            }
                        ],
                        "description": "",
                        "dependency_key": "sms-gateways-page.sender",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Configure SMS gateway settings for vendor verification.",
                "dependency_key": "sms-gateways-page",
                "dependencies": [],
                "validations": [],
                "priority": 300,
                "doc_link": ""
            }
        ],
        "description": "",
        "dependency_key": "",
        "dependencies": [],
        "validations": []
    },
    {
        "id": "transaction",
        "type": "page",
        "title": "Transaction",
        "icon": "ArrowRightLeft",
        "tooltip": "",
        "display": true,
        "hook_key": "dokan_settings_transaction",
        "children": [
            {
                "id": "commission",
                "type": "subpage",
                "title": "Commissions",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_transaction_commission",
                "children": [
                    {
                        "id": "commission",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_transaction_commission_commission",
                        "children": [
                            {
                                "id": "commission_type",
                                "type": "field",
                                "title": "Commission Type",
                                "icon": "",
                                "tooltip": "Select a commission type",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_commission_commission_commission_type",
                                "children": [],
                                "description": "Select a commission type for your marketplace",
                                "dependency_key": "commission.commission.commission_type",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "fixed",
                                "default": "fixed",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "fixed",
                                        "title": "Fixed",
                                        "startIcon": "User"
                                    },
                                    {
                                        "value": "category_based",
                                        "title": "Category Based",
                                        "startIcon": "Users"
                                    }
                                ]
                            },
                            {
                                "id": "admin_commission",
                                "type": "field",
                                "title": "Admin Commission",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_commission_commission_admin_commission",
                                "children": [],
                                "description": "Amount you will get from sales in both percentage and fixed fee",
                                "dependency_key": "commission.commission.admin_commission",
                                "dependencies": [
                                    {
                                        "key": "commission.commission.commission_type",
                                        "value": "fixed",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "commission.commission.admin_commission"
                                    },
                                    {
                                        "key": "commission.commission.commission_type",
                                        "value": "fixed",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "commission.commission.admin_commission"
                                    }
                                ],
                                "validations": [
                                    {
                                        "rules": "not_empty",
                                        "message": "Both percentage and fixed fee is required.",
                                        "params": [],
                                        "self": "commission.commission.admin_commission"
                                    }
                                ],
                                "variant": "combine_input",
                                "value": {
                                    "additional_fee": "20",
                                    "admin_percentage": "0"
                                },
                                "additional_fee": "20",
                                "admin_percentage": "0",
                                "is_automated": false
                            },
                            {
                                "id": "reset_sub_category_when_edit_all_category",
                                "type": "field",
                                "title": "Apply Parent Category Commission to All Subcategories",
                                "icon": "",
                                "tooltip": "When enabled, changing a parent category&#039;s commission rate will automatically update all its subcategories. Disable this option to maintain independent commission rates for subcategories",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_commission_commission_reset_sub_category_when_edit_all_category",
                                "children": [],
                                "description": "Important: &#039;All Categories&#039; commission serves as your marketplace&#039;s default rate and cannot be empty. If 0 is given in value, then the marketplace will deduct no commission from vendors",
                                "dependency_key": "commission.commission.reset_sub_category_when_edit_all_category",
                                "dependencies": [
                                    {
                                        "key": "commission.commission.commission_type",
                                        "value": "category_based",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "commission.commission.reset_sub_category_when_edit_all_category"
                                    },
                                    {
                                        "key": "commission.commission.commission_type",
                                        "value": "category_based",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "commission.commission.reset_sub_category_when_edit_all_category"
                                    }
                                ],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "commission_category_based_values",
                                "type": "field",
                                "title": "Admin Commission",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_commission_commission_commission_category_based_values",
                                "children": [],
                                "description": "Amount you will get from each sale",
                                "dependency_key": "commission.commission.commission_category_based_values",
                                "dependencies": [
                                    {
                                        "key": "commission.commission.commission_type",
                                        "value": "category_based",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "commission.commission.commission_category_based_values"
                                    },
                                    {
                                        "key": "commission.commission.commission_type",
                                        "value": "category_based",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "commission.commission.commission_category_based_values"
                                    },
                                    {
                                        "key": "commission.commission.reset_sub_category_when_edit_all_category",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "custom",
                                        "effect": "custom",
                                        "comparison": "===",
                                        "self": "commission.commission.commission_category_based_values"
                                    },
                                    {
                                        "key": "commission.commission.reset_sub_category_when_edit_all_category",
                                        "value": "off",
                                        "to_self": true,
                                        "attribute": "custom",
                                        "effect": "custom",
                                        "comparison": "===",
                                        "self": "commission.commission.commission_category_based_values"
                                    }
                                ],
                                "validations": [
                                    {
                                        "rules": "not_empty",
                                        "message": "Both percentage and fixed fee is required.",
                                        "params": [],
                                        "self": "commission.commission.commission_category_based_values"
                                    }
                                ],
                                "variant": "category_based_commission",
                                "value": {
                                    "all": {
                                        "flat": "4",
                                        "percentage": "2"
                                    },
                                    "items": {
                                        "15": {
                                            "flat": "5",
                                            "percentage": "3"
                                        }
                                    }
                                },
                                "categories": {
                                    "15": {
                                        "term_id": 15,
                                        "name": "Uncategorized",
                                        "parent_id": 0,
                                        "children": [],
                                        "parents": [],
                                        "breadcumb": [ "Uncategorized" ]
                                    },
                                    "32": {
                                        "term_id": 32,
                                        "name": "Cate 1",
                                        "parent_id": 0,
                                        "children": [],
                                        "parents": [],
                                        "breadcumb": [ "Cate 1" ]
                                    }
                                },
                                "reset_subcategory": "off"
                            }
                        ],
                        "description": "",
                        "dependency_key": "commission.commission",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Set up marketplace commission structure and earnings from vendor sales.",
                "dependency_key": "commission",
                "dependencies": [],
                "validations": [],
                "priority": 200,
                "doc_link": ""
            },
            {
                "id": "fees",
                "type": "subpage",
                "title": "Fees",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_transaction_fees",
                "children": [
                    {
                        "id": "fees",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_transaction_fees_fees",
                        "children": [
                            {
                                "id": "shipping_fee",
                                "type": "field",
                                "title": "Shipping Fee",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_fees_fees_shipping_fee",
                                "children": [],
                                "description": "Who will be receiving the shipping fees? Note that, tax fees for corresponding shipping method will not be included with shipping fees.",
                                "dependency_key": "fees.fees.shipping_fee",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "seller",
                                "default": "seller",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "seller",
                                        "title": "Vendor",
                                        "startIcon": "Users"
                                    },
                                    {
                                        "value": "admin",
                                        "title": "Admin",
                                        "startIcon": "User"
                                    }
                                ]
                            },
                            {
                                "id": "product_tax_fee",
                                "type": "field",
                                "title": "Product Tax Fee",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_fees_fees_product_tax_fee",
                                "children": [],
                                "description": "Who will be receiving the tax fees for products? Note that, shipping tax fees will not be included with product tax.",
                                "dependency_key": "fees.fees.product_tax_fee",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "seller",
                                "default": "seller",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "seller",
                                        "title": "Vendor",
                                        "startIcon": "Users"
                                    },
                                    {
                                        "value": "admin",
                                        "title": "Admin",
                                        "startIcon": "User"
                                    }
                                ]
                            },
                            {
                                "id": "shipping_tax_fee",
                                "type": "field",
                                "title": "Shipping Tax Fee",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_fees_fees_shipping_tax_fee",
                                "children": [],
                                "description": "Who will be receiving the tax fees for shipping?",
                                "dependency_key": "fees.fees.shipping_tax_fee",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "seller",
                                "default": "seller",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "seller",
                                        "title": "Vendor",
                                        "startIcon": "Users"
                                    },
                                    {
                                        "value": "admin",
                                        "title": "Admin",
                                        "startIcon": "User"
                                    }
                                ]
                            }
                        ],
                        "description": "",
                        "dependency_key": "fees.fees",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Configure how different types of fees are distributed between vendors and admin",
                "dependency_key": "fees",
                "dependencies": [],
                "validations": [],
                "priority": 100,
                "doc_link": ""
            },
            {
                "id": "withdraw_charge",
                "type": "subpage",
                "title": "Withdraw",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_transaction_withdraw_charge",
                "children": [
                    {
                        "id": "section_withdraw_charge",
                        "type": "section",
                        "title": "Withdraw Methods and Charges",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge",
                        "children": [
                            {
                                "id": "withdraw_methods_group_paypal",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_paypal",
                                "children": [
                                    {
                                        "id": "paypal_withdraw",
                                        "type": "field",
                                        "title": "PayPal",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_paypal_paypal_withdraw",
                                        "children": [],
                                        "description": "Enable PayPal as a withdrawal method for vendors.",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal.paypal_withdraw",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "on",
                                        "default": "on",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "paypal_withdraw_charges",
                                        "type": "field",
                                        "title": "Withdraw charges",
                                        "icon": "",
                                        "tooltip": "Set withdrawal charges for PayPal method.",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_paypal_paypal_withdraw_charges",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal.paypal_withdraw_charges",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal.paypal_withdraw",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal.paypal_withdraw_charges"
                                            },
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal.paypal_withdraw",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal.paypal_withdraw_charges"
                                            }
                                        ],
                                        "validations": [
                                            {
                                                "rules": "not_empty",
                                                "message": "Both percentage and fixed fee is required.",
                                                "params": [],
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal.paypal_withdraw_charges"
                                            }
                                        ],
                                        "variant": "combine_input",
                                        "value": {
                                            "additional_fee": "0.00",
                                            "admin_percentage": "0.00"
                                        },
                                        "additional_fee": "0.00",
                                        "admin_percentage": "0.00",
                                        "is_automated": false
                                    }
                                ],
                                "description": "",
                                "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal",
                                "dependencies": [],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "withdraw_methods_group_bank",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_bank",
                                "children": [
                                    {
                                        "id": "bank_transfer_withdraw",
                                        "type": "field",
                                        "title": "Bank Transfer",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_bank_bank_transfer_withdraw",
                                        "children": [],
                                        "description": "Enable Bank Transfer as a withdrawal method for vendors.",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_bank.bank_transfer_withdraw",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "bank_transfer_withdraw_charges",
                                        "type": "field",
                                        "title": "Withdraw charges",
                                        "icon": "",
                                        "tooltip": "Set withdrawal charges for Bank Transfer method.",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_bank_bank_transfer_withdraw_charges",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_bank.bank_transfer_withdraw_charges",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_bank.bank_transfer_withdraw",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_bank.bank_transfer_withdraw_charges"
                                            },
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_bank.bank_transfer_withdraw",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_bank.bank_transfer_withdraw_charges"
                                            }
                                        ],
                                        "validations": [
                                            {
                                                "rules": "not_empty",
                                                "message": "Both percentage and fixed fee is required.",
                                                "params": [],
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_bank.bank_transfer_withdraw_charges"
                                            }
                                        ],
                                        "variant": "combine_input",
                                        "value": {
                                            "additional_fee": "0.00",
                                            "admin_percentage": "0.00"
                                        },
                                        "additional_fee": "0.00",
                                        "admin_percentage": "0.00",
                                        "is_automated": false
                                    }
                                ],
                                "description": "",
                                "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_bank",
                                "dependencies": [],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "withdraw_methods_group_paypal_marketplace",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_paypal_marketplace",
                                "children": [
                                    {
                                        "id": "paypal_marketplace_withdraw",
                                        "type": "field",
                                        "title": "PayPal Marketplace",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_paypal_marketplace_paypal_marketplace_withdraw",
                                        "children": [],
                                        "description": "Enable PayPal Marketplace as a withdrawal method for vendors.",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal_marketplace.paypal_marketplace_withdraw",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "paypal_marketplace_withdraw_charges",
                                        "type": "field",
                                        "title": "Withdraw charges",
                                        "icon": "",
                                        "tooltip": "Set withdrawal charges for PayPal Marketplace method.",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_paypal_marketplace_paypal_marketplace_withdraw_charges",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal_marketplace.paypal_marketplace_withdraw_charges",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal_marketplace.paypal_marketplace_withdraw",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal_marketplace.paypal_marketplace_withdraw_charges"
                                            },
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal_marketplace.paypal_marketplace_withdraw",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal_marketplace.paypal_marketplace_withdraw_charges"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "combine_input",
                                        "value": {
                                            "additional_fee": "0.00",
                                            "admin_percentage": "0.00"
                                        },
                                        "additional_fee": "0.00",
                                        "admin_percentage": "0.00",
                                        "is_automated": true
                                    }
                                ],
                                "description": "",
                                "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paypal_marketplace",
                                "dependencies": [],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "withdraw_methods_group_razorpay",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_razorpay",
                                "children": [
                                    {
                                        "id": "razorpay_withdraw",
                                        "type": "field",
                                        "title": "Razorpay",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_razorpay_razorpay_withdraw",
                                        "children": [],
                                        "description": "Enable Razorpay as a withdrawal method for vendors.",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_razorpay.razorpay_withdraw",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "razorpay_withdraw_charges",
                                        "type": "field",
                                        "title": "Withdraw charges",
                                        "icon": "",
                                        "tooltip": "Set withdrawal charges for Razorpay method.",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_razorpay_razorpay_withdraw_charges",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_razorpay.razorpay_withdraw_charges",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_razorpay.razorpay_withdraw",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_razorpay.razorpay_withdraw_charges"
                                            },
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_razorpay.razorpay_withdraw",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_razorpay.razorpay_withdraw_charges"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "combine_input",
                                        "value": {
                                            "additional_fee": "0.00",
                                            "admin_percentage": "0.00"
                                        },
                                        "additional_fee": "0.00",
                                        "admin_percentage": "0.00",
                                        "is_automated": true
                                    }
                                ],
                                "description": "",
                                "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_razorpay",
                                "dependencies": [],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "withdraw_methods_group_stripe",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_stripe",
                                "children": [
                                    {
                                        "id": "stripe_withdraw",
                                        "type": "field",
                                        "title": "Stripe",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_stripe_stripe_withdraw",
                                        "children": [],
                                        "description": "Enable Stripe as a withdrawal method for vendors.",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_stripe.stripe_withdraw",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "stripe_withdraw_charges",
                                        "type": "field",
                                        "title": "Withdraw charges",
                                        "icon": "",
                                        "tooltip": "Set withdrawal charges for Stripe method.",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_stripe_stripe_withdraw_charges",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_stripe.stripe_withdraw_charges",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_stripe.stripe_withdraw",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_stripe.stripe_withdraw_charges"
                                            },
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_stripe.stripe_withdraw",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_stripe.stripe_withdraw_charges"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "combine_input",
                                        "value": {
                                            "additional_fee": "0.00",
                                            "admin_percentage": "0.00"
                                        },
                                        "additional_fee": "0.00",
                                        "admin_percentage": "0.00",
                                        "is_automated": true
                                    }
                                ],
                                "description": "",
                                "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_stripe",
                                "dependencies": [],
                                "validations": [],
                                "content_class": "",
                                "is_automated": true
                            },
                            {
                                "id": "withdraw_methods_group_paystack",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_paystack",
                                "children": [
                                    {
                                        "id": "paystack_withdraw",
                                        "type": "field",
                                        "title": "Paystack",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_paystack_paystack_withdraw",
                                        "children": [],
                                        "description": "Enable Paystack as a withdrawal method for vendors.",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paystack.paystack_withdraw",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "paystack_withdraw_charges",
                                        "type": "field",
                                        "title": "Withdraw charges",
                                        "icon": "",
                                        "tooltip": "Set withdrawal charges for Paystack method.",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_paystack_paystack_withdraw_charges",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paystack.paystack_withdraw_charges",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paystack.paystack_withdraw",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paystack.paystack_withdraw_charges"
                                            },
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paystack.paystack_withdraw",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paystack.paystack_withdraw_charges"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "combine_input",
                                        "value": {
                                            "additional_fee": "0.00",
                                            "admin_percentage": "0.00"
                                        },
                                        "additional_fee": "0.00",
                                        "admin_percentage": "0.00",
                                        "is_automated": true
                                    }
                                ],
                                "description": "",
                                "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_paystack",
                                "dependencies": [],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "withdraw_methods_group_skrill",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_skrill",
                                "children": [
                                    {
                                        "id": "skrill_withdraw",
                                        "type": "field",
                                        "title": "Skrill",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_skrill_skrill_withdraw",
                                        "children": [],
                                        "description": "Enable Skrill as a withdrawal method for vendors.",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_skrill.skrill_withdraw",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "skrill_withdraw_charges",
                                        "type": "field",
                                        "title": "Withdraw charges",
                                        "icon": "",
                                        "tooltip": "Set withdrawal charges for Skrill method.",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_skrill_skrill_withdraw_charges",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_skrill.skrill_withdraw_charges",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_skrill.skrill_withdraw",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_skrill.skrill_withdraw_charges"
                                            },
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_skrill.skrill_withdraw",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_skrill.skrill_withdraw_charges"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "combine_input",
                                        "value": {
                                            "additional_fee": "0.00",
                                            "admin_percentage": "0.00"
                                        },
                                        "additional_fee": "0.00",
                                        "admin_percentage": "0.00",
                                        "is_automated": false
                                    }
                                ],
                                "description": "",
                                "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_skrill",
                                "dependencies": [],
                                "validations": [],
                                "content_class": ""
                            },
                            {
                                "id": "withdraw_methods_group_custom",
                                "type": "fieldgroup",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_custom",
                                "children": [
                                    {
                                        "id": "custom_withdraw",
                                        "type": "field",
                                        "title": "Custom",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_custom_custom_withdraw",
                                        "children": [],
                                        "description": "Enable Custom withdrawal method for vendors.",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_withdraw",
                                        "dependencies": [],
                                        "validations": [],
                                        "variant": "switch",
                                        "value": "off",
                                        "default": "off",
                                        "placeholder": "",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": "https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png",
                                        "options": [],
                                        "enable_state": {
                                            "value": "on",
                                            "title": "Enabled"
                                        },
                                        "disable_state": {
                                            "value": "off",
                                            "title": "Disabled"
                                        },
                                        "switcher_type": null,
                                        "should_confirm": false,
                                        "confirm_modal": []
                                    },
                                    {
                                        "id": "custom_method_name",
                                        "type": "field",
                                        "title": "Custom Method Name",
                                        "icon": "",
                                        "tooltip": "This will be the title of the custom withdraw method.",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_custom_custom_method_name",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_method_name",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_withdraw",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_method_name"
                                            },
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_withdraw",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_method_name"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "text",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "Type something",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "custom_method_type",
                                        "type": "field",
                                        "title": "Custom Method Type",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_custom_custom_method_type",
                                        "children": [],
                                        "description": "Custom Withdraw method type.",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_method_type",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_withdraw",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_method_type"
                                            },
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_withdraw",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_method_type"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "text",
                                        "value": "",
                                        "default": "",
                                        "placeholder": "e.g. Email or Phone Number",
                                        "readonly": false,
                                        "disabled": false,
                                        "size": 20,
                                        "helper_text": "",
                                        "postfix": "",
                                        "prefix": "",
                                        "image_url": ""
                                    },
                                    {
                                        "id": "bank_transfer_withdraw_charges",
                                        "type": "field",
                                        "title": "Withdraw charges",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_section_withdraw_charge_withdraw_methods_group_custom_bank_transfer_withdraw_charges",
                                        "children": [],
                                        "description": "Set withdrawal charges for Bank Transfer method.",
                                        "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.bank_transfer_withdraw_charges",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_withdraw",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.bank_transfer_withdraw_charges"
                                            },
                                            {
                                                "key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.custom_withdraw",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom.bank_transfer_withdraw_charges"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "combine_input",
                                        "value": {
                                            "additional_fee": "0.00",
                                            "admin_percentage": "0.00"
                                        },
                                        "additional_fee": "0.00",
                                        "admin_percentage": "0.00",
                                        "is_automated": false
                                    }
                                ],
                                "description": "",
                                "dependency_key": "withdraw_charge.section_withdraw_charge.withdraw_methods_group_custom",
                                "dependencies": [],
                                "validations": [],
                                "content_class": ""
                            }
                        ],
                        "description": "Select suitable withdraw methods and charges for vendors.",
                        "dependency_key": "withdraw_charge.section_withdraw_charge",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "minimum_withdraw_limit_section",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_transaction_withdraw_charge_minimum_withdraw_limit_section",
                        "children": [
                            {
                                "id": "minimum_withdraw_limit",
                                "type": "field",
                                "title": "Minimum Withdraw Limit",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_minimum_withdraw_limit_section_minimum_withdraw_limit",
                                "children": [],
                                "description": "Minimum balance required to make a withdraw request. Leave blank to set no minimum limits.",
                                "dependency_key": "withdraw_charge.minimum_withdraw_limit_section.minimum_withdraw_limit",
                                "dependencies": [],
                                "validations": [],
                                "variant": "number",
                                "value": 50,
                                "default": "50",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "&#36;",
                                "image_url": "",
                                "minimum": null,
                                "maximum": null,
                                "step": 0.1,
                                "addon_icon": false
                            }
                        ],
                        "description": "",
                        "dependency_key": "withdraw_charge.minimum_withdraw_limit_section",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "cod_payments_section",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_transaction_withdraw_charge_cod_payments_section",
                        "children": [
                            {
                                "id": "cod_payments",
                                "type": "field",
                                "title": "COD Payments",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_cod_payments_section_cod_payments",
                                "children": [],
                                "description": "If an order is paid with Cash on Delivery (COD), then exclude that payment from vendor balance.",
                                "dependency_key": "withdraw_charge.cod_payments_section.cod_payments",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "include",
                                "default": "include",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "include",
                                        "title": "Include",
                                        "icon": ""
                                    },
                                    {
                                        "value": "exclude",
                                        "title": "Exclude",
                                        "icon": ""
                                    }
                                ]
                            }
                        ],
                        "description": "",
                        "dependency_key": "withdraw_charge.cod_payments_section",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "withdraw_threshold_section",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_threshold_section",
                        "children": [
                            {
                                "id": "withdraw_threshold",
                                "type": "field",
                                "title": "Withdraw Threshold",
                                "icon": "",
                                "tooltip": "If enabled, sales earning will add to vendor balance after mentioned number of days.",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_threshold_section_withdraw_threshold",
                                "children": [],
                                "description": "Days to wait before users can withdraw from completed orders. Set to &quot;0&quot; to disable the waiting period.",
                                "dependency_key": "withdraw_charge.withdraw_threshold_section.withdraw_threshold",
                                "dependencies": [],
                                "validations": [],
                                "variant": "number",
                                "value": 0,
                                "default": "0",
                                "placeholder": "e.g 2",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "Days",
                                "prefix": "",
                                "image_url": "",
                                "minimum": null,
                                "maximum": null,
                                "step": 0.1,
                                "addon_icon": false
                            }
                        ],
                        "description": "",
                        "dependency_key": "withdraw_charge.withdraw_threshold_section",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "withdraw_option_visibility_section",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section",
                        "children": [
                            {
                                "id": "withdraw_option_visibility",
                                "type": "field",
                                "title": "Withdraw Option Visibility",
                                "icon": "",
                                "tooltip": "withdraw option (when vendor is getting commission automatically)",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_withdraw_option_visibility",
                                "description": "withdraw option (when vendor is getting commission automatically)",
                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.withdraw_option_visibility",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch_group",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": [],
                                "children": [
                                    {
                                        "id": "manual_withdraw",
                                        "type": "field",
                                        "title": "",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_manual_withdraw",
                                        "children": [],
                                        "description": "",
                                        "dependency_key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.withdraw_option_visibility_section.withdraw_option_visibility",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw"
                                            },
                                            {
                                                "key": "withdraw_charge.withdraw_option_visibility_section.withdraw_option_visibility",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw"
                                            }
                                        ],
                                        "validations": [],
                                        "variant": "multicheck",
                                        "value": [ "manual" ],
                                        "default": [ "manual" ],
                                        "options": [
                                            {
                                                "value": "manual",
                                                "title": "Manual Withdraw"
                                            },
                                            {
                                                "value": "schedule",
                                                "title": "Schedule Disbursement or Auto Withdraw Process for Vendors",
                                                "description": "Admin can make multiple schedules but vendor can choose anyone."
                                            }
                                        ],
                                        "helper_text": ""
                                    }
                                ]
                            },
                            {
                                "id": "quarterly_withdraw_sub_section",
                                "type": "subsection",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section",
                                "children": [
                                    {
                                        "id": "quarterly_withdraw_group",
                                        "type": "fieldgroup",
                                        "title": "Quarterly",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group",
                                        "children": [
                                            {
                                                "id": "quarterly_withdraw",
                                                "type": "field",
                                                "title": "Quarterly Withdraw",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw",
                                                "children": [],
                                                "description": "Enable Quarterly Withdraw as a withdrawal method for vendors.",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                                        "value": "schedule",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "in",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                                        "value": "schedule",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "not_in",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "switch",
                                                "value": "off",
                                                "default": "off",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": false,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [],
                                                "enable_state": {
                                                    "value": "on",
                                                    "title": "Enabled"
                                                },
                                                "disable_state": {
                                                    "value": "off",
                                                    "title": "Disabled"
                                                },
                                                "switcher_type": null,
                                                "should_confirm": false,
                                                "confirm_modal": []
                                            },
                                            {
                                                "id": "quarterly_withdraw_month",
                                                "type": "field",
                                                "title": "First Quarter",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw_month",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "off",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "march",
                                                "default": "march",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": false,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "january",
                                                        "title": "January"
                                                    },
                                                    {
                                                        "value": "february",
                                                        "title": "February"
                                                    },
                                                    {
                                                        "value": "march",
                                                        "title": "March"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "quarterly_withdraw_month_1_schedule_1",
                                                "type": "field",
                                                "title": "Second Quarter",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw_month_1_schedule_1",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_1_schedule_1",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_1_schedule_1"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month",
                                                        "value": "january",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_1_schedule_1"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_1_schedule_1"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "april",
                                                "default": "april",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": true,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "april",
                                                        "title": "April"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "quarterly_withdraw_month_1_schedule_2",
                                                "type": "field",
                                                "title": "Second Quarter",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw_month_1_schedule_2",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_1_schedule_2",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_1_schedule_2"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month",
                                                        "value": "february",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_1_schedule_2"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_1_schedule_2"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "may",
                                                "default": "may",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": true,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "may",
                                                        "title": "May"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "quarterly_withdraw_month_1_schedule_3",
                                                "type": "field",
                                                "title": "Second Quarter",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw_month_1_schedule_3",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_1_schedule_3",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_1_schedule_3"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month",
                                                        "value": "march",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_1_schedule_3"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_1_schedule_3"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "june",
                                                "default": "june",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": true,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "june",
                                                        "title": "June"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "quarterly_withdraw_month_2_schedule_1",
                                                "type": "field",
                                                "title": "Third Quarter",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw_month_2_schedule_1",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_2_schedule_1",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_2_schedule_1"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month",
                                                        "value": "january",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_2_schedule_1"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_2_schedule_1"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "july",
                                                "default": "july",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": true,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "july",
                                                        "title": "July"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "quarterly_withdraw_month_2_schedule_2",
                                                "type": "field",
                                                "title": "Third Quarter",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw_month_2_schedule_2",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_2_schedule_2",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_2_schedule_2"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month",
                                                        "value": "february",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_2_schedule_2"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_2_schedule_2"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "august",
                                                "default": "august",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": true,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "august",
                                                        "title": "August"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "quarterly_withdraw_month_2_schedule_3",
                                                "type": "field",
                                                "title": "Third Quarter",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw_month_2_schedule_3",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_2_schedule_3",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_2_schedule_3"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month",
                                                        "value": "march",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_2_schedule_3"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_2_schedule_3"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "september",
                                                "default": "september",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": true,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "september",
                                                        "title": "September"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "quarterly_withdraw_month_3_schedule_1",
                                                "type": "field",
                                                "title": "Fourth Quarter",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw_month_3_schedule_1",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_3_schedule_1",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_3_schedule_1"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month",
                                                        "value": "january",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_3_schedule_1"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_3_schedule_1"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "october",
                                                "default": "october",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": true,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "october",
                                                        "title": "October"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "quarterly_withdraw_month_3_schedule_2",
                                                "type": "field",
                                                "title": "Fourth Quarter",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw_month_3_schedule_2",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_3_schedule_2",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_3_schedule_2"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month",
                                                        "value": "february",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_3_schedule_2"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_3_schedule_2"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "november",
                                                "default": "november",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": true,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "november",
                                                        "title": "November"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "quarterly_withdraw_month_3_schedule_3",
                                                "type": "field",
                                                "title": "Fourth Quarter",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw_month_3_schedule_3",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_3_schedule_3",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_3_schedule_3"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month",
                                                        "value": "march",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_3_schedule_3"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_month_3_schedule_3"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "december",
                                                "default": "december",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": true,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "december",
                                                        "title": "December"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "quarterly_withdraw_week",
                                                "type": "field",
                                                "title": "Week",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw_week",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_week",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_week"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "off",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_week"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "1",
                                                "default": "1",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": false,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "1",
                                                        "title": "1st Week"
                                                    },
                                                    {
                                                        "value": "2",
                                                        "title": "2nd Week"
                                                    },
                                                    {
                                                        "value": "3",
                                                        "title": "3rd Week"
                                                    },
                                                    {
                                                        "value": "L",
                                                        "title": "Last Week"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "quarterly_withdraw_day",
                                                "type": "field",
                                                "title": "Day",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_quarterly_withdraw_sub_section_quarterly_withdraw_group_quarterly_withdraw_day",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_day",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_day"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw",
                                                        "value": "off",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group.quarterly_withdraw_day"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "monday",
                                                "default": "monday",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": false,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "saturday",
                                                        "title": "Saturday"
                                                    },
                                                    {
                                                        "value": "sunday",
                                                        "title": "Sunday"
                                                    },
                                                    {
                                                        "value": "monday",
                                                        "title": "Monday"
                                                    },
                                                    {
                                                        "value": "tuesday",
                                                        "title": "Tuesday"
                                                    },
                                                    {
                                                        "value": "wednesday",
                                                        "title": "Wednesday"
                                                    },
                                                    {
                                                        "value": "thursday",
                                                        "title": "Thursday"
                                                    },
                                                    {
                                                        "value": "friday",
                                                        "title": "Friday"
                                                    }
                                                ]
                                            }
                                        ],
                                        "description": "Select suitable months, weeks and day of week. 4 times in a year.",
                                        "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                                "value": "schedule",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "in",
                                                "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group"
                                            },
                                            {
                                                "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                                "value": "schedule",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "not_in",
                                                "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section.quarterly_withdraw_group"
                                            }
                                        ],
                                        "validations": [],
                                        "content_class": "dokan-single-line-row"
                                    }
                                ],
                                "description": "",
                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section",
                                "dependencies": [
                                    {
                                        "key": "withdraw_charge.withdraw_option_visibility_section.withdraw_option_visibility",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section"
                                    },
                                    {
                                        "key": "withdraw_charge.withdraw_option_visibility_section.withdraw_option_visibility",
                                        "value": "off",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "===",
                                        "self": "withdraw_charge.withdraw_option_visibility_section.quarterly_withdraw_sub_section"
                                    }
                                ],
                                "validations": []
                            },
                            {
                                "id": "monthly_withdraw_sub_section",
                                "type": "subsection",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_monthly_withdraw_sub_section",
                                "children": [
                                    {
                                        "id": "monthly_withdraw_group",
                                        "type": "fieldgroup",
                                        "title": "Monthly",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_monthly_withdraw_sub_section_monthly_withdraw_group",
                                        "children": [
                                            {
                                                "id": "monthly_withdraw",
                                                "type": "field",
                                                "title": "Monthly Withdraw",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_monthly_withdraw_sub_section_monthly_withdraw_group_monthly_withdraw",
                                                "children": [],
                                                "description": "Enable Monthly Withdraw as a withdrawal method for vendors.",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                                        "value": "schedule",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "in",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                                        "value": "schedule",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "not_in",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "switch",
                                                "value": "off",
                                                "default": "off",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": false,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [],
                                                "enable_state": {
                                                    "value": "on",
                                                    "title": "Enabled"
                                                },
                                                "disable_state": {
                                                    "value": "off",
                                                    "title": "Disabled"
                                                },
                                                "switcher_type": null,
                                                "should_confirm": false,
                                                "confirm_modal": []
                                            },
                                            {
                                                "id": "monthly_withdraw_week",
                                                "type": "field",
                                                "title": "Week",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_monthly_withdraw_sub_section_monthly_withdraw_group_monthly_withdraw_week",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw_week",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw_week"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw",
                                                        "value": "off",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw_week"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "1",
                                                "default": "1",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": false,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "1",
                                                        "title": "First Week"
                                                    },
                                                    {
                                                        "value": "2",
                                                        "title": "Second Week"
                                                    },
                                                    {
                                                        "value": "3",
                                                        "title": "Third Week"
                                                    },
                                                    {
                                                        "value": "L",
                                                        "title": "Last Week"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "monthly_withdraw_day",
                                                "type": "field",
                                                "title": "Day",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_monthly_withdraw_sub_section_monthly_withdraw_group_monthly_withdraw_day",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw_day",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw_day"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw",
                                                        "value": "off",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group.monthly_withdraw_day"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "monday",
                                                "default": "monday",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": false,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "saturday",
                                                        "title": "Saturday"
                                                    },
                                                    {
                                                        "value": "sunday",
                                                        "title": "Sunday"
                                                    },
                                                    {
                                                        "value": "monday",
                                                        "title": "Monday"
                                                    },
                                                    {
                                                        "value": "tuesday",
                                                        "title": "Tuesday"
                                                    },
                                                    {
                                                        "value": "wednesday",
                                                        "title": "Wednesday"
                                                    },
                                                    {
                                                        "value": "thursday",
                                                        "title": "Thursday"
                                                    },
                                                    {
                                                        "value": "friday",
                                                        "title": "Friday"
                                                    }
                                                ]
                                            }
                                        ],
                                        "description": "Select suitable weeks and day of week. 12 times in a year.",
                                        "dependency_key": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.withdraw_option_visibility_section.withdraw_option_visibility",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group"
                                            },
                                            {
                                                "key": "withdraw_charge.withdraw_option_visibility_section.withdraw_option_visibility",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section.monthly_withdraw_group"
                                            }
                                        ],
                                        "validations": [],
                                        "content_class": "dokan-single-line-row"
                                    }
                                ],
                                "description": "",
                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section",
                                "dependencies": [
                                    {
                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                        "value": "schedule",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "in",
                                        "self": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section"
                                    },
                                    {
                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                        "value": "schedule",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "not_in",
                                        "self": "withdraw_charge.withdraw_option_visibility_section.monthly_withdraw_sub_section"
                                    }
                                ],
                                "validations": []
                            },
                            {
                                "id": "biweekly_withdraw_sub_section",
                                "type": "subsection",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_biweekly_withdraw_sub_section",
                                "children": [
                                    {
                                        "id": "biweekly_withdraw_group",
                                        "type": "fieldgroup",
                                        "title": "Biweekly",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_biweekly_withdraw_sub_section_biweekly_withdraw_group",
                                        "children": [
                                            {
                                                "id": "biweekly_withdraw",
                                                "type": "field",
                                                "title": "Biweekly Withdraw",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_biweekly_withdraw_sub_section_biweekly_withdraw_group_biweekly_withdraw",
                                                "children": [],
                                                "description": "Enable Biweekly Withdraw as a withdrawal method for vendors.",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                                        "value": "schedule",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "in",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                                        "value": "schedule",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "not_in",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "switch",
                                                "value": "off",
                                                "default": "off",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": false,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [],
                                                "enable_state": {
                                                    "value": "on",
                                                    "title": "Enabled"
                                                },
                                                "disable_state": {
                                                    "value": "off",
                                                    "title": "Disabled"
                                                },
                                                "switcher_type": null,
                                                "should_confirm": false,
                                                "confirm_modal": []
                                            },
                                            {
                                                "id": "biweekly_withdraw_week",
                                                "type": "field",
                                                "title": "First",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_biweekly_withdraw_sub_section_biweekly_withdraw_group_biweekly_withdraw_week",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_week",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_week"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw",
                                                        "value": "off",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_week"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "1",
                                                "default": "1",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": false,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "1",
                                                        "title": "1st Week"
                                                    },
                                                    {
                                                        "value": "2",
                                                        "title": "2nd Week"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "biweekly_withdraw_1_week_1",
                                                "type": "field",
                                                "title": "Second",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_biweekly_withdraw_sub_section_biweekly_withdraw_group_biweekly_withdraw_1_week_1",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_1_week_1",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_1_week_1"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_week",
                                                        "value": "1",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_1_week_1"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw",
                                                        "value": "off",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_1_week_1"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "3",
                                                "default": "3",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": true,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "3",
                                                        "title": "3rd Week"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "biweekly_withdraw_1_week_2",
                                                "type": "field",
                                                "title": "Second",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_biweekly_withdraw_sub_section_biweekly_withdraw_group_biweekly_withdraw_1_week_2",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_1_week_2",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_1_week_2"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_week",
                                                        "value": "2",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "!==",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_1_week_2"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw",
                                                        "value": "off",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_1_week_2"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "4",
                                                "default": "4",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": true,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "4",
                                                        "title": "4th Week"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "biweekly_withdraw_day",
                                                "type": "field",
                                                "title": "Day",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_biweekly_withdraw_sub_section_biweekly_withdraw_group_biweekly_withdraw_day",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_day",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_day"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw",
                                                        "value": "off",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group.biweekly_withdraw_day"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "monday",
                                                "default": "monday",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": false,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "saturday",
                                                        "title": "Saturday"
                                                    },
                                                    {
                                                        "value": "sunday",
                                                        "title": "Sunday"
                                                    },
                                                    {
                                                        "value": "monday",
                                                        "title": "Monday"
                                                    },
                                                    {
                                                        "value": "tuesday",
                                                        "title": "Tuesday"
                                                    },
                                                    {
                                                        "value": "wednesday",
                                                        "title": "Wednesday"
                                                    },
                                                    {
                                                        "value": "thursday",
                                                        "title": "Thursday"
                                                    },
                                                    {
                                                        "value": "friday",
                                                        "title": "Friday"
                                                    }
                                                ]
                                            }
                                        ],
                                        "description": "Select suitable weeks and day of week. 24 times in a year.",
                                        "dependency_key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.withdraw_option_visibility_section.withdraw_option_visibility",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group"
                                            },
                                            {
                                                "key": "withdraw_charge.withdraw_option_visibility_section.withdraw_option_visibility",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section.biweekly_withdraw_group"
                                            }
                                        ],
                                        "validations": [],
                                        "content_class": "dokan-single-line-row"
                                    }
                                ],
                                "description": "",
                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section",
                                "dependencies": [
                                    {
                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                        "value": "schedule",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "in",
                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section"
                                    },
                                    {
                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                        "value": "schedule",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "not_in",
                                        "self": "withdraw_charge.withdraw_option_visibility_section.biweekly_withdraw_sub_section"
                                    }
                                ],
                                "validations": []
                            },
                            {
                                "id": "weekly_withdraw_sub_section",
                                "type": "subsection",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_weekly_withdraw_sub_section",
                                "children": [
                                    {
                                        "id": "weekly_withdraw_group",
                                        "type": "fieldgroup",
                                        "title": "Weekly",
                                        "icon": "",
                                        "tooltip": "",
                                        "display": true,
                                        "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_weekly_withdraw_sub_section_weekly_withdraw_group",
                                        "children": [
                                            {
                                                "id": "weekly_withdraw",
                                                "type": "field",
                                                "title": "Weekly Withdraw",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_weekly_withdraw_sub_section_weekly_withdraw_group_weekly_withdraw",
                                                "children": [],
                                                "description": "Enable Weekly Withdraw as a withdrawal method for vendors.",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section.weekly_withdraw_group.weekly_withdraw",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                                        "value": "schedule",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "in",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section.weekly_withdraw_group.weekly_withdraw"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                                        "value": "schedule",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "not_in",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section.weekly_withdraw_group.weekly_withdraw"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "switch",
                                                "value": "off",
                                                "default": "off",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": false,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [],
                                                "enable_state": {
                                                    "value": "on",
                                                    "title": "Enabled"
                                                },
                                                "disable_state": {
                                                    "value": "off",
                                                    "title": "Disabled"
                                                },
                                                "switcher_type": null,
                                                "should_confirm": false,
                                                "confirm_modal": []
                                            },
                                            {
                                                "id": "weekly_withdraw_day",
                                                "type": "field",
                                                "title": "Day",
                                                "icon": "",
                                                "tooltip": "",
                                                "display": true,
                                                "hook_key": "dokan_settings_transaction_withdraw_charge_withdraw_option_visibility_section_weekly_withdraw_sub_section_weekly_withdraw_group_weekly_withdraw_day",
                                                "children": [],
                                                "description": "",
                                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section.weekly_withdraw_group.weekly_withdraw_day",
                                                "dependencies": [
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section.weekly_withdraw_group.weekly_withdraw",
                                                        "value": "on",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "show",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section.weekly_withdraw_group.weekly_withdraw_day"
                                                    },
                                                    {
                                                        "key": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section.weekly_withdraw_group.weekly_withdraw",
                                                        "value": "off",
                                                        "to_self": true,
                                                        "attribute": "display",
                                                        "effect": "hide",
                                                        "comparison": "===",
                                                        "self": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section.weekly_withdraw_group.weekly_withdraw_day"
                                                    }
                                                ],
                                                "validations": [],
                                                "variant": "select",
                                                "value": "monday",
                                                "default": "monday",
                                                "placeholder": "",
                                                "readonly": false,
                                                "disabled": false,
                                                "size": 20,
                                                "helper_text": "",
                                                "postfix": "",
                                                "prefix": "",
                                                "image_url": "",
                                                "options": [
                                                    {
                                                        "value": "saturday",
                                                        "title": "Saturday"
                                                    },
                                                    {
                                                        "value": "sunday",
                                                        "title": "Sunday"
                                                    },
                                                    {
                                                        "value": "monday",
                                                        "title": "Monday"
                                                    },
                                                    {
                                                        "value": "tuesday",
                                                        "title": "Tuesday"
                                                    },
                                                    {
                                                        "value": "wednesday",
                                                        "title": "Wednesday"
                                                    },
                                                    {
                                                        "value": "thursday",
                                                        "title": "Thursday"
                                                    },
                                                    {
                                                        "value": "friday",
                                                        "title": "Friday"
                                                    }
                                                ]
                                            }
                                        ],
                                        "description": "Select suitable day of week. 52 times in a year.",
                                        "dependency_key": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section.weekly_withdraw_group",
                                        "dependencies": [
                                            {
                                                "key": "withdraw_charge.withdraw_option_visibility_section.withdraw_option_visibility",
                                                "value": "on",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "show",
                                                "comparison": "===",
                                                "self": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section.weekly_withdraw_group"
                                            },
                                            {
                                                "key": "withdraw_charge.withdraw_option_visibility_section.withdraw_option_visibility",
                                                "value": "off",
                                                "to_self": true,
                                                "attribute": "display",
                                                "effect": "hide",
                                                "comparison": "===",
                                                "self": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section.weekly_withdraw_group"
                                            }
                                        ],
                                        "validations": [],
                                        "content_class": "dokan-single-line-row"
                                    }
                                ],
                                "description": "",
                                "dependency_key": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section",
                                "dependencies": [
                                    {
                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                        "value": "schedule",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "in",
                                        "self": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section"
                                    },
                                    {
                                        "key": "withdraw_charge.withdraw_option_visibility_section.manual_withdraw",
                                        "value": "schedule",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "not_in",
                                        "self": "withdraw_charge.withdraw_option_visibility_section.weekly_withdraw_sub_section"
                                    }
                                ],
                                "validations": []
                            }
                        ],
                        "description": "",
                        "dependency_key": "withdraw_charge.withdraw_option_visibility_section",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Set up available withdrawal methods and transaction conditions for vendors.",
                "dependency_key": "withdraw_charge",
                "dependencies": [],
                "validations": [],
                "priority": 300,
                "doc_link": "https://dokan.co/docs/wordpress/withdraw/"
            },
            {
                "id": "reverse_withdrawal",
                "type": "subpage",
                "title": "Reverse Withdrawal",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_transaction_reverse_withdrawal",
                "children": [
                    {
                        "id": "reverse_withdrawal_section",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_transaction_reverse_withdrawal_reverse_withdrawal_section",
                        "children": [
                            {
                                "id": "enabled",
                                "type": "field",
                                "title": "Activate Reverse Withdrawal (Cash On Delivery)",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_reverse_withdrawal_reverse_withdrawal_section_enabled",
                                "children": [],
                                "description": "Enable this option to activate automatic balance deducting from vendors.",
                                "dependency_key": "reverse_withdrawal.reverse_withdrawal_section.enabled",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "billing_type",
                                "type": "field",
                                "title": "Billing Type",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_reverse_withdrawal_reverse_withdrawal_section_billing_type",
                                "children": [],
                                "description": "Select how vendors will be billed for their reverse balance amounts.",
                                "dependency_key": "reverse_withdrawal.reverse_withdrawal_section.billing_type",
                                "dependencies": [],
                                "validations": [],
                                "variant": "radio_capsule",
                                "value": "by_amount",
                                "default": "by_amount",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "by_amount",
                                        "title": "By Amount Limit",
                                        "startIcon": "DollarSign"
                                    },
                                    {
                                        "value": "by_month",
                                        "title": "Monthly",
                                        "startIcon": "Calendar"
                                    }
                                ]
                            },
                            {
                                "id": "reverse_balance_threshold",
                                "type": "field",
                                "title": "Reverse Balance Threshold (USD)",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_reverse_withdrawal_reverse_withdrawal_section_reverse_balance_threshold",
                                "children": [],
                                "description": "Set the amount that triggers automatic withdrawal actions.",
                                "dependency_key": "reverse_withdrawal.reverse_withdrawal_section.reverse_balance_threshold",
                                "dependencies": [
                                    {
                                        "key": "reverse_withdrawal.reverse_withdrawal_section.billing_type",
                                        "value": "by_amount",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "reverse_withdrawal.reverse_withdrawal_section.reverse_balance_threshold"
                                    },
                                    {
                                        "key": "reverse_withdrawal.reverse_withdrawal_section.billing_type",
                                        "value": "by_month",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "===",
                                        "self": "reverse_withdrawal.reverse_withdrawal_section.reverse_balance_threshold"
                                    }
                                ],
                                "validations": [],
                                "variant": "number",
                                "value": 150,
                                "default": "150",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "&#36;",
                                "image_url": "",
                                "minimum": 0,
                                "maximum": null,
                                "step": 0.5,
                                "addon_icon": true
                            },
                            {
                                "id": "monthly_billing_day",
                                "type": "field",
                                "title": "Monthly Billing Date",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_reverse_withdrawal_reverse_withdrawal_section_monthly_billing_day",
                                "children": [],
                                "description": "Enter the day of month when you want to send reverse withdrawal balance invoices to vendors.",
                                "dependency_key": "reverse_withdrawal.reverse_withdrawal_section.monthly_billing_day",
                                "dependencies": [
                                    {
                                        "key": "reverse_withdrawal.reverse_withdrawal_section.billing_type",
                                        "value": "by_month",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "reverse_withdrawal.reverse_withdrawal_section.monthly_billing_day"
                                    },
                                    {
                                        "key": "reverse_withdrawal.reverse_withdrawal_section.billing_type",
                                        "value": "by_amount",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "===",
                                        "self": "reverse_withdrawal.reverse_withdrawal_section.monthly_billing_day"
                                    }
                                ],
                                "validations": [],
                                "variant": "number",
                                "value": 1,
                                "default": "1",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "Calendar",
                                "image_url": "",
                                "minimum": 1,
                                "maximum": 28,
                                "step": 0.1,
                                "addon_icon": true
                            },
                            {
                                "id": "due_period",
                                "type": "field",
                                "title": "Grace Period",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_reverse_withdrawal_reverse_withdrawal_section_due_period",
                                "children": [],
                                "description": "Number of days to wait before enforcing collection actions. Set to 0 for immediate action.",
                                "dependency_key": "reverse_withdrawal.reverse_withdrawal_section.due_period",
                                "dependencies": [],
                                "validations": [],
                                "variant": "number",
                                "value": 7,
                                "default": "7",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "Days",
                                "prefix": "Calendar",
                                "image_url": "",
                                "minimum": 0,
                                "maximum": 28,
                                "step": 1,
                                "addon_icon": true
                            },
                            {
                                "id": "failed_actions",
                                "type": "field",
                                "title": "Penalty Actions After Grace Period",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_reverse_withdrawal_reverse_withdrawal_section_failed_actions",
                                "children": [],
                                "description": "Choose actions to take when the grace period expires and payment remains outstanding.",
                                "dependency_key": "reverse_withdrawal.reverse_withdrawal_section.failed_actions",
                                "dependencies": [],
                                "validations": [],
                                "variant": "multicheck",
                                "value": [ "enable_catalog_mode" ],
                                "default": [ "enable_catalog_mode" ],
                                "options": [
                                    {
                                        "value": "enable_catalog_mode",
                                        "title": "Disable Add to Cart Button"
                                    },
                                    {
                                        "value": "hide_withdraw_menu",
                                        "title": "Hide Withdraw Menu"
                                    },
                                    {
                                        "value": "status_inactive",
                                        "title": "Make Vendor Status Inactive"
                                    }
                                ],
                                "helper_text": ""
                            },
                            {
                                "id": "display_notice",
                                "type": "field",
                                "title": "Display Notice During Grace Period",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_reverse_withdrawal_reverse_withdrawal_section_display_notice",
                                "children": [],
                                "description": "Show a payment reminder notification on the vendor dashboard during the grace period.",
                                "dependency_key": "reverse_withdrawal.reverse_withdrawal_section.display_notice",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "send_announcement",
                                "type": "field",
                                "title": "Send Announcement?",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_transaction_reverse_withdrawal_reverse_withdrawal_section_send_announcement",
                                "children": [],
                                "description": "Send platform announcements to vendors during the grace period. Limited to one announcement per billing period.",
                                "dependency_key": "reverse_withdrawal.reverse_withdrawal_section.send_announcement",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            }
                        ],
                        "description": "",
                        "dependency_key": "reverse_withdrawal.reverse_withdrawal_section",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Set up commission collection from vendors on Cash on Delivery orders. Control when and how to charge money from vendor accounts when they owe you.",
                "dependency_key": "reverse_withdrawal",
                "dependencies": [],
                "validations": [],
                "priority": 400,
                "doc_link": "https://wedevs.com/docs/dokan/withdraw/dokan-reverse-withdrawal/"
            }
        ],
        "description": "Configure transaction-related settings including commissions and fees.",
        "dependency_key": "",
        "dependencies": [],
        "validations": []
    },
    {
        "id": "shipment",
        "type": "page",
        "title": "Shipment",
        "icon": "Truck",
        "tooltip": "",
        "display": true,
        "hook_key": "dokan_settings_shipment",
        "children": [
            {
                "id": "shipment-setting-page",
                "type": "subpage",
                "title": "Shipment Settings",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_shipment_shipment-setting-page",
                "children": [
                    {
                        "id": "shipment-settings",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-settings",
                        "children": [
                            {
                                "id": "allows_shipment_tracking",
                                "type": "field",
                                "title": "Allow Shipment Tracking",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-settings_allows_shipment_tracking",
                                "children": [],
                                "description": "Allow vendors to provide tracking information for customer orders.",
                                "dependency_key": "shipment-setting-page.shipment-settings.allows_shipment_tracking",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "enable_shipstation_logging",
                                "type": "field",
                                "title": "Log ShipStation API Request",
                                "icon": "",
                                "tooltip": "Log all ShipStation API interactions.",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-settings_enable_shipstation_logging",
                                "children": [],
                                "description": "Record all API requests and responses from ShipStation integration.",
                                "dependency_key": "shipment-setting-page.shipment-settings.enable_shipstation_logging",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "allow_mark_received",
                                "type": "field",
                                "title": "Allow Mark as Received",
                                "icon": "",
                                "tooltip": "Allow customers to mark order as received.",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-settings_allow_mark_received",
                                "children": [],
                                "description": "Permit customers to confirm delivery completion.",
                                "dependency_key": "shipment-setting-page.shipment-settings.allow_mark_received",
                                "dependencies": [
                                    {
                                        "key": "shipment-setting-page.shipment-settings.allows_shipment_tracking",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "!==",
                                        "self": "shipment-setting-page.shipment-settings.allow_mark_received"
                                    },
                                    {
                                        "key": "shipment-setting-page.shipment-settings.allows_shipment_tracking",
                                        "value": "on",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "shipment-setting-page.shipment-settings.allow_mark_received"
                                    }
                                ],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            }
                        ],
                        "description": "",
                        "dependency_key": "shipment-setting-page.shipment-settings",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "shipment-provider",
                        "type": "section",
                        "title": "Shipment Providers",
                        "icon": "",
                        "tooltip": "Choose the 3rd party shipping providers.",
                        "display": true,
                        "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider",
                        "children": [
                            {
                                "id": "sp-australia-post",
                                "type": "field",
                                "title": "Australia Post",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-australia-post",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-australia-post",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-australia-post",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-canada-post",
                                "type": "field",
                                "title": "Canada Post",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-canada-post",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-canada-post",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-canada-post",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-city-link",
                                "type": "field",
                                "title": "City Link",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-city-link",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-city-link",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-city-link",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-dhl",
                                "type": "field",
                                "title": "DHL",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-dhl",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-dhl",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "sp-dhl",
                                "default": "sp-dhl",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "options": [],
                                "image_url": "https://picsum.photos/100",
                                "enable_state": {
                                    "value": "sp-dhl",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-dpd",
                                "type": "field",
                                "title": "DPD",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-dpd",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-dpd",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "sp-dpd",
                                "default": "sp-dpd",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-dpd",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-fastway-south-africa",
                                "type": "field",
                                "title": "Fastway South Africa",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-fastway-south-africa",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-fastway-south-africa",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-fastway-south-africa",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-fedex",
                                "type": "field",
                                "title": "Fedex",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-fedex",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-fedex",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "sp-fedex",
                                "default": "sp-fedex",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-fedex",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-ontrac",
                                "type": "field",
                                "title": "OnTrac",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-ontrac",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-ontrac",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-ontrac",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-parcelforce",
                                "type": "field",
                                "title": "ParcelForce",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-parcelforce",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-parcelforce",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-parcelforce",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-polish-shipping-providers",
                                "type": "field",
                                "title": "Polish shipping providers",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-polish-shipping-providers",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-polish-shipping-providers",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "sp-polish-shipping-providers",
                                "default": "sp-polish-shipping-providers",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-polish-shipping-providers",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-royal-mail",
                                "type": "field",
                                "title": "Royal Mail",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-royal-mail",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-royal-mail",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-royal-mail",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-tnt-express-consignment",
                                "type": "field",
                                "title": "TNT Express (consignment)",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-tnt-express-consignment",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-tnt-express-consignment",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-tnt-express-consignment",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-tnt-express-reference",
                                "type": "field",
                                "title": "TNT Express (reference)",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-tnt-express-reference",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-tnt-express-reference",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-tnt-express-reference",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-fedex-sameday",
                                "type": "field",
                                "title": "FedEx Sameday",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-fedex-sameday",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-fedex-sameday",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-fedex-sameday",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-ups",
                                "type": "field",
                                "title": "UPS",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-ups",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-ups",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "sp-ups",
                                "default": "sp-ups",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-ups",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-usps",
                                "type": "field",
                                "title": "USPS",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-usps",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-usps",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "sp-usps",
                                "default": "sp-usps",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-usps",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-dhl-us",
                                "type": "field",
                                "title": "DHL US",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-dhl-us",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-dhl-us",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "",
                                "default": "",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-dhl-us",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "sp-other",
                                "type": "field",
                                "title": "Other",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-provider_sp-other",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-provider.sp-other",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "sp-other",
                                "default": "sp-other",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "https://picsum.photos/100",
                                "options": [],
                                "enable_state": {
                                    "value": "sp-other",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            }
                        ],
                        "description": "Select shipping providers that vendors can offer to customers.",
                        "dependency_key": "shipment-setting-page.shipment-provider",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "shipment-status",
                        "type": "section",
                        "title": "Shipment Status",
                        "icon": "",
                        "tooltip": "Add custom shipping status",
                        "display": true,
                        "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-status",
                        "children": [
                            {
                                "id": "shipping_status_list",
                                "type": "field",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_shipment-setting-page_shipment-status_shipping_status_list",
                                "children": [],
                                "description": "",
                                "dependency_key": "shipment-setting-page.shipment-status.shipping_status_list",
                                "dependencies": [],
                                "validations": [],
                                "variant": "repeater",
                                "value": [
                                    {
                                        "id": "ss_delivered",
                                        "order": 0,
                                        "title": "Delivered",
                                        "required": true
                                    },
                                    {
                                        "id": "ss_cancelled",
                                        "order": 1,
                                        "title": "Cancelled",
                                        "required": true
                                    },
                                    {
                                        "id": "ss_proceccing",
                                        "order": 2,
                                        "title": "Processing"
                                    },
                                    {
                                        "id": "ss_ready_for_pickup",
                                        "order": 3,
                                        "title": "Ready for pickup"
                                    },
                                    {
                                        "id": "ss_pickedup",
                                        "order": 4,
                                        "title": "Pickedup"
                                    },
                                    {
                                        "id": "ss_on_the_way",
                                        "order": 5,
                                        "title": "On the way"
                                    }
                                ],
                                "items": [
                                    {
                                        "id": "ss_delivered",
                                        "title": "Delivered",
                                        "order": 0,
                                        "required": true
                                    },
                                    {
                                        "id": "ss_cancelled",
                                        "title": "Cancelled",
                                        "order": 1,
                                        "required": true
                                    },
                                    {
                                        "id": "ss_proceccing",
                                        "title": "Processing",
                                        "order": 2,
                                        "required": false
                                    },
                                    {
                                        "id": "ss_ready_for_pickup",
                                        "title": "Ready for Pickup",
                                        "order": 3,
                                        "required": false
                                    },
                                    {
                                        "id": "ss_pickedup",
                                        "title": "Picked Up",
                                        "order": 4,
                                        "required": false
                                    },
                                    {
                                        "id": "ss_on_the_way",
                                        "title": "On the way",
                                        "order": 5,
                                        "required": false
                                    }
                                ],
                                "default": [],
                                "new_title": "Add New Shipping Status"
                            }
                        ],
                        "description": "Define shipping statuses that vendors can use to update customers.",
                        "dependency_key": "shipment-setting-page.shipment-status",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Configure shipment tracking, integrations, and delivery options for your marketplace.",
                "dependency_key": "shipment-setting-page",
                "dependencies": [],
                "validations": [],
                "priority": 100,
                "doc_link": "https://picsum.photos/100",
                "doc_link_text": "Doc"
            },
            {
                "id": "dashboard-delivery-days-page",
                "type": "subpage",
                "title": "Delivery Time",
                "icon": "",
                "tooltip": "",
                "display": true,
                "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page",
                "children": [
                    {
                        "id": "dokan_delivery_time",
                        "type": "section",
                        "title": "",
                        "icon": "",
                        "tooltip": "",
                        "display": true,
                        "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dokan_delivery_time",
                        "children": [
                            {
                                "id": "allow_vendor_override_settings",
                                "type": "field",
                                "title": "Allow Vendor Customization",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dokan_delivery_time_allow_vendor_override_settings",
                                "children": [],
                                "description": "Allow vendors to customize their own delivery time settings.",
                                "dependency_key": "dashboard-delivery-days-page.dokan_delivery_time.allow_vendor_override_settings",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "off",
                                "default": "off",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "selection_required",
                                "type": "field",
                                "title": "Require Delivery Date and Time",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dokan_delivery_time_selection_required",
                                "children": [],
                                "description": "Make delivery date and time selection required for all orders.",
                                "dependency_key": "dashboard-delivery-days-page.dokan_delivery_time.selection_required",
                                "dependencies": [],
                                "validations": [],
                                "variant": "switch",
                                "value": "on",
                                "default": "on",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [],
                                "enable_state": {
                                    "value": "on",
                                    "title": "Enabled"
                                },
                                "disable_state": {
                                    "value": "off",
                                    "title": "Disabled"
                                },
                                "switcher_type": null,
                                "should_confirm": false,
                                "confirm_modal": []
                            },
                            {
                                "id": "delivery_support",
                                "type": "field",
                                "title": "Delivery Support",
                                "icon": "",
                                "tooltip": "Home delivery refers to that you will deliver to users set location. Store pickup refers to that customers will come to your location and pickup the order.",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dokan_delivery_time_delivery_support",
                                "children": [],
                                "description": "Select the types of delivery services offered.",
                                "dependency_key": "dashboard-delivery-days-page.dokan_delivery_time.delivery_support",
                                "dependencies": [],
                                "validations": [],
                                "variant": "multicheck",
                                "value": [ "delivery", "store-pickup" ],
                                "default": [ "delivery", "store-pickup" ],
                                "options": [
                                    {
                                        "value": "delivery",
                                        "title": "Home Delivery"
                                    },
                                    {
                                        "value": "store-pickup",
                                        "title": "Store Pickup"
                                    }
                                ],
                                "helper_text": ""
                            },
                            {
                                "id": "delivery_date_label",
                                "type": "field",
                                "title": "Delivery Date Label",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dokan_delivery_time_delivery_date_label",
                                "children": [],
                                "description": "This label will show on checkout page",
                                "dependency_key": "dashboard-delivery-days-page.dokan_delivery_time.delivery_date_label",
                                "dependencies": [],
                                "validations": [
                                    {
                                        "rules": "required|not_empty",
                                        "message": "Delivery date label can not be empty",
                                        "params": [],
                                        "self": "dashboard-delivery-days-page.dokan_delivery_time.delivery_date_label"
                                    }
                                ],
                                "variant": "text",
                                "value": "Delivery Date",
                                "default": "Delivery Date",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            },
                            {
                                "id": "delivery_buffer_unit",
                                "type": "field",
                                "title": "Delivery Blocked Buffer Units",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dokan_delivery_time_delivery_buffer_unit",
                                "children": [],
                                "description": "Select the time unit for the delivery buffer. Choose &quot;Days&quot; for full calendar days or &quot;Hours&quot; for more precise same-day delivery control.",
                                "dependency_key": "dashboard-delivery-days-page.dokan_delivery_time.delivery_buffer_unit",
                                "dependencies": [],
                                "validations": [],
                                "variant": "select",
                                "value": "days",
                                "default": "days",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "options": [
                                    {
                                        "value": "days",
                                        "title": "Days"
                                    },
                                    {
                                        "value": "hours",
                                        "title": "Hours"
                                    }
                                ]
                            },
                            {
                                "id": "preorder_date",
                                "type": "field",
                                "title": "Buffer Duration",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dokan_delivery_time_preorder_date",
                                "children": [],
                                "description": "Minimum number of days between order and delivery. Set to 0 for same-day delivery, 1 for next-day delivery, etc.",
                                "dependency_key": "dashboard-delivery-days-page.dokan_delivery_time.preorder_date",
                                "dependencies": [
                                    {
                                        "key": "dashboard-delivery-days-page.dokan_delivery_time.delivery_buffer_unit",
                                        "value": "days",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "dashboard-delivery-days-page.dokan_delivery_time.preorder_date"
                                    },
                                    {
                                        "key": "dashboard-delivery-days-page.dokan_delivery_time.delivery_buffer_unit",
                                        "value": "hours",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "===",
                                        "self": "dashboard-delivery-days-page.dokan_delivery_time.preorder_date"
                                    }
                                ],
                                "validations": [
                                    {
                                        "rules": "min_value",
                                        "message": "Delivery blocked buffer can not be empty or less than 0",
                                        "params": {
                                            "min": 0
                                        },
                                        "self": "dashboard-delivery-days-page.dokan_delivery_time.preorder_date"
                                    }
                                ],
                                "variant": "number",
                                "value": 0,
                                "default": "0",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "days",
                                "prefix": "",
                                "image_url": "",
                                "minimum": 0,
                                "maximum": null,
                                "step": 0.1,
                                "addon_icon": false
                            },
                            {
                                "id": "delivery_buffer_value",
                                "type": "field",
                                "title": "Buffer Duration",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dokan_delivery_time_delivery_buffer_value",
                                "children": [],
                                "description": "Minimum number of hours between order and delivery. If the time exceeds today&#039;s store hours, delivery starts from the next business day.",
                                "dependency_key": "dashboard-delivery-days-page.dokan_delivery_time.delivery_buffer_value",
                                "dependencies": [
                                    {
                                        "key": "dashboard-delivery-days-page.dokan_delivery_time.delivery_buffer_unit",
                                        "value": "hours",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "show",
                                        "comparison": "===",
                                        "self": "dashboard-delivery-days-page.dokan_delivery_time.delivery_buffer_value"
                                    },
                                    {
                                        "key": "dashboard-delivery-days-page.dokan_delivery_time.delivery_buffer_unit",
                                        "value": "days",
                                        "to_self": true,
                                        "attribute": "display",
                                        "effect": "hide",
                                        "comparison": "===",
                                        "self": "dashboard-delivery-days-page.dokan_delivery_time.delivery_buffer_value"
                                    }
                                ],
                                "validations": [
                                    {
                                        "rules": "min_value",
                                        "message": "Delivery buffer hours can not be empty or less than 0",
                                        "params": {
                                            "min": 0
                                        },
                                        "self": "dashboard-delivery-days-page.dokan_delivery_time.delivery_buffer_value"
                                    }
                                ],
                                "variant": "number",
                                "value": 0,
                                "default": "0",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "hours",
                                "prefix": "",
                                "image_url": "",
                                "minimum": 0,
                                "maximum": null,
                                "step": 0.1,
                                "addon_icon": false
                            },
                            {
                                "id": "time_slot_minutes",
                                "type": "field",
                                "title": "Time Slot",
                                "icon": "",
                                "tooltip": "Check this to allow vendors to override &amp; customize the delivery settings. Otherwise, admin configured settings will be applied.",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dokan_delivery_time_time_slot_minutes",
                                "children": [],
                                "description": "Time slot in minutes. Please keep opening and closing time divisible by slot minutes. E.g ( 30, 60, 120 ). Also this cannot be empty, less then 10 or greater then 1440 minutes.",
                                "dependency_key": "dashboard-delivery-days-page.dokan_delivery_time.time_slot_minutes",
                                "dependencies": [],
                                "validations": [
                                    {
                                        "rules": "not_empty|min_value|max_value",
                                        "message": "Time slot minutes can not be empty, less than 10 minutes or greater than 1440 minutes",
                                        "params": {
                                            "min": 10,
                                            "max": 1440
                                        },
                                        "self": "dashboard-delivery-days-page.dokan_delivery_time.time_slot_minutes"
                                    }
                                ],
                                "variant": "number",
                                "value": 30,
                                "default": "30",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "Minutes",
                                "prefix": "",
                                "image_url": "",
                                "minimum": null,
                                "maximum": 1440,
                                "step": 30,
                                "addon_icon": false
                            },
                            {
                                "id": "order_per_slot",
                                "type": "field",
                                "title": "Order Per Slot",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dokan_delivery_time_order_per_slot",
                                "children": [],
                                "description": "Maximum number of orders that can be scheduled for each time slot. Set to 0 for unlimited capacity.",
                                "dependency_key": "dashboard-delivery-days-page.dokan_delivery_time.order_per_slot",
                                "dependencies": [],
                                "validations": [],
                                "variant": "number",
                                "value": 0,
                                "default": "0",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": "",
                                "minimum": null,
                                "maximum": null,
                                "step": 0.1,
                                "addon_icon": false
                            },
                            {
                                "id": "delivery_box_info",
                                "type": "field",
                                "title": "Delivery Box Info",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dokan_delivery_time_delivery_box_info",
                                "children": [],
                                "description": "Message shown on checkout page about delivery timing. %DAY% will show the blocked buffer days.",
                                "dependency_key": "dashboard-delivery-days-page.dokan_delivery_time.delivery_box_info",
                                "dependencies": [],
                                "validations": [
                                    {
                                        "rules": "required|not_empty",
                                        "message": "Delivery box information can not be empty",
                                        "params": [],
                                        "self": "dashboard-delivery-days-page.dokan_delivery_time.delivery_box_info"
                                    }
                                ],
                                "variant": "textarea",
                                "value": "This store needs Y% day(s) to process your delivery request",
                                "default": "This store needs %DAY% day(s) to process your delivery request",
                                "placeholder": "",
                                "readonly": false,
                                "disabled": false,
                                "size": 20,
                                "helper_text": "",
                                "postfix": "",
                                "prefix": "",
                                "image_url": ""
                            }
                        ],
                        "description": "",
                        "dependency_key": "dashboard-delivery-days-page.dokan_delivery_time",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    },
                    {
                        "id": "dashboard-delivery-days-page",
                        "type": "section",
                        "title": "Delivery Days",
                        "icon": "",
                        "tooltip": "Configure delivery schedule and operating hours for each day of the week. At least one delivery date should be selected.",
                        "display": true,
                        "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dashboard-delivery-days-page",
                        "children": [
                            {
                                "id": "delivery_days_schedule",
                                "type": "field",
                                "title": "",
                                "icon": "",
                                "tooltip": "",
                                "display": true,
                                "hook_key": "dokan_settings_shipment_dashboard-delivery-days-page_dashboard-delivery-days-page_delivery_days_schedule",
                                "children": [],
                                "description": "",
                                "dependency_key": "dashboard-delivery-days-page.dashboard-delivery-days-page.delivery_days_schedule",
                                "dependencies": [],
                                "validations": [],
                                "variant": "delivery_days",
                                "value": {
                                    "monday": {
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    },
                                    "tuesday": {
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    },
                                    "wednesday": {
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    },
                                    "thursday": {
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    },
                                    "friday": {
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    },
                                    "saturday": {
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    },
                                    "sunday": {
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    }
                                },
                                "default": {
                                    "monday": {
                                        "day_name": "Monday",
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    },
                                    "tuesday": {
                                        "day_name": "Tuesday",
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    },
                                    "wednesday": {
                                        "day_name": "Wednesday",
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    },
                                    "thursday": {
                                        "day_name": "Thursday",
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    },
                                    "friday": {
                                        "day_name": "Friday",
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    },
                                    "saturday": {
                                        "day_name": "Saturday",
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    },
                                    "sunday": {
                                        "day_name": "Sunday",
                                        "delivery_status": "",
                                        "opening_time": "",
                                        "closing_time": ""
                                    }
                                },
                                "days": {
                                    "monday": "Monday",
                                    "tuesday": "Tuesday",
                                    "wednesday": "Wednesday",
                                    "thursday": "Thursday",
                                    "friday": "Friday",
                                    "saturday": "Saturday",
                                    "sunday": "Sunday"
                                },
                                "is12Hour": true
                            }
                        ],
                        "description": "Configure delivery schedule and operating hours for each day of the week. At least one delivery date should be selected.",
                        "dependency_key": "dashboard-delivery-days-page.dashboard-delivery-days-page",
                        "dependencies": [],
                        "validations": [],
                        "doc_link": ""
                    }
                ],
                "description": "Set up delivery scheduling options and time slots for customer orders.",
                "dependency_key": "dashboard-delivery-days-page",
                "dependencies": [],
                "validations": [],
                "priority": 200,
                "doc_link": "https://dokan.co/docs/wordpress/modules/dokan-delivery-time/"
            }
        ],
        "description": "",
        "dependency_key": "",
        "dependencies": [],
        "validations": []
    },
];

/**
 * Dokan settings
 */
export const DokanSettings: Story = {
    args: {
        schema: dokanSettingsSchema,
        title: 'Dokan Settings',
    },
    render: (args) => <SettingsStoryWrapper {...args} />,
};
