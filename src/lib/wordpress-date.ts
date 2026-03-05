/**
 * WordPress Date Utilities
 *
 * Bridges @wordpress/date with react-day-picker for timezone-aware,
 * i18n-compatible date handling in WordPress environments.
 */

import { getSettings, dateI18n, date as wpDate } from "@wordpress/date";

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
  l10n: Record<string, unknown>;
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
