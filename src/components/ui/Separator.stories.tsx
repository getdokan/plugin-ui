import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { orientation: { options: ["horizontal", "vertical"], control: { type: "select" } } },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Separator /> };

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center gap-2">
      <span>Left</span>
      <Separator orientation="vertical" className="h-6" />
      <span>Right</span>
    </div>
  ),
};

export const InLayout: Story = {
  render: () => (
    <div className="w-[200px]">
      <p>Above</p>
      <Separator className="my-4" />
      <p>Below</p>
    </div>
  ),
};
