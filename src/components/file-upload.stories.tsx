import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { FileUpload } from "./file-upload";

const meta = {
  title: "Components/FileUpload",
  component: FileUpload,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    onUpload: fn(),
  },
  argTypes: {
    variant: {
      options: ["button", "button-text"],
      control: { type: "radio" },
    },
    handlerType: {
      options: ["default", "custom"],
      control: { type: "radio" },
    },
    btnText: { control: "text" },
    text: { control: "text" },
    description: { control: "text" },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    btnText: "Upload File",
    description: "Max file size 2MB",
    variant: "button",
  },
};

export const ButtonTextVariant: Story = {
  args: {
    btnText: "Choose File",
    text: "or drag and drop here",
    description: "Supports PNG, JPG up to 10MB",
    variant: "button-text",
  },
};

export const CustomHandler: Story = {
  args: {
    btnText: "Upload with Custom Handler",
    description: "This uses a standard file input",
    handlerType: "custom",
    variant: "button",
  },
};
