import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { StepIndicatorRenderProps } from './onboarding-types';

export function StepIndicator({ steps, orientation, onStepClick }: StepIndicatorRenderProps) {
    const horizontal = orientation === 'horizontal';
    return (
        <ol
            data-testid="onboarding-step-indicator"
            className={cn(
                'flex gap-2',
                horizontal ? 'flex-row items-center justify-center flex-wrap p-4' : 'flex-col p-4 w-56 shrink-0'
            )}
        >
            {steps.map((step) => (
                <li key={step.id} className={cn('flex items-center gap-3', horizontal ? '' : 'w-full')}>
                    <button
                        type="button"
                        onClick={() => onStepClick(step.id)}
                        data-testid={`onboarding-step-${step.id}`}
                        aria-current={step.active ? 'step' : undefined}
                        className={cn(
                            'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors w-full text-left',
                            step.active ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/40'
                        )}
                    >
                        <span
                            className={cn(
                                'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs',
                                step.completed ? 'border-primary bg-primary text-primary-foreground'
                                    : step.active ? 'border-primary text-primary' : 'border-border'
                            )}
                        >
                            {step.completed ? <Check className="size-3.5" /> : step.index + 1}
                        </span>
                        {step.label && <span className="truncate">{step.label}</span>}
                    </button>
                </li>
            ))}
        </ol>
    );
}
