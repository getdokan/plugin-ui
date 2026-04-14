import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { SettingsSkeleton } from './settings-skeleton';
import { Settings } from './index';
import type { SettingsElement } from './settings-types';

const meta = {
    title: 'Settings/SettingsSkeleton',
    component: SettingsSkeleton,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof SettingsSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default — standalone skeleton ─────────────────────────────────────────────

export const Default: Story = {};

// ── Compact — narrow container ─────────────────────────────────────────────────

export const Compact: Story = {
    render: () => (
        <div className="max-w-2xl">
            <SettingsSkeleton />
        </div>
    ),
};

// ── Transition — skeleton fades into real Settings ────────────────────────────

const DEMO_SCHEMA: SettingsElement[] = [
    {
        id: 'appearance',
        type: 'page',
        label: 'Appearance',
        icon: 'Paintbrush',
        children: [
            {
                id: 'branding',
                type: 'section',
                label: 'Branding',
                description: 'Customise how your plugin looks.',
                page_id: 'appearance',
                children: [
                    {
                        id: 'app_name',
                        type: 'field',
                        variant: 'text',
                        label: 'App Name',
                        section_id: 'branding',
                        value: 'My App',
                    },
                    {
                        id: 'primary_color',
                        type: 'field',
                        variant: 'color_picker',
                        label: 'Primary Color',
                        section_id: 'branding',
                        value: '#6366f1',
                    },
                ],
            },
        ],
    },
    {
        id: 'notifications',
        type: 'page',
        label: 'Notifications',
        icon: 'Bell',
        children: [
            {
                id: 'push',
                type: 'section',
                label: 'Push Notifications',
                page_id: 'notifications',
                children: [
                    {
                        id: 'enabled',
                        type: 'field',
                        variant: 'switch',
                        label: 'Enable Push Notifications',
                        section_id: 'push',
                        value: true,
                    },
                ],
            },
        ],
    },
];

function TransitionDemo() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 2500);
        return () => clearTimeout(t);
    }, []);

    if (loading) {
        return <SettingsSkeleton />;
    }

    return (
        <Settings
            title="Plugin Settings"
            schema={DEMO_SCHEMA}
            values={{}}
            onChange={() => {}}
            onSave={() => {}}
        />
    );
}

export const LoadingTransition: Story = {
    name: 'Loading → Real Settings (2.5s)',
    render: () => <TransitionDemo />,
    parameters: {
        docs: {
            description: {
                story: 'Skeleton shows for 2.5 s then transitions to the real `<Settings>` component — matches the `loading` prop behaviour.',
            },
        },
    },
};

// ── Via Settings loading prop ──────────────────────────────────────────────────

export const ViaLoadingProp: Story = {
    name: 'Via Settings loading prop',
    render: () => (
        <Settings
            title="Plugin Settings"
            schema={[]}
            values={{}}
            loading={true}
            onChange={() => {}}
        />
    ),
    parameters: {
        docs: {
            description: {
                story: 'Pass `loading={true}` to `<Settings>` — it internally renders `<SettingsSkeleton>` automatically.',
            },
        },
    },
};
