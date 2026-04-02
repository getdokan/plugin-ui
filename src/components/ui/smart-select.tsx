"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, Loader2Icon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface SmartSelectOption {
  /** Unique value for the option */
  value: string
  /** Display label */
  label: string
  /** Optional description shown below label */
  description?: string
  /** Whether the option is disabled */
  disabled?: boolean
  /** Optional group name for grouping options */
  group?: string
}

export interface SmartSelectProps {
  /** Async callback triggered on search input change (after debounce) */
  onSearch: (query: string) => void | Promise<void>
  /** Options to display in the dropdown */
  options: SmartSelectOption[]
  /** Currently selected value */
  value?: string
  /** Callback when selection changes */
  onValueChange?: (value: string) => void
  /** Whether results are currently loading */
  loading?: boolean
  /** Placeholder text for the trigger button */
  placeholder?: string
  /** Placeholder text for the search input */
  searchPlaceholder?: string
  /** Message shown when no results are found */
  emptyMessage?: string
  /** Message shown before the user starts typing */
  idleMessage?: string
  /** Whether to show a clear button when a value is selected */
  showClear?: boolean
  /** Whether the combobox is disabled */
  disabled?: boolean
  /** Mark combobox as invalid */
  invalid?: boolean
  /** Debounce delay in milliseconds @default 300 */
  debounceMs?: number
  /** Additional class for the trigger button */
  className?: string
  /** Width class for the popover content @default "w-[250px]" */
  contentClassName?: string
  /** Custom render function for each option */
  renderOption?: (option: SmartSelectOption, isSelected: boolean) => React.ReactNode
}

function SmartSelect({
  onSearch,
  options,
  value = "",
  onValueChange,
  loading = false,
  placeholder = "Select an option...",
  searchPlaceholder = "Type to search...",
  emptyMessage = "No results found.",
  idleMessage = "Start typing to search",
  showClear = false,
  disabled = false,
  invalid = false,
  debounceMs = 300,
  className,
  contentClassName,
  renderOption,
}: SmartSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  )

  const handleSearchChange = React.useCallback(
    (query: string) => {
      setSearch(query)

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        onSearch(query)
      }, debounceMs)
    },
    [onSearch, debounceMs]
  )

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  React.useEffect(() => {
    if (!open) {
      setSearch("")
    }
  }, [open])

  // Group options by group name
  const groupedOptions = React.useMemo(() => {
    const groups = new Map<string, SmartSelectOption[]>()
    const ungrouped: SmartSelectOption[] = []

    for (const opt of options) {
      if (opt.group) {
        const group = groups.get(opt.group) || []
        group.push(opt)
        groups.set(opt.group, group)
      } else {
        ungrouped.push(opt)
      }
    }

    return { groups, ungrouped }
  }, [options])

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onValueChange?.("")
    },
    [onValueChange]
  )

  const renderItems = (items: SmartSelectOption[]) =>
    items.map((option) => {
      const isSelected = value === option.value
      return (
        <CommandItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          onSelect={(currentValue) => {
            onValueChange?.(currentValue === value ? "" : currentValue)
            setOpen(false)
          }}
        >
          {renderOption ? (
            renderOption(option, isSelected)
          ) : (
            <>
              {option.description ? (
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </div>
              ) : (
                option.label
              )}
              <CheckIcon
                className={cn(
                  "ms-auto size-4",
                  isSelected ? "opacity-100" : "opacity-0"
                )}
              />
            </>
          )}
        </CommandItem>
      )
    })

  const renderGroupedContent = () => {
    const { groups, ungrouped } = groupedOptions
    const entries = Array.from(groups.entries())

    return (
      <>
        {ungrouped.length > 0 && (
          <CommandGroup>{renderItems(ungrouped)}</CommandGroup>
        )}
        {entries.map(([groupName, items], index) => (
          <React.Fragment key={groupName}>
            {(index > 0 || ungrouped.length > 0) && <CommandSeparator />}
            <CommandGroup heading={groupName}>
              {renderItems(items)}
            </CommandGroup>
          </React.Fragment>
        ))}
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={invalid || undefined}
            disabled={disabled}
            data-slot="smart-select-trigger"
            className={cn(
              "w-[250px] justify-between border-input text-foreground font-normal",
              invalid &&
                "border-destructive ring-destructive/20 ring-[3px] dark:ring-destructive/40",
              className
            )}
          />
        }
      >
        <span
          className={cn(
            "truncate",
            !value && "text-muted-foreground"
          )}
        >
          {selectedOption?.label || value || placeholder}
        </span>
        <div className="flex items-center gap-1 ms-2">
          {showClear && value && (
            <span
              role="button"
              tabIndex={-1}
              className="rounded-sm opacity-50 hover:opacity-100 cursor-pointer"
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClear(e as unknown as React.MouseEvent)
              }}
            >
              <XIcon className="size-3.5" />
              <span className="sr-only">Clear</span>
            </span>
          )}
          <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        data-slot="smart-select-content"
        className={cn("w-[250px] gap-0 p-0", contentClassName)}
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-4">
                <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  Searching...
                </span>
              </div>
            ) : !search ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                {idleMessage}
              </div>
            ) : options.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : groupedOptions.groups.size > 0 ? (
              renderGroupedContent()
            ) : (
              <CommandGroup>{renderItems(options)}</CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { SmartSelect }
export type { SmartSelectOption as SmartSelectOptionType }
