import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { DateRange } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import { ar } from "react-day-picker/locale";
import { de } from "react-day-picker/locale";
import { CalendarIcon, Clock } from "lucide-react";

import { DatePicker, DateRangePicker } from "./date-picker";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Badge } from "./badge";

// ─────────────────────────────────────────────────────────────────────────────
// DatePicker meta
// ─────────────────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────────────────────────────────────
// Story components (hooks must be called inside PascalCase components)
// ─────────────────────────────────────────────────────────────────────────────

function DefaultDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  return <DatePicker value={date} onChange={setDate} />;
}

function WithInitialDateDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return <DatePicker value={date} onChange={setDate} />;
}

function CustomPlaceholderDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      placeholder="Select your birth date"
    />
  );
}

function CustomButtonTriggerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      trigger={({ value }) => (
        <Button variant="outline" className="w-[200px] gap-2">
          <CalendarIcon className="size-4" />
          {value ?? "Choose a date"}
        </Button>
      )}
    />
  );
}

function GhostButtonTriggerDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      trigger={({ value }) => (
        <Button variant="ghost" size="sm" className="gap-1.5">
          <CalendarIcon className="size-3.5" />
          {value ?? "Select"}
        </Button>
      )}
    />
  );
}

function InputTriggerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <div className="space-y-1.5">
      <Label>Appointment date</Label>
      <DatePicker
        value={date}
        onChange={setDate}
        trigger={({ value }) => (
          <div className="relative">
            <Input
              readOnly
              value={value ?? ""}
              placeholder="YYYY-MM-DD"
              className="pr-10 cursor-pointer"
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          </div>
        )}
      />
    </div>
  );
}

function BadgeTriggerDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-sm">Due date:</p>
      <DatePicker
        value={date}
        onChange={setDate}
        trigger={({ value }) => (
          <Badge variant="secondary" className="cursor-pointer gap-1 hover:bg-secondary/80">
            <CalendarIcon className="size-3" />
            {value ?? "Set date"}
          </Badge>
        )}
      />
    </div>
  );
}

function IconOnlyTriggerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {date ? date.toLocaleDateString() : "No date selected"}
      </span>
      <DatePicker
        value={date}
        onChange={setDate}
        trigger={() => (
          <Button variant="outline" size="icon-sm">
            <CalendarIcon className="size-4" />
          </Button>
        )}
      />
    </div>
  );
}

function CustomDisplayFormatDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs text-muted-foreground mb-1">
          Format: &quot;F j, Y&quot; (January 1, 2024)
        </p>
        <DatePicker value={date} onChange={setDate} displayFormat="F j, Y" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">
          Format: &quot;d/m/Y&quot; (01/01/2024)
        </p>
        <DatePicker value={date} onChange={setDate} displayFormat="d/m/Y" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">
          Format: &quot;m-d-Y&quot; (01-01-2024)
        </p>
        <DatePicker value={date} onChange={setDate} displayFormat="m-d-Y" />
      </div>
    </div>
  );
}

function FrenchLocaleDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      locale={fr}
      displayFormat="d F Y"
    />
  );
}

function GermanLocaleDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      locale={de}
      displayFormat="j. F Y"
    />
  );
}

function ArabicLocaleDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      locale={ar}
      wpLocale="ar"
      displayFormat="Y-m-d"
    />
  );
}

function FutureDatesOnlyDemo() {
  const today = new Date();
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      placeholder="Select a future date"
      calendarProps={{ disabled: { before: today } }}
    />
  );
}

function ConstrainedRangeDemo() {
  const today = new Date();
  const inThreeMonths = new Date(today);
  inThreeMonths.setMonth(today.getMonth() + 3);
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      placeholder="Next 3 months only"
      calendarProps={{
        disabled: { before: today, after: inThreeMonths },
      }}
    />
  );
}

function ControlledOpenDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          Open calendar
        </Button>
        {date && (
          <Button size="sm" variant="ghost" onClick={() => setDate(undefined)}>
            Clear
          </Button>
        )}
      </div>
      <DatePicker
        value={date}
        onChange={setDate}
        open={open}
        onOpenChange={setOpen}
        trigger={({ value }) => (
          <div className="text-sm text-muted-foreground">
            Selected: <strong>{value ?? "none"}</strong>
          </div>
        )}
      />
    </div>
  );
}

function RangePickerDefaultDemo() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  return <DateRangePicker mode="range" value={range} onChange={setRange} />;
}

function RangePickerWithInitialValueDemo() {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: today,
    to: nextWeek,
  });
  return <DateRangePicker mode="range" value={range} onChange={setRange} />;
}

function RangePickerCustomTriggerDemo() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  return (
    <DateRangePicker
      mode="range"
      value={range}
      onChange={setRange}
      trigger={({ value }) => (
        <div className="flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer hover:bg-accent">
          <CalendarIcon className="size-4 text-muted-foreground" />
          <span className="text-sm">
            {value ?? <span className="text-muted-foreground">Select date range</span>}
          </span>
        </div>
      )}
    />
  );
}

