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
// Story components (hooks must be called inside PascalCase components)
// ─────────────────────────────────────────────────────────────────────────────

function DefaultDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="rounded-md border">
      <Calendar mode="single" selected={date} onSelect={setDate} />
    </div>
  );
}

function MultipleSelectionDemo() {
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
}

function RangeSelectionDemo() {
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
}

function FrenchLocaleDemo() {
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
}

function GermanLocaleDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="rounded-md border">
      <Calendar mode="single" selected={date} onSelect={setDate} locale={de} />
    </div>
  );
}

function SpanishLocaleDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="rounded-md border">
      <Calendar mode="single" selected={date} onSelect={setDate} locale={es} />
    </div>
  );
}

function JapaneseLocaleDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="rounded-md border">
      <Calendar mode="single" selected={date} onSelect={setDate} locale={ja} />
    </div>
  );
}

function ChineseLocaleDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="rounded-md border">
      <Calendar mode="single" selected={date} onSelect={setDate} locale={zhCN} />
    </div>
  );
}

function ArabicLocaleDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-xs text-center">
        RTL auto-detected from <code>wpLocale=&quot;ar&quot;</code>
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
}

function DisabledDatesDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const today = new Date();

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
}

function DropdownNavigationDemo() {
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
}

function WeekNumbersDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="rounded-md border">
      <Calendar mode="single" selected={date} onSelect={setDate} showWeekNumber />
    </div>
  );
}

function TwoMonthsDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="rounded-md border">
      <Calendar mode="single" selected={date} onSelect={setDate} numberOfMonths={2} />
    </div>
  );
}

function LocaleMapperDemoComponent() {
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
        <code>wpLocaleToDayPickerKey(&quot;{item.wpLocale}&quot;)</code> → <code>&quot;{item.key}&quot;</code>
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
}

// ─────────────────────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => <DefaultDemo />,
};

export const NoSelection: Story = {
  name: "Default (no selection)",
  render: () => (
    <div className="rounded-md border">
      <Calendar mode="single" />
    </div>
  ),
};

export const MultipleSelection: Story = {
  name: "Multiple dates",
  render: () => <MultipleSelectionDemo />,
};

export const RangeSelection: Story = {
  name: "Date range",
  render: () => <RangeSelectionDemo />,
};

export const FrenchLocale: Story = {
  name: "Locale — French (fr_FR)",
  render: () => <FrenchLocaleDemo />,
};

export const GermanLocale: Story = {
  name: "Locale — German (de_DE)",
  render: () => <GermanLocaleDemo />,
};

export const SpanishLocale: Story = {
  name: "Locale — Spanish (es_ES)",
  render: () => <SpanishLocaleDemo />,
};

export const JapaneseLocale: Story = {
  name: "Locale — Japanese (ja)",
  render: () => <JapaneseLocaleDemo />,
};

export const ChineseLocale: Story = {
  name: "Locale — Chinese Simplified (zh_CN)",
  render: () => <ChineseLocaleDemo />,
};

export const ArabicLocale: Story = {
  name: "Locale — Arabic (ar) — RTL",
  render: () => <ArabicLocaleDemo />,
};

export const DisabledDates: Story = {
  name: "Disabled dates",
  render: () => <DisabledDatesDemo />,
};

export const DropdownNavigation: Story = {
  name: "Dropdown navigation (year/month)",
  render: () => <DropdownNavigationDemo />,
};

export const WeekNumbers: Story = {
  name: "With week numbers",
  render: () => <WeekNumbersDemo />,
};

export const TwoMonths: Story = {
  name: "Two months side by side",
  render: () => <TwoMonthsDemo />,
};

export const LocaleMapperDemo: Story = {
  name: "Locale mapper — wpLocaleToDayPickerKey",
  render: () => <LocaleMapperDemoComponent />,
};
