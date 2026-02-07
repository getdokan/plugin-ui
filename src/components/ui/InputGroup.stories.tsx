import type { Meta, StoryObj } from "@storybook/react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Button } from "./button";

const meta = {
  title: "UI/InputGroup",
  component: InputGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithAddonStart: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupAddon>https://</InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  ),
};

export const WithAddonEnd: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupInput placeholder="Username" />
      <InputGroupAddon align="inline-end">.com</InputGroupAddon>
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <InputGroup className="w-72">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <Button type="button" size="xs">Search</Button>
      </InputGroupAddon>
    </InputGroup>
  ),
};
