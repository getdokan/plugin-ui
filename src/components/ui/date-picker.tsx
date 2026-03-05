import * as React from "react";
import type { DateRange } from "react-day-picker";
import type { DayPickerLocale } from "react-day-picker/locale";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar, type CalendarProps } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  getWordPressDateFormat,
  formatWordPressDate,
} from "@/lib/wordpress-date";

// ─────────────────────────────────────────────────────────────────────────────
// Shared props
// ─────────────────────────────────────────────────────────────────────────────

interface DatePickerBaseProps {
  /** Class applied to the root Popover element. */
  className?: string;
  /** Class applied to the PopoverContent. */
  contentClassName?: string;
  /**
   * Custom trigger element. Receives `value` (the current formatted string)
   * and `open` (whether the popover is open) so you can render anything.
   *
   * @example
   * ```tsx
   * <DatePicker
   *   trigger={({ value }) => (
   *     <Button variant="outline">{value ?? "Pick date"}</Button>
   *   )}
   * />
   * ```
   */
  trigger?: (props: { value: string | undefined; open: boolean }) => React.ReactNode;
  /**
   * WordPress date format string used to display the selected date.
   * Defaults to the WP site date format from `@wordpress/date` settings (e.g. "Y-m-d").
   */
  displayFormat?: string;
  /**
   * A date-fns / react-day-picker locale object for the calendar.
   * Import from `react-day-picker/locale`.
   */
  locale?: Partial<DayPickerLocale>;
  /**
   * WordPress locale code for auto-detection (e.g. "fr_FR").
   * Used when `locale` is not provided.
   */
  wpLocale?: string;
  /**
   * IANA timezone string.
   * Defaults to the WordPress site timezone.
   * Pass `false` to disable.
   */
  wpTimezone?: string | false;
  /** Props forwarded to the underlying `<Calendar>` component. */
  // CalendarProps wraps DayPicker's discriminated union — using a plain record
  // for calendarProps avoids TypeScript losing the union when we Omit from it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calendarProps?: Record<string, any>;
  /** Popover alignment. */
  align?: "start" | "center" | "end";
  /** Popover side. */
  side?: "top" | "bottom" | "left" | "right";
  /** Popover sideOffset. */
  sideOffset?: number;
  /** Controlled open state of the popover. */
  open?: boolean;
  /** Callback when the popover open state changes. */
  onOpenChange?: (open: boolean) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Single date picker
// ─────────────────────────────────────────────────────────────────────────────

export interface DatePickerProps extends DatePickerBaseProps {
  mode?: "single";
  /** The selected date. */
  value?: Date;
  /** Called when the user selects a date. */
  onChange?: (date: Date | undefined) => void;
  /** Placeholder text shown when no date is selected. */
  placeholder?: string;
}

/**
 * DatePicker — single date selection.
 *
 * Combines a customisable trigger (defaults to a button) with a popover
 * calendar. Fully integrated with WordPress timezone and locale.
 *
 * @example Default trigger
 * ```tsx
 * const [date, setDate] = React.useState<Date>();
 * <DatePicker value={date} onChange={setDate} />
 * ```
 *
 * @example Custom trigger
 * ```tsx
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   trigger={({ value }) => (
 *     <input readOnly value={value ?? ""} placeholder="Pick a date" />
 *   )}
 * />
 * ```
 */
function DatePicker({
  className,
  contentClassName,
  trigger,
  displayFormat,
  locale,
  wpLocale,
  wpTimezone,
  calendarProps,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  open: controlledOpen,
  onOpenChange,
  value,
  onChange,
  placeholder = "Pick a date",
}: DatePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const fmt = displayFormat ?? getWordPressDateFormat();
  const formattedValue = value ? formatWordPressDate(fmt, value) : undefined;

  const defaultTrigger = (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        // Match the Input component's base look
        "border-input flex h-9 w-full min-w-[200px] cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "hover:bg-accent/40",
        value ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      <span className="truncate">{formattedValue ?? placeholder}</span>
      <ChevronDown className="text-muted-foreground ms-2 size-4 shrink-0 opacity-50" />
    </div>
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        {trigger ? trigger({ value: formattedValue, open }) : defaultTrigger}
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto p-0", contentClassName)}
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date);
            handleOpenChange(false);
          }}
          locale={locale}
          wpLocale={wpLocale}
          wpTimezone={wpTimezone}
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}

