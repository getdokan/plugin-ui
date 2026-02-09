import type { Meta, StoryObj } from "@storybook/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "./input-group";
import { Spinner } from "./spinner";
import { LoaderIcon } from "lucide-react";

import { Search } from "lucide-react";

const meta = {
  title: "UI/InputGroup",
  component: InputGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithAddonStart: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupAddon>https://</InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  ),
};

export const WithAddonEnd: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupInput placeholder="Username" />
      <InputGroupAddon align="inline-end">.com</InputGroupAddon>
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      {/* Small button */}
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="xs">Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {/* Default button */}
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="sm" variant="default">
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {/* Icon button */}
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs">
            <Search />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {/* Icon + text button */}
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>
            <Search />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="sm" variant="default">
            <Search className="size-3.5" />
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const WithSpinnerEnd: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Searching..." />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Processing..." />
        <InputGroupAddon>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Saving changes..." />
        <InputGroupAddon align="inline-end">
          <InputGroupText>Saving...</InputGroupText>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Refreshing data..." />
        <InputGroupAddon>
          <LoaderIcon className="animate-spin" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-muted-foreground">
            Please wait...
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const WithTextareaSubmit: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <textarea
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Autoresize textarea..."
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton className="ml-auto" size="sm" variant="default">
            Submit
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};
