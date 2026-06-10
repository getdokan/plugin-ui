import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { SettingsProvider, useSettings } from '../settings/settings-context';
import type { SettingsElement } from '../settings/settings-types';
import { StepIndicator } from './step-indicator';
import { StepFooter } from './step-footer';
import { StepBody } from './step-body';
import { isFirstStep, isLastStep, nextStepId, prevStepId } from './onboarding-navigation';
import type { OnboardingProps } from './onboarding-types';

export function Onboarding({
    steps,
    values,
    activeStepId,
    orientation = 'horizontal',
    hookPrefix = 'plugin_ui',
    applyFilters,
    loading = false,
    className,
    onChange,
    onStepSave,
    onStepChange,
    onSkip,
    onComplete,
    renderStepIndicator,
    renderFooter,
}: OnboardingProps) {
    const [internalActive, setInternalActive] = useState<string>(activeStepId ?? steps[0]?.id ?? '');
    const active = activeStepId ?? internalActive;

    // Merge every step's page subtree into one schema; force hide_save on each
    // page so SettingsContent suppresses its own save button (footer owns it).
    const schema = useMemo<SettingsElement[]>(() => {
        const out: SettingsElement[] = [];
        for (const step of steps) {
            for (const el of step.schema) {
                if (el.type === 'page' && el.id === step.id) {
                    out.push({ ...el, hide_save: true });
                } else {
                    out.push(el);
                }
            }
        }
        return out;
    }, [steps]);

    const goTo = (id: string) => {
        if (activeStepId === undefined) setInternalActive(id);
        onStepChange?.(id);
    };

    return (
        <SettingsProvider
            schema={schema}
            values={values}
            onChange={onChange ? (scopeId, key, value) => onChange(scopeId, key, value) : undefined}
            onSave={onStepSave}
            loading={loading}
            hookPrefix={hookPrefix}
            applyFilters={applyFilters}
            initialPage={active}
        >
            <OnboardingInner
                steps={steps}
                active={active}
                orientation={orientation}
                className={className}
                goTo={goTo}
                onSkip={onSkip}
                onComplete={onComplete}
                renderStepIndicator={renderStepIndicator}
                renderFooter={renderFooter}
            />
        </SettingsProvider>
    );
}

function OnboardingInner({
    steps, active, orientation, className, goTo, onSkip, onComplete, renderStepIndicator, renderFooter,
}: {
    steps: OnboardingProps['steps'];
    active: string;
    orientation: 'horizontal' | 'vertical';
    className?: string;
    goTo: (id: string) => void;
    onSkip?: OnboardingProps['onSkip'];
    onComplete?: OnboardingProps['onComplete'];
    renderStepIndicator?: OnboardingProps['renderStepIndicator'];
    renderFooter?: OnboardingProps['renderFooter'];
}) {
    const { setActivePage, getPageValues, isPageDirty, hasScopeErrors, save } = useSettings();

    const activeStep = steps.find((s) => s.id === active) ?? steps[0];
    const isFirst = isFirstStep(steps, active);
    const isLast = isLastStep(steps, active);

    const navigate = (id: string | null) => {
        if (!id) return;
        setActivePage(id);
        goTo(id);
    };

    const persist = () => {
        if (hasScopeErrors(active) || !save) return;
        save(active, getPageValues(active)); // routes to onStepSave(stepId, tree, flat)
    };

    const indicatorProps = {
        steps: steps.map((s, index) => ({
            id: s.id, label: s.label, completed: Boolean(s.completed), active: s.id === active, index,
        })),
        orientation,
        onStepClick: (id: string) => navigate(id),
    };

    const footerProps = {
        activeStepId: active,
        isFirst,
        isLast,
        skippable: Boolean(activeStep?.skippable),
        dirty: isPageDirty(active),
        hasErrors: hasScopeErrors(active),
        onBack: () => navigate(prevStepId(steps, active)),
        onSkip: () => { onSkip?.(active); navigate(nextStepId(steps, active)); },
        onNext: () => { persist(); navigate(nextStepId(steps, active)); },
        onFinish: () => { persist(); onComplete?.(); },
    };

    const horizontal = orientation === 'horizontal';

    return (
        <div
            data-testid="onboarding-root"
            className={cn('rounded-lg border border-border bg-background overflow-hidden', horizontal ? 'flex flex-col' : 'flex flex-row', className)}
        >
            {renderStepIndicator ? renderStepIndicator(indicatorProps) : <StepIndicator {...indicatorProps} />}
            <div className="flex flex-1 min-w-0 flex-col">
                <StepBody />
                {renderFooter ? renderFooter(footerProps) : <StepFooter {...footerProps} />}
            </div>
        </div>
    );
}

export type { OnboardingProps, OnboardingStep } from './onboarding-types';
