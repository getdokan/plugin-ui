import type { Meta, StoryObj } from "@storybook/react";
import { Thumbnail } from "./thumbnail";

const meta = {
  title: "UI/Thumbnail",
  component: Thumbnail,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { options: ["xs", "sm", "md", "lg"], control: { type: "select" } },
    aspect: { options: ["landscape", "portrait", "square"], control: { type: "select" } },
  },
} satisfies Meta<typeof Thumbnail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { src: "https://picsum.photos/64/64", alt: "Thumbnail" },
};

export const Fallback: Story = {
  render: () => <Thumbnail alt="No image" />,
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-2">
      <Thumbnail size="xs" alt="xs" />
      <Thumbnail size="sm" alt="sm" />
      <Thumbnail size="md" alt="md" />
      <Thumbnail size="lg" alt="lg" />
    </div>
  ),
};

export const Aspects: Story = {
  render: () => (
    <div className="flex gap-4">
      <Thumbnail size="lg" aspect="square" alt="square" />
      <Thumbnail size="lg" aspect="landscape" alt="landscape" />
      <Thumbnail size="lg" aspect="portrait" alt="portrait" />
    </div>
  ),
};
