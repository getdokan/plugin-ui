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
        <ProgressTrack variant="default"><ProgressIndicator /></ProgressTrack>
      </Progress>
      <Progress value={70}>
        <ProgressTrack variant="success"><ProgressIndicator /></ProgressTrack>
      </Progress>
      <Progress value={70}>
        <ProgressTrack variant="danger"><ProgressIndicator /></ProgressTrack>
      </Progress>
    </div>
  ),
};
