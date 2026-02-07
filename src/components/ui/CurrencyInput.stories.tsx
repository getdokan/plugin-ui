import type { Meta, StoryObj } from "@storybook/react";
import { CurrencyInput } from "./currency-input";

const meta = {
  title: "UI/CurrencyInput",
  component: CurrencyInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { currency: { control: "text" }, placeholder: { control: "text" } },
} satisfies Meta<typeof CurrencyInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: "0.00" } };
export const WithCurrency: Story = { args: { currency: "USD", placeholder: "0.00" } };
