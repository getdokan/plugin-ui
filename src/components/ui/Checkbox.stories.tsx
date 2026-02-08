import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox, LabeledCheckbox, CheckboxCard } from "./checkbox";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return <Checkbox checked={checked} onCheckedChange={setChecked} />;
    }
    return <Demo />;
  },
};

export const Checked: Story = {
  render: () => <Checkbox checked />,
};

export const Indeterminate: Story = {
  render: () => <Checkbox indeterminate />,
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox disabled />
      <Checkbox disabled checked />
      <Checkbox disabled indeterminate />
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
          <LabeledCheckbox
            id="terms"
            label="Accept terms and conditions"
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
      const [checked, setChecked] = useState(false);
      return (
        <div className="w-80">
          <LabeledCheckbox
            id="marketing"
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
          <LabeledCheckbox
            id="notifications"
            label="Enable notifications"
            description="Get notified when something happens."
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

export const LabeledDisabled: Story = {
  name: "Labeled - Disabled",
  render: () => (
    <div className="w-80">
      <div className="flex flex-col gap-4">
        <LabeledCheckbox
            id="disabled-unchecked"
            label="Disabled unchecked"
            description="This option is not available."
            disabled
        />
        <LabeledCheckbox
            id="disabled-checked"
            label="Disabled checked"
            description="This option is locked."
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
          <CheckboxCard
            id="premium-plan"
            label="Premium Plan"
            description="Access all features and priority support."
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
      const [checked, setChecked] = useState(false);
      return (
        <div className="w-80">
          <CheckboxCard
            id="enable-feature"
            label="Enable feature"
            description="Turn on this feature for your account."
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
      const [selected, setSelected] = useState<string[]>(["email"]);

      const toggleItem = (value: string) => {
        setSelected((prev) =>
          prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value]
        );
      };

      return (
        <div className="w-80 flex flex-col gap-3">
          <CheckboxCard
            id="email-notifications"
            label="Email notifications"
            description="Get notified via email."
            checked={selected.includes("email")}
            onCheckedChange={() => toggleItem("email")}
          />
          <CheckboxCard
            id="push-notifications"
            label="Push notifications"
            description="Get notified on your device."
            checked={selected.includes("push")}
            onCheckedChange={() => toggleItem("push")}
          />
          <CheckboxCard
            id="sms-notifications"
            label="SMS notifications"
            description="Get notified via text message."
            checked={selected.includes("sms")}
            onCheckedChange={() => toggleItem("sms")}
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
      <CheckboxCard
        id="unavailable-option"
        label="Unavailable option"
        description="This option is currently disabled."
        disabled
      />
      <CheckboxCard
        id="locked-option"
        label="Locked option"
        description="This option is locked and enabled."
        disabled
        checked
      />
    </div>
  ),
};

export const CheckboxGroupExample: Story = {
  name: "Checkbox Group",
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState<string[]>(["react"]);

      const toggleItem = (value: string) => {
        setSelected((prev) =>
          prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value]
        );
      };

      return (
        <fieldset className="flex flex-col gap-3 w-80">
          <legend className="mb-2 font-medium">Select your frameworks</legend>
          <LabeledCheckbox
            id="react"
            label="React"
            description="A JavaScript library for building user interfaces."
            checked={selected.includes("react")}
            onCheckedChange={() => toggleItem("react")}
          />
          <LabeledCheckbox
            id="vue"
            label="Vue"
            description="The progressive JavaScript framework."
            checked={selected.includes("vue")}
            onCheckedChange={() => toggleItem("vue")}
          />
          <LabeledCheckbox
            id="angular"
            label="Angular"
            description="Platform for building mobile and desktop apps."
            checked={selected.includes("angular")}
            onCheckedChange={() => toggleItem("angular")}
          />
          <LabeledCheckbox
            id="svelte"
            label="Svelte"
            description="Cybernetically enhanced web apps."
            checked={selected.includes("svelte")}
            onCheckedChange={() => toggleItem("svelte")}
          />
        </fieldset>
      );
    }
    return <Demo />;
  },
};

export const SelectAllExample: Story = {
  name: "Select All Pattern",
  render: () => {
    function Demo() {
      const items = ["Apple", "Banana", "Orange", "Grape"];
      const [selected, setSelected] = useState<string[]>(["Apple"]);

      const allSelected = selected.length === items.length;
      const someSelected = selected.length > 0 && selected.length < items.length;

      const toggleAll = () => {
        if (allSelected) {
          setSelected([]);
        } else {
          setSelected([...items]);
        }
      };

      const toggleItem = (item: string) => {
        setSelected((prev) =>
          prev.includes(item)
            ? prev.filter((v) => v !== item)
            : [...prev, item]
        );
      };

      return (
        <div className="flex flex-col gap-3 w-80">
          <LabeledCheckbox
            id="select-all"
            label="Select all fruits"
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={toggleAll}
          />
          <div className="ml-6 flex flex-col gap-2">
            {items.map((item) => (
              <LabeledCheckbox
                key={item}
                id={item.toLowerCase()}
                label={item}
                checked={selected.includes(item)}
                onCheckedChange={() => toggleItem(item)}
              />
            ))}
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};
