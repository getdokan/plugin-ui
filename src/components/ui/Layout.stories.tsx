import type { Meta, StoryObj } from "@storybook/react";
import {
  BarChart3,
  FileText,
  FolderOpen,
  Home,
  Package,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "./button";
import {
  Layout,
  LayoutBody,
  LayoutFooter,
  LayoutHeader,
  LayoutMain,
  LayoutMenu,
  LayoutSidebar,
  type LayoutMenuGroupData,
  type LayoutMenuItemData,
} from "./index";

const menuDataStructureCode = `// Menu item (supports nested children)
interface LayoutMenuItemData {
  id: string;
  label: string;
  secondaryLabel?: string;   // Optional second line
  href?: string;             // Link URL (use <a>)
  onClick?: () => void;      // Click handler for leaf items
  children?: LayoutMenuItemData[];  // Nested submenu
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

// Group (section with label + items)
interface LayoutMenuGroupData {
  id: string;
  label: string;
  secondaryLabel?: string;
  items: LayoutMenuItemData[];
  className?: string;
}

// Usage: pass items (flat) or groups (sections)
<LayoutMenu
  groups={groups}
  activeItemId="dashboard"
  searchable
  onItemClick={(item) => console.log('Clicked', item.id)}
/>`;

const meta = {
  title: "UI/Layout",
  component: Layout,
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "sidebarPosition",
        "sidebarVariant",
        "sidebarBreakpoint",
        "defaultSidebarOpen",
        "className",
      ],
    },
    docs: {
      description: {
        component:
          "Responsive app layout with optional header, footer, and left/right sidebar. " +
          "Sidebar is **expandable and collapsible on desktop**: use the header menu button to toggle; when collapsed, the sidebar animates to zero width and main content expands. " +
          "On mobile, the sidebar behaves as a drawer. " +
          "Sidebar can contain a searchable, multi-label nested menu. " +
          "See the **Menu data structure** story for `LayoutMenuItemData` and `LayoutMenuGroupData` types.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    sidebarPosition: {
      control: "select",
      options: ["left", "right", null],
      description: "Sidebar position: left, right, or null for no sidebar",
    },
    sidebarVariant: {
      control: "select",
      options: ["drawer", "inline", "overlay"],
      description: "Sidebar behavior on mobile",
    },
    sidebarBreakpoint: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl"],
      description:
        "Breakpoint at which sidebar is in-flow (desktop). Above this, sidebar can be expanded/collapsed via the header toggle.",
    },
    defaultSidebarOpen: {
      control: "boolean",
      description:
        "Initial open state for sidebar (applies to both mobile and desktop). Use true to show sidebar open on load.",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the root",
    },
    children: {
      control: false,
      description: "Layout content (Header, Body, Footer)",
    },
  },
} satisfies Meta<typeof Layout>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Use the Controls panel to change sidebar position, variant, breakpoint, and default open. */
export const WithControls: Story = {
  args: {
    sidebarPosition: "right",
    sidebarVariant: "drawer",
    sidebarBreakpoint: "lg",
    defaultSidebarOpen: true,
    className: "bg-background",
  },
  render: (args) => {
    const sidebar = args.sidebarPosition ? (
      <LayoutSidebar>
        <LayoutMenu groups={sampleGroups} searchable />
      </LayoutSidebar>
    ) : null;
    const main = (
      <LayoutMain>
        <p className="text-muted-foreground text-sm">
          Change props in the Controls panel below. Sidebar position:{" "}
          {args.sidebarPosition ?? "none"}.
        </p>
      </LayoutMain>
    );
    return (
      <Layout
        key={`sidebar-${args.defaultSidebarOpen}-${args.sidebarPosition ?? "none"}`}
        {...args}
      >
        <LayoutHeader>
          <span className="font-semibold">Controls demo</span>
        </LayoutHeader>
        <LayoutBody>
          {args.sidebarPosition === "left" ? (
            <>
              {sidebar}
              {main}
            </>
          ) : (
            <>
              {main}
              {sidebar}
            </>
          )}
        </LayoutBody>
        <LayoutFooter>
          <span className="text-muted-foreground text-sm">Footer</span>
        </LayoutFooter>
      </Layout>
    );
  },
};

/**
 * **Expandable and collapsible sidebar (desktop)**
 *
 * On desktop (at and above `sidebarBreakpoint`), the sidebar can be expanded and collapsed:
 * - Use the **menu icon** in the header to toggle the sidebar.
 * - When **collapsed**, the sidebar animates to zero width and the main content area expands.
 * - When **expanded**, the sidebar shows at its configured width (e.g. `w-72`).
 *
 * Use `defaultSidebarOpen` to control the initial state (e.g. `true` to start with the sidebar open).
 * On mobile, the sidebar remains a drawer that overlays content when open.
 */
