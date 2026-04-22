import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Settings } from './index';
import type { SettingsElement, SettingsProps } from './settings-types';

// ============================================
// Texty Settings — SMS gateway picker
// Each gateway is a top-level page so it appears
// as an individual menu item in the sidebar.
// ============================================

type TextyGateway = {
    id: string;
    label: string;
    icon: string;
    fromHelper: string;
};

const textyGateways: TextyGateway[] = [
    { id: 'clicksend', label: 'ClickSend', icon: 'MessageSquare', fromHelper: 'Must be a valid number associated with your ClickSend account' },
    { id: 'clickatell', label: 'Clickatell', icon: 'MessageCircle', fromHelper: 'Must be a valid number associated with your Clickatell account' },
    { id: 'twilio', label: 'Twilio', icon: 'Phone', fromHelper: 'Must be a valid number associated with your Twilio account' },
    { id: 'bird', label: 'Bird (formerly MessageBird)', icon: 'Bird', fromHelper: 'Must be a valid number associated with your Bird account' },
    { id: 'vonage', label: 'Vonage (formerly Nexmo)', icon: 'Phone', fromHelper: 'Must be a valid number associated with your Vonage account' },
    { id: 'bulksms', label: 'BulkSMS.com', icon: 'Send', fromHelper: 'Must be a valid number associated with your BulkSMS account' },
    { id: 'plivo', label: 'Plivo', icon: 'Radio', fromHelper: 'Must be a valid number associated with your Plivo account' },
    { id: 'sinch', label: 'Sinch', icon: 'Signal', fromHelper: 'Must be a valid number associated with your Sinch account' },
    { id: 'infobip', label: 'Infobip', icon: 'Inbox', fromHelper: 'Must be a valid number associated with your Infobip account' },
    { id: 'amazon_sns', label: 'Amazon SNS', icon: 'Cloud', fromHelper: 'Must be a valid number associated with your Amazon SNS account' },
    { id: 'msg91', label: 'Msg91', icon: 'MessageSquare', fromHelper: 'Must be a valid number associated with your Msg91 account' },
    { id: 'textlocal', label: 'TextLocal', icon: 'MessageSquareText', fromHelper: 'Must be a valid number associated with your TextLocal account' },
    { id: 'fast2sms', label: 'Fast2SMS', icon: 'Zap', fromHelper: 'Must be a valid number associated with your Fast2SMS account' },
    { id: 'sms_net_bd', label: 'SMS.NET.BD', icon: 'Send', fromHelper: 'Must be a valid number associated with your SMS.NET.BD account' },
    { id: 'thaibulksms', label: 'ThaiBulkSMS', icon: 'Send', fromHelper: 'Must be a valid number associated with your ThaiBulkSMS account' },
    { id: 'isms', label: 'iSMS', icon: 'MessageSquare', fromHelper: 'Must be a valid number associated with your iSMS account' },
    { id: 'semaphore', label: 'Semaphore', icon: 'Flag', fromHelper: 'Must be a valid number associated with your Semaphore account' },
];

function buildGatewayPage(gateway: TextyGateway, priority: number): SettingsElement {
    const keyPrefix = `texty.${gateway.id}`;
    return {
        id: gateway.id,
        type: 'page',
        label: gateway.label,
        description: 'Manage your API credentials',
        icon: gateway.icon,
        priority,
        doc_link: `https://example.com/${gateway.id}/signup`,
        doc_link_text: 'Get your account',
        children: [
            {
                id: `${gateway.id}_credentials`,
                type: 'section',
                label: '',
                page_id: gateway.id,
                priority: 10,
                children: [
                    {
                        id: `${gateway.id}_account_sid`,
                        type: 'field',
                        variant: 'text',
                        label: 'Account SID',
                        layout: 'full-width',
                        dependency_key: `${keyPrefix}.account_sid`,
                        placeholder: 'Write here SID',
                        section_id: `${gateway.id}_credentials`,
                        priority: 10,
                    },
                    {
                        id: `${gateway.id}_auth_token`,
                        type: 'field',
                        variant: 'show_hide',
                        label: 'Auth Token',
                        layout: 'full-width',
                        dependency_key: `${keyPrefix}.auth_token`,
                        placeholder: 'Write here Auth Token',
                        section_id: `${gateway.id}_credentials`,
                        priority: 20,
                    },
                    {
                        id: `${gateway.id}_from_number`,
                        type: 'field',
                        variant: 'text',
                        label: 'From Number',
                        layout: 'full-width',
                        dependency_key: `${keyPrefix}.from_number`,
                        description: gateway.fromHelper,
                        placeholder: '+880 17855',
                        section_id: `${gateway.id}_credentials`,
                        priority: 30,
                    },
                ],
            },
            {
                id: `${gateway.id}_sender_options`,
                type: 'section',
                label: 'Sender Options',
                page_id: gateway.id,
                priority: 20,
                children: [
                    {
                        id: `${gateway.id}_sender_name`,
                        type: 'field',
                        variant: 'text',
                        label: 'Sender Name (Brand)',
                        layout: 'full-width',
                        dependency_key: `${keyPrefix}.sender_name`,
                        description: 'Alphanumeric sender ID (where supported)',
                        placeholder: 'Write here',
                        section_id: `${gateway.id}_sender_options`,
                        priority: 10,
                    },
                    {
                        id: `${gateway.id}_callback_url`,
                        type: 'field',
                        variant: 'copy_field',
                        label: 'Status Callback URL',
                        layout: 'full-width',
                        dependency_key: `${keyPrefix}.callback_url`,
                        default: `https://mysite.com/wp-json/texty/v1/callback/${gateway.id}`,
                        description: 'Read-only webhook URL',
                        section_id: `${gateway.id}_sender_options`,
                        priority: 20,
                    },
                ],
            },
        ],
    } as SettingsElement;
}

const textySchema: SettingsElement[] = textyGateways.map((gateway, index) =>
    buildGatewayPage(gateway, (index + 1) * 10)
);

function TextyWrapper(args: SettingsProps) {
    const [values, setValues] = useState<Record<string, unknown>>({
        'texty.clicksend.from_number': '+880 17855',
    });

    return (
        <div className="h-screen flex flex-col">
            <Settings
                {...args}
                className="flex-1"
                values={values}
                onChange={(_scopeId, key, value) => {
                    setValues((prev) => ({ ...prev, [key]: value }));
                }}
                onSave={async () => {
                    /* noop in story */
                }}
                renderSaveButton={({ dirty, hasErrors, onSave: triggerSave }) => (
                    <Button onClick={triggerSave} disabled={!dirty || hasErrors}>
                        Connect
                    </Button>
                )}
            />
        </div>
    );
}

const meta = {
    title: 'Components/Settings/Texty',
    component: Settings,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Texty SMS gateway settings — each gateway is registered as a top-level page so the sidebar lists them as individual menu items, mirroring the "Available Gateways" picker pattern.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        schema: { control: false },
        values: { control: false },
    },
} satisfies Meta<typeof Settings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextySettings: Story = {
    args: {
        schema: textySchema,
        title: 'Available Gateways',
        hookPrefix: 'texty',
    },
    render: (args) => <TextyWrapper {...args} />,
};
