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
        <TooltipContent side="top">Top tooltip Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquam amet ducimus harum iure maiores minus, modi nostrum officiis possimus provident quae quam qui quisquam, rem repudiandae tempore vero voluptates. Culpa cum earum expedita illum impedit ipsa quasi recusandae repellendus ullam unde? Aliquid animi asperiores consequuntur eligendi error fugiat impedit ipsum itaque, labore maxime nam nisi obcaecati perferendis reiciendis, reprehenderit sint suscipit unde! Animi assumenda atque dolorem doloribus, ea, eos id in incidunt ipsum libero mollitia omnis quibusdam recusandae sed velit voluptas, voluptates voluptatibus? Aliquid animi assumenda consequatur deleniti, dignissimos enim excepturi illo in incidunt mollitia quidem sequi temporibus totam. </TooltipContent>
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
