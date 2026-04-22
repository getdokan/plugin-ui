/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { ArrowUpRight, CircleCheck, Search } from 'lucide-react';
import { RawHTML } from '@wordpress/element';

import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { ScrollArea } from '../ui/scroll-area';

import { FieldRenderer } from './field-renderer';
import { SettingsProvider, useSettings } from './settings-context';
import type { SettingsElement } from './settings-types';

function GatewaysHeader({ source }: { source: SettingsElement }) {
    const label = source.label;
    const Icon = source.icon
        ? ((LucideIcons as any)[source.icon] as React.ElementType | undefined)
        : undefined;

    return (
        <div className="px-6 pt-6 pb-5 flex items-start gap-3">
            {Icon && (
                <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="size-5" />
                </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                {label && (
                    <h2 className="text-lg font-semibold text-foreground leading-tight">
                        <RawHTML>{label}</RawHTML>
                    </h2>
                )}
                {(source.description || source.doc_link) && (
                    <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-1 gap-y-0.5">
                        {source.description && (
                            <span>
                                <RawHTML>{source.description}</RawHTML>
                            </span>
                        )}
                        {source.description && source.doc_link && <span>Or</span>}
                        {source.doc_link && (
                            <a
                                href={source.doc_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline inline-flex items-center gap-0.5">
                                <RawHTML>{source.doc_link_text || 'Learn more'}</RawHTML>
                                <ArrowUpRight className="size-3.5" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function GatewaysSection({
    section,
    isFirst = false
}: {
    section: SettingsElement;
    isFirst?: boolean;
}) {
    const sectionLabel = section.label || section.title || '';
    const hasHeading = Boolean(sectionLabel || section.description);

    return (
        <section className={cn(!isFirst && 'border-t border-border')}>
            {hasHeading && (
                <div className="px-6 pt-5 pb-2">
                    {sectionLabel && (
                        <h3 className="text-sm font-semibold text-foreground">
                            <RawHTML>{sectionLabel}</RawHTML>
                        </h3>
                    )}
                    {section.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            <RawHTML>{section.description}</RawHTML>
                        </p>
                    )}
                </div>
            )}

            <div className="px-2">
                {section.children?.map((child) => <FieldRenderer key={child.id} element={child} />)}
            </div>
        </section>
    );
}

// ============================================
// Schema — Texty SMS gateways
// ============================================

type TextyGateway = {
    id: string;
    label: string;
    icon: string;
    fromHelper: string;
};

const textyGateways: TextyGateway[] = [
    {
        id: 'clicksend',
        label: 'ClickSend',
        icon: 'MessageSquare',
        fromHelper: 'Must be a valid number associated with your ClickSend account'
    },
    {
        id: 'clickatell',
        label: 'Clickatell',
        icon: 'MessageCircle',
        fromHelper: 'Must be a valid number associated with your Clickatell account'
    },
    {
        id: 'twilio',
        label: 'Twilio',
        icon: 'Phone',
        fromHelper: 'Must be a valid number associated with your Twilio account'
    },
    {
        id: 'bird',
        label: 'Bird (formerly MessageBird)',
        icon: 'Bird',
        fromHelper: 'Must be a valid number associated with your Bird account'
    },
    {
        id: 'vonage',
        label: 'Vonage (formerly Nexmo)',
        icon: 'Phone',
        fromHelper: 'Must be a valid number associated with your Vonage account'
    },
    {
        id: 'bulksms',
        label: 'BulkSMS.com',
        icon: 'Send',
        fromHelper: 'Must be a valid number associated with your BulkSMS account'
    },
    {
        id: 'plivo',
        label: 'Plivo',
        icon: 'Radio',
        fromHelper: 'Must be a valid number associated with your Plivo account'
    },
    {
        id: 'sinch',
        label: 'Sinch',
        icon: 'Signal',
        fromHelper: 'Must be a valid number associated with your Sinch account'
    },
    {
        id: 'infobip',
        label: 'Infobip',
        icon: 'Inbox',
        fromHelper: 'Must be a valid number associated with your Infobip account'
    },
    {
        id: 'amazon_sns',
        label: 'Amazon SNS',
        icon: 'Cloud',
        fromHelper: 'Must be a valid number associated with your Amazon SNS account'
    },
    {
        id: 'msg91',
        label: 'Msg91',
        icon: 'MessageSquare',
        fromHelper: 'Must be a valid number associated with your Msg91 account'
    },
    {
        id: 'textlocal',
        label: 'TextLocal',
        icon: 'MessageSquareText',
        fromHelper: 'Must be a valid number associated with your TextLocal account'
    },
    {
        id: 'fast2sms',
        label: 'Fast2SMS',
        icon: 'Zap',
        fromHelper: 'Must be a valid number associated with your Fast2SMS account'
    },
    {
        id: 'sms_net_bd',
        label: 'SMS.NET.BD',
        icon: 'Send',
        fromHelper: 'Must be a valid number associated with your SMS.NET.BD account'
    },
    {
        id: 'thaibulksms',
        label: 'ThaiBulkSMS',
        icon: 'Send',
        fromHelper: 'Must be a valid number associated with your ThaiBulkSMS account'
    },
    {
        id: 'isms',
        label: 'iSMS',
        icon: 'MessageSquare',
        fromHelper: 'Must be a valid number associated with your iSMS account'
    },
    {
        id: 'semaphore',
        label: 'Semaphore',
        icon: 'Flag',
        fromHelper: 'Must be a valid number associated with your Semaphore account'
    }
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
                        variant: 'copy_field',
                        label: 'Account SID',
                        layout: 'full-width',
                        dependency_key: `${keyPrefix}.account_sid`,
                        placeholder: 'Write here SID',
                        section_id: `${gateway.id}_credentials`,
                        priority: 10
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
                        priority: 20
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
                        priority: 30
                    }
                ]
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
                        priority: 10
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
                        priority: 20
                    }
                ]
            }
        ]
    } as SettingsElement;
}

const textySchema: SettingsElement[] = textyGateways.map((gateway, index) =>
    buildGatewayPage(gateway, (index + 1) * 10)
);

// ============================================
// A gateway is "connected" when its Account SID
// has been saved. Drives the green check in the
// sidebar and the Connected pill + Disconnect
// button in the detail pane.
// ============================================

function isGatewayConnected(gatewayId: string, values: Record<string, any>): boolean {
    return Boolean(values[`texty.${gatewayId}.account_sid`]);
}

// ============================================
// Sidebar — flat list with trailing green check
// for gateways that have saved credentials.
// ============================================

function TextySidebar() {
    const { schema, activePage, setActivePage, values } = useSettings();
    const [search, setSearch] = useState('');

    const items = useMemo(() => schema.filter((p) => p.display !== false), [schema]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter((p) => (p.label || p.id).toLowerCase().includes(q));
    }, [items, search]);

    return (
        <aside className="w-full md:w-64 md:shrink-0 rounded-lg border border-border bg-background flex flex-col overflow-hidden">
            <div className="px-4 pt-4">
                <h2 className="text-sm font-semibold text-foreground">Available Gateways</h2>
            </div>
            <div className="px-3 pt-3 pb-2">
                <InputGroup className="h-8">
                    <InputGroupAddon>
                        <Search className="text-muted-foreground size-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search"
                        aria-label="Search gateways"
                    />
                </InputGroup>
            </div>
            <ScrollArea className="flex-1">
                <nav className="flex flex-col gap-0.5 px-2 pb-3">
                    {filtered.map((page) => {
                        const active = activePage === page.id;
                        const connected = isGatewayConnected(page.id, values);
                        return (
                            <Button
                                key={page.id}
                                variant="ghost"
                                onClick={() => setActivePage(page.id)}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'w-full justify-between font-normal text-foreground/80',
                                    active &&
                                        'bg-muted font-semibold text-foreground hover:bg-muted'
                                )}>
                                <span className="truncate">
                                    <RawHTML>{page.label || page.id}</RawHTML>
                                </span>
                                {connected && (
                                    <CircleCheck
                                        className="size-4 shrink-0 text-emerald-600 fill-emerald-100"
                                        aria-label="Connected"
                                    />
                                )}
                            </Button>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="px-3 py-4 text-sm text-muted-foreground">No matches</div>
                    )}
                </nav>
            </ScrollArea>
        </aside>
    );
}

