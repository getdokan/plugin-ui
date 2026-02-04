import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { DropdownContent } from './dropdown-content';
import { DropdownRoot } from './dropdown-root';
import { DropdownTrigger } from './dropdown-trigger';

export interface SearchableDropdownOption {
  /** Unique value */
  value: string;
  /** Display label */
  label: string;
  /** Optional group/category for display */
  group?: string;
}

export interface SearchableDropdownProps {
  /** All options (can be grouped by option.group) */
  options: SearchableDropdownOption[];
  /** Selected value (single select); controlled from outside */
  value?: string | null;
  /** Called when selection changes */
  onValueChange?: (value: string | null) => void;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Placeholder for trigger when nothing selected */
  triggerPlaceholder?: string;
  /** Render trigger (receives selected option or null) */
  trigger?: (selected: SearchableDropdownOption | null) => React.ReactNode;
  /** Controlled open */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Min width of content panel */
  contentClassName?: string;
}

/**
 * Searchable dropdown (Command-style): filter list by typing.
 * State (value, open) is managed externally via props.
 */
export function SearchableDropdown({
  options,
  value,
  onValueChange,
  searchPlaceholder = 'Find an item',
  triggerPlaceholder = 'Select...',
  trigger,
  open,
  onOpenChange,
  contentClassName,
}: SearchableDropdownProps) {
  const [search, setSearch] = useState('');

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.group != null && o.group.toLowerCase().includes(q))
    );
  }, [options, search]);

  const handleSelect = useCallback(
    (option: SearchableDropdownOption) => {
      onValueChange?.(option.value);
      onOpenChange?.(false);
      setSearch('');
    },
    [onValueChange, onOpenChange]
  );

  const groups = useMemo(() => {
    const map = new Map<string, SearchableDropdownOption[]>();
    for (const o of filteredOptions) {
      const key = o.group ?? '';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(o);
    }
    return Array.from(map.entries());
  }, [filteredOptions]);

  return (
    <DropdownRoot open={open} onOpenChange={onOpenChange}>
      <DropdownTrigger className="min-w-40 justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
        {trigger != null
          ? trigger(selectedOption)
          : selectedOption != null
            ? selectedOption.label
            : triggerPlaceholder}
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
        <div className="max-h-[300px] overflow-auto p-1">
          {groups.map(([groupKey, groupOptions]) => (
            <div key={groupKey || 'default'}>
              {groupKey !== '' && (
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {groupKey}
                </div>
              )}
              {groupOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(
                    'relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none',
                    'hover:bg-accent hover:text-accent-foreground',
                    value === opt.value && 'bg-accent text-accent-foreground'
                  )}
                  onClick={() => handleSelect(opt)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ))}
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

SearchableDropdown.displayName = 'SearchableDropdown';
