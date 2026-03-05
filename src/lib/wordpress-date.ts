/**
 * WordPress Date Utilities
 *
 * Bridges @wordpress/date with react-day-picker for timezone-aware,
 * i18n-compatible date handling in WordPress environments.
 */

import { getSettings, dateI18n, date as wpDate } from "@wordpress/date";

import type { Locale as DateFnsLocale } from "date-fns";

/** WordPress date/time settings shape returned by getSettings(). */
export interface WordPressDateSettings {
  timezone: {
    /** IANA timezone string, e.g. "America/New_York". Empty string when offset-only. */
    string: string;
    /** Numeric UTC offset, e.g. "-5" or "5.5". */
    offset: string | number;
    /** Formatted offset string, e.g. "+05:30". */
    offsetFormatted: string;
    /** Timezone abbreviation, e.g. "EST". */
    abbr: string;
  };
  /** WordPress date format string, e.g. "Y-m-d". */
  dateFormat: string;
  /** WordPress time format string, e.g. "H:i". */
  timeFormat: string;
  l10n: {
    locale: string;
    months: string[];
    monthsShort: string[];
    weekdays: string[];
    weekdaysShort: string[];
    meridiem: { am: string; pm: string; AM: string; PM: string };
    startOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    [key: string]: unknown;
  };
}

/**
 * Safely reads WordPress date settings via @wordpress/date.
 * Returns null when running outside WordPress (e.g. Storybook).
 */
