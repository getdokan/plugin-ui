import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from './menu-primitives';

export interface AvatarWorkspaceOption {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  onSelect?: () => void;
  disabled?: boolean;
  separatorBefore?: boolean;
}

export interface AvatarWorkspaceSelectorProps {
  /** User/workspace options (Settings, Profile, Billing, Log out, etc.) */
  options: AvatarWorkspaceOption[];
  /** Trigger: avatar image or element */
  trigger: ReactNode;
  /** Controlled open */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Content alignment */
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  triggerClassName?: string;
  contentClassName?: string;
}

/**
 * Avatar / workspace selector: trigger is an avatar (or custom element), content is a list of options with optional icons and shortcuts.
 * Composes DropdownRoot + Menu-style list; state is external.
 */
export function AvatarWorkspaceSelector({
  options,
  trigger,
  open,
  onOpenChange,
  align = 'end',
  side = 'bottom',
  triggerClassName,
  contentClassName,
}: AvatarWorkspaceSelectorProps) {
  return (
    <MenuRoot open={open} onOpenChange={onOpenChange}>
      <MenuTrigger
        className={cn(
          'rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          triggerClassName
        )}
        aria-label="Open account menu"
      >
        {trigger}
      </MenuTrigger>
      <MenuContent
        align={align}
        side={side}
        sideOffset={8}
        className={cn('min-w-48', contentClassName)}
      >
        {options.map((opt) => (
          <span key={opt.id}>
            {opt.separatorBefore && <MenuSeparator />}
            <MenuItem
              disabled={opt.disabled}
              onClick={opt.onSelect}
              className="gap-2"
            >
              {opt.icon != null && (
                <span className="size-4 shrink-0" aria-hidden>
                  {opt.icon}
                </span>
              )}
              <span className="flex-1">{opt.label}</span>
              {opt.shortcut != null && (
                <span className="text-xs text-muted-foreground">
                  {opt.shortcut}
                </span>
              )}
            </MenuItem>
          </span>
        ))}
      </MenuContent>
    </MenuRoot>
  );
}

AvatarWorkspaceSelector.displayName = 'AvatarWorkspaceSelector';
