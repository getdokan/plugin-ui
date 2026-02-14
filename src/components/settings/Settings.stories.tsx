import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Settings } from './index';
import type { SettingsElement } from './settings-types';

// ============================================
// Sample Schema — exercises all field variants
// ============================================

const sampleSchema: SettingsElement[] = [
    // ── Page: General ──
    {
        id: 'general',
        type: 'page',
        title: 'General',
        priority: 10,
        children: [
            // Subpage: Store
            {
                id: 'store',
                type: 'subpage',
                title: 'Store Settings',
                description: 'Configure your store defaults and appearance.',
                icon: 'Store',
                page_id: 'general',
                priority: 10,
                children: [
                    // Tab: Basic
                    {
                        id: 'store_basic',
                        type: 'tab',
                        title: 'Basic',
                        subpage_id: 'store',
                        priority: 10,
                        children: [
                            // Section: Address
                            {
                                id: 'address_section',
                                type: 'section',
                                title: 'Address Information',
                                description: 'Default address for your store.',
                                tab_id: 'store_basic',
                                priority: 10,
                                children: [
                                    {
                                        id: 'store_name',
                                        type: 'field',
                                        variant: 'text',
                                        title: 'Store Name',
                                        description: 'This is the display name of your store.',
                                        tooltip: 'Visible to customers and on invoices.',
                                        dependency_key: 'store_name',
                                        default: 'My Awesome Store',
                                        section_id: 'address_section',
                                        priority: 10,
                                    },
                                    {
                                        id: 'store_city',
                                        type: 'field',
                                        variant: 'text',
                                        title: 'City',
                                        dependency_key: 'store_city',
                                        placeholder: 'Enter city',
                                        section_id: 'address_section',
                                        priority: 20,
                                    },
                                    {
                                        id: 'store_country',
                                        type: 'field',
                                        variant: 'select',
                                        title: 'Country',
                                        description: 'Select the country where your store is located.',
                                        dependency_key: 'store_country',
                                        default: 'us',
                                        options: [
                                            { value: 'us', title: 'United States' },
                                            { value: 'uk', title: 'United Kingdom' },
                                            { value: 'ca', title: 'Canada' },
                                            { value: 'au', title: 'Australia' },
                                            { value: 'bd', title: 'Bangladesh' },
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
                                title: 'Display Options',
                                tab_id: 'store_basic',
                                priority: 20,
                                children: [
                                    {
                                        id: 'enable_store_listing',
                                        type: 'field',
                                        variant: 'switch',
                                        title: 'Enable Store Listing',
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
                                        title: 'Products Per Page',
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
                                                condition: 'equal',
                                            },
                                        ],
                                    },
                                    {
                                        id: 'layout_mode',
                                        type: 'field',
                                        variant: 'radio_capsule',
                                        title: 'Layout Mode',
                                        description: 'Choose a layout for the product grid.',
                                        dependency_key: 'layout_mode',
                                        default: 'grid',
                                        options: [
                                            { value: 'grid', title: 'Grid' },
                                            { value: 'list', title: 'List' },
                                            { value: 'compact', title: 'Compact' },
                                        ],
                                        section_id: 'display_section',
                                        priority: 30,
                                        dependencies: [
                                            {
                                                key: 'enable_store_listing',
                                                value: true,
                                                condition: 'equal',
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
                        title: 'Advanced',
                        subpage_id: 'store',
                        priority: 20,
                        children: [
                            {
                                id: 'advanced_section',
                                type: 'section',
                                title: 'Advanced Settings',
                                description: 'Careful, these settings affect the whole store.',
                                tab_id: 'store_advanced',
                                priority: 10,
                                children: [
                                    {
                                        id: 'custom_css',
                                        type: 'field',
                                        variant: 'textarea',
                                        title: 'Custom CSS',
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
                                        title: 'Information',
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
                title: 'Selling Options',
                description: 'Configure selling behavior for vendors.',
                icon: 'ShoppingCart',
                page_id: 'general',
                priority: 20,
                children: [
                    {
                        id: 'selling_section',
                        type: 'section',
                        title: 'Selling Configuration',
                        subpage_id: 'selling',
                        priority: 10,
                        children: [
                            {
                                id: 'commission_type',
                                type: 'field',
                                variant: 'select',
                                title: 'Commission Type',
                                description: 'How commission is calculated for vendors.',
                                dependency_key: 'commission_type',
                                default: 'percentage',
                                options: [
                                    { value: 'percentage', title: 'Percentage' },
                                    { value: 'flat', title: 'Flat Rate' },
                                    { value: 'combined', title: 'Combined' },
                                ],
                                section_id: 'selling_section',
                                priority: 10,
                            },
                            {
                                id: 'commission_rate',
                                type: 'field',
                                variant: 'number',
                                title: 'Commission Rate',
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
                                title: 'Allowed Product Categories',
                                description: 'Select which categories vendors can sell in.',
                                dependency_key: 'allowed_categories',
                                default: ['electronics', 'clothing'],
                                options: [
                                    { value: 'electronics', title: 'Electronics' },
                                    { value: 'clothing', title: 'Clothing' },
                                    { value: 'home', title: 'Home & Garden' },
                                    { value: 'sports', title: 'Sports' },
                                    { value: 'books', title: 'Books' },
                                ],
                                section_id: 'selling_section',
                                priority: 30,
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
        title: 'Payments',
        priority: 20,
        children: [
            {
                id: 'payment_methods',
                type: 'subpage',
                title: 'Payment Methods',
                description: 'Manage your payment gateways.',
                icon: 'CreditCard',
                page_id: 'payments',
                priority: 10,
                children: [
                    {
                        id: 'payments_section',
                        type: 'section',
                        title: 'Gateway Settings',
                        subpage_id: 'payment_methods',
                        priority: 10,
                        children: [
                            {
                                id: 'enable_paypal',
                                type: 'field',
                                variant: 'switch',
                                title: 'Enable PayPal',
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
                                title: 'PayPal Email',
                                placeholder: 'you@example.com',
                                dependency_key: 'paypal_email',
                                section_id: 'payments_section',
                                priority: 20,
                                dependencies: [
                                    {
                                        key: 'enable_paypal',
                                        value: true,
                                        condition: 'equal',
                                    },
                                ],
                                validations: [
                                    {
                                        type: 'required',
                                        message: 'PayPal email is required when PayPal is enabled.',
                                    },
                                ],
                            },
                            {
                                id: 'enable_stripe',
                                type: 'field',
                                variant: 'switch',
                                title: 'Enable Stripe',
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
                                title: 'Need more gateways?',
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
    render: (args) => {
        const [values, setValues] = useState<Record<string, any>>({});

        return (
            <div className="h-[700px]">
                <Settings
                    {...args}
                    values={values}
                    onChange={(key, value) => {
                        setValues((prev) => ({ ...prev, [key]: value }));
                        args.onChange?.(key, value);
                    }}
                    onSave={(vals) => {
                        // eslint-disable-next-line no-console
                        console.log('Save:', vals);
                        args.onSave?.(vals);
                    }}
                />
            </div>
        );
    },
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
    render: () => {
        const [values, setValues] = useState<Record<string, any>>({
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
        });

        return (
            <div className="h-[700px]">
                <Settings
                    schema={sampleSchema}
                    values={values}
                    title="Acme Store Settings"
                    onChange={(key, value) => {
                        setValues((prev) => ({ ...prev, [key]: value }));
                    }}
                    onSave={(vals) => {
                        // eslint-disable-next-line no-console
                        console.log('Save:', vals);
                        alert('Settings saved! Check console for values.');
                    }}
                />
            </div>
        );
    },
};

/** Dependency demo — toggle the switch to show/hide dependent fields. */
export const DependencyDemo: Story = {
    render: () => {
        const [values, setValues] = useState<Record<string, any>>({
            enable_store_listing: false,
        });

        return (
            <div className="h-[700px]">
                <Settings
                    schema={sampleSchema}
                    values={values}
                    title="Dependency Demo"
                    onChange={(key, value) => {
                        setValues((prev) => ({ ...prev, [key]: value }));
                    }}
                />
            </div>
        );
    },
};
