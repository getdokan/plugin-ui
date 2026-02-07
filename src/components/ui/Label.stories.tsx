import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";
import { Input } from "./input";

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text", description: "Label text" },
    required: { control: "boolean", description: "Show required indicator" },
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Change the Controls below; the story updates live. Try editing the label text or toggling Required. */
export const WithControls: Story = {
  args: {
    children: "Edit this in Controls",
    required: false,
  },
};

export const Default: Story = { args: { children: "Label text" } };
export const Required: Story = { args: { children: "Required field", required: true } };

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Enter name" />
    </div>
  ),
};
