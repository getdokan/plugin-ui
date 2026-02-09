import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { MatricsCard } from "./matrics-card";
import { Users, Info } from "lucide-react";
import React from "react";

const meta = {
  title: "Components/MatricsCard",
  component: MatricsCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
  args: {
    onCardClick: fn(),
  },
  argTypes: {
    countDirection: {
      options: ["up", "down", "neutral"],
      control: { type: "radio" },
    },
    value: { control: "text" },
    count: { control: "text" },
    shortDescription: { control: "text" },
    tooltip: { control: "text" },
  },
} satisfies Meta<typeof MatricsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Users />,
    value: "1,234",
    shortDescription: "Total Users",
  },
};

export const WithCountUp: Story = {
  args: {
    icon: <Users />,
    value: "1,234",
    count: "+12%",
    countDirection: "up",
    shortDescription: "Total Users",
  },
};

export const WithCountDown: Story = {
  args: {
    icon: <Users />,
    value: "1,234",
    count: "-5%",
    countDirection: "down",
    shortDescription: "Total Users",
  },
};

export const WithTooltip: Story = {
  args: {
    icon: <Users />,
    value: "1,234",
    shortDescription: "Total Users",
    tooltip: "This is a tooltip explaining the metric",
    tooltipIcon: <Info />,
  },
};
