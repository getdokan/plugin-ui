import type { Meta, StoryObj } from "@storybook/react";
import { MatricsPill } from "./matrics-pill";
import { Users, Mail, Bell } from "lucide-react";

const meta = {
  title: "Components/MatricsPill",
  component: MatricsPill,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text" },
    count: { control: "number" },
  },
} satisfies Meta<typeof MatricsPill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Users />,
    text: "Total Users",
    count: 125,
  },
};

export const Messages: Story = {
  args: {
    icon: <Mail />,
    text: "Messages",
    count: 12,
  },
};

export const Notifications: Story = {
  args: {
    icon: <Bell />,
    text: "Notifications",
    count: 5,
  },
};
