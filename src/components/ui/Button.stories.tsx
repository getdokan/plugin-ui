import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    onClick: fn(),
  },
  argTypes: {
    variant: {
      options: [
        "default",
        "secondary",
        "outline",
        "destructive",
        "ghost",
        "link",
        "success",
        "outline-success",
        "outline-destructive",
      ],
      control: { type: "select" },
    },
    size: {
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
      control: { type: "select" },
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
    className: { control: "text" },
    onClick: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Change the Controls below; the story updates live. Use the Controls panel to try different variants, sizes, and text. */
export const WithControls: Story = {
  args: {
    variant: "default",
    size: "default",
    disabled: false,
    children: "Edit me in Controls",
  },
};

export const Default: Story = {
  args: { children: "Button" },
};

/** Interaction test: disabled button does not call onClick when clicked. Run and debug in the Interactions panel. */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Button",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /button/i });
    await userEvent.click(button);
    await expect(button).toBeDisabled();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};
export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};
export const Destructive: Story = {
  args: { variant: "destructive", children: "Destructive" },
};
export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost" },
};
export const Link: Story = {
  args: { variant: "link", children: "Link" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🔘</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="success">Success</Button>
      <Button variant="outline-success">Outline Success</Button>
    </div>
  ),
};
