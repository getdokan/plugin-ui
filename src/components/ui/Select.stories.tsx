import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Label,
  Button,
} from "./index";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Default ────────────────────────

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ─── With Groups ────────────────────────

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
          <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// ─── With Label ────────────────────────

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-select">Email</Label>
      <Select>
        <SelectTrigger id="email-select" className="w-[220px]">
          <SelectValue placeholder="Select a verified email" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="m@example.com">m@example.com</SelectItem>
          <SelectItem value="m@google.com">m@google.com</SelectItem>
          <SelectItem value="m@support.com">m@support.com</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// ─── Small Size ────────────────────────

export const SmallSize: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-[160px]">
        <SelectValue placeholder="Small select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sm">Small</SelectItem>
        <SelectItem value="md">Medium</SelectItem>
        <SelectItem value="lg">Large</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ─── Disabled Items ────────────────────────

export const DisabledItems: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free</SelectItem>
        <SelectItem value="pro">Pro</SelectItem>
        <SelectItem value="enterprise" disabled>
          Enterprise (Contact us)
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ─── Controlled ────────────────────────

function SelectControlledDemo() {
  const [value, setValue] = useState("banana");

  return (
    <div className="flex flex-col items-center gap-4">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        Selected: <span className="font-medium text-foreground">{value}</span>
      </p>
      <Button
        variant="outline"
        size="sm"
        className="border-input text-foreground"
        onClick={() => setValue("apple")}
      >
        Set to Apple
      </Button>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <SelectControlledDemo />,
};

// ─── Disabled ────────────────────────

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Disabled" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ─── Scrollable (many items) ────────────────────────

export const Scrollable: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        {[
          "Afghanistan",
          "Argentina",
          "Australia",
          "Bangladesh",
          "Brazil",
          "Canada",
          "China",
          "Denmark",
          "Egypt",
          "Finland",
          "France",
          "Germany",
          "India",
          "Indonesia",
          "Italy",
          "Japan",
          "Kenya",
          "Mexico",
          "Netherlands",
          "Nigeria",
          "Norway",
          "Pakistan",
          "Philippines",
          "Poland",
          "Russia",
          "South Korea",
          "Spain",
          "Sweden",
          "Thailand",
          "Turkey",
          "United Kingdom",
          "United States",
          "Vietnam",
        ].map((country) => (
          <SelectItem key={country} value={country.toLowerCase()}>
            {country}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};
