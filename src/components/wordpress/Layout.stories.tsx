import type { Meta, StoryObj } from "@storybook/react";
import { doAction } from "@wordpress/hooks";
import {
  BarChart3,
  FileText,
  FolderOpen,
  Home,
  Package,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Layout,
  LayoutBody,
  LayoutFooter,
  LayoutHeader,
  LayoutMain,
  LayoutMenu,
  LayoutSidebar,
  SidebarFooter,
  SidebarHeader,
  type LayoutMenuGroupData,
  type LayoutMenuItemData,
} from "../ui";

/* ============================================
   Sample data
   ============================================ */

const sampleItems: LayoutMenuItemData[] = [
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
    items: sampleItems,
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

/* ============================================
   Meta
   ============================================ */

const meta = {
  title: "WordPress/Layout",
  component: Layout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "App shell with collapsible sidebar, header, main content area, and footer.",
          "",
          "Built on top of shadcn **Sidebar** primitives. The sidebar supports three modes:",
          "- **Expanded** — full labels, search, and nested menus visible",
          "- **Collapsed (icon)** — icon-only rail with tooltips on hover",
          "- **Mobile drawer** — slides in as a sheet below the `md` breakpoint",
          "",
          "Toggle with the header button or **Cmd+B** / **Ctrl+B**.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ============================================
   Stories
   ============================================ */

/** Default layout with left sidebar, header, content, and footer. */
export const Default: Story = {
  render: () => (
    <Layout defaultSidebarOpen className="bg-background">
      
      <LayoutBody>
        <LayoutSidebar>
          <LayoutMenu groups={sampleGroups} activeItemId="dashboard" searchable />
        </LayoutSidebar>
        <LayoutMain>
          <LayoutHeader>
            <span className="font-semibold">My App</span>
          </LayoutHeader>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Default layout with a left sidebar. Toggle with the header button or Cmd+B.
          </p>
        </LayoutMain>
      </LayoutBody>
      <LayoutFooter>
        <span className="text-muted-foreground text-xs">© 2025 Acme Inc.</span>
      </LayoutFooter>
    </Layout>
  ),
};

/** Sidebar on the right using `side="right"`. */
export const RightSidebar: Story = {
  render: () => (
    <Layout defaultSidebarOpen className="bg-background">
      <LayoutHeader>
        <span className="font-semibold">Right sidebar</span>
      </LayoutHeader>
      <LayoutBody>
        <LayoutMain>
          <p className="text-muted-foreground">
            Pass <code>side="right"</code> to <code>LayoutSidebar</code> to place it on the right.
          </p>
        </LayoutMain>
        <LayoutSidebar side="right">
          <LayoutMenu groups={sampleGroups} activeItemId="users" searchable />
        </LayoutSidebar>
      </LayoutBody>
    </Layout>
  ),
};

/** Starts collapsed — only icons visible with tooltips. Click header button to expand. */
export const CollapsedByDefault: Story = {
  render: () => (
    <Layout defaultSidebarOpen={false} className="bg-background">
      <LayoutHeader>
        <span className="font-semibold">Collapsed sidebar</span>
      </LayoutHeader>
      <LayoutBody>
        <LayoutSidebar>
          <LayoutMenu groups={sampleGroups} activeItemId="dashboard" searchable />
        </LayoutSidebar>
        <LayoutMain>
          <p className="text-muted-foreground">
            Sidebar starts collapsed showing only icons. Hover an icon to see its tooltip.
            Click the header toggle or press Cmd+B to expand.
          </p>
        </LayoutMain>
      </LayoutBody>
    </Layout>
  ),
};

/** Flat item list without group headers. */
export const FlatItems: Story = {
  render: () => (
    <Layout defaultSidebarOpen className="bg-background">
      <LayoutHeader>
        <span className="font-semibold">Flat menu</span>
      </LayoutHeader>
      <LayoutBody>
        <LayoutSidebar>
          <LayoutMenu items={sampleItems} activeItemId="settings" searchable />
        </LayoutSidebar>
        <LayoutMain>
          <p className="text-muted-foreground">
            Pass <code>items</code> instead of <code>groups</code> for a flat list without section headers.
          </p>
        </LayoutMain>
      </LayoutBody>
    </Layout>
  ),
};

/** Active item tracking — click items to navigate. */
export const ActiveItemTracking: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("dashboard");
    return (
      <Layout defaultSidebarOpen className="bg-background">
        <LayoutHeader>
          <span className="font-semibold">Active: {activeId}</span>
        </LayoutHeader>
        <LayoutBody>
          <LayoutSidebar>
            <LayoutMenu
              items={sampleItems}
              activeItemId={activeId}
              searchable
              onItemClick={(item) => {
                if (!item.children?.length) setActiveId(item.id);
              }}
            />
          </LayoutSidebar>
          <LayoutMain>
            <p className="text-muted-foreground">
              Click a leaf menu item to change the active state. The current active item
              is <strong>{activeId}</strong>.
            </p>
          </LayoutMain>
        </LayoutBody>
      </Layout>
    );
  },
};

