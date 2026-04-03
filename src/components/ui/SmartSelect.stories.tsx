import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  SmartSelect,
  type SmartSelectOption,
  type SmartSelectCreateContext,
} from "./smart-select";
import { Input, Label, Button } from "./index";
import { SearchIcon, UserIcon } from "lucide-react";

const allFrameworks: SmartSelectOption[] = [
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

function useAsyncSearch(
  data: SmartSelectOption[],
  delay = 500
) {
  const [options, setOptions] = useState<SmartSelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(
    (query: string) => {
      if (!query) {
        setOptions([]);
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setOptions(
          data.filter((f) =>
            f.label.toLowerCase().includes(query.toLowerCase())
          )
        );
        setLoading(false);
      }, delay);
    },
    [data, delay]
  );

  return { options, loading, handleSearch };
}

const meta = {
  title: "UI/SmartSelect",
  component: SmartSelect,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SmartSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Basic ────────────────────────

function SmartSelectBasicDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(allFrameworks);

  return (
    <SmartSelect
      onSearch={handleSearch}
      options={options}
      value={value}
      onValueChange={setValue}
      loading={loading}
      placeholder="Search frameworks..."
      searchPlaceholder="Type a framework name..."
    />
  );
}

export const Basic: Story = {
  render: () => <SmartSelectBasicDemo />,
};

// ─── Clear Button ────────────────────────

function SmartSelectClearDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(allFrameworks);

  return (
    <SmartSelect
      onSearch={handleSearch}
      options={options}
      value={value}
      onValueChange={setValue}
      loading={loading}
      placeholder="Search frameworks..."
      showClear
    />
  );
}

export const ClearButton: Story = {
  render: () => <SmartSelectClearDemo />,
};

// ─── Custom Items (with description) ────────────────────────

const frameworksWithDesc: SmartSelectOption[] = [
  { value: "next.js", label: "Next.js", description: "The React Framework" },
  { value: "remix", label: "Remix", description: "Build better websites" },
  { value: "astro", label: "Astro", description: "The web framework for content" },
  { value: "nuxt", label: "Nuxt", description: "The Intuitive Vue Framework" },
  { value: "sveltekit", label: "SvelteKit", description: "Web development, streamlined" },
];

function SmartSelectCustomItemsDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(frameworksWithDesc);

  return (
    <SmartSelect
      onSearch={handleSearch}
      options={options}
      value={value}
      onValueChange={setValue}
      loading={loading}
      placeholder="Search frameworks..."
      className="w-[300px]"

    />
  );
}

export const CustomItems: Story = {
  render: () => <SmartSelectCustomItemsDemo />,
};

// ─── Custom Render ────────────────────────

function SmartSelectCustomRenderDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(frameworksWithDesc);

  return (
    <SmartSelect
      onSearch={handleSearch}
      options={options}
      value={value}
      onValueChange={setValue}
      loading={loading}
      placeholder="Search frameworks..."
      className="w-[300px]"

      renderOption={(option, isSelected) => (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
              {option.label.charAt(0)}
            </span>
            <div className="flex flex-col">
              <span className="font-medium">{option.label}</span>
              {option.description && (
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              )}
            </div>
          </div>
          {isSelected && (
            <span className="text-primary text-xs font-medium">Selected</span>
          )}
        </div>
      )}
    />
  );
}

export const CustomRender: Story = {
  render: () => <SmartSelectCustomRenderDemo />,
};

// ─── Groups ────────────────────────

const groupedFrameworks: SmartSelectOption[] = [
  { value: "next.js", label: "Next.js", group: "React" },
  { value: "remix", label: "Remix", group: "React" },
  { value: "gatsby", label: "Gatsby", group: "React" },
  { value: "nuxt", label: "Nuxt", group: "Vue" },
  { value: "sveltekit", label: "SvelteKit", group: "Svelte" },
  { value: "astro", label: "Astro", group: "Multi-framework" },
  { value: "angular", label: "Angular", group: "Standalone" },
];

function SmartSelectGroupsDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(groupedFrameworks);

  return (
    <SmartSelect
      onSearch={handleSearch}
      options={options}
      value={value}
      onValueChange={setValue}
      loading={loading}
      placeholder="Search frameworks..."
    />
  );
}

export const Groups: Story = {
  render: () => <SmartSelectGroupsDemo />,
};

// ─── Custom Messages ────────────────────────

function SmartSelectCustomMessagesDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(allFrameworks, 800);

  return (
    <SmartSelect
      onSearch={handleSearch}
      options={options}
      value={value}
      onValueChange={setValue}
      loading={loading}
      placeholder="Find a framework..."
      searchPlaceholder="Search..."
      emptyMessage="Nothing matches your search."
      idleMessage="Type at least one character to search"
    />
  );
}

export const CustomMessages: Story = {
  render: () => <SmartSelectCustomMessagesDemo />,
};

// ─── User Search (with disabled items) ────────────────────────

