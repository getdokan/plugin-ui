import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./dropdown-menu";
import { Button } from "./button";
import {
  User,
  Settings,
  LogOut,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Mail,
  MessageSquare,
  PlusCircle,
  UserPlus,
  Github,
  Keyboard,
  Cloud,
  CreditCard,
  LifeBuoy,
} from "lucide-react";

const meta = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic dropdown menu with label, items, and separator.
 */
export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Action Menu: A dropdown menu triggered by a "more" icon (three dots),
 * commonly used for row actions in tables. Supports icons, destructive items,
 * and separators between item groups.
 */
export const ActionMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-none transition-colors p-2">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Checkbox List: A dropdown with checkbox items that allow multiple selections.
 * Useful for filtering or toggling multiple options.
 */
export const CheckboxList: Story = {
  render: function CheckboxListStory() {
    const [selectedValues, setSelectedValues] = useState<string[]>(["email"]);

    const items = [
      { value: "email", label: "Email notifications" },
      { value: "sms", label: "SMS notifications" },
      { value: "push", label: "Push notifications" },
      { value: "marketing", label: "Marketing emails" },
    ];

    const toggleValue = (value: string) => {
      setSelectedValues((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline">Notification Settings</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {items.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.value}
              checked={selectedValues.includes(item.value)}
              onCheckedChange={() => toggleValue(item.value)}
            >
              {item.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

/**
 * Radio Group: A dropdown with radio items allowing single selection.
 * Useful for exclusive option selection like status or category.
 */
export const RadioGroup: Story = {
  render: function RadioGroupStory() {
    const [status, setStatus] = useState("active");

    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline">Select Status</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Status</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
            <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="inactive">Inactive</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="archived">Archived</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

/**
 * Icon List: A dropdown where each item has an icon displayed in a muted
 * background box. Useful for integration or app selection menus.
 */
export const IconList: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Connect App</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Integrations</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span className="mr-2 flex h-6 w-6 items-center justify-center overflow-hidden rounded-md bg-muted">
            <Github className="h-4 w-4" />
          </span>
          GitHub
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="mr-2 flex h-6 w-6 items-center justify-center overflow-hidden rounded-md bg-muted">
            <Mail className="h-4 w-4" />
          </span>
          Email
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="mr-2 flex h-6 w-6 items-center justify-center overflow-hidden rounded-md bg-muted">
            <MessageSquare className="h-4 w-4" />
          </span>
          Slack
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="mr-2 flex h-6 w-6 items-center justify-center overflow-hidden rounded-md bg-muted">
            <Cloud className="h-4 w-4" />
          </span>
          Cloud Storage
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Simple Menu with Shortcuts: A dropdown with icons and keyboard shortcuts.
 * Common pattern for application menus and command palettes.
 */
export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Keyboard className="mr-2 h-4 w-4" />
          <span>Keyboard shortcuts</span>
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Sectioned Menu: A dropdown divided into logical sections with separators.
 * Useful for organizing related actions into groups.
 */
export const SectionedMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Team</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite users
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            New team
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Support</DropdownMenuLabel>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            Help center
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Submenu: A dropdown with nested submenus for hierarchical navigation.
 * Useful for complex menu structures with categorized options.
 */
export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          New message
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite users
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PlusCircle className="mr-2 h-4 w-4" />
              More...
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Item Variants: Demonstrates the different visual styles for menu items
 * including default, primary (highlighted on hover), and destructive.
 */
export const ItemVariants: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Item Variants</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem variant="default">
          Default item
        </DropdownMenuItem>
        <DropdownMenuItem variant="primary">
          Primary item (highlighted)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          Destructive item
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