function RangePickerCustomSeparatorDemo() {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: today,
    to: nextWeek,
  });
  return (
    <DateRangePicker
      mode="range"
      value={range}
      onChange={setRange}
      separator="–"
    />
  );
}

function RangePickerLocaleDemo() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  return (
    <DateRangePicker
      mode="range"
      value={range}
      onChange={setRange}
      locale={fr}
    />
  );
}

function FormIntegrationDemo() {
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();

  return (
    <form className="space-y-4 w-[320px]" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-1.5">
        <Label>Start date</Label>
        <DatePicker
          value={startDate}
          onChange={setStartDate}
          placeholder="Select start date"
          trigger={({ value }) => (
            <div className="relative w-full">
              <Input
                readOnly
                value={value ?? ""}
                placeholder="YYYY-MM-DD"
                className="pr-10 cursor-pointer w-full"
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label>End date</Label>
        <DatePicker
          value={endDate}
          onChange={setEndDate}
          placeholder="Select end date"
          calendarProps={{
            disabled: startDate ? { before: startDate } : undefined,
          }}
          trigger={({ value }) => (
            <div className="relative w-full">
              <Input
                readOnly
                value={value ?? ""}
                placeholder="YYYY-MM-DD"
                className="pr-10 cursor-pointer w-full"
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>
          )}
        />
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}

function DropdownNavigationDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      calendarProps={{
        captionLayout: "dropdown",
        fromYear: 2000,
        toYear: 2030,
      }}
    />
  );
}

function ExplicitTimezoneDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="size-3.5" />
        <span>Timezone: America/New_York</span>
      </div>
      <DatePicker
        value={date}
        onChange={setDate}
        wpTimezone="America/New_York"
        displayFormat="Y-m-d"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: "Default (button trigger)",
  render: () => <DefaultDemo />,
};

export const WithInitialDate: Story = {
  name: "With initial date",
  render: () => <WithInitialDateDemo />,
};

export const CustomPlaceholder: Story = {
  name: "Custom placeholder",
  render: () => <CustomPlaceholderDemo />,
};

export const CustomButtonTrigger: Story = {
  name: "Custom trigger — outline button",
  render: () => <CustomButtonTriggerDemo />,
};

export const GhostButtonTrigger: Story = {
  name: "Custom trigger — ghost button",
  render: () => <GhostButtonTriggerDemo />,
};

export const InputTrigger: Story = {
  name: "Custom trigger — input field",
  render: () => <InputTriggerDemo />,
};

export const BadgeTrigger: Story = {
  name: "Custom trigger — badge",
  render: () => <BadgeTriggerDemo />,
};

export const IconOnlyTrigger: Story = {
  name: "Custom trigger — icon only",
  render: () => <IconOnlyTriggerDemo />,
};

export const CustomDisplayFormat: Story = {
  name: "Custom display format",
  render: () => <CustomDisplayFormatDemo />,
};

export const FrenchLocale: Story = {
  name: "Locale — French",
  render: () => <FrenchLocaleDemo />,
};

export const GermanLocale: Story = {
  name: "Locale — German",
  render: () => <GermanLocaleDemo />,
};

export const ArabicLocale: Story = {
  name: "Locale — Arabic (RTL)",
  render: () => <ArabicLocaleDemo />,
};

export const FutureDatesOnly: Story = {
  name: "Future dates only",
  render: () => <FutureDatesOnlyDemo />,
};

export const DateRange_Constrained: Story = {
  name: "Constrained date range",
  render: () => <ConstrainedRangeDemo />,
};

export const ControlledOpen: Story = {
  name: "Controlled open state",
  render: () => <ControlledOpenDemo />,
};

export const RangePickerDefault: Story = {
  name: "Range picker — default",
  render: () => <RangePickerDefaultDemo />,
};

export const RangePickerWithInitialValue: Story = {
  name: "Range picker — initial value",
  render: () => <RangePickerWithInitialValueDemo />,
};

export const RangePickerCustomTrigger: Story = {
  name: "Range picker — custom trigger",
  render: () => <RangePickerCustomTriggerDemo />,
};

export const RangePickerCustomSeparator: Story = {
  name: "Range picker — custom separator",
  render: () => <RangePickerCustomSeparatorDemo />,
};

export const RangePickerLocale: Story = {
  name: "Range picker — French locale",
  render: () => <RangePickerLocaleDemo />,
};

export const FormIntegration: Story = {
  name: "Form integration example",
  render: () => <FormIntegrationDemo />,
};

export const DropdownNavigation: Story = {
  name: "With dropdown navigation",
  render: () => <DropdownNavigationDemo />,
};

export const WithExplicitTimezone: Story = {
  name: "Explicit WordPress timezone",
  render: () => <ExplicitTimezoneDemo />,
};
