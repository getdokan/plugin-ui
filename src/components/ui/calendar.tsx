import * as React from "react";
import { DayPicker } from "react-day-picker";
import type { DayPickerLocale } from "react-day-picker/locale";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { getWordPressTimezone, getWordPressLocale, createWordPressLocale } from "@/lib/wordpress-date";
import { wpLocaleToDayPickerKey, isWpLocaleRtl } from "@/lib/locale-map";

// Use React.ComponentProps to preserve the full discriminated-union signature of
// DayPicker (Omit on a union type collapses it and loses `selected`/`onSelect`).
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /**
   * A date-fns / react-day-picker locale object.
   * Import from `react-day-picker/locale`, e.g.:
   *   import { fr } from "react-day-picker/locale";
   *
   * When omitted the component tries to auto-detect the WordPress locale
   * via `wpLocale` (or `getWordPressLocale()`).
   */
  locale?: Partial<DayPickerLocale>;

  /**
   * WordPress locale code used for auto-detection (e.g. "fr_FR", "ar").
   * Falls back to `getWordPressLocale()` when not provided.
   * Only used when `locale` prop is omitted.
   */
  wpLocale?: string;

  /**
   * IANA timezone string (e.g. "America/New_York").
   * Defaults to the WordPress site timezone via `getWordPressTimezone()`.
   * Pass `false` to disable timezone handling entirely.
   */
  wpTimezone?: string | false;
};

/**
 * Calendar component built on top of react-day-picker v9.
 *
 * - Auto-detects WordPress timezone from `@wordpress/date` settings.
 * - Auto-detects WordPress locale and maps it to the right date-fns locale
 *   when a `locale` prop is not provided.
 * - Fully styleable via `classNames` prop (all react-day-picker classNames supported).
 * - All react-day-picker v9 props are forwarded.
 *
 * @example Basic usage
 * ```tsx
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 * ```
 *
 * @example With explicit locale
 * ```tsx
 * import { fr } from "react-day-picker/locale";
 * <Calendar mode="single" locale={fr} />
 * ```
 *
 * @example Disable WordPress timezone detection
 * ```tsx
 * <Calendar mode="single" wpTimezone={false} />
 * ```
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale,
  wpLocale,
  wpTimezone,
  dir,
  mode,
  components: consumerComponents,
  ...props
}: CalendarProps) {
  // ── Timezone ──────────────────────────────────────────────────────────────
  const resolvedTimezone = React.useMemo<string | undefined>(() => {
    if (wpTimezone === false) return undefined;
    if (typeof wpTimezone === "string") return wpTimezone;
    const tz = getWordPressTimezone();
    return tz !== "UTC" ? tz : undefined;
  }, [wpTimezone]);

  // ── Locale: honour consumer-provided locale first ──────────────────────────
  // When `locale` is omitted, auto-detect from WordPress settings by building
  // a date-fns-compatible locale from WP's l10n data (month/day names, etc.).
  const resolvedLocale = React.useMemo(() => {
    if (locale) return locale;
    return createWordPressLocale() ?? undefined;
  }, [locale]);

  // ── RTL direction ──────────────────────────────────────────────────────────
  const resolvedDir = React.useMemo<string | undefined>(() => {
    if (dir !== undefined) return dir;
    const localeCode = wpLocale ?? getWordPressLocale();
    return isWpLocaleRtl(localeCode) ? "rtl" : "ltr";
  }, [dir, wpLocale]);

  return (
    // DayPicker has a discriminated union for props (PropsSingle | PropsRange | …).
    // Spreading our collected `props` satisfies all branches at runtime; the cast
    // is needed because TypeScript can't narrow the union through the spread.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <DayPicker
      {...(props as any)}
      animate
      mode={mode}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      dir={resolvedDir}
      timeZone={resolvedTimezone}
      locale={resolvedLocale}
      classNames={{
        root: "rdp-root",
        // `months` is the nearest positioned ancestor for the Nav element
        // (Nav is a direct child of Months in react-day-picker v9 DOM).
        // No extra padding needed — the nav is overlaid on top of month_caption.
        months: "relative flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0",
        month: "flex flex-col gap-4 w-full",
        // h-7 reserves the row height that the absolutely-positioned nav also occupies.
        month_caption: "flex h-7 items-center justify-center",
        caption_label: "text-sm font-semibold",
        // Nav is laid over month_caption: full width, same height, buttons at each end.
        nav: "absolute top-0 inset-x-0 flex h-7 items-center justify-between px-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
        weeks: "",
        week: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-accent",
          "[&:has([aria-selected].outside)]:bg-accent/50",
          "[&:has([aria-selected].range_end)]:rounded-r-md",
          mode === "range"
            ? "[&:has(>.range_end)]:rounded-e-md [&:has(>.range_start)]:rounded-s-md first:[&:has([aria-selected])]:rounded-s-md last:[&:has([aria-selected])]:rounded-e-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal aria-selected:opacity-100 rounded-md"
        ),
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
        today: "bg-accent text-accent-foreground rounded-md",
        outside:
          "outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_start: "range_start rounded-s-md",
        range_end: "range_end rounded-e-md",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground rounded-none",
        hidden: "invisible",
        // Dropdown navigation
        dropdowns: "flex gap-1 items-center",
        dropdown_root: "relative",
        dropdown: "absolute inset-0 opacity-0 cursor-pointer w-full",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...chevronProps }) => {
          if (orientation === "down") {
            return <ChevronDown className="size-4" {...chevronProps} />;
          }
          // react-day-picker uses "left"/"right" for prev/next in LTR,
          // but flips them in RTL — passing through as-is lets the library handle it.
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="size-4" {...chevronProps} />;
        },
        ...consumerComponents,
      }}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };

// ── Convenience re-export ────────────────────────────────────────────────────
// Consumers can do:
//   import { wpLocaleToDayPickerKey } from "@wedevs/plugin-ui";
//   import { fr } from "react-day-picker/locale";
//   <Calendar locale={fr} />
export { wpLocaleToDayPickerKey, isWpLocaleRtl } from "@/lib/locale-map";
export {
  getWordPressTimezone,
  getWordPressLocale,
  getWordPressDateFormat,
  getWordPressTimeFormat,
  formatWordPressDate,
  formatWordPressDateTime,
} from "@/lib/wordpress-date";
