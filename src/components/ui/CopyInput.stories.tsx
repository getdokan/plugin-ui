import type { Meta, StoryObj } from "@storybook/react";
import { CopyInput } from "./copy-input";
import { Label } from "./label";

const meta = {
  title: "UI/CopyInput",
  component: CopyInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    successDuration: { control: "number" },
  },
} satisfies Meta<typeof CopyInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "https://example.com/share-this-link",
    placeholder: "URL to copy",
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="copy-field">Share URL</Label>
      <CopyInput id="copy-field" {...args} />
    </div>
  ),
  args: {
    value: "https://example.com/share-link",
  },
};

export const Disabled: Story = {
  args: {
    value: "Locked content",
    disabled: true,
  },
};

export const CustomSuccessDuration: Story = {
  args: {
    value: "I stay 'Copied!' for 5 seconds",
    successDuration: 5000,
  },
};

export const WithOnCopyCallback: Story = {
  args: {
    value: "Copy me to see an alert",
    onCopy: (val) => alert(`Copied: ${val}`),
  },
};