export function getWordPressDateSettings(): WordPressDateSettings | null {
  try {
    const settings = getSettings();
    if (settings && settings.timezone !== undefined) {
      return settings as unknown as WordPressDateSettings;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns the active WordPress timezone as an IANA string (e.g. "America/New_York").
 *
 * Falls back in order:
 * 1. `settings.timezone.string` from @wordpress/date
 * 2. UTC offset constructed as "UTC+X" or "UTC-X"
 * 3. Browser's local timezone via Intl
 * 4. "UTC"
 */
export function getWordPressTimezone(): string {
  const settings = getWordPressDateSettings();

  if (settings) {
    const { string, offset } = settings.timezone;

    // Prefer named timezone (IANA)
    if (string && string.trim() !== "") {
      return string;
    }

    // Fall back to numeric offset — build a fixed-offset identifier
    const numericOffset = typeof offset === "string" ? parseFloat(offset) : offset;
    if (!isNaN(numericOffset)) {
      if (numericOffset === 0) return "UTC";
      const sign = numericOffset > 0 ? "+" : "-";
      const abs = Math.abs(numericOffset);
      const hours = Math.floor(abs);
      const minutes = Math.round((abs - hours) * 60);
      return minutes === 0
        ? `Etc/GMT${sign === "+" ? "-" : "+"}${hours}` // Etc/GMT has inverted sign
        : "UTC"; // Half-hour offsets aren't representable as Etc/GMT, fall back to UTC
    }
  }

  // Fallback: browser timezone
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * Returns the WordPress site locale string (e.g. "en_US", "fr_FR").
 *
 * Detection order:
 * 1. `window.wpApiSettings.locale`
 * 2. `window.userLocale`
 * 3. `document.documentElement.lang` (normalized to underscore)
 * 4. "en_US"
 */
export function getWordPressLocale(): string {
  if (typeof window !== "undefined") {
    const win = window as unknown as Record<string, unknown>;

    const apiSettings = win.wpApiSettings as Record<string, unknown> | undefined;
    if (apiSettings?.locale && typeof apiSettings.locale === "string") {
      return apiSettings.locale;
    }

    if (win.userLocale && typeof win.userLocale === "string") {
      return win.userLocale as string;
    }

    if (typeof document !== "undefined") {
      const lang = document.documentElement.lang;
      if (lang) {
        // Normalize "en-US" → "en_US"
        return lang.replace("-", "_");
      }
    }
  }
  return "en_US";
}

/**
 * Returns the WordPress site date format string (e.g. "Y-m-d").
 * Falls back to "Y-m-d" when settings are unavailable.
 */
export function getWordPressDateFormat(): string {
  return getWordPressDateSettings()?.dateFormat ?? "Y-m-d";
}

/**
 * Returns the WordPress site time format string (e.g. "H:i").
 * Falls back to "H:i" when settings are unavailable.
 */
export function getWordPressTimeFormat(): string {
  return getWordPressDateSettings()?.timeFormat ?? "H:i";
}

/**
 * Formats a date using @wordpress/date's `dateI18n`, which applies the
 * WordPress locale and timezone automatically.
 *
 * @param format  WordPress date format string (PHP date() style). Defaults to WP site date format.
 * @param date    The date to format. Defaults to now.
 * @param timezone  Override timezone. `true` = use UTC. Defaults to WP site timezone.
 */
export function formatWordPressDate(
  format?: string,
  date?: Date | string | number,
  timezone?: string | boolean
): string {
  const fmt = format ?? getWordPressDateFormat();
  try {
    return dateI18n(fmt, date, timezone);
  } catch {
    // Fallback: use the non-i18n formatter
    try {
      return wpDate(fmt, date, timezone as string | undefined);
    } catch {
      return "";
    }
  }
}

/**
 * Formats a datetime string using both the WP date and time formats.
 * Result: e.g. "2024-01-15 14:30"
 */
export function formatWordPressDateTime(
  date?: Date | string | number,
  timezone?: string | boolean
): string {
  const dateStr = formatWordPressDate(getWordPressDateFormat(), date, timezone);
  const timeStr = formatWordPressDate(getWordPressTimeFormat(), date, timezone);
  return `${dateStr} ${timeStr}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// WordPress → date-fns locale adapter
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Helper: creates a `localize` function compatible with date-fns `Locale["localize"]`.
 * Returns the value from the given array based on the `width` option.
 */
function buildLocalizer(wide: string[], abbreviated: string[], narrow?: string[]) {
  return (index: number, options?: { width?: string }) => {
    const w = options?.width ?? "wide";
    if (w === "narrow" && narrow) return narrow[index] ?? abbreviated[index] ?? wide[index] ?? "";
    if (w === "abbreviated" || w === "short") return abbreviated[index] ?? wide[index] ?? "";
    return wide[index] ?? "";
  };
}

/**
 * Helper: creates a `formatLong` entry compatible with date-fns.
 * date-fns calls these with `{ width: 'full' | 'long' | 'medium' | 'short' }`.
 * Must return date-fns format tokens (e.g. "EEEE, MMMM d, y"), NOT PHP patterns.
 */
function buildFormatLong(formats: {
  full: string;
  long: string;
  medium: string;
  short: string;
}) {
  return (options?: { width?: "full" | "long" | "medium" | "short" }) => {
    const w = options?.width ?? "full";
    return formats[w] ?? formats.full;
  };
}

/**
 * Builds a date-fns-compatible `Locale` object from WordPress `@wordpress/date`
 * settings. This lets react-day-picker render month names, weekday names, and
 * first-day-of-week correctly without importing any date-fns locale bundles.
 *
 * Returns `null` when WordPress settings are unavailable (e.g. Storybook).
 *
 * @example
 * ```tsx
 * const wpLocale = createWordPressLocale();
 * <Calendar locale={wpLocale ?? undefined} />
 * ```
 */
export function createWordPressLocale(): DateFnsLocale | null {
  const settings = getWordPressDateSettings();
  if (!settings) return null;

  const { l10n } = settings;

  // WordPress l10n weekdays are [Sunday, Monday, ...] (index 0 = Sunday)
  // date-fns day localize expects the same order.
  const weekdaysNarrow = l10n.weekdaysShort.map((d: string) => d.charAt(0));

  // We only need localize + formatLong + options for react-day-picker rendering.
  // formatDistance, formatRelative, match are unused by DayPicker, so we cast.
  const locale = {
    code: l10n.locale || "en",

    localize: {
      month: buildLocalizer(l10n.months, l10n.monthsShort),
      day: buildLocalizer(l10n.weekdays, l10n.weekdaysShort, weekdaysNarrow),

      // Minimal stubs for other localize properties date-fns may access.
      ordinalNumber: (n: number) => String(n),
      era: (n: number) => (n === 0 ? "BC" : "AD"),
      quarter: (n: number) => `Q${n + 1}`,
      dayPeriod: (period: string) => {
        if (period === "am") return l10n.meridiem?.am ?? "am";
        if (period === "pm") return l10n.meridiem?.pm ?? "pm";
        return period;
      },
    } as DateFnsLocale["localize"],

    formatLong: {
      date: buildFormatLong({
        full: "EEEE, MMMM d, y",
        long: "MMMM d, y",
        medium: "MMM d, y",
        short: "MM/dd/y",
      }),
      time: buildFormatLong({
        full: "h:mm:ss a zzzz",
        long: "h:mm:ss a z",
        medium: "h:mm:ss a",
        short: "h:mm a",
      }),
      dateTime: buildFormatLong({
        full: "{{date}} '{{time}}'",
        long: "{{date}} '{{time}}'",
        medium: "{{date}}, {{time}}",
        short: "{{date}}, {{time}}",
      }),
    } as DateFnsLocale["formatLong"],

    options: {
      weekStartsOn: l10n.startOfWeek ?? 0,
      firstWeekContainsDate: 1,
    },
  };

  return locale as DateFnsLocale;
}
