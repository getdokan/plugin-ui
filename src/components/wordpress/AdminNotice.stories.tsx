import type { Meta, StoryObj } from '@storybook/react';
import AdminNotice, { Notice } from './AdminNotice';

const meta = {
    title: 'WordPress/AdminNotice',
    component: AdminNotice,
    parameters: {
        layout: 'padded'
    },
    tags: ['autodocs']
} satisfies Meta<typeof AdminNotice>;

export default meta;

type Story = StoryObj<typeof meta>;

const DEFAULT_STATIC_NOTICES: Notice[] = [
    {
        type: 'primary',
        title: 'Try the New Product Form Experience',
        logo: 'https://placehold.co/128x128/e2e8f0/475569?text=Notice',
        logo_alt: 'WordPress logo',
        description: 'A redesigned product editor is now available with faster workflows and clearer controls.',
        actions: [
            {
                type: 'primary',
                text: 'Explore Features',
                action: 'http://localhost:6006/?path=/docs/wordpress-adminnotice--docs',
                target: '_self'
            }
        ]
    },
    {
        type: 'warning',
        title: 'Review Your Marketplace Settings',
        logo: 'https://placehold.co/128x128/e2e8f0/475569?text=Notice',
        logo_alt: 'WooCommerce logo',
        description: 'Double-check commission and withdrawal rules to keep your store operations smooth.',
        actions: [
            {
                type: 'secondary',
                text: 'Dismiss',
                loading_text: 'Dismissing...',
                completed_text: 'Dismissed',
                ajax_data: {
                    action: 'dismiss_static_notice',
                    nonce: 'static-notice'
                }
            }
        ]
    },
    {
        type: 'success',
        title: 'Great Job!',
        logo: 'https://placehold.co/128x128/e2e8f0/475569?text=Notice',
        logo_alt: 'Dokan logo',
        description: 'Your dashboard is configured and ready for day-to-day management.',
        actions: [
            {
                type: 'secondary',
                text: 'Hide',
                loading_text: 'Hiding...',
                completed_text: 'Hidden',
                ajax_data: {
                    action: 'hide_static_notice',
                    nonce: 'static-notice'
                },
                confirm_message: 'Do you want to hide this notice?'
            }
        ]
    }
];

const actionUrl = 'https://dokan.test/wp-admin/admin-ajax.php';

export const Default: Story = {
    render: () => <AdminNotice interval={4000} notices={DEFAULT_STATIC_NOTICES} actionUrl={actionUrl} />
};

export const AutoSlideDisabled: Story = {
    render: () => <AdminNotice interval={999999} notices={DEFAULT_STATIC_NOTICES} actionUrl={actionUrl} />
};
