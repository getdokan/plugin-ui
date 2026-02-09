import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SelectionType, SelectionItem } from "./selection-type";

function SelectionTypeDemo() {
  const [value, setValue] = useState("option1");
  return (
    <SelectionType value={value} onValueChange={setValue} className="w-72">
      <SelectionItem value="option1">Option 1</SelectionItem>
      <SelectionItem value="option2">Option 2</SelectionItem>
      <SelectionItem value="option3">Option 3</SelectionItem>
    </SelectionType>
  );
}

const meta = {
  title: "UI/SelectionType",
  component: SelectionType,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SelectionType>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <SelectionTypeDemo /> };

export const Sizes: Story = {
  render: () => {
    function SizesDemo() {
      const [v, setV] = useState("md");
      return (
        <SelectionType value={v} onValueChange={setV} className="w-72">
          <SelectionItem value="xs" size="xs">
            Extra Small
          </SelectionItem>
          <SelectionItem value="sm" size="sm">
            Small
          </SelectionItem>
          <SelectionItem value="md" size="md">
            Medium
          </SelectionItem>
          <SelectionItem value="lg" size="lg">
            Large
          </SelectionItem>
          <SelectionItem value="xl" size="xl">
            Extra Large
          </SelectionItem>
        </SelectionType>
      );
    }
    return <SizesDemo />;
  },
};