function SmartSelectUsersDemo() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<SmartSelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setOptions([
        { value: "user-1", label: `${query} Smith` },
        { value: "user-2", label: `${query} Johnson` },
        { value: "user-3", label: `${query} Williams` },
        {
          value: "user-4",
          label: `${query} Brown (inactive)`,
          disabled: true,
        },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <SmartSelect
      onSearch={handleSearch}
      options={options}
      value={value}
      onValueChange={setValue}
      loading={loading}
      placeholder="Search users..."
      searchPlaceholder="Name or email..."
      emptyMessage="No users found."
      idleMessage="Search by name or email"
      showClear
      className="w-[300px]"

    />
  );
}

export const UserSearch: Story = {
  render: () => <SmartSelectUsersDemo />,
};

// ─── Invalid ────────────────────────

function SmartSelectInvalidDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(allFrameworks);

  return (
    <SmartSelect
      onSearch={handleSearch}
      options={options}
      value={value}
      onValueChange={setValue}
      loading={loading}
      placeholder="Select framework..."
      invalid
    />
  );
}

export const Invalid: Story = {
  render: () => <SmartSelectInvalidDemo />,
};

// ─── Disabled ────────────────────────

export const Disabled: Story = {
  render: () => (
    <SmartSelect
      onSearch={() => {}}
      options={[]}
      disabled
      placeholder="Disabled combobox"
    />
  ),
};

// ─── Preselected ────────────────────────

function SmartSelectPreselectedDemo() {
  const [value, setValue] = useState("react");
  const [options, setOptions] = useState<SmartSelectOption[]>(allFrameworks);
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
    }, 300);
  }, []);

  return (
    <SmartSelect
      onSearch={handleSearch}
      options={options}
      value={value}
      onValueChange={setValue}
      loading={loading}
      placeholder="Search frameworks..."
      idleMessage="Showing all frameworks"
      showClear
    />
  );
}

export const Preselected: Story = {
  render: () => <SmartSelectPreselectedDemo />,
};

// ─── Static (no server request) ────────────────────────

const staticOptions: SmartSelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function SmartSelectStaticDemo() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState(allFrameworks);

  return (
    <SmartSelect
      onSearch={(query) => {
        if (!query) {
          setOptions(allFrameworks);
          return;
        }
        setOptions(
          allFrameworks.filter((f) =>
            f.label.toLowerCase().includes(query.toLowerCase())
          )
        );
      }}
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select framework..."
      idleMessage="All frameworks"
      showClear
    />
  );
}

export const StaticOptions: Story = {
  render: () => <SmartSelectStaticDemo />,
};

// ─── Static with few options ────────────────────────

function SmartSelectFewOptionsDemo() {
  const [value, setValue] = useState("");

  return (
    <SmartSelect
      onSearch={() => {}}
      options={staticOptions}
      value={value}
      onValueChange={setValue}
      placeholder="Select status..."
      idleMessage="Choose a status"
      showClear
      className="w-[180px]"

    />
  );
}

export const FewStaticOptions: Story = {
  render: () => <SmartSelectFewOptionsDemo />,
};

// ─── Disabled Search ────────────────────────

function SmartSelectNoSearchDemo() {
  const [value, setValue] = useState("");

  return (
    <SmartSelect
      onSearch={() => {}}
      options={[...staticOptions]}
      value={value}
      onValueChange={setValue}
      placeholder="Select status..."
      idleMessage="Choose a status"
      disableSearch
      className="w-[180px]"

    />
  );
}

export const DisabledSearch: Story = {
  render: () => <SmartSelectNoSearchDemo />,
};

// ─── Create with Default Form ────────────────────────

function SmartSelectCreateDefaultDemo() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<SmartSelectOption[]>([...allFrameworks]);
  const [filteredOptions, setFilteredOptions] = useState<SmartSelectOption[]>([
    ...allFrameworks,
  ]);

  return (
    <SmartSelect
      onSearch={(query) => {
        if (!query) {
          setFilteredOptions(options);
          return;
        }
        setFilteredOptions(
          options.filter((f) =>
            f.label.toLowerCase().includes(query.toLowerCase())
          )
        );
      }}
      options={filteredOptions}
      value={value}
      onValueChange={setValue}
      placeholder="Select or create..."
      idleMessage="All frameworks"
      showClear
      className="w-[280px]"

      onCreate={(name, done) => {
        const newOption = { value: name.toLowerCase(), label: name };
        setOptions((prev) => {
          const updated = [...prev, newOption];
          setFilteredOptions(updated);
          return updated;
        });
        done(newOption.value);
      }}
      selectOnCreate
    />
  );
}

export const CreateDefault: Story = {
  render: () => <SmartSelectCreateDefaultDemo />,
};

// ─── Create with Custom Form (simple) ────────────────────────

