import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";
import { Toaster } from "./sonner";
import { Button } from "./button";

const meta = {
  title: "UI/Sonner",
  component: Toaster,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() => toast("Event has been created.")}
      >
        Show Toast
      </Button>
      <Toaster />
    </>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
          })
        }
      >
        Show Toast
      </Button>
      <Toaster />
    </>
  ),
};

export const Success: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() => toast.success("Event has been created.")}
      >
        Success
      </Button>
      <Toaster />
    </>
  ),
};

export const Info: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast.info("Be at the area 10 minutes before the event time.")
        }
      >
        Info
      </Button>
      <Toaster />
    </>
  ),
};

export const Warning: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning("Event start time cannot be earlier than 8am.")
        }
      >
        Warning
      </Button>
      <Toaster />
    </>
  ),
};

export const Error: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() => toast.error("Event has not been created.")}
      >
        Error
      </Button>
      <Toaster />
    </>
  ),
};

export const WithAction: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </Button>
      <Toaster />
    </>
  ),
};

export const WithCancel: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            cancel: {
              label: "Cancel",
              onClick: () => console.log("Cancel"),
            },
          })
        }
      >
        Show Toast
      </Button>
      <Toaster />
    </>
  ),
};

export const Promise: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() => {
          toast.promise(
            () =>
              new window.Promise<{ name: string }>((resolve) =>
                setTimeout(() => resolve({ name: "Sonner" }), 2000)
              ),
            {
              loading: "Loading...",
              success: (data) => `${data.name} toast has been added`,
              error: "Error",
            }
          );
        }}
      >
        Show Toast
      </Button>
      <Toaster />
    </>
  ),
};

export const Loading: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() => toast.loading("Loading data...")}
      >
        Loading
      </Button>
      <Toaster />
    </>
  ),
};

export const CustomJSX: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast(
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Custom Toast</span>
              <span className="text-sm text-muted-foreground">
                This is a toast with{" "}
                <a href="#" className="underline font-medium">
                  custom JSX
                </a>{" "}
                content.
              </span>
            </div>
          )
        }
      >
        Custom JSX
      </Button>
      <Toaster />
    </>
  ),
};

export const AllTypes: Story = {
  name: "All Types",
  render: () => (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast("Default toast")}>
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Success toast")}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("Info toast")}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Warning toast")}
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Error toast")}
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.loading("Loading toast")}
        >
          Loading
        </Button>
      </div>
      <Toaster />
    </>
  ),
};

export const Positions: Story = {
  render: () => {
    const positions = [
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ] as const;

    return (
      <>
        <div className="flex flex-wrap gap-2">
          {positions.map((position) => (
            <Button
              key={position}
              variant="outline"
              onClick={() =>
                toast("Event has been created", {
                  description: `Position: ${position}`,
                  position,
                })
              }
            >
              {position}
            </Button>
          ))}
        </div>
        <Toaster />
      </>
    );
  },
};

export const RichColors: Story = {
  render: () => (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => toast.success("Event has been created")}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("Be at the area 10 minutes before")}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning("Event time cannot be earlier than 8am")
          }
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Event has not been created")}
        >
          Error
        </Button>
      </div>
      <Toaster richColors />
    </>
  ),
};

export const CloseButton: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "This toast has a close button.",
          })
        }
      >
        With Close Button
      </Button>
      <Toaster closeButton />
    </>
  ),
};

export const Expanded: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() => {
          toast("First notification");
          setTimeout(() => toast.success("Second notification"), 300);
          setTimeout(() => toast.info("Third notification"), 600);
        }}
      >
        Show Expanded Toasts
      </Button>
      <Toaster expand />
    </>
  ),
};
