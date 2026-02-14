import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Settings } from './index';
import type { SettingsElement, SettingsProps } from './settings-types';

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
    if (entries.length === 0) return null;
    return (
        <div className="mt-4 rounded-lg border border-border bg-muted/40 max-h-64 overflow-y-auto">
            <div className="px-3 py-2 border-b border-border bg-muted/60 flex justify-between items-center">
                <span className="text-xs font-semibold text-foreground">Event Log</span>
                <span className="text-xs text-muted-foreground">{entries.length} events</span>
            </div>
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
        <div>
            <div className="h-[700px]">
                <Settings
                    {...args}
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
