import type { Meta, StoryFn } from "@storybook/react";
import { SlotFillProvider } from "@wordpress/components";
import { Archive, Eye, Pencil, Trash2, UserCheck, Users, UserX } from "lucide-react";
import React, { useState } from "react";
import { Badge, Input } from "../ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DataViews, type DataViewAction, type DataViewField, type DataViewFilterField, type DataViewState } from "./dataviews";

// Sample data type
interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: string;
  joinedAt: string;
}

// Generate sample data
const generateUsers = (count: number): User[] => {
  const statuses: User["status"][] = ["active", "inactive", "pending"];
  const roles = ["Admin", "Editor", "Viewer", "Manager"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: statuses[i % 3],
    role: roles[i % 4],
    joinedAt: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString(),
  }));
};

const allUsers = generateUsers(100);

// Field definitions
const fields: DataViewField<User>[] = [
  {
    id: "name",
    label: "Name",
    render: ({ item }) => (
      <div className="font-medium text-foreground">{item.name}</div>
    ),
    getValue: ({ item }) => item.name,
  },
  {
    id: "email",
    label: "Email",
    render: ({ item }) => (
      <span className="text-muted-foreground">{item.email}</span>
    ),
    getValue: ({ item }) => item.email,
  },
  {
    id: "status",
    label: "Status",
    render: ({ item }) => {
      const statusVariants = {
        active: "success",
        inactive: "secondary",
        pending: "warning",
      } as const;
      return (
        <Badge variant={statusVariants[item.status]}>
          {item.status.at(0)?.toUpperCase() + item.status.slice(1)}
        </Badge>
      );
    },
    getValue: ({ item }) => item.status,
  },
  {
    id: "role",
    label: "Role",
    render: ({ item }) => <span>{item.role}</span>,
    getValue: ({ item }) => item.role,
  },
  {
    id: "joinedAt",
    label: "Joined At",
    render: ({ item }) => (
      <span className="text-muted-foreground">{item.joinedAt}</span>
    ),
    getValue: ({ item }) => item.joinedAt,
  },
];

// Actions
const actions: DataViewAction<User>[] = [
  {
    id: "view",
    label: "View",
    icon: <Eye size={16} />,
    callback: (items) => {
      alert(`Viewing: ${items.map(i => i.name).join(", ")}`);
    },
  },
  {
    id: "edit",
    label: "Edit",
    icon: <Pencil size={16} />,
    callback: (items) => {
      alert(`Editing: ${items.map(i => i.name).join(", ")}`);
    },
  },
  {
    id: "delete",
    label: "Delete",
    icon: <Trash2 size={16} />,
    supportsBulk: true,
    callback: (items) => {
      alert(`Deleting: ${items.map(i => i.name).join(", ")}`);
    },
  },
];

// Helper to create default view state
const createDefaultView = (fieldsToShow: string[] = ["name", "email", "status", "role"]): DataViewState => ({
  type: "table",
  page: 1,
  perPage: 10,
  fields: fieldsToShow,
});

// Helper to paginate data
const paginateData = (data: User[], view: DataViewState) => {
  const page = view.page ?? 1;
  const perPage = view.perPage ?? 10;
  return data.slice((page - 1) * perPage, page * perPage);
};

// Helper to calculate total pages
const getTotalPages = (totalItems: number, perPage: number = 10) => Math.ceil(totalItems / perPage);

