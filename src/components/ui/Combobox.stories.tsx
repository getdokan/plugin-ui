import type { Meta, StoryObj } from "@storybook/react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  useComboboxAnchor,
} from "./combobox";

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"] as const;

const meta = {
  title: "UI/Combobox",
  component: Combobox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

const ComboboxDemo = () => {
  const anchor = useComboboxAnchor();
  return (
    <div className="w-64">
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Select a framework" ref={anchor} />
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export const Default: Story = {
  render: () => <ComboboxDemo />,
};