export const ExpandableCollapsibleSidebar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the sidebar expand/collapse behavior on desktop. Use the menu icon in the header to toggle. " +
          "When collapsed, the sidebar width animates to zero and main content expands. " +
          "Resize to mobile to see the drawer behavior.",
      },
    },
  },
  args: {
    sidebarPosition: "left",
    sidebarBreakpoint: "lg",
    defaultSidebarOpen: false,
    className: "bg-background",
  },
  render: (args) => (
    <Layout key={`expandable-${args.defaultSidebarOpen}`} {...args}>
      <LayoutHeader>
        <span className="font-semibold">Expandable sidebar</span>
      </LayoutHeader>
      <LayoutBody>
        <LayoutSidebar>
          <LayoutMenu groups={sampleGroups} searchable />
        </LayoutSidebar>
        <LayoutMain>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Desktop: expandable and collapsible</p>
            <p className="text-muted-foreground">
              Click the menu icon in the header to expand or collapse the
              sidebar. When collapsed, this content area grows to use the full
              width. Use <strong>defaultSidebarOpen</strong> to start with the
              sidebar open.
            </p>
          </div>
        </LayoutMain>
      </LayoutBody>
      <LayoutFooter>
        <span className="text-muted-foreground text-sm">Footer</span>
      </LayoutFooter>
    </Layout>
  ),
};

const sampleNestedItems: LayoutMenuItemData[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    secondaryLabel: "Overview",
    icon: <Home className="size-4" />,
    onClick: () => {},
  },
  {
    id: "reports",
    label: "Reports",
    secondaryLabel: "Analytics & exports",
    icon: <BarChart3 className="size-4" />,
    children: [
      {
        id: "sales",
        label: "Sales",
        secondaryLabel: "By period",
        icon: <FileText className="size-4" />,
        onClick: () => {},
      },
      {
        id: "products",
        label: "Products",
        secondaryLabel: "Inventory",
        icon: <Package className="size-4" />,
        children: [
          {
            id: "categories",
            label: "Categories",
            icon: <FolderOpen className="size-4" />,
            onClick: () => {},
          },
        ],
      },
    ],
  },
  {
    id: "users",
    label: "Users",
    secondaryLabel: "Manage accounts",
    icon: <Users className="size-4" />,
    onClick: () => {},
  },
  {
    id: "settings",
    label: "Settings",
    secondaryLabel: "App configuration",
    icon: <Settings className="size-4" />,
    onClick: () => {},
  },
];

const sampleGroups: LayoutMenuGroupData[] = [
  {
    id: "main",
    label: "Main",
    secondaryLabel: "Primary navigation",
    items: sampleNestedItems,
  },
  {
    id: "tools",
    label: "Tools",
    items: [
      {
        id: "import",
        label: "Import",
        secondaryLabel: "Bulk import data",
        onClick: () => {},
      },
      {
        id: "export",
        label: "Export",
        secondaryLabel: "Download reports",
        onClick: () => {},
      },
    ],
  },
];

export const FullLayout: Story = {
  render: () => {
    const sampleNestedItems: LayoutMenuItemData[] = [
      {
        id: "dashboard",
        label: "Dashboard",
        secondaryLabel: "Overview",
        icon: <Home className="size-4" />,
        onClick: () => {},
      },
      {
        id: "reports",
        label: "Reports",
        secondaryLabel: "Analytics & exports",
        icon: <BarChart3 className="size-4" />,
        children: [
          {
            id: "sales",
            label: "Sales",
            secondaryLabel: "By period",
            icon: <FileText className="size-4" />,
            onClick: () => {},
          },
          {
            id: "products",
            label: "Products",
            secondaryLabel: "Inventory",
            icon: <Package className="size-4" />,
            children: [
              {
                id: "categories",
                label: "Categories",
                icon: <FolderOpen className="size-4" />,
                onClick: () => {},
              },
            ],
          },
        ],
      },
      {
        id: "users",
        label: "Users",
        secondaryLabel: "Manage accounts",
        icon: <Users className="size-4" />,
        onClick: () => {},
      },
      {
        id: "settings",
        label: "Settings",
        secondaryLabel: "App configuration",
        icon: <Settings className="size-4" />,
        onClick: () => {},
      },
    ];

    const sampleGroups: LayoutMenuGroupData[] = [
      {
        id: "main",
        label: "Main",
        secondaryLabel: "Primary navigation",
        items: sampleNestedItems,
      },
      {
        id: "tools",
        label: "Tools",
        items: [
          {
            id: "import",
            label: "Import",
            secondaryLabel: "Bulk import data",
            onClick: () => {},
          },
          {
            id: "export",
            label: "Export",
            secondaryLabel: "Download reports",
            onClick: () => {},
          },
        ],
      },
    ];
    return (
      <Layout className="bg-background" sidebarPosition="right">
        <LayoutHeader className="gap-4">
          <span className="font-semibold">App Title</span>
          <Button variant="outline" size="sm">
            Sign out
          </Button>
        </LayoutHeader>
        <LayoutBody>
          <LayoutMain>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Main content</h1>
              <p className="text-muted-foreground">
                This is the main content area. The menu bar is on the right and
                is searchable with multi-label nested items. Resize the window
                to see the responsive behavior: on small screens the sidebar
                becomes a drawer.
              </p>
            </div>
          </LayoutMain>
          <LayoutSidebar className="w-64 lg:w-72">
            <LayoutMenu
              groups={sampleGroups}
              activeItemId="dashboard"
              searchable
              searchPlaceholder="Search menu…"
              onItemClick={(item) => {
                // Callback: parent items expand on click; leaf items run item.onClick
                console.log("Menu item clicked:", item.id, item.label);
              }}
            />
          </LayoutSidebar>
        </LayoutBody>
        <LayoutFooter>
          <span className="text-muted-foreground text-sm">
            © 2025 Example. Footer is optional (nullable).
          </span>
        </LayoutFooter>
      </Layout>
    );
  },
};