/** Custom styling for menu items and active state using className props. */
export const CustomMenuStyles: Story = {
  render: () => (
    <Layout defaultSidebarOpen className="bg-background">
      <LayoutHeader>
        <span className="font-semibold">Custom styles</span>
      </LayoutHeader>
      <LayoutBody>
        <LayoutSidebar>
          <LayoutMenu
            groups={sampleGroups}
            activeItemId="users"
            searchable
            menuItemClassName="hover:bg-primary/10 hover:text-primary"
            activeItemClassName="bg-primary text-primary-foreground"
          />
        </LayoutSidebar>
        <LayoutMain>
          <p className="text-muted-foreground">
            Use <code>menuItemClassName</code> and <code>activeItemClassName</code> to
            customise hover/focus and active colours.
          </p>
        </LayoutMain>
      </LayoutBody>
    </Layout>
  ),
};

/** Sidebar with search enabled — type to filter menu items. */
export const Searchable: Story = {
  render: () => (
    <Layout defaultSidebarOpen className="bg-background">
      <LayoutHeader>
        <span className="font-semibold">Searchable sidebar</span>
      </LayoutHeader>
      <LayoutBody>
        <LayoutSidebar>
          <LayoutMenu groups={sampleGroups} activeItemId="dashboard" searchable />
        </LayoutSidebar>
        <LayoutMain>
          <p className="text-muted-foreground">
            Pass <code>searchable</code> to <code>LayoutMenu</code> to show a search
            input at the top of the sidebar. Type to filter menu items in real time.
          </p>
        </LayoutMain>
      </LayoutBody>
    </Layout>
  ),
};

/** Sidebar without search — clean navigation only. */
export const NoSearch: Story = {
  render: () => (
    <Layout defaultSidebarOpen className="bg-background">
      <LayoutBody>
        <LayoutSidebar>
          <LayoutMenu groups={sampleGroups} activeItemId="dashboard" />
        </LayoutSidebar>
        <LayoutMain>
          <LayoutHeader>
            <span className="font-semibold">No search</span>
          </LayoutHeader>
          <p className="text-muted-foreground">
            Without the <code>searchable</code> prop, the sidebar shows only the
            menu items with no search input.
          </p>
        </LayoutMain>
      </LayoutBody>
    </Layout>
  ),
};

/** Header placed inside LayoutMain so it only spans the content area. */
export const InsetHeader: Story = {
  render: () => (
    <Layout defaultSidebarOpen className="bg-background">
      <LayoutBody>
        <LayoutSidebar>
          <LayoutMenu groups={sampleGroups} searchable />
        </LayoutSidebar>
        <LayoutMain>
          <LayoutHeader>
            <span className="font-semibold">Inset header</span>
            <Button variant="outline" size="sm" className="ml-auto">
              Action
            </Button>
          </LayoutHeader>
          <p className="mt-4 text-muted-foreground">
            Place <code>LayoutHeader</code> inside <code>LayoutMain</code> so it
            only spans the content area, not the sidebar.
          </p>
        </LayoutMain>
      </LayoutBody>
    </Layout>
  ),
};

/** Sidebar with header and footer sections. */
export const SidebarWithFooter: Story = {
  render: () => (
    <Layout defaultSidebarOpen className="bg-background">
      <LayoutBody>
        <LayoutSidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
                A
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold">Acme Inc.</span>
                <span className="text-xs text-muted-foreground">Enterprise</span>
              </div>
            </div>
          </SidebarHeader>
          <LayoutMenu groups={sampleGroups} activeItemId="dashboard" searchable />
          <SidebarFooter>
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                JD
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-muted-foreground">john@acme.com</span>
              </div>
            </div>
          </SidebarFooter>
        </LayoutSidebar>
        <LayoutMain>
          <LayoutHeader>
            <span className="font-semibold">Sidebar header &amp; footer</span>
          </LayoutHeader>
          <p className="mt-4 text-muted-foreground">
            Use <code>SidebarHeader</code> and <code>SidebarFooter</code> inside{" "}
            <code>LayoutSidebar</code> to add branding at the top and user info at the bottom.
            These sections stay fixed while the menu scrolls.
          </p>
        </LayoutMain>
      </LayoutBody>
    </Layout>
  ),
};

/**
 * Toggle the sidebar from external code using WordPress hooks.
 *
 * ```ts
 * import { doAction } from "@wordpress/hooks";
 * doAction("myapp_layout_toggle");
 * ```
 */
export const WordPressHooks: Story = {
  render: () => (
    <div className="">
      <div className="border-b bg-muted/40 p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => doAction("myapp_layout_toggle")}
        >
          External toggle via doAction
        </Button>
      </div>
      <Layout defaultSidebarOpen namespace="myapp" className="bg-background">
       
        <LayoutBody>
          <LayoutSidebar>
            <LayoutMenu groups={sampleGroups} searchable />
          </LayoutSidebar>
          <LayoutMain>
             <LayoutHeader>
              <span className="font-semibold">WordPress hooks</span>
            </LayoutHeader>
            <p className="text-muted-foreground">
              The button above lives outside the Layout tree but toggles the sidebar
              via <code>doAction("myapp_layout_toggle")</code>. Set the <code>namespace</code> prop
              on Layout to control the hook name.
            </p>
          </LayoutMain>
        </LayoutBody>
      </Layout>
    </div>
  ),
};
