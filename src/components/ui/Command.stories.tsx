import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Button,
} from "./index";
import {
  CalendarIcon,
  SmileIcon,
  CalculatorIcon,
  UserIcon,
  CreditCardIcon,
  SettingsIcon,
} from "lucide-react";

function CommandDemo() {
  return (
    <Command className="rounded-lg border border-border shadow-sm md:min-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarIcon />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <SmileIcon />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <CalculatorIcon />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <UserIcon />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCardIcon />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <SettingsIcon />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function CommandDialogDemo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none">
          <span className="text-xs">⌘</span>J
        </kbd>{" "}
        or click the button below.
      </p>
      <Button variant="outline" className="mt-2 border-input text-foreground" onClick={() => setOpen(true)}>
        Open Command Palette
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <CalendarIcon />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <SmileIcon />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <CalculatorIcon />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <UserIcon />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCardIcon />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <SettingsIcon />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

function CommandShortcutsDemo() {
  return (
    <Command className="rounded-lg border border-border shadow-sm md:min-w-[450px]">
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="File">
          <CommandItem>
            <span>New File</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Open File</span>
            <CommandShortcut>⌘O</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Save</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Save As...</span>
            <CommandShortcut>⇧⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Edit">
          <CommandItem>
            <span>Undo</span>
            <CommandShortcut>⌘Z</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Redo</span>
            <CommandShortcut>⇧⌘Z</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Find</span>
            <CommandShortcut>⌘F</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Replace</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function CommandGroupsDemo() {
  return (
    <Command className="rounded-lg border border-border shadow-sm md:min-w-[450px]">
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="People">
          <CommandItem>
            <UserIcon />
            <span>John Doe</span>
          </CommandItem>
          <CommandItem>
            <UserIcon />
            <span>Jane Smith</span>
          </CommandItem>
          <CommandItem>
            <UserIcon />
            <span>Bob Wilson</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem>
            <CalendarIcon />
            <span>Schedule Meeting</span>
          </CommandItem>
          <CommandItem>
            <CreditCardIcon />
            <span>Make Payment</span>
          </CommandItem>
          <CommandItem>
            <SettingsIcon />
            <span>Open Settings</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Tools">
          <CommandItem>
            <CalculatorIcon />
            <span>Calculator</span>
          </CommandItem>
          <CommandItem>
            <SmileIcon />
            <span>Emoji Picker</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function CommandScrollableDemo() {
  const items = Array.from({ length: 30 }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: `item-${i + 1}`,
  }));

  return (
    <Command className="rounded-lg border border-border shadow-sm md:min-w-[450px]">
      <CommandInput placeholder="Search items..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="All Items">
          {items.map((item) => (
            <CommandItem key={item.value} value={item.value}>
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

const meta = {
  title: "UI/Command",
  component: Command,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Command>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <CommandDemo />,
};

export const DialogVariant: Story = {
  render: () => <CommandDialogDemo />,
};

export const Shortcuts: Story = {
  render: () => <CommandShortcutsDemo />,
};

export const Groups: Story = {
  render: () => <CommandGroupsDemo />,
};

export const Scrollable: Story = {
  render: () => <CommandScrollableDemo />,
};
