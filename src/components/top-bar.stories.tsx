import type { Meta, StoryObj } from "@storybook/react";
import { TopBar } from "./top-bar";
import { Button } from "./ui/button";
import { Settings, User } from "lucide-react";
import React from "react";

const meta = {
  title: "Components/TopBar",
  component: TopBar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof TopBar>;

export default meta;

type Story = StoryObj<typeof meta>;

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
      P
    </div>
    <span className="font-bold text-lg hidden md:block">PluginUI</span>
  </div>
);

export const Default: Story = {
  args: {
    logo: <Logo />,
    versions: [
      { version: "v2.0.0", isPro: false },
    ],
  },
};

export const ProVersion: Story = {
  args: {
    logo: <Logo />,
    versions: [
      { version: "v2.0.0", isPro: true },
    ],
  },
};

export const MultipleVersions: Story = {
  args: {
    logo: <Logo />,
    versions: [
      { version: "Core v2.0.0", isPro: false },
      { version: "Pro v1.5.0", isPro: true },
    ],
  },
};

export const WithRightSideComponents: Story = {
  args: {
    logo: <Logo />,
    versions: [
      { version: "v2.0.0", isPro: true },
    ],
    rightSideComponents: (
      <div className="flex items-center gap-2">
        <TopBar.UpgradeBtn upgradeText="Upgrade to Pro" />
        <Button variant="ghost" size="icon">
          <Settings size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <User size={20} />
        </Button>
      </div>
    ),
  },
};

export const MobileView: Story = {
  args: {
    logo: <Logo />,
    versions: [
      { version: "v2.0.0", isPro: true },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
