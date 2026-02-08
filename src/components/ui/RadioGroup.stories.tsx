import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem, LabeledRadio, RadioCard } from "./radio-group";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState("option1");
      return (
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option1" id="r1" />
            <label htmlFor="r1">Option 1</label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option2" id="r2" />
            <label htmlFor="r2">Option 2</label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option3" id="r3" />
            <label htmlFor="r3">Option 3</label>
          </div>
        </RadioGroup>
      );
    }
    return <Demo />;
  },
};

export const RadioGroupItemOnly: Story = {
  name: "Radio Item Only",
  render: () => {
    function Demo() {
      const [value, setValue] = useState("a");
      return (
        <RadioGroup value={value} onValueChange={setValue} className="flex flex-row gap-4">
          <RadioGroupItem value="a" />
          <RadioGroupItem value="b" />
          <RadioGroupItem value="c" />
        </RadioGroup>
      );
    }
    return <Demo />;
  },
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="d1" disabled />
        <label htmlFor="d1" className="opacity-50">Disabled selected</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="d2" disabled />
        <label htmlFor="d2" className="opacity-50">Disabled</label>
      </div>
    </RadioGroup>
  ),
};

export const WithLabelHorizontal: Story = {
  name: "Labeled - Horizontal",
  render: () => {
    function Demo() {
      const [value, setValue] = useState("comfortable");
      return (
        <div className="w-80">
          <RadioGroup value={value} onValueChange={setValue}>
            <LabeledRadio id="default" value="default" label="Default" orientation="horizontal" />
            <LabeledRadio id="comfortable" value="comfortable" label="Comfortable" orientation="horizontal" />
            <LabeledRadio id="compact" value="compact" label="Compact" orientation="horizontal" />
          </RadioGroup>
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
      const [value, setValue] = useState("standard");
      return (
        <div className="w-80">
          <RadioGroup value={value} onValueChange={setValue}>
            <LabeledRadio
              id="standard"
              value="standard"
              label="Standard shipping"
              description="Delivery in 5-7 business days."
              orientation="horizontal"
            />
            <LabeledRadio
              id="express"
              value="express"
              label="Express shipping"
              description="Delivery in 2-3 business days."
              orientation="horizontal"
            />
            <LabeledRadio
              id="overnight"
              value="overnight"
              label="Overnight shipping"
              description="Delivery by next business day."
              orientation="horizontal"
            />
          </RadioGroup>
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
      const [value, setValue] = useState("monthly");
      return (
        <div className="w-80">
          <RadioGroup value={value} onValueChange={setValue}>
            <LabeledRadio
              id="monthly"
              value="monthly"
              label="Monthly billing"
              description="Pay every month."
              position="right"
            />
            <LabeledRadio
              id="yearly"
              value="yearly"
              label="Yearly billing"
              description="Pay once a year and save 20%."
              position="right"
            />
          </RadioGroup>
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
      <RadioGroup defaultValue="enabled">
        <LabeledRadio
          id="enabled"
          value="enabled"
          label="Enabled option"
          description="This option is available."
          disabled
        />
        <LabeledRadio
          id="disabled"
          value="disabled"
          label="Disabled option"
          description="This option is not available."
          disabled
        />
      </RadioGroup>
    </div>
  ),
};

export const CardDefault: Story = {
  name: "Card - Default",
  render: () => {
    function Demo() {
      const [value, setValue] = useState("startup");
      return (
        <div className="w-80">
          <RadioGroup value={value} onValueChange={setValue}>
            <RadioCard
              id="startup"
              value="startup"
              label="Startup"
              description="Perfect for small teams getting started."
            />
            <RadioCard
              id="business"
              value="business"
              label="Business"
              description="Advanced features for growing companies."
            />
            <RadioCard
              id="enterprise"
              value="enterprise"
              label="Enterprise"
              description="Custom solutions for large organizations."
            />
          </RadioGroup>
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
      const [value, setValue] = useState("light");
      return (
        <div className="w-80">
          <RadioGroup value={value} onValueChange={setValue}>
            <RadioCard
              id="light"
              value="light"
              label="Light theme"
              description="A clean, bright appearance."
              position="right"
            />
            <RadioCard
              id="dark"
              value="dark"
              label="Dark theme"
              description="Easy on the eyes in low light."
              position="right"
            />
            <RadioCard
              id="system"
              value="system"
              label="System theme"
              description="Follows your device settings."
              position="right"
            />
          </RadioGroup>
        </div>
      );
    }
    return <Demo />;
  },
};

export const CardDisabled: Story = {
  name: "Card - Disabled",
  render: () => (
    <div className="w-80">
      <RadioGroup defaultValue="basic">
        <RadioCard
          id="basic"
          value="basic"
          label="Basic plan"
          description="Your current plan."
          disabled
        />
        <RadioCard
          id="premium"
          value="premium"
          label="Premium plan"
          description="Upgrade not available."
          disabled
        />
      </RadioGroup>
    </div>
  ),
};

export const PaymentMethodExample: Story = {
  name: "Payment Method Example",
  render: () => {
    function Demo() {
      const [value, setValue] = useState("card");
      return (
        <div className="w-80">
          <h3 className="mb-3 font-medium">Select payment method</h3>
          <RadioGroup value={value} onValueChange={setValue}>
            <RadioCard
              id="card"
              value="card"
              label="Credit Card"
              description="Pay with Visa, Mastercard, or American Express."
            />
            <RadioCard
              id="paypal"
              value="paypal"
              label="PayPal"
              description="Pay with your PayPal account."
            />
            <RadioCard
              id="bank"
              value="bank"
              label="Bank Transfer"
              description="Direct transfer from your bank account."
            />
          </RadioGroup>
        </div>
      );
    }
    return <Demo />;
  },
};

export const PricingTierExample: Story = {
  name: "Pricing Tier Example",
  render: () => {
    function Demo() {
      const [value, setValue] = useState("monthly");
      return (
        <div className="w-80">
          <h3 className="mb-3 font-medium">Billing cycle</h3>
          <RadioGroup value={value} onValueChange={setValue}>
            <LabeledRadio
              id="monthly-billing"
              value="monthly"
              label="Monthly"
              description="$12/month, billed monthly"
              orientation="horizontal"
            />
            <LabeledRadio
              id="yearly-billing"
              value="yearly"
              label="Yearly"
              description="$10/month, billed annually ($120/year) - Save 17%"
              orientation="horizontal"
            />
            <LabeledRadio
              id="lifetime-billing"
              value="lifetime"
              label="Lifetime"
              description="$299 one-time payment"
              orientation="horizontal"
            />
          </RadioGroup>
        </div>
      );
    }
    return <Demo />;
  },
};

export const NotificationPreferencesExample: Story = {
  name: "Notification Preferences",
  render: () => {
    function Demo() {
      const [value, setValue] = useState("all");
      return (
        <fieldset className="w-80">
          <legend className="mb-3 font-medium">Notification preferences</legend>
          <RadioGroup value={value} onValueChange={setValue}>
            <LabeledRadio
              id="all"
              value="all"
              label="All notifications"
              description="Receive all updates and alerts."
            />
            <LabeledRadio
              id="important"
              value="important"
              label="Important only"
              description="Only critical updates and mentions."
            />
            <LabeledRadio
              id="none"
              value="none"
              label="None"
              description="Turn off all notifications."
            />
          </RadioGroup>
        </fieldset>
      );
    }
    return <Demo />;
  },
};
