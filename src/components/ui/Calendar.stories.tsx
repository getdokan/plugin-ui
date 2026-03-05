import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { DateRange } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import { ar } from "react-day-picker/locale";
import { de } from "react-day-picker/locale";
import { ja } from "react-day-picker/locale";
import { es } from "react-day-picker/locale";
import { zhCN } from "react-day-picker/locale";

import { Calendar } from "./calendar";

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────────────────────────────────────
// Basic stories
// ─────────────────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
    );
  },
};

export const NoSelection: Story = {
  name: "Default (no selection)",
  render: () => (
    <div className="rounded-md border">
      <Calendar mode="single" />
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Selection modes
// ─────────────────────────────────────────────────────────────────────────────

export const MultipleSelection: Story = {
  name: "Multiple dates",
  render: () => {
    const [dates, setDates] = React.useState<Date[]>([]);
    return (
      <div className="space-y-2">
        <div className="rounded-md border">
          <Calendar mode="multiple" selected={dates} onSelect={setDates} />
        </div>
        <p className="text-muted-foreground text-xs text-center">
          {dates.length === 0
            ? "Click days to select"
            : `${dates.length} date(s) selected`}
        </p>
      </div>
    );
  },
};

export const RangeSelection: Story = {
  name: "Date range",
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>();
    return (
      <div className="space-y-2">
        <div className="rounded-md border">
          <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />
        </div>
        {range?.from && (
          <p className="text-muted-foreground text-xs text-center">
            {range.from.toLocaleDateString()} → {range.to?.toLocaleDateString() ?? "…"}
          </p>
        )}
      </div>
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Locale stories — demonstrating the WP locale mapper
// ─────────────────────────────────────────────────────────────────────────────

export const FrenchLocale: Story = {
  name: "Locale — French (fr_FR)",
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs text-center">
          Locale: <code>fr</code> (from <code>react-day-picker/locale</code>)
        </p>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} locale={fr} />
        </div>
      </div>
    );
  },
};

export const GermanLocale: Story = {
  name: "Locale — German (de_DE)",
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border">
        <Calendar mode="single" selected={date} onSelect={setDate} locale={de} />
      </div>
    );
  },
};

export const SpanishLocale: Story = {
  name: "Locale — Spanish (es_ES)",
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border">
        <Calendar mode="single" selected={date} onSelect={setDate} locale={es} />
      </div>
    );
  },
};

export const JapaneseLocale: Story = {
  name: "Locale — Japanese (ja)",
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border">
        <Calendar mode="single" selected={date} onSelect={setDate} locale={ja} />
      </div>
    );
  },
};

export const ChineseLocale: Story = {
  name: "Locale — Chinese Simplified (zh_CN)",
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border">
        <Calendar mode="single" selected={date} onSelect={setDate} locale={zhCN} />
      </div>
    );
  },
};

export const ArabicLocale: Story = {
  name: "Locale — Arabic (ar) — RTL",
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs text-center">
          RTL auto-detected from <code>wpLocale="ar"</code>
        </p>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={ar}
            wpLocale="ar"
          />
        </div>
      </div>
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Disabled dates
// ─────────────────────────────────────────────────────────────────────────────

export const DisabledDates: Story = {
  name: "Disabled dates",
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    return (
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs text-center">
          Past dates are disabled
        </p>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={{ before: today }}
          />
        </div>
      </div>
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Dropdown navigation
// ─────────────────────────────────────────────────────────────────────────────

export const DropdownNavigation: Story = {
  name: "Dropdown navigation (year/month)",
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown"
          fromYear={2000}
          toYear={2030}
        />
      </div>
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Week numbers
// ─────────────────────────────────────────────────────────────────────────────

export const WeekNumbers: Story = {
  name: "With week numbers",
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border">
        <Calendar mode="single" selected={date} onSelect={setDate} showWeekNumber />
      </div>
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Multiple months
// ─────────────────────────────────────────────────────────────────────────────

export const TwoMonths: Story = {
  name: "Two months side by side",
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border">
        <Calendar mode="single" selected={date} onSelect={setDate} numberOfMonths={2} />
      </div>
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// WP locale mapper demo
// ─────────────────────────────────────────────────────────────────────────────

export const LocaleMapperDemo: Story = {
  name: "Locale mapper — wpLocaleToDayPickerKey",
  render: () => {
    // Demonstrates how the mapper works — consumer imports the right locale
    // based on what wpLocaleToDayPickerKey() returns for their WP install.
    const examples: Array<{ wpLocale: string; key: string; locale: import("react-day-picker/locale").DayPickerLocale }> = [
      { wpLocale: "fr_FR", key: "fr", locale: fr as import("react-day-picker/locale").DayPickerLocale },
      { wpLocale: "de_DE", key: "de", locale: de as import("react-day-picker/locale").DayPickerLocale },
      { wpLocale: "ja", key: "ja", locale: ja as import("react-day-picker/locale").DayPickerLocale },
    ];

    const [current, setCurrent] = React.useState(0);
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const item = examples[current];

    return (
      <div className="space-y-4">
        <div className="flex gap-2 justify-center">
          {examples.map((ex, i) => (
            <button
              key={ex.wpLocale}
              onClick={() => setCurrent(i)}
              className={`px-3 py-1 rounded text-sm border ${
                i === current
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {ex.wpLocale}
            </button>
          ))}
        </div>
        <p className="text-muted-foreground text-xs text-center">
          <code>wpLocaleToDayPickerKey("{item.wpLocale}")</code> → <code>"{item.key}"</code>
        </p>
        <div className="rounded-md border">
          <Calendar
            key={item.wpLocale}
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={item.locale}
          />
        </div>
      </div>
    );
  },
};
