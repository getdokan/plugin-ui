import type { Meta, StoryFn } from '@storybook/react';
import { SlotFillProvider } from '@wordpress/components';
import { useState } from 'react';
import { DataForm, useFormValidity, type DataFormSchema, type DataViewField } from './../ui';
import { Button } from '../ui/button';

interface SamplePost {
    title: string;
    status: string;
    author: number;
    email: string;
    date: string;
    sticky: boolean;
    description: string;
    tags: string[];
    password?: string;
}

const fields: DataViewField<SamplePost>[] = [
    {
        id: 'title',
        label: 'Title',
        type: 'text'
    },
    {
        id: 'status',
        label: 'Status',
        type: 'text',
        Edit: 'radio',
        elements: [
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'private', label: 'Private' }
        ]
    },
    {
        id: 'author',
        label: 'Author',
        type: 'integer',
        elements: [
            { value: 1, label: 'Jane' },
            { value: 2, label: 'John' },
            { value: 3, label: 'Alice' }
        ],
        setValue: ({ value }) => ({ author: Number(value) })
    },
    {
        id: 'email',
        label: 'Email',
        type: 'email'
    },
    {
        id: 'date',
        label: 'Date',
        type: 'date'
    },
    {
        id: 'sticky',
        label: 'Sticky',
        type: 'boolean',
        Edit: 'toggle'
    },
    {
        id: 'description',
        label: 'Description',
        type: 'text',
        Edit: 'textarea'
    },
    {
        id: 'tags',
        label: 'Tags',
        type: 'array',
        placeholder: 'Enter comma-separated tags',
        elements: [
            { value: 'astronomy', label: 'Astronomy' },
            { value: 'photography', label: 'Photography' },
            { value: 'travel', label: 'Travel' }
        ]
    },
    {
        id: 'password',
        label: 'Password',
        type: 'text',
        isVisible: (item: SamplePost) => item.status !== 'private'
    }
];

const initialPost: SamplePost = {
    title: 'Hello, World!',
    status: 'draft',
    author: 1,
    email: 'hello@wordpress.org',
    date: '2026-01-01',
    sticky: false,
    description: 'This is a sample description.',
    tags: ['photography']
};

const meta: Meta<typeof DataForm> = {
    title: 'WordPress/DataForm',
    component: DataForm,
    decorators: [
        (Story) => (
            <SlotFillProvider>
                <div className="w-full p-4">
                    <Story />
                </div>
            </SlotFillProvider>
        )
    ],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: `
A schema-driven form component re-exported from \`@wordpress/dataviews\`. Fields are described once and rendered through one of several \`Layout\` types (regular, panel, card, row, details), with validation supplied via the \`useFormValidity\` hook.

## Basic usage

\`\`\`tsx
import { DataForm, type DataViewField, type DataFormSchema } from "@wedevs/plugin-ui";

const fields: DataViewField<MyItem>[] = [/* ... */];
const form: DataFormSchema = { layout: { type: "regular" }, fields: ["title", "status"] };

<DataForm<MyItem>
  data={item}
  fields={fields}
  form={form}
  onChange={(edits) => setItem((prev) => ({ ...prev, ...edits }))}
/>
\`\`\`
        `
            }
        }
    },
    tags: ['autodocs']
};

export default meta;

/** Standard top-to-bottom form. The default layout for most edit screens. */
export const RegularLayout: StoryFn = () => {
    const [post, setPost] = useState<SamplePost>(initialPost);

    const form: DataFormSchema = {
        layout: { type: 'regular', labelPosition: 'top' },
        fields: [
            'title',
            'status',
            'author',
            'email',
            'date',
            'sticky',
            'description',
            'tags',
            'password'
        ]
    };

    return (
        <DataForm<SamplePost>
            data={post}
            fields={fields}
            form={form}
            onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
        />
    );
};

/** Side-by-side label and field — useful for compact admin pages. */
export const RegularLayoutSideLabels: StoryFn = () => {
    const [post, setPost] = useState<SamplePost>(initialPost);

    const form: DataFormSchema = {
        layout: { type: 'regular', labelPosition: 'side' },
        fields: ['title', 'status', 'author', 'email', 'date']
    };

    return (
        <DataForm<SamplePost>
            data={post}
            fields={fields}
            form={form}
            onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
        />
    );
};

/** Each field is a clickable row that opens a dropdown — mirrors the WP block inspector. */
export const PanelLayoutDropdown: StoryFn = () => {
    const [post, setPost] = useState<SamplePost>(initialPost);

    const form: DataFormSchema = {
        layout: { type: 'panel', labelPosition: 'side', openAs: 'dropdown' },
        fields: ['title', 'status', 'author', 'email', 'date', 'tags']
    };

    return (
        <DataForm<SamplePost>
            data={post}
            fields={fields}
            form={form}
            onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
        />
    );
};

