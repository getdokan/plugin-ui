import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch, LabeledSwitch, SwitchCard } from "./switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return <Switch checked={checked} onCheckedChange={setChecked} />;
    }
    return <Demo />;
  },
};

export const Checked: Story = {
  render: () => <Switch checked />,
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch size="sm" />
      <Switch size="default" />
    </div>
  ),
};

export const SizesChecked: Story = {
  name: "Sizes - Checked",
  render: () => (
    <div className="flex items-center gap-4">
      <Switch size="sm" checked />
      <Switch size="default" checked />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Switch disabled />
        <span className="text-sm text-muted-foreground">Disabled (off)</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch disabled checked />
        <span className="text-sm text-muted-foreground">Disabled (on)</span>
      </div>
    </div>
  ),
};

export const WithLabelHorizontal: Story = {
  name: "Labeled - Horizontal",
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <div className="w-80">
          <LabeledSwitch
            id="enable-notifications"
            label="Enable notifications"
            checked={checked}
            onCheckedChange={setChecked}
            orientation="horizontal"
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const WithLabelAndDescription: Story = {
  name: "Labeled - With Description",
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(true);
      return (
        <div className="w-80">
          <LabeledSwitch
            id="marketing-emails"
            label="Marketing emails"
            description="Receive emails about new products, features, and more."
            checked={checked}
            onCheckedChange={setChecked}
            orientation="horizontal"
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const LabelPositionRight: Story = {
  name: "Labeled - Position Right",
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <div className="w-80">
          <LabeledSwitch
            id="dark-mode"
            label="Dark mode"
            description="Switch to dark theme for better visibility in low light."
            checked={checked}
            onCheckedChange={setChecked}
            orientation="horizontal"
            position="right"
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const LabeledVertical: Story = {
  name: "Labeled - Vertical",
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <div className="w-80">
          <LabeledSwitch
            id="auto-save"
            label="Auto-save"
            description="Automatically save your work every few minutes."
            checked={checked}
            onCheckedChange={setChecked}
            orientation="vertical"
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const LabeledResponsive: Story = {
  name: "Labeled - Responsive",
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <div className="w-80">
          <LabeledSwitch
            id="responsive-switch"
            label="Responsive switch"
            description="This switch adapts to the container width."
            checked={checked}
            onCheckedChange={setChecked}
            orientation="responsive"
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const LabeledSmallSize: Story = {
  name: "Labeled - Small Size",
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <div className="w-80">
          <LabeledSwitch
            id="compact-switch"
            label="Compact switch"
            description="A smaller switch for tight spaces."
            checked={checked}
            onCheckedChange={setChecked}
            size="sm"
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const LabeledDisabled: Story = {
  name: "Labeled - Disabled",
  render: () => (
    <div className="w-80">
      <div className="flex flex-col gap-4">
        <LabeledSwitch
          id="disabled-off"
          label="Disabled off"
          description="This switch is disabled and turned off."
          disabled
        />
        <LabeledSwitch
          id="disabled-on"
          label="Disabled on"
          description="This switch is disabled but turned on."
          disabled
          checked
        />
      </div>
    </div>
  ),
};

export const CardDefault: Story = {
  name: "Card - Default",
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <div className="w-80">
          <SwitchCard
            id="two-factor"
            label="Two-factor authentication"
            description="Add an extra layer of security to your account."
            checked={checked}
            onCheckedChange={setChecked}
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const CardPositionRight: Story = {
  name: "Card - Position Right",
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(true);
      return (
        <div className="w-80">
          <SwitchCard
            id="email-digest"
            label="Email digest"
            description="Receive a weekly summary of your activity."
            checked={checked}
            onCheckedChange={setChecked}
            position="right"
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const CardGroup: Story = {
  name: "Card - Group",
  render: () => {
    function Demo() {
      const [settings, setSettings] = useState({
        notifications: true,
        sounds: false,
        darkMode: false,
      });

      const toggle = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
      };

      return (
        <div className="w-80 flex flex-col gap-3">
          <SwitchCard
            id="push-notifications"
            label="Push notifications"
            description="Get notified about important updates."
            checked={settings.notifications}
            onCheckedChange={() => toggle("notifications")}
          />
          <SwitchCard
            id="sound-effects"
            label="Sound effects"
            description="Play sounds for notifications and actions."
            checked={settings.sounds}
            onCheckedChange={() => toggle("sounds")}
          />
          <SwitchCard
            id="dark-mode-card"
            label="Dark mode"
            description="Use dark theme across the application."
            checked={settings.darkMode}
            onCheckedChange={() => toggle("darkMode")}
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const CardDisabled: Story = {
  name: "Card - Disabled",
  render: () => (
    <div className="w-80 flex flex-col gap-3">
      <SwitchCard
        id="unavailable-feature"
        label="Unavailable feature"
        description="This feature is not available on your plan."
        disabled
      />
      <SwitchCard
        id="locked-feature"
        label="Locked feature"
        description="This feature is enabled but cannot be changed."
        disabled
        checked
      />
    </div>
  ),
};

export const PrivacySettingsExample: Story = {
  name: "Privacy Settings Example",
  render: () => {
    function Demo() {
      const [privacy, setPrivacy] = useState({
        profilePublic: true,
        showOnlineStatus: true,
        allowMessages: true,
        shareActivity: false,
      });

      const toggle = (key: keyof typeof privacy) => {
        setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
      };

      return (
        <div className="w-80">
          <h3 className="mb-3 font-medium">Privacy Settings</h3>
          <div className="flex flex-col gap-3">
            <SwitchCard
              id="public-profile"
              label="Public profile"
              description="Allow others to see your profile."
              checked={privacy.profilePublic}
              onCheckedChange={() => toggle("profilePublic")}
            />
            <SwitchCard
              id="online-status"
              label="Online status"
              description="Show when you're online."
              checked={privacy.showOnlineStatus}
              onCheckedChange={() => toggle("showOnlineStatus")}
            />
            <SwitchCard
              id="direct-messages"
              label="Direct messages"
              description="Allow others to send you messages."
              checked={privacy.allowMessages}
              onCheckedChange={() => toggle("allowMessages")}
            />
            <SwitchCard
              id="activity-sharing"
              label="Activity sharing"
              description="Share your activity with connections."
              checked={privacy.shareActivity}
              onCheckedChange={() => toggle("shareActivity")}
            />
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};

export const FeatureToggleExample: Story = {
  name: "Feature Toggle Example",
  render: () => {
    function Demo() {
      const [features, setFeatures] = useState({
        betaFeatures: false,
        experimentalUI: false,
        developerMode: false,
      });

      const toggle = (key: keyof typeof features) => {
        setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
      };

      return (
        <div className="w-80 p-4 bg-muted/30 rounded-lg">
          <h3 className="mb-3 font-medium">Advanced Settings</h3>
          <div className="flex flex-col gap-3">
            <LabeledSwitch
              id="beta-features"
              label="Beta features"
              description="Try out new features before they're released."
              checked={features.betaFeatures}
              onCheckedChange={() => toggle("betaFeatures")}
              size="sm"
            />
            <LabeledSwitch
              id="experimental-ui"
              label="Experimental UI"
              description="Enable experimental user interface changes."
              checked={features.experimentalUI}
              onCheckedChange={() => toggle("experimentalUI")}
              size="sm"
            />
            <LabeledSwitch
              id="developer-mode"
              label="Developer mode"
              description="Show additional debugging information."
              checked={features.developerMode}
              onCheckedChange={() => toggle("developerMode")}
              size="sm"
            />
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};
