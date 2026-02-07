import type { Meta, StoryObj } from "@storybook/react";
import { Notice, NoticeTitle } from "./notice";

const meta = {
  title: "UI/Notice",
  component: Notice,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["default", "destructive", "success", "warning", "info"],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Notice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Notice variant="default">
      <NoticeTitle>Notice title</NoticeTitle>
      Notice message content.
    </Notice>
  ),
};

export const Success: Story = {
  render: () => (
    <Notice variant="success">
      <NoticeTitle>Success</NoticeTitle>
      Operation completed successfully.
    </Notice>
  ),
};

export const Warning: Story = {
  render: () => (
    <Notice variant="warning">
      <NoticeTitle>Warning</NoticeTitle>
      Please review your input.
    </Notice>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Notice variant="destructive">
      <NoticeTitle>Error</NoticeTitle>
      Something went wrong.
    </Notice>
  ),
};
