import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./tooltip";
import { Button } from "./button";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip content</TooltipContent>
    </Tooltip>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-12">
      <Tooltip>
        <TooltipTrigger><Button>Top</Button></TooltipTrigger>
        <TooltipContent side="top">Top tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger><Button>Right</Button></TooltipTrigger>
        <TooltipContent side="right">Right tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger><Button>Bottom</Button></TooltipTrigger>
        <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger><Button>Left</Button></TooltipTrigger>
        <TooltipContent side="left">Left tooltip</TooltipContent>
      </Tooltip>
    </div>
  ),
};
