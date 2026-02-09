import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  AlertTriangle,
  CheckCircle,
  Info as InfoIcon,
  X,
  XCircle,
} from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

const VARIANT_ICONS = {
  default: InfoIcon,
  destructive: XCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: InfoIcon,
} as const;

type AlertVariant = keyof typeof VARIANT_ICONS;

function AlertIcon({ variant }: { variant: AlertVariant }) {
  const Icon = VARIANT_ICONS[variant] ?? InfoIcon;
  return <Icon />;
}

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
  args: { variant: "default" },
  render: (args) => (
    <Alert variant={args.variant}>
      <AlertTitle>Title</AlertTitle>
      <AlertDescription>Description text goes here.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert variant={args.variant}>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong.</AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  args: { variant: "success" },
  render: (args) => (
    <Alert variant={args.variant}>
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Your changes have been saved.</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  args: { variant: "warning" },
  render: (args) => (
    <Alert variant={args.variant}>
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>Please review before continuing.</AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  args: { variant: "info" },
  render: (args) => (
    <Alert variant={args.variant}>
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>New update available.</AlertDescription>
    </Alert>
  ),
};

const defaultVariant: AlertVariant = "default";

export const WithDescription: Story = {
  args: { variant: defaultVariant },
  render: (args) => (
    <Alert variant={args.variant}>
      <AlertIcon variant={args.variant ?? defaultVariant} />
      <AlertTitle>Hold on I need at least a few minutes!</AlertTitle>
      <AlertDescription>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      </AlertDescription>
      <AlertAction>
        <Button variant="ghost" size="icon-sm" aria-label="Dismiss">
          <X />
        </Button>
      </AlertAction>
    </Alert>
  ),
};

export const WithoutDescription: Story = {
  args: { variant: defaultVariant },
  render: (args) => (
    <Alert variant={args.variant}>
      <AlertIcon variant={args.variant ?? defaultVariant} />
      <AlertTitle>Hold on I need at least a few minutes!</AlertTitle>
      <AlertAction>
        <Button variant="ghost" size="icon-sm" aria-label="Dismiss">
          <X />
        </Button>
      </AlertAction>
    </Alert>
  ),
};

export const WithButtons: Story = {
  args: { variant: defaultVariant },
  render: (args) => (
    <Alert variant={args.variant}>
      <AlertIcon variant={args.variant ?? defaultVariant} />
      <div className="flex items-center justify-between gap-4 col-start-2">
        <AlertTitle>Hold on I need at least a few minutes!</AlertTitle>
        <div className="flex gap-2">
          <Button variant="default">Primary</Button>
          <Button variant="outline">Button</Button>
        </div>
      </div>
      <AlertAction>
        <Button variant="ghost" size="icon-sm" aria-label="Dismiss">
          <X />
        </Button>
      </AlertAction>
    </Alert>
  ),
};

export const WithDescriptionAndButtons: Story = {
  args: { variant: defaultVariant },
  render: (args) => (
    <Alert variant={args.variant}>
      <AlertIcon variant={args.variant ?? defaultVariant} />
      <AlertTitle>Hold on I need at least a few minutes!</AlertTitle>
      <AlertDescription>
        This process may take a few minutes to complete. See the{" "}
        <a href="#">documentation</a> for more details.
      </AlertDescription>
      <div className="flex gap-2 pt-1 col-start-2">
        <Button variant="default">Primary</Button>
        <Button variant="outline">Button</Button>
      </div>
      <AlertAction>
        <Button variant="ghost" size="icon-sm" aria-label="Dismiss">
          <X />
        </Button>
      </AlertAction>
    </Alert>
  ),
};
