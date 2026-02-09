import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { ButtonToggleGroup } from "./button-toggle-group";
import { LayoutGrid, List, Table } from "lucide-react";
import React from "react";

const meta = {
  title: "Components/ButtonToggleGroup",
  component: ButtonToggleGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
  argTypes: {
    size: {
      options: ["default", "sm", "lg"],
      control: { type: "radio" },
    },
    value: { control: "text" },
    defaultValue: { control: "text" },
  },
} satisfies Meta<typeof ButtonToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const items = [
  { value: "grid", label: "Grid", startIcon: <LayoutGrid size={16} /> },
  { value: "list", label: "List", startIcon: <List size={16} /> },
  { value: "table", label: "Table", startIcon: <Table size={16} /> },
];

export const Default: Story = {
  args: {
    items,
    defaultValue: "grid",
  },
};

export const Small: Story = {
  args: {
    items,
    defaultValue: "grid",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    items,
    defaultValue: "grid",
    size: "lg",
  },
};

export const WithoutIcons: Story = {
  args: {
    items: [
      { value: "day", label: "Day" },
      { value: "week", label: "Week" },
      { value: "month", label: "Month" },
    ],
    defaultValue: "week",
  },
};

export const EndIcons: Story = {
  args: {
    items: [
      { value: "asc", label: "Ascending", endIcon: <span>↑</span> },
      { value: "desc", label: "Descending", endIcon: <span>↓</span> },
    ],
    defaultValue: "asc",
  },
};
