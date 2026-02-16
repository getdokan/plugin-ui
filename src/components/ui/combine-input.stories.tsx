import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { CombineInput } from "./combine-input";

const meta = {
  title: "UI/CombineInput",
  component: CombineInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    percentageValue: { control: "text" },
    numberValue: { control: "text" },
    moneySign: { control: "text" },
    swapped: { control: "boolean" },
    percentagePlaceholder: { control: "text" },
    numberPlaceholder: { control: "text" },
  },
} satisfies Meta<typeof CombineInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    percentageValue: 10,
    numberValue: 5,
    moneySign: "$",
    swapped: false,
  },
};

export const Swapped: Story = {
  args: {
    percentageValue: 10,
    numberValue: 5,
    moneySign: "$",
    swapped: true,
  },
};

export const DifferentCurrency: Story = {
  args: {
    percentageValue: 15,
    numberValue: 20,
    moneySign: "€",
    swapped: false,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [percentage, setPercentage] = useState(args.percentageValue);
    const [number, setNumber] = useState(args.numberValue);

    return (
      <CombineInput
        {...args}
        percentageValue={percentage}
        numberValue={number}
        onPercentageChange={(v) => setPercentage(v)}
        onNumberChange={(v) => setNumber(v)}
      />
    );
  },
  args: {
    percentageValue: "10",
    numberValue: "5",
  },
};
