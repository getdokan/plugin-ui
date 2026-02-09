import type { Meta, StoryObj } from "@storybook/react";
import { CrownIcon } from "./crown-icon";

const meta = {
  title: "Components/CrownIcon",
  component: CrownIcon,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
  },
} satisfies Meta<typeof CrownIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "text-primary text-4xl",
  },
};

export const Small: Story = {
  args: {
    className: "text-primary text-sm",
  },
};

export const Large: Story = {
  args: {
    className: "text-primary text-6xl",
  },
};

export const CustomColor: Story = {
  args: {
    className: "text-destructive text-4xl",
  },
};
