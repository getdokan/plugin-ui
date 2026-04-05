"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

export interface SmartMultiSelectOption {
  /** The display text for the option */
  label: string
  /** The unique identifier for the option. Should be unique and not empty */
  value: string
}

export interface SmartMultiSelectCreateContext {
  /** Current search/input value */
  searchValue: string
  /** Clear the search input and close the create form */
  clearSearch: () => void
  /** Close the popover */
  close: () => void
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
  /** Whether to disable the search input */
  disableSearch?: boolean
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
  /**
   * Render function for the create form. Receives a context with searchValue,
   * clearSearch, and close helpers. Return any React node.
   */
  renderCreateForm?: (ctx: SmartMultiSelectCreateContext) => React.ReactNode
  /** Whether to auto-select the newly created item @default false */
  selectOnCreate?: boolean
  /**
   * Callback fired after a new item is created via the default create form.
   * Receives the name and a done callback to call when finished.
   */
  onCreate?: (name: string, done: (createdValue?: string) => void) => void
  /** Text for the default create button @default "Create" */
  createButtonText?: string
  /** Icon to show at the start of the trigger (e.g. a person icon) */
  startIcon?: React.ReactNode
  /** Custom icon to replace the default chevron. Set to `null` to hide */
  endIcon?: React.ReactNode
  /** Whether to show the chevron arrow @default true */
  showChevron?: boolean
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
      disableSearch = false,
      labelFunc,
      onValueChange,
      onSearch,
      renderCreateForm,
      selectOnCreate = false,
      onCreate,
      createButtonText = "Create",
      startIcon,
      endIcon,
      showChevron = true,
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [searchValueState, setSearchValueState] = React.useState(
      searchValue || ""
    )
    const [showCreate, setShowCreate] = React.useState(false)
    const [reserveOptions, setReserveOptions] = React.useState<
      Record<string, SmartMultiSelectOption>
    >({})
    const optionsRef = React.useRef<Record<string, SmartMultiSelectOption>>({})
    const isInit = React.useRef(false)

    const hasCreateCapability = !!(renderCreateForm || onCreate)

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

    const clearSearch = React.useCallback(() => {
      setSearchValueState("")
      setShowCreate(false)
    }, [])

    const createCtx: SmartMultiSelectCreateContext = React.useMemo(
      () => ({
        searchValue: searchValueState,
        clearSearch,
        close: () => setIsPopoverOpen(false),
      }),
      [searchValueState, clearSearch]
    )

    const handleDefaultCreate = React.useCallback(() => {
      if (!onCreate || !searchValueState.trim()) return
      onCreate(searchValueState.trim(), (createdValue?: string) => {
        if (selectOnCreate && createdValue) {
          const newSelected = [...selectedValues, createdValue]
          setSelectedValues(newSelected)
          onValueChange(newSelected)
        }
        clearSearch()
      })
    }, [onCreate, searchValueState, selectOnCreate, selectedValues, onValueChange, clearSearch])

    const showCreateForm =
      hasCreateCapability &&
      (showCreate || (searchValueState && !loading && options.length === 0))

    // Cache options for async mode
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

    const renderDefaultCreateForm = () => (
      <div className="flex flex-col gap-2 p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            value={searchValueState}
            onChange={(e) => setSearchValueState(e.target.value)}
            placeholder="Enter name..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleDefaultCreate()
              }
              e.stopPropagation()
            }}
          />
          <Button
            size="sm"
            onClick={handleDefaultCreate}
            disabled={!searchValueState.trim()}
          >
            {createButtonText}
          </Button>
        </div>
      </div>
    )

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={(open) => {
          if (disabled) return
          setIsPopoverOpen(open)
          if (!open) {
            setShowCreate(false)
            if (clearSearchOnClose) {
              setSearchValueState("")
              onSearch?.("")
            }
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
                "cursor-pointer flex h-auto min-h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
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
              {startIcon && (
                <span className="shrink-0 [&_svg]:size-4 [&_svg]:text-muted-foreground">{startIcon}</span>
              )}
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
                {(showChevron || endIcon !== undefined) && (
                  <>
                    <div className="h-4 w-px bg-border mx-1" />
                    {endIcon !== undefined
                      ? endIcon && <span className="shrink-0 [&_svg]:size-4 opacity-50">{endIcon}</span>
                      : showChevron && <ChevronDownIcon className="size-4 opacity-50" />
                    }
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              {startIcon && (
                <span className="shrink-0 [&_svg]:size-4 [&_svg]:text-muted-foreground me-2">{startIcon}</span>
              )}
              <span className="text-muted-foreground text-sm flex-1">
                {placeholder}
              </span>
              {endIcon !== undefined
                ? endIcon && <span className="shrink-0 [&_svg]:size-4 opacity-50">{endIcon}</span>
                : showChevron && <ChevronDownIcon className="size-4 opacity-50" />
              }
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent
          data-slot="smart-multi-select-content"
          className={cn("!w-(--anchor-width) gap-0 p-0", contentClassName)}
          align="start"
        >
          <Command shouldFilter={!async}>
            {!disableSearch && (
              <div className="flex w-full items-center [&>[data-slot=command-input-wrapper]]:flex-1 [&>[data-slot=command-input-wrapper]]:border-b-0 border-b border-border">
                <CommandInput
                  placeholder={searchPlaceholder}
                  value={searchValueState}
                  onValueChange={(val: string) => {
                    setSearchValueState(val)
                    setShowCreate(false)
                    onSearch?.(val)
                  }}
                  onKeyDown={handleInputKeyDown}
                />
                {hasCreateCapability && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="me-2 shrink-0"
                    onClick={() => setShowCreate((prev) => !prev)}
                  >
                    {showCreate ? (
                      <XIcon className="size-4" />
                    ) : (
                      <PlusIcon className="size-4" />
                    )}
                  </Button>
                )}
              </div>
            )}
            <CommandList>
              {!showCreateForm && (
                <>
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
                    options.length === 0 &&
                    !hasCreateCapability && (
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        No results found.
                      </div>
                    )
                  ) : (
                    <CommandEmpty>No results found.</CommandEmpty>
                  )}
                  <CommandGroup>
                    {!async && !hideSelectAll && options.length > 0 && (
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
                  {options.length > 0 && <CommandSeparator />}
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
                </>
              )}
            </CommandList>
            {showCreateForm && (
              renderCreateForm
                ? renderCreateForm(createCtx)
                : renderDefaultCreateForm()
            )}
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

SmartMultiSelect.displayName = "SmartMultiSelect"

export { SmartMultiSelect }
