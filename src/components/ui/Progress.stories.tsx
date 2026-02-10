import type { Meta, StoryObj } from "@storybook/react";
import { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue, CircularProgress } from "./progress";

const meta = {
  title: "UI/Progress",
  component: Progress,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } } },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <Progress {...args}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  ),
  args: {
    value: 60,
  },
};

export const Small: Story = {
  render: () => (
    <div className="w-96">
      <Progress value={30}>
        <ProgressTrack size="sm">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  ),
};

export const Large: Story = {
  render: () => (
    <div className="w-96">
      <Progress value={80}>
        <ProgressTrack size="lg">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-96">
      <Progress value={45} className="flex-col items-stretch gap-2">
        <ProgressLabel>Project Progress</ProgressLabel>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  ),
};

export const WithLabelAndValue: Story = {
  render: () => (
    <div className="w-96">
      <Progress value={75} className="flex-col items-stretch gap-2">
        <div className="flex justify-between items-center">
          <ProgressLabel>Migrating MySQL database...</ProgressLabel>
          <ProgressValue />
        </div>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  ),
};

export const WithLabelAndCustomValue: Story = {
  render: () => (
    <div className="w-96">
      <Progress value={66} className="flex-col items-stretch gap-2">
        <div className="flex justify-between items-center">
          <ProgressLabel>Steps completed</ProgressLabel>
          <span className="text-sm font-medium text-muted-foreground">8 of 12</span>
        </div>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  ),
};

export const InlineLabel: Story = {
  render: () => (
    <div className="w-96 flex flex-col gap-6">
      <Progress value={45}>
        <ProgressLabel className="w-20">45%</ProgressLabel>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <Progress value={45}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
        <ProgressValue className="ml-3" />
      </Progress>
    </div>
  ),
};

export const Segmented: Story = {
  render: () => (
    <div className="w-96">
      <h4 className="sr-only">Status</h4>
      <p className="text-sm font-medium text-foreground">Step 2 of 4</p>
      <div className="mt-2 grid grid-cols-4 gap-4" aria-hidden="true">
        <Progress value={100}>
          <ProgressTrack size="sm"><ProgressIndicator /></ProgressTrack>
        </Progress>
        <Progress value={100}>
          <ProgressTrack size="sm"><ProgressIndicator /></ProgressTrack>
        </Progress>
        <Progress value={0}>
          <ProgressTrack size="sm"><ProgressIndicator /></ProgressTrack>
        </Progress>
        <Progress value={0}>
          <ProgressTrack size="sm"><ProgressIndicator /></ProgressTrack>
        </Progress>
      </div>
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <div className="w-96">
      <Progress value={null}>
        <ProgressTrack>
          <ProgressIndicator className="animate-pulse" />
        </ProgressTrack>
      </Progress>
    </div>
  ),
};

export const Striped: Story = {
  render: () => (
    <div className="w-96">
      <Progress value={60}>
        <ProgressTrack>
          <ProgressIndicator striped />
        </ProgressTrack>
      </Progress>
    </div>
  ),
};

export const Circular: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <CircularProgress value={75} size={80} strokeWidth={8} />
      <CircularProgress value={45} size={60} strokeWidth={6} variant="success" />
      <CircularProgress value={90} size={100} strokeWidth={10} variant="destructive" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Progress value={70}>
        <ProgressTrack variant="default"><ProgressIndicator variant="default" /></ProgressTrack>
      </Progress>
      <Progress value={70}>
        <ProgressTrack variant="success"><ProgressIndicator variant="success" /></ProgressTrack>
      </Progress>
      <Progress value={70}>
        <ProgressTrack variant="destructive"><ProgressIndicator variant="destructive" /></ProgressTrack>
      </Progress>
      <Progress value={70}>
        <ProgressTrack variant="warning"><ProgressIndicator variant="warning" /></ProgressTrack>
      </Progress>
      <Progress value={70}>
        <ProgressTrack variant="info"><ProgressIndicator variant="info" /></ProgressTrack>
      </Progress>
    </div>
  ),
};
