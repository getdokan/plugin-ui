import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <ToggleGroup type="single">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline">
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
    </ToggleGroup>
  ),
};
