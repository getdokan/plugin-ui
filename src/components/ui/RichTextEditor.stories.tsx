import type { Meta, StoryObj } from "@storybook/react";
import { RichTextEditor } from "./rich-text-editor";
import { Label } from "./label";

const meta = {
  title: "UI/RichTextEditor",
  component: RichTextEditor,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["full", "simple"],
      control: { type: "select" },
    },
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-[540px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RichTextEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Full toolbar variant with all formatting options including font size, image, undo/redo, and more. */
export const Default: Story = {
  args: {
    variant: "full",
    placeholder: "Start typing...",
  },
};

/** Full variant with pre-filled content. */
export const WithContent: Story = {
  args: {
    variant: "full",
    defaultValue:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum",
  },
};

/** Simplified toolbar variant with AI assist button, numbered lists, and fewer options. */
export const Simple: Story = {
  args: {
    variant: "simple",
    placeholder: "Write something...",
  },
};

/** Simple variant with pre-filled content. */
export const SimpleWithContent: Story = {
  args: {
    variant: "simple",
    defaultValue:
      "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>",
  },
};

/** Rich text editor with a label. */
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full gap-2">
      <Label>Description</Label>
      <RichTextEditor {...args} />
    </div>
  ),
  args: {
    variant: "full",
    placeholder: "Enter your description here...",
  },
};
