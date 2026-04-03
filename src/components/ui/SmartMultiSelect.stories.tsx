import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  SmartMultiSelect,
  type SmartMultiSelectOption,
  type SmartMultiSelectCreateContext,
} from "./smart-multi-select";
import { Input, Label, Button } from "./index";
import { UserIcon } from "lucide-react";

const allFrameworks: SmartMultiSelectOption[] = [
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
  title: "UI/SmartMultiSelect",
  component: SmartMultiSelect,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SmartMultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Basic (sync mode) ────────────────────────

function BasicDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <SmartMultiSelect
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
    <SmartMultiSelect
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
    <SmartMultiSelect
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select frameworks..."
      maxCount={2}
      className="w-[300px]"

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
    <SmartMultiSelect
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
    <SmartMultiSelect
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select frameworks..."
      className="w-[300px]"

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
  const [options, setOptions] = useState<SmartMultiSelectOption[]>([]);
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
    <SmartMultiSelect
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
    <SmartMultiSelect
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
  const [options, setOptions] = useState<SmartMultiSelectOption[]>(
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
    <SmartMultiSelect
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
    <SmartMultiSelect
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
    <SmartMultiSelect
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
    <SmartMultiSelect
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
    <SmartMultiSelect
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

const statusOptions: SmartMultiSelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

function FewStaticOptionsDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <SmartMultiSelect
      options={statusOptions}
      value={value}
      onValueChange={setValue}
      placeholder="Select status..."
      hideSelectAll
      className="w-[200px]"

    />
  );
}

export const FewStaticOptions: Story = {
  render: () => <FewStaticOptionsDemo />,
};

// ─── Disabled Search ────────────────────────

function DisabledSearchDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <SmartMultiSelect
      options={statusOptions}
      value={value}
      onValueChange={setValue}
      placeholder="Select status..."
      hideSelectAll
      disableSearch
      className="w-[200px]"
    />
  );
}

export const DisabledSearch: Story = {
  render: () => <DisabledSearchDemo />,
};

// ─── Create with Default Form ────────────────────────

function CreateDefaultDemo() {
  const [value, setValue] = useState<string[]>([]);
  const [options, setOptions] = useState<SmartMultiSelectOption[]>([
    ...allFrameworks,
  ]);

  return (
    <SmartMultiSelect
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select or create..."
      className="w-[280px]"
      onCreate={(name, done) => {
        const newOption = { value: name.toLowerCase(), label: name };
        setOptions((prev) => [...prev, newOption]);
        done(newOption.value);
      }}
      selectOnCreate
    />
  );
}

export const CreateDefault: Story = {
  render: () => <CreateDefaultDemo />,
};

// ─── Create with Custom Form ────────────────────────

function MultiCreateForm({
  ctx,
  onCreated,
}: {
  ctx: SmartMultiSelectCreateContext;
  onCreated: (option: SmartMultiSelectOption) => void;
}) {
  const [name, setName] = useState(ctx.searchValue);
  return (
    <div className="p-3 border-t border-border space-y-2">
      <p className="text-sm font-medium">Create new item</p>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name..."
        autoFocus
        onKeyDown={(e) => e.stopPropagation()}
      />
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={() => ctx.clearSearch()}>
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={!name.trim()}
          onClick={() => {
            onCreated({ value: name.toLowerCase(), label: name });
            ctx.clearSearch();
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
}

function CreateCustomFormDemo() {
  const [value, setValue] = useState<string[]>([]);
  const [options, setOptions] = useState<SmartMultiSelectOption[]>([
    ...allFrameworks,
  ]);

  const addOption = (opt: SmartMultiSelectOption) => {
    setOptions((prev) => [...prev, opt]);
    setValue((prev) => [...prev, opt.value]);
  };

  return (
    <SmartMultiSelect
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select or create..."
      className="w-[300px]"
      renderCreateForm={(ctx) => (
        <MultiCreateForm ctx={ctx} onCreated={addOption} />
      )}
    />
  );
}

export const CreateCustomForm: Story = {
  render: () => <CreateCustomFormDemo />,
};

// ─── Create with Complex Form ────────────────────────

function MultiComplexCreateForm({
  ctx,
  onCreated,
}: {
  ctx: SmartMultiSelectCreateContext;
  onCreated: (option: SmartMultiSelectOption) => void;
}) {
  const [name, setName] = useState(ctx.searchValue);
  const [description, setDescription] = useState("");
  return (
    <div className="p-3 border-t border-border space-y-3">
      <p className="text-sm font-medium">Create new framework</p>
      <div className="space-y-1.5">
        <Label className="text-xs">Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Framework name..."
          autoFocus
          onKeyDown={(e) => e.stopPropagation()}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description..."
          onKeyDown={(e) => e.stopPropagation()}
        />
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <Button variant="outline" size="sm" onClick={() => ctx.clearSearch()}>
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={!name.trim()}
          onClick={() => {
            onCreated({ value: name.toLowerCase(), label: name });
            ctx.clearSearch();
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
}

function CreateComplexFormDemo() {
  const [value, setValue] = useState<string[]>([]);
  const [options, setOptions] = useState<SmartMultiSelectOption[]>([
    ...allFrameworks,
  ]);

  const addOption = (opt: SmartMultiSelectOption) => {
    setOptions((prev) => [...prev, opt]);
    setValue((prev) => [...prev, opt.value]);
  };

  return (
    <SmartMultiSelect
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select or create..."
      className="w-[350px]"
      renderCreateForm={(ctx) => (
        <MultiComplexCreateForm ctx={ctx} onCreated={addOption} />
      )}
    />
  );
}

export const CreateComplexForm: Story = {
  render: () => <CreateComplexFormDemo />,
};

// ─── With Start Icon ────────────────────────

function WithStartIconDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <SmartMultiSelect
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select users..."
      startIcon={<UserIcon />}
    />
  );
}

export const WithStartIcon: Story = {
  render: () => <WithStartIconDemo />,
};

// ─── No Chevron ────────────────────────

function NoChevronDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <SmartMultiSelect
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select frameworks..."
      showChevron={false}
    />
  );
}

export const NoChevron: Story = {
  render: () => <NoChevronDemo />,
};

// ─── Start Icon + No End Icon ────────────────────────

function StartIconNoEndDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <SmartMultiSelect
      options={allFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select users..."
      startIcon={<UserIcon />}
      endIcon={null}
    />
  );
}

export const StartIconNoEndIcon: Story = {
  render: () => <StartIconNoEndDemo />,
};
