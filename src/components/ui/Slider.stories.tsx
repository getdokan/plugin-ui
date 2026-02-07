import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./slider";

const meta = {
  title: "UI/Slider",
  component: Slider,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { options: ["default", "green", "purple", "brown", "danger"], control: { type: "select" } },
    size: { options: ["sm", "md", "lg"], control: { type: "select" } },
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultValue: [50] } };

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-64">
      <Slider size="sm" defaultValue={[50]} />
      <Slider size="md" defaultValue={[50]} />
      <Slider size="lg" defaultValue={[50]} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-64">
      <Slider variant="default" defaultValue={[60]} />
      <Slider variant="green" defaultValue={[60]} />
      <Slider variant="danger" defaultValue={[60]} />
    </div>
  ),
};