/** Same panel rows, but each opens a modal with apply/cancel buttons. */
export const PanelLayoutModal: StoryFn = () => {
    const [post, setPost] = useState<SamplePost>(initialPost);

    const form: DataFormSchema = {
        layout: {
            type: 'panel',
            labelPosition: 'top',
            openAs: { type: 'modal', applyLabel: 'Apply', cancelLabel: 'Cancel' }
        },
        fields: ['title', 'status', 'author', 'tags']
    };

    return (
        <DataForm<SamplePost>
            data={post}
            fields={fields}
            form={form}
            onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
        />
    );
};

/** Group fields into a collapsible card with a header. */
export const CardLayout: StoryFn = () => {
    const [post, setPost] = useState<SamplePost>(initialPost);

    const form: DataFormSchema = {
        layout: { type: 'regular' },
        fields: [
            {
                id: 'details',
                label: 'Post details',
                layout: { type: 'card', withHeader: true, isCollapsible: true, isOpened: true },
                children: ['title', 'status', 'author']
            },
            {
                id: 'meta',
                label: 'Metadata',
                layout: { type: 'card', withHeader: true, isCollapsible: true, isOpened: false },
                children: ['email', 'date', 'tags']
            }
        ]
    };

    return (
        <DataForm<SamplePost>
            data={post}
            fields={fields}
            form={form}
            onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
        />
    );
};

/** Render multiple fields on a single horizontal row. */
export const RowLayout: StoryFn = () => {
    const [post, setPost] = useState<SamplePost>(initialPost);

    const form: DataFormSchema = {
        layout: { type: 'regular', labelPosition: 'top' },
        fields: [
            'title',
            {
                id: 'row',
                label: 'Author & date',
                layout: { type: 'row', alignment: 'start' },
                children: ['author', 'date']
            },
            'description'
        ]
    };

    return (
        <DataForm<SamplePost>
            data={post}
            fields={fields}
            form={form}
            onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
        />
    );
};

/**
 * A realistic product-editor form modeled after the Dokan product editor
 * schema. Demonstrates grouping many fields into collapsible cards with
 * inline row layouts and conditional visibility driven by other fields.
 */
