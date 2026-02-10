import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  Button,
  Input,
  LabeledSwitch,
  Field,
  FieldLabel,
  FieldDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  ModalDescription,
} from "./index";
import { ChevronDownIcon } from "lucide-react";

const ZONE_NAME_HELPER = "Give a meaningful name for your reference";

const COUNTRIES = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
] as const;

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
        </ModalHeader>
        <ModalDescription>Modal content.</ModalDescription>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

function CreateShippingZoneDemo() {
  const [open, setOpen] = useState(false);
  const [restOfWorld, setRestOfWorld] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Shipping Zone</Button>
      <Modal open={open} onClose={() => setOpen(false)} size="default">
        <ModalHeader>
          <ModalTitle>Create Shipping Zone</ModalTitle>
        </ModalHeader>
        <div className="flex flex-col gap-6 px-8 py-6">
          <Field>
            <FieldLabel>Zone Name</FieldLabel>
            <Input placeholder="Type" />
            <FieldDescription>{ZONE_NAME_HELPER}</FieldDescription>
          </Field>

          <LabeledSwitch
            label="Rest of the world"
            checked={restOfWorld}
            onCheckedChange={(checked) => setRestOfWorld(checked)}
          />

          <Field>
            <FieldLabel>Countries</FieldLabel>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  className="h-9 w-full justify-between font-normal"
                >
                  Bangladesh, United States
                  <ChevronDownIcon className="size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--anchor-width)]">
                {COUNTRIES.map((country) => (
                  <DropdownMenuItem key={country}>{country}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <FieldDescription>{ZONE_NAME_HELPER}</FieldDescription>
          </Field>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Create</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

const meta = {
  title: "UI/Modal",
  component: Modal,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { open: false, onClose: () => {} },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <ModalDemo /> };

export const CreateShippingZone: Story = {
  render: () => <CreateShippingZoneDemo />,
};
