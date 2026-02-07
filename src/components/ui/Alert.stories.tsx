import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from "./alert";

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["default", "destructive", "success", "warning", "info"],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert variant="default">
      <AlertTitle>Title</AlertTitle>
      <AlertDescription>Description text goes here.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong.</AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Your changes have been saved.</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>Please review before continuing.</AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  render: () => (
    <Alert variant="info">
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>New update available.</AlertDescription>
    </Alert>
  ),
};
