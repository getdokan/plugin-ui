import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { checked: { control: "boolean" }, disabled: { control: "boolean" } },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane" />
      <label htmlFor="airplane" className="text-sm">Airplane mode</label>
    </div>
  ),
};

export const WithLabelAndDescription: Story = {
  render: () => (
    <Switch id="notifications" label="Notifications" description="Receive email notifications." />
  ),
};
