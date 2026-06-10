// ============================================
// Onboarding Component Types
// ============================================
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ReactNode } from 'react';
import type { SettingsElement } from '../settings/settings-types';
import type { ApplyFiltersFunction } from '../settings/settings-context';

export interface OnboardingStep {
    id: string;                 // also the page id inside schema
    label?: string;
    description?: string;
    icon?: string;
    schema: SettingsElement[];  // page subtree: [{id, type:'page'}, sections…, fields…]
    skippable?: boolean;
    completed?: boolean;
}

export interface StepIndicatorRenderProps {
    steps: Array<{ id: string; label?: string; completed?: boolean; active: boolean; index: number; }>;
    orientation: 'horizontal' | 'vertical';
    onStepClick: (stepId: string) => void;
}

export interface StepFooterRenderProps {
    activeStepId: string;
    isFirst: boolean;
    isLast: boolean;
    skippable: boolean;
    dirty: boolean;
    hasErrors: boolean;
    onBack: () => void;
    onSkip: () => void;
    onNext: () => void | Promise<void>;   // saves current step, then advances
    onFinish: () => void | Promise<void>; // saves last step, then completes
}

export interface OnboardingProps {
    steps: OnboardingStep[];
    values?: Record<string, any>;
    activeStepId?: string;                              // controlled; falls back to first step
    orientation?: 'horizontal' | 'vertical';           // default 'horizontal'
    hookPrefix?: string;                                // default 'plugin_ui'
    applyFilters?: ApplyFiltersFunction;
    loading?: boolean;
    className?: string;
    onChange?: (stepId: string, key: string, value: any) => void;
    onStepSave?: (stepId: string, treeValues: Record<string, any>, flatValues: Record<string, any>) => void | Promise<void>;
    onStepChange?: (stepId: string) => void;
    onSkip?: (stepId: string) => void;
    onComplete?: () => void;
    renderStepIndicator?: (props: StepIndicatorRenderProps) => ReactNode;
    renderFooter?: (props: StepFooterRenderProps) => ReactNode;
}
