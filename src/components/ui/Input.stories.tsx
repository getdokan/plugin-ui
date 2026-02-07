import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    type: {
      options: ["text", "email", "password", "number"],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Change the Controls below; the story updates live. Try placeholder, disabled, or type. */
export const WithControls: Story = {
  args: {
    placeholder: "Edit me in Controls",
    disabled: false,
    type: "text",
  },
};

export const Default: Story = { args: { placeholder: "Placeholder text" } };

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" {...args} />
    </div>
  ),
  args: { placeholder: "you@example.com" },
};

export const Password: Story = { args: { type: "password", placeholder: "Enter password" } };
export const Disabled: Story = { args: { disabled: true, placeholder: "Disabled input" } };
