import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { DropdownContent } from './dropdown-content';
import { DropdownRoot } from './dropdown-root';
import { DropdownTrigger } from './dropdown-trigger';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectDropdownProps {
  /** All options */
  options: MultiSelectOption[];
  /** Selected values (controlled from outside) */
  value: string[];
  /** Called when selection changes */
  onValueChange?: (value: string[]) => void;
  /** Placeholder when no selection */
  placeholder?: string;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Controlled open */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Max height of option list */
  maxListHeight?: number;
  contentClassName?: string;
}

/**
 * Multi-select dropdown with tags: selected items shown as removable tags in the trigger; search filters the list.
 * State (value, open) is managed externally.
 */
export function MultiSelectDropdown({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Find an item',
  open,
  onOpenChange,
  maxListHeight = 300,
  contentClassName,
}: MultiSelectDropdownProps) {
  const [search, setSearch] = useState('');

  const selectedOptions = useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const toggle = useCallback(
    (optionValue: string) => {
      const next = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onValueChange?.(next);
    },
    [value, onValueChange]
  );

  const remove = useCallback(
    (e: React.MouseEvent, optionValue: string) => {
      e.stopPropagation();
      onValueChange?.(value.filter((v) => v !== optionValue));
    },
    [value, onValueChange]
  );

  return (
    <DropdownRoot open={open} onOpenChange={onOpenChange}>
      <DropdownTrigger className="flex min-h-9 min-w-40 flex-wrap items-center gap-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm">
        {selectedOptions.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          selectedOptions.map((opt) => (
            <Badge
              key={opt.value}
              variant="secondary"
              className="gap-0.5 py-0 pr-1 font-normal"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => remove(e, opt.value)}
                className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                aria-label={`Remove ${opt.label}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))
        )}
      </DropdownTrigger>
      <DropdownContent
        className={cn('min-w-56 p-0', contentClassName)}
        align="start"
      >
        <div className="flex items-center border-b border-border px-2">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
            autoFocus
          />
        </div>
        <div className="overflow-auto p-1" style={{ maxHeight: maxListHeight }}>
          {filteredOptions.map((opt) => {
            const checked = value.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={cn(
                  'relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none',
                  'hover:bg-accent hover:text-accent-foreground',
                  checked && 'bg-accent text-accent-foreground'
                )}
                onClick={() => toggle(opt.value)}
              >
                <span
                  className={cn(
                    'mr-2 flex size-4 items-center justify-center rounded border border-primary',
                    checked
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background'
                  )}
                >
                  {checked ? (
                    <svg
                      className="size-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : null}
                </span>
                {opt.label}
              </button>
            );
          })}
          {filteredOptions.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results.
            </div>
          )}
        </div>
      </DropdownContent>
    </DropdownRoot>
  );
}

MultiSelectDropdown.displayName = 'MultiSelectDropdown';
