import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from "./avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { 
      options: ["xs", "sm", "md", "lg"], 
      control: { type: "select" },
      description: "Size of the avatar",
    },
    shape: { 
      options: ["circle", "square"], 
      control: { type: "select" },
      description: "Shape of the avatar",
    },
    className: {
      control: { type: "text" },
      description: "Custom className for styling",
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 
 * Use the Controls panel to change size, shape, and className.
 * The controls will update the Avatar component in real-time.
 */
export const WithControls: Story = {
  args: {
    size: "md",
    shape: "circle",
    className: "",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Default: Story = {
  args: {
    size: "md",
    shape: "circle",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  args: {
    size: "md",
    shape: "circle",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs"><AvatarFallback>XS</AvatarFallback></Avatar>
      <Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
      <Avatar size="md"><AvatarFallback>MD</AvatarFallback></Avatar>
      <Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar shape="circle">
        <AvatarImage src="https://github.com/shadcn.png" alt="Circle" />
        <AvatarFallback>CI</AvatarFallback>
      </Avatar>
      <Avatar shape="square">
        <AvatarImage src="https://github.com/shadcn.png" alt="Square" />
        <AvatarFallback>SQ</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithBadge: Story = {
  args: {
    size: "lg",
    shape: "circle",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge className="bg-success" />
    </Avatar>
  ),
};

export const CustomClassName: Story = {
  args: {
    size: "lg",
    shape: "circle",
    className: "ring-2 ring-primary ring-offset-2",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar size="md">
        <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <AvatarGroupCount size="md">+5</AvatarGroupCount>
    </AvatarGroup>
  ),
};
