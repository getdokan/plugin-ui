import type { Meta, StoryObj } from "@storybook/react";
import { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue } from "./progress";

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
  render: () => (
    <Progress value={60}>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Progress value={45}>
      <ProgressLabel>Progress</ProgressLabel>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
      <ProgressValue />
    </Progress>
  ),
};

export const Variants: Story = {
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