// ============================================
// Detail pane — custom JSX composed from the local
// helpers + FieldRenderer + useSettings().
// ============================================

function TextyDetailPane() {
    const {
        activePage,
        activeSubpage,
        getActiveContentSource,
        getActiveContent,
        isPageDirty,
        hasScopeErrors,
        getPageValues,
        values,
        save,
        updateValue
    } = useSettings();

    const source = getActiveContentSource();
    const content = getActiveContent();
    const scopeId = activeSubpage || activePage;
    const hasErrors = hasScopeErrors(scopeId);
    const dirty = isPageDirty(scopeId);

    if (!source) {
        return <div className="flex-1 rounded-lg border border-border bg-background" />;
    }

    const connected = isGatewayConnected(source.id, values);

    const handleActivate = () => {
        if (!save || hasErrors) return;
        save(scopeId, getPageValues(scopeId));
    };

    const handleDisconnect = () => {
        [
            `texty.${source.id}.account_sid`,
            `texty.${source.id}.auth_token`,
            `texty.${source.id}.from_number`,
            `texty.${source.id}.sender_name`
        ].forEach((key) => updateValue(key, ''));
    };

    return (
        <div className="flex-1 min-w-0 rounded-lg border border-border bg-background flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 flex flex-col overflow-y-auto">
                <div className="flex-1">
                    <div className="relative">
                        <GatewaysHeader source={source} />
                        {connected && (
                            <Badge variant="success" className="absolute top-6 right-6">
                                Connected
                            </Badge>
                        )}
                    </div>

                    {content.map((item, idx) =>
                        item.type === 'section' ? (
                            <GatewaysSection key={item.id} section={item} isFirst={idx === 0} />
                        ) : null
                    )}
                </div>

                {save && !source.hide_save && (
                    <div className="sticky bottom-0 border-t border-border bg-background px-6 py-3 flex justify-end gap-2">
                        {connected ? (
                            <>
                                <Button variant="outline" onClick={handleDisconnect}>
                                    Disconnect
                                </Button>
                                <Button onClick={handleActivate} disabled={hasErrors || !dirty}>
                                    Activate
                                </Button>
                            </>
                        ) : (
                            <Button onClick={handleActivate} disabled={!dirty || hasErrors}>
                                Connect
                            </Button>
                        )}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

// ============================================
// Story root — owns state, mounts provider + shell
// ============================================

function TextyStory() {
    const [values, setValues] = useState<Record<string, unknown>>({
        // ClickSend seeded as a connected gateway to demonstrate the
        // "Connected" pill, sidebar check, and Disconnect/Activate footer.
        'texty.clicksend.account_sid': 'AC1234567890abcdef12345678907',
        'texty.clicksend.auth_token': '******************************',
        'texty.clicksend.from_number': '01785558678',
        'texty.clicksend.sender_name': 'Apex Footwear Ltd.'
    });

    return (
        <div className="min-h-screen flex flex-col bg-muted/40">
            <SettingsProvider
                schema={textySchema}
                values={values}
                onChange={(_scopeId, key, value) =>
                    setValues((prev) => ({ ...prev, [key]: value }))
                }
                onSave={async () => {
                    /* noop in story */
                }}
                hookPrefix="texty">
                <div className="flex flex-col md:flex-row gap-4 p-4 flex-1">
                    <TextySidebar />
                    <TextyDetailPane />
                </div>
            </SettingsProvider>
        </div>
    );
}

const meta = {
    title: 'Components/Settings/Texty',
    component: TextyStory,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Texty SMS gateway settings — the entire builder is composed in this story file from generic package primitives (`SettingsProvider`, `SettingsShell`, `FieldRenderer`, `useSettings`). The compact header and flat-section helpers live locally at the top of the file as reference implementations.'
            }
        }
    },
    tags: ['autodocs']
} satisfies Meta<typeof TextyStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Settings: Story = {};
