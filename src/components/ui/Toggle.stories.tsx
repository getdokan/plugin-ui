import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./toggle";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { options: ["default", "outline"], control: { type: "select" } },
    size: { options: ["default", "sm", "lg"], control: { type: "select" } },
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Toggle" } };
export const Outline: Story = { args: { variant: "outline", children: "Outline" } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle size="sm">Sm</Toggle>
      <Toggle>Default</Toggle>
      <Toggle size="lg">Lg</Toggle>
    </div>
  ),
};

export const Pressed: Story = { args: { "aria-pressed": true, children: "Pressed" } };
