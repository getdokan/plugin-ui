import { SettingsContent } from '../settings/settings-content';
import { cn } from '@/lib/utils';

export function StepBody({ className }: { className?: string }) {
    return <SettingsContent className={cn('flex-1', className)} />;
}
