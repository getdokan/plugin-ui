import type { Meta, StoryObj } from "@storybook/react";
import { WandSparkles } from "lucide-react";
import { fn } from "storybook/test";
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
    contentAction: { control: false },
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

/** Full toolbar variant with all formatting options. Content action is hidden by default. */
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

/** Show the bottom-right content action button with default sparkles icon (no text). */
export const ContentActionIconOnly: Story = {
  args: {
    variant: "full",
    placeholder: "Icon-only content action...",
    contentAction: {
      show: true,
      onClick: fn(),
    },
  },
};

/** Replace the default sparkles button with custom icon, label, and click handler. */
export const ContentActionCustom: Story = {
  args: {
    variant: "full",
    placeholder: "Try the custom AI action...",
    contentAction: {
      show: true,
      title: "Rewrite with AI",
      showContent: true,
      icon: <WandSparkles className="size-4 text-sky-600" />,
      content: <span className="text-xs">Rewrite</span>,
      className: "border border-border bg-background px-2",
      onClick: fn(),
    },
  },
};
