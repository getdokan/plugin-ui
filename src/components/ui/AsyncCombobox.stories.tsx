import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AsyncCombobox,
  type AsyncComboboxOption,
} from "./async-combobox";

const allFrameworks: AsyncComboboxOption[] = [
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
  data: AsyncComboboxOption[],
  delay = 500
) {
  const [options, setOptions] = useState<AsyncComboboxOption[]>([]);
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
  title: "UI/AsyncCombobox",
  component: AsyncCombobox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AsyncCombobox>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Basic ────────────────────────

function AsyncComboboxBasicDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(allFrameworks);

  return (
    <AsyncCombobox
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
  render: () => <AsyncComboboxBasicDemo />,
};

// ─── Clear Button ────────────────────────

function AsyncComboboxClearDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(allFrameworks);

  return (
    <AsyncCombobox
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
  render: () => <AsyncComboboxClearDemo />,
};

// ─── Custom Items (with description) ────────────────────────

const frameworksWithDesc: AsyncComboboxOption[] = [
  { value: "next.js", label: "Next.js", description: "The React Framework" },
  { value: "remix", label: "Remix", description: "Build better websites" },
  { value: "astro", label: "Astro", description: "The web framework for content" },
  { value: "nuxt", label: "Nuxt", description: "The Intuitive Vue Framework" },
  { value: "sveltekit", label: "SvelteKit", description: "Web development, streamlined" },
];

function AsyncComboboxCustomItemsDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(frameworksWithDesc);

  return (
    <AsyncCombobox
      onSearch={handleSearch}
      options={options}
      value={value}
      onValueChange={setValue}
      loading={loading}
      placeholder="Search frameworks..."
      className="w-[300px]"
      contentClassName="w-[300px]"
    />
  );
}

export const CustomItems: Story = {
  render: () => <AsyncComboboxCustomItemsDemo />,
};

// ─── Custom Render ────────────────────────

function AsyncComboboxCustomRenderDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(frameworksWithDesc);

  return (
    <AsyncCombobox
      onSearch={handleSearch}
      options={options}
      value={value}
      onValueChange={setValue}
      loading={loading}
      placeholder="Search frameworks..."
      className="w-[300px]"
      contentClassName="w-[300px]"
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
  render: () => <AsyncComboboxCustomRenderDemo />,
};

// ─── Groups ────────────────────────

const groupedFrameworks: AsyncComboboxOption[] = [
  { value: "next.js", label: "Next.js", group: "React" },
  { value: "remix", label: "Remix", group: "React" },
  { value: "gatsby", label: "Gatsby", group: "React" },
  { value: "nuxt", label: "Nuxt", group: "Vue" },
  { value: "sveltekit", label: "SvelteKit", group: "Svelte" },
  { value: "astro", label: "Astro", group: "Multi-framework" },
  { value: "angular", label: "Angular", group: "Standalone" },
];

function AsyncComboboxGroupsDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(groupedFrameworks);

  return (
    <AsyncCombobox
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
  render: () => <AsyncComboboxGroupsDemo />,
};

// ─── Custom Messages ────────────────────────

function AsyncComboboxCustomMessagesDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(allFrameworks, 800);

  return (
    <AsyncCombobox
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
  render: () => <AsyncComboboxCustomMessagesDemo />,
};

// ─── User Search (with disabled items) ────────────────────────

function AsyncComboboxUsersDemo() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<AsyncComboboxOption[]>([]);
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
    <AsyncCombobox
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
      contentClassName="w-[300px]"
    />
  );
}

export const UserSearch: Story = {
  render: () => <AsyncComboboxUsersDemo />,
};

// ─── Invalid ────────────────────────

function AsyncComboboxInvalidDemo() {
  const [value, setValue] = useState("");
  const { options, loading, handleSearch } = useAsyncSearch(allFrameworks);

  return (
    <AsyncCombobox
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
  render: () => <AsyncComboboxInvalidDemo />,
};

// ─── Disabled ────────────────────────

export const Disabled: Story = {
  render: () => (
    <AsyncCombobox
      onSearch={() => {}}
      options={[]}
      disabled
      placeholder="Disabled combobox"
    />
  ),
};

// ─── Preselected ────────────────────────

function AsyncComboboxPreselectedDemo() {
  const [value, setValue] = useState("react");
  const [options, setOptions] = useState<AsyncComboboxOption[]>(allFrameworks);
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
    <AsyncCombobox
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
  render: () => <AsyncComboboxPreselectedDemo />,
};

// ─── Static (no server request) ────────────────────────

const staticOptions: AsyncComboboxOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function AsyncComboboxStaticDemo() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState(allFrameworks);

  return (
    <AsyncCombobox
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
  render: () => <AsyncComboboxStaticDemo />,
};

// ─── Static with few options ────────────────────────

function AsyncComboboxFewOptionsDemo() {
  const [value, setValue] = useState("");

  return (
    <AsyncCombobox
      onSearch={() => {}}
      options={staticOptions}
      value={value}
      onValueChange={setValue}
      placeholder="Select status..."
      idleMessage="Choose a status"
      showClear
      className="w-[180px]"
      contentClassName="w-[180px]"
    />
  );
}

export const FewStaticOptions: Story = {
  render: () => <AsyncComboboxFewOptionsDemo />,
};
