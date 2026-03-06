import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  Button,
  Input,
  Label,
} from "./index";

function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open Sheet
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="john@example.com" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>
            Cancel
          </SheetClose>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SheetSidesDemo() {
  const sides = ["top", "right", "bottom", "left"] as const;
  return (
    <div className="flex flex-wrap gap-2">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" />}>
            {side}
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Sheet from {side}</SheetTitle>
              <SheetDescription>
                This sheet slides in from the {side}.
              </SheetDescription>
            </SheetHeader>
            <div className="p-4">
              <p>Sheet content goes here.</p>
            </div>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

function SheetNoCloseButtonDemo() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        No Close Button
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Custom Close</SheetTitle>
          <SheetDescription>
            This sheet has no default close button. Use the footer button to
            close.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">Content without a close icon.</div>
        <SheetFooter>
          <SheetClose render={<Button />}>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const meta = {
  title: "UI/Sheet",
  component: Sheet,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <SheetDemo /> };

export const Sides: Story = {
  render: () => <SheetSidesDemo />,
};

export const NoCloseButton: Story = {
  render: () => <SheetNoCloseButtonDemo />,
};
