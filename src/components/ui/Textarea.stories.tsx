import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";
import { Label } from "./label";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-90">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: "Type your message..." } };

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type here..." {...args} />
    </div>
  ),
};

export const WithValue: Story = {
  args: {
    defaultValue:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
  },
};

export const Error: Story = {
  render: (args) => (
    <div className="grid w-full gap-2">
      <Label htmlFor="error-textarea">Error State</Label>
      <Textarea id="error-textarea" aria-invalid {...args} />
      <p className="text-destructive text-xs">
        This field is required and cannot be empty.
      </p>
    </div>
  ),
  args: { placeholder: "Enter your text here..." },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled" },
};
