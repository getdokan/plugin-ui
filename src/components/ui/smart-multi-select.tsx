"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, Loader2Icon, XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

export interface SmartMultiSelectOption {
  /** The display text for the option */
  label: string
  /** The unique identifier for the option. Should be unique and not empty */
  value: string
}

export interface SmartMultiSelectProps {
  /** An array of options to display */
  options: SmartMultiSelectOption[]
  /** Whether the select is async. If true, filtering is handled externally */
  async?: boolean
  /** Whether options are currently loading. Works only when async is true */
  loading?: boolean
  /** Error object. If set, the error message is shown. Works only when async is true */
  error?: Error | null
  /** The default selected values when the component mounts */
  defaultValue?: string[]
  /** The selected values (controlled) */
  value?: string[]
  /** Placeholder text when no values are selected */
  placeholder?: string
  /** Placeholder text for the search input */
  searchPlaceholder?: string
  /** Maximum number of badge items to display. Extra items are summarized */
  maxCount?: number
  /** Additional class names for the trigger */
  className?: string
  /** Additional class names for the popover content */
  contentClassName?: string
  /** Text for the clear button */
  clearText?: string
  /** Text for the close button */
  closeText?: string
  /** Whether to hide the select all option */
  hideSelectAll?: boolean
  /** Whether to clear search input when popover closes */
  clearSearchOnClose?: boolean
  /** Controlled search value */
  searchValue?: string
  /** Whether the combobox is disabled */
  disabled?: boolean
  /** Mark combobox as invalid */
  invalid?: boolean
  /** Custom label function for rendering each option */
  labelFunc?: (
    option: SmartMultiSelectOption,
    isSelected: boolean,
    index: number
  ) => React.ReactNode
  /** Callback when selected values change */
  onValueChange: (value: string[]) => void
  /** Callback when search input changes */
  onSearch?: (value: string) => void
}

export interface SmartMultiSelectRef {
  /** Programmatically control the popover open/close state */
  setIsPopoverOpen: (open: boolean) => void
  /** Programmatically set the search input value */
  setSearchValue: (value: string) => void
}

const SmartMultiSelect = React.forwardRef<
  SmartMultiSelectRef,
  SmartMultiSelectProps
