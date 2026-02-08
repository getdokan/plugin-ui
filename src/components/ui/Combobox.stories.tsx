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
} from "./combobox";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

const items = ["Apple", "Banana", "Orange", "Mango", "Grape"];

const meta = {
  title: "UI/Combobox",
  component: Combobox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic searchable combobox with a list of items.
 * Users can type to filter and select a single item.
 */
export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = useState<string | null>(null);

    return (
      <Combobox
        items={items}
        value={value}
        onValueChange={setValue}
      >
        <ComboboxInput placeholder="Search fruits..." className="w-64" />
        <ComboboxContent>
          <ComboboxList>
            {items.map((item) => (
              <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>No results found.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/**
 * Combobox with clear button to reset selection.
 * Useful when users need to easily clear their selection.
 */
export const WithClearButton: Story = {
  render: function WithClearButtonStory() {
    const [value, setValue] = useState<string | null>(null);

    return (
      <Combobox items={items} value={value} onValueChange={setValue}>
        <ComboboxInput placeholder="Search..." className="w-64" showClear />
        <ComboboxContent>
          <ComboboxList>
            {items.map((item) => (
              <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>No results found.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    );
  },
};

const groupedItems = ["apple", "banana", "orange", "carrot", "broccoli", "spinach"];

/**
 * Combobox with items organized into labeled groups with separators.
 * Useful for categorizing options in larger lists.
 */
export const WithGroups: Story = {
  render: function WithGroupsStory() {
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
  },
};

type MultiSelectItem = { value: string; label: string };

const multiSelectItems: MultiSelectItem[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "preact", label: "Preact" },
];

/**
 * Multi-select combobox with tag chips and optional search.
 * Selected items are displayed as removable tags. Supports controlled
 * and uncontrolled modes, max tag count, and searchable filtering.
 */
export const MultiSelect: Story = {
  render: function MultiSelectStory() {
    const [selectedValues, setSelectedValues] = useState<string[]>(["react", "vue"]);
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
            <ComboboxChip key={item.value}>
              {item.label}
            </ComboboxChip>
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
  },
};

/**
 * Multi-select with trigger button showing selected tags as pills.
 * Alternative presentation for multi-select where selections are
 * displayed in a compact trigger button with overflow indicator.
 */
export const MultiSelectWithTrigger: Story = {
  render: function MultiSelectTriggerStory() {
    const [selectedValues, setSelectedValues] = useState<string[]>(["react"]);

    const selectedItems = multiSelectItems.filter((item) =>
      selectedValues.includes(item.value)
    );

    const handleValueChange = (
      value: MultiSelectItem[] | MultiSelectItem | null
    ) => {
      const next = Array.isArray(value) ? value : value ? [value] : [];
      setSelectedValues(next.map((i) => i.value));
    };

    const maxTagCount = 2;
    const visibleTags = selectedItems.slice(0, maxTagCount);
    const remainingCount = Math.max(selectedItems.length - maxTagCount, 0);

    return (
      <Combobox
        items={multiSelectItems}
        multiple
        value={selectedItems}
        onValueChange={handleValueChange}
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.value}
      >
        <button
          type="button"
          className="inline-flex min-w-65 max-w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 text-left">
            {visibleTags.map((item) => (
              <span
                key={item.value}
                className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                {item.label}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                +{remainingCount}
              </span>
            )}
            {selectedItems.length === 0 && (
              <span className="text-muted-foreground">Select frameworks...</span>
            )}
          </div>
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
        <ComboboxContent>
          <ComboboxInput placeholder="Search..." className="m-1 mb-0" />
          <ComboboxList>
            {multiSelectItems.map((item) => (
              <ComboboxItem key={item.value} value={item} className="gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border border-border bg-background data-selected:border-primary data-selected:bg-primary data-selected:[&_svg]:text-primary-foreground">
                  {selectedValues.includes(item.value) && (
                    <CheckIcon className="h-3 w-3" />
                  )}
                </span>
                {item.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/**
 * Disabled combobox state. Input is not interactive.
 */
export const Disabled: Story = {
  render: () => (
    <Combobox items={items} value="Apple">
      <ComboboxInput placeholder="Disabled..." className="w-64" disabled />
      <ComboboxContent>
        <ComboboxList>
          {items.map((item) => (
            <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};
