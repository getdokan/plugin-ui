import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./index";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const;

const frameworkOptions = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const meta = {
  title: "UI/Combobox",
  component: Combobox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Base UI Combobox (Default) ────────────────────────

function ComboboxDefaultDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Combobox items={frameworks} value={value} onValueChange={setValue}>
      <ComboboxInput placeholder="Search frameworks..." className="w-64" />
      <ComboboxContent>
        <ComboboxList>
          {frameworks.map((item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          ))}
        </ComboboxList>
        <ComboboxEmpty>No results found.</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}

export const Default: Story = {
  render: () => <ComboboxDefaultDemo />,
};

// ─── With Clear Button ────────────────────────

function ComboboxWithClearDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Combobox items={frameworks} value={value} onValueChange={setValue}>
      <ComboboxInput
        placeholder="Search..."
        className="w-64"
        showClear
      />
      <ComboboxContent>
        <ComboboxList>
          {frameworks.map((item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          ))}
        </ComboboxList>
        <ComboboxEmpty>No results found.</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}

export const WithClearButton: Story = {
  render: () => <ComboboxWithClearDemo />,
};

// ─── With Groups ────────────────────────

const groupedItems = [
  "apple",
  "banana",
  "orange",
  "carrot",
  "broccoli",
  "spinach",
];

function ComboboxWithGroupsDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Combobox items={groupedItems} value={value} onValueChange={setValue}>
      <ComboboxInput placeholder="Select food..." className="w-64" />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxGroup>
            <ComboboxLabel>Fruits</ComboboxLabel>
            <ComboboxItem value="apple">Apple</ComboboxItem>
            <ComboboxItem value="banana">Banana</ComboboxItem>
            <ComboboxItem value="orange">Orange</ComboboxItem>
          </ComboboxGroup>
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxLabel>Vegetables</ComboboxLabel>
            <ComboboxItem value="carrot">Carrot</ComboboxItem>
            <ComboboxItem value="broccoli">Broccoli</ComboboxItem>
            <ComboboxItem value="spinach">Spinach</ComboboxItem>
          </ComboboxGroup>
        </ComboboxList>
        <ComboboxEmpty>No results found.</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}

export const WithGroups: Story = {
  render: () => <ComboboxWithGroupsDemo />,
};

// ─── Multi Select ────────────────────────

type MultiSelectItem = { value: string; label: string };

const multiSelectItems: MultiSelectItem[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "preact", label: "Preact" },
];

function ComboboxMultiSelectDemo() {
  const [selectedValues, setSelectedValues] = useState<string[]>([
    "react",
    "vue",
  ]);
  const anchorRef = useComboboxAnchor();

  const selectedItems = multiSelectItems.filter((item) =>
    selectedValues.includes(item.value)
  );

  const handleValueChange = (
    value: MultiSelectItem[] | MultiSelectItem | null
  ) => {
    const next = Array.isArray(value) ? value : value ? [value] : [];
    setSelectedValues(next.map((i) => i.value));
  };

  return (
    <Combobox
      items={multiSelectItems}
      multiple
      value={selectedItems}
      onValueChange={handleValueChange}
      itemToStringLabel={(item) => item.label}
      itemToStringValue={(item) => item.value}
    >
      <ComboboxChips ref={anchorRef} className="w-64">
        {selectedItems.map((item) => (
          <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
        ))}
        <ComboboxChipsInput placeholder="Search frameworks..." />
      </ComboboxChips>
      <ComboboxContent anchor={anchorRef}>
        <ComboboxList>
          {multiSelectItems.map((item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}

export const MultiSelect: Story = {
  render: () => <ComboboxMultiSelectDemo />,
};

// ─── Command + Popover Pattern (ShadCN Combobox Demo) ────────────────────────

function ComboboxCommandDemo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between border-input text-foreground font-normal"
          />
        }
      >
        {value
          ? frameworkOptions.find((f) => f.value === value)?.label
          : "Select framework..."}
        <ChevronsUpDownIcon className="opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworkOptions.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <CheckIcon
                    className={cn(
                      "ms-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const CommandPopover: Story = {
  render: () => <ComboboxCommandDemo />,
};

// ─── Status Popover (ShadCN Combobox Popover) ────────────────────────

type Status = { value: string; label: string };

const statuses: Status[] = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
];

function ComboboxPopoverDemo() {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Status</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="w-[150px] justify-start border-input text-foreground font-normal"
            />
          }
        >
          {selectedStatus ? selectedStatus.label : "+ Set status"}
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={(val) => {
                      setSelectedStatus(
                        statuses.find((s) => s.value === val) || null
                      );
                      setOpen(false);
                    }}
                  >
                    {status.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export const StatusPopover: Story = {
  render: () => <ComboboxPopoverDemo />,
};

// ─── Dropdown Menu with Command (ShadCN Combobox Dropdown) ────────────────────

const labels = [
  "feature",
  "bug",
  "enhancement",
  "documentation",
  "design",
  "question",
  "maintenance",
];

function ComboboxDropdownMenuDemo() {
  const [label, setLabel] = useState("feature");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col items-start justify-between rounded-md border border-border px-4 py-3 sm:flex-row sm:items-center">
      <p className="text-sm leading-none font-medium">
        <span className="mr-2 rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground">
          {label}
        </span>
        <span className="text-muted-foreground">Create a new project</span>
      </p>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="sm" />}
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Assign to...</DropdownMenuItem>
            <DropdownMenuItem>Set due date...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Apply label</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Filter label..."
                    autoFocus={true}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No label found.</CommandEmpty>
                    <CommandGroup>
                      {labels.map((l) => (
                        <CommandItem
                          key={l}
                          value={l}
                          onSelect={(val) => {
                            setLabel(val);
                            setOpen(false);
                          }}
                        >
                          {l}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const DropdownMenuWithCommand: Story = {
  render: () => <ComboboxDropdownMenuDemo />,
};

// ─── Disabled ────────────────────────

export const Disabled: Story = {
  render: () => (
    <Combobox items={frameworks} value="Next.js">
      <ComboboxInput placeholder="Disabled..." className="w-64" disabled />
      <ComboboxContent>
        <ComboboxList>
          {frameworks.map((item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};
