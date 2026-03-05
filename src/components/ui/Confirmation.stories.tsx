import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Confirmation, Button, Notice } from "./index";
import { CircleMinus } from "lucide-react";

function LeaveWithUnsavedChangesDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Leave page</Button>
      <Confirmation
        open={open}
        onClose={() => setOpen(false)}
        title="Are you sure you want to leave?"
        body="You have unsaved changes."
        confirmLabel="Leave"
        cancelLabel="Stay in page"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

function CancelSubscriptionDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Cancel subscription
      </Button>
      <Confirmation
        open={open}
        onClose={() => setOpen(false)}
        title="Are you sure you want to cancel the subscription plan?"
        body={
          <Notice variant="info" className="text-sm">
            <p className="text-foreground">
              Next billing date is <strong>25th March 2024</strong> and reassign
              is not possible for recurring subscription
            </p>
          </Notice>
        }
        icon={<CircleMinus className="size-5" />}
        confirmLabel="Yes, Cancel"
        cancelLabel="No"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

function DiscardDraftDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Discard draft
      </Button>
      <Confirmation
        open={open}
        onClose={() => setOpen(false)}
        title="Are you sure you want to discard this draft?"
        confirmLabel="Yes, Cancel"
        cancelLabel="No"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

function DestructiveDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete item
      </Button>
      <Confirmation
        open={open}
        onClose={() => setOpen(false)}
        title="Delete this item?"
        body="This action cannot be undone."
        variant="destructive"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

const meta = {
  title: "UI/Confirmation",
  component: Confirmation,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    open: false,
    onClose: () => {},
    title: "Confirm action",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
  },
} satisfies Meta<typeof Confirmation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LeaveWithUnsavedChanges: Story = {
  render: () => <LeaveWithUnsavedChangesDemo />,
  args: { title: "Are you sure you want to leave?", body: "You have unsaved changes." },
};

export const CancelSubscription: Story = {
  render: () => <CancelSubscriptionDemo />,
  args: { title: "Cancel subscription?" },
};

export const DiscardDraft: Story = {
  render: () => <DiscardDraftDemo />,
  args: { title: "Discard this draft?" },
};

export const Destructive: Story = {
  render: () => <DestructiveDemo />,
  args: { title: "Delete this item?", variant: "destructive" },
};