export const DokanFormManager: StoryFn = () => {
    interface DokanProduct {
        name: string;
        slug: string;
        type: string;
        regular_price: string;
        sale_price: string;
        create_schedule_for_discount: boolean;
        date_on_sale_from: string;
        date_on_sale_to: string;
        category_ids: number[];
        product_tag: number[];
        downloadable: boolean;
        virtual: boolean;
        short_description: string;
        description: string;
        sku: string;
        global_unique_id: string;
        manage_stock: boolean;
        stock_status: string;
        stock_quantity: number;
        low_stock_amount: number;
        backorders: string;
        sold_individually: boolean;
        _disable_shipping: boolean;
        weight: string;
        length: string;
        width: string;
        height: string;
        shipping_class: string;
        tax_status: string;
        tax_class: string;
        download_limit: number;
        download_expiry: number;
        _is_lot_discount: boolean;
        _lot_discount_quantity: number;
        _lot_discount_amount: number;
        status: string;
        catalog_visibility: string;
        purchase_note: string;
        reviews_allowed: boolean;
    }

    const initialProduct: DokanProduct = {
        name: 'My Name - Personalized Custom Name Necklace',
        slug: 'my-name',
        type: 'simple',
        regular_price: '49.99',
        sale_price: '',
        create_schedule_for_discount: false,
        date_on_sale_from: '',
        date_on_sale_to: '',
        category_ids: [20, 15],
        product_tag: [32],
        downloadable: false,
        virtual: false,
        short_description: 'Discover the perfect personalized gift with our custom name necklace.',
        description:
            'Crafted from high-quality sterling silver or elegant gold plating, this bespoke piece allows you to showcase your identity.',
        sku: 'DKN-NECK-001',
        global_unique_id: '',
        manage_stock: false,
        stock_status: 'instock',
        stock_quantity: 0,
        low_stock_amount: 0,
        backorders: 'no',
        sold_individually: false,
        _disable_shipping: true,
        weight: '0.12',
        length: '11',
        width: '4',
        height: '2',
        shipping_class: '',
        tax_status: 'taxable',
        tax_class: '',
        download_limit: -1,
        download_expiry: -1,
        _is_lot_discount: false,
        _lot_discount_quantity: 0,
        _lot_discount_amount: 0,
        status: 'publish',
        catalog_visibility: 'visible',
        purchase_note: '',
        reviews_allowed: true
    };

    const dokanFields: DataViewField<DokanProduct>[] = [
        {
            id: 'name',
            label: 'Title',
            type: 'text',
            placeholder: 'Enter product title...',
            isValid: { required: true }
        },
        {
            id: 'slug',
            label: 'Permalink',
            type: 'text',
            description: 'https://dokan.test/product/<slug>',
            placeholder: 'Enter product slug...'
        },
        {
            id: 'type',
            label: 'Product Type',
            type: 'text',
            description:
                'Choose Variable if your product has multiple attributes — like sizes, colors, quality etc.',
            elements: [
                { value: 'simple', label: 'Simple' },
                { value: 'variable', label: 'Variable' },
                { value: 'external', label: 'External/Affiliate product' },
                { value: 'grouped', label: 'Group Product' },
                { value: 'subscription', label: 'Simple subscription' }
            ]
        },
        {
            id: 'regular_price',
            label: 'Price',
            type: 'text',
            placeholder: '0.00',
            isVisible: (item) => item.type !== 'variable' && item.type !== 'grouped'
        },
        {
            id: 'sale_price',
            label: 'Sale Price',
            type: 'text',
            placeholder: '0.00',
            isVisible: (item) => item.type !== 'variable' && item.type !== 'grouped'
        },
        {
            id: 'create_schedule_for_discount',
            label: 'Create schedule for discount',
            type: 'boolean',
            Edit: 'toggle',
            isVisible: (item) => item.type !== 'variable' && item.type !== 'grouped'
        },
        {
            id: 'date_on_sale_from',
            label: 'From',
            type: 'datetime',
            isVisible: (item) => item.create_schedule_for_discount === true
        },
        {
            id: 'date_on_sale_to',
            label: 'To',
            type: 'datetime',
            isVisible: (item) => item.create_schedule_for_discount === true
        },
        {
            id: 'category_ids',
            label: 'Categories',
            type: 'array',
            placeholder: 'Select product categories',
            elements: [
                { value: 20, label: 'Accessories' },
                { value: 19, label: 'Hoodies' },
                { value: 18, label: 'Tshirts' },
                { value: 15, label: 'Uncategorized' },
                { value: 22, label: 'Decor' },
                { value: 21, label: 'Music' }
            ]
        },
        {
            id: 'product_tag',
            label: 'Tags',
            type: 'array',
            placeholder: 'Select product tags',
            elements: [
                { value: 32, label: 'Dokan dummy data' },
                { value: 67, label: 'Test Tag' },
                { value: 102, label: 'asdf dfas' }
            ]
        },
        {
            id: 'downloadable',
            label: 'Downloadable',
            type: 'boolean',
            Edit: 'toggle',
            description: 'Downloadable products give access to a file upon purchase.'
        },
        {
            id: 'virtual',
            label: 'Virtual',
            type: 'boolean',
            Edit: 'toggle',
            description: 'Virtual products are intangible and are not shipped.'
        },
        {
            id: 'short_description',
            label: 'Short Description',
            type: 'text',
            Edit: 'textarea',
            placeholder: 'Enter product short description'
        },
        {
            id: 'description',
            label: 'Description',
            type: 'text',
            Edit: 'textarea',
            placeholder: 'Enter product description',
            isValid: { required: true }
        },
        {
            id: 'sku',
            label: 'SKU (Stock Keeping Unit)',
            type: 'text',
            placeholder: 'Enter product SKU',
            description: 'A unique identifier for each distinct product.'
        },
        {
            id: 'global_unique_id',
            label: 'GTIN, UPC, EAN, or ISBN',
            type: 'text',
            placeholder: 'Enter code',
            description: 'A barcode or other identifier unique to this product.'
        },
        {
            id: 'manage_stock',
            label: 'Manage stock?',
            type: 'boolean',
            Edit: 'toggle',
            description: 'Manage stock level (quantity)'
        },
        {
            id: 'stock_status',
            label: 'Stock Status',
            type: 'text',
            elements: [
                { value: 'instock', label: 'In stock' },
                { value: 'outofstock', label: 'Out of stock' },
                { value: 'onbackorder', label: 'On backorder' }
            ],
            isVisible: (item) => !item.manage_stock
        },
        {
            id: 'stock_quantity',
            label: 'Stock quantity',
            type: 'integer',
            placeholder: '1',
            isVisible: (item) => item.manage_stock === true
        },
        {
            id: 'low_stock_amount',
            label: 'Low stock threshold',
            type: 'integer',
            placeholder: 'Store-wide threshold (2)',
            isVisible: (item) => item.manage_stock === true
        },
        {
            id: 'backorders',
            label: 'Allow Backorders',
            type: 'text',
            elements: [
                { value: 'no', label: 'Do not allow' },
                { value: 'notify', label: 'Allow, but notify customer' },
                { value: 'yes', label: 'Allow' }
            ],
            isVisible: (item) => item.manage_stock === true
        },
        {
            id: 'sold_individually',
            label: 'Sold individually',
            type: 'boolean',
            Edit: 'toggle',
            description: 'Allow only one quantity of this product to be bought in a single order.'
        },
        {
            id: '_disable_shipping',
            label: 'This product requires shipping',
            type: 'boolean',
            Edit: 'toggle',
            isVisible: (item) => item.type !== 'grouped' && item.type !== 'external'
        },
        {
            id: 'weight',
            label: 'Weight (kg)',
            type: 'text',
            placeholder: 'Weight (kg)',
            isVisible: (item) => item._disable_shipping === true
        },
        {
            id: 'length',
            label: 'Length (cm)',
            type: 'text',
            placeholder: 'Length (cm)',
            isVisible: (item) => item._disable_shipping === true
        },
        {
            id: 'width',
            label: 'Width (cm)',
            type: 'text',
            placeholder: 'Width (cm)',
            isVisible: (item) => item._disable_shipping === true
        },
        {
            id: 'height',
            label: 'Height (cm)',
            type: 'text',
            placeholder: 'Height (cm)',
            isVisible: (item) => item._disable_shipping === true
        },
        {
            id: 'shipping_class',
            label: 'Shipping Class',
            type: 'text',
            elements: [
                { value: '', label: 'No shipping class' },
                { value: 'heavy', label: 'Heavy' },
                { value: 'light', label: 'Light' }
            ]
        },
        {
            id: 'tax_status',
            label: 'Tax Status',
            type: 'text',
            elements: [
                { value: 'taxable', label: 'Taxable' },
                { value: 'shipping', label: 'Shipping only' },
                { value: 'none', label: 'None' }
            ]
        },
        {
            id: 'tax_class',
            label: 'Tax Class',
            type: 'text',
            elements: [
                { value: '', label: 'Standard' },
                { value: 'reduced-rate', label: 'Reduced rate' },
                { value: 'zero-rate', label: 'Zero rate' }
            ]
        },
        {
            id: 'download_limit',
            label: 'Download Limit',
            type: 'integer',
            placeholder: 'Unlimited',
            description: 'Leave blank for unlimited re-downloads.',
            isVisible: (item) => item.downloadable === true
        },
        {
            id: 'download_expiry',
            label: 'Download Expiry',
            type: 'integer',
            placeholder: 'Never',
            description: 'Number of days before a download link expires.',
            isVisible: (item) => item.downloadable === true
        },
        {
            id: '_is_lot_discount',
            label: 'Enable bulk discount',
            type: 'boolean',
            Edit: 'toggle'
        },
        {
            id: '_lot_discount_quantity',
            label: 'Minimum quantity',
            type: 'integer',
            placeholder: '0',
            isVisible: (item) => item._is_lot_discount === true
        },
        {
            id: '_lot_discount_amount',
            label: 'Discount %',
            type: 'integer',
            placeholder: 'Percentage',
            isVisible: (item) => item._is_lot_discount === true
        },
        {
            id: 'status',
            label: 'Status',
            type: 'text',
            Edit: 'radio',
            elements: [
                { value: 'publish', label: 'Publish' },
                { value: 'draft', label: 'Draft' }
            ]
        },
        {
            id: 'catalog_visibility',
            label: 'Visibility',
            type: 'text',
            elements: [
                { value: 'visible', label: 'Visible' },
                { value: 'catalog', label: 'Catalog' },
                { value: 'search', label: 'Search' },
                { value: 'hidden', label: 'Hidden' }
            ]
        },
        {
            id: 'purchase_note',
            label: 'Purchase Note',
            type: 'text',
            Edit: 'textarea',
            placeholder: 'Purchase Note',
            description: 'Customer will get this in order email.'
        },
        {
            id: 'reviews_allowed',
            label: 'Enable product reviews',
            type: 'boolean',
            Edit: 'toggle'
        }
    ];

    const [product, setProduct] = useState<DokanProduct>(initialProduct);

    const form: DataFormSchema = {
        layout: { type: 'regular', labelPosition: 'top' },
        fields: [
            {
                id: 'general',
                label: 'General',
                layout: { type: 'card', withHeader: true, isCollapsible: true, isOpened: true },
                children: [
                    'name',
                    'slug',
                    'type',
                    'regular_price',
                    'sale_price',
                    'create_schedule_for_discount',
                    {
                        id: 'discount_schedule',
                        label: 'Discount schedule',
                        layout: { type: 'row' },
                        children: ['date_on_sale_from', 'date_on_sale_to']
                    },
                    'category_ids',
                    'product_tag',
                    {
                        id: 'digital_options',
                        label: 'Digital product options',
                        layout: { type: 'row', alignment: 'start' },
                        children: ['downloadable', 'virtual']
                    }
                ]
            },
            {
                id: 'description_section',
                label: 'Description',
                layout: { type: 'card', withHeader: true, isCollapsible: true, isOpened: true },
                children: ['short_description', 'description']
            },
            {
                id: 'inventory',
                label: 'Inventory',
                description: 'Manage inventory for this product',
                layout: { type: 'card', withHeader: true, isCollapsible: true, isOpened: false },
                children: [
                    'sku',
                    'global_unique_id',
                    'manage_stock',
                    'stock_status',
                    'stock_quantity',
                    'low_stock_amount',
                    'backorders',
                    'sold_individually'
                ]
            },
            {
                id: 'shipping',
                label: 'Shipping and Tax',
                description: 'Manage shipping and tax for this product',
                layout: { type: 'card', withHeader: true, isCollapsible: true, isOpened: false },
                children: [
                    '_disable_shipping',
                    {
                        id: 'shipping_dimensions',
                        label: 'Dimensions',
                        layout: { type: 'row' },
                        children: ['weight', 'length', 'width', 'height']
                    },
                    'shipping_class',
                    'tax_status',
                    'tax_class'
                ]
            },
            {
                id: 'downloadable_options',
                label: 'Downloadable Options',
                description: 'Configure your downloadable product settings',
                layout: { type: 'card', withHeader: true, isCollapsible: true, isOpened: false },
                children: ['download_limit', 'download_expiry']
            },
            {
                id: 'discount',
                label: 'Discount Options',
                description: 'Set your discount for this product',
                layout: { type: 'card', withHeader: true, isCollapsible: true, isOpened: false },
                children: ['_is_lot_discount', '_lot_discount_quantity', '_lot_discount_amount']
            },
            {
                id: 'others',
                label: 'Publish & Visibility',
                description: 'Set your extra product options',
                layout: { type: 'card', withHeader: true, isCollapsible: true, isOpened: true },
                children: ['status', 'catalog_visibility', 'purchase_note', 'reviews_allowed']
            }
        ]
    };

    const { validity, isValid } = useFormValidity(product, dokanFields, form);

    return (
        <div className="space-y-4">
            <DataForm<DokanProduct>
                data={product}
                fields={dokanFields}
                form={form}
                validity={validity}
                onChange={(edits) => setProduct((prev) => ({ ...prev, ...edits }))}
            />
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                    {isValid ? 'Ready to publish' : 'Fix the highlighted fields'}
                </span>
                <Button
                    disabled={!isValid}
                    onClick={() => alert(`Saved product:\n${JSON.stringify(product, null, 2)}`)}>
                    Save product
                </Button>
            </div>
        </div>
    );
};

