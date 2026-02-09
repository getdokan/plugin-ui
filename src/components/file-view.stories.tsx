import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { FileView } from "./file-view";

const meta = {
  title: "Components/FileView",
  component: FileView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    onRemove: fn(),
  },
  argTypes: {
    fileType: {
      options: ["file", "image"],
      control: { type: "radio" },
    },
    fileName: { control: "text" },
    imageUrl: { control: "text" },
    fileSize: { control: "text" },
  },
} satisfies Meta<typeof FileView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fileName: "document.pdf",
    fileSize: "2.5 MB",
    fileType: "file",
  },
};

export const Image: Story = {
  args: {
    fileName: "image.png",
    fileSize: "1.2 MB",
    fileType: "image",
    imageUrl: "https://picsum.photos/200",
  },
};

export const WithoutRemove: Story = {
  args: {
    fileName: "read-only.txt",
    fileSize: "12 KB",
    fileType: "file",
    onRemove: undefined,
  },
};
