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
                                        "icon": "",
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
