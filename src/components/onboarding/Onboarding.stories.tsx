import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { Onboarding } from './index';
import type { SettingsElement } from '../settings/settings-types';

const stepSchema = (pageId: string, fieldId: string, label: string): SettingsElement[] => [
    { id: pageId, type: 'page', label },
    { id: `${pageId}_section`, type: 'section', page_id: pageId, label },
    {
        id: fieldId, type: 'field', variant: 'switch', section_id: `${pageId}_section`,
        label: `${label} toggle`, default: 'on',
        enable_state: { value: 'on', title: 'Enabled' }, disable_state: { value: 'off', title: 'Disabled' },
    } as SettingsElement,
];

const steps = [
    { id: 'basic', label: 'Basic', schema: stepSchema('basic', 'basic_toggle', 'Basic'), skippable: false, completed: true },
    { id: 'commission', label: 'Commission', schema: stepSchema('commission', 'commission_toggle', 'Commission'), skippable: true },
    { id: 'withdraw', label: 'Withdraw', schema: stepSchema('withdraw', 'withdraw_toggle', 'Withdraw'), skippable: true },
];

const meta = {
    title: 'Components/Onboarding',
    component: Onboarding,
    parameters: { layout: 'fullscreen' },
    tags: ['autodocs'],
    args: {
        onStepSave: fn(),
    },
} satisfies Meta<typeof Onboarding>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
    args: { steps, orientation: 'horizontal' },
};

export const Vertical: Story = {
    args: { steps, orientation: 'vertical' },
};

export const CustomIndicator: Story = {
    args: {
        steps,
        orientation: 'horizontal',
        renderStepIndicator: ({ steps: s, onStepClick }) => (
            <div className="flex gap-4 p-4">
                {s.map((step) => (
                    <button key={step.id} onClick={() => onStepClick(step.id)} className={step.active ? 'font-bold underline' : ''}>
                        {step.label}
                    </button>
                ))}
            </div>
        ),
    },
};