/** Validate fields with the `useFormValidity` hook. The save button stays disabled until the form is valid. */
export const WithValidation: StoryFn = () => {
    const [post, setPost] = useState<SamplePost>({ ...initialPost, title: '', email: '' });

    const validatedFields: DataViewField<SamplePost>[] = fields.map((field) => {
        if (field.id === 'title') {
            return {
                ...field,
                isValid: { required: true }
            };
        }
        if (field.id === 'email') {
            return {
                ...field,
                isValid: {
                    required: true,
                    custom: (item: SamplePost) =>
                        /.+@.+\..+/.test(item.email)
                            ? null
                            : 'Enter a valid email address'
                }
            };
        }
        return field;
    });

    const form: DataFormSchema = {
        layout: { type: 'regular', labelPosition: 'top' },
        fields: ['title', 'email', 'status']
    };

    const { validity, isValid } = useFormValidity(post, validatedFields, form);

    return (
        <div className="space-y-4">
            <DataForm<SamplePost>
                data={post}
                fields={validatedFields}
                form={form}
                validity={validity}
                onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
            />
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                    {isValid ? 'Form is valid' : 'Fix the highlighted fields'}
                </span>
                <Button
                    disabled={!isValid}
                    onClick={() => alert(`Saved: ${JSON.stringify(post, null, 2)}`)}>
                    Save
                </Button>
            </div>
        </div>
    );
};