export const LeftSidebar: Story = {
  render: () => (
    <Layout className="bg-background" sidebarPosition="left">
      <LayoutHeader className="gap-4">
        <span className="font-semibold">Sidebar on left</span>
        <Button variant="outline" size="sm">
          Sign out
        </Button>
      </LayoutHeader>
      <LayoutBody>
        <LayoutSidebar className="w-64 lg:w-72">
          <LayoutMenu
            groups={sampleGroups}
            searchable
            searchPlaceholder="Search menu…"
          />
        </LayoutSidebar>
        <LayoutMain>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Main content</h1>
            <p className="text-muted-foreground">
              Sidebar is on the left. Put LayoutSidebar before LayoutMain in
              LayoutBody for left position.
            </p>
          </div>
        </LayoutMain>
      </LayoutBody>
      <LayoutFooter>
        <span className="text-muted-foreground text-sm">© 2025</span>
      </LayoutFooter>
    </Layout>
  ),
};

/** Customize hover/focus and active (selected) colors via menuItemClassName and activeItemClassName. */
export const CustomHoverAndActiveStyles: Story = {
  render: () => (
    <Layout className="bg-background" sidebarPosition="right">
      <LayoutHeader>
        <span className="font-semibold">Custom menu colors</span>
      </LayoutHeader>
      <LayoutBody>
        <LayoutMain>
          <p className="text-muted-foreground text-sm">
            Hover and active states use <code>menuItemClassName</code> and{" "}
            <code>activeItemClassName</code> (e.g. primary colors).
          </p>
        </LayoutMain>
        <LayoutSidebar className="w-64 lg:w-72">
          <LayoutMenu
            groups={sampleGroups}
            activeItemId="users"
            menuItemClassName="hover:bg-primary/10 hover:text-primary focus-visible:ring-primary"
            activeItemClassName="bg-primary text-primary-foreground font-medium"
            searchable
          />
        </LayoutSidebar>
      </LayoutBody>
    </Layout>
  ),
};

export const NoSidebar: Story = {
  render: () => (
    <Layout className="bg-background" sidebarPosition={null}>
      <LayoutHeader>
        <span className="font-semibold">No sidebar</span>
        <Button variant="outline" size="sm">
          Sign out
        </Button>
      </LayoutHeader>
      <LayoutBody>
        <LayoutMain>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Main content only</h1>
            <p className="text-muted-foreground">
              Use sidebarPosition=&#123;null&#125; for no sidebar. The header
              toggle is hidden and LayoutSidebar would render nothing if used.
            </p>
          </div>
        </LayoutMain>
      </LayoutBody>
      <LayoutFooter>
        <span className="text-muted-foreground text-sm">© 2025</span>
      </LayoutFooter>
    </Layout>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Layout sidebarPosition="right">
      <LayoutHeader>
        <span className="font-semibold">No footer</span>
      </LayoutHeader>
      <LayoutBody>
        <LayoutMain>
          <p className="text-muted-foreground">
            When you don’t pass a footer (or pass null), no footer is rendered.
          </p>
        </LayoutMain>
        <LayoutSidebar>
          <LayoutMenu items={sampleNestedItems} searchable />
        </LayoutSidebar>
      </LayoutBody>
    </Layout>
  ),
};

export const FlatMenu: Story = {
  render: () => (
    <Layout sidebarPosition="right">
      <LayoutHeader>
        <span className="font-semibold">Flat menu (no groups)</span>
      </LayoutHeader>
      <LayoutBody>
        <LayoutMain>
          <p className="text-muted-foreground">
            Menu can be a flat list of items instead of groups.
          </p>
        </LayoutMain>
        <LayoutSidebar>
          <LayoutMenu items={sampleNestedItems} searchable />
        </LayoutSidebar>
      </LayoutBody>
    </Layout>
  ),
};

/** Menu data types for `items` and `groups` props. Use with `LayoutMenu`. */
export const MenuDataStructure: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "TypeScript interfaces for menu items and groups. Pass `items` (flat array) or `groups` (array of sections) to `LayoutMenu`. Use `onItemClick` for a single callback when any item is clicked (expand still happens on parent click).",
      },
    },
  },
  render: () => (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <pre className="text-muted-foreground overflow-x-auto text-xs">
        <code>{menuDataStructureCode}</code>
      </pre>
    </div>
  ),
};