>(
  (
    {
      options,
      async = false,
      loading = false,
      error = null,
      defaultValue = [],
      value,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      maxCount = 3,
      className,
      contentClassName,
      clearText = "Clear",
      closeText = "Close",
      hideSelectAll = false,
      clearSearchOnClose = false,
      searchValue,
      disabled = false,
      invalid = false,
      labelFunc,
      onValueChange,
      onSearch,
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [searchValueState, setSearchValueState] = React.useState(
      searchValue || ""
    )
    // Cache options for async mode so selected labels remain visible after search changes
    const [reserveOptions, setReserveOptions] = React.useState<
      Record<string, SmartMultiSelectOption>
    >({})
    const optionsRef = React.useRef<Record<string, SmartMultiSelectOption>>({})
    const isInit = React.useRef(false)

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true)
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues]
        newSelectedValues.pop()
        setSelectedValues(newSelectedValues)
        onValueChange(newSelectedValues)
      }
    }

    const toggleOption = (optionValue: string) => {
      const isSelected = selectedValues.includes(optionValue)
      const newSelectedValues = isSelected
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue]
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    }

    const handleClear = () => {
      setSelectedValues([])
      onValueChange([])
    }

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount)
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    }

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear()
      } else {
        const allValues = options.map((option) => option.value)
        setSelectedValues(allValues)
        onValueChange(allValues)
      }
    }

    // Cache options for async mode so selected item labels persist across searches
    React.useEffect(() => {
      const temp = options.reduce(
        (acc, option) => {
          acc[option.value] = option
          return acc
        },
        {} as Record<string, SmartMultiSelectOption>
      )
      if (async) {
        if (!isInit.current) {
          optionsRef.current = temp
          setReserveOptions(temp)
          isInit.current = true
        } else {
          const selectedCache = selectedValues.reduce(
            (acc, val) => {
              const option = optionsRef.current[val]
              if (option) {
                acc[option.value] = option
              }
              return acc
            },
            {} as Record<string, SmartMultiSelectOption>
          )
          optionsRef.current = { ...temp, ...selectedCache }
          setReserveOptions({ ...temp, ...selectedCache })
        }
      }
    }, [async, options, selectedValues])

    React.useEffect(() => {
      if (value) {
        setSelectedValues(value)
      }
    }, [value])

    React.useEffect(() => {
      if (searchValue !== undefined) {
        setSearchValueState(searchValue)
      }
    }, [searchValue])

    React.useImperativeHandle(ref, () => ({
      setIsPopoverOpen,
      setSearchValue: setSearchValueState,
    }))

    const getOptionLabel = (val: string) => {
      if (async) {
        return reserveOptions[val]?.label ?? val
      }
      return options.find((o) => o.value === val)?.label ?? val
    }

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={(open) => {
          if (disabled) return
          setIsPopoverOpen(open)
          if (!open && clearSearchOnClose) {
            setSearchValueState("")
            onSearch?.("")
          }
        }}
      >
        <PopoverTrigger
          render={
            <div
              role="combobox"
              aria-expanded={isPopoverOpen}
              aria-invalid={invalid || undefined}
              data-slot="smart-multi-select-trigger"
              className={cn(
                "cursor-pointer flex h-auto min-h-9 w-[250px] items-center justify-between rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
                invalid &&
                  "border-destructive ring-destructive/20 ring-[3px] dark:ring-destructive/40",
                disabled && "cursor-not-allowed opacity-50 pointer-events-none",
                className
              )}
            />
          }
        >
          {selectedValues.length > 0 ? (
            <div className="flex justify-between items-center w-full gap-1">
              <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0 pointer-events-auto">
                {selectedValues.slice(0, maxCount).map((val) => (
                  <Badge
                    key={val}
                    variant="outline"
                    className="h-6 gap-1 rounded-md px-2 text-xs font-normal max-w-[120px]"
                  >
                    <span className="truncate">{getOptionLabel(val)}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      className="inline-flex cursor-pointer"
                      onPointerDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        toggleOption(val)
                      }}
                    >
                      <XIcon className="size-3 shrink-0 opacity-50 hover:opacity-100 hover:text-destructive" />
                    </span>
                  </Badge>
                ))}
                {selectedValues.length > maxCount && (
                  <Badge
                    variant="outline"
                    className="h-6 gap-1 rounded-md px-2 text-xs font-normal"
                  >
                    <span>{`+${selectedValues.length - maxCount}`}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      className="inline-flex cursor-pointer"
                      onPointerDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        clearExtraOptions()
                      }}
                    >
                      <XIcon className="size-3 shrink-0 opacity-50 hover:opacity-100 hover:text-destructive" />
                    </span>
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0 ms-1 pointer-events-auto">
                <span
                  role="button"
                  tabIndex={-1}
                  className="inline-flex cursor-pointer"
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    handleClear()
                  }}
                >
                  <XIcon className="size-4 opacity-50 hover:opacity-100 hover:text-destructive" />
                </span>
                <div className="h-4 w-px bg-border mx-1" />
                <ChevronsUpDownIcon className="size-4 opacity-50" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-muted-foreground text-sm">
                {placeholder}
              </span>
              <ChevronsUpDownIcon className="size-4 opacity-50" />
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent
          data-slot="smart-multi-select-content"
          className={cn("w-[250px] gap-0 p-0", contentClassName)}
          align="start"
        >
          <Command shouldFilter={!async}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValueState}
              onValueChange={(val: string) => {
                setSearchValueState(val)
                onSearch?.(val)
              }}
              onKeyDown={handleInputKeyDown}
            />
            <CommandList>
              {async && error && (
                <div className="p-4 text-center text-destructive text-sm">
                  {error.message}
                </div>
              )}
              {async && loading && options.length === 0 && (
                <div className="flex items-center justify-center gap-2 p-4">
                  <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    Searching...
                  </span>
                </div>
              )}
              {async ? (
                !loading &&
                !error &&
                options.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No results found.
                  </div>
                )
              ) : (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              <CommandGroup>
                {!async && !hideSelectAll && (
                  <CommandItem
                    key="__select_all__"
                    onSelect={toggleAll}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "me-1 size-4 flex items-center justify-center rounded-sm border border-primary shadow-xs",
                        selectedValues.length === options.length
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="size-3.5" />
                    </div>
                    <span>Select all</span>
                  </CommandItem>
                )}
                {options.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "me-1 size-4 flex items-center justify-center rounded-sm border border-primary shadow-xs",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="size-3.5" />
                      </div>
                      {labelFunc
                        ? labelFunc(option, isSelected, index)
                        : option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="flex-1 justify-center cursor-pointer"
                      >
                        {clearText}
                      </CommandItem>
                      <div className="h-4 w-px bg-border" />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="flex-1 justify-center cursor-pointer max-w-full"
                  >
                    {closeText}
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

SmartMultiSelect.displayName = "SmartMultiSelect"

export { SmartMultiSelect }