function SimpleCreateForm({
  ctx,
  onCreated,
}: {
  ctx: SmartSelectCreateContext;
  onCreated: (option: SmartSelectOption) => void;
}) {
  const [name, setName] = useState(ctx.searchValue);
  return (
    <div className="p-3 border-t border-border space-y-2">
      <p className="text-sm font-medium">Create new framework</p>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Framework name..."
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

function SmartSelectCreateCustomSimpleDemo() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<SmartSelectOption[]>([...allFrameworks]);
  const [filteredOptions, setFilteredOptions] = useState<SmartSelectOption[]>([
    ...allFrameworks,
  ]);

  const addOption = (opt: SmartSelectOption) => {
    setOptions((prev) => {
      const updated = [...prev, opt];
      setFilteredOptions(updated);
      return updated;
    });
    setValue(opt.value);
  };

  return (
    <SmartSelect
      onSearch={(query) => {
        if (!query) {
          setFilteredOptions(options);
          return;
        }
        setFilteredOptions(
          options.filter((f) =>
            f.label.toLowerCase().includes(query.toLowerCase())
          )
        );
      }}
      options={filteredOptions}
      value={value}
      onValueChange={setValue}
      placeholder="Select or create..."
      idleMessage="All frameworks"
      showClear
      className="w-[300px]"

      renderCreateForm={(ctx) => (
        <SimpleCreateForm ctx={ctx} onCreated={addOption} />
      )}
    />
  );
}

export const CreateCustomSimple: Story = {
  render: () => <SmartSelectCreateCustomSimpleDemo />,
};

// ─── Create with Custom Form (complex) ────────────────────────

function ComplexCreateForm({
  ctx,
  onCreated,
}: {
  ctx: SmartSelectCreateContext;
  onCreated: (option: SmartSelectOption) => void;
}) {
  const [name, setName] = useState(ctx.searchValue);
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState("");
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
      <div className="space-y-1.5">
        <Label className="text-xs">Category</Label>
        <Input
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          placeholder="e.g. React, Vue..."
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
            onCreated({
              value: name.toLowerCase(),
              label: name,
              description: description || undefined,
              group: group || undefined,
            });
            ctx.clearSearch();
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
}

function SmartSelectCreateCustomComplexDemo() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<SmartSelectOption[]>([...allFrameworks]);
  const [filteredOptions, setFilteredOptions] = useState<SmartSelectOption[]>([
    ...allFrameworks,
  ]);

  const addOption = (opt: SmartSelectOption) => {
    setOptions((prev) => {
      const updated = [...prev, opt];
      setFilteredOptions(updated);
      return updated;
    });
    setValue(opt.value);
  };

  return (
    <SmartSelect
      onSearch={(query) => {
        if (!query) {
          setFilteredOptions(options);
          return;
        }
        setFilteredOptions(
          options.filter((f) =>
            f.label.toLowerCase().includes(query.toLowerCase())
          )
        );
      }}
      options={filteredOptions}
      value={value}
      onValueChange={setValue}
      placeholder="Select or create..."
      idleMessage="All frameworks"
      showClear
      className="w-[350px]"

      renderCreateForm={(ctx) => (
        <ComplexCreateForm ctx={ctx} onCreated={addOption} />
      )}
    />
  );
}

export const CreateCustomComplex: Story = {
  render: () => <SmartSelectCreateCustomComplexDemo />,
};

// ─── With Start Icon ────────────────────────

function SmartSelectStartIconDemo() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState(allFrameworks);

  return (
    <SmartSelect
      onSearch={(query) => {
        if (!query) { setOptions(allFrameworks); return; }
        setOptions(allFrameworks.filter((f) => f.label.toLowerCase().includes(query.toLowerCase())));
      }}
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Guest Customer"
      idleMessage="All customers"
      startIcon={<UserIcon />}
      showClear
    />
  );
}

export const WithStartIcon: Story = {
  render: () => <SmartSelectStartIconDemo />,
};

// ─── Custom End Icon ────────────────────────

function SmartSelectCustomEndIconDemo() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState(allFrameworks);

  return (
    <SmartSelect
      onSearch={(query) => {
        if (!query) { setOptions(allFrameworks); return; }
        setOptions(allFrameworks.filter((f) => f.label.toLowerCase().includes(query.toLowerCase())));
      }}
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Search..."
      idleMessage="All frameworks"
      endIcon={<SearchIcon />}
    />
  );
}

export const CustomEndIcon: Story = {
  render: () => <SmartSelectCustomEndIconDemo />,
};

// ─── No Chevron ────────────────────────

function SmartSelectNoChevronDemo() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState(allFrameworks);

  return (
    <SmartSelect
      onSearch={(query) => {
        if (!query) { setOptions(allFrameworks); return; }
        setOptions(allFrameworks.filter((f) => f.label.toLowerCase().includes(query.toLowerCase())));
      }}
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select framework..."
      idleMessage="All frameworks"
      showChevron={false}
      showClear
    />
  );
}

export const NoChevron: Story = {
  render: () => <SmartSelectNoChevronDemo />,
};

// ─── Start Icon + No End Icon ────────────────────────

function SmartSelectStartIconNoEndDemo() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState(allFrameworks);

  return (
    <SmartSelect
      onSearch={(query) => {
        if (!query) { setOptions(allFrameworks); return; }
        setOptions(allFrameworks.filter((f) => f.label.toLowerCase().includes(query.toLowerCase())));
      }}
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Guest Customer"
      idleMessage="All customers"
      startIcon={<UserIcon />}
      endIcon={null}
      showClear
    />
  );
}

export const StartIconNoEndIcon: Story = {
  render: () => <SmartSelectStartIconNoEndDemo />,
};