const meta: Meta<typeof DataViews> = {
  title: "WordPress/DataViews",
  component: DataViews,
  decorators: [
    (Story) => (
      <SlotFillProvider>
        <Story />
      </SlotFillProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A powerful data table component built on top of WordPress DataViews with responsive layouts, filtering, tabs, pagination, and bulk actions support.

## Required prop: \`namespace\`

Every \`DataViews\` instance must receive a \`namespace\` string. It is used for:

- **Slots**: Renders \`{snake_namespace}_dataviews-before\` and \`{snake_namespace}_dataviews-after\` so host apps can inject content via \`Fill\`.
- **Filter hooks** (when \`wp.hooks\` exists): Table elements can be filtered with \`{snake_namespace}_dataviews_data\`, \`{snake_namespace}_dataviews_view\`, \`{snake_namespace}_dataviews_fields\`, \`{snake_namespace}_dataviews_actions\`, \`{snake_namespace}_dataviews_layouts\`.

## Features
- **Pagination**: Built-in pagination with customizable page size
- **Responsive**: Automatically switches to list view on mobile
- **Tabs**: Support for tabbed navigation
- **Filters**: Dynamic filter system with add/remove filters
- **Bulk Actions**: Select multiple items and perform bulk operations
- **Actions**: Row-level actions (view, edit, delete, etc.)
- **Empty State**: Customizable empty state display
- **Loading State**: Built-in loading indicator
- **Extensibility**: Before/after Slots and WordPress filter hooks (\`{namespace}_dataviews_*\`)
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    namespace: {
      description: "Required. Used for Slots (before/after table) and WordPress filter hook names.",
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
  },
};

export default meta;

/** Basic DataViews table with pagination. Click through pages to see pagination in action. */
export const BasicWithPagination: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView(["name", "email", "status", "role", "joinedAt"]));

  const paginatedData = paginateData(allUsers, view);

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        paginationInfo={{
          totalItems: allUsers.length,
          totalPages: getTotalPages(allUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
      />
    </div>
  );
};
BasicWithPagination.storyName = "Basic with Pagination";

/** DataViews with row actions (view, edit, delete). Hover over rows to see actions. */
export const WithActions: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());

  const paginatedData = paginateData(allUsers, view);

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        actions={actions}
        paginationInfo={{
          totalItems: allUsers.length,
          totalPages: getTotalPages(allUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
      />
    </div>
  );
};
WithActions.storyName = "With Actions";

/** DataViews with selection and bulk actions. Select items and use bulk delete. */
export const WithBulkSelection: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());
  const [selection, setSelection] = useState<string[]>([]);

  const paginatedData = paginateData(allUsers, view);

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        actions={actions}
        selection={selection}
        onChangeSelection={setSelection}
        paginationInfo={{
          totalItems: allUsers.length,
          totalPages: getTotalPages(allUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
      />
    </div>
  );
};
WithBulkSelection.storyName = "With Bulk Selection";

/** DataViews with tabs for filtering by status. */
export const WithTabs: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());
  const [activeTab, setActiveTab] = useState("all");

  const filteredUsers = activeTab === "all"
    ? allUsers
    : allUsers.filter(user => user.status === activeTab);

  const paginatedData = paginateData(filteredUsers, view);

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        actions={actions}
        paginationInfo={{
          totalItems: filteredUsers.length,
          totalPages: getTotalPages(filteredUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
        tabs={{
          tabs: [
            { label: "All", value: "all", icon: Users },
            { label: "Active", value: "active", icon: UserCheck },
            { label: "Inactive", value: "inactive", icon: UserX },
            { label: "Pending", value: "pending", icon: Archive },
          ],
          initialTab: "all",
          onSelect: (value) => {
            setActiveTab(value);
            setView(prev => ({ ...prev, page: 1 }));
          },
        }}
      />
    </div>
  );
};
WithTabs.storyName = "With Tabs";

/** DataViews with dynamic filters. Click "Add Filter" to add filters. */
export const WithFilters: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());
  const [activeTab, setActiveTab] = useState("all");
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  let filteredUsers = activeTab === "all"
    ? allUsers
    : allUsers.filter(user => user.status === activeTab);

  if (nameFilter) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }

  if (statusFilter) {
    filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
  }

  const paginatedData = paginateData(filteredUsers, view);

  const filterFields: DataViewFilterField[] = [
    {
      id: "name",
      label: "Name",
      field: (
        <Input
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => {
            setNameFilter(e.target.value);
            setView(prev => ({ ...prev, page: 1 }));
          }}
          className="w-48"
        />
      ),
    },
    {
      id: "status",
      label: "Status",
      field: (
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value ?? "");
            setView(prev => ({ ...prev, page: 1 }));
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        actions={actions}
        paginationInfo={{
          totalItems: filteredUsers.length,
          totalPages: getTotalPages(filteredUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
        tabs={{
          tabs: [
            { label: "All", value: "all", icon: Users },
            { label: "Active", value: "active", icon: UserCheck },
            { label: "Inactive", value: "inactive", icon: UserX },
          ],
          initialTab: "all",
          onSelect: (value) => {
            setActiveTab(value);
            setView(prev => ({ ...prev, page: 1 }));
          },
        }}
        filter={{
          fields: filterFields,
          onReset: () => {
            setNameFilter("");
            setStatusFilter("");
            setView(prev => ({ ...prev, page: 1 }));
          },
          onFilterRemove: (filterId) => {
            if (filterId === "name") setNameFilter("");
            if (filterId === "status") setStatusFilter("");
            setView(prev => ({ ...prev, page: 1 }));
          },
        }}
      />
    </div>
  );
};
WithFilters.storyName = "With Filters";

/** DataViews with search functionality enabled. */
export const WithSearch: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());

  const searchTerm = view.search ?? "";
  const filteredUsers = searchTerm
    ? allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allUsers;

  const paginatedData = paginateData(filteredUsers, view);

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        search
        searchPlaceholder="Search by name or email..."
        paginationInfo={{
          totalItems: filteredUsers.length,
          totalPages: getTotalPages(filteredUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
      />
    </div>
  );
};
WithSearch.storyName = "With Search";

/** DataViews with tabs, search in header slot, and one filter (Status). */
export const WithSearchInHeaderSlot: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("");

  const searchTerm = view.search ?? "";
  let filteredUsers = activeTab === "all"
    ? allUsers
    : allUsers.filter(user => user.status === activeTab);

  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (statusFilter) {
    filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
  }

  const paginatedData = paginateData(filteredUsers, view);

  const filterFields: DataViewFilterField[] = [
    {
      id: "status",
      label: "Status",
      field: (
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value ?? "");
            setView(prev => ({ ...prev, page: 1 }));
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        search
        searchPlaceholder="Search by name or email..."
        actions={actions}
        paginationInfo={{
          totalItems: filteredUsers.length,
          totalPages: getTotalPages(filteredUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
        tabs={{
          tabs: [
            { label: "All", value: "all", icon: Users },
            { label: "Active", value: "active", icon: UserCheck },
            { label: "Inactive", value: "inactive", icon: UserX },
            { label: "Pending", value: "pending", icon: Archive },
          ],
          initialTab: "all",
          onSelect: (value) => {
            setActiveTab(value);
            setView(prev => ({ ...prev, page: 1 }));
          },
        }}
        filter={{
          fields: filterFields,
          onReset: () => {
            setStatusFilter("");
            setView(prev => ({ ...prev, page: 1 }));
          },
          onFilterRemove: (filterId) => {
            if (filterId === "status") {
              setStatusFilter("");
              setView(prev => ({ ...prev, page: 1 }));
            }
          },
        }}
      />
    </div>
  );
};
WithSearchInHeaderSlot.storyName = "With Search in Header Slot";

/** DataViews showing empty state when no data is available. */
export const EmptyState: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={[]}
        fields={fields}
        view={view}
        onChangeView={setView}
        paginationInfo={{
          totalItems: 0,
          totalPages: 0,
        }}
        getItemId={(item) => item.id}
        emptyTitle="No users found"
        emptyDescription="Try adjusting your search or filter to find what you're looking for."
      />
    </div>
  );
};
EmptyState.storyName = "Empty State";

/** DataViews in loading state. */
export const Loading: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={[]}
        fields={fields}
        view={view}
        onChangeView={setView}
        isLoading={true}
        paginationInfo={{
          totalItems: 0,
          totalPages: 0,
        }}
        getItemId={(item) => item.id}
      />
    </div>
  );
};
Loading.storyName = "Loading State";

/** Complete example with all features: tabs, filters, search, selection, and pagination. */
export const FullFeatured: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView(["name", "email", "status", "role", "joinedAt"]));
  const [selection, setSelection] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Apply tab filter
  let filteredUsers = activeTab === "all"
    ? allUsers
    : allUsers.filter(user => user.status === activeTab);

  // Apply search
  const searchTerm = view.search ?? "";
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply name filter
  if (nameFilter) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }

  // Apply role filter
  if (roleFilter) {
    filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
  }

  const paginatedData = paginateData(filteredUsers, view);

  const filterFields: DataViewFilterField[] = [
    {
      id: "name",
      label: "Name",
      field: (
        <Input
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => {
            setNameFilter(e.target.value);
            setView(prev => ({ ...prev, page: 1 }));
          }}
          className="w-48"
        />
      ),
    },
    {
      id: "role",
      label: "Role",
      field: (
        <Select
          value={roleFilter}
          onValueChange={(value) => {
            setRoleFilter(value ?? "");
            setView(prev => ({ ...prev, page: 1 }));
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Editor">Editor</SelectItem>
            <SelectItem value="Viewer">Viewer</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        search
        searchPlaceholder="Search by name or email..."
        actions={actions}
        selection={selection}
        onChangeSelection={setSelection}
        paginationInfo={{
          totalItems: filteredUsers.length,
          totalPages: getTotalPages(filteredUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
        tabs={{
          tabs: [
            { label: "All Users", value: "all", icon: Users },
            { label: "Active", value: "active", icon: UserCheck },
            { label: "Inactive", value: "inactive", icon: UserX },
            { label: "Pending", value: "pending", icon: Archive },
          ],
          initialTab: "all",
          onSelect: (value) => {
            setActiveTab(value);
            setSelection([]);
            setView(prev => ({ ...prev, page: 1 }));
          },
        }}
        filter={{
          fields: filterFields,
          onReset: () => {
            setNameFilter("");
            setRoleFilter("");
            setView(prev => ({ ...prev, page: 1 }));
          },
          onFilterRemove: (filterId) => {
            if (filterId === "name") setNameFilter("");
            if (filterId === "role") setRoleFilter("");
            setView(prev => ({ ...prev, page: 1 }));
          },
        }}
      />
    </div>
  );
};
FullFeatured.storyName = "Full Featured";

/** Different page sizes with pagination. Use view controls to change perPage. */
export const DifferentPageSizes: StoryFn = () => {
  const [view, setView] = useState<DataViewState>({
    ...createDefaultView(["name", "email", "status"]),
    perPage: 5,
  });

  const paginatedData = paginateData(allUsers, view);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Items per page:</span>
        <select
          value={String(view.perPage ?? 10)}
          onChange={(e) => setView(prev => ({ ...prev, perPage: Number(e.target.value), page: 1 }))}
        >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
        </select>
      </div>
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields.filter(f => ["name", "email", "status"].includes(f.id))}
        view={view}
        onChangeView={setView}
        paginationInfo={{
          totalItems: allUsers.length,
          totalPages: getTotalPages(allUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
      />
    </div>
  );
};
DifferentPageSizes.storyName = "Different Page Sizes";