DatePicker.displayName = "DatePicker";

// ─────────────────────────────────────────────────────────────────────────────
// Date range picker
// ─────────────────────────────────────────────────────────────────────────────

export interface DateRangePickerProps extends DatePickerBaseProps {
  mode: "range";
  /** The selected date range. */
  value?: DateRange;
  /**
   * Called only when the user confirms the selection via the Apply button.
   * The popover closes automatically after this is called.
   */
  onChange?: (range: DateRange | undefined) => void;
  /** Placeholder text when no range is selected. */
  placeholder?: string;
  /** Separator between from/to dates. Defaults to "→". */
  separator?: string;
  /** Label for the confirm button. Defaults to "Apply". */
  confirmLabel?: string;
  /** Label for the cancel button. Defaults to "Cancel". */
  cancelLabel?: string;
}

/**
 * DateRangePicker — date range selection.
 *
 * Same flexibility as DatePicker but for selecting a start/end range.
 *
 * @example
 * ```tsx
 * const [range, setRange] = React.useState<DateRange>();
 * <DateRangePicker mode="range" value={range} onChange={setRange} />
 * ```
 */
function DateRangePicker({
  className,
  contentClassName,
  trigger,
  displayFormat,
  locale,
  wpLocale,
  wpTimezone,
  calendarProps,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  open: controlledOpen,
  onOpenChange,
  value,
  onChange,
  placeholder = "Pick a date range",
  separator = "→",
  confirmLabel = "Apply",
  cancelLabel = "Cancel",
}: DateRangePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  // Draft tracks in-progress selection; only committed to `value` on Apply.
  const [draft, setDraft] = React.useState<DateRange | undefined>(value);

  const closePopover = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      // Reset draft to the last confirmed value every time the picker opens.
      setDraft(value);
    }
    closePopover(next);
  };

  const handleApply = () => {
    onChange?.(draft);
    closePopover(false);
  };

  const handleCancel = () => {
    setDraft(value);
    closePopover(false);
  };

  const fmt = displayFormat ?? getWordPressDateFormat();

  // Trigger always shows the confirmed `value`, not the in-progress draft.
  const formattedValue = React.useMemo<string | undefined>(() => {
    if (!value?.from) return undefined;
    const from = formatWordPressDate(fmt, value.from);
    if (!value.to) return from;
    const to = formatWordPressDate(fmt, value.to);
    return `${from} ${separator} ${to}`;
  }, [value, fmt, separator]);

  const defaultTrigger = (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "border-input flex h-9 w-full min-w-[260px] cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "hover:bg-accent/40",
        value?.from ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      <span className="truncate">{formattedValue ?? placeholder}</span>
      <ChevronDown className="text-muted-foreground ms-2 size-4 shrink-0 opacity-50" />
    </div>
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        {trigger ? trigger({ value: formattedValue, open }) : defaultTrigger}
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto p-0", contentClassName)}
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        <Calendar
          mode="range"
          selected={draft}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSelect={setDraft as any}
          locale={locale}
          wpLocale={wpLocale}
          wpTimezone={wpTimezone}
          numberOfMonths={2}
          {...calendarProps}
        />
        {/* Footer — Apply / Cancel */}
        <div className="border-border flex items-center justify-end gap-2 border-t px-3 py-2">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button size="sm" onClick={handleApply} disabled={!draft?.from}>
            {confirmLabel}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

DateRangePicker.displayName = "DateRangePicker";

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export { DatePicker, DateRangePicker };
export type { DateRange };
