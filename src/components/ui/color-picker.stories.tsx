import type { Meta, StoryObj } from "@storybook/react";
import { ColorPicker } from "./color-picker";
import { useState } from "react";

const meta = {
  title: "UI/ColorPicker",
  component: ColorPicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    value: { control: "color" },
    disabled: { control: "boolean" },
    enableAlpha: { control: "boolean" },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "#3b82f6",
  },
};

export const Disabled: Story = {
  args: {
    value: "#ef4444",
    disabled: true,
  },
};

export const WithoutAlpha: Story = {
  args: {
    value: "#10b981",
    enableAlpha: false,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [color, setColor] = useState(args.value || "#8b5cf6");
    return (
      <div className="flex flex-col gap-4 items-center">
        <ColorPicker {...args} value={color} onChange={setColor} />
        <div className="text-sm font-mono bg-muted p-2 rounded">
          Current color: {color}
        </div>
      </div>
    );
  },
  args: {
    value: "#8b5cf6",
  },
};
