import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";
import { Label } from "./label";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { placeholder: { control: "text" }, disabled: { control: "boolean" } },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: "Type your message..." } };

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type here..." {...args} />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true, placeholder: "Disabled" } };
