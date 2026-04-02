import type { Meta, StoryObj } from "@storybook/react";
import AsyncCombobox from "./async-combobox";

const meta = {
  title: "UI/AsyncCombobox",
  component: AsyncCombobox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AsyncCombobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AsyncCombobox />,
};
