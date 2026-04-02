import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AsyncMultiCombobox,
  type AsyncMultiComboboxOption,
} from "./async-multi-combobox";

const allFrameworks: AsyncMultiComboboxOption[] = [
  { value: "next.js", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "gatsby", label: "Gatsby" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "react", label: "React" },
  { value: "solid-start", label: "SolidStart" },
];

const meta = {
  title: "UI/AsyncMultiCombobox",
  component: AsyncMultiCombobox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AsyncMultiCombobox>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Basic (sync mode) ────────────────────────

function BasicDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <AsyncMultiCombobox
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select frameworks..."
    />
  );
}

export const Basic: Story = {
  render: () => <BasicDemo />,
};

// ─── With Default Values ────────────────────────

function DefaultValueDemo() {
  const [value, setValue] = useState<string[]>(["react", "vue", "next.js"]);

  return (
    <AsyncMultiCombobox
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select frameworks..."
    />
  );
}

export const WithDefaultValues: Story = {
  render: () => <DefaultValueDemo />,
};

// ─── Max Count ────────────────────────

function MaxCountDemo() {
  const [value, setValue] = useState<string[]>([
    "react",
    "vue",
    "next.js",
    "remix",
    "astro",
  ]);

  return (
    <AsyncMultiCombobox
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select frameworks..."
      maxCount={2}
      className="w-[300px]"
      contentClassName="w-[300px]"
    />
  );
}

export const MaxCount: Story = {
  render: () => <MaxCountDemo />,
};

// ─── Hide Select All ────────────────────────

function HideSelectAllDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <AsyncMultiCombobox
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select frameworks..."
      hideSelectAll
    />
  );
}

export const HideSelectAll: Story = {
  render: () => <HideSelectAllDemo />,
};

// ─── Custom Label Function ────────────────────────

function CustomLabelDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <AsyncMultiCombobox
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select frameworks..."
      className="w-[300px]"
      contentClassName="w-[300px]"
      labelFunc={(option, isSelected) => (
        <div className="flex items-center gap-2">
          <span className="inline-flex size-5 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
            {option.label.charAt(0)}
          </span>
          <span>{option.label}</span>
          {isSelected && (
            <span className="ms-auto text-xs text-muted-foreground">
              selected
            </span>
          )}
        </div>
      )}
    />
  );
}

export const CustomLabel: Story = {
  render: () => <CustomLabelDemo />,
};

// ─── Async Search ────────────────────────

function AsyncSearchDemo() {
  const [value, setValue] = useState<string[]>([]);
  const [options, setOptions] = useState<AsyncMultiComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setOptions(
        allFrameworks.filter((f) =>
          f.label.toLowerCase().includes(query.toLowerCase())
        )
      );
      setLoading(false);
    }, 500);
  }, []);

  return (
    <AsyncMultiCombobox
      async
      options={options}
      value={value}
      onValueChange={setValue}
      onSearch={handleSearch}
      loading={loading}
      placeholder="Search frameworks..."
      searchPlaceholder="Type to search..."
      clearSearchOnClose
    />
  );
}

export const AsyncSearch: Story = {
  render: () => <AsyncSearchDemo />,
};

// ─── Async with Error ────────────────────────

function AsyncErrorDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <AsyncMultiCombobox
      async
      options={[]}
      value={value}
      onValueChange={setValue}
      error={new Error("Failed to fetch options. Please try again.")}
      placeholder="Search users..."
    />
  );
}

export const AsyncError: Story = {
  render: () => <AsyncErrorDemo />,
};

// ─── Async with Preselected ────────────────────────

function AsyncPreselectedDemo() {
  const [value, setValue] = useState<string[]>(["react", "vue"]);
  const [options, setOptions] = useState<AsyncMultiComboboxOption[]>(
    allFrameworks
  );
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((query: string) => {
    if (!query) {
      setOptions(allFrameworks);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setOptions(
        allFrameworks.filter((f) =>
          f.label.toLowerCase().includes(query.toLowerCase())
        )
      );
      setLoading(false);
    }, 400);
  }, []);

  return (
    <AsyncMultiCombobox
      async
      options={options}
      value={value}
      onValueChange={setValue}
      onSearch={handleSearch}
      loading={loading}
      placeholder="Search frameworks..."
      clearSearchOnClose
    />
  );
}

export const AsyncPreselected: Story = {
  render: () => <AsyncPreselectedDemo />,
};

// ─── Invalid ────────────────────────

function InvalidDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <AsyncMultiCombobox
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select frameworks..."
      invalid
    />
  );
}

export const Invalid: Story = {
  render: () => <InvalidDemo />,
};

// ─── Disabled ────────────────────────

export const Disabled: Story = {
  render: () => (
    <AsyncMultiCombobox
      options={allFrameworks}
      value={["react", "vue"]}
      onValueChange={() => {}}
      placeholder="Disabled combobox"
      disabled
    />
  ),
};

// ─── Custom Texts ────────────────────────

function CustomTextsDemo() {
  const [value, setValue] = useState<string[]>(["react"]);

  return (
    <AsyncMultiCombobox
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Choose options..."
      searchPlaceholder="Filter..."
      clearText="Remove all"
      closeText="Done"
    />
  );
}

export const CustomTexts: Story = {
  render: () => <CustomTextsDemo />,
};

// ─── Static (no server request) ────────────────────────

function StaticOptionsDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <AsyncMultiCombobox
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select frameworks..."
      searchPlaceholder="Filter frameworks..."
    />
  );
}

export const StaticOptions: Story = {
  render: () => <StaticOptionsDemo />,
};

// ─── Static with few options ────────────────────────

const statusOptions: AsyncMultiComboboxOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

function FewStaticOptionsDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <AsyncMultiCombobox
      options={statusOptions}
      value={value}
      onValueChange={setValue}
      placeholder="Select status..."
      hideSelectAll
      className="w-[200px]"
      contentClassName="w-[200px]"
    />
  );
}

export const FewStaticOptions: Story = {
  render: () => <FewStaticOptionsDemo />,
};
