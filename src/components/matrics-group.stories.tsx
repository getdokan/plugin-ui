import type { Meta, StoryObj } from "@storybook/react";
import { MatricsGroup, MatricsGroupItem } from "./matrics-group";
import { Users, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import React from "react";

const meta = {
  title: "Components/MatricsGroup",
  component: MatricsGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MatricsGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <MatricsGroup>
      <MatricsGroupItem
        icon={<Users />}
        label="Total Users"
        value="2,345"
        change="+15%"
        changeDirection="up"
        tooltip="Total number of registered users"
      />
      <MatricsGroupItem
        icon={<CreditCard />}
        label="Revenue"
        value="$12,345"
        change="+5%"
        changeDirection="up"
        tooltip="Total revenue generated"
      />
      <MatricsGroupItem
        icon={<ArrowUpRight />}
        label="Conversions"
        value="456"
        change="-2%"
        changeDirection="down"
        tooltip="Number of successful conversions"
      />
      <MatricsGroupItem
        icon={<ArrowDownRight />}
        label="Bounce Rate"
        value="32%"
        change="Neutral"
        changeDirection="neutral"
        tooltip="Percentage of users who bounced"
      />
    </MatricsGroup>
  ),
};

export const SingleItem: Story = {
  render: () => (
    <MatricsGroup className="max-w-xs">
      <MatricsGroupItem
        icon={<Users />}
        label="Total Users"
        value="2,345"
        change="+15%"
        changeDirection="up"
      />
    </MatricsGroup>
  ),
};
