import { Button } from '../ui/button';
import type { StepFooterRenderProps } from './onboarding-types';

export function StepFooter({
    isFirst, isLast, skippable, hasErrors, onBack, onSkip, onNext, onFinish,
}: StepFooterRenderProps) {
    return (
        <div
            data-testid="onboarding-step-footer"
            className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-border bg-background px-6 py-3"
        >
            <div>
                {!isFirst && (
                    <Button variant="ghost" onClick={onBack} data-testid="onboarding-back">
                        Back
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2">
                {skippable && !isLast && (
                    <Button variant="outline" onClick={onSkip} data-testid="onboarding-skip">
                        Skip
                    </Button>
                )}
                {isLast ? (
                    <Button onClick={onFinish} disabled={hasErrors} data-testid="onboarding-finish">
                        Finish
                    </Button>
                ) : (
                    <Button onClick={onNext} disabled={hasErrors} data-testid="onboarding-next">
                        Continue
                    </Button>
                )}
            </div>
        </div>
    );
}
